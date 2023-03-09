const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a user to the server support!')
    .addUserOption(option => option.setName('user').setDescription('The user you want to report').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the report').setRequired(true)),
  async execute(interaction) {
    try {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const serverSupportRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase().includes('support'));
        if (!serverSupportRole) {
            return await send(`${await interaction.guild.members.fetch(interaction.guild.ownerId)}, The server support role has not been set up yet!`, interaction);
        }
        const reportEmbed = new EmbedBuilder()
        .setTitle('User Report')
        .setColor('FF0000')
        .addFields(
            { name: 'Reported User', value: `${user.tag}`, inline: true },
            { name: 'Reported By', value: `${interaction.user.tag}`, inline: true },
            { name: 'Reason', value: `${reason}`, inline: false }
        )
        .setTimestamp();

        const reportsChannel = interaction.guild.channels.cache.find(channel => channel.name.toLowerCase().includes('reports'));
        if (!reportsChannel) {
            return await send(`${await interaction.guild.members.fetch(interaction.guild.ownerId)}, Please create a "reports" channel`, interaction)
        }

        await reportsChannel.send({ embeds: [reportEmbed], ephemeral: true }, reportEmbed);
        await send(`Report sent for ${user}!`, interaction);
    } catch (err) {
        await send('An error occurred while processing your report!', interaction);
    }
  },
};

async function send(message, interaction) {
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp(message);
  } else {
    await interaction.reply(message);
  }
}
