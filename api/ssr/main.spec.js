"use strict";

import { test, expect } from "@playwright/test";
import {
  DUPLICATE_CREATE_ARGS,
  SINGLE_SUBMISSION,
} from "../../constants/playwright";
import { afterEach } from "node:test";
import delete_all_jokes_and_keywords from "../../helpers/test/delete_jokes";
import { db_insert_joke } from "../../helpers/database/create_joke_db";

/*–––––––––––––––––––––––––––––––GET /?keyword ––––––––––––––––––––––––––––––––––––––*/
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
test("a 5xx code on a server error", async function ({ request }) {
  test.fail();
  // GIVEN
  const VALID = "Test";
  // This is expected to fail when the server is not running
  // WHEN
  const RESPONSE = await request.get(`/${VALID}`);
  // THEN
  expect(RESPONSE.status()).toBeWithinRange(500, 599);
});

test("Server runs", async function ({ request }) {
  // GIVEN
  // WHEN
  const RESPONSE = await request.get("/");
  // THEN
  expect(RESPONSE).resolves;
});

/*––––––––––––––––––––––––––––––– POST /submit ––––––––––––––––––––––––––––––*/
test.describe("On route /submit", function () {
  test.afterEach(async () => {
    await delete_all_jokes_and_keywords();
  });

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

  test("Valid joke input data, should respond with correct redirect", async function ({
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
    await db_insert_joke(DUPLICATE_CREATE_ARGS[0]);

    // WHEN
    const RESPONSE = await request.post("/submit", {
      form: SINGLE_SUBMISSION,
    });
    // THEN
    expect(RESPONSE.status()).toBe(409);
  });
});
