import { util } from "@prismatic-io/spectral";
import { XMLParser } from "fast-xml-parser";
import {
  CleanSObject,
  SalesforceOutboundEnvelope,
  SFDCFieldMappingResult,
  StandardizedLead,
} from "./types";

export const standardizeLeadData = (
  sfdcData: Record<string, unknown>,
  mapping: SFDCFieldMappingResult,
  recordType: string,
): StandardizedLead => {
  return {
    sfdcId: sfdcData.Id as string,
    recordType,
    name: sfdcData[mapping.name] as string,
    // Salesforce omits empty fields entirely from outbound messages (and
    // returns `null` from SOQL), so coerce missing values to `null` to satisfy
    // the nullable schema regardless of which code path produced the record.
    email: (sfdcData[mapping.email] as string) ?? null,
    phone: (sfdcData[mapping.phone] as string) ?? null,
  };
};

/**
 * Salesforce sends outbound messages as SOAP/XML. We keep the namespace
 * prefixes (e.g. `soapenv:`, `sf:`) because we rely on them to walk the
 * envelope, and we use `_text` as the text-node key for elements that also
 * carry attributes.
 */
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: false,
  textNodeName: "_text",
});

/**
 * Flatten a single SOAP `<Notification>` into a plain object keyed by field API
 * name. The notification wraps the changed record in an `sObject` element whose
 * `xsi:type` attribute (e.g. "sf:Lead") names the object, and whose `sf:`-prefixed
 * children are the field values.
 */
const cleanSObject = (notification: Record<string, unknown>): CleanSObject => {
  const sObject = notification?.sObject as Record<string, unknown> | undefined;
  if (!sObject) {
    throw new Error("Invalid outbound message notification: missing sObject");
  }

  const xsiType = sObject["@_xsi:type"];
  const result: CleanSObject = {
    type:
      (typeof xsiType === "string" ? xsiType.split(":")[1] : undefined) ||
      "Unknown",
    Id: (sObject["sf:Id"] ?? sObject.Id ?? "") as string,
  };

  // Copy each "sf:"-prefixed field onto the result using its bare field name.
  for (const key of Object.keys(sObject)) {
    if (key.startsWith("sf:") && key !== "sf:Id") {
      result[key.replace("sf:", "")] = sObject[key];
    }
  }

  return result;
};

/**
 * Parse the raw SOAP/XML body of a Salesforce outbound message into an array of
 * flattened sObjects. A single outbound message can report one or many changed
 * records, so we always normalize to an array.
 */
export const parseOutboundMessageNotifications = (
  rawBody: unknown,
): CleanSObject[] => {
  const envelope = (xmlParser.parse(util.types.toString(rawBody)) ||
    {}) as SalesforceOutboundEnvelope;

  const notification =
    envelope?.["soapenv:Envelope"]?.["soapenv:Body"]?.notifications
      ?.Notification;
  if (!notification) {
    return [];
  }

  const notifications = Array.isArray(notification)
    ? notification
    : [notification];

  return notifications.map((n) => cleanSObject(n));
};
