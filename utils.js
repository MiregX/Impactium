const fs = require('fs');
const ftp = require('ftp');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const { colors, mongoLogin } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json'), 'utf8');
const { MongoClient, ServerApiVersion } = require('mongodb');

async function getUserDataByToken(token) {
  const database = getDatabase();
  const user = database.users.find(user => user.token === token);

  if (!user) {
    return false;
  }

  return {
    id: user.id,
    avatar: user.avatar,
    visibleName: user.global_name || user.username + '#' + user.discriminator,
    guilds: user.guilds
  };
}



function getLanguagePack(languagePack = "en") {
  let lang;
  try {
    lang = require(`./static/lang/${languagePack}.json`);
  } catch (err) {
    lang = require(`./static/lang/en.json`);
  }
  return lang;
}

function userAuthentication(data) {
  try {
    if (data.body.error) return;

    const token = generateToken(32);
    const database = getDatabase();
    const userPayload = data.body;
    const userDatabase = database.users.find(user => user.id === userPayload.id);
    userPayload.token = token;

    if (!userDatabase.mainToken) {
      userPayload.mainToken = generateToken(64);
    }

    if (userDatabase) {
      Object.assign(userDatabase, userPayload);
    } else {
      database.users.push(userPayload);
    }

    saveDatabase(database);
    setStatistics(`lang${userPayload.locale}`);

    return { lang: userPayload.locale, token };
  } catch (error) {
    log(error, 'r');
  }
}

function generateToken(sumbolsLong) {
  return crypto.randomBytes(sumbolsLong).toString('hex');
}

function getDiscordLanguagePack(guildId) {
  const database = getDatabase();
  const languagePack = database.guilds.find(guildObj => guildObj.guildId === guildId);
  let lang;

  try {
    lang = require(`./static/lang/${languagePack.guildMainLanguage}.json`);
  } catch (err) {
    lang = require(`./static/lang/en.json`);
  }

  return lang;
}

function saveNewGuildLanguage(lang, guildId) {
  const database = getDatabase()
  const languagePack = database.guilds.find(guildObj => guildObj.guildId === guildId);

  languagePack.guildMainLanguage = lang;

  saveDatabase(database);
}

function log(...args) {
  let message = '';
  let color = 'o';

  for (const arg of args) {
    if (typeof arg === 'string') {
      if (arg in colors) {
        color = arg;
      } else {
        message += arg;
      }
    } else {
      const formattedJson = JSON.stringify(arg, null, 2);
      message += formattedJson;
    }
  }

  console.log(colors.b
               + "["
               + colors.c
               + formatDate().time
               + colors.b
               + "] "
               + colors[color]
               + message
               + colors.o
              );
}

function formatDate(toDate = false, isPrevDay = false) {
  let date = new Date();
  if (toDate) {
    date = new Date(toDate);
  }

  if (isPrevDay) {
    date.setDate(date.getDate() - 1);
  }

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return {
    time: `${hours}:${minutes}:${seconds}`,
    shortTime: `${hours}:${minutes}`,
    date: `${day}.${month}.${year}`,
    shortDate: `${hours}:${minutes} ${day}.${month}`
  };
}

function getDatabase() {
  const database = JSON.parse(fs.readFileSync('json/database.json', 'utf8'));
  return database;
}

function saveDatabase(database) {
  fs.writeFileSync('json/database.json', JSON.stringify(database, null, 2), 'utf8');
}

function getStatistics(isFilter = false) {
  let statistics = JSON.parse(fs.readFileSync('json/statistics.json', 'utf8'));
  
  if (isFilter) {
    statistics = statistics.slice(-7);
  }
  
  return statistics;
}

function saveStatistics(statistics) {
  fs.writeFileSync('json/statistics.json', JSON.stringify(statistics, null, 2), 'utf8');
}

function setStatistics(statParam, count = 1, guild = "unset") {
  let statistics = getStatistics();
  
  if (typeof count === 'string') {
    count = parseInt(count);
  }
  
  const today = formatDate(false).date;
  const thisDay = statistics.find(object => object.day === today);
  
  if (thisDay) {
    thisDay.stats[statParam] += count;
    saveStatistics(statistics);
  } else {
    createNewStatisticsDay();
  }
}

function createNewStatisticsDay() {
  let statistics = getStatistics();
  const today = formatDate(false).date;
  const yesterday = formatDate(true).date;
  const newDayData = {
    day: today,
    stats: {
      mainWebJoins: 0,
      guildsWebJoins: 0,
      ctaWebJoins: 0,
      regearWebJoins: 0,
      ctaTickets: 0,
      regearTickets: 0,
      userInfoJoins: 0,
      logins: 0,
      logouts: 0,
      langen: 0,
      langit: 0,
      langis: 0,
      langru: 0,
      languk: 0,
      discordBotAllComs: 0,
      discordBotSumbalComs: 0,
      discordBotAddbalComs: 0,
      discordBotRembalComs: 0,
      documentationJoins: 0
    }
  };

  statistics.push(newDayData);
  saveStatistics(statistics);
}

function getMultiBoard(ids, battleboard) {
  const results = ids.map(id => {
    const numericId = parseInt(id);
    if (typeof numericId === 'number' && !isNaN(numericId)) {
      const battle = battleboard.find(item => item.id === numericId);
      return battle ? battle : false;
    }
    return false;
  }).filter(battle => battle !== false);

  return results.length > 0 ? results : false;
}


