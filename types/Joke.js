"use strict";

/**
 * A joke entity.
 * @typedef {Object} Joke
 * @property {string} [id] - The identifier of this joke. MySQL should return this as a string not BigInt
 * @property {string} text - The content of this joke.
 * @property {string} explanation - The explanation if this joke.
 * @property {string} [submitted_by] - The user who submitted the joke.
 */

export const Joke = {};
