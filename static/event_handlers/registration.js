"use strict";

const { startRegistration } = SimpleWebAuthnBrowser;

/**
 * @param {HTMLInputElement} username_input
 * @param {HTMLButtonElement} register_btn
 * @param {HTMLParagraphElement} register_msg
 */
function get_registration_handler(username_input, register_btn, register_msg) {
  return async () => {
    let response;
    let attResp;
    try {
      /*——— 1. Get registration options from the Relying Party (your server) ————*/
      response = await fetch(
        `/auth/generate-registration-options?username=${username_input.value}`,
      );
      if (response.status === 409) {
        throw new Error(
          "Your Username is sadly already taken. Try another one!",
        );
      } else if (!response.ok) {
        throw new Error(
          "There was an issue setting up your account. Please try again!",
        );
      }

      /* —————————————— 2. Submit registration options to the authenticator ——————*/
      attResp = await startRegistration(await response.json());

      /* —— 3. Submit the authenticator's response to the Relying Party for verification ——*/
      const verificationResp = await fetch("/auth/verify-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attResp),
      });

      // Show UI appropriate for the `verified` status
      if (verificationResp.ok) {
        register_msg.textContent =
          "You successfully created your profile. How about you try submitting a joke with your name?";
        register_btn.remove();
      } else {
        register_msg.textContent = `We are sorry, but something went wrong! Response error: ${verificationResp.status}`;
      }
      // Error Handling:
    } catch (error) {
      register_msg.textContent = error;
      // TODO: Delete username from db
      register_btn.textContent = "Try again";
      register_btn.focus();
    }
  };
}

export { get_registration_handler };
