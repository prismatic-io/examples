# Prismatic Examples

This repository contains sample code for Prismatic components and integrations.
Code contained within this repo is referenced throughout Prismatic's [website](https://www.prismatic.io), [blog](https://www.prismatic.io/blog) and [docs](https://www.prismatic.io/docs).

## What is Prismatic?

Prismatic is the integration platform for B2B software companies. It's the quickest way to build integrations to the other apps your customers use and to add a native integration marketplace to your product.

Prismatic significantly reduces overall integration effort and enables non-dev teams to take on more of the integration workload, so that you can deliver integrations faster and spend more time on core product innovation.

With Prismatic, you can:

- Build reusable [integrations](https://prismatic.io/docs/integrations) in a low-code integration designer that's tailored for your product
- Use [pre-built components](https://prismatic.io/docs/components/component-catalog) to handle most of your integrations' functionality, and write [custom components](https://prismatic.io/docs/custom-components/writing-custom-components) when needed
- Quickly add an [integration marketplace](https://prismatic.io/docs/integration-marketplace) to your product so customers can explore, activate, and monitor integrations
- Easily deploy customer-specific integration [instances](https://prismatic.io/docs/instances) with unique configurations and credentials
- Provide better support with tools like [logging](https://prismatic.io/docs/logging) and [alerting](https://prismatic.io/docs/monitoring-and-alerting)
- Run your integrations in a purpose-built environment designed for security and scalability
- Use powerful dev tools to mold the platform to your product, industry, and the way you build software

## Who uses Prismatic?

Prismatic is for B2B (business-to-business) software companies, meaning software companies that provide applications used by businesses. It's a good fit for products/teams ranging from early-stage and growing SaaS startups to large, established software companies looking to improve the way they do integrations.

Many B2B software teams serve customers in niche vertical markets, and we designed Prismatic with that in mind. We provide powerful and flexible tools so you can build exactly the integrations your customers need, no matter who your customers are, no matter what systems you need to connect to, no matter how "non-standard" your integration scenario.

## What kind of integrations can you build using Prismatic?

Prismatic supports integrations ranging from simple and standard to complex, bespoke, and vertical-specific.
Teams use it to build integrations between applications of all kinds, SaaS or legacy, with or without a modern API, regardless of protocol or data format.
Here are some example use cases:

- Use job data from your system to create invoices in your customers' ERP.
- Import and process data from third-party forms that vary significantly from customer to customer.
- Email activity summary reports with parameters and intervals defined on a per-customer basis.
- Build AI-powered assistants that can search, analyze, and interact with your systems.

For information on the Prismatic platform, check out our [website](https://prismatic.io) and [docs](https://prismatic.io/docs).

## Repository Contents

- `ai/` contains AI agent examples using OpenAI's Agent SDK for building intelligent integrations.
- `api/` contains sample code that interacts with Prismatic's [GraphQL API](https://prismatic.io/docs/api/api-overview/).
- `components/` contains code for sample custom components, which are a good reference for building your own custom components.
- `integrations/` contains sample integrations written in YAML and Code-Native Integration examples written in Typescript.

## AI Agent Examples

This repository includes production-ready examples of AI-powered integrations using OpenAI's Agent SDK:

### [OpenAI Agent Integration](ai/openai-agent/)
A comprehensive reference implementation featuring 7 production-ready flows that showcase advanced agent patterns:
- **Basic Chat** - Simple conversational AI without tools
- **API Agent** - Demonstrates wrapping REST APIs as AI tools with approval flows
- **Human Approval** - Human-in-the-loop pattern for sensitive operations
- **Agent Routing** - Dynamic routing to specialized agents based on intent
- **Integrations as Tools** - Dynamically discovers and uses deployed Prismatic integrations as AI tools
- **Agent as Tools** - Composes specialized agents as reusable tools
- **Hosted Tools** - Leverages OpenAI's built-in web search and code interpreter

Includes interactive chat scripts for local testing and comprehensive state management with both file-based and Prismatic-based storage backends.

### [Slack Chatbot Agent](ai/slack-chatbot-agent/)
A production-ready Slack Assistant integration that demonstrates enterprise AI assistant patterns:
- Implements Slack's Assistant framework with proper webhook handling and 3-second acknowledgment
- Features approval flow UI with Slack blocks for tool execution authorization
- Manages conversation state across message threads with execution tracking
- Dynamically discovers customer-specific Prismatic integrations as AI tools
- Includes robust retry handling and state persistence
- Supports both development (file-based) and production (Prismatic-based) state storage

Both examples include comprehensive testing utilities, proper error handling, and production-ready architecture patterns for building intelligent integrations that can understand context, make decisions, and interact with various systems on behalf of users.

## License

This repository is [MIT licensed](./LICENSE).
