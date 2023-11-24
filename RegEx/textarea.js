"use strict";

/**
 * German words and regular punctuation seperated by spaces.
 */
const CONTENT_PATTERN = /^(?:[A-Za-zöüäÖÜÄß0-9\.,:;'ʼ";„“–—\-\?!]+\s?)+$/;

/**
 * English words and regular punctuation seperated by spaces.
 */
const EXPLANATION_PATTERN = /^(?:[A-Za-z0-9\.,:;'"“”–—\-\?!]+\s?)+$/;

export { CONTENT_PATTERN, EXPLANATION_PATTERN };
