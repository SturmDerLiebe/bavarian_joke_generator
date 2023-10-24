"use strict";

import express from "express";
import db_read_joke from "../../helpers/database/read_joke_db.js";
import { is_valid_keyword } from "../../helpers/api/get_joke.js";
import { Client_Error } from "../../library/Errors.js";
import { SSR_PORT } from "../../constants/api.js";

const APP = express();

APP.set("view engine", "pug");
APP.get("/:keyword", async function (req, res) {
  try {
    const KEYWORD = req.params.keyword;
    if (!is_valid_keyword(KEYWORD)) {
      throw new Client_Error(
        `Your keyword "${KEYWORD}" did contain non english letters, numbers or other symbols`,
      );
    }
    const JOKE_DATA = await db_read_joke(KEYWORD);
    res.render("keyword", { KEYWORD, JOKE_DATA });
  } catch (error) {
    if (error instanceof Client_Error) {
      res.writeHead(400, error.message).end();
    } else {
      console.error(error);
      res.writeHead(500).end();
    }
  }
});

APP.listen(SSR_PORT, () => {
  console.log(`Server Side Rendering on port ${SSR_PORT}`);
});
