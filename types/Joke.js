"use strict";

import {
  CredentialDeviceType,
  AuthenticatorTransport,
} from "@simplewebauthn/typescript-types";

/**
 * The joke type read from the database.
 * @typedef {Object} Joke
 * @property {string} [id] - The identifier of this joke. MySQL should return this as a string not BigInt
 * @property {string} content - The content of this joke.
 * @property {string} explanation - The explanation if this joke.
 * @property {string|"Anonymous"} submitted_by - The user who submitted the joke.
 */

/**
 * The joke type when inserting into the database.
 * @typedef {Object} Joke_Submission
 * @property {string} content - The content of this joke.
 * @property {string} explanation - The explanation if this joke.
 * @property {string} submitted_by - The user id of the submitter. Empty string signals anonymous user
 * @property {string[]} keywords - The keywords associated with the submitted joke.
 */

/**
 * The joke submitted by a user from the frontend.
 * @typedef {Object} User_Submission
 * @property {string} content - The content of this joke.
 * @property {string} explanation - The explanation if this joke.
 * @property {string} submitted_by - The user id of the submitter. Empty string signals anonymous user
 * @property {string} keywords - The keywords string submitted by the user
 */

/**
 * The Usermodel used by simplewebauthn
 * @typedef {Object} UserModel
 * @property {string} id
 * @property {string} username
 * @property {string} [currentChallange]
 */

/**
 * The Authenticator used by simplewebauthn
 * @typedef {Object} Authenticator
 * @property {Uint8Array} credentialID
 * @property {Uint8Array} credentialPublicKey
 * @property {number} counter
 * @property {CredentialDeviceType} credentialDeviceType
 * @property {boolean} credentialBackedUp
 * @property {AuthenticatorTransport[]} [transports]
 */

export const Joke_Types = {};
