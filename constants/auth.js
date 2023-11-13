"use strict";

/**
 * The port on which authentication happens.
 * @readonly
 */
const AUTH_PORT = process.env.AUTH_PORT;

// Human-readable title for your website
const RP_NAME = "Bavarian Joke Generator";
// A unique identifier for your website
const RP_ID = process.env.RP_ID;
// The URL at which registrations and authentications should occur
const ORIGIN = `${process.env.RP_SCHEMA}://${RP_ID}`;

export { AUTH_PORT, RP_NAME, RP_ID, ORIGIN };
