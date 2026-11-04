# PostgreSQL Polling Trigger

This integration demonstrates how to build a polling trigger that monitors a PostgreSQL table for new records and processes them on a schedule. It showcases polling state management, dynamic table selection, cursor-based incremental data fetching, and transactional safety.

## What this integration does

This integration polls a PostgreSQL table every minute and processes new records that have been created since the last poll. It uses cursor-based polling with the `created_at` timestamp to efficiently track which records have already been processed.

Additionally, the integration automatically creates a metadata table (`acme_post_metadata`) during deployment to track supplementary information like the number of likes each post has received.
This is to demonstrate how to perform setup operations when an instance is deployed.

The integration is configurable through a multi-step configuration wizard that allows customers to:

1. Configure their PostgreSQL database connection
2. Select any table from a dropdown of available tables in the database

## Key features

### Cursor-based polling with state management

The integration uses Prismatic's built-in polling state management to track the last `created_at` timestamp of processed records. On each poll:

1. Retrieves the last known `created_at` timestamp from the polling state
2. Queries for records with a `created_at` greater than the stored timestamp
3. Updates the polling state with the maximum `created_at` from the current poll
4. Returns `polledNoChanges: true` when no new records are found (preventing unnecessary executions)

This approach ensures that:

- Records are never processed twice
- The integration efficiently handles incremental data
- Database queries are optimized to only fetch new records
- The polling state is maintained reliably between executions

### Dynamic table selection

Rather than hardcoding a specific table to poll, users can select from **any** table in their PostgreSQL database during configuration. The [configPages.ts](src/configPages.ts) data source queries PostgreSQL's `information_schema.tables` to populate a dropdown with available tables, excluding system tables.

Users see tables listed by their fully qualified name (e.g., `public.posts`, `myschema.users`) and can select any table that has a `created_at` timestamp column.

### Transactional safety

The integration wraps database operations in transactions using PostgreSQL's `BEGIN`/`ROLLBACK` commands. This ensures that if an error occurs while fetching new records or updating the polling cursor, the transaction is rolled back and the polling state remains consistent.

The [flows.ts](src/flows.ts) implementation uses a try/catch/finally block to:

1. Begin a transaction before querying for new records
2. Roll back the transaction if any errors occur
3. Always close the database connection in the finally block

This pattern prevents data inconsistencies and ensures reliable polling behavior.

### Initial poll handling

On the first poll (when no polling state exists), the integration:

1. Detects that no previous state is available
2. Logs that this is an initial poll
3. Sets the cursor to the maximum `created_at` in the table
4. Returns `polledNoChanges: true` to skip execution
5. Will begin processing new records on subsequent polls

This prevents the integration from processing all historical records on first activation and ensures it only processes records created after activation.

### Automatic schema management on deployment

The integration uses the `onInstanceDeploy` lifecycle hook to automatically create required database tables when an instance is deployed. Specifically, it creates an `acme_post_metadata` table.

This approach ensures that the database schema is properly initialized without requiring manual database setup by the customer.

## Integration structure

Beyond the standard integration files, this integration contains the following key files:

- [src/postgresClient.ts](src/postgresClient.ts) - Creates and exports a PostgreSQL client using the `pg` library
- [src/configPages.ts](src/configPages.ts) - Defines a multi-step configuration wizard with PostgreSQL connection setup and dynamic table selection
- [src/flows.ts](src/flows.ts) - Flow that polls the selected table for new records using cursor-based pagination and state management
- [docker-compose.yml](docker-compose.yml) - Local PostgreSQL database for testing
- [init-post-db.sql](init-post-db.sql) - Sample database schema and test data

## Testing the integration

You can test this integration locally using the provided Docker Compose setup.

### Starting the local PostgreSQL database

The [docker-compose.yml](docker-compose.yml) file provides a local PostgreSQL 18 instance with:

- Port 5432 exposed on localhost
- Username: `myuser`
- Password: `mypass`
- Database: `mydb`
- Sample `posts` table with initial data

To start the database:

```bash
docker-compose up -d
```

The database will automatically create a `posts` table with two sample records using the [init-post-db.sql](init-post-db.sql) initialization script.

### Exposing your local database to Prismatic

For testing purposes, you can connect Prismatic to your local PostgreSQL instance using [ngrok](https://ngrok.com/) or a similar tunneling tool.

```bash
ngrok tcp 5432
```

### Testing in Prismatic

To run the integration in Prismatic, first build and import the integration:

```bash
npm run build
prism integrations:import --open
```

Then:

1. Configure a test instance by following the configuration wizard
2. Enter your PostgreSQL connection details (use the Docker Compose credentials if testing locally)
3. Select the `public.posts` table from the dropdown
4. Deploy the integration

Once deployed, the integration will:

- Poll the selected table every minute (default schedule)
- Process new records created since the last poll
- Log details about each new record (ID, title, created_at)
- Maintain polling state automatically

### Testing the polling behavior

To test that the polling trigger works correctly:

1. Deploy and activate the integration
2. Wait for the initial poll to complete (it will set up the cursor but not process existing records)
3. Insert a new record into the `posts` table:

```sql
INSERT INTO posts (title, content)
VALUES ('New Post', 'This post was created after integration activation');
```

1. Wait for the next poll (within 1 minute)
2. Check the integration execution logs - you should see the new record being processed
3. Insert additional records to verify incremental polling continues to work

### Stopping the local database

When you're done testing, stop the Docker Compose stack:

```bash
docker-compose down
```

To remove the database volume as well:

```bash
docker-compose down -v
```
