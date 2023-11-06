"use strict";

import { expect, test, describe, beforeEach } from "@jest/globals";
// Internal:
import db_read_joke from "./read_joke_db.js";
import db_create_joke from "./create_joke_db.js";
import delete_all_jokes_and_keywords from "../test/delete_jokes.js";
// Constants
import {
  CREATE_ARGS_ANONYMOUS,
  CREATE_ARGS_BYUSER,
  EXISTING_KEYWORD,
  ANONYMOUS_JOKE,
  USER_JOKE,
  INSERT_OPTIONS,
  READ_OPTIONS,
} from "../../constants/test.js";

/*–––––––––––––––––––––––––––– Integration —–––––––––––––––––––––––––––––––*/
describe("A jokw is  read correctly from the database, when it is written by", function () {
  beforeEach(async function () {
    await delete_all_jokes_and_keywords();
  });

  test("an anonymous submitter", async function () {
    // GIVEN
    await Promise.all([
      db_create_joke(CREATE_ARGS_ANONYMOUS, INSERT_OPTIONS),
      db_create_joke(CREATE_ARGS_ANONYMOUS, INSERT_OPTIONS),
    ]);

    // WHEN
    const JOKE_DATA = await db_read_joke(EXISTING_KEYWORD, READ_OPTIONS);

    // THEN it should return an array of two joke data objects:
    expect(JOKE_DATA).toEqual(
      expect.arrayContaining([ANONYMOUS_JOKE, ANONYMOUS_JOKE]),
    );
  });

  // Expected to fail until users are implemented
  test.failing("a registered user", async function () {
    // GIVEN
    await Promise.all([
      db_create_joke(CREATE_ARGS_BYUSER, INSERT_OPTIONS),
      db_create_joke(CREATE_ARGS_BYUSER, INSERT_OPTIONS),
    ]);

    // WHEN
    const JOKE_DATA = await db_read_joke(EXISTING_KEYWORD, READ_OPTIONS);

    // THEN it should return an array of two joke data objects:
    expect(JOKE_DATA).toEqual(expect.arrayContaining([USER_JOKE, USER_JOKE]));
  });
});
