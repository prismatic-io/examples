# Data Enrichment with AI

These examples use LLMs to enrich data with extra context and insights, and to respond intelligently to events from other systems: incoming leads, error logs, alerts, chat messages and uploaded files.
See [Data Enrichment with AI](https://prismatic.io/docs/ai/data-enrichment/) for more information.

Several examples include both a code-native version (`cni/`) and an equivalent low-code version (`low-code/`), so you can compare the two approaches.

| Example                                                                        | Responds to              | What it does                                                                                                                                            |
| ------------------------------------------------------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Dropbox PDF Receipt Extraction](./dropbox-extract-receipt-from-pdf/)          | New PDFs in Dropbox      | Classifies documents and extracts vendor, line items and totals into structured JSON.                                                                   |
| [Jira Issues from Error Logs](./jira-issues-from-error-logs/)                  | Error log payloads       | Analyzes errors and opens Jira issues for high-confidence problems.                                                                                     |
| [Salesforce Lead Enricher and Router](./salesforce-lead-enricher-and-routing/) | New leads                | Deduplicates, researches and scores leads, then creates and routes them in Salesforce.                                                                  |
| [Slack Incident Monitoring](./slack-acme-incident-monitoring/)                 | Anomaly alerts           | Decides on an action, asks for human approval in Slack, then opens an incident and assigns on-call staff.                                               |
| [OpenAI Agent](./openai-agent/)                                                | Chat and API requests    | Reference implementation of agent patterns with the OpenAI Agents SDK: tools, approvals, routing, agents as tools, and Prismatic integrations as tools. |
| [Slack Chatbot Agent](./slack-chatbot-agent/)                                  | Slack Assistant messages | A Slack Assistant that keeps conversation state, asks for approval in Slack, and calls customer-specific Prismatic integrations as tools.               |

The two agent examples are less about enriching records and more about using AI to decide how to act on an incoming event or message.
They live here because they share the same event-driven, AI-in-the-loop pattern.
