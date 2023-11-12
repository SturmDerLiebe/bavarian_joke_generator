"use strict";

import { startRegistration } from "@simplewebauthn/browser";

const REGISTER_MSG = document.getElementById("register-message");
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

// Start registration when the user clicks a button
SUBMIT_BTN.addEventListener("click", async () => {
  /*——— 1. Get registration options from the Relying Party (your server) ————*/
  // TODO: Add Username
  const USERNAME = USERNAME_INPUT.value;
  const RESPONSE = await fetch("/auth/generate-registration-options");

  let attResp;
  try {
    /* —————————————— 2. Submit registration options to the authenticator ——————*/
    attResp = await startRegistration(await RESPONSE.json());
  } catch (error) {
    REGISTER_BTN.textContent = "Try again";
    // Some basic error handling
    if (error.name === "InvalidStateError") {
      REGISTER_MSG.textContent =
        "The Authenticator you chose seems to have already been registered by you";
    } else {
      REGISTER_MSG.textContent = error;
    }
    throw error;
  }

  /* —— 3. Submit the authenticator's response to the Relying Party for verification ——*/
  const verificationResp = await fetch("/auth/verify-registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attResp),
  });

  // Wait for the results of verification
  const VERIFICATION_JSON = await verificationResp.json();

  // Show UI appropriate for the `verified` status
  if (VERIFICATION_JSON && VERIFICATION_JSON.verified) {
    REGISTER_MSG.textContent =
      "You successfully created your profile. How about you try submitting a joke with your name?";
    REGISTER_BTN.remove();
  } else {
    elemError.innerHTML = `We are sorry, but something went wrong! Response: <pre>${JSON.stringify(
      VERIFICATION_JSON,
    )}</pre >`;
  }
});
