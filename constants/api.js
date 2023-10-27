"use strict";
import dotenv from "dotenv";
dotenv.config();

/**
 * The port on which the server side rendering happens.
 * @readonly
 * @default
 */
const SSR_PORT = process.env.SSR_PORT;

export { SSR_PORT };
