"use strict"

import express from "express";

const APP = express();

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
