# Salesforce Initial Data Sync

This integration demonstrates how to perform an initial data sync of a large Salesforce data set into a PostgreSQL database in manageable batches when an instance is deployed. It showcases the `batchFlowTrigger` pattern, cursor-based pagination across batches, concurrent batch processing, and a configuration wizard that lets each customer choose which Salesforce object and fields to sync.

## What this integration does

When an instance is deployed, this integration backfills lead records from Salesforce into a PostgreSQL database. It queries Salesforce 200 records at a time, tracking its position in the data set with a cursor so that each subsequent backfill picks up where the last one left off, until there are no more records to fetch. Fetched records are normalized into a common shape and inserted into the database in batches.

The Salesforce object to sync, and the fields to pull from it, are chosen by the customer during configuration — so the same integration can sync standard `Lead` records or a custom object without any code changes.

> This integration also continues to process new leads in real time via webhook after the initial sync completes. That functionality is intentionally out of scope for this document, which focuses on the initial data import.

## Key features

### Initial data sync on deployment

The integration uses a `batchFlowTrigger` whose `onDeploy` function runs when an instance is initially deployed to a customer. This function queries a page of records from Salesforce and returns them for processing:

```typescript
const response = await sfdcClient.query(
  `SELECT ${fieldsToSelect} FROM ${leadRecordType} ${whereClause} ORDER BY Id ASC LIMIT ${SALESFORCE_BATCH_SIZE}`,
);
```

On the very first run it also creates the destination table. The `onDeploy` function returns both the fetched `items` and a `paginationState` cursor. Prismatic calls `onDeploy` repeatedly, passing the previous `paginationState` back in on each call, until no more records are returned — signaling that the initial sync is complete. This lets large data sets sync incrementally without loading everything into memory at once.

### Cursor-based pagination

The `paginationState` cursor tracks the integration's position in the data set across multiple backfill calls. Because the query orders records by `Id`, the cursor stores the last `Id` processed and the next page fetches only records beyond it:

```typescript
const startId = payload.paginationState?.lastId;
const whereClause = startId ? `WHERE Id > '${startId}'` : "";
```

When a page returns records, the cursor advances to the last `Id` in that page. When a page returns no records, `paginationState` is set to `undefined` to indicate that there is no more data to sync.

### Concurrent batch processing

The flow's `batchConfig` controls how fetched records are handed off to `onExecution`:

```typescript
batchConfig: { batchSize: PROCESS_BATCH_SIZE, concurrentBatchLimit: 3 },
```

- **`batchSize: 50`** — `onExecution` is invoked once for every 50 records, so it receives an array of up to 50 records at a time rather than the full page.
- **`concurrentBatchLimit: 3`** — up to 3 batches (150 records) can be processed concurrently. Additional batches wait until a processing slot becomes available.

This lets you tune throughput against the rate limits and resource constraints of your destination database.

### Configurable record type and field mapping

The configuration wizard ([src/configPages.ts](src/configPages.ts)) uses data sources to let each customer tailor the sync without code changes:

- **Lead Record Type** — lists the queryable Salesforce objects in the customer's org so they can pick which one to sync (defaulting to `Lead`).
- **Field Mapping** — lists the fields on the selected object so the customer can map their org's name, email, and phone fields to the integration's expected fields.

Each fetched record is then normalized into a common `StandardizedLead` shape based on that mapping, so downstream logic is independent of how any individual org names its fields.

### Writing to PostgreSQL

