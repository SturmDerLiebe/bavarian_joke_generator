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

export { Client_Error };
