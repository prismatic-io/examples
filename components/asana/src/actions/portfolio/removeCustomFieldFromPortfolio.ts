import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, portfolioId, fieldId } from "../../inputs";

export const removeCustomFieldFromPortfolio = action({
  display: {
    label: "Remove Custom Field From Portfolio",
    description: "Remove a custom field from an existing portfolio",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/portfolios/${params.portfolioId}/removeCustomFieldSetting`,
      {
        data: {
          custom_field: params.fieldId,
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    portfolioId,
    fieldId,
  },
  examplePayload: { data: { data: {} } },
});
