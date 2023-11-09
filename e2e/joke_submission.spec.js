"use strict";

import { test, expect } from "@playwright/test";
import { SINGLE_SUBMISSION } from "../constants/playwright";

test.describe("A user can fill out the joke submission form anonymously and press submit", function () {
  test("with valid data, to be directed to a page displaying their submitted joke", async function ({
    page,
  }) {
    // GIVEN
    const { content, explanation, keywords } = SINGLE_SUBMISSION;
    // WHEN
    await page.goto("/");
    await page.getByLabel("Content:").fill(content);
    await page.getByLabel("Explanation:").fill(explanation);
    await page.getByLabel("Keywords:").fill(keywords);
    await page.getByText("Submit Joke").click();
    // THEN
    expect(await page.locator("figure").all()).toHaveLength(1);
    await expect(page.locator("figure")).toContainText(content);
  });
  /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
});
