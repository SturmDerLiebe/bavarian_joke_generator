"use strict";

const VALID_KEYWORD = "Dog";
const LISTED_KEYWORD = VALID_KEYWORD;
const JOKE_SUBMISSIONS = get_joke_times(3);

const UNLISTED_KEYWORD = "Unlisted";

function get_joke_times(n) {
  return Array(n).fill({
    content: "Des is a Hund!",
    explanation: "They are like a dog!",
    submitted_by: "Anonymous",
    keywords: [LISTED_KEYWORD],
  });
}

export { VALID_KEYWORD, LISTED_KEYWORD, JOKE_SUBMISSIONS, UNLISTED_KEYWORD };
