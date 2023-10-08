const { getUserDataByToken, getDatabase, getLanguagePack, log, formatDate, getBattleBoard, reportCounter, saveBattleBoard } = require('../utils');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const { deadPlayersListCreation } = require('./autoregear');

router.get('/', async (request, response) => {
  const user = getUserDataByToken(request.cookies.token);
  const lang = getLanguagePack(request.cookies.lang);
  const database = getDatabase();
  const battleboard = await getBattleBoard();
  
  try {
    const metrixData = {
      lang,
      battleboard,
      formatDate,
      cutFame
    };
    const metrixTemplate = fs.readFileSync('views/metrix/metrix.ejs', 'utf8');
    const renderedMetrixTemplate = ejs.render(metrixTemplate, metrixData);

    response.render('template.ejs', {
      body: renderedMetrixTemplate,
      user,
      lang
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send('Internal Server Error');
  }
});

router.get('/search/:name', (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  const battleboard = getBattleBoard(request.params.name);
  if (request.accepts('html')) {
    const user = getUserDataByToken(request.cookies.token);
    const lang = getLanguagePack(request.cookies.lang);

    try {
      const metrixData = {
        lang,
        battleboard,
        formatDate,
        cutFame
      };
      
      const metrixTemplate = fs.readFileSync('views/metrix/metrix.ejs', 'utf8');
      const renderedMetrixTemplate = ejs.render(metrixTemplate, metrixData);

      response.render('template.ejs', {
        body: renderedMetrixTemplate,
        user,
        lang
      });
    } catch (err) {
      console.error(err);
      return response.status(500).send('Internal Server Error');
    }
  } else if (request.accepts('json')) {
    return response.status(200).json(battleboard);
  }
});

router.get('/battle/:ids', (request, response) => {
  const ids = request.params.ids.split(',');
  const battleboard = getBattleBoard(ids);
  const user = getUserDataByToken(request.cookies.token);
  const lang = getLanguagePack(request.cookies.lang);

  try {
    const reportCount = reportCounter(battleboard);
    const metrixData = {
      lang,
      reportCount,
      battleboard,
      formatDate,
      cutFame,
      isSubscriber: true
    };
    const metrixTemplate = fs.readFileSync('views/metrix/metrix_battle.ejs', 'utf8');
    const renderedMetrixTemplate = ejs.render(metrixTemplate, metrixData);

    response.render('template.ejs', {
      body: renderedMetrixTemplate,
      user,
      lang
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send('Internal Server Error');
  }
});

function cutFame(fame) {
  return fame >= 1000000 ? (fame / 1000000).toFixed(1) + 'm' : fame >= 1000
    ? (fame / 1000).toFixed(1) + 'k' : fame.toString();
}



async function cyclicUpdateBattleBoard() {
  try {
    const response = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/battles?sort=recent`);
    saveBattleBoard(response.data, true);
    setTimeout(cyclicUpdateBattleBoard, 5000);
  } catch (error) {
    setTimeout(cyclicUpdateBattleBoard, 1000);
  }
}


cyclicUpdateBattleBoard();


module.exports = router;