"use strict";

import { get_registration_handler } from "./event_handlers/registration.js";
import { get_submit_joke_handler } from "./event_handlers/joke_submission.js";

/* ================== Log In Elements ================================ */
/** @type {HTMLFormElement} */
const SUBMIT_JOKE_FORM = document.getElementById("submit_form");

/** @type {HTMLTextAreaElement} */
const CONTENT_AREA = document.getElementById("content");

/** @type {HTMLTextAreaElement} */
const EXPLANATION_AREA = document.getElementById("explanation");

/** @type {HTMLInputElement} */
const SUBMITTED_BY_INPUT = document.getElementById("submitter");

/** @type {HTMLParagraphElement} */
const SUBMISSION_ERROR = document.getElementById("login_error");

SUBMIT_JOKE_FORM.addEventListener(
  "submit",
  get_submit_joke_handler(
    SUBMIT_JOKE_FORM,
    CONTENT_AREA,
    EXPLANATION_AREA,
    SUBMITTED_BY_INPUT,
    SUBMISSION_ERROR,
  ),
);

/* ================== Registration Elements ================================ */

/** Call to action message
 * @type {HTMLParagraphElement}
 */
const REGISTER_CTA = document.getElementById("register_cta");

/**
 * @type {HTMLParagraphElement}
 */
const REGISTER_MSG = document.getElementById("register_message");

/**
 * @type {HTMLButtonElement}
 */
const REGISTER_BTN = document.getElementById("start-register");

/** @type {HTMLParagraphElement} */
const SIGNUP_ERROR = document.getElementById("signup_error");

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
  get_registration_handler(
    USERNAME_INPUT,
    REGISTER_BTN,
    REGISTER_CTA,
    REGISTER_MSG,
    SIGNUP_ERROR,
  ),
);
