const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Generate an invite link for the bot!'),
  async execute(interaction) {
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`;

    await interaction.reply({
      content: `Click the link below to invite the bot to your server:\n${inviteLink}`,
      ephemeral: true
    });
  },
};
