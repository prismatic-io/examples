import { properFormatNameAction } from ".";
import { PerformDataReturn } from "@prismatic-io/spectral";
import { invoke } from "@prismatic-io/spectral/dist/testing";

describe("Test the Proper Name formatter", () => {
  test("Verify first, middle, and last name", async () => {
    const { result } = await invoke<PerformDataReturn>(properFormatNameAction, {
      firstName: "John",
      middleName: "James",
      lastName: "Doe",
    });
    expect(result.data).toStrictEqual("Doe, John J.");
  });
  test("Verify first and last name without middle", async () => {
    const { result } = await invoke<PerformDataReturn>(properFormatNameAction, {
      firstName: "John",
      middleName: null,
      lastName: "Doe",
    });
    expect(result.data).toStrictEqual("Doe, John");
  });
});
