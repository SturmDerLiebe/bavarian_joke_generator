"use strict"

import { expect, test, describe } from "@jest/globals";
import db_read_joke from "./read_joke_db.js";

const KEYWORD = "Dummy";
describe("db_read_joke", function() {
  test(", given an existing keyword, returns all jokes' data in an array",
    async function() {
      // GIVEN the keyword exists in the db and has two jokes associated with it:
      const DUMMY_JOKE = "Lorem Ipsum"
      const DUMMY_EXPLANATION = "This explains everything"
      const USER = "Mark";
      await write_joke_db(DUMMY_JOKE, DUMMY_EXPLANATION, KEYWORD);
      await write_joke_db(DUMMY_JOKE, DUMMY_EXPLANATION, KEYWORD, USER);

      // WHEN the function is called:
      const JOKE_DATA = await db_read_joke(KEYWORD);

      // THEN it should return an array of two joke data objects: 
      const DUMMY_DATA1 = {
        id: expect.any(String),
        text: DUMMY_JOKE,
        explanation: DUMMY_EXPLANATION,
        submitted_by: null
      }
      const DUMMY_DATA2 = { ...DUMMY_DATA1, submitted_by: USER };
      expect(JOKE_DATA).toEqual([DUMMY_DATA1, DUMMY_DATA2]);
    });

  test(", given a keyword not present yet, returns null", async function() {
    // GIVEN the keyword does not exist
    // WHEN the function is called:
    const JOKE_DATA = await db_read_joke(KEYWORD);
    // THEN it should return null:
    expect(JOKE_DATA).toBeNull();
  });
});
