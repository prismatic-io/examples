# Templated connection inputs example

If you want to save your customers the hassle of entering the same value for several inputs of a connection, you can leverage [Templated connection inputs](https://prismatic.io/docs/custom-connectors/connections/#templating-connection-inputs).
With templated connection inputs, you can prompt your end users for a value once, and you can concatenate that value with other strings in several inputs.

In this example, we have [a component](./templated-connection-inputs-component/src/connections.ts) which prompts a user for three values, "Host", "Consultant Number" and "Client Number", and those values are used to generate an OAuth 2.0 authorize URL, token URL and scopes.

The component's [manifest](./templated-connection-inputs-component-manifest/) is generated using `npm run generate:manifest` so that it can be used in a [code-native integration](./templated-connection-inputs-integration/src/componentRegistry.ts).

## Testing this component and integration

To test this component and integration, first build and publish the component

```bash
cd templated-connection-inputs-component
npm install
prism components:publish
cd ..
```

Next, generate the component manifest

```bash
rm -r templated-connection-inputs-component-manifest
cd templated-connection-inputs-component
npm run generate:manifest
cd ../templated-connection-inputs-component-manifest
npm install
cd ..
```

Finally, install the manifest into the code-native integration, build, and publish the integration.

```bash
cd templated-connection-inputs-integration
npm install ../templated-connection-inputs-component-manifest
npm run build
prism integrations:import --open
```
