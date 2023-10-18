"use strict";

/**
 * The user to access the database
 * @readonly
 * @enum {string}
 */
const USERS = {
  /** User with SELECT privileges only */
  reader: "reader",
};

/**
 * The main database
 * @readonly
 */
const DATABASE_NAME = "bavarian_jokes";
export { USERS, DATABASE_NAME };
