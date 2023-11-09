"use strict";

const VALID_KEYWORD = "Dog";
const LISTED_KEYWORD = VALID_KEYWORD;
const UNLISTED_KEYWORD = "Unlisted";
/**
 * This represents an unprocessed request directly from the user.
 * @type {import("../types/Joke").User_Submission}
 */
const SINGLE_SUBMISSION = {
  content: "Des is a Hund!",
  explanation: "They are like a dog!",
  submitted_by: "",
  keywords: "Dog, Cat",
};
/**
 * This represents a processed request with distinct content.
 * @type {import("../types/Joke").Joke_Submission[]}
 */
const DISTINCT_CREATE_ARGS = get_joke_times(3, false);
/**
 * This represents a processed request with duplicate content.
 * @type {import("../types/Joke").Joke_Submission[]}
 */
const DUPLICATE_CREATE_ARGS = get_joke_times(3);

function get_joke_times(n, duplicates = true) {
  let jokes = Array(n).fill({
    ...SINGLE_SUBMISSION,
    keywords: [LISTED_KEYWORD, "Cat"],
  });
  if (duplicates) {
    return jokes;
  }
  // Return joke array with distinct contents
  return (jokes = jokes.map(function (joke_object, index) {
    return { ...joke_object, content: String(index) };
  }));
}

export {
  VALID_KEYWORD,
  LISTED_KEYWORD,
  SINGLE_SUBMISSION,
  DISTINCT_CREATE_ARGS,
  DUPLICATE_CREATE_ARGS,
  UNLISTED_KEYWORD,
};
