"use strict";

import { test, expect } from "@playwright/test";
import { SINGLE_SUBMISSION } from "../../constants/playwright";

/*–––––––––––––––––––––––––––––––GET / ––––––––––––––––––––––––––––––––––––––*/
test.describe("On Error the / route responds with", function () {
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

/*––––––––––––––––––––––––––––––– GET /submit ––––––––––––––––––––––––––––––*/
test.describe("On route /submit", function () {
  test("invalid joke content responds with 400 code", async function ({
    request,
  }) {
    // GIVEN
    // WHEN
    const RESPONSE = await request.post("/submit", {
      form: { ...SINGLE_SUBMISSION, content: "" },
    });
    // THEN
    expect(RESPONSE.status()).toBe(400);
  });

  test("invalid explanation content responds with 400 code", async function ({
    request,
  }) {
    // GIVEN
    // WHEN
    const RESPONSE = await request.post("/submit", {
      form: { ...SINGLE_SUBMISSION, explanation: "" },
    });
    // THEN
    expect(RESPONSE.status()).toBe(400);
  });

  test("Valid Joke input data, should respond with 303 code", async function ({
    request,
  }) {
    // GIVEN
    // WHEN
    const RESPONSE = await request.post("/submit", {
      form: SINGLE_SUBMISSION,
    });
    // THEN
    expect(RESPONSE.url()).toMatch(/\/joke\?id=\d+/);
  });

  test("Duplicate joke submission, should respond with 409 code", async function ({
    request,
  }) {
    test.fail();
    // GIVEN
    await request.post("/submit", {
      form: SINGLE_SUBMISSION,
    });

    // WHEN
    const RESPONSE = await request.post("/submit", {
      form: SINGLE_SUBMISSION,
    });
    // THEN
    expect(RESPONSE.status()).toBe(409);
  });
});
