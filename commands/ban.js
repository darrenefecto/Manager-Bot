const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Bans members!')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to ban')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('reason')
      .setDescription('The reason for the ban')
      .setRequired(false)
  ),
  async execute(interaction) {
    if (!interaction.member.permissions.has("BAN_MEMBERS")) {
      return send("You don't have permission to use this command", interaction);
    }

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return send("Please mention a valid member of this server", interaction);
    }

    if (!member.bannable) {
      return send("I can't kick this user!", interaction);
    }

    const reason = interaction.options.getString('reason') || "No reason provided";

    member.ban({reason})
      .then(() => send(`<@${member.user.id}> has been banned by <@${interaction.user.id}> for "${reason}"`, interaction))
      .catch(error => {
        console.error(error);
        send("Error occurred while kicking member", interaction);
      });
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