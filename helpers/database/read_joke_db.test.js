"use strict";

import { expect, test, describe } from "@jest/globals";
// Internal:
import db_read_joke from "./read_joke_db.js";
import db_create_joke from "./create_joke_db.js";
// Constants
import {
  CREATE_ARGS_ANONYMOUS,
  CREATE_ARGS_BYUSER,
  EXISTING_KEYWORD,
  JOKE_RESULT,
  NONEXISTING_KEYWORD,
} from "../../constants/test.js";

describe("db_read_joke", function () {
  test(", given an existing keyword, returns all jokes' data in an array", async function () {
    // GIVEN the keyword exists in the db and has two jokes associated with it:
    await Promise.all([
      db_create_joke(CREATE_ARGS_BYUSER),
      db_create_joke(CREATE_ARGS_ANONYMOUS),
    ]);

    // WHEN the function is called:
    const JOKE_DATA = await db_read_joke(EXISTING_KEYWORD);

    // THEN it should return an array of two joke data objects:
    expect(JOKE_DATA).toEqual(expect.arrayContaining(JOKE_RESULT));
  });

  test(", given a keyword not present yet, returns null", async function () {
    // GIVEN the keyword does not exist
    // WHEN the function is called:
    const JOKE_DATA = await db_read_joke(NONEXISTING_KEYWORD);
    // THEN it should return null:
    expect(JOKE_DATA).toHaveLength(0);
  });
});
