import { flow } from "@prismatic-io/spectral";

/**
 * Dropbox folder listing result structure
 */
interface DropboxFolderEntry {
  path_lower: string;
  name: string;
}

interface ListImportFolderResult {
  data: {
    result: {
      entries: DropboxFolderEntry[];
    };
  };
}

/**
 * OpenAI file upload response structure
 */
interface OpenAIFileUploadResult {
  data: {
    object: string;
    id: string;
    purpose: string;
    filename: string;
    bytes: number;
    created_at: number;
    expires_at: null;
    status: string;
    status_details: string | null;
  };
}

/**
 * Classification result from the OpenAI agent
 */
interface ClassificationResult {
  branch: string;
  data: {
    selectedBranch: string;
    confidence: string;
    reasoning: string;
    originalInput: string;
  };
}

/**
 * Extracted receipt data structure
 */
interface ExtractedReceipt {
  receiptId: string;
  date: string;
  store: {
    name: string;
    address: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "credit" | "debit" | "other";
}

// Constants for model configuration
const MODELS = {
  CLASSIFICATION: "gpt-5-2025-08-07",
  EXTRACTION: "gpt-5-mini-2025-08-07",
} as const;

const UPLOAD_TIMEOUT_MS = 10000;

/**
 * Receipt extraction JSON schema for structured output
 */
const RECEIPT_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  title: "Receipt",
  required: ["receiptId", "date", "items", "subtotal", "total"],
  properties: {
    receiptId: {
      type: "string",
      description: "Unique identifier for the receipt",
    },
    date: {
      type: "string",
      format: "date-time",
      description: "Date and time of the transaction",
    },
    store: {
      type: "object",
      properties: {
        name: { type: "string" },
        address: { type: "string" },
        phone: { type: "string" },
      },
    },
    items: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["name", "quantity", "price"],
        properties: {
          name: { type: "string" },
          quantity: { type: "number", minimum: 1 },
          price: { type: "number", minimum: 0 },
        },
      },
    },
    subtotal: {
      type: "number",
      minimum: 0,
    },
    tax: {
      type: "number",
      minimum: 0,
    },
    total: {
      type: "number",
      minimum: 0,
    },
    paymentMethod: {
      type: "string",
      enum: ["cash", "credit", "debit", "other"],
    },
  },
};

/**
 * Import Receipts from PDFs Flow
 *
 * This flow automatically processes PDF files from a Dropbox folder,
 * identifies receipts/invoices using AI classification, and extracts
 * structured data from valid documents.
 *
 * The flow runs every 5 minutes and performs the following steps:
 * 1. Lists all files in the configured Dropbox import folder
 * 2. Downloads each PDF file
 * 3. Uploads files to OpenAI for processing
 * 4. Classifies documents to identify receipts/invoices
 * 5. Extracts structured data from valid receipts
 *
 * @returns Extracted receipt data or empty object if no valid receipts found
 */
