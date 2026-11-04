# Salesforce Field Mapping Example

This example custom component contains a [JSON Forms data source](https://prismatic.io/docs/integrations/data-sources/json-forms/) that lets customers map fields from a Salesforce **Lead** to fields of a fictional "Acme" **Sale** while they configure an instance.

The data source uses a Salesforce connection to describe the Lead object's required fields, then renders a field mapper UI where each Acme field can be paired with a Salesforce field.
The resulting mapping is saved as a config variable that your integration's flows can reference.

## Usage

```bash
npm install
npm run build     # Build the component into dist/
npm test          # Run unit tests
npm run publish   # Build and publish with Prism
```

After publishing, add the **Salesforce Field Mapper Example** data source to a config page in your integration and point its connection input at a Salesforce connection config variable.
