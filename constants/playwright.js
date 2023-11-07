"use strict";

const VALID_KEYWORD = "Dog";
const LISTED_KEYWORD = VALID_KEYWORD;
const SINGLE_SUBMISSION = get_joke_times(1)[1];
const DUBLICATE_JOKE_SUBMISSIONS = get_joke_times(3);
const DISTINC_JOKE_SUBMISSIONS = get_joke_times(3, false);
const UNLISTED_KEYWORD = "Unlisted";

/**
 * @returns {import("../types/Joke").Joke_Submission[]}
 */
function get_joke_times(n, duplicates = true) {
  let jokes = Array(n).fill({
    content: "Des is a Hund!",
    explanation: "They are like a dog!",
    submitted_by: "",
    keywords: [LISTED_KEYWORD],
  });
  if (duplicates) {
    return jokes;
  }
  // Return joke array with distinct contents
  jokes.forEach(function (joke_object) {
    return (joke_object.content = joke_object.content + "a");
  });
  return jokes;
}

export {
  VALID_KEYWORD,
  LISTED_KEYWORD,
  SINGLE_SUBMISSION,
  DUBLICATE_JOKE_SUBMISSIONS,
  DISTINC_JOKE_SUBMISSIONS,
  UNLISTED_KEYWORD,
};
