const fs = require('fs');
const ftp = require('ftp');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const { colors, mongoLogin } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json'), 'utf8');
const { MongoClient, ServerApiVersion } = require('mongodb');

function getUserDataByToken(token, whatGuild = undefined) {
  const database = getDatabase();
  const user = database.users.find(user => user.token === token);
  const selectedGuild = String(whatGuild).toLowerCase().replace(/-/g, ' ');

  const urlGuild = database.guilds.find(guild => guild.name.toLowerCase() === selectedGuild)

  if (!user && urlGuild) { // Если пользователь не авторизован но перешёл по правильной ссылке возвращам название гильдии
    return {
      nameOfGuild: urlGuild.name,
      idOfGuild: urlGuild.id,
      avatarOfGuild: urlGuild.avatar
    };
  }

  if (!user) {
    return false;
  }

  const userGuild = user.guilds ? user.guilds.find(guildObj => guildObj.nameOfGuild.toLowerCase() === selectedGuild) : false;

  if (whatGuild === undefined) { // Если заходим на ссылку без гильды
    return {
      id: user.id,
      avatar: user.avatar,
      guilds: user.guilds,
      visibleName: user.global_name || user.username + '#' + user.discriminator,
      banner_color: user.banner_color,
      isCreator: user.isCreator
    };
  }

  if (userGuild) {
    const visibleName = userGuild.guildName || user.global_name || user.username + '#' + user.discriminator;

    return {
      id: user.id,
      avatar: user.avatar,
      globalName: user.global_name,
      visibleName: visibleName,
      isGuildMember: userGuild.isGuildMember,
      isAdmin: userGuild.isAdmin,
      isAllianceMember: userGuild.isAllianceMember,
      isModerator: userGuild.isModerator,
      isRaidLeader: userGuild.isRaidLeader,
      balance: userGuild.balance,
      nameOfGuild: userGuild.nameOfGuild,
      idOfGuild: userGuild.idOfGuild,
      avatarOfGuild: urlGuild.avatar
    };
  }

  if (urlGuild) {
    return {
      id: user.id,
      avatar: user.avatar,
      visibleName: user.global_name || user.username + '#' + user.discriminator,
      isGuildMember: user.isGuildMember,
      isAdmin: user.isAdmin,
      isAllianceMember: user.isAllianceMember,
      isModerator: user.isModerator,
      isRaidLeader: user.isRaidLeader,
      balance: 0,
      nameOfGuild: urlGuild ? urlGuild.name : '',
      idOfGuild: urlGuild ? urlGuild.id : '',
      avatarOfGuild: urlGuild.avatar
    };
  }
  log("ПРОИЗОШЛА ХУЙНЯ, ПОЛЬЗОВАТЕЛЬ НАЕБАЛ СИСТЕМУ!", 'r');
  return false;
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

const mongo = new MongoClient(mongoLogin, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function databaseConnect() {
  if (!mongo.isConnected) {
    await mongo.connect();
  }
}

async function getBattleBoard(params = false) {
  const { battlesLimit = 50, minimumPlayers = 10, minimumGuildPlayers = 1 } = params.filters || {}
  await databaseConnect();
  const Battleboard = mongo.db().collection("battleboard");

  try {
    if (params) {
      if (Array.isArray(params.base)) { // Массборд
        log("1", 'g');
        return getMultiBoard(params.base);
      }

      const id = parseInt(params.base);
      if (typeof id === "number" && !isNaN(id)) { // Поиск по id
        log("2", 'y');
        const battle = await Battleboard.findOne({ id });
        return battle || false;
      }      
  
      if (typeof params.base === "string") {
        const normalizedName = params.base.toLowerCase();

        // Создаем объект запроса для поиска
        const filter = {
          $or: []
        };
        
        const cursor = Battleboard.find({}).sort({ id: -1 });
        
        while (await cursor.hasNext()) {
          const battle = await cursor.next();
          const players = Object.values(battle.players);
        
          const isBattleValid = players.length >= minimumPlayers &&
                                players.filter(player => (
                                  player.guildName.toLowerCase() === normalizedName || 
                                  player.allianceName.toLowerCase() === normalizedName
                                )).length >= minimumGuildPlayers;
          
          if (isBattleValid) {
            filter.$or.push({ "_id": battle._id });
          }
          
          if (filter.$or.length >= battlesLimit) {
            break;
          }
        }
        
        const result = (filter.$or.length > 0) ? await Battleboard.find({ $or: filter.$or }).toArray() : [];
        return result;
      }
    }
    const battleboard = await Battleboard.find({}).sort({ id: -1 }).limit(50).toArray();
    return battleboard;
  } catch (error) {
    console.log(error);
  }
}

async function saveBattleBoard(data) {
  const existBattles = await mongo.db().collection("battleboard").find({ id: { $in: data.map(item => item.id) } }).toArray();

  data = data.filter(battle => !existBattles.some(existingBattle => existingBattle.id === battle.id)); // Фильтрация по несуществующим ID

  data = data.filter(battle => Object.keys(battle.players).length > 2); // Фильтрация по кол-ву игроков > 9

  if (data.length > 0) {
    await mongo.db().collection("battleboard").insertMany(data);
  }
}

module.exports = {
  getDiscordLanguagePack,
  saveNewGuildLanguage,
  getUserDataByToken,
  userAuthentication,
  saveBattleBoard,
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

// const normalizedName = params.base.toLowerCase();
// const filteredResults = [];
// let eventLimiter = 0;

// for (const item of battleboard) {
//   if (eventLimiter >= battlesLimit) break;

//   if ((Object.values(item.guilds).some(guild => guild.name.toLowerCase() === normalizedName) ||
//     Object.values(item.alliances).some(alliance => alliance.name.toLowerCase() === normalizedName)) &&
//     Object.keys(item.players).length >= playersLimit) {
//     if (!guildPlayersLimit) {
//       filteredResults.push(item);
//       eventLimiter++;
//     } else if (Object.values(item.players).filter(player => player.guildName.toLowerCase() === normalizedName).length > guildPlayersLimit ||
//     Object.values(item.players).filter(player => player.allianceName.toLowerCase() === normalizedName).length  > guildPlayersLimit) {
//       filteredResults.push(item);
//       eventLimiter++;
//     }
//   }
// }