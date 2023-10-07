const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { getUserDataByToken, getDatabase, getLanguagePack, setStatistics, log, getBattleBoard, saveDatabase, formatDate } = require('../../utils');
const utils = require('../../utils');

router.get('/', (request, response) => {
  try {
    const user = getUserDataByToken(request.cookies.token, request.subdomains);
    const lang = getLanguagePack(request.cookies.lang);

    const indexData = {
      battleboardStats: getBattleBoardStats(user.nameOfGuild),
      deadliests: getDeadliests(user.nameOfGuild),
      lang
    }

    const indexTemplate = fs.readFileSync('views/albion/index.ejs', 'utf8');
    const body = ejs.render(indexTemplate, indexData);

    response.render('albion/template.ejs', {
      body,
      user,
      lang
    });

    setStatistics('guildsWebJoins');

  } catch (err) {
    console.error(err);
    return response.status(500).send('Internal Server Error');
  }
});

function getDeadliests(guild) {
  const database = getDatabase();
  const foundGuild = database.guilds.find(guildObj => guildObj.name.toLowerCase() === guild.toLowerCase());
  const sixHoursAgo = new Date(Date.now() - 60 * 60 * 1000 * 6);

  if (foundGuild && foundGuild.stats.deadliest.timestamp > sixHoursAgo) {
    return foundGuild.stats.deadliest.list;
  }

  let deadliests = [];
  const battleboard = getBattleBoard(guild, 500, 10);

  battleboard.forEach(battle => {
    Object.values(battle.players).forEach(player => {
      if (player.guildName.toLowerCase() === guild.toLowerCase()) {
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

  saveDatabase(database);

  return deadliests;
}

function getBattleBoardStats(guild) {
  let battleStats = {};

  const database = getDatabase();
  const foundGuild = database.guilds.find(guildObj => guildObj.name.toLowerCase() === guild.toLowerCase());
  const sixHoursAgo = new Date(Date.now() - 60 * 60 * 1000 * 6);

  if (foundGuild?.stats?.battleboard?.timestamp > sixHoursAgo && false) {
    return foundGuild.stats.battleboard.list;
  } else {
    const battleboard = getBattleBoard(guild, 500, 20, 10);

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
      const normalizedGuildName = guild.toLowerCase();

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

  foundGuild.stats.battleboard = { timestamp: Date.now(), list: Object.values(battleStats) };
  saveDatabase(database);

  battleStats = Object.values(battleStats).splice(0, 14);

  return battleStats;
}


// const adminRouter = require('./admin');
// router.use('/admin', adminRouter);

module.exports = router;