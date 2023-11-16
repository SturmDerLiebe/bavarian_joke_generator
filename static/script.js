"use strict";

import { CONTENT_PATTERN, EXPLANATION_PATTERN } from "../RegEx/textarea.js";
import { handle_login } from "./event_handlers/login.js";
import { get_registration_handler } from "./event_handlers/registration.js";

// import { startRegistration } from "@simplewebauthn/browser";

/* ================== Log In Elements ================================ */
/** @type {HTMLFormElement} */
const SUBMIT_JOKE_FORM = document.getElementById("submit_form");

/** @type {HTMLTextAreaElement} */
const CONTENT_AREA = document.getElementById("content");

/** @type {HTMLTextAreaElement} */
const EXPLANATION_AREA = document.getElementById("explanation");

/** @type {HTMLInputElement} */
const KEYWORDS_INPUT = document.getElementById("keywords");

/** @type {HTMLInputElement} */
const SUBMITTED_BY_INPUT = document.getElementById("submitter");

/** @type {HTMLSpanElement} */
const ERROR_SPAN = document.getElementById("login_error");

SUBMIT_JOKE_FORM.addEventListener("submit", async function joke_handler(event) {
  // Check Validity of textareas:
  if (!CONTENT_PATTERN.test(CONTENT_AREA.value)) {
    CONTENT_AREA.setCustomValidity(
      "For Content only use German letters and punctuation!",
    );
    SUBMIT_JOKE_FORM.reportValidity();
    // Set Timeout so the empty custom validity does not interfere with current event
    setTimeout(() => {
      CONTENT_AREA.setCustomValidity("");
    }, 5000); // -> new submits will stay invalid for 5 seconds!
    return;
  }
  if (!EXPLANATION_PATTERN.test(EXPLANATION_AREA.value)) {
    EXPLANATION_AREA.setCustomValidity(
      "For Explanation only use English letters and punctuation!",
    );
    SUBMIT_JOKE_FORM.reportValidity();
    // Set Timeout so the empty custom validity does not interfere with current event
    setTimeout(() => {
      EXPLANATION_AREA.setCustomValidity("");
    }, 5000);
    return;
  }

  if (SUBMITTED_BY_INPUT.value) {
    /* ————————————————— WebauthnLogin ————————————————————————————————————— */
    try {
      // Make sure to always call this after constraint validation was done via reportValidity()
      event.preventDefault(); // For some unkown reason the following fetch calls ignore a preventDefault that comes afterwards
      await handle_login(SUBMITTED_BY_INPUT.value, event);
      SUBMIT_JOKE_FORM.submit();
    } catch (error) {
      ERROR_SPAN.innerText = error.message;
      ERROR_SPAN.hidden = false;
    }
  }
});

/* ================== Registration Elements ================================ */

/**
 * @type {HTMLParagraphElement}
 */
const REGISTER_MSG = document.getElementById("register-message");
/**
 * @type {HTMLButtonElement}
 */
const REGISTER_BTN = document.getElementById("start-register");

/**
 * @type {HTMLDialogElement}
 */
const MODAL = document.getElementById("registration-modal");

REGISTER_BTN.addEventListener("click", function show_modal() {
  MODAL.showModal();
});

/* —————————————————————— Inside Modal —————————————————————————————————————*/
/**
 * @type{HTMLInputElement}
 */
const USERNAME_INPUT = document.getElementById("username");
const SUBMIT_BTN = document.getElementById("register");

const CLOSE_BTN = document.getElementById("close");
CLOSE_BTN.addEventListener("click", function close_modal() {
  MODAL.close("close");
});
const USERNAME = USERNAME_INPUT.value;

// Start registration when the user clicks a button
SUBMIT_BTN.addEventListener(
  "click",
  get_registration_handler(USERNAME, REGISTER_BTN, REGISTER_MSG),
);
