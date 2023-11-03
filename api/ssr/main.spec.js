"use strict";

import { test, expect } from "@playwright/test";

test.describe("On Error the /:keyword route responds with", function (request) {
  test("a 4xx code on a client error", async function ({ request }) {
    // GIVEN
    const INVALID = "Ungültig";
    // WHEN
    const RESPONSE = await request.get(`/?keyword=${INVALID}`);
    // THEN
    expect(RESPONSE.status()).toBeWithinRange(400, 499);
  });
});
// Has to live outside of previous describe block due tue .fail() bug:
test.describe("Expected to fail:", function () {
  test.fail("a 5xx code on a server error", async function ({ request }) {
    // GIVEN
    const VALID = "Test";
    // This is expected to fail when the server is not running
    // WHEN
    const RESPONSE = await request.get(`/${VALID}`);
    // THEN
    expect(RESPONSE.status()).toBeWithinRange(500, 599);
  });
});

test("Server runs", async function ({ request }) {
  // GIVEN
  // WHEN
  const RESPONSE = await request.get("/valid");
  // THEN
  expect(RESPONSE).resolves;
});
