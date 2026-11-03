import type { HttpResponse } from "@prismatic-io/spectral";

/**
 * The Salesforce Metadata API version used when creating the Flow and
 * outbound message that power the real-time webhook subscription.
 */
export const SALESFORCE_API_VERSION = "63.0";

/**
 * Prefix applied to the names of the Salesforce Flow and outbound message
 * that this integration creates on deploy. The prefix makes the generated
 * resources easy to identify in a customer's Salesforce org. It must start
 * with a letter and contain no spaces.
 */
export const FLOW_TRIGGER_PREFIX = "LeadSync";

/**
 * The SOAP envelope Salesforce expects in response to an outbound message.
 * Returning this `<Ack>true</Ack>` body tells Salesforce the notification was
 * received successfully so it won't retry delivery. See:
 * https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_om_outboundmessaging_ack.htm
 */
export const OUTBOUND_MESSAGE_ACK_RESPONSE: HttpResponse = {
  statusCode: 200,
  contentType: "text/xml; charset=utf-8",
  body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <notificationsResponse xmlns="http://soap.sforce.com/2005/09/outbound">
      <Ack>true</Ack>
    </notificationsResponse>
  </soapenv:Body>
  </soapenv:Envelope>`,
};
