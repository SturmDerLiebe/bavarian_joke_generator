"use strict";

import mysql from "mysql2/promise";
// Constants:
import { get_connection_options } from "../../constants/db.js";

/**
 * Writes the joke to the database.
 * @param {import("../../types/Joke.js").Joke} joke - The joke object to be written to the database.
 * @returns {Promise<string>} id - The id of the inserted joke.
 * @throws {Error} If any connection error or similar happens.
 */
async function db_create_joke({ text, explanation, submitted_by }) {
  const CONNECTION = await mysql.createConnection(
    get_connection_options("create"),
  );
  try {
    const [RESULT_HEADER] = await CONNECTION.execute(``, [
      text,
      explanation,
      submitted_by,
    ]);
    return RESULT_HEADER.insertId;
  } finally {
    await CONNECTION.end();
  }
}

export default db_create_joke;
