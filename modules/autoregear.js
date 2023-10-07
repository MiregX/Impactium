const fs = require('fs');
const axios = require('axios');
const { getBattleBoard, log, getDatabase, saveDatabase, getUnknownUser } = require('../utils');
const discord = require('../discord');

async function deadPlayersListCreation(data) {
  const database = getDatabase();
  let foundCount = 0;
  const playersList = [];

  data.forEach(battle => {
    Object.values(battle.players).forEach(player => {
      if (database.guilds.some(validGuild => validGuild.hash === player.guildId) && player.deaths > 0) {
        player.startTime = Math.floor(new Date(battle.startTime).getTime() / 1000);
        player.endTime = Math.round(new Date(battle.endTime).getTime() / 1000);
        player.battle = battle.id;
        playersList.push(player);
        foundCount++;
      }
    });
  });

  database.regearList.forEach(regear => {
    regear.deathsInfo.forEach(death => {
      if (!death.isFound) {
        const regearBlock = playersList.find(block => block.battle === regear.battle && block.startTime === regear.startTime);
        if (!regearBlock) {
          playersList.push(regear);
        }
      }
    });
  });

  if (playersList.length === 0) return

  for (const player of playersList) {
    player.deathsInfo = await getDeathInfoFromLedger(player);
    if (player.deathsInfo.length > 0) {
      player.isFound = true;
    } else {
      player.isFound = false;
    }
  }
  
  await getPricesForVictimsInventory(playersList);
}

async function getPricesForVictimsInventory(playersList) {
  const playersListDebug = playersList;
  let database = getDatabase();
  try {
    let itemsPricesSet = new Set();

    const oneWeekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;

    for (const player of playersList) {
      for (const death of player.deathsInfo) {
        for (const item of Object.values(death.victim.loadout)) {
          if (item.id) {
            const existingItem = database.albionPrices.find(existing => existing.id === item.id);
            if (!existingItem || existingItem.timestamp < oneWeekAgo) {
              itemsPricesSet.add(item.id);
            }
          }
        }
      }
    }

    const itemsIds = [...itemsPricesSet].join(',');

    const response = await axios.get(`https://west.albion-online-data.com/api/v2/stats/Charts/${itemsIds}.json?locations=Fort%20Sterling,Lymhurst,Martlock,Bridgewatch,Thetford&qualities=4`, {
      timeout: 10000,
    });
    
    const itemPricesMap = summarizeItemPrices(response);
    saveAlbionPrices(itemPricesMap);
    database = getDatabase();

    for (const player of playersList) {
      player.sumSilver = 0;

      for (const death of player.deathsInfo) {
        death.silver = 0;

        for (const item of Object.values(death.victim.loadout)) {
          const foundItem = database.albionPrices.find(itemBlock => itemBlock.id === item.id);

          if (foundItem) {
            death.silver += foundItem.price;
            player.sumSilver += foundItem.price;
          } else {
            if (death.unfoundItems?.length !== 0) {
              death.unfoundItems.push(item.id);
            } else {
              death.unfoundItems = [];
              death.unfoundItems.push(item.id);
            }
          }
        }
      }
    }

    autoRegearFinally(playersList);

  } catch (error) {
    setTimeout(() => getPricesForVictimsInventory(playersListDebug), 1000);
  }
}



function summarizeItemPrices(response) {
  const itemPricesMap = new Map();

  response.data.forEach(item => {
    const { item_id, data } = item;
    
    if (!itemPricesMap.has(item_id)) {
      itemPricesMap.set(item_id, { sum: 0, count: 0 });
    }

    const itemData = itemPricesMap.get(item_id);

    data.prices_avg.forEach(price => {
      itemData.sum += price;
      itemData.count++;
    });
  });

  return Array.from(itemPricesMap).map(([item_id, { sum, count }]) => ({
    id: item_id,
    price: Math.round(sum / count),
    timestamp: Math.floor(Date.now() / 1000)
  }));
}

async function getDeathInfoFromLedger(playerData) {
  try {
    const response = await axios.get(`https://murderledger.com/api/players/${playerData.name}/events?skip=0&sort=time&take=50`, {
      timeout: 10000,
    });

    const result = response.data.events.filter(event => event.time > playerData.startTime && event.time < playerData.endTime && event.victim.name === playerData.name);
    return result;
  } catch (error) {
    setTimeout(() => getDeathInfoFromLedger(playerData), 1000);
  }
}

/* FINALY FUNCTION что находит в гильдии каждого игрока, и либо начистяет баланс по нику, либо добавляет в базу данных и делает то-же самое */

function autoRegearFinally(playersList) {
  return
  const database = getDatabase();

  database.regearList.unshift(...playersList);

  for (const player of playersList) {
    const matchedGuild = database.guilds.find(guild => guild.hash === player.guildId);
    matchedGuild.totalSilverRegeared += player.sumSilver * 0.8;
    matchedGuild.impactiumSilver += player.sumSilver * 0.06;
    matchedUser = database.users.find(user => user.guilds.find(guild => guild.guildName === player.name || guild.nameOfGuild === player.guildName));
    if (matchedUser) {
      const matchedUserGuild = matchedUser.guilds.find(guild => guild.idOfGuild === matchedGuild.id);
      matchedUserGuild.balance += player.sumSilver * 0.8;
    } else {
      getUnknownUser(matchedGuild.id, player.name);
    }
  }

/*  discord.addRegearedBalance(playersList);*/

  saveDatabase(database);
}

function saveAlbionPrices(itemPricesMap) {
  const database = getDatabase();

  itemPricesMap.forEach(item => {
    const existingItem = database.albionPrices.find(existing => existing.id === item.id);
    if (existingItem) {
      existingItem.price = item.price;
      existingItem.timestamp = item.timestamp;
    } else {
      database.albionPrices.push({
        id: item.id,
        price: item.price,
        timestamp: item.timestamp
      });
    }
  });
  
  saveDatabase(database);
}

function getAlbionPrices() {
  const { albionPrices } = JSON.parse(fs.readFileSync('json/codes_and_tokens.json', 'utf8'));
  return albionPrices;
}

module.exports = {
  deadPlayersListCreation,
}