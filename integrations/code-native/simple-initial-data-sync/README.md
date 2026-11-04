# Simple Initial Data Sync

This integration demonstrates how to perform an initial data sync of a large data set in manageable batches when an instance is deployed, and then continue to process individual records in real time as they arrive via webhook. It showcases the `batchFlowTrigger` pattern, cursor-based pagination across batches, concurrent batch processing, and a unified execution path for both backfilled and real-time data.

## What this integration does

When an instance is deployed, this integration backfills posts from a paginated API (using [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/) as a placeholder) in batches of 20. It keeps track of its position in the data set using a cursor so that each subsequent backfill picks up where the last one left off, until there are no more posts to fetch.

After the initial sync is complete, the integration's webhook URL accepts individual posts sent in real time. A single post sent to the webhook is processed through the same execution logic as the posts fetched during the initial sync.

A post is expected to have the following shape:

```json
{
  "userId": 5,
  "id": 101,
  "title": "My new post",
  "body": "Hello, World!"
}
```

## Key features

### Initial data sync on deployment

The integration uses a `batchFlowTrigger` whose `onDeploy` function runs when an instance is initially deployed to a customer. This function fetches a page of posts from the API and returns them for processing.

The `onDeploy` function returns both the fetched `items` and a `paginationState` cursor. Prismatic calls `onDeploy` repeatedly, passing the previous `paginationState` back in on each call, until `onDeploy` returns `null` for `paginationState` — signaling that the initial sync is complete. This allows large data sets to be synced incrementally without loading everything into memory at once.

### Cursor-based pagination

The `paginationState` cursor tracks the integration's position in the data set across multiple backfill calls. In this example, the cursor's `startId` represents the offset of the next post to fetch:

```typescript
return {
  items: response.data,
  paginationState:
    response.data.length > 0
      ? { startId: startId + response.data.length }
      : null,
};
```

When a page returns posts, the cursor advances by the number of posts fetched. When a page returns no posts, `paginationState` is set to `null` to indicate that there is no more data to sync.

### Concurrent batch processing

The flow's `batchConfig` controls how the fetched records are handed off to `onExecution`:

```typescript
batchConfig: { batchSize: 5, concurrentBatchLimit: 3 },
```

- **`batchSize: 5`** — `onExecution` is invoked once for every 5 posts, so it receives an array of up to 5 posts at a time rather than the full page.
- **`concurrentBatchLimit: 3`** — up to 3 batches (15 posts) can be processed concurrently. Additional batches wait until a processing slot becomes available.

This lets you tune throughput against the rate limits and resource constraints of your downstream system.

### Real-time webhook processing

The `onTrigger` function runs whenever a single post is sent to the integration's webhook URL. It wraps the single post in an array so that it can flow through the same `onExecution` logic used during the initial sync, and returns a custom HTTP response acknowledging receipt:

```typescript
response: {
  contentType: "text/plain",
  statusCode: 200,
  body: "acknowledged",
  headers: { "x-acme-ack": "ack" },
},
```

Because real-time posts don't affect pagination, `onTrigger` returns `paginationState: null`.

### Unified execution path

The `onExecution` function processes posts regardless of their source — a batch of 5 posts from the initial sync or a single post from the webhook. It validates the incoming data with a [Zod](https://zod.dev/) schema and then processes each post (in this example, simply logging it):

```typescript
const posts = PostArray.parse(params.onTrigger.results.body.data);
for (const post of posts) {
  context.logger.info(`Processing post ${post.id}: ${post.title}`);
}
```

This keeps your processing logic in a single place, no matter whether data is being backfilled or received in real time.

## Integration structure

Beyond the standard integration files, this integration contains the following key file:

- [src/flows.ts](src/flows.ts) - Defines the "Import Posts" flow, including the `batchFlowTrigger` with `onDeploy` (initial sync), `onTrigger` (real-time webhook), and `onExecution` (unified processing), along with the `Post` and `PostCursor` types

This integration requires no special configuration, so [src/configPages.ts](src/configPages.ts) and [src/componentRegistry.ts](src/componentRegistry.ts) are intentionally minimal.

## Flow details

### Import Posts Flow

The [flows.ts](src/flows.ts) flow demonstrates the full initial-sync-plus-real-time pattern. This flow:

1. On deployment, fetches posts from the paginated API 20 at a time via `onDeploy`
2. Advances a `paginationState` cursor after each page, repeating until no more posts are returned
3. Hands fetched posts to `onExecution` in batches of 5, processing up to 3 batches concurrently
4. After the initial sync, receives individual posts at its webhook URL via `onTrigger` and acknowledges each with a custom response
5. Processes both backfilled batches and real-time posts through the same `onExecution` logic, validating each post with Zod and logging it

## Testing the integration

You can test this integration in Prismatic.

To run the integration in Prismatic, first build and import the integration:

```bash
npm run build
prism integrations:import --open
```

Then:

1. Configure a test instance (no configuration values are required for this example)
2. Deploy the integration

On deployment, the initial data sync will run automatically, fetching posts from the placeholder API in batches. Review the execution logs to see each post being processed.

### Testing the webhook

Once the instance is deployed, you can send an individual post to the instance's webhook URL to test real-time processing:

```bash
curl -X POST https://your-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"userId": 5, "id": 101, "title": "My new post", "body": "Hello, World!"}'
```

You should receive an `acknowledged` response, and the post should appear in the execution logs being processed through the same `onExecution` logic used during the initial sync.

## Extending this integration

This integration provides a solid foundation that can be extended in several ways:

### Connecting to a different API

The [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/) API in this example is a placeholder. To sync from your own system:

1. Update the API endpoint and request parameters in `onDeploy` in [flows.ts](src/flows.ts)
2. Adjust the `Post` Zod schema and `PostCursor` interface to match your data and pagination scheme
3. If your API requires authentication, add a connection in [configPages.ts](src/configPages.ts) and use it when making requests

### Adjusting pagination

The cursor in this example uses a simple numeric offset. Depending on your API, you may need to:

1. Use a page token or `nextCursor` value returned by the API instead of an incrementing offset
2. Store additional state (such as a timestamp or a last-seen ID) in `paginationState`
3. Tune the page size fetched in `onDeploy` to balance throughput against API rate limits

### Tuning batch processing

Adjust `batchConfig` in [flows.ts](src/flows.ts) to fit your downstream system:

1. Increase or decrease `batchSize` to control how many records `onExecution` receives at once
2. Adjust `concurrentBatchLimit` to control how many batches process in parallel

### Adding real processing logic

The current `onExecution` simply logs each post. To do meaningful work:

1. Replace the logging loop with calls to your destination system (a database, CRM, data warehouse, etc.)
2. Add error handling and retry logic for failed records
3. Consider idempotency checks so that re-syncs or duplicate webhook deliveries don't create duplicate records
