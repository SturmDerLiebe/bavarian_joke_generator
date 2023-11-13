"use strict";

import mysql from "mysql2/promise";
// Constants:
import { get_connection_options } from "../../constants/db.js";

/**
 * Clears the users and authenticaotr table froma ll data
 * **Only used for testing**
 * @private
 */
async function delete_all_users_and_authenticators() {
  const CONNECTION = await mysql.createConnection({
    ...get_connection_options("read"),
    host: process.env.DB_EXTERNAL_HOST,
    user: "tester",
    password: "testerPW",
  });
  try {
    await CONNECTION.execute(`DELETE FROM users;`);
    await CONNECTION.execute(`DELETE FROM authenticator;`);
  } finally {
    await CONNECTION.end();
  }
}

export { delete_all_users_and_authenticators };
