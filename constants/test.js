"use strict";

import { expect } from "@jest/globals";
import { get_connection_options } from "./db";

const BASE_JOKE = {
  content: "Joke content",
  explanation: "This is an explanation",
};

const KEYWORDS = ["Dummy1", "Dummy2", "Dummy3"];

/**
 * @type {import("../types/Joke").Joke_Submission}
 */
const CREATE_ARGS_BYUSER = {
  ...BASE_JOKE,
  keywords: KEYWORDS,
  submitted_by: "1",
};

/**
 * @type {import("../types/Joke").Joke_Submission}
 */
const CREATE_ARGS_ANONYMOUS = {
  ...BASE_JOKE,
  keywords: KEYWORDS,
  submitted_by: "",
};

const EXISTING_KEYWORD = KEYWORDS[0];
const NONEXISTING_KEYWORD = "nonexistent";

const ANONYMOUS_JOKE = {
  id: expect.any(String),
  ...BASE_JOKE,
  submitted_by: "Anonymous",
};
const USER_JOKE = {
  id: expect.any(String),
  ...BASE_JOKE,
  submitted_by: expect.any(String),
};

export {
  BASE_JOKE,
  CREATE_ARGS_BYUSER,
  CREATE_ARGS_ANONYMOUS,
  EXISTING_KEYWORD,
  NONEXISTING_KEYWORD,
  ANONYMOUS_JOKE,
  USER_JOKE,
};
