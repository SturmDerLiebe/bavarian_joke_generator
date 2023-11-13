"use strict";

import { USERNAME_PATTERN } from "../../RegEx/username.js";

/**
 * Checks if the username is valid.
 * @param {string} username
 * @returns {boolean}
 */
function is_valid_username(username) {
  return USERNAME_PATTERN.test(username);
}

export { is_valid_username };
