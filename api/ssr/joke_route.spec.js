"use strict";

import { test, expect } from "@playwright/test";
import { db_insert_joke } from "../../helpers/database/create_joke_db";
import { DISTINCT_CREATE_ARGS } from "../../constants/playwright";

test.afterEach(async () => {
  await delete_all_jokes_and_keywords();
});

/*––––––––––––––––––––––––––––––– GET /joke?id ––––––––––––––––––––––––––––––––––––––*/
test.describe("A user can see one joke by requesting it with", function () {
  test("an existing id. They should receive a 200 code.", async function ({
    request,
  }) {
    // GIVEN
    const INSERTED_ID = await db_insert_joke(DISTINCT_CREATE_ARGS);
    // WHEN
    const RESPONSE = await request.get(`/joke?id=${INSERTED_ID}`);
    // THEN
    expect(RESPONSE.status()).toBe(200);
  });

  test.fail(
    "a non-existent id. They should receive a 404 code.",
    async function ({ request }) {
      // GIVEN
      // WHEN
      const RESPONSE = await request.get(`/joke?id=1`);
      // THEN
      expect(RESPONSE.status()).toBe(404);
    },
  );
});
