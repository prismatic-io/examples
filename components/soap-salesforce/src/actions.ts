import { action, util, Connection } from "@prismatic-io/spectral";
import * as path from "path";
import soap from "@prismatic-io/spectral/dist/clients/soap/utils";
import { inputs } from "./config";
import {
  BasicAuthConnection,
  isBasicAuthConnection,
  RequestParams,
} from "@prismatic-io/spectral/dist/clients/soap/types";
import { readFileSync } from "fs";

const { connectionInput, debug, queryString } = inputs;
const getRequestParams = async (
  connection: Connection,
  debug: boolean,
  method: string
) => {
  const wsdlPath = path.join(__dirname, "sfdc-demo.wsdl");
  const wsdl = readFileSync(wsdlPath).toString();

  connection.fields["loginMethod"] = "login";
  if (!isBasicAuthConnection(connection)) {
    throw new Error(
      "Must define username, password, and loginMethod in Connection fields"
    );
  }

  const [{ result }] = await soap.getSOAPAuth(
    connection as BasicAuthConnection,
    wsdl
  );

  const { sessionId, serverUrl } = result;
  const authHeader = await soap.generateHeader(
    wsdl,
    { SessionHeader: { sessionId } },
    { xmlns: "", namespace: "tns" }
  );

  const requestParams: RequestParams = {
    wsdlParam: wsdl,
    method,
    overrides: {
      endpointURL: serverUrl,
      soapHeaders: [authHeader],
    },
    debug: util.types.toBool(debug),
  };
  return requestParams;
};

export const query = action({
  display: {
    label: "Query",
    description: "Generic Salesforce Query",
  },
  perform: async (context, { connection, debug, queryString }) => {
    const requestParams = await getRequestParams(
      connection,
      util.types.toBool(debug),
      "query"
    );
    const response = await soap.soapRequest(requestParams, {
      query: util.types.toString(queryString),
    });
    return { data: response };
  },
  inputs: {
    connection: connectionInput,
    debug,
    queryString,
  },
});
export const getCurrentUser = action({
  display: {
    label: "Get Current User",
    description: "Get the Current User from Salesforce",
  },

  perform: async (context, { connection, debug }) => {
    const requestParams = await getRequestParams(
      connection,
      util.types.toBool(debug),
      "getUserInfo"
    );
    const response = await soap.soapRequest(requestParams);
    return { data: response };
  },
  inputs: {
    connection: connectionInput,
    debug,
  },
});
export default {
  getCurrentUser,
  query,
};
