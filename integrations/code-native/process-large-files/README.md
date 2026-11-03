# Process Large Files

This integration demonstrates how to efficiently process large files using Node.js streams. On a regular schedule determined by the user, it downloads a zip file that contains several CSV files. It then extracts the CSV files from the zip archive and copies the CSV contents into a PostgreSQL database table.

Files are processed a few kilobytes at a time using Node.js streams, which minimizes memory usage during processing. Despite the `large.zip` file being 559MB zipped (1.3GB unzipped), when the integration runs it uses only about **10MB** of memory (beyond baseline usage). This allows you to stay well within typical [memory limits](https://prismatic.io/docs/integrations/integration-runner-environment-limits/).

## Integration structure

Beyond the standard integration files, this integration contains the following key files:

- `src/awsClient.ts` - Creates and exports an AWS S3 client using the AWS SDK v3.
- `src/pgClient.ts` - Creates and exports a PostgreSQL client using the `pg` library.
- `src/configPages.ts` - Adds connection configuration fields for PostgreSQL and Amazon S3, and several data sources for selecting AWS region and bucket.

## Node.js streams

Node.js streams are a powerful way to handle streaming data, allowing you to process data in chunks rather than loading entire files into memory. This is particularly useful for working with large files, as it helps to minimize memory usage and improve performance.
In this integration, streams are used in `src/flows.ts` to:

1. Download the zip file from S3 using a read stream.
   The result of a `s3Client.send(command)` is a stream that reads the file in chunks.
2. Pipe the read stream into a zip parser to extract individual CSV files.
   We use the [unzip-stream](https://www.npmjs.com/package/unzip-stream) library to parse the zip file as a stream, extracting each CSV file one at a time.
3. For each extracted CSV file, pipe its contents as a stream into a PostgreSQL client using a `COPY FROM STDIN` query.
   We use [pg-copy-streams](https://www.npmjs.com/package/pg-copy-streams) to create a writable stream that feeds data directly into the PostgreSQL database.

## Testing the integration

You can test this integration, both locally and in Prismatic.

### Generating test files

The `create-test-files.cjs` helper script creates three files:

1. `small.zip` which contains 3 CSV files, each with 100 rows. (~8.7KB zipped, 24KB unzipped)
2. `medium.zip` which contains 10 files, each with 100,000 rows. (~28MB zipped, 63MB unzipped)
3. `large.zip` which contains 20 files, each with 1,000,000 rows. (~559MB zipped, 1.3GB unzipped)

To run this script:

```bash
node create-test-files.cjs
```

After generating the files, upload them to your S3 bucket for testing.

### Create a database table

In a PostgreSQL database, create a table to hold the CSV data. You can use the following SQL statement:

```sql
CREATE TABLE items (
  id varchar,
  column1 numeric,
  column2 numeric,
  column3 numeric,
  updated_at timestamp DEFAULT now()
);
```

### Running tests locally

If you'd like to run this flow locally using Jest, copy `.env.example` to `.env.testing` and fill in the required environment variables for connecting to your PostgreSQL database and S3 bucket.

Then run:

```bash
npm run test
```

This will run the Jest tests defined in `src/flows.test.ts`, which test processing of ZIP/CSV files.

### Running tests in Prismatic

To run the integration in Prismatic, first build and import the integration:

```bash
npm run build
prismatic integrations:import --open
```

Then, configure a test instance of your integration and run a test.

## Extending this integration

Most file storage providers (e.g., Google Cloud Storage, Azure Blob Storage, Dropbox, SFTP, etc.) have Node.js SDKs that support streaming downloads. You can swap out the S3 client in `src/awsClient.ts` and the S3 download logic in `src/flows.ts` with your preferred file storage provider while keeping the rest of the integration intact.

In this example we import data, unmodified, into PostgreSQL. If you need to transform the CSV data before importing it, we recommend leveraging the [papaparse](https://www.npmjs.com/package/papaparse) library, which supports streaming parsing of CSV data. You can pipe the extracted CSV file stream into PapaParse, transform the data as needed, and then pipe the transformed data to some destination service. For an example of this, see [Handling Large Files](https://prismatic.io/docs/custom-connectors/handling-large-files-in-custom-components/#streaming-and-processing-a-large-csv-from-amazon-s3).
