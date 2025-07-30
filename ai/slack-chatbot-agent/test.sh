#!/bin/bash
set -e
#Setup the name of the connection
connection='Slack Connection'
echo "Connection:" $connection

#Setup the name of the integration
name='Slack Agent'
# echo "Name:" $name

#Get the id of the integration
integrations=$(prism integrations:list -x --no-header --output=json --filter name="$name")
# echo "Integrations:" $integrations

id=$(prism integrations:list -x --no-header --output=json --filter name="$name" | jq '. [] | .id')
# echo "Id:" $id

#Get the OAuth2 Connection from Prismatic and set it as an environment variable
export PRISMATIC_CONNECTION_VALUE=$(prism components:dev:run -i $id --connectionKey "$connection" -- printenv PRISMATIC_CONNECTION_VALUE | jq .) npm run test
echo "PRISMATIC_CONNECTION_VALUE:" $PRISMATIC_CONNECTION_VALUE

# Any test harness connection will pull from the PRISMATIC_CONNECTION_VALUE environment variable during test executions
npm run test
