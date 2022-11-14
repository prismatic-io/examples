import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  connectionInput,
  portfolioId,
  fieldId,
  insertAfter,
  insertBefore,
  isImportant,
} from "../../inputs";

export const addCustomFieldToPortfolio = action({
  display: {
    label: "Add Custom Field To Portfolio",
    description: "Add a custom field to an existing portfolio",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/portfolios/${params.portfolioId}/addCustomFieldSetting`,
      {
        data: {
          custom_field: params.fieldId,
          insert_after: params.insertAfter,
          insert_before: params.insertBefore,
          is_important: params.isImportant,
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    portfolioId,
    fieldId,
    insertAfter,
    insertBefore,
    isImportant,
  },
  examplePayload: { data: { data: {} } },
});
