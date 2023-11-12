"use strict";

/**
 * A simple extension of the Error class to filter Client errors.
 * @extends Error
 */
class Client_Error extends Error {
  /**
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
  }
}

/**
 * A class to filter 404 errors
 * @extends Client_Error
 */
class Not_Found_Error extends Client_Error {
  /**
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
  }
}

/**
 * A class to filter 409 errors
 * @extends Client_Error
 */
class Duplicate_Error extends Client_Error {
  /**
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
  }
}

export { Client_Error, Not_Found_Error, Duplicate_Error };