function getBattleBoard(someValue = false, battlesLimit = 50, playersLimit = 10, guildPlayersLimit = false) {
  const battleboard = JSON.parse(fs.readFileSync('json/battleboard.json', 'utf8'));

  if (someValue) {
    if (Array.isArray(someValue)) {
      return getMultiBoard(someValue, battleboard);
    }
    const id = parseInt(someValue);
    if (typeof id === "number" && !isNaN(id)) {
      return battleboard.find(item => item.id === id) || false;
    }

    if (typeof someValue === "string") {
      const normalizedName = someValue.toLowerCase();
      const filteredResults = [];
      let eventLimiter = 0;

      for (const item of battleboard) {
        if (eventLimiter >= battlesLimit) break;

        if ((Object.values(item.guilds).some(guild => guild.name.toLowerCase() === normalizedName) ||
          Object.values(item.alliances).some(alliance => alliance.name.toLowerCase() === normalizedName)) &&
          Object.keys(item.players).length >= playersLimit) {
          if (!guildPlayersLimit) {
            filteredResults.push(item);
            eventLimiter++;
          } else if (Object.values(item.players).filter(player => player.guildName.toLowerCase() === normalizedName).length > guildPlayersLimit ||
          Object.values(item.players).filter(player => player.allianceName.toLowerCase() === normalizedName).length  > guildPlayersLimit) {
            filteredResults.push(item);
            eventLimiter++;
          }
        }
      }

      return filteredResults;
    }
  }

  return battleboard;
}

function reportCounter(battleboard) {
  // Этап 1: Собрать информацию о гильдиях и игроках
  const playersMap = new Map();
  const killsCountMap = new Map();
  const killFameMap = new Map();
  let maxPlayers = 0;
  let maxKills = 0;
  let maxKillFame = 0;

  const battleArray = Array.isArray(battleboard) ? battleboard : [battleboard];

  battleArray.forEach(battle => {
    for (const playerId in battle.players) {
      const player = battle.players[playerId];
      const guildName = player.guildName || player.name;
      const allianceName = player.allianceName || player.guildName;
      const guildKey = allianceName ? allianceName : guildName;

      if (!playersMap.has(guildKey)) {
        playersMap.set(guildKey, { guild: guildName, alliance: allianceName, players: 0 });
      }

      playersMap.get(guildKey).players++;
      maxPlayers = Math.max(maxPlayers, playersMap.get(guildKey).players);

      if (!killsCountMap.has(guildKey)) {
        killsCountMap.set(guildKey, { guild: guildName, alliance: allianceName, kills: 0 });
      }

      killsCountMap.get(guildKey).kills += player.kills;
      maxKills = Math.max(maxKills, killsCountMap.get(guildKey).kills);

      if (!killFameMap.has(guildKey)) {
        killFameMap.set(guildKey, { guild: guildName, alliance: allianceName, fame: 0 });
      }

      killFameMap.get(guildKey).fame += player.killFame;
      maxKillFame = Math.max(maxKillFame, killFameMap.get(guildKey).fame);
    }
  });

  const result = {
    players: [],
    killsCount: [],
    killFame: []
  };

  for (const [key, data] of playersMap.entries()) {
    const widthPercentage = Math.round((data.players / maxPlayers) * 80);
    result.players.push({ width: `${widthPercentage}%`, players: data.players, guild: data.guild, alliance: data.alliance });
  }

  for (const [key, data] of killsCountMap.entries()) {
    const killsWidthPercentage = Math.round((data.kills / maxKills) * 80);
    result.killsCount.push({ width: `${killsWidthPercentage}%`, kills: data.kills, guild: data.guild, alliance: data.alliance });
  }

  for (const [key, data] of killFameMap.entries()) {
    const fameWidthPercentage = Math.round((data.fame / maxKillFame) * 80);
    result.killFame.push({ width: `${fameWidthPercentage}%`, fame: data.fame, guild: data.guild, alliance: data.alliance });
  }

  result.players = result.players
    .sort((a, b) => b.players - a.players)
    .slice(0, 4);

  result.killsCount = result.killsCount
    .sort((a, b) => b.kills - a.kills)
    .slice(0, 4);

  result.killFame = result.killFame
    .sort((a, b) => b.fame - a.fame)
    .slice(0, 4);

  result.winner = calculateWinnerGuild(result);

  return result;
}

function calculateWinnerGuild(result) {
  const guildCounts = {};
  let guild = false;
  let alliance = false;

  for (const category in result) {
    const firstGuild = result[category][0].guild;
    const firstAlliance = result[category][0].alliance;

    guildCounts[firstGuild] = (guildCounts[firstGuild] || 0) + 1;
    
    if (guildCounts[firstGuild] >= 2) {
      guild = firstGuild;
      if (!alliance) {
        alliance = firstAlliance;
      }
      break;
    }
  }

  return { guild, alliance };
}

function ftpUpload(filePathOnHost) {
  const ftpClient = new ftp();
  const ftpConfig = {
    host: 'ftpupload.net',
    user: 'b12_33593520',
    password: 'loginandpass'
  };

  const absoluteFilePath = path.join(__dirname, 'static/img/', filePathOnHost);

  ftpClient.on('ready', () => {
    ftpClient.put(absoluteFilePath, `/api.impactium.fun/htdocs/static/img/${filePathOnHost}`, (err) => {
      if (err) {
        console.error('Ошибка при загрузке файла:', err);
      }
      ftpClient.end();
    });
  });
}


module.exports = {
  getDiscordLanguagePack,
  saveNewGuildLanguage,
  getUserDataByToken,
  userAuthentication,
  getLanguagePack,
  getBattleBoard,
  setStatistics,
  getStatistics,
  getMultiBoard,
  reportCounter,
  generateToken,
  saveDatabase,
  getDatabase,
  formatDate,
  ftpUpload,
  log,
};