"use strict";

import express from "express";
import { Client_Error, Duplicate_Error } from "../../library/Errors.js";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { AUTH_PORT, RP_ID, RP_NAME } from "../../constants/auth.js";
import { is_valid_username } from "../../helpers/auth/get_auth_options.js";
import { db_insert_user } from "../../helpers/database/user/db_insert.js";
import { db_update_challange } from "../../helpers/database/user/db_update.js";

const APP = express();

/* ——————————————————— GET /generate-registration-options?username —————————— */
APP.get("/generate-registration-options", async function (request, response) {
  try {
    const USERNAME = request.query.username;
    // Validation:
    if (!is_valid_username(USERNAME)) {
      throw new Client_Error(
        `The username ${USERNAME} contained forbidden symbols`,
      );
    }
    // Data Insertion:
    const NEW_USER_ID = await db_insert_user(USERNAME);
    // Generate Auth Options:
    const OPTIONS = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: NEW_USER_ID,
      userName: USERNAME,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: "none",
      // See "Guiding use of authenticators via authenticatorSelection" below
      authenticatorSelection: {
        // Best Practices Defaults
        residentKey: "preferred",
        userVerification: "preferred",
        // Optional
        authenticatorAttachment: "platform",
      },
    });

    // Remember the challenge for this user
    db_update_challange(NEW_USER_ID, OPTIONS.challenge);
    // Response:
    response
      .setHeader("Content-Type", "application/json")
      .status(200)
      .json(OPTIONS);
  } catch (error) {
    if (error instanceof Duplicate_Error) {
      response.writeHead(409, error.message).end();
    } else if (error instanceof Client_Error) {
      response.writeHead(400, error.message).end();
    } else {
      console.error(error);
      response
        .writeHead(
          500,
          "There has been an innternal issue while treating your authentication",
        )
        .end();
    }
  }
});

/* ——————————————————— GET /generate-registration-options?username —————————— */

APP.listen(AUTH_PORT, () => {
  console.log(`Authentication running on port ${AUTH_PORT}`);
});
