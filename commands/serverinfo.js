const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about the server!'),
    async execute(interaction) {
        try {
            const guild = interaction.guild;
            const owner = await guild.members.fetch(guild.ownerId);
            const channels = guild.channels.cache;
            const textChannels = channels.filter(channel => channel.type === 0).size;
            const voiceChannels = channels.filter(channel => channel.type === 2).size;
            const memberCount = guild.memberCount;

            const embed = new EmbedBuilder()
            .setColor(getRandomColor())
            .setTitle(`Server Information of ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 }))
            .setFields(
                {name: `Owner`, value: `${owner.user.tag}`, inline: true},
                {name: `Region`, value: `${guild.region ? guild.region.toUpperCase() : 'No specific Region'}`, inline: true},
                {name: `Created At`, value: `${guild.createdAt.toLocaleDateString()}`, inline: true},
                {name: 'Member Count', value: `Members: **${memberCount}**`, inline: true },
                {name: `Channels`, value: `Text: **${textChannels}**\nVoice: **${voiceChannels}**`, inline: true},
                {name: `Roles`, value: `There are **${guild.roles.cache.size}** roles`, inline: true},
            )
        
            await send({ embeds: [embed], ephemeral: true }, interaction);
        } catch (error) {
            console.error(error);
            await send('There was an error while executing this command!', interaction);
        }
    },
};

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