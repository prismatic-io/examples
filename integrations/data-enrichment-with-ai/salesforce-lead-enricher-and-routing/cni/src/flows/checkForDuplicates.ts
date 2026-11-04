import { flow } from "@prismatic-io/spectral";

/**
 * Incoming lead data structure
 */
interface IncomingLeadData {
  company: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Salesforce account record structure
 */
interface SalesforceAccount {
  Id: string;
  Name: string;
  Website?: string;
}

/**
 * Salesforce query result structure
 */
interface SalesforceQueryResult {
  data: {
    records: SalesforceAccount[];
  };
}

/**
 * Classification result from OpenAI
 */
interface ClassificationResult {
  branch: string;
  data: {
    selectedBranch: "Duplicate" | "Not a Duplicate";
    confidence: string;
    reasoning: string;
    originalInput: string;
  };
}

/**
 * Lead creation result
 */
interface CreateLeadResult {
  data: any;
}

// Constants
const MODEL = "gpt-5-mini-2025-08-07";
const SALESFORCE_API_VERSION = "63.0";

/**
 * Classification branches for duplicate detection
 */
const CLASSIFICATION_BRANCHES = {
  Duplicate:
    "The name, domain, or firmographics suggest it is a duplicate (>75% confidence)",
  "Not a Duplicate": "The account appears to be unique (>75% confidence)",
};

/**
 * Instructions for the AI classifier
 */
const CLASSIFICATION_INSTRUCTIONS =
  "Analyze the account and possible duplicates. Use all available information to determine if this is a duplicate account.";

/**
 * Check for Duplicates Flow
 *
 * Analyzes incoming leads against existing Salesforce accounts to identify and prevent
 * duplicate entries. Uses AI classification to determine similarity with high confidence.
 */
export const checkForDuplicates = flow({
  name: "Check for Duplicates",
  stableKey: "check-for-duplicates",
  description:
    "Prevent duplicate lead creation by checking against existing Salesforce accounts",
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;
    const incomingLead = params.onTrigger.results.body.data as IncomingLeadData;

    context.logger.info("Processing incoming lead for duplicate check");
    context.logger.debug("Lead details", {
      company: incomingLead.company,
      email: incomingLead.email,
      name: `${incomingLead.firstName} ${incomingLead.lastName}`,
    });

    // Step 1: Query Salesforce for potential duplicate accounts
    context.logger.debug("Querying Salesforce for potential duplicates");
    const findAccounts =
      await context.components.salesforce.query<SalesforceQueryResult>({
        connection: configVars["Salesforce Connection"],
        queryString: `SELECT Id, Name, Website FROM Account
                    WHERE Name like '${incomingLead.company}%'`,
        version: SALESFORCE_API_VERSION,
      });

    context.logger.info(
      `Found ${findAccounts.data.records.length} potential duplicate accounts`,
    );

    // Step 2: Use AI to classify if the lead is a duplicate
    context.logger.debug("Running AI classification for duplicate detection");
    const classification =
      await context.components.openai.classifyAndBranch<ClassificationResult>({
        openaiConnection: configVars["OpenAI Connection"],
        model: MODEL,
        branches: CLASSIFICATION_BRANCHES,
        classificationInstructions: CLASSIFICATION_INSTRUCTIONS,
        inputText: `New Account: ${JSON.stringify(incomingLead)}
                  Existing Accounts: ${JSON.stringify(
                    findAccounts.data.records,
                  )}`,
      });

    context.logger.info(
      `Classification result: ${classification.data.selectedBranch}`,
      {
        confidence: classification.data.confidence,
        reasoning: classification.data.reasoning,
      },
    );

    // Step 3: Route based on classification result
    if (classification.data.selectedBranch === "Not a Duplicate") {
      // Create new lead in Salesforce
      context.logger.info("Creating new lead in Salesforce");
      const createLead =
        await context.components.salesforce.createLead<CreateLeadResult>({
          connection: configVars["Salesforce Connection"],
          company: incomingLead.company,
          email: incomingLead.email,
          firstName: incomingLead.firstName,
          lastName: incomingLead.lastName,
          leadStatus: "Open",
          version: SALESFORCE_API_VERSION,
        });

      context.logger.info("Lead created successfully");
      return { data: createLead };
    } else {
      // Duplicate detected - skip lead creation
      context.logger.warn(
        `Duplicate detected for company: ${incomingLead.company}`,
        {
          email: incomingLead.email,
          existingAccounts: findAccounts.data.records.map((acc) => acc.Name),
        },
      );
      return { data: null };
    }
  },
});

export default checkForDuplicates;