export const importReceiptsFromPdFs = flow({
  name: "Import Receipts from PDFs",
  stableKey: "import-receipts-from-pd-fs",
  description:
    "Automatically process PDF receipts from Dropbox, classify documents, and extract structured receipt data using AI",
  endpointSecurityType: "customer_optional",
  schedule: {
    value: "*/5 * * * *", // Run every 5 minutes
  },
  onExecution: async (context) => {
    const { configVars } = context;
    const processedReceipts: ExtractedReceipt[] = [];

    // Step 1: List all files in the import folder
    context.logger.info("Listing files in Dropbox import folder");
    const listImportFolder =
      await context.components.dropbox.listFolder<ListImportFolderResult>({
        debug: false,
        dropboxConnection: configVars["Dropbox Connection"],
        path: String(configVars["Import Folder"]),
      });

    if (!listImportFolder?.data?.result?.entries?.length) {
      context.logger.info("No files found in import folder");
      return {
        data: { processedReceipts: [], message: "No files to process" },
      };
    }

    context.logger.info(
      `Found ${listImportFolder.data.result.entries.length} files to process`,
    );

    // Process each file
    for (const file of listImportFolder.data.result.entries) {
      context.logger.info(`Processing file: ${file.name}`);

      // Step 2: Download the file from Dropbox
      const downloadFile = await context.components.dropbox.downloadFile<{
        data: ArrayBuffer;
        contentType: string;
      }>({
        dropboxConnection: configVars["Dropbox Connection"],
        path: file.path_lower,
      });

      // Validate that it's a PDF
      if (downloadFile.contentType !== "application/pdf") {
        context.logger.warn(
          `Skipping non-PDF file: ${file.name} (type: ${downloadFile.contentType})`,
        );
        continue;
      }

      // Step 3: Upload file to OpenAI for processing
      context.logger.debug(`Uploading ${file.name} to OpenAI`);
      const uploadFile =
        await context.components.openai.uploadFile<OpenAIFileUploadResult>({
          connection: configVars["OpenAI Connection"],
          file: downloadFile.data as any,
          filename: file.name,
          purpose: "assistants",
          timeout: String(UPLOAD_TIMEOUT_MS),
        });

      context.logger.debug(
        `File uploaded successfully. ID: ${uploadFile.data.id}`,
      );

      // Step 4: Classify the document to determine if it's a receipt/invoice
      const agentClassifyAndBranch =
        await context.components.openai.classifyAndBranch<ClassificationResult>(
          {
            agentMcpServers: [],
            agentTools: [],
            branches: {
              "Needs Processing":
                "The analyzed file is an invoice or receipt that contains transaction data.",
            },
            classificationInstructions: `Analyze the provided file carefully. Determine if it is an invoice or receipt that should be processed.

A document should be classified as "Needs Processing" if it contains:
- Transaction details (items, prices, totals)
- Vendor/store information
- Date of transaction
- Receipt or invoice number

If the document doesn't contain these elements or you cannot determine its type, return the "Else" branch.
Always return the required output schema with confidence and reasoning.`,
            fileIds: [uploadFile.data.id],
            inputText: `Analyze this PDF file and determine if it's a receipt or invoice that contains extractable transaction data.`,
            model: MODELS.CLASSIFICATION,
            openaiConnection: configVars["OpenAI Connection"],
          },
        );

      context.logger.info(
        `Classification result for ${file.name}: ${agentClassifyAndBranch.branch}`,
        { confidence: agentClassifyAndBranch.data.confidence },
      );

      if (agentClassifyAndBranch.branch === "Needs Processing") {
        // Step 5: Extract structured data from the receipt/invoice
        context.logger.info(`Extracting receipt data from ${file.name}`);

        // Create a specialized agent for PDF data extraction
        const pdfExtractionAgent =
          await context.components.openai.createAgent<any>({
            handoffDescription: "",
            instructions: `You are an expert at analyzing PDFs and extracting receipt and invoice information.

              Your task is to:
              1. Carefully read and analyze the entire document
              2. Extract all transaction details including items, prices, and totals
              3. Identify store/vendor information
              4. Extract dates in ISO format
              5. Ensure all numeric values are accurate
              6. If a receipt ID is not visible, generate one based on the store name and date

              Be thorough and accurate in your extraction.`,
            mcpServers: [],
            modelName: MODELS.EXTRACTION,
            name: "PDF Receipt Data Extractor",
            outputSchema: JSON.stringify(RECEIPT_SCHEMA),
            outputSchemaName: "receipt_data",
            outputSchemaStrict: false,
            tools: [],
          });

        // Run the extraction agent
        const extractedReceipt = await context.components.openai.runAgent<{
          data: { finalOutput: ExtractedReceipt };
        }>({
          agentConfig: pdfExtractionAgent.data,
          maxTurns: "10",
          openaiConnection: configVars["OpenAI Connection"],
          previousResponseId: "",
          fileIds: [uploadFile.data.id],
          userInput: `Please analyze this PDF document and extract all receipt/invoice information according to the provided schema.
              Be thorough in identifying all line items, calculating totals, and extracting vendor information.`,
        });

        if (extractedReceipt?.data?.finalOutput) {
          context.logger.info(
            `Successfully extracted receipt data from ${file.name}`,
            { receiptId: extractedReceipt.data.finalOutput.receiptId },
          );
          processedReceipts.push(extractedReceipt.data.finalOutput);

          // Optional: Move processed file to a different folder or add a processed marker
          // This prevents reprocessing the same file
          context.logger.debug(
            `Consider moving ${file.name} to processed folder`,
          );
        } else {
          context.logger.warn(
            `Failed to extract valid receipt data from ${file.name}`,
          );
        }
      } else {
        context.logger.info(`Skipping ${file.name} - not a receipt/invoice`, {
          reasoning: agentClassifyAndBranch.data.reasoning,
        });
      }
    }

    // Return summary of processed receipts
    return {
      data: {
        processedReceipts,
        summary: {
          totalProcessed: processedReceipts.length,
          totalFiles: listImportFolder.data.result.entries.length,
          success: true,
        },
      },
    };
  },
});

export default importReceiptsFromPdFs;
