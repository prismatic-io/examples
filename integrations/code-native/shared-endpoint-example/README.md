# Shared Endpoint Example

This example demonstrates how an integration can leverage a [preprocess flow](https://prismatic.io/docs/integrations/triggers/using-shared-webhooks-and-preprocess-flows/#the-preprocess-flow) to determine which flow to run.
In `src/index.ts`, the `integration` specifies `endpointType: EndpointType.InstanceSpecific`, indicating that each instance of the integration will have its own webhook URL, but all flows of the instance will share that single webhook URL.

## The preprocess flow

The flow named "My Preprocess Flow", defined in `src/flows.ts`, is responsible for determining which sibling flow to execute.
It examines the contents of the payload that its trigger received.
If the payload's `event` property is `"create_opportunity"`, then the sibling flow "Create Opportunity" will be executed.
If the payload's `event` property is `"update_opportunity"`, then the sibling flow "Update Opportunity" will be executed.

The preprocess flow returns a result of the form `{ flowToExecute: "Sibling flow's name" }`, and the runner knows to look for the `flowToExecute` field due to the `preprocessFlowConfig` property on the preprocess flow.

## Sending webhook requests

Once you build and import this integration and deploy it to a customer, you can send a payload to the instance's webhook URL.
If your payload looks like this, the "Create Opportunity" flow will run:

```json
{
  "event": "create_opportunity",
  "opportunity": {
    "id": "abc-123",
    "name": "Foo",
    "amount": 10000
  }
}
```

If your payload looks like this, the "Update Opportunity" flow will run:

```json
{
  "event": "update_opportunity",
  "opportunity": {
    "id": "abc-123",
    "name": "Bar",
    "amount": 12345
  }
}
```
