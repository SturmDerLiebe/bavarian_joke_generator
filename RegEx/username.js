"use strict";

/** When submitting a joke, no username is also valid */
const SUBMIT_USERNAME_PATTERN = /^[A-Za-z0-9_\-]*$/;
/** When Signing up, no username is not valid */
const AUTH_USERNAME_PATTERN = /^[A-Za-z0-9_\-]+$/;

export { SUBMIT_USERNAME_PATTERN, AUTH_USERNAME_PATTERN };
