"use strict";

import { expect, test } from "@playwright/test";

test("User searching with an existing keyword should receive a joke", async function ({
  request,
}) {
  // GIVEN the requested Keyword exists and has a joke in our database:
  const TEXT = "Funny joke, Haha!";
  const KEYWORD = "dummy_keyword";
  await db_write_joke(KEYWORD, TEXT);
  // When the user requests a joke with that keyword:
  const RESPONSE = await request.get(
    `/user/read_joke/?${new URLSearchParams().append("keyword", KEYWORD)}`,
  );
  const JOKE = await RESPONSE.json();
  // Then the user should get a successful response with the given joke and an explanation:
  await expect(RESPONSE).toBeOK();
  expect(JOKE).toMatchObject({ joke: JOKE });
  expect(JOKE).toHaveProperty("explanation");
});

test("User searching with a non existing keyword should receive an error response", async function ({
  request,
}) {
  // GIVEN the Keyword does not exist yet:
  const KEYWORD = "dummy_keyword";
  // WHEN the user requests a joke with that keyword:
  const RESPONSE = await request.get(
    `/user/read_joke/?${new URLSearchParams().append("keyword", KEYWORD)}`,
  );
  // THEN the API should respond with a 4xx Code:
  expect(RESPONSE.status).toBeWithinRange(400, 499);
});
