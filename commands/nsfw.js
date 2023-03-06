const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nsfw')
    .setDescription('reality nsfw commands!')
    .addStringOption(option => 
      option.setName('category')
        .setDescription('Choose a category.')
        .addChoices(
          { name: 'Boobs', value: 'boobs' },
          { name: 'Cumsluts', value: 'cumsluts' },
          { name: 'Cosplay', value: 'cosplay' },
          { name: 'Blowjob', value: 'blowjob' },
          { name: 'Tights', value: 'tights' },
        )
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.channel.nsfw) {
      return send('This command can only be used in a NSFW channel.', interaction);
    }

    const option = interaction.options.getString('category');
    if (option === 'boobs') {
      axios.get('https://www.reddit.com/r/bigboobsgw/hot.json')
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
    else if (option === 'cumsluts') {
      axios.get('https://www.reddit.com/r/cumsluts/hot.json')
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
    else if (option === 'cosplay') {
      axios.get('https://www.reddit.com/r/cosplaygirls/hot.json')
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
    else if (option === 'ass') {
      axios.get('https://www.reddit.com/r/ass/hot.json')
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
    else if (option === 'blowjob') {
      axios.get('https://www.reddit.com/r/blowjob/hot.json')
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
    else if (option === 'tights') {
      axios.get('https://www.reddit.com/r/tights/hot.json')
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