"use strict";

import mysql from "mysql2/promise";
// Constants:
import { get_connection_options } from "../../constants/db.js";

/**
 * Reads all jokes from the databes matching the given {@link keyword}.
 * @param {string} keyword the keyword associated with a joke.
 * @param {import("mysql2").ConnectionOptions} [connection_options] - optional connection options
 * @returns {Promise<import("../../types/Joke.js").Joke[]>} Object containing the joke data or null if nothing was found.
 * @throws {Error} If any connection error or similar happens.
 */
async function db_read_joke(keyword, connection_options) {
  // Set up connection and queries:
  const CONNECTION = await mysql.createConnection(
    connection_options || get_connection_options("read"),
  );
  try {
    // The following SQL first joins the joke wih the keyword table and then joins with the user table wherever the user id matches
    const [ROWS] = await CONNECTION.execute(
      `
      SELECT j.id, j.content, j.explanation, IFNULL(u.username, 'Anonymous') AS submitted_by
      FROM joke AS j
      INNER JOIN jk_pair AS jkp ON j.id = jkp.joke_id
      INNER JOIN keyword AS k ON k.id = jkp.keyword_id
      LEFT JOIN user as u ON j.submitted_by = u.id
      WHERE k.title = ?;
`,
      [keyword],
    );
    return ROWS;
  } finally {
    await CONNECTION.end();
  }
}

export default db_read_joke;
