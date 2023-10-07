"use strict"

import mysql from "mysql2/promise";
// Constants:
import { USERS, DATABASE_NAME } from "../../constants/db.js";

const USER = USERS.reader;


/**
  * A joke entity.
  * @typedef {Object} Joke
  * @property {bigint} id - The identifier of this joke.
  * @property {string} text - The content of this joke.
  * @property {string} explanation - The explanation if this joke.
  */

/**
  * Reads all jokes from the databes matching the given {@link keyword}.
  * @param {string} keyword the keyword associated with a joke.
  * @returns {(Joke[])} Object containing the joke data or null if nothing was found.
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
    const [RESULT] = await CONNECTION.execute(`
      SELECT joke.id, joke.content, joke.explanation, joke.submitted_by
      FROM joke
      INNER JOIN jk_pair ON joke.id = jk_pair.joke_id
      INNER JOIN keyword ON jk_pair.keyword_id = keyword.id
      WHERE keyword.title = ?;
`,
      [keyword]
    );
    return RESULT;
  } finally {
    await CONNECTION.end();
  }
}

export default db_read_joke;
