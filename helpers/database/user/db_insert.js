"use strict";

import mysql from "mysql2/promise";
import { get_connection_options } from "../../../constants/db.js";
import { Duplicate_Error } from "../../../library/Errors.js";
// Constants:

/**
 * Inserts a user into the database.
 * @param {string} username
 * @param {import("mysql2").ConnectionOptions} [connection_options] - optional connection options
 * @returns {Promise<string>} id - The id of the inserted user.
 * @throws {Error} If any connection error or similar happens.
 */
async function db_insert_user(username, connection_options) {
  const CONNECTION = await mysql.createConnection(
    connection_options || get_connection_options("authenticate"),
  );
  const QUERY = "INSERT INTO users(username) VALUES(?);";

  try {
    /**
     * Only the Result data
     * @type {import("../../../types/Database.js").Mysql2_Insertion_Return_Data}
     */
    const [USER_HEADER] = await CONNECTION.execute(QUERY, [username]);
    return USER_HEADER.insertId; // BIGINTs will be returned as string
  } catch (error) {
    if (error.errno === 1062) {
      // DUPLICATE ERROR
      // https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html#error_er_dup_entry
      throw new Duplicate_Error("The username is already taken");
    }
    throw error;
  } finally {
    await CONNECTION.end();
  }
}

export { db_insert_user };
