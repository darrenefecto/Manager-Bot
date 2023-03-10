const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('animeme')
    .setDescription('Displays a random anime meme!'),
  async execute(interaction) {
    try {
      const subreddit = 'animemes';
      const response = await axios.get(`https://www.reddit.com/r/${subreddit}/random/.json`);
      const json = response.data;
      const image = json[0].data.children[0].data.url;
      const title = json[0].data.children[0].data.title;

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setImage(image)
        .setFooter({text: `r/${subreddit}`});

      await send({ embeds: [embed] }, interaction);
    } catch (error) {
      console.error(error);
      await send('I was unable to fetch a meme. Please try again later.', interaction);
    }
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
