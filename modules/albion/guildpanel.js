const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { User, Guild, getDatabase, getLanguagePack, log, getBattleBoard, saveDatabase, formatDate } = require('../../utils');
const utils = require('../../utils');

router.get('/', async (request, response) => {
  try {
    const user = new User();
    await user.fetch(request.cookies.token);
    user.setGuild(request.subdomains);

    const guild = new Guild();
    await guild.fetch(request.subdomains);

    const lang = getLanguagePack(request.cookies.lang);

    await getBattleBoardStats(guild.name);
    await getDeadliests(guild.name);

    const indexData = {
      lang,
      guild,
      user
    }

    const indexTemplate = fs.readFileSync('views/albion/index.ejs', 'utf8');
    const body = ejs.render(indexTemplate, indexData);

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

async function getDeadliests(guildName) {
  const guilds = await getDatabase("guilds");
  const foundGuild = await guilds.findOne({ name: { $regex: `^${guildName}$`, $options: 'i' } });
  const sixHoursAgo = new Date(Date.now() - 60 * 60 * 1000 * 6);

  if (foundGuild && foundGuild.stats?.deadliest?.timestamp > sixHoursAgo) {
    return foundGuild.stats.deadliest.list;
  }

  let deadliests = [];
  const battleboard = await getBattleBoard({base: guildName, filters: { battlesLimit: 100, minimumGuildPlayers: 10}});

  battleboard.forEach(battle => {
    Object.values(battle.players).forEach(player => {
      if (player.guildName.toLowerCase() === guildName.toLowerCase()) {
        let existingPlayer = deadliests.find(p => p.name === player.name);

        if (existingPlayer) {
          existingPlayer.kills += player.kills;
        } else {
          deadliests.push({ name: player.name, kills: player.kills });
        }
      }
    });
  });

  deadliests.sort((a, b) => b.kills - a.kills);

  foundGuild.stats.deadliest = { timestamp: Date.now(), list: deadliests.slice(0, 5) }

  return deadliests;
}

async function getBattleBoardStats(guildName) {
  let battleStats = {};

  const guild = new Guild();
  await guild.fetch(guild);

  const sixHoursAgo = new Date(Date.now() - 60 * 60 * 1000 * 6);

  if (guild?.stats?.battleboard?.timestamp > sixHoursAgo && false) {
    return guild.stats.battleboard.list;
  } else {
    const battleboard = await getBattleBoard({base: guildName, filters: { battlesLimit: 100, minimumPlayers: 20, minimumGuildPlayers: 10}});

    battleboard.forEach(battle => {
      const startTime = new Date(battle.startTime);
      const formattedDate = formatDate(startTime).date;

      if (!battleStats[formattedDate]) {
        battleStats[formattedDate] = {
          date: formattedDate,
          players: 0,
          kills: 0,
          fame: 0,
          winrate: 0
        };
      }

      const report = utils.reportCounter(battle);
      const normalizedGuildName = guildName.toLowerCase();

      const foundReportPlayers = report.players.find(object => object.guild.toLowerCase() === normalizedGuildName);
      const foundReportKills = report.killsCount.find(object => object.guild.toLowerCase() === normalizedGuildName);
      const foundReportFame = report.killFame.find(object => object.guild.toLowerCase() === normalizedGuildName);
      const foundReportWinner = report.winner.guild ? report.winner.guild.toLowerCase() === normalizedGuildName : false;

      foundReportPlayers ? battleStats[formattedDate].players += foundReportPlayers.players : null;
      foundReportKills ? battleStats[formattedDate].kills += foundReportKills.kills : null;
      foundReportFame ? battleStats[formattedDate].fame += foundReportFame.fame : null;
      foundReportWinner ? battleStats[formattedDate].wins = (battleStats[formattedDate].wins || 0) + 1 : null;

      battleStats[formattedDate].battles = (battleStats[formattedDate].battles || 0) + 1;
       
      if (battleStats[formattedDate].battles > 0) {
        battleStats[formattedDate].winrate = Math.round((battleStats[formattedDate].wins / battleStats[formattedDate].battles) * 100);
      } else {
        battleStats[formattedDate].winrate = 0;
      }
    });
  }
  
  if (!guild.stats) {
    guild.stats = {};
  }

  guild.stats.battleboard = { timestamp: Date.now(), list: Object.values(battleStats) };

  battleStats = Object.values(battleStats).splice(0, 14);

  // guild.save()

  return battleStats;
}


// const adminRouter = require('./admin');
// router.use('/admin', adminRouter);

module.exports = router;