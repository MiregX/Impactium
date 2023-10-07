const https = require('https');
const fs = require('fs');
const { getUserDataByToken, getDatabase, saveDatabase, setStatistics, log, saveSpares, getDiscordLanguagePack, saveNewGuildLanguage, generateToken } = require('./utils');

const secrets = JSON.parse(fs.readFileSync('json/codes_and_tokens.json', 'utf8'));
const commands = JSON.parse(fs.readFileSync('json/commands.json', 'utf8'));
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { createReadStream } = require('fs');

const rest = new REST({ version: '10' }).setToken(secrets.discordBotToken);

const mainBot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

mainBot.on('interactionCreate', async (interaction) => {
  const { commandName, options } = interaction;

  if (commandName === 'join-second-bot') {
    interaction.reply('Пошёл нахуй');
    return;
  }
});

async function updateUserDisplayName() {
  try {
    const database = getDatabase();

    const userIds = new Set();
    for (const user of database.users) {
      userIds.add(user.id);
    }

    const guildMembersMap = new Map();

    for (const guildData of database.guilds) {
      const guildId = guildData.id;
      const guild = mainBot.guilds.cache.get(guildId);

      const members = await guild.members.fetch();

      if (!members) return

      const membersInDatabase = members.filter(member => userIds.has(member.user.id));
      guildMembersMap.set(guildId, membersInDatabase);
    }

    const updatedUsers = [];

    for (const user of database.users) {
      const userId = user.id;

      const updatedGuilds = [];
      for (const guildData of user.guilds) {
        const guildId = guildData.id;
        const members = guildMembersMap.get(guildId);

        if (members) {
          const member = members.get(userId);
          if (member) {
            const displayName = member.displayName
              .replace(/\((.*?)\)|\[(.*?)\]|\{(.*?)\}/g, '')
              .replace(/[_\-"'`]/g, '')
              .replace(/[^a-zA-Z0-9]+/g, '');

            const roles = member.roles.cache;

            const isModerator = roles.some(role => guildData.roles.moderatorRoles.includes(role.id));
            const isRaidLeader = roles.some(guildData.roles.raidLeaderRoleId);
            const isAdmin = roles.has(guildData.roles.guildMasterRoleId);

            const isAllianceMember = roles.has(guildData.roles.allianceRoleId);

            let guildBalance = 0;
            if (user.guilds && Array.isArray(user.guilds)) {
              const existingGuild = user.guilds.find(g => g.idOfGuild === guildId);
              if (existingGuild && typeof existingGuild.balance === 'number') {
                guildBalance = existingGuild.balance;
              }
            }

            const guildInfo = {
              nameOfGuild: guildData.guildName,
              idOfGuild: guildData.guildId,
              balance: guildBalance,
              isAdmin: isAdmin,
              guildName: displayName,
              isGuildMember: roles.has(guildData.memberRoleId),
              isAllianceMember: isAllianceMember,
              isModerator: isModerator,
              isRaidLeader: isRaidLeader,
            };
            updatedGuilds.push(guildInfo);
          }
        }
      }

      user.guilds = updatedGuilds;
      updatedUsers.push(user);
    }
    database.users.push(updatedUsers);

    saveDatabase(database);

  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

async function sendNewCTAMessage(guild, date, time, event, description, visible, ctaCreator, isCTA) {
  const uniqueGuild = guilds.find(guildObj => guildObj.guildName === guild)
  try {
    let channel = await mainBot.channels.fetch(uniqueGuild.ctaChannelId);
    let message = ` <@&${uniqueGuild.memberRoleId}> -------------\nA new CTA has appeared on ${date}.\nYou can sign up on the website http://mythology.impactium.fun/cards/cta\n**Key information:**\n • Date: ${date}\n • Time: ${time}UTC\n • Event: ${event}\n • Description: \n_${description}_`;

    if (!isCTA) {
      channel = await mainBot.channels.fetch(uniqueGuild.eventChannelId);
      message = ` <@&${uniqueGuild.memberRoleId}> -------------\nA new event has appeared on ${date}.\nYou can sign up on the website http://mythology.impactium.fun/cards/cta (**ITS NOT CTA**)\n**Key information:**\n • Creator: <@${ctaCreator}>\n • Date: ${date}\n • Time: ${time}UTC\n • Event: ${event}\n • Description: \n_${description}_`;
    }
   
    if (visible === 'alliance') {
      const alliances = uniqueGuild.allianceRoleId.map(roleId => `<@&${roleId}>`).join(' ');
      message = `------------- ${alliances}` + message;
    } else {
      message = '-------------' + message;
    }

    channel.send({ content: message })
      .then(() => {
        console.log('Сообщение успешно отправлено в канал');
      })
      .catch(error => {
        console.error('Ошибка при отправке сообщения в канал:', error);
      });
  } catch (error) {
    console.error('Ошибка из Discord:', error);
  }
}

async function sendMessage(channelId, message, guild) {
  try {
    const channel = await mainBot.channels.fetch(channelId);
    if (channel) {
      await channel.send(message);
    } else {
      console.error(`Канал с идентификатором ${channelId} не найден или не является текстовым каналом`);
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения в канал:', error);
  }
}

async function applyRegear(requestData, guild) {
  const uniqueGuild = guilds.find(guildObj => guildObj.guildName === guild);
  const { playerId, status, dataFromInput, cta_time, cta_date, cta_event } = requestData;

  try {
    if (status === 'confirm') {
      const confirmMessage = `<@${playerId}>, регир за ${cta_event} (${cta_date} ${cta_time}) был одобрен. На ваш счёт зачислено **${dataFromInput}** серебра 🎉`;
      await sendMessage(uniqueGuild.confirmRegearChannelId, confirmMessage);
      updateBalance(playerId, guild, dataFromInput);
    }
    if (status === 'decline') {
      const declineMessage = `Внимание <@${playerId}>, ты не получишь регир за ${cta_event} (${cta_date} ${cta_time}) по причине:\n**${dataFromInput}**`;
      await sendMessage(uniqueGuild.declineRegearChannelId, declineMessage);
    }
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
  }
}

function updateBalance(playerId, guild, dataFromInput) {
  const database = getDatabase();
  const userPayload = database.find(user => user.id === playerId);
  const guildObj = userPayload.guilds.find(guildObj => guildObj.nameOfGuild === guild);
  const newBalance = parseInt(guildObj.balance) + parseInt(dataFromInput);

  guildObj.balance = newBalance;
  setStatistics('discordBotAddbalComs');
  saveDatabase(database);
}

mainBot.on('interactionCreate', async (interaction) => {
  const { commandName, options } = interaction;
  const lang = getDiscordLanguagePack(interaction.guildId);

  const database = getDatabase();

  if (commandName === 'remove-money' || commandName === 'add-money') {

    const isAdmin = interaction.member.permissions.has('Administrator');

    if (!isAdmin) {
      return interaction.reply(lang.notEnoughPerms);
    }

    let player = options.getString('player');
    player = player.replace(/^<@/, '').replace(/>$/, '');
    const amount = options.getInteger('amount');

    const targetPlayer = database.find((p) => p.id === player);

    if (!targetPlayer) {
      interaction.reply(`Игрок <@${player}> не найден в базе данных.`);
      return;
    }

    if (amount <= 0) {
      interaction.reply(lang.amountMustBePositive);
      return;
    }

    if (commandName === 'remove-money') {
      if (amount <= targetPlayer.balance) {
        let whatGuild = targetPlayer.guilds.find(guildObj => idOfGuild === interaction.guildId)
        whatGuild.balance -= amount;

        interaction.reply(`У игрока <@${player}> успешно снято ${amount} серебра. Текущий баланс: ${targetPlayer.balance}.`);
        setStatistics('discordBotRembalComs');
      } else {
        interaction.reply(`У игрока <@${player}> недостаточно серебра на счету. Текущий баланс: ${targetPlayer.balance}.`);
      }
    }
    if (commandName === 'add-money') {
      let whatGuild = targetPlayer.guilds.find(guildObj => idOfGuild === interaction.guildId)
      whatGuild.balance += amount;

      interaction.reply(`Игроку <@${player}> успешно начислено ${amount} серебра. Текущий баланс: ${targetPlayer.balance}.`);
      setStatistics('discordBotAddbalComs');
    }
    saveDatabase(database);
  }

  if (commandName === 'all-balance') {
    let totalBalance = 0;
    for (const player of database) {
      if (player.balance) {
        setStatistics('discordBotSumbalComs');
        totalBalance += player.balance;
      }
    }

    interaction.reply(`Задолженность: ${totalBalance}`);

  }
});


mainBot.on('interactionCreate', async (interaction) => {
  const { commandName, options } = interaction;
  const database = getDatabase();
  const lang = getDiscordLanguagePack(interaction.guildId);

  if (commandName === 'change-lang') {
    const newLang = options.getString('lang');
    saveNewGuildLanguage(newLang.toLowerCase(), interaction.guildId);
    return interaction.reply(`Well well well... Your new discord language is: ${newLang}`);
  }

  if (commandName === 'perms-check') {
    let whatGuild = database.spares.find(guildObj => guildObj.guildId === options.getString('guild'));
    if (whatGuild) {
      const replyMessage = whatGuild.isBotAdmin
        ? `${lang.yesImMember} **${whatGuild.guildName}** 🎉`
        : `${lang.yesImMember} **${whatGuild.guildName}**${lang.butNotAdmin}`;
      return interaction.reply(replyMessage);
    }
    return interaction.reply(lang.imNotMember);
  }

  if (commandName === 'perms-set-main-alliance-role') {
    let whatGuild = database.spares.find(guildObj => guildObj.guildId === interaction.guildId);
    whatGuild.allianceMainRole = options.getString('role');
    saveDatabase(database);
    return interaction.reply(`${lang.newMainRoleIs} **<@&${whatGuild.allianceMainRole}>** 🎉`);
  }

  if (commandName === 'perms-control') {
    const whatGuild = database.spares.find(guildObj => guildObj.guildId === interaction.guildId);

    const sparedGuildsInfo = database.spares
      .filter(guildObj => guildObj.guildId !== interaction.guildId)
      .flatMap(guildObj => {
        const relatedSparredGuild = guildObj.sparedWith.find(spared => spared.allianceId === interaction.guildId);
        if (relatedSparredGuild) {
          return `  •  **${guildObj.guildName}** | ${lang.roleForThatGuild} --> <@&${relatedSparredGuild.allianceRoleThis}>`;
        }
        return [];
      });

    if (sparedGuildsInfo.length === 0) {
      return interaction.reply(`**${lang.thisGuildIsUncown}**\n${lang.roleForAllys} <@&${whatGuild.allianceMainRole}>`);
    }

    const sparedGuildsInfoString = sparedGuildsInfo.join('\n');
    return interaction.reply(`${lang.listOfSpared}\n${sparedGuildsInfoString}\n\n${lang.roleForAllys} <@&${whatGuild.allianceMainRole}>`);
  }

  if (commandName === 'perms-spare-guild') {
    const whatGuild = database.spares.find(guildObj => guildObj.guildId === interaction.guildId);
    const guildToSpare = database.spares.find(guildObj => guildObj.guildId === options.getString('guild'));

    if (!guildToSpare) {
      return interaction.reply(`${lang.thisGuildIsUndefined}`);
    }

    const sparedGuild = guildToSpare.sparedWith.find(sparedGuild => sparedGuild.allianceId === whatGuild.guildId);

    const allianceRoleThis = options.getString('role');
    if (sparedGuild) {
      Object.assign(sparedGuild, {
        allianceName: whatGuild.guildName,
        allianceRoleThis,
        allianceRoleAny: whatGuild.allianceMainRole,
      });
    } else {
      guildToSpare.sparedWith.push({
        allianceName: whatGuild.guildName,
        allianceId: whatGuild.guildId,
        allianceRoleThis,
        allianceRoleAny: whatGuild.allianceMainRole,
      });
    }
    saveDatabase(database);
    return interaction.reply(`${lang.nowYourGuildIsParedWith} **${guildToSpare.guildName}**.\n${lang.newRoleForAllys} <@&${allianceRoleThis}>`);
  }

  if (commandName === 'perms-set-member-role') {
    const whatGuild = database.spares.find(guildObj => guildObj.guildId === interaction.guildId);
    whatGuild.memberRole = options.getString('role');
    saveDatabase(database)
    return interaction.reply(`**${lang.newMainMemberRoleIs}** <@&${whatGuild.memberRole}>`);
  }
});

async function newRoleCTAMessage(userId, className, weapon, ctaName, ctaTime, ctaDate) {
  try {
    const user = await mainBot.users.fetch(userId);
    if (user) {
      const messageContent = `Dear <@${userId}>, the leader of the guild has changed your role.\n`
      + ` • CTA: **${ctaDate} / ${ctaName} / ${ctaTime}**\n`
      + ` • Your new role: ${className}, **${weapon}**\n`
      + `https://impactium.fun/static/img/albion/weapons/${className}/${weapon}.png`;
      
      await user.send(messageContent);
    }
  } catch (error) {
    console.error(`Error while sending private message: ${error}`);
  }
}

function normalizedNick(displayName) {
  return displayName
    .replace(/\((.*?)\)|\[(.*?)\]|\{(.*?)\}/g, '')
    .replace(/[_\-"'`]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '');
}

async function getUnknownUser(guildId, playerName) {
  const database = getDatabase();

  const guild = mainBot.guilds.cache.get(guildId);
  if (!guild) return

  const members = await guild.members.fetch();
  const matchedMember = members.find(member => normalizedNick(member.displayName) === playerName);
  if (!matchedMember) return 
  const memberRoles = matchedMember.roles.cache;
  if (!memberRoles) return 

  const existingUser = database.users.find(user => user.id === matchedMember.user.id);
  if (existingUser) {
    const existingGuild = existingUser.guilds.find(guild => guild.idOfGuild === guildId);
    if (existingGuild) return
  }

  const userPayload = {
    id: matchedMember.user.id,
    global_name: normalizedNick(matchedMember.displayName),
    avatar: matchedMember.user.displayAvatarURL(),
    token: generateToken(),
    guilds: []
  }

  const matchedGuild = database.guilds.find(guild => guild.id === guildId);

  const guildInfo = {
    nameOfGuild: matchedGuild.name,
    idOfGuild: matchedGuild.id,
    hash: matchedGuild.hash,
    balance: 0,
    isAdmin: memberRoles.has(matchedGuild.roles.masterRoleId),
    guildName: normalizedNick(matchedMember.displayName),
    isGuildMember: memberRoles.has(matchedGuild.roles.memberRoleId),
    isAllianceMember: memberRoles.has(matchedGuild.roles.allianceRoleId),
    isModerator: matchedGuild.roles.moderatorRoles.some(roleId => memberRoles.has(roleId)),
    isRaidLeader: memberRoles.has(matchedGuild.roles.raidLeaderRoleId),
  };

  if (existingUser) {
    existingUser.guilds.push(guildInfo);
  } else {
    userPayload.guilds.push(guildInfo);
    database.users.push(userPayload);
  }

  saveDatabase(database);
}

module.exports = {
  updateUserDisplayName,
  sendNewCTAMessage,
  applyRegear,
  newRoleCTAMessage,
  getUnknownUser,
};

(async () => {
  try {
    await rest.put(Routes.applicationCommands(secrets.clientID), { body: commands });
  } catch (error) {
    console.error(error);
  }
})();

const startMainBot = async () => {
  await mainBot.login(secrets.discordBotToken);
};

async function addGuildInfo() {
  const database = getDatabase();

  await mainBot.guilds.fetch();

  for (const guild of mainBot.guilds.cache.values()) {
    const member = await guild.members.fetch(mainBot.user);
    const isBotAdmin = member.roles.cache.some(role => role.permissions.has('Administrator'));

    let guildInfo = database.spares.find(info => info.guildId === guild.id);

    guildInfo
      ? (guildInfo.guildName = guild.name, guildInfo.isBotAdmin = isBotAdmin)
      : database.spares.push({
          guildName: guild.name,
          guildId: guild.id,
          isBotAdmin: isBotAdmin,
          memberRole: '',
          allianceMainRole: null,
          sparedWith: [],
        });
  }

  saveDatabase(database);
}

async function updateUserRoles(member, isLeaver = false) {
  const database = getDatabase();
  const sparedGuild = database.spares.find((guildInfo) => guildInfo.guildId === member.guild.id);

  if (!sparedGuild || !sparedGuild.memberRole) {
    return;
  }

  const hasMemberRole = !isLeaver && member.roles.cache.has(sparedGuild.memberRole);

  if (!hasMemberRole && !isLeaver) {
    for (const guild of database.spares) {
      const alliance = guild.sparedWith.find(spared => spared.allianceId === member.guild.id);
      
      if (alliance) {
        const allMembersInRelative = mainBot.guilds.cache.get(guild.guildId);
        await allMembersInRelative.members.fetch();
        
        const isMemberInRelative = allMembersInRelative.members.cache.get(member.user.id);
        
        if (isMemberInRelative && isMemberInRelative.roles && isMemberInRelative.roles.cache.has(guild.memberRole)) {
          const mainGuild = mainBot.guilds.cache.get(member.guild.id)
          await mainGuild.members.fetch();
          const mainGuildMember = mainGuild.members.cache.get(member.user.id);
          await mainGuildMember.roles.add(alliance.allianceRoleThis);
          if (alliance.allianceRoleAny) {
            await mainGuildMember.roles.add(alliance.allianceRoleAny);
          }
        }
      }
    }
  }


  for (const spared of sparedGuild.sparedWith) {
    const guild = mainBot.guilds.cache.get(spared.allianceId);

    if (!guild) continue;

    await guild.members.fetch();

    const memberOnAlliance = guild.members.cache.get(member.user.id);

    if (!memberOnAlliance) continue;

    if (hasMemberRole && spared.allianceRoleThis) {
      await memberOnAlliance.roles.add(spared.allianceRoleThis);
      if (spared.allianceRoleAny) {
        await memberOnAlliance.roles.add(spared.allianceRoleAny);
      }
    } else {
      await memberOnAlliance.roles.remove(spared.allianceRoleThis);
      if (spared.allianceRoleAny) {
        const hasAllianceRoleAny = memberOnAlliance.roles.cache.has(spared.allianceRoleAny);
        if (hasAllianceRoleAny && memberOnAlliance.roles.cache.size === 2) {
          await memberOnAlliance.roles.remove(spared.allianceRoleAny);
        }
      }
    }
  }
}

async function addRegearedBalance(playersList) {
  const database = getDatabase();

  for (const player of playersList) {
    const guild = database.guilds.find(guild => guild.hash === player.guildId);
  }
}

mainBot.once('ready', () => {
  log('Impactium бот запущен!', 'c');
  addGuildInfo();
});

mainBot.on('guildCreate', (guild) => {
  addGuildInfo();
});

mainBot.on('guildMemberAdd', (member) => {
  updateUserRoles(member);
});

mainBot.on('guildMemberUpdate', (oldMember, newMember) => {
  updateUserRoles(newMember);
});

mainBot.on('guildMemberRemove', (member) => {
  updateUserRoles(member, true);
});

startMainBot();