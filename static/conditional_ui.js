"use strict";

const { startAuthentication } = SimpleWebAuthnBrowser;
startAuthentication(options, true).catch(
  console.info("Loading conditional UI"),
);
