"use strict";

import { SUBMIT_USERNAME_PATTERN } from "../../RegEx/username.js";

/**
 * Checks if the user submitted data is valid.
 * @param {import("../../types/Joke").User_Submission} data - User submitted data.
 * @returns {boolean}
 */
function is_valid_joke_data({ content, explanation, keywords, submitted_by }) {
  const CONTENT_REGEX = /^(?:[A-Za-zöüäÖÜÄ0-9\.,:;'ʼ";„‟–—\-\?!]+\s?)+$/;
  const EXPLANATION_REGEX = /^(?:[A-Za-z0-9\.,:;'ʼ";„‟–—\-\?!]+\s?)+$/;
  const KEYWORDS_REGEX = /^[A-Za-z]+(?:,\s[A-Za-z]+)*$/;
  return (
    CONTENT_REGEX.test(content) &&
    EXPLANATION_REGEX.test(explanation) &&
    KEYWORDS_REGEX.test(keywords) &&
    SUBMIT_USERNAME_PATTERN.test(submitted_by)
  );
}

export { is_valid_joke_data };
