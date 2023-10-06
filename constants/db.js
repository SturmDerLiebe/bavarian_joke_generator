"use strict"

/**
  * The user to access the database
  * @readonly
  * @enum {string}
  */
const ROLES = {
  /** User with READ privileges only */
  reader: "reader"
};

/**
  * The main database
  * @readonly
  */
const DATABASE_NAME = "Bavarian_Jokes";
export { ROLES, DATABASE_NAME };
