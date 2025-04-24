# Programmatically Update Shopify Instances

The [Shopify](https://prismatic.io/docs/components/shopify/) connector was updated to support [templated connection inputs](https://prismatic.io/docs/changelog/#templated-connection-inputs).

This script helps to update your deployed instances of your Shopify integration to a version that supports the new connection type.

To run this script:

1. Install dependencies with `npm install`.
2. Set a Prismatic API key environment variable with `export PRISMATIC_API_KEY=$(prism me:token)`
3. Run the script with `npx tsx src/index.ts --integration-version-id YOUR-INTEGRATION-VERSION-ID --instance-id YOUR-INSTANCE-ID`

Watch a video tutorial here: https://www.loom.com/share/8f282eaade014ae5bae63bb700df4664?sid=1f262789-1a17-4391-994c-53e7253cd62f
