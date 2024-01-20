"use strict";

const { startAuthentication } = SimpleWebAuthnBrowser;

/**
 * @param {SubmitEvent} event
 */
async function handle_login(username) {
  /* —————————————— 1. Get registration options from the Relying Party ————————*/
  let asses_resp;
  try {
    const resp = await fetch(
      `/auth/generate-authentication-options?username=${username}`,
    );
    if (resp.status === 404) {
      throw new Error(
        "The user you are trying to submit as, does not exist yet!",
      );
    } else if (!resp.ok) {
      throw new Error(
        "There was an issue starting the submission process. Please try again!",
      );
    }

    /* ——————— 2. Submit registration options to the authenticator ——————— */
    asses_resp = await startAuthentication(await resp.json());

    /*— 3. Submit the authenticator's response to the Relying Party for verification —*/
    const verificationResp = await fetch("/auth/verify-authentication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asses_resp),
    });

    if (!verificationResp.ok) {
      throw new Error("There was an issue logging you in. Please try again!");
    }

    return true; // if no error occurs
  } catch (error) {
    throw error; // pass errors to encasing try-catch-block
  }
}

export { handle_login };
