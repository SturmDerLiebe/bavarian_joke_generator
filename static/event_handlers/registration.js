"use strict";

const { startRegistration } = SimpleWebAuthnBrowser;

/**
 * @param {HTMLInputElement} username_input
 * @param {HTMLButtonElement} register_btn
 * @param {HTMLParagraphElement} register_cta
 * @param {HTMLParagraphElement} register_msg
 * @param {HTMLParagraphElement} error_msg
 */
function get_registration_handler(username_input, register_btn, register_cta, register_msg, error_msg) {
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
        register_cta.textContent = "How about you try submitting a joke with your name?";
        register_msg.innerHTML = "<b>You successfully created your profile!</b>";
        register_btn.remove();
      } else {
        error_msg.toggleAttribute("hidden"); // show default error
      }
      // Error Handling:
    } catch (error) {
      error_msg.textContent = error.message;
      error_msg.toggleAttribute("hidden"); // show custom error
      // TODO: Delete username from db
      register_btn.textContent = "Try again";
      register_btn.focus();
    }
    finally {
      // hide error after 5 seconds for clean retry
      setTimeout(() => {
        error_msg.hidden = "hidden"; // hide error again
        return;
      }, 5000);
    }
  };
}

export { get_registration_handler };
