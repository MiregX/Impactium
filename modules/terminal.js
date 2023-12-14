const { User, Guild, Schedule, GuildStatisticsInstance, getDatabase, getLanguagePack, log } = require('../utils');
const { getGuildsList, toggleAdminPermissions, deleteGuild } = require('../discord');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');

const setUser = async (request, response, next) => {
  const user = new User();
  await user.fetch(request.cookies.token);

  const lang = getLanguagePack(request.cookies.lang);

  if (!user.isFetched || !user.isCreator) return response.redirect('https://impactium.fun/');

  request.composed = { user, lang };
  request.user = user;
  request.lang = lang;

  next();
};

router.use('/', setUser);

router.get('/', async (request, response) => {
  try {
    const terminalData = {
      user: request.user,
      guilds: await handleGuildsStatistics(),
      lang
    };

    const body = ejs.render(fs.readFileSync('views/terminal.ejs', 'utf8'), terminalData);

    response.render('template.ejs', {
      body,
      user: request.user,
      lang: request.lang
    });
  } catch (error) {
    console.log(error);
    response.redirect('/');
  }
});

router.get('/dotenv', async (request, response) => {
  try {
    response.sendFile(path.join(__dirname, '..', '.env'));
  } catch (error) {
    response.status(200).send(request.lang.error_500);
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

router.post('/loadme', async (request, response) => {
  try {
    const user = new User();
    await user.fetch(request.cookies.token);
    if (!user.isCreator) return response.redirect('/');
    const lang = getLanguagePack(request.cookies.lang);
    let body = "";
    switch (request.body.value) {
      case 'user-schedule':
        const schedule = new Schedule(user._id);
        await schedule.fetch();
        body = ejs.render(fs.readFileSync('views/modules/terminal/schedule/main.ejs', 'utf8'), { schedule, lang });
        break;

      case 'guild-statistics':
        const guilds = await handleGuildsStatistics()
        body = ejs.render(fs.readFileSync('views/modules/terminal/guild/main.ejs', 'utf8'), { guilds, lang });
        break;

      default:
        response.status(403)
        break;
    }

    response.status(200).send(body);
  } catch (error) {
    log("Ошибка в функции /loadme в /terminal:" + error, 'r')
  }
});

async function handleGuildsStatistics() {
  const Guilds = await getDatabase("guilds");
  let guilds = await Guilds.find({}).toArray();

  guilds = guilds.sort((a, b) => {
    if (!a.isBotAdmin && !b.isBotAdmin) return b.members - a.members;
    if (!a.isBotAdmin && !a.isFakeGuild) return 1;
    if (!b.isBotAdmin && !b.isFakeGuild)return -1;
    return b.members - a.members;
  });
  
  const guild = new GuildStatisticsInstance();
  await guild.fetch(guilds.filter(guildDb => !guildDb.isFakeGuild)[0].id);
  guilds.find(guildDb => guildDb.id === guild.id).parsedStatistics = guild.parseStatistics()

  return guilds;
}

module.exports = router;