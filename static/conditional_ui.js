"use strict";

// See https://simplewebauthn.dev/docs/packages/browser#browser-autofill-aka-conditional-ui
const { startAuthentication } = SimpleWebAuthnBrowser;
fetch("/auth/generate-authentication-options")
  .then((options) => {
    options.json();
  })
  .then((options) => {
    startAuthentication(options, true);
  })
  .catch((err) => {
    console.warn(err);
  })
  .finally(console.info("Conditional UI loaded"));
