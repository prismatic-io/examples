#!/bin/bash

CUSTOMER_NAME=$1
echo "Publishing integration..."
INTEGRATION_ID=$(prism integrations:import --path ./progix-acmeerp.yaml)
CUSTOMER_ID=$(
    prism customers:list \
    --filter "Name=$CUSTOMER_NAME" \
    --columns id \
    --no-header)
echo "Creating instance for '$CUSTOMER_NAME'..."
INSTANCE_ID=$(
    prism instances:create \
    --name "AcmeERP Integration" \
    --customer $CUSTOMER_ID \
    --integration $INTEGRATION_ID)
echo "Deploying and enabling instance..."
prism instances:deploy $INSTANCE_ID
prism instances:enable $INSTANCE_ID
echo "Deployment complete"