"use strict";

import { expect, describe, test } from "@jest/globals";
import { is_valid_keyword } from "./get_joke";

describe("is_valid_keyword returns", function () {
  test("true, if keyword is valid", function () {
    // GIVEN
    // WHEN
    const IS_VALID = is_valid_keyword("Test");
    // THEN
    expect(IS_VALID).toBe(true);
  });

  test("false, if keyword is invalid", function () {
    // GIVEN
    // WHEN
    const IS_VALID1 = is_valid_keyword("Ungültigkeit");
    const IS_VALID2 = is_valid_keyword("123");
    const IS_VALID3 = is_valid_keyword(" Space ");
    // THEN
    expect(IS_VALID1).toBe(false);
    expect(IS_VALID2).toBe(false);
    expect(IS_VALID3).toBe(false);
  });
});
