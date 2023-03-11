const { EmbedBuilder } = require('discord.js')

const mongoose = require('mongoose');
const xpModel = require("./schemas/xps");

let levelMultiplier = 10;
let levelUpMessage = "Congratulations, {user} have leveled up to level {level}!";


async function addXP(message, user, amount) {
  let xp = await xpModel.findOne({ guildId: message.guild.id, userId: user });
  if (!xp) {
    xp = await new xpModel({
      _id: new mongoose.Types.ObjectId(),
      guildId: message.guild.id,
      guildName: message.guild.name,
      guildIcon: message.guild.iconURL() ? message.guild.iconURL() : "None.",
      userId: user,
      xp: 0,
      level: 0,
    });
  }
  xp.xp += amount;
  let userLevel = xp.level;
  let userXP = xp.xp;
  let levelXP = userLevel * levelMultiplier;
  if (userXP >= levelXP) {
    xp.level++;
    userLevel++;
    userXP -= levelXP;
    levelMultiplier *= 2;
    send(levelUpMessage.replace("{level}", userLevel).replace("{user}", `<@${user}>`), message);
    addXP(message, user, 0);
  }
  await xp.save().catch(console.error);
}


async function removeXP(message, user, amount) {
  let xp = await xpModel.findOne({ guildId: message.guild.id, userId: user });
  if (!xp) {
    xp = await new xpModel({
      _id: new mongoose.Types.ObjectId(),
      guildId: message.guild.id,
      guildName: message.guild.name,
      guildIcon: message.guild.iconURL() ? message.guild.iconURL() : "None.",
      userId: user,
      xp: 0,
      level: 0,
    });
  }

  xp.xp = Math.max(0, xp.xp - amount);
  send(`Removed ${amount} XP from <@${user}>.`, message);
  await xp.save().catch(console.error);
}

async function setXP(message, user, amount) {
  let xp = await xpModel.findOne({ guildId: message.guild.id, userId: user });
  if (!xp) {
    xp = await new xpModel({
      _id: new mongoose.Types.ObjectId(),
      guildId: message.guild.id,
      guildName: message.guild.name,
      guildIcon: message.guild.iconURL() ? message.guild.iconURL() : "None.",
      userId: user,
      xp: 0,
      level: 0,
    });
  } else {
    xp.xp = amount;
  }
  let userLevel = xp.level;
  let userXP = xp.xp;
  let levelXP = userLevel * levelMultiplier;
  if (userXP >= levelXP) {
    xp.level++;
    userLevel++;
    userXP -= levelXP;
    send(levelUpMessage.replace("{level}", userLevel).replace("{user}", `<@${user}>`), message);
    addXP(message, user, 0);
  }
  await xp.save().catch(console.error);
}

async function checkXP(message, user) {
  let xp = await xpModel.findOne({ guildId: message.guild.id, userId: user });
  if (!xp) {
    xp = await new xpModel({
      _id: new mongoose.Types.ObjectId(),
      guildId: message.guild.id,
      guildName: message.guild.name,
      guildIcon: message.guild.iconURL() ? message.guild.iconURL() : "None.",
      userId: user,
      xp: 0,
      level: 0,
    });
  }

  let userLevel = xp.level;
  let userXP = xp.xp;
  await send(`<@${user}> is currently Level ${userLevel} with ${userXP} XP.`, message);
}

async function leaderboard(message) {
  const guildId = message.guild.id;
  const users = await xpModel.find({ guildId: guildId }).sort({ score: 'desc' }).limit(10);

  const embed = new EmbedBuilder()
    .setColor(getRandomColor())
    .setTitle('**Top 10 Users**')
    .setDescription('Here are the top 10 users based on their level and XP on this Server')
    .setTimestamp();

  for (let i = 0; i < users.length; i++) {
    const { userId, level, xp } = users[i];
    const fetchedUser = await message.client.users.fetch(userId);
    const tag = fetchedUser.tag;
    embed.addFields(
      { name: `**${i + 1}. ${tag}**`, value: `Level: ${level}\nXP: ${xp}`, inline: false }
    );
  }

  await send({ embeds: [embed] }, message);
}



function getRandomColor() {
  return Math.floor(Math.random() * 16777215);
}

async function send(message, interaction)
{
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp(message);
  } else {
    await interaction.reply(message);
  }
}

module.exports = {
  addXP,
  removeXP,
  setXP,
  checkXP,
  leaderboard,
  send,
};
