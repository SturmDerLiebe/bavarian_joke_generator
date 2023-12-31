"use strict";

import mysql from "mysql2/promise";
// Constants:
import { get_connection_options } from "../../constants/db.js";
import { Duplicate_Error } from "../../library/Errors.js";

/**
 * Writes the joke to the database.
 * @param {import("../../types/Joke.js").Joke_Submission} joke - The joke object to be written to the database.
 * @param {import("mysql2").ConnectionOptions} [connection_options] - optional connection options
 * @returns {Promise<string>} id - The id of the inserted joke.
 * @throws {Error} If any connection error or similar happens.
 */
async function db_create_joke(
  { content, explanation, submitted_by: submitted_by_user, keywords },
  connection_options,
) {
  // Set up connection and queries:
  const CONNECTION = await mysql.createConnection(
    connection_options || get_connection_options("create"),
  );

  /**
   * A group of queries that insert only one joke, then insert the keywords if they are new and then inserts the joke-keyword pairs.
   * @type {QP_Pair[]}
   */
  const QUERIES = [
    [
      `
INSERT INTO joke (content, explanation, submitted_by)
VALUES (
    ?, ?,
    (SELECT id FROM users WHERE username = ?)
);
`,
      [content, explanation, submitted_by_user || null], // Insert anonymous submitters (="") as NULL
    ],
    ["SET @j_id = LAST_INSERT_ID();"], // Save new joke_id for following inserts
  ].concat(repeat_keyword_INSERT(keywords));

  try {
    await CONNECTION.beginTransaction();
    /**
     * The data of the first executed query and from that, only the Result Data.
     */
    const [[JOKE_HEADER]] = await Promise.all(
      execute_query(CONNECTION, QUERIES),
    );
    await CONNECTION.commit();

    // BIGINT should be returned as string
    return JOKE_HEADER.insertId;
  } catch (error) {
    await CONNECTION.rollback();
    if (error.errno === 1062) {
      // https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html#error_er_dup_entry
      throw new Duplicate_Error("The Joke already exists in our database");
    }
    throw error;
  } finally {
    await CONNECTION.end();
  }
}

/**
 * Type of a Query-Parameter-Pair.
 * @typedef {[string, string[]|undefined]} QP_Pair
 */

/**
 * Executes multiple queries on a connection and returns all ongoing queries in an array.
 * @param {mysql.Connection} connection - The connection to execute the queries on.
 * @param {QP_Pair[]} queries - An array of queries to be executed.
 * @returns {import("../../types/Database.js").Mysql2_Insertion_Return_Data[]}
 */
function execute_query(connection, queries) {
  return queries.map(function (query) {
    const PARAMS = query[1];
    return connection.execute(query[0], PARAMS || null);
  });
}

/**
 * Creates an array with the query-parameter-pairs for all keywords.
 * @param {string[]} keywords - Keywords to be inserted.
 * @returns {QP_Pair[]} queries - An array if queries that can be used for execution.
 */
function repeat_keyword_INSERT(keywords) {
  return keywords.flatMap(function (keyword) {
    return [
      [
        // ON DUPLICATE will change the id! That's why LAST_INSERT_ID() should not be used!
        "INSERT INTO keyword (title) VALUES (?) ON DUPLICATE KEY UPDATE title=title;",
        [keyword],
      ],
      ["SET @k_id = (SELECT id FROM keyword WHERE title = ?);", [keyword]],
      ["INSERT INTO jk_pair (joke_id, keyword_id) VALUES (@j_id, @k_id);"],
    ];
  });
}

export default db_create_joke;
export { db_create_joke as db_insert_joke };
