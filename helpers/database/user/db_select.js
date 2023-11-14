"use strict";

import mysql from "mysql2/promise";
import { get_connection_options } from "../../../constants/db.js";

/**
 * Read the current challange of a user.
 * @param {string} user_id
 * @param {import("mysql2").ConnectionOptions} [connection_options] - optional connection options
 * @returns {Promise<string>} currentChallange
 * @throws {Error} If any connection error or similar happens.
 */
async function db_select_challange(user_id, connection_options) {
  const CONNECTION = await mysql.createConnection(
    connection_options || get_connection_options("authenticate"),
  );
  const QUERY =
    "SELECT current_challange AS 'currentChallange' FROM users WHERE users.id = ?;";

  try {
    /**
     * Array od Row Data and Field Data packet arrays
     * @type {import("../../../types/Database.js").Mysql2_Selection_Return_Data}
     */
    const [[CHALLANGE]] = await CONNECTION.execute(QUERY, [user_id]);
    console.debug(CHALLANGE);
    return CHALLANGE.currentChallange;
  } catch (error) {
    // TODO: Check if there are any errors to handle here.
    throw new Error(error);
  } finally {
    await CONNECTION.end();
  }
}

export { db_select_challange };
