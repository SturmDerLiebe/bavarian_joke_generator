"use strict";

import mysql from "mysql2/promise";
// Constants:
import { USERS, DATABASE_NAME } from "../../constants/db.js";

const USER = USERS.reader;

/**
 * Reads all jokes from the databes matching the given {@link keyword}.
 * @param {string} keyword the keyword associated with a joke.
 * @returns {Promise<import("../../types/Joke.js").Joke[]>} Object containing the joke data or null if nothing was found.
 * @throws {Error} If any connection error or similar happens.
 */
async function db_read_joke(keyword) {
  const CONNECTION = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: USER,
    password: process.env[`DB_PW_${USER.toUpperCase()}`],
    database: DATABASE_NAME,
    supportBigNumbers: true,
    bigNumberStrings: true,
  });
  try {
    // The following SQL first joins the joke wih the keyword table and then joins with the user table wherever the user id matches
    const [ROWS] = await CONNECTION.execute(
      `
      SELECT j.id, j.content, j.explanation, IFNULL(u.username, 'Anonymous') AS submitted_by
      FROM joke AS j
      INNER JOIN jk_pair AS jkp ON j.id = jkp.joke_id
      LEFT JOIN user as u ON j.submitted_by = u.id
      WHERE jkp.keyword_title = ?;
`,
      [keyword],
    );
    return ROWS;
  } finally {
    await CONNECTION.end();
  }
}

export default db_read_joke;
