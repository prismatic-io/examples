# Example Next.js Application with Chat Bot and Prismatic Marketplace

This is a simple Next.js application that integrates a chat bot using the [AI SDK](https://ai-sdk.dev/) and connects to the Prismatic Marketplace for AI tools.
It demonstrates how to set up a chat interface, authenticate with Prismatic, display the marketplace, and handle tool interactions.

This example uses OpenAI for chatbot functionality, but you can replace it with any other AI provider supported by the AI SDK.

## Prismatic insider

To watch this application in action, you can view the [Prismatic insider video](https://prismatic.io/docs/insider/#incorporate-ai-in-your-integrations-2025-07-22) which showcases the integration and functionality of this app.

## Set up

To set up the application, follow these steps:

1. Install node modules:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and add your Prismatic credentials.
   Copy the contents of `example.env.local` to `.env.local` and replace the placeholders with your actual values:

3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Important files

- `src/util/tools.ts` Contains the logic for fetching and displaying MCP tools derived from integrations in your integration marketplace.
- `src/util/token.ts` Handles the authentication token for Prismatic. See [Authenticating Embedded Users](https://prismatic.io/docs/embed/authenticate-users/) documentation.
- `src/app/integration-marketplace/page.tsx` is a very simple implementation of th Prismatic embedded integration marketplace.
- `src/app/ai-chat/page.tsx` is the main chat interface that integrates with the AI SDK and Prismatic Marketplace.
- `src/api/chat/route.ts` handles chat messages and interactions with the AI SDK.
- `src/app/api/prismatic-auth/route.ts` is the API route for handling authentication with Prismatic.
- `src/app/api/tools/route.ts` is an API the chat interface calls so it can list MCP tools from the Prismatic Marketplace.
