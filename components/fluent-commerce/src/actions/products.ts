import { action, input, KeyValuePair, util } from "@prismatic-io/spectral";
import { createFluentClient } from "../client";
import { connectionInput } from "../inputs";
import { gql, Variables } from "graphql-request";

const createProduct = action({
  display: {
    label: "Create Product",
    description: "Create a new standard product",
  },
  inputs: {
    connection: connectionInput,
    productCatalogueRef: input({
      label: "Product Catalogue Ref (ID)",
      type: "string",
      required: true,
      example: "FCRG:PC:MASTER",
      clean: util.types.toString,
      comments: "The reference ID (ref) of an existing product catalog",
    }),
    productRef: input({
      label: "Product Ref ID",
      type: "string",
      required: true,
      example: "TESTPRD",
      clean: util.types.toString,
      comments: "The reference ID (ref) of the new product (must be unique)",
    }),
    productType: input({
      label: "Product Type",
      type: "string",
      required: true,
      example: "STANDARD",
      default: "STANDARD",
      clean: util.types.toString,
      comments: "The type of the product",
    }),
    productName: input({
      label: "Product Name",
      type: "string",
      required: true,
      example: "Widget",
      clean: util.types.toString,
      comments: "The name of the product (not required to be unique)",
    }),
    productSummary: input({
      label: "Product Summary / Description",
      type: "string",
      required: true,
      example: "Widgets: the new whatsits",
      clean: util.types.toString,
    }),
    gtin: input({
      label: "Global Trade Item Number (GTIN)",
      type: "string",
      required: true,
      example: "012345678905",
      clean: util.types.toString,
      comments: "The global trade number of the product",
    }),
    priceCurrency: input({
      label: "Price Currency",
      type: "string",
      required: true,
      example: "USD",
      clean: util.types.toString,
      comments: "Type of currency the price is in (USD, YEN, GBP, etc)",
    }),
    priceValue: input({
      label: "Price Value",
      type: "string",
      required: true,
      example: "1300",
      clean: util.types.toNumber,
      comments: "The price of the product (must be a floating-point number)",
    }),
  },
  perform: async (context, params) => {
    const client = await createFluentClient(params.connection);

    const query = gql`
      mutation createProduct(
        $productCatalogueRef: String!
        $productRef: String!
        $productType: String!
        $productName: String!
        $productSummary: String!
        $gtin: String!
        $priceCurrency: String!
        $priceValue: Float!
      ) {
        createStandardProduct(
          input: {
            ref: $productRef
            catalogue: { ref: $productCatalogueRef }
            type: $productType
            name: $productName
            summary: $productSummary
            gtin: $gtin
            prices: [
              { currency: $priceCurrency, type: "RRP", value: $priceValue }
            ]
          }
        ) {
          id
          ref
        }
      }
    `;

    const variables = {
      productCatalogueRef: params.productCatalogueRef,
      productRef: params.productRef,
      productType: params.productType,
      productName: params.productName,
      productSummary: params.productSummary,
      gtin: params.gtin,
      priceCurrency: params.priceCurrency,
      priceValue: params.priceValue,
    };

    const data = await client.request(query, variables);

    return { data };
  },
  examplePayload: {
    data: {
      createStandardProduct: {
        id: "03440122-ea39-499b-83aa-f08b2614daf3",
        ref: "TESTPRD3",
      },
    },
  },
});

export default { createProduct };
