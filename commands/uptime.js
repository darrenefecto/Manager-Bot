const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Displays how long the bot has been online!'),
  async execute(interaction) {
    const uptime = process.uptime();
    const uptimeString = formatUptime(uptime);
    await interaction.reply(`I have been online for ${uptimeString}.`);
  },
};

function formatUptime(uptime) {
  let uptimeString = '';
  const hours = Math.floor(uptime / 3600);
  if (hours > 0) {
    uptimeString += `${hours} hour${hours > 1 ? 's' : ''}, `;
  }
  const minutes = Math.floor(uptime % 3600 / 60);
  if (minutes > 0) {
    uptimeString += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
  }
  const seconds = Math.floor(uptime % 60);
  uptimeString += `${seconds} second${seconds !== 1 ? 's' : ''}`;
  return uptimeString;
}
