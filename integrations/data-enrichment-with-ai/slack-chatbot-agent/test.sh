#!/bin/bash
# Run the vitest suite with a real Slack connection pulled from a deployed instance of
# this integration. Requires the Prismatic CLI (`prism login`) and jq.
set -e

# Name of the connection config variable
connection='Slack Connection'
echo "Connection: $connection"

# ID of the integration in Prismatic (see .spectral/prism.json after `npm run import`)
id=SW50ZWdyYXRpb246ZDA5M2YzOTgtNWMwOS00MmFmLTk2NDktMWRiYWNkMjQyNWVk

# Fetch the connection from Prismatic and expose it as PRISMATIC_CONNECTION_VALUE.
# The spectral test harness reads connections from this environment variable.
PRISMATIC_CONNECTION_VALUE=$(prism components:dev:run -i "$id" --connectionKey "$connection" -- printenv PRISMATIC_CONNECTION_VALUE | jq .)
export PRISMATIC_CONNECTION_VALUE

npm test -- src/index.test.ts
