"use strict";

import express from "express";
import cookieParser from "cookie-parser";
import {
  Client_Error,
  Duplicate_Error,
  Not_Found_Error,
} from "../../library/Errors.js";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { AUTH_PORT, ORIGIN, RP_ID, RP_NAME } from "../../constants/auth.js";
import { is_valid_username } from "../../helpers/auth/get_auth_options.js";
import { db_insert_user } from "../../helpers/database/user/db_insert.js";
import { db_update_challange } from "../../helpers/database/user/db_update.js";
import { db_select_challange } from "../../helpers/database/user/db_select.js";

const APP = express();

/* =================== Registration ========================================= */

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
      .cookie(
        "user_data",
        { id: NEW_USER_ID, username: USERNAME },
        {
          domain: process.env.RP_ID,
          expires: 0, // SESSION cookie
          httpOnly: true,
          secure: process.env.NODE_ENV == "development" ? true : false,
          sameSite: "strict",
        },
      )
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
          "There has been an internal issue while treating your authentication",
        )
        .end();
    }
  }
});

/* ——————————————————— POST /verify-registration —————————————————————————— */
/**
 * user_data cookie type
 * @typedef {Object} User_Data_Cookie
 * @property {string} id
 * @property {string} username
 */

APP.post(
  "/verify-registration",
  cookieParser(),
  express.json(),
  async function (request, response) {
    try {
      /**
       * @type {User_Data_Cookie}
       */
      const USER_DATA = request.cookies.user_data;
      /*—————————————————————— Validation ——————————————————————————————————*/
      if (!USER_DATA || !USER_DATA.id) {
        throw new Client_Error("The value of your cookie is empty");
      } else if (!/^\d+$/.test(USER_DATA.id)) {
        throw new Client_Error(
          "The id of your cookie contains forbidden symbols",
        );
      }
      const { id: USER_ID } = USER_DATA;

      const EXPECTED_CHALLANGE = await db_select_challange(USER_ID);
      if (!EXPECTED_CHALLANGE) {
        throw new Not_Found_Error(
          "The user you are trying to identifiy as does not exist",
        );
      }

      const BODY = request.body;
      let verification;
      try {
        verification = await verifyRegistrationResponse({
          response: BODY,
          expectedChallenge: EXPECTED_CHALLANGE,
          expectedOrigin: ORIGIN,
          expectedRPID: RP_ID,
        });
      } catch (error) {
        console.error(error);
        return response.status(400).statusMessage(error.message).end();
      }
      if (!verification.verified) {
        throw new Client_Error(
          "There was an issue verifying your authentication",
        );
      }
      /*—————————————————————— Response ——————————————————————————————————*/
      response
        // TODO: set auth cookie headers
        .status(204)
        .end("Successfully authenticated");

      /*—————————————————————— Error Codes ——————————————————————————————————*/
    } catch (error) {
      if (error instanceof Not_Found_Error) {
        response.writeHead(404, error.message).end();
      } else if (error instanceof Client_Error) {
        response.writeHead(400, error.message).end();
      } else {
        console.error(error);
        response
          .writeHead(
            500,
            "There has been an internal issue while treating your authentication",
          )
          .end();
      }
    }
  },
);

/* ========================= Log in ======================================== */

APP.listen(AUTH_PORT, () => {
  console.log(`Authentication running on port ${AUTH_PORT}`);
});
