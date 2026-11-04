# Salesforce

This integration demonstrates how to build a bi-directional data sync between Salesforce and an external system (referred to as "Acme" in this example). It showcases several advanced integration patterns including dynamic record type selection, intelligent field mapping with fuzzy matching, customer-activated connections, and webhook-based real-time synchronization.

## What this integration does

This integration syncs data bi-directionally between Salesforce and Acme:

- **From Salesforce to Acme**: When records are created or updated in Salesforce, the changes are automatically sent to Acme via webhook
- **From Acme to Salesforce**: When Acme sends record data, it's created or updated in Salesforce

The integration is highly configurable through a multi-step configuration wizard that allows customers to:

1. Choose any Salesforce record type (Lead, Contact, custom objects, etc.)
2. Map Salesforce fields to Acme fields with intelligent fuzzy matching suggestions
3. Validate field mappings before activation

## Key features

### Dynamic record type selection

Rather than hardcoding a specific Salesforce object type, users can select from **any** triggerable, retrievable, and creatable Salesforce object during the configuration wizard. This includes standard objects like Lead, Contact, Account, and Opportunity, as well as custom objects.

The [sobjectList.ts](src/dataSources/sobjectList.ts) data source queries Salesforce's metadata API to populate a dropdown with available record types, filtered to those that support the operations needed by this integration.

### Intelligent field mapping with fuzzy matching

The integration provides a field mapper that **automatically suggests** Salesforce-to-Acme field mappings using fuzzy string matching. For example:

- Salesforce's "FirstName" is automatically matched to Acme's "first_name"
- "Email" fields are matched across both systems
- "Id" is intelligently mapped to "external_id"

