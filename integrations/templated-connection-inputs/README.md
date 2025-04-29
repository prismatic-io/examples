# Templated connection inputs example

If you want to save your customers the hassle of entering the same value for several inputs of a connection, you can leverage [Templated connection inputs](https://prismatic.io/docs/custom-connectors/connections/#templating-connection-inputs).
With templated connection inputs, you can prompt your end users for a value once, and you can concatenate that value with other strings in several inputs.

In this example, we prompt a user for three values, "Host", "Consultant Number" and "Client Number", and those values are used to generate an OAuth 2.0 authorize URL, token URL and scopes.

The connection code required to template connection inputs is [here](./src/configPages.ts).
