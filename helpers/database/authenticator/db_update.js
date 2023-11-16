"use strict";

import mysql from "mysql2/promise";
import { get_connection_options } from "../../../constants/db.js";

/**
 * Update an authenticator's counter.
 * @param {string} auth_id
 * @param {number} new_counter
 * @param {import("mysql2").ConnectionOptions} [connection_options] - optional connection options
 * @throws {Error} If any connection error or similar happens.
 */
async function db_update_counter(auth_id, new_counter, connection_options) {
  const CONNECTION = await mysql.createConnection(
    connection_options || get_connection_options("authenticate"),
  );
  const QUERY = "UPDATE authenticator SET counter = ? WHERE id = ?;";
  try {
    await CONNECTION.execute(QUERY, [new_counter, auth_id]);
  } catch (error) {
    throw error;
  } finally {
    await CONNECTION.end();
  }
}

export { db_update_counter };
