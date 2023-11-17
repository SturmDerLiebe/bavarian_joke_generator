"use strict";

import mysql from "mysql2/promise";
import { get_connection_options } from "../../../constants/db.js";

/**
 * Inserts an authenticator into the database.
 * @param {string} user_id
 * @param {import("../../../types/Joke.js").Authenticator} new_authenticator
 * @param {import("mysql2").ConnectionOptions} [connection_options] - optional connection options
 * @throws {Error} If any connection error or similar happens.
 */
async function db_insert_authenticator(
  user_id,
  {
    credentialID,
    credentialPublicKey,
    counter,
    credentialDeviceType,
    credentialBackedUp,
    transports,
  },
  connection_options,
) {
  const CONNECTION = await mysql.createConnection(
    connection_options || get_connection_options("authenticate"),
  );
  const QUERY = `
  INSERT INTO authenticator (
    credential_id,
    credential_public_key,
    counter,
    credential_device_type,
    credential_backed_up,
    transports,
    user_id
) VALUES (?, ?, ?, ?, ?, ?, ?);`;
  try {
    /**
     * Only the Result data
     * @type {import("../../../types/Database.js").Mysql2_Insertion_Return_Data}
     */
    const [USER_HEADER] = await CONNECTION.execute(QUERY, [
      Buffer.from(credentialID.buffer).toString("base64url"), // Insert as base64URL string
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
      !transports ? null : transports.join(","), // Insert as CSV string
      user_id,
    ]);
  } catch (error) {
    throw error;
  } finally {
    await CONNECTION.end();
  }
}

export { db_insert_authenticator };
