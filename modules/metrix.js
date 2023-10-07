const { getUserDataByToken, getDatabase, getLanguagePack, log, formatDate, getBattleBoard, reportCounter } = require('../utils');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const { deadPlayersListCreation } = require('./autoregear');

router.get('/', (request, response) => {
  const user = getUserDataByToken(request.cookies.token);
  const lang = getLanguagePack(request.cookies.lang);
  const database = getDatabase();
  const battleboard = getBattleBoard();
  
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
    setTimeout(cyclicUpdateBattleBoard, 30000);
  } catch (error) {
    setTimeout(cyclicUpdateBattleBoard, 5000);
  }
}

function saveBattleBoard(data, isFromAPI = false) {
  let battleboard = getBattleBoard();

  if (isFromAPI) {
    data = data.filter(item => !battleboard.some(boardItem => boardItem.id === item.id));
    battleboard.unshift(...data);
    if (data.length > 0) {
      deadPlayersListCreation(data);
    }
  } else {
    battleboard = data;
  }

  fs.writeFileSync('json/battleboard.json', JSON.stringify(battleboard, null, 2), 'utf8');
}

cyclicUpdateBattleBoard();


module.exports = router;