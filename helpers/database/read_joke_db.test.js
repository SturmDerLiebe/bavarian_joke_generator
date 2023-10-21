"use strict";

import { jest, expect, test, describe, beforeEach } from "@jest/globals";
import mysql from "mysql2/promise";
// Internal:
import db_read_joke from "./read_joke_db.js";
import db_create_joke from "./create_joke_db.js";
// Constants
import {
  CREATE_ARGS_ANONYMOUS,
  CREATE_ARGS_BYUSER,
  EXISTING_KEYWORD,
  ANONYMOUS_JOKE,
  NONEXISTING_KEYWORD,
  USER_JOKE,
} from "../../constants/test.js";

describe("db_read_joke returns jokes", function () {
  test("of anonymous submitters", async function () {
    // GIVEN
    await Promise.all([
      db_create_joke(CREATE_ARGS_ANONYMOUS),
      db_create_joke(CREATE_ARGS_ANONYMOUS),
    ]);

    // WHEN
    const JOKE_DATA = await db_read_joke(EXISTING_KEYWORD);

    // THEN it should return an array of two joke data objects:
    expect(JOKE_DATA).toEqual(
      expect.arrayContaining([ANONYMOUS_JOKE, ANONYMOUS_JOKE]),
    );
  });

  test("of registered users", async function () {
    // GIVEN
    await Promise.all([
      db_create_joke(CREATE_ARGS_BYUSER),
      db_create_joke(CREATE_ARGS_BYUSER),
    ]);

    // WHEN
    const JOKE_DATA = await db_read_joke(EXISTING_KEYWORD);

    // THEN it should return an array of two joke data objects:
    expect(JOKE_DATA).toEqual(expect.arrayContaining([USER_JOKE, USER_JOKE]));
  });
});

describe("db_read_joke", function () {
  test("returns empty array for keywords not paired with a joke", async function () {
    // GIVEN
    // WHEN
    const JOKE_DATA = await db_read_joke(NONEXISTING_KEYWORD);
    // THEN
    expect(JOKE_DATA).toHaveLength(0);
  });
});

// Unit
describe("On Error or Rejection db_read_joke", function () {
  let end;
  beforeEach(function () {
    end = jest.fn().mockResolvedValue();
    mysql.createConnection = jest.fn().mockResolvedValue({
      execute: jest.fn().mockRejectedValue(new Error()),
      end,
    });
  });

  test("closes the connection", async function () {
    // GIVEN
    // WHEN
    await expect(db_read_joke(EXISTING_KEYWORD)).rejects.toThrow();
    // THEN
    expect(end).toBeCalled();
  });
});
