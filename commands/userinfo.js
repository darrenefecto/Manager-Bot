const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('userinfo')
      .setDescription('Shows member information!')
      .addUserOption(option => 
        option.setName('user')
          .setDescription('The user to show information for')
          .setRequired(false)),
    async execute(interaction) {
      const user = interaction.options.getUser('user') || interaction.user;
      const member = interaction.guild.members.cache.get(user.id);
    
      if (!user || !member) {
        return send({ content: 'User not found.', ephemeral: true }, interaction);
      }
  
      const embed = new EmbedBuilder()
        .setColor(getRandomColor())
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: `Username`, value: `${user.username}#${user.discriminator}` },
          { name: `ID`, value: user.id },
          { name: `Status`, value: user.presence?.status ?? 'Unknown' },
          { name: `Joined Server`, value: member.joinedAt?.toLocaleDateString() ?? 'Unknown' },
          { name: `Account Created`, value: user.createdAt?.toLocaleDateString() ?? 'Unknown' },
          { name: `Roles`, value: member.roles.cache.map(role => role.toString()).join(', ') },
        );
  
      await send({ embeds: [embed] }, interaction);
    },
  };

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


async function send(message, interaction)
{
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp(message);
  } else {
    await interaction.reply(message);
  }
}