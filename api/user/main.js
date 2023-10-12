"use strict"

import express from "express";
import db_read_joke from "../../helpers/database/read_joke_db.js";

const APP = express();

APP.set('view engine', 'pug')
APP.get('/:keyword', async function(req, res) {
  const KEYWORD = req.params.keyword;
  const JOKE_DATA = await db_read_joke(KEYWORD);
  res.render('keyword', { KEYWORD, JOKE_DATA })
})

APP.get("api/read_joke/:keyword", function(req, res) {
  const KEYWORD = req.params.keyword
  const JOKE = db_read_joke(KEYWORD);
  if (JOKE) {
    res.statusMessage = "Joke was found"
    res.status(200).json(JOKE);
  }
  else {
    res.writeHead(404, `No joke with the keyword ${KEYWORD} was found`).end();
  }
});

APP.listen(8000, () => {
  console.log(`Example app listening on port 8000`)
})
