"use strict";

import mysql from "mysql2/promise";
// Constants:
import { get_connection_options } from "../../constants/db.js";

/**
 * Clears the joke, keyword and via cascade also jk_pair from all data
 * **Only used for testing**
 * @private
 */
async function delete_all_jokes_and_keywords() {
  const CONNECTION = await mysql.createConnection({
    ...get_connection_options("read"),
    host: process.env.DB_EXTERNAL_HOST,
    user: "tester",
    password: "testerPW",
  });
  try {
    await CONNECTION.execute(`DELETE FROM joke;`);
    await CONNECTION.execute(`DELETE FROM keyword;`);
  } finally {
    await CONNECTION.end();
  }
}

export default delete_all_jokes_and_keywords;