The [fieldMapper.ts](src/dataSources/fieldMapper.ts) uses the [fast-fuzzy](https://www.npmjs.com/package/fast-fuzzy) library to compare field names and pre-populate mappings with an 80% similarity threshold. Users can review and adjust these mappings before finalizing the configuration.

The [fieldMapperValidator.ts](src/dataSources/fieldMapperValidator.ts) validates mappings to ensure:

- Each Acme field is mapped exactly once
- No Salesforce field is mapped to multiple Acme fields
- All required fields have mappings

### Bi-directional data synchronization

The integration includes two flows:

1. **From Salesforce** ([fromSalesforce.ts](src/flows/fromSalesforce.ts)): Uses a webhook trigger to receive real-time updates when Salesforce records change, then maps and sends the data to Acme
2. **To Salesforce** ([toSalesforce.ts](src/flows/toSalesforce.ts)): Receives webhook calls from Acme and creates or updates Salesforce records based on whether an `external_id` is provided

### Customer-activated connections

This integration leverages [customer-activated connections](https://prismatic.io/docs/integrations/connections/integration-agnostic-connections/customer-activated/), which allow customers to **reuse existing Salesforce OAuth connections** across multiple integrations. This provides several benefits:

- Customers don't need to authenticate separately for each integration
- Salesforce credentials are managed centrally
- Easier maintenance and credential rotation

The connection is configured in [configPages.ts](src/configPages.ts) using the `customerActivatedConnection` function with a stable key of `"salesforce-cac"`.

> Note: if you would like to import this integration yourself, you must create a customer-activated connection with a stable key of `salesforce-cac`.

### Usage of built-in Salesforce component

This integration uses the Prismatic-maintained Salesforce component, which includes a sophisticated `flowOutboundMessageTrigger` that:

- Automatically creates a Salesforce Flow when the integration is activated
- Sets up an Outbound Message action to send data to a webhook
- Handles XML parsing of Salesforce's SOAP-based outbound messages
- Provides the parsed data in a clean JSON format to your flow

This trigger eliminates the need to manually create Salesforce Flows or parse XML payloads - it's all handled automatically. See the [Salesforce component documentation](https://prismatic.io/docs/components/salesforce/#flow-outbound-message-webhook) for more details.

## Integration structure

Beyond the standard integration files, this integration contains the following key files:

- [src/salesforceClient.ts](src/salesforceClient.ts) - Creates and exports a Salesforce client using [jsforce](https://jsforce.github.io/), a modern JavaScript library for Salesforce APIs
- [src/acmeClient.ts](src/acmeClient.ts) - Creates and exports an HTTP client for the Acme API using Spectral's HTTP client utilities
- [src/configPages.ts](src/configPages.ts) - Defines a multi-step configuration wizard with connection setup, record type selection, field mapping, and validation
- [src/dataSources/sobjectList.ts](src/dataSources/sobjectList.ts) - Data source that queries Salesforce's metadata API to list available record types
- [src/dataSources/fieldMapper.ts](src/dataSources/fieldMapper.ts) - Data source that intelligently maps fields using fuzzy string matching
- [src/dataSources/fieldMapperValidator.ts](src/dataSources/fieldMapperValidator.ts) - Data source that validates field mappings before activation
- [src/flows/fromSalesforce.ts](src/flows/fromSalesforce.ts) - Flow that syncs data from Salesforce to Acme using a webhook trigger
- [src/flows/toSalesforce.ts](src/flows/toSalesforce.ts) - Flow that syncs data from Acme to Salesforce with payload validation using Zod
- [src/componentRegistry.ts](src/componentRegistry.ts) - Registers the Salesforce component for use in the integration

## Using jsforce

This integration uses [jsforce](https://jsforce.github.io/) to interact with Salesforce APIs. jsforce is a comprehensive JavaScript library that provides:

- OAuth 2.0 authentication
- CRUD operations on Salesforce records
- Metadata API access
- Query operations (SOQL)
- Bulk API support

The Salesforce client is created in [salesforceClient.ts](src/salesforceClient.ts) using the OAuth tokens from the customer-activated connection:

```typescript
new jsforce.Connection({
  instanceUrl: connection.token?.instance_url,
  version: "61.0",
  accessToken: connection.token?.access_token,
});
```

Once created, the client can be used to perform operations like:

```typescript
// Retrieve a record
const record = await client.sobject("Lead").retrieve(recordId);

// Create a record
await client.sobject("Contact").create({ FirstName: "John", LastName: "Doe" });

// Query records
await client.query("SELECT Id, Name FROM Account LIMIT 10");

// Describe metadata
await client.describeGlobal();
```

## Testing the integration

You can test this integration both locally and in Prismatic.

### Prerequisites

1. **Salesforce Developer Account**: Sign up for a free [Salesforce Developer Edition](https://developer.salesforce.com/signup) if you don't have one
2. **Customer-Activated Connection**: Create a customer-activated Salesforce connection in Prismatic with the stable key `salesforce-cac`. See [Customer-Activated Connections documentation](https://prismatic.io/docs/integrations/connections/integration-agnostic-connections/customer-activated/) for setup instructions
3. **Acme API**: This example uses [Postman Echo](https://postman-echo.com) as a test endpoint, but you can replace it with your own API

### Running tests in Prismatic

To run the integration in Prismatic, first build and import the integration:

```bash
npm run build
prism integrations:import --open
```

Then:

1. Configure a test instance by following the configuration wizard
2. Select a Salesforce record type (e.g., Lead or Contact)
3. Review and adjust the automatically suggested field mappings
4. Activate the integration

Once activated, the integration will:

- Create a Salesforce Flow and Outbound Message in your Salesforce org
- Start listening for record changes via webhook
- Sync data bi-directionally as records are created or updated

You can test the integration by:

1. Creating or updating a record in Salesforce and verifying it's sent to Acme
2. Sending a webhook payload to the "To Salesforce" flow and verifying it creates/updates a Salesforce record

## Extending this integration

This integration provides a solid foundation that can be extended in several ways:

### Supporting additional systems

The "Acme" system in this example is a placeholder. To sync with your own system:

1. Update [acmeClient.ts](src/acmeClient.ts) to authenticate with your API
2. Modify the `ACME_FIELDS` array in [fieldMapper.ts](src/dataSources/fieldMapper.ts) to reflect your system's fields
3. Update the payload schema in [toSalesforce.ts](src/flows/toSalesforce.ts) to match your system's data structure
4. Adjust the API calls in both flow files to use your system's endpoints

### Adding data transformation

The current implementation maps fields directly without transformation. To add transformation logic:

1. In [fromSalesforce.ts](src/flows/fromSalesforce.ts), add transformation logic before sending to Acme
2. In [toSalesforce.ts](src/flows/toSalesforce.ts), transform incoming data before creating/updating Salesforce records
3. Consider using libraries like [lodash](https://lodash.com/) for complex transformations

### Supporting multiple record types

To sync multiple Salesforce record types simultaneously:

1. Duplicate the flows for each record type
2. Use flow configuration variables to specify different record types
3. Create separate field mappers for each record type
4. Consider using flow templates to reduce code duplication

### Adding error handling and retry logic

For production use, consider adding:

1. Retry logic for failed API calls using exponential backoff
2. Dead letter queues for records that fail repeatedly
3. Detailed error logging and alerting
4. Idempotency checks to prevent duplicate record creation

### Implementing bulk operations

For high-volume scenarios, leverage Salesforce's Bulk API through jsforce:

```typescript
const job = client.bulk.createJob("Lead", "insert");
const batch = job.createBatch();
batch.execute(records);
```

See the [jsforce Bulk API documentation](https://jsforce.github.io/document/#bulk-api) for more details.
