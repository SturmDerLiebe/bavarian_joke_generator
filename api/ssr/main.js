"use strict";

import express from "express";
import db_read_joke from "../../helpers/database/read_joke_db.js";
import { is_valid_keyword } from "../../helpers/api/get_joke.js";
import {
  Client_Error,
  Duplicate_Joke_Error,
  Not_Found_Error,
} from "../../library/Errors.js";
import { SSR_PORT } from "../../constants/api.js";
import db_create_joke from "../../helpers/database/create_joke_db.js";
import { is_valid_joke_data } from "../../helpers/api/post_joke.js";
import { error } from "console";

const APP = express();
/*——————————————————————————————— SSR ———————————————————————————————————————*/
APP.set("view engine", "pug");

APP.get("/", async function (req, res) {
  try {
    const KEYWORD = req.query.keyword;
    // ~Validation
    if (!is_valid_keyword(KEYWORD)) {
      throw new Client_Error(
        `Your keyword "${KEYWORD}" did contain non english letters, numbers or other symbols`,
      );
    }
    // Data Manipulation
    const JOKE_DATA = await db_read_joke(KEYWORD);
    if (!JOKE_DATA.length) {
      throw new Not_Found_Error(
        `There were no jokes for the keyword ${KEYWORD}`,
      );
    }
    res.render("keyword", { KEYWORD, JOKE_DATA });
  } catch (error) {
    if (error instanceof Not_Found_Error) {
      res.writeHead(404, error.message).end();
    } else if (error instanceof Client_Error) {
      res.writeHead(400, error.message).end();
    } else {
      console.error(error);
      res.writeHead(500).end();
    }
  }
});

APP.get("/joke", async function (req, res) {
  try {
    /**
     * @type {string}
     */
    const JOKE_ID = req.query.id;
    if (!/^\d+$/.test(JOKE_ID)) {
      throw new Client_Error(
        `The provided joke id ${JOKE_ID} did contain non numeric characters`,
      );
    }
    const JOKE_DATA = await db_read_single_joke(JOKE_ID);
    res.render("joke", { JOKE_DATA });
  } catch (errer) {
    if (error instanceof Client_Error) {
      res.writeHead(400, error.message).end();
    }
    console.error(error);
    res.write(500).end();
  }
});

/*—————————————————————— Redirects ——————————————————————————————————————————*/
APP.post(
  "/submit",
  express.urlencoded({ extended: false }),
  async function (req, res) {
    try {
      // Validation
      if (!is_valid_joke_data(req.body)) {
        throw new Client_Error(
          "Either your joke content or explanation contained invalid symbols or formatting",
        );
      }
      const {
        content,
        explanation,
        submitted_by,
        keywords: keywords_string,
      } = req.body;
      const keywords = /,\s/.test
        ? keywords_string.split(/,\s/)
        : keywords_string; // Only split when multiple words
      // Data Manipulation
      const NEW_ID = await db_create_joke({
        content,
        explanation,
        submitted_by,
        keywords,
      });
      // Response
      res.redirect(303, `../joke?id=${NEW_ID}`);
    } catch (error) {
      // Error Responses
      if (error instanceof Duplicate_Joke_Error) {
        res.writeHead(409, error.message).end();
      } else if (error instanceof Client_Error) {
        res.writeHead(400, error.message).end();
      } else {
        console.error(error);
        res.writeHead(500).end();
      }
    }
  },
);

APP.listen(SSR_PORT, () => {
  console.log(`Server Side Rendering on port ${SSR_PORT}`);
});
