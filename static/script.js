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
const SUBMITTED_BY_INPUT = document.getElementById("submitter");

/** @type {HTMLSpanElement} */
const ERROR_SPAN = document.getElementById("login_error");

SUBMIT_JOKE_FORM.addEventListener("submit", submit_joke_handler);

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
/** @type {HTMLFormElement} */
const REGISTER_FORM = document.getElementById("registration_form");

const CLOSE_BTN = document.getElementById("close");
CLOSE_BTN.addEventListener("click", function close_modal() {
  MODAL.close("close");
});

// Start registration when the user clicks a button
REGISTER_FORM.addEventListener(
  // Form submit event will not fire here!
  "submit",
  get_registration_handler(USERNAME_INPUT, REGISTER_BTN, REGISTER_MSG),
);

/* -------------------- Event Handlers ---------------------------------- */
async function submit_joke_handler(event) {
  try {
    // Check and report Validity of both textareas:
    if (
      !(
        handle_validity_check(
          CONTENT_AREA,
          CONTENT_PATTERN,
          SUBMIT_JOKE_FORM,
          "For Content only use German letters and punctuation!",
        ) &&
        handle_validity_check(
          EXPLANATION_AREA,
          EXPLANATION_PATTERN,
          SUBMIT_JOKE_FORM,
          "For Explanation only use English letters and punctuation!",
        )
      )
    ) {
      // End the function if inputs are invalid and cancel submit event
      return event.preventDefault();
    }
    // Only try yo authenticate when submission is not anonymous
    /* ————————————————— WebauthnLogin ————————————————————————————————————— */
    if (SUBMITTED_BY_INPUT.value.length) {
      event.preventDefault(); // Make sure to always call this after constraint validation succeeded via reportValidity(), to enable custom form submission
      const is_finished = await handle_login(SUBMITTED_BY_INPUT.value, event);
      // For some unkown reason the following fetch calls during handle_login seem to ignore a preventDefault that comes afterwards (#1), which is why the extra is_finished flag is used
      if (is_finished) {
        SUBMIT_JOKE_FORM.submit(); // For some otherworldly reason, the submit does not (a)wait on the error handling to finish. Investigate this (TODO), see #1
        return;
      }
    }
    // else just continuee with valid anonymous submission
  } catch (error) {
    ERROR_SPAN.innerText = error.message;
    ERROR_SPAN.hidden = false;
  } finally {
    /* ------------------------ Cleanup ----------------------------------- */
    // Use Timeout so Message does not get deleted before User can read it
    setTimeout(() => {
      CONTENT_AREA.setCustomValidity("");
      EXPLANATION_AREA.setCustomValidity("");
      return;
    }, 5000);
  }
}

/** Handles checking and reporting the validity of textareas, since they do not get checked by HTML like Input Elements.
 * @param textarea_to_check {HTMLTextAreaElement}
 * @param valid_pattern {RegExp}
 * @param form_to_be_submitted {HTMLFormElement}
 * @param custom_validity_message {string}
 * @returns {boolean} the status of the validity
 */
function handle_validity_check(
  textarea_to_check,
  valid_pattern,
  form_to_be_submitted,
  custom_validity_message,
) {
  if (!valid_pattern.test(textarea_to_check.value)) {
    textarea_to_check.setCustomValidity(custom_validity_message);
  }
  return form_to_be_submitted.reportValidity();
}
