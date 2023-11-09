"use strict";

const ERROR = document.getElementById("error");
const MESSAGE = document.getElementById("message");
const SEARCH_PARAMS = new URL(document.location).searchParams;

if (SEARCH_PARAMS.has("keyword")) {
  ERROR.textContent = `We sadly don't have any jokes about your keyword "${SEARCH_PARAMS.get(
    "keyword",
  )}" yet.`;
  MESSAGE.innerHTML = `If you find any, please feel free to <a href="/">submit them on our main page</a> 🤍🙏💙!`;
} else if (SEARCH_PARAMS.has("id")) {
  ERROR.textContent = `The joke with the id "${SEARCH_PARAMS.get(
    "id",
  )}" does not exist.`;
  MESSAGE.innerHTML = `Please search for a joke via keywords on our <a href="/">main page</a> 🤍🙏💙!`;
}
