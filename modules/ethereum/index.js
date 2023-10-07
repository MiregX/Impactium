const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { getWalletData, getDatabase, log, saveDatabase } = require('../../utils');
const utils = require('../../utils');

router.get('/', (request, response) => {
  try {

    const indexData = {
    }

    const indexTemplate = fs.readFileSync('views/ethereum/index.ejs', 'utf8');
    const body = ejs.render(indexTemplate, indexData);

    response.render('ethereum/template.ejs', {
      body,
      lang
    });

  } catch (err) {
    console.error(err);
    return response.redirect('/error');
  }
});

router.get('/error', (request, response) => {
  const indexTemplate = fs.readFileSync('views/ethereum/error.ejs', 'utf8');
  const body = ejs.render(indexTemplate, indexData);
	response.render('ethereum/template.ejs');
});

module.exports = router;