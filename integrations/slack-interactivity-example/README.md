# Prismatic Example Integration: Slack Interactive Post Template

This repository contains an example integration for Prismatic that consists of two parts: the main Slack integration called "Slack Interactive Post Template" and a Slack Webhook Router integration.

## Slack Interactive Post Template

The Slack Interactive Post Template integration has three main flows:

1. **Send Message Flow**: This flow triggers on a webhook, creating an endpoint that you can make POST requests to with a payload containing the JSON for a Slack block message. The message will be posted to the channel selected in the configuration wizard.

2. **Instance Deploy Flow**: This flow fires on instance deploy and registers itself with the Slack Interactivity Router integration.

3. **Handle Button Responses Flow**: This flow handles webhook requests, forwarded from the router, that fire when a user interacts with the message.

How to call the Send Message flow:

```curl --location 'https://hooks.prismatic.io/trigger/SW5zdGFuY2VGbG93Q29uZmlnOjE0YWMxZmE2LTBmNGMtNDlmNC1hMTM3LWM1MWZmYWVjZTU4YQ==' \
--header 'Content-Type: application/json' \
--data '{
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Hello, Assistant to the Regional Manager Dwight! *Michael Scott* wants to know where you'\''d like to take the Paper Company investors to dinner tonight.\n\n *Please select a restaurant:*"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg",
				"alt_text": "alt text for image"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Kin Khao*\n:star::star::star::star: 1638 reviews\n The sticky rice also goes wonderfully with the caramelized pork belly, which is absolutely melt-in-your-mouth and so soft."
			},
			"accessory": {
				"type": "image",
				"image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg",
				"alt_text": "alt text for image"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Ler Ros*\n:star::star::star::star: 2082 reviews\n I would really recommend the  Yum Koh Moo Yang - Spicy lime dressing and roasted quick marinated pork shoulder, basil leaves, chili & rice powder."
			},
			"accessory": {
				"type": "image",
				"image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/DawwNigKJ2ckPeDeDM7jAg/o.jpg",
				"alt_text": "alt text for image"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Farmhouse",
						"emoji": true
					},
					"value": "farmhouse"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Kin Khao",
						"emoji": true
					},
					"value": "kimkhao"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Ler Ros",
						"emoji": true
					},
					"value": "lerros"
				},
                {
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Results",
						"emoji": true
					},
					"value": "results"
				}
			]
		}
	]
}'```

## Slack Interactivity Router

The Slack Interactivity Router takes the webhook notifications from your Slack app when someone interacts with a post that the bot posts. The reason we need a router integration is because Slack uses a single endpoint strategy for Slack bot notifications for interactivity, so every interactivity goes to one webhook. We have documentation about single endpoint webhook integrations here: [https://prismatic.io/docs/quickstarts/single-endpoint-webhook-integrations/](https://prismatic.io/docs/quickstarts/single-endpoint-webhook-integrations/)

You'll deploy the Slack router to a "system" customer, but the Slack Interactive Post Template can be deployed to multiple customers.

This integration has 2 main flows:

1. **Registration Endpoint**: The other integration will call this flow on instance deploy and register itself with a channel ID and webhook URL for forwarding events to.
2. **Route Request**: When a Slack interaction is received, this flow will looks up the webhook URL that was registered with the channel ID and forwards Slack's payload to the appropriate instance of the Slack Interactive Post Template integration.