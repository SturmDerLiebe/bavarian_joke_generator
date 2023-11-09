"use strict";

import { test, expect } from "@playwright/test";
import {
  VALID_KEYWORD,
  LISTED_KEYWORD,
  DISTINCT_CREATE_ARGS,
  UNLISTED_KEYWORD,
} from "../constants/playwright";
import delete_all_jokes_and_keywords from "../helpers/test/delete_jokes";
import db_create_joke from "../helpers/database/create_joke_db";
import { INSERT_OPTIONS } from "../constants/connections.js";

test.describe("When requesting a joke on the home/root page on", function () {
  test("a valid keyword, the user is directed to another page", async function ({
    page,
  }) {
    // GIVEN
    // WHEN
    await page.goto("/");
    await page.locator("[for=keyword]").fill(VALID_KEYWORD);
    await page.getByTestId("gen-btn").click();
    // THEN
    await expect(page).not.toHaveTitle("Bavarian Jokes Generator");
  });
  /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
  test.describe("an invalid keyword, the user stays on the page", function () {
    for (let word of ["Cät", "Do g", "Mo;use"])
      test(`Keyword: ${word}`, async function ({ page }) {
        // GIVEN
        // WHEN
        await page.goto("/");
        await page.locator("[for=keyword]").fill(word);
        await page.getByTestId("gen-btn").click();
        // THEN
        await expect(page).toHaveTitle("Bavarian Jokes Generator");
        await expect(page.locator("#keyword")).not.toBeValid();
      });
  });
});

test.describe("A User requesting a joke from the home page via", function () {
  // BEFORE EACH:
  test.afterEach(async function () {
    await delete_all_jokes_and_keywords();
  });
  /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
  test("a listed keyword, is directed to a page showing associated existing jokes", async function ({
    page,
  }) {
    // GIVEN
    await db_create_joke(DISTINCT_CREATE_ARGS[0], INSERT_OPTIONS);
    await db_create_joke(DISTINCT_CREATE_ARGS[1], INSERT_OPTIONS);
    await db_create_joke(DISTINCT_CREATE_ARGS[2], INSERT_OPTIONS);
    // WHEN
    await page.goto("/");
    await page.locator("[for=keyword]").fill(LISTED_KEYWORD);
    await page.getByTestId("gen-btn").click();
    // THEN
    await expect(page).toHaveTitle(`Bavarian ${LISTED_KEYWORD} jokes`);
    expect(await page.locator("figure").all()).toHaveLength(
      DISTINCT_CREATE_ARGS.length,
    );
  });
  /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
  test("an unlisted keyword, is directed to a page showing that there are no jokes yet", async function ({
    page,
  }) {
    // GIVEN
    // WHEN
    await page.goto("/");
    await page.locator("[for=keyword]").fill(UNLISTED_KEYWORD);
    await page.getByTestId("gen-btn").click();
    // THEN
    // See if the page dislpays some kind of "Sorry, no content for this joke yet" page.
    await expect(page.getByText("sorry")).toBeAttached();
  });
});
