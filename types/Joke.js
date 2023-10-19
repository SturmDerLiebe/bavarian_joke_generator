"use strict";

/**
 * The joke type read from the database.
 * @typedef {Object} Joke
 * @property {string} id - The identifier of this joke. MySQL should return this as a string not BigInt
 * @property {string} content - The content of this joke.
 * @property {string} explanation - The explanation if this joke.
 * @property {string|"Anonymous"} submitted_by - The user who submitted the joke.
 */

/**
 * The joke type when inserting into the database.
 * @typedef {Object} Joke_Submission
 * @property {string} content - The content of this joke.
 * @property {string} explanation - The explanation if this joke.
 * @property {string|""} submitted_by - The user id of the submitter. An empty string signifies an anonymous submission.
 * @property {string[]} keywords - The keywords associated with the submitted joke.
 */

export const Joke_Types = {};
