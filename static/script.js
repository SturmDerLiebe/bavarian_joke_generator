"use strict";

import { get_registration_handler } from "./event_handlers/registration.js";

// import { startRegistration } from "@simplewebauthn/browser";

// TODO: Add logic to authenticate via submitting a joke

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
