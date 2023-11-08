"use strict";
import { get_connection_options } from "./db.js";

const READ_OPTIONS = {
  ...get_connection_options("read"),
  host: process.env.DB_EXTERNAL_HOST,
};
const INSERT_OPTIONS = {
  ...get_connection_options("create"),
  host: process.env.DB_EXTERNAL_HOST,
};

export { READ_OPTIONS, INSERT_OPTIONS };
