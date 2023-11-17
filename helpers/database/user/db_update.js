"use strict";

import mysql from "mysql2/promise";
import { get_connection_options } from "../../../constants/db.js";

/**
 * Updates the current challange of a user needed for authentication.
 * @param {string} user_id
 * @param {string} new_challange
 * @param {import("mysql2").ConnectionOptions} [connection_options] - optional connection options
 * @throws {Error} If any connection error or similar happens.
 */
async function db_update_challange(user_id, new_challange, connection_options) {
  const CONNECTION = await mysql.createConnection(
    connection_options || get_connection_options("authenticate"),
  );
  const QUERY = "UPDATE users SET current_challange = ? WHERE id = ?;";

  try {
    await CONNECTION.execute(QUERY, [new_challange, user_id]);
  } catch (error) {
    throw error;
  } finally {
    await CONNECTION.end();
  }
}

export { db_update_challange };
