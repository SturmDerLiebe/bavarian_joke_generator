"use strict";

import { jest, expect, test, describe, beforeEach } from "@jest/globals";
import mysql from "mysql2/promise";
// Internal:
import db_read_joke, { db_read_single_joke } from "./read_joke_db.js";
import delete_all_jokes_and_keywords from "../test/delete_jokes.js";
// Constants
import { EXISTING_KEYWORD, NONEXISTING_KEYWORD } from "../../constants/test.js";
import { READ_OPTIONS } from "../../constants/connections.js";

beforeAll(async function () {
  await delete_all_jokes_and_keywords();
});

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

/*————————————————————————— Unit ————————————————————————————————————————————*/
describe("On Error or Rejection db_read_joke", function () {
  afterAll(() => jest.restoreAllMocks());

  test("closes the connection", async function () {
    // GIVEN
    let end = jest.fn().mockResolvedValue();
    jest.spyOn(mysql, "createConnection").mockResolvedValue({
      execute: jest.fn().mockRejectedValue(new Error()),
      end,
    });
    // WHEN
    await expect(
      db_read_joke(EXISTING_KEYWORD, READ_OPTIONS),
    ).rejects.toThrow();
    // THEN
    expect(end).toBeCalled();
  });
});

describe("When reading a single Joke", function () {
  afterAll(() => jest.restoreAllMocks());
  /*—————————————————————— Integration-Unit ——————————————————————————————————*/
  test("with a nonexistend id, empty array is returned", async function () {
    // GIVEN
    // WHEN
    const JOKE = await db_read_single_joke("1", READ_OPTIONS);
    // THEN
    expect(JOKE).toBeUndefined();
  });

  test("on error, connection is closed", async function () {
    // GIVEN
    let end = jest.fn().mockResolvedValue();
    jest.spyOn(mysql, "createConnection").mockResolvedValue({
      execute: jest.fn().mockRejectedValue(new Error()),
      end,
    });
    // WHEN
    await expect(db_read_single_joke("1", READ_OPTIONS)).rejects.toThrow();
    // THEN
    expect(end).toBeCalled();
  });
});
