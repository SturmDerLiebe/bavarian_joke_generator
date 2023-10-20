"use strict";

import { jest, expect, test, describe, beforeEach } from "@jest/globals";
import mysql from "mysql2/promise";
// Internal:
import db_create_joke from "./create_joke_db.js";
import { get_connection_options } from "../../constants/db.js";
import {
  CREATE_ARGS_ANONYMOUS,
  CREATE_ARGS_BYUSER,
} from "../../constants/test.js";

//  Integration
describe("db_create_joke executes properly & returns the inserted id for Jokes submitted", function () {
  test("by a user", async function () {
    // GIVEN
    // CREATE_ARGS_BYUSER

    // WHEN
    const RESULT = await db_create_joke(CREATE_ARGS_BYUSER);

    // THEN
    expect(RESULT).toEqual(expect.any(String));
  });

  test("anonymously", async function () {
    // GIVEN
    // CREAT_ARGS_ANONYMOUS

    // WHEN
    const RESULT = await db_create_joke(CREATE_ARGS_ANONYMOUS);

    // THEN
    expect(RESULT).toEqual(expect.any(Number));
  });
});

describe(// Unit
"On Error or Rejection db_create_joke", function () {
  let rollback;
  let end;
  beforeEach(function () {
    end = jest.fn().mockResolvedValue();
    rollback = jest.fn().mockResolvedValue();
    mysql.createConnection = jest.fn().mockResolvedValue({
      beginTransaction: jest.fn().mockRejectedValue(),
      rollback,
      end,
    });
  });

  test("rolls back the transaction", async function () {
    // GIVEN
    //   createConnection mock
    // WHEN
    try {
      await db_create_joke(CREATE_ARGS_ANONYMOUS);
    } catch {
      // Then
      expect(rollback).toBeCalled();
    }
  });
  test("closes the connection", async function () {
    // GIVEN

    // WHEN
    try {
      await db_create_joke(CREATE_ARGS_ANONYMOUS);
    } catch {
    } finally {
      // THEN
      expect(end).toBeCalled();
    }
  });
});
