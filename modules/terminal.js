const { User, getDatabase, getLanguagePack, log } = require('../utils');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');

router.get('/', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);
  const lang = getLanguagePack(request.cookies.lang);

  !user.isCreator ? response.redirect('/') : null;

  try {
    const terminalData = {
      user,
      lang
    };

    const body = ejs.render(fs.readFileSync('views/terminal.ejs', 'utf8'), terminalData);

    response.render('template.ejs', {
      body,
      user,
      lang
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send('Internal Server Error');
  }
});

module.exports = router;
