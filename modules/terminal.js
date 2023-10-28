const { User, Guild, getDatabase, getLanguagePack, log } = require('../utils');
const { getGuildsList, toggleAdminPermissions } = require('../discord');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');

router.get('/', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);

  const Secure = await getDatabase("guilds");
  const guilds = await Secure.find({}).toArray();

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
  } catch (err) {
    console.error(err);
    return response.status(500).send('Internal Server Error');
  }
});

router.post('/guild-mode-select', async (request, response) => {
  const user = new User();
  await user.fetch(request.cookies.token);
  if (!user.isCreator) return response.redirect('/');

  const guild = new Guild();
  await guild.fetch(request.body.id);

  if (guild.id) {
    const body = ejs.render(fs.readFileSync('views/modules/terminalGuild.ejs', 'utf8'), { guild });
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
    const body = ejs.render(fs.readFileSync('views/modules/terminal/guild/8-ght-panel.ejs', 'utf8'), { guild });
    response.status(200).send(body);
    await guild.save();
  } else {
    response.status(403).send()
  }
});

module.exports = router;