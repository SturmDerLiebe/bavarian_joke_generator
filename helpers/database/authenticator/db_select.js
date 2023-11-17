"use strict";

import mysql from "mysql2/promise";
import { get_connection_options } from "../../../constants/db.js";
import { Not_Found_Error } from "../../../library/Errors.js";

/**
 * Selects all authenticators of a user from the database.
 * @param {string} username
 * @param {import("mysql2").ConnectionOptions} [connection_options] - optional connection options
 * @returns {Promise<[import("../../../types/Joke.js").Authenticator[], string]>} a pair of the authenticators and the user's id
 * @throws {Error} If any connection error or similar happens.
 */
async function db_select_authenticators(username, connection_options) {
  const CONNECTION = await mysql.createConnection(
    connection_options || get_connection_options("authenticate"),
  );
  const QUERY = `
SELECT
    a.user_id AS user_id,
    a.credential_id AS 'credentialID',
    a.credential_public_key AS 'credentialPublicKey',
    a.counter,
    a.credential_device_type AS 'credentialDeviceType',
    a.credential_backed_up AS 'credentialBackedUp',
    a.transports
FROM authenticator AS a
INNER JOIN users AS u ON a.id = u.id
WHERE u.username = ?;
`;
  try {
    /**
     * Array of Row Data Packet arrays and Field Data Packet arrays
     * @type {import("../../../types/Database.js").Mysql2_Selection_Return_Data}
     */
    const [Authenticators] = await CONNECTION.execute(QUERY, [username]);

    if (!Authenticators.length) {
      throw new Not_Found_Error(
        "The User you are trying to sign in as, does not exist yet",
      );
    }
    return [
      Authenticators.map(convert_db_to_simplewebauthn),
      Authenticators[0].user_id,
    ];
  } catch (error) {
    throw error;
  } finally {
    await CONNECTION.end();
  }
}

/**
 * Select a single authenticator of a user from the database.
 * @param {string} user_id
 * @param {Uint8Array} credential_id
 * @param {import("mysql2").ConnectionOptions} [connection_options] - optional connection options
 * @returns {Promise<[import("../../../types/Joke.js").Authenticator, string]>} a pair of the authenticators and the authenticator id
 * @throws {Error} If any connection error or similar happens.
 */
async function db_select_single_authenticator(
  user_id,
  credential_id,
  connection_options,
) {
  const CONNECTION = await mysql.createConnection(
    connection_options || get_connection_options("authenticate"),
  );
  const QUERY = `
SELECT
    id AS 'auth_id',
    credential_id AS 'credentialID',
    credential_public_key AS 'credentialPublicKey',
    counter,
    credential_device_type AS 'credentialDeviceType',
    credential_backed_up AS 'credentialBackedUp',
    transports
FROM authenticator
WHERE
    user_id = ?
    AND credential_id = ?;

`;
  try {
    /**
     * Array of Row Data Packet arrays and Field Data Packet arrays
     * @type {import("../../../types/Database.js").Mysql2_Selection_Return_Data}
     */
    const [[AUTHENTICATOR]] = await CONNECTION.execute(QUERY, [
      user_id,
      credential_id,
    ]);

    if (!AUTHENTICATOR) {
      throw new Not_Found_Error(
        "The User you are trying to sign in as, has no registered authenticators",
      );
    }
    /** @type {[import("../../../types/Joke.js").Authenticator, string]} */
    const RESULT = [
      convert_db_to_simplewebauthn(AUTHENTICATOR),
      AUTHENTICATOR.auth_id,
    ];
    return RESULT;
  } catch (error) {
    throw error;
  } finally {
    await CONNECTION.end();
  }
}

/**
 * This Type mirrors the authenticator table in the mysql database.
 * @typedef {Object} Db_Authenticator
 * @property {string} id
 * @property {string} credentialID
 * @property {Buffer} credentialPublicKey
 * @property {string} counter
 * @property {string} credentialDeviceType
 * @property {boolean} credentialBackedUp
 * @property {string|null} transports
 * @property {string} user_id
 */

/**
 * @param {Db_Authenticator} authenticator
 * @returns {import("../../../types/Joke.js").Authenticator}
 */
function convert_db_to_simplewebauthn(authenticator) {
  authenticator.credentialID = Buffer.from(
    authenticator.credentialID,
    "base64url",
  );
  authenticator.counter = Number(authenticator.counter);
  authenticator.credentialBackedUp = Boolean(authenticator.credentialBackedUp);
  authenticator.transports = !authenticator.transports
    ? undefined
    : authenticator.transports.split(",");
  return authenticator;
}

export { db_select_authenticators, db_select_single_authenticator };
