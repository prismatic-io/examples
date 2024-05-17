/**
 * Test SSH key generation
 * To enable, first run `docker-compose up` from the docker directory.
 * Then, run `DOCKER_ENABLED=true npm run test` from the root directory.
 */

import {
  createConnection,
  createHarness,
} from "@prismatic-io/spectral/dist/testing";
import component from ".";
import { privateKey } from "./connections";
import fs from "fs";

const harness = createHarness(component);
const connectionWithPassphrase = createConnection(privateKey, {
  privateKey: fs
    .readFileSync("./docker/keypair-with-passphrase.key")
    .toString(),
  passphrase: "password",
  username: "my-user",
  host: "localhost",
  port: "2222",
  timeout: "3000",
});

const connectionWithoutPassphrase = createConnection(privateKey, {
  privateKey: fs
    .readFileSync("./docker/keypair-without-passphrase.key")
    .toString(),
  username: "my-user",
  host: "localhost",
  port: "2222",
  timeout: "3000",
});

describe("Connect to server with SSH key", () => {
  if (!process.env.DOCKER_ENABLED) {
    console.warn(
      "Skipping SSH key tests. Run `DOCKER_ENABLED=true npm run test` to enable."
    );
    test("Skip", async () => {
      return Promise.resolve();
    });
    return;
  }
  test("Connect to a system using SSH key with passphrase", async () => {
    const result = await harness.action("listDirectory", {
      connection: connectionWithPassphrase,
      path: "/",
      debug: false,
    });
    expect(result?.data).toEqual(["docker-mods", "init", "keygen.sh"]);
  });
  test("Connect to a system using SSH key without passphrase", async () => {
    const result = await harness.action("listDirectory", {
      connection: connectionWithoutPassphrase,
      path: "/",
      debug: false,
    });
    expect(result?.data).toEqual(["docker-mods", "init", "keygen.sh"]);
  });
});
