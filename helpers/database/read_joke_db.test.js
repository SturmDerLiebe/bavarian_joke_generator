"use strict";

import { jest, expect, test, describe, beforeEach } from "@jest/globals";
import mysql from "mysql2/promise";
// Internal:
import db_read_joke from "./read_joke_db.js";
// Constants
import {
  EXISTING_KEYWORD,
  NONEXISTING_KEYWORD,
  READ_OPTIONS,
} from "../../constants/test.js";

/*–––––––––––––––––––––––––––– Integration-Unit —–––––––––––––––––––––––––––––––*/
describe("db_read_joke", function () {
  test("returns empty array for keywords not paired with a joke", async function () {
    // GIVEN
    // WHEN
    const JOKE_DATA = await db_read_joke(NONEXISTING_KEYWORD, READ_OPTIONS);
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
    await expect(
      db_read_joke(EXISTING_KEYWORD, READ_OPTIONS),
    ).rejects.toThrow();
    // THEN
    expect(end).toBeCalled();
  });
});
