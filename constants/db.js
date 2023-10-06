"use strict"

/**
  * The user to access the database
  * @readonly
  * @enum {string}
  */
const ROLES = {
  /** User with SELEECT privileges only */
  reader: "reader"
};

/**
  * The main database
  * @readonly
  */
const DATABASE_NAME = "bavarian_jokes";
export { ROLES, DATABASE_NAME };
