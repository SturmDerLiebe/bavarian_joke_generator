"use strict";

import { jest, expect, test, describe, beforeEach } from "@jest/globals";
import mysql from "mysql2/promise";
// Internal:
import db_create_joke from "./create_joke_db.js";
import { get_connection_options } from "../../constants/db.js";

const JOKE_BYUSER = {
  text: "Joke text",
  explanation: "This is an explanation",
  submitted_by: "Alfreda",
};

const JOKE_ANONYMOUS = {
  text: "Joke text",
  explanation: "This is an explanation",
  submitted_by: "",
};
describe(//  Integration
"db_create_joke executes & returns the inserted id as a string for Jokes submitted", function () {
  test("by a user", async function () {
    // GIVEN JOKE_BYUSER

    // WHEN
    const RESULT = await db_create_joke(JOKE_BYUSER);

    // THEN
    expect(RESULT).toEqual(expect.any(String));
  });

  test("anonymously", async function () {
    // GIVEN JOKE_ANONYMOUS

    // WHEN
    const RESULT = await db_create_joke(JOKE_ANONYMOUS);

    // THEN
    expect(RESULT).toEqual(expect.any(String));
  });
});

describe(// Unit
"db_create_joke passes the correct arguments when", function () {
  let connection_mock;
  let execute_mock;
  // Bad path Mocks:
  beforeEach(function () {
    jest.restoreAllMocks();
    execute_mock = jest.fn().mockResolvedValue("1");
    connection_mock = jest.spyOn(mysql, "createConnection").mockResolvedValue({
      execute: execute_mock,
      end: jest.fn().mockResolvedValue(),
    });
  });

  test("connecting to the database", async function () {
    // GIVEN JOKE_BYUSER

    // WHEN
    await db_create_joke(JOKE_BYUSER);
    // THEN
    expect(connection_mock).toBeCalledWith(get_connection_options("create"));
  });

  test("querying the database", async function () {
    // GIVEN
    const { text, explanation, submitted_by } = JOKE_BYUSER;
    // WHEN
    await db_create_joke(JOKE_BYUSER);
    // THEN
    expect(execute_mock).toBeCalledWith(expect.any(String), [
      text,
      explanation,
      submitted_by,
    ]);
  });
});

describe(// Unit
"db_create_joke closes the connection", function () {
  jest.restoreAllMocks();
  test("if query rejects", async function () {
    // GIVEN
    let end_mock = jest.fn();
    mysql.createConnection = jest.fn().mockResolvedValue({
      execute: jest.fn().mockRejectedValue(),
      end: end_mock,
    });

    // WHEN
    try {
      await db_create_joke(JOKE_BYUSER);
    } catch {
      // THEN
      expect(end_mock).toBeCalled();
    }
  });
});
