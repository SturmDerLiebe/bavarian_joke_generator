"use strict";

/**
 * Checks if the keyword only contains letters from the english alphabet.
 * @param {string} keyword - The keyword to serch for jokes.
 * @returns {boolean} - If the keyword is ok or not.
 */
function is_valid_keyword(keyword) {
  const REGEX = new RegExp("^[A-Za-z]+$");
  return keyword && REGEX.test(keyword);
}

export { is_valid_keyword };
