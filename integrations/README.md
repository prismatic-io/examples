# Example Integrations

| Directory                      | Contents                                                                                                                                                              |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [code-native/](./code-native/) | TypeScript [code-native integration](https://prismatic.io/docs/integrations/code-native/) templates: MCP tools, data sync, large files, Slack and AI data enrichment. |
| [low-code/](./low-code/)       | [Low-code](https://prismatic.io/docs/integrations/low-code-integration-designer/) integrations, exported as YAML, that are referenced by the docs.                    |

To import a low-code YAML file, run `prism integrations:import --path <file>.yml`.
To import a code-native integration, run `npm run build` and then `prism integrations:import` from its directory.
