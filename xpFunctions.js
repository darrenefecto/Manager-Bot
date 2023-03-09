const fs = require('fs');
const path = require('path');
const levelsPath = path.join(__dirname, 'data', 'levels.json');
const { EmbedBuilder } = require('discord.js')

let xp = {};
let levelMultiplier = 10;
let levelUpMessage = "Congratulations, {user} have leveled up to level {level}!";

try {
  xp = JSON.parse(fs.readFileSync(levelsPath));
} catch (err) {
  console.error("Failed to load xp state:", err);
}

function saveXP() {
  fs.writeFile(levelsPath, JSON.stringify(xp), err => {
    if (err) {
      console.error("Failed to save xp state:", err);
    }
  });
}

async function addXP(message, user, amount) {
  const guildId = message.guild.id;
  if (!xp[guildId]) xp[guildId] = {};
  if (!xp[guildId][user]) xp[guildId][user] = { level: 0, xp: 0 };
  xp[guildId][user].xp += amount;
  let userLevel = xp[guildId][user].level;
  let userXP = xp[guildId][user].xp;
  let levelXP = userLevel * levelMultiplier;
  if (userXP >= levelXP) {
    xp[guildId][user].level++;
    userLevel++;
    userXP -= levelXP;
    levelMultiplier *= 2;
    await send(levelUpMessage.replace("{level}", userLevel).replace("{user}", `<@${user}>`), message);
    addXP(message, user, 0);
  }
  saveXP();
}

async function removeXP(message, user, amount) {
  const guildId = message.guild.id;
  if (!xp[guildId]) xp[guildId] = {};
  if (!xp[guildId][user]) xp[guildId][user] = { level: 0, xp: 0 };
  let userXP = xp[guildId][user].xp;
  if (userXP - amount < 0) xp[guildId][user].xp = 0;
  else xp[guildId][user].xp -= amount;
  await send(`Removed ${amount} XP from <@${user}>.`, message);
  saveXP();
}

async function setXP(message, user, amount) {
  const guildId = message.guild.id;
  if (!xp[guildId]) xp[guildId] = {};
  if (!xp[guildId][user]) xp[guildId][user] = { level: 0, xp: 0 };
  xp[guildId][user].xp = amount;
  let userLevel = xp[guildId][user].level;
  let userXP = xp[guildId][user].xp;
  let levelXP = userLevel * levelMultiplier;
  if (userXP >= levelXP) {
    xp[guildId][user].level++;
    userLevel++;
    userXP -= levelXP;
    await send(levelUpMessage.replace("{level}", userLevel).replace("{user}", `<@${user}>`), message);
    addXP(message, user, 0);
  }
  saveXP();
}


async function checkXP(message, user) {
  const guildId = message.guild.id;
  if (!xp[guildId]) xp[guildId] = {};
  if (!xp[guildId][user]) xp[guildId][user] = { level: 0, xp: 0 };
  xp[guildId][user].xp = amount;
  let userLevel = xp[guildId][user].level;
  let userXP = xp[guildId][user].xp;
  await send(`<@${user}> is currently Level ${userLevel} with ${userXP} XP.`, message);
}

async function leaderboard(message) {
  let guildId = message.guild.id;
  let users = Object.keys(xp[guildId] || {});
  let leaderboard = [];

  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    let level = xp[guildId][user].level;
    let xpValue = xp[guildId][user].xp;
    let score = level * levelMultiplier + xpValue;
    leaderboard.push({ user: user, level: level, xp: xpValue, score: score });
  }

  leaderboard.sort((a, b) => b.score - a.score);

  let maxUsers = Math.min(10, leaderboard.length);

  const embed = new EmbedBuilder()
    .setColor(getRandomColor())
    .setTitle('**Top 10 Users**')
    .setDescription('Here are the top 10 users based on their level and XP on this Server')
    .addFields({ name: ' ', value: ' ', inline: false })
    .setTimestamp();

  for (let i = 0; i < maxUsers; i++) {
    let user = leaderboard[i].user;
    let level = leaderboard[i].level;
    let xpValue = leaderboard[i].xp;
    let fetchedUser = await message.client.users.fetch(user);
    let tag = fetchedUser.tag;
    
    embed.addFields(
      { name: `**${i + 1}. ${tag}**`, value: `Level: ${level}\nXP: ${xpValue}`, inline: false }
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
