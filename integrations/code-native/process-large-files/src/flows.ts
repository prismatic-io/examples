import { GetObjectCommand } from "@aws-sdk/client-s3";
import { flow } from "@prismatic-io/spectral";
import stream from "node:stream";
import { from as copyFrom } from "pg-copy-streams";
import unzip, { Entry } from "unzip-stream";
import { createS3Client } from "./awsClient";
import { getPostgresClient } from "./pgClient";

// Hard-code the file to fetch from S3 for this flow
const FILE_TO_FETCH = "medium.zip";

export const processZipFile = flow({
  name: "Process Zip File",
  stableKey: "process-zip-file",
  description:
    "Fetch a zip file containing multiple CSV files from S3 and process each file individually using streams.",
  schedule: { configVar: "Process Schedule" },
  onExecution: async (context, params) => {
    // Initialize AWS S3 client
    const s3Client = createS3Client(
      context.configVars["S3 Connection"],
      context.configVars["AWS Region"]
    );

    // Initialize PostgreSQL client
    const postgresClient = await getPostgresClient(
      context.configVars["PostgreSQL Connection"]
    );

    // Fetch the zip file from S3
    const command = new GetObjectCommand({
      Bucket: context.configVars["S3 Bucket Name"],
      Key: FILE_TO_FETCH,
    });
    const s3Result = await s3Client.send(command);
    const s3ReadStream = s3Result.Body as stream.Readable;

    // Pipe the S3 read stream into the unzip parser
    const unzipStream = s3ReadStream.pipe(unzip.Parse());

    let processingError: Error | undefined;

    // Track the files found in the zip so they can be attached to the log section
    const processedFiles: string[] = [];

    // Group logs related to processing the zip file into a section. CSV files
    // are processed concurrently, so a single section is used rather than one
    // per file (sections cannot be nested or interleaved).
    context.logger.section("Process zip file");

    // When debug mode is enabled, log memory usage at key points
    context.debug.memoryUsage(context, "Starting zip file processing");

    try {
      await new Promise<void>((resolve, reject) => {
        // Array to hold promises for each file parsing
        // We don't want to resolve the main promise until all files are processed
        const parsePromises: Promise<void>[] = [];

        // Handle the end of the unzip stream
        unzipStream.on("close", async () => {
          try {
            // Wait for all CSV parsing to complete
            await Promise.all(parsePromises);
            context.logger.debug("All files processed");
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        // Handle errors from the unzip stream
        unzipStream.on("error", (error) => reject(error));

        // For each entry (file) in the zip file, ingest it into PostgreSQL
        unzipStream.on("entry", (entry: Entry) => {
          context.logger.debug(`Processing file: ${entry.path}`);
          context.debug.memoryUsage(context, `Processing file ${entry.path}`);

          const parsePromise = new Promise<void>(
            (resolveEntry, rejectEntry) => {
              try {
                // Handle errors when processing CSV file
                entry.on("error", (error) => rejectEntry(error));

                // Stream the CSV data into PostgreSQL using COPY
                const stream = postgresClient
                  .query(
                    copyFrom(
                      `COPY items (id, column1, column2, column3) FROM STDIN WITH CSV HEADER`
                    )
                  )
                  .on("error", (error) => {
                    rejectEntry(error);
                  })
                  .on("finish", () => {
                    processedFiles.push(entry.path);
                    resolveEntry();
                  });

                // Pipe the zip entry (CSV file) into the PostgreSQL COPY stream
                entry.pipe(stream);
              } catch (error) {
                rejectEntry(error);
              }
            }
          );

          // Add promise to array to track completion
          parsePromises.push(parsePromise);
        });
      });
    } catch (error) {
      processingError =
        error instanceof Error ? error : new Error(String(error));
      context.logger.error(
        `Error processing zip file: ${processingError.message}`
      );
    } finally {
      context.logger.sectionEnd({
        label: "Process zip file",
        data: {
          file: FILE_TO_FETCH,
          processedFiles,
          error: processingError?.message,
        },
      });

      // Always close the PostgreSQL client connection
      try {
        await postgresClient.end();
      } catch (endError) {
        context.logger.error(
          `Error closing PostgreSQL connection: ${endError}`
        );
      }
    }

    context.debug.memoryUsage(context, "Finished zip file processing");

    // Re-throw processing error after cleanup
    if (processingError) {
      throw processingError;
    }

    return { data: null };
  },
});

export default [processZipFile];
