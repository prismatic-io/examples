# Programmatically Update Shopify Instances

As you build integrations, the test instances you use in the integration designer may accumulate OAuth connections that, for one reason or another, disconnect (maybe you removed the test OAuth app, or revoked the app secret).

Those test connections' logs can get noisy, and you may want to set all test connections to a "disconnected" state so they stop re-attempting to renew their OAuth access tokens.

This script fetches all test instances (non-customer instances), checks their OAuth connections for ones that have a `state` of `"error"`, and issues a `disconnectConnection()` on each.

## Running this script

First install all dependencies with

```
npm install
```

Then, run the script with

```
# Set a Prismatic API key
PRISMATIC_API_KEY=$(prism me:token)

# Check which connections would be disconnected
npx tsx src/index.ts

# Disconnect the connections
npx tsx src/index.ts --apply
```
