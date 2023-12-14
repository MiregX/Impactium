const { User, getLanguagePack, log, formatDate, getBattleBoard, reportCounter, saveBattleBoard } = require('../utils');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

router.get('/', async (request, response) => {
  return response.status(200).send();
  const user = new User();
  await user.fetch(request.cookies.token);
  const lang = getLanguagePack(request.cookies.lang);
  const battleboard = await getBattleBoard();
  const pagetype = nav.products['metrix'];
  
  try {
    const metrixData = {
      lang,
      battleboard,
      formatDate,
      cutFame
    };

    const renderedMetrixTemplate = ejs.render(fs.readFileSync('views/metrix/metrix.ejs', 'utf8'), metrixData);

    response.render('template.ejs', {
      body: renderedMetrixTemplate,
      pagetype: {},
      user,
      lang
    });
  } catch (error) {
    response.redirect('/');
  }
});

router.get('/search/:name', async (request, response) => {
  return response.status(200).send();
  response.setHeader('Cache-Control', 'no-store');
  const { isEnabled, battlesLimit, minimumPlayers, minimumGuildPlayers } = request.cookies.filters || {};
  const filters = isEnabled ? { battlesLimit, minimumPlayers, minimumGuildPlayers } : {}

  const requestPayload = {
    base: request.params.name,
    filters
  };

  const battleboard = await getBattleBoard(requestPayload);

  if (request.accepts('html')) {
    const user = new User();
    await user.fetch(request.cookies.token);
    const lang = getLanguagePack(request.cookies.lang);
    const pagetype = nav.products['metrix'];

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
        lang,
        pagetype
      });
    } catch (error) {
      response.redirect('/');
    }
  } else if (request.accepts('json')) {
    return response.status(200).json(battleboard);
  }
});

router.get('/battle/:ids', async (request, response) => {
  return response.status(200).send();
  const ids = request.params.ids.split(',');
  const user = new User();
  await user.fetch(request.cookies.token);
  const battleboard = await getBattleBoard(ids);
  const lang = getLanguagePack(request.cookies.lang);
  const pagetype = nav.products['metrix'];

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
      lang,
      pagetype
    });
  } catch (error) {
    response.redirect('/');
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

module.exports = router;