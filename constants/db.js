"use strict";

/**
 * The user to access the database
 * @readonly
 * @enum {string}
 */
const USERS = {
  /** User with SELECT privileges only */
  reader: "reader",
  submitter: "submitter",
  loggeed_in_user: "logged_in_user",
};

/**
 * The main database
 * @readonly
 */
const DATABASE_NAME = "bavarian_jokes";

/**
 * @typedef {Object} Connection_Options
 * @property {string} host - Host address e.g. localhost.
 * @property {number} port - Port to connect to.
 * @property {"reader"|"submitter"} user - The specific user to use for your query.
 * @property {string} password - The password of the respective user.
 * @property {string} database - Name of the database to connect to.
 * @property {true} supportBigNumbers - When dealing with big numbers (BIGINT and DECIMAL columns) in the database, you should enable this option.
 * @property {true} bigNumberStrings - Enabling both supportBigNumbers and bigNumberStrings forces big numbers (BIGINT and DECIMAL columns) to be always returned as JavaScript String objects.
 */

/**
 * Get the options object to connect to the mysql db with the correct user.
 * @param {"create"|"read"} action the action to be executed with your connection.
 * @returns {Connection_Options} mysql_connection_options - Options object to be passed to mysql.createConnection().
 * @throws {Error} If the {@link action} argument has no user for it yet.
 */
function get_connection_options(action) {
  let user;
  switch (action) {
    case "create":
      user = USERS.submitter;
      break;
    case "read":
      user = USERS.reader;
      break;
    default:
      throw new Error(`The action ${action} is not defined yet`);
  }
  return {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: user,
    password: process.env[`DB_PW_${user.toUpperCase()}`],
    database: DATABASE_NAME,
    supportBigNumbers: true,
    bigNumberStrings: true,
  };
}

export { USERS, DATABASE_NAME, get_connection_options };
