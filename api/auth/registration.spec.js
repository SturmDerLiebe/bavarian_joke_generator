"use strict";

import { test, expect } from "@playwright/test";
import { delete_all_users_and_authenticators } from "../../helpers/test/delete_users";
import { RP_ID, RP_NAME } from "../../constants/auth";
import { db_insert_user } from "../../helpers/database/user/db_insert";
import { get_connection_options } from "../../constants/db";

//TODO: Remember to URIEncode the Username
/*–––––––––––––––––––––––––––––––GET /generate-registration-options?username ––––––––––––––––––––––––––––––––––––––*/
test.describe("Requesting options with", function () {
  test.afterEach(async () => {
    await delete_all_users_and_authenticators();
  });

  test("a valid username, responds with expected auth-options", async function ({
    request,
  }) {
    // GIVEN
    const USER = "Molly";
    const EXPECTED_REGISTRATION_OPTIONS = {
      challenge: expect.any(String),
      rp: { name: RP_NAME, id: RP_ID },
      user: { id: expect.any(Number), name: USER, displayName: USER },
      //  pubKeyCredParams: [
      //    { alg: -8, type: 'public-key' },
      //    { alg: -7, type: 'public-key' },
      //    { alg: -257, type: 'public-key' }
      //  ],
      //    timeout: 60000,
      //      attestation: 'none',
      //        excludeCredentials: [],
      //          authenticatorSelection: {
      //    residentKey: 'preferred',
      //      userVerification: 'preferred',
      //        authenticatorAttachment: 'platform',
      //          requireResidentKey: false
      //  },
      //  extensions: { credProps: true }
    };
    // WHEN
    const RESPONSE = await request.get(
      `/generate-registration-options?username=${USER}`,
    );
    // THEN
    expect(RESPONSE.status()).toBe(200);
    expect(await RESPONSE.json()).toMatchObject(EXPECTED_REGISTRATION_OPTIONS);
  });

  test("an invalid username, responds with 400 code", async function ({
    request,
  }) {
    // GIVEN
    // WHEN
    const RESPONSE = await request.get(
      "/generate-registration-options?username=Ungültig",
    );
    // THEN
    expect(RESPONSE.status()).toBe(400);
  });

  test("an already existing username, responds with 409 code", async function ({
    request,
  }) {
    // GIVEN
    const DUPLICATE = "Peter";
    await db_insert_user(DUPLICATE, {
      ...get_connection_options("authenticate"),
      host: process.env.DB_EXTERNAL_HOST,
    });
    // WHEN
    const RESPONSE = await request.get(
      `/generate-registration-options?username=${DUPLICATE}`,
    );
    // THEN
    expect(RESPONSE.status()).toBe(409);
  });
});
