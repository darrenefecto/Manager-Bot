const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { darrenefecto } = require('../config')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('credits')
		.setDescription('Shows owner of this bot!'),
	async execute(interaction) {
    try {
      const user = await interaction.client.users.fetch(darrenefecto);
      const embed = new EmbedBuilder()
      .setColor(getRandomColor())
      .setTitle(`**Darrenefecto:**`)
      .setURL("https://darrenefecto.github.io/")
      .setDescription(`This bot was created and belongs to <@${darrenefecto}>.\nCheck out his socials!`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setFooter({text:'This Bot belongs to: darrenefecto#4662'});


      await send({ embeds: [embed], ephemeral: true }, interaction);
    }
    catch(err)
    {
      await send('There was an error while processing your request.', interaction);
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