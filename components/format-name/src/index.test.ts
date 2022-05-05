import component from ".";
import { createHarness } from "@prismatic-io/spectral/dist/testing";

const harness = createHarness(component);

describe("Test the Proper Name formatter", () => {
  test("Verify first, middle, and last name", async () => {
    const result = await harness.action("properFormatName", {
      firstName: "John",
      middleName: "James",
      lastName: "Doe",
    });
    expect(result.data).toStrictEqual("Doe, John J.");
  });
  test("Verify first and last name without middle", async () => {
    const result = await harness.action("properFormatName", {
      firstName: "John",
      middleName: null,
      lastName: "Doe",
    });
    expect(result.data).toStrictEqual("Doe, John");
  });
});

describe("Test the Improper Name formatter", () => {
  test("Verify action runs as expected", async () => {
    const result = await harness.action("improperFormatName", {
      firstName: "John",
    });
    expect(result.data).toStrictEqual("My main man, John");
  });
});
