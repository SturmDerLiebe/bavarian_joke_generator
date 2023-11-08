"use strict";

import { expect, describe, test } from "@jest/globals";
import { is_valid_joke_data } from "./post_joke.js";
import { SINGLE_SUBMISSION } from "../../constants/playwright.js";

describe("Returns", function () {
  test("true, if joke_data is valid", function () {
    // GIVEN
    // WHEN
    const IS_VALID = is_valid_joke_data(SINGLE_SUBMISSION);
    // THEN
    expect(IS_VALID).toBe(true);
  });

  describe("false, if content is invalid", function () {
    test.each(["", " ", "_Word for Wor_d"])(
      "Testing content: '%s'",
      function (content) {
        // GIVEN
        // WHEN
        const IS_VALID = is_valid_joke_data({ ...SINGLE_SUBMISSION, content });
        // THEN
        expect(IS_VALID).toBe(false);
      },
    );
  });

  describe("false, if explanation is invalid", function () {
    test.each(["", " ", "_Word for Wor_d", "Ungültige Wörter"])(
      "Testing explanation: '%s'",
      function (explanation) {
        // GIVEN
        // WHEN
        const IS_VALID = is_valid_joke_data({
          ...SINGLE_SUBMISSION,
          explanation,
        });
        // THEN
        expect(IS_VALID).toBe(false);
      },
    );
  });

  describe("false, if keywords string is invalid", function () {
    test.each(["", " ", "Cat Dog", "Dog,Cat"])(
      "Testing keywords string: '%s'",
      function (keywords_string) {
        // GIVEN
        // WHEN
        const IS_VALID = is_valid_joke_data({
          ...SINGLE_SUBMISSION,
          keywords: keywords_string,
        });
        // THEN
        expect(IS_VALID).toBe(false);
      },
    );
  });
});
