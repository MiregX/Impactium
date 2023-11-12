const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { User, getDatabase, getLanguagePack, log, saveDatabase } = require('../../utils');
const utils = require('../../utils');

router.get('/', async (request, response) => {
  try {
    response.send("Иди нахуй чуркабес ебучий. Виртуальное государсво только для избранных");
  } catch (err) {
    console.error(err);
    response.redirect('/');
  }
});

module.exports = router;