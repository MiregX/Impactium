const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { getUserDataByToken, getDatabase, getLanguagePack, log, saveDatabase } = require('../../utils');
const utils = require('../../utils');

router.get('/', async (request, response) => {
  try {
    const user = getUserDataByToken(request.cookies.token, request.subdomains);
    const lang = getLanguagePack(request.cookies.lang);

    const indexData = {
      lang
    }

    const indexTemplate = fs.readFileSync('views/gov/index.ejs', 'utf8');
    const body = ejs.render(indexTemplate, indexData);

    response.render('template.ejs', {
      body,
      user,
      lang
    });
  } catch (err) {
    console.error(err);
    response.redirect('https://impactium.fun/error')
  }
});

module.exports = router;