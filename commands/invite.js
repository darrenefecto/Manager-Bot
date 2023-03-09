const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Generate an invite link for the bot!'),
  async execute(interaction) {
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`;

    await send({
      content: `Click the link below to invite the bot to your server:\n${inviteLink}`,
      ephemeral: true
    }, interaction);
  },
};

async function send(message, interaction)
{
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp(message);
  } else {
    await interaction.reply(message);
  }
}
