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
      // TODO: Increment keyword.times_searched by one in trannsaction
      `
      SELECT
          j.id,
          j.content,
          j.explanation,
          IF(
              j.submitted_by IS NOT NULL,
              u.username,
              'Anonymous'
          ) AS submitted_by
      FROM joke AS j
      INNER JOIN jk_pair AS jkp ON j.id = jkp.joke_id
      INNER JOIN keyword AS k ON jkp.keyword_id = k.id
      LEFT JOIN user AS u ON j.submitted_by = u.id
      WHERE k.title = ?;

      `,
      [keyword],
    );
    return ROWS;
  } finally {
    await CONNECTION.end();
  }
}

/**
 * Reads one joke associated with the given joke id.
 * @param {string} id - the alphanumeric string with the joke id.
 * @throws on any Database error.
 * @returns {Promise<import("../../types/Joke.js").Joke>} the data of a singel joke.
 */
async function db_read_single_joke(id, connection_options) {
  const CONNECTION = await mysql.createConnection(
    connection_options || get_connection_options("read"),
  );
  try {
    const [[JOKE_DATA]] = await CONNECTION.execute(
      `
      SELECT
          j.content,
          j.explanation,
          IF(
              j.submitted_by IS NOT NULL,
              u.username,
              'Anonymous'
          ) AS submitted_by
      FROM joke AS j
      LEFT JOIN user AS u ON j.submitted_by = u.id
      WHERE j.id = ?;
      `,
      [id],
    );
    return JOKE_DATA;
  } finally {
    await CONNECTION.end();
  }
}

export default db_read_joke;

export { db_read_single_joke };
