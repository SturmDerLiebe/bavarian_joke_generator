"use strict";

/**
 * This packet is returned when inserting into the db via mysql2
 * - with a single insert and
 * - over a single connection.
 * @typedef {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} Mysql2_Insertion_Return_Data
 */

/**
 * This packet is returned when reading from the db via mysql2
 * - over a single connection.
 * @typedef {[import("mysql2").RowDataPacket[], import("mysql2").FieldPacket[]]} Mysql2_Selection_Return_Data
 */
export {};
