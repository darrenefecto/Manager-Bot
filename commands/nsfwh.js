const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nsfwh')
    .setDescription('Hanime nsfw commands!')
    .addStringOption(option => 
      option.setName('category')
        .setDescription('Choose a category.')
        .addChoices(
          { name: 'Hentai', value: 'hentai' },
          { name: 'Boobs', value: 'boobs' },
        )
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.channel.nsfw) {
      return send('This command can only be used in a NSFW channel.', interaction);
    }

    const option = interaction.options.getString('category');

    if (option === 'hentai') {
      axios.get('https://www.reddit.com/r/hentai/hot.json')
        .then(response => {
            const posts = response.data.data.children;
            const imagePosts = posts.filter(post => /\.(jpg|jpeg|png|gif|gifv)$/i.test(post.data.url));
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
            const imageUrl = randomPost.data.url.replace(/\.gifv/g, '.gif');
    
            send({ files: [imageUrl] }, interaction);
        })
        .catch(error => {
            console.log(error);
            send('There was an error getting the image :(', interaction);
        });
    }
    else if (option === 'boobs') {
      axios.get('https://www.reddit.com/r/AnimeBust/hot.json')
        .then(response => {
            const posts = response.data.data.children;
            const imagePosts = posts.filter(post => /\.(jpg|jpeg|png|gif|gifv)$/i.test(post.data.url));
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
            const imageUrl = randomPost.data.url.replace(/\.gifv/g, '.gif');
    
            send({ files: [imageUrl] }, interaction);
        })
        .catch(error => {
            console.log(error);
            send('There was an error getting the image :(', interaction);
        });
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
