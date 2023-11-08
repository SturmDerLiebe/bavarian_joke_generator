"use strict";

/**
 * Checks if the user submitted data is valid.
 * @param {import("../../types/Joke").User_Submission} data - User submitted data.
 * @returns {boolean}
 */
function is_valid_joke_data({ content, explanation, keywords, submitted_by }) {
  const CONTENT_REGEX = /^(?:[A-Za-zöüäÖÜÄ0-9.,:;'ʼ&quot;„‟–—\-?!]+\s?)+$/;
  const EXPLANATION_REGEX = /^(?:[A-Za-z0-9.,:;'ʼ&quot;„‟–—\-?!]+\s?)+$/;
  const KEYWORDS_REGEX = /^[A-Za-z]+(?:,\s[A-Za-z]+)*$/;
  const USER_REGEX = /^[A-Za-z0-9_\-–—]*$/;
  return (
    CONTENT_REGEX.test(content) &&
    EXPLANATION_REGEX.test(explanation) &&
    KEYWORDS_REGEX.test(keywords) &&
    USER_REGEX.test(submitted_by)
  );
}

export { is_valid_joke_data };