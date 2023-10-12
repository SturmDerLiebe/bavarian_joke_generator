"use strict"

import mysql from "mysql2/promise";
// Constants:
import { USERS, DATABASE_NAME } from "../../constants/db.js";

const USER = USERS.reader;


/**
  * A joke entity.
  * @typedef {Object} Joke
  * @property {string} id - The identifier of this joke. MySQL should return this as a string not BigInt
  * @property {string} text - The content of this joke.
  * @property {string} explanation - The explanation if this joke.
  */

/**
  * Reads all jokes from the databes matching the given {@link keyword}.
  * @param {string} keyword the keyword associated with a joke.
  * @returns {Promise<Joke[]>} Object containing the joke data or null if nothing was found.
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
    bigNumberStrings: true
  });
  try {
    // The following SQL first joins the joke wih the keyword table and then joins with the user table wherever the user id matches
    const [RESULT] = await CONNECTION.execute(`
      SELECT j.id, j.content, j.explanation, u.username AS submitted_by
      FROM joke AS j
      INNER JOIN jk_pair AS jkp ON j.id = jkp.joke_id
      INNER JOIN keyword AS k ON jkp.keyword_id = k.id
      LEFT JOIN user as u ON j.submitted_by = u.id
      WHERE k.title = ?;
`,
      [keyword]
    );
    return RESULT;
  } finally {
    await CONNECTION.end();
  }
}

export default db_read_joke;
