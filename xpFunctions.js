const fs = require('fs');
const path = require('path');
const levelsPath = path.join(__dirname, 'data', 'levels.json');


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
  if (!xp[user]) xp[user] = { level: 0, xp: 0 };
  xp[user].xp += amount;
  let userLevel = xp[user].level;
  let userXP = xp[user].xp;
  let levelXP = userLevel * levelMultiplier;
  if (userXP >= levelXP) {
    xp[user].level++;
    userLevel++;
    userXP -= levelXP;
    levelMultiplier *= 2;
    await send(levelUpMessage.replace("{level}", userLevel).replace("{user}", `<@${user}>`), message);
    addXP(message, user, 0);
  }
  saveXP();
}

async function removeXP(message, user, amount) {
  if (!xp[user]) xp[user] = { level: 0, xp: 0 };
  let userXP = xp[user].xp;
  if (userXP - amount < 0) xp[user].xp = 0;
  else xp[user].xp -= amount;
  await send(`Removed ${amount} XP from <@${user}>.`, message);
  saveXP();
}

async function setXP(message, user, amount) {
  if (!xp[user]) xp[user] = { level: 0, xp: 0 };
  xp[user].xp = amount;
  let userLevel = xp[user].level;
  let userXP = xp[user].xp;
  let levelXP = userLevel * levelMultiplier;
  if (userXP >= levelXP) {
    xp[user].level++;
    userLevel++;
    userXP -= levelXP;
    await send(levelUpMessage.replace("{level}", userLevel).replace("{user}", `<@${user}>`), message);
    addXP(message, user, 0);
  }
  saveXP();
}

async function checkXP(message, user) {
  if (!xp[user]) xp[user] = { level: 0, xp: 0 };
  let userXP = xp[user].xp;
  let userLevel = xp[user].level;
  await send(`<@${user}> is currently Level ${userLevel} with ${userXP} XP.`, message);
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
  send,
};
