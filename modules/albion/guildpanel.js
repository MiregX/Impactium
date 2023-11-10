const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { User, Guild, getDatabase, getLanguagePack, log, getBattleBoard, formatDate } = require('../../utils');
const utils = require('../../utils');

router.get('/', async (request, response) => {  
  const guildNameFromLink = request.originalUrl.split('/')[1];

  try {
    await getBattleBoardStats(guildNameFromLink);
    await getDeadliests(guildNameFromLink);

    const user = new User();
    await user.fetch(request.cookies.token);
    user.setGuild(guildNameFromLink);

    const guild = new Guild();
    await guild.fetch(guildNameFromLink);

    const lang = getLanguagePack(request.cookies.lang);

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
    return response.redirect('/');
  }
});

async function getDeadliests(guildName) {
  const guild = new Guild();
  await guild.fetch(guildName);

  const sixHoursAgo = new Date(Date.now() - 60 * 60 * 1000 * 6);
  
  if (guild?.stats?.deadliest?.timestamp <= sixHoursAgo) {
    return guild.stats.deadliest.list;
  }

  let deadliests = [];
  const battleboard = await getBattleBoard({base: guildName, filters: { battlesLimit: 100, minimumGuildPlayers: 10}});

  if (battleboard.length === 0) return []

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

  guild.stats.deadliest = { timestamp: Date.now(), date: formatDate().date, list: deadliests.slice(0, 5) }

  await guild.save()

  return deadliests;
}

async function getBattleBoardStats(guildName) {
  let battleStats = {};

  const guild = new Guild();
  await guild.fetch(guildName);

  const sixHoursAgo = new Date(Date.now() - 60 * 60 * 1000 * 6);

  if (guild?.stats?.battleboard?.timestamp <= sixHoursAgo) {
    return guild.stats.battleboard.list;
  }

  const battleboard = await getBattleBoard({base: guildName, filters: { battlesLimit: 100, minimumPlayers: 20, minimumGuildPlayers: 10}});
  
  if (battleboard.length === 0) return []

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
    guildName = guildName.toLowerCase();

    const foundReportPlayers = report.players.find(object => object.guild.toLowerCase() === guildName);
    const foundReportKills = report.killsCount.find(object => object.guild.toLowerCase() === guildName);
    const foundReportFame = report.killFame.find(object => object.guild.toLowerCase() === guildName);
    const foundReportWinner = report.winner.guild ? report.winner.guild.toLowerCase() === guildName : false;

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
  
  if (!guild.stats) {
    guild.stats = {};
  }

  const rere = { timestamp: Date.now(), date: formatDate().date, list: Object.values(battleStats) }
  guild.stats.battleboard = rere;
  
  battleStats = Object.values(battleStats).splice(0, 14);

  await guild.save();
  log(battleStats);
  log(guild, 'r')
  return battleStats;
}


// const adminRouter = require('./admin');
// router.use('/admin', adminRouter);

module.exports = router;