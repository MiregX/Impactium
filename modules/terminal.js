const { getUserDataByToken, getDatabase, getLanguagePack, log, getStatistics } = require('../utils');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');

router.get('/', (request, response) => {
  const user = getUserDataByToken(request.cookies.token);
  const lang = getLanguagePack(request.cookies.lang);

  const database = getDatabase();
  const statistics = getStatistics(true);

  !user.isCreator ? response.redirect('/') : null;

  try {
    const terminalData = {
      user,
      database,
      lang,
      statistics
    };

    const terminalTemplate = fs.readFileSync('views/terminal.ejs', 'utf8');
    const renderedTerminalTemplate = ejs.render(terminalTemplate, terminalData);

    response.render('template.ejs', {
      body: renderedTerminalTemplate,
      user,
      lang
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send('Internal Server Error');
  }
});

module.exports = router;
