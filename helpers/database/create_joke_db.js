"use strict";

import mysql from "mysql2/promise";
// Constants:
import { get_connection_options } from "../../constants/db.js";

/**
 * Writes the joke to the database.
 * @param {import("../../types/Joke.js").Joke_Submission} joke - The joke object to be written to the database.
 * @returns {Promise<string>} id - The id of the inserted joke.
 * @throws {Error} If any connection error or similar happens.
 */
async function db_create_joke({
  content,
  explanation,
  submitted_by,
  keywords,
}) {
  const CONNECTION = await mysql.createConnection(
    get_connection_options("create"),
  );
  try {
    // The following Query inserts the joke, inserts the keywords if they are new
    // and inserts the joke-keyword pairs.
    const [RESULT_HEADER] = await CONNECTION.execute(
      `
        START TRANSACTION;
          INSERT INTO joke (content, explanation, submitted_by) VALUES(?, ?, ?);
          SET @j_id = LAST_INSERT_ID();
          ${repeat_INSERT_for_keywords(keywords)}
        COMMIT;
      `,
      [
        content,
        explanation,
        !submitted_by ? null : user_id, // Insert anonymous submitters (="") as NULL
        ...keywords, // spread keywords so that every single on gets prepared
      ],
    );
    return RESULT_HEADER.insertId;
  } finally {
    await CONNECTION.end();
  }
}

/**
 * @param {string[]} keywords - An array of keywords to be used in a query.
 */
function repeat_INSERT_for_keywords(keywords) {
  return (sql_query = keywords
    .map(function() {
      return `
      SET @k_title = ?;
      INSERT INTO keyword (title) VALUES(@k_title) ON DUPLICATE KEY UPDATE title=title;
      INSERT INTO jk_pair (joke_id, keyword_title) VALUES(@j_id, @k_title);
      `;
    })
    .join(""));
}

export default db_create_joke;