The `onExecution` function receives each batch, validates it with a [Zod](https://zod.dev/) schema, and bulk-inserts the records into the `imported_leads` table:

```typescript
const leads = StandardizedLeadArray.parse(params.onTrigger.results.body.data);
await insertLeadsIntoDatabase(
  leads,
  context.configVars["PostgreSQL Connection"],
);
```

## Integration structure

Beyond the standard integration files, this integration contains the following key files:

- [src/flows.ts](src/flows.ts) - Defines the "Sync Salesforce Leads" flow, including the `batchFlowTrigger` with `onDeploy` (initial sync) and `onExecution` (batch processing into PostgreSQL)
- [src/configPages.ts](src/configPages.ts) - Defines the configuration wizard: the Salesforce and PostgreSQL connections, the record type picker, and the field mapping
- [src/sfdcClient.ts](src/sfdcClient.ts) - Creates a [jsforce](https://jsforce.github.io/) Salesforce client from the customer's connection
- [src/util/salesforce.ts](src/util/salesforce.ts) - Normalizes Salesforce records into the common `StandardizedLead` shape
- [src/util/postgres.ts](src/util/postgres.ts) - Creates the destination table and bulk-inserts records
- [src/util/types.ts](src/util/types.ts) - Defines the `StandardizedLead` schema and related types

## Flow details

### Sync Salesforce Leads Flow

The [flows.ts](src/flows.ts) flow demonstrates the initial-sync pattern. During the initial import this flow:

1. On the first deployment, creates the `imported_leads` table in the customer's database
2. Queries the configured Salesforce object 200 records at a time via `onDeploy`, selecting the mapped fields
3. Advances a `paginationState` cursor to the last `Id` in each page, repeating until no more records are returned
4. Hands fetched records to `onExecution` in batches of 50, processing up to 3 batches concurrently
5. Normalizes each record to a `StandardizedLead`, validates the batch with Zod, and bulk-inserts it into PostgreSQL

## Testing the integration

You can test this integration in Prismatic.

First build and import the integration:

```bash
npm run build
prism integrations:import --open
```

Then:

1. Configure a test instance, supplying a Salesforce connection and a PostgreSQL connection
2. Choose the Salesforce object to sync and map its name, email, and phone fields
3. Deploy the integration

On deployment, the initial data sync will run automatically, querying Salesforce in batches and inserting records into your database. Review the execution logs to see each batch being processed, and query the `imported_leads` table to confirm the records arrived.

### Running a local PostgreSQL database

If you don't already have a PostgreSQL instance to sync into, the included [docker-compose.yml](docker-compose.yml) starts one locally, alongside a [Prismatic on-prem agent](https://prismatic.io/docs/on-prem-agent/) that lets Prismatic reach it without exposing the database to the internet.

The on-prem agent registers itself with a JWT. Generate one with the [Prism CLI](https://prismatic.io/docs/cli/) and start the services:

```bash
export PRISMATIC_ONPREM_REGISTRATION_JWT=$(prism on-prem-resources:registration-jwt)
docker compose up
```

Then, when configuring the PostgreSQL connection on your test instance, supply the credentials from [docker-compose.yml](docker-compose.yml) (database `my-db`, user `my-user`, password `my-pass`) and select the on-prem resource the agent registered.

Alternatively, skip the agent entirely and point the PostgreSQL connection at any publicly reachable PostgreSQL instance.

## Extending this integration

This integration provides a solid foundation that can be extended in several ways:

### Syncing a different object or additional fields

1. The record type picker and field mapping in [configPages.ts](src/configPages.ts) already let customers choose the object and map fields at configuration time
2. To sync more than name, email, and phone, add fields to the `Field Mapping` data source, the `fieldsToSelect` list in `onDeploy`, the `StandardizedLead` schema in [types.ts](src/util/types.ts), and the table schema in [postgres.ts](src/util/postgres.ts)

### Adjusting pagination and batching

1. Tune the `LIMIT` in the SOQL query in `onDeploy` to balance throughput against Salesforce API limits
2. Adjust `batchSize` to control how many records `onExecution` receives at once
3. Adjust `concurrentBatchLimit` to control how many batches insert into the database in parallel

### Writing to a different destination

1. Replace the PostgreSQL helpers in [postgres.ts](src/util/postgres.ts) with calls to your destination system (a different database, data warehouse, CRM, etc.)
2. Add idempotency checks (such as an upsert keyed on `external_id`) so that re-syncs don't create duplicate records
