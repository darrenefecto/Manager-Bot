const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows a list of commands!'),
	async execute(interaction) {
    try {
      const embed1 = new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle('**All General Commands:**')
        .addFields
        (
          {name: ` `, value: `**General:**`, inline: false},
          {name: `/clear`, value: `Deletes a set of messages`, inline: true},
          {name: `/kick`, value: `Kicks members`, inline: true},
          {name: `/ban`, value: `Bans members`, inline: true},
          {name: `/role`, value: `Distributes roles`, inline: true},
          {name: `/userinfo`, value: `Displays member informations`, inline: true},
          {name: `/serverinfo`, value: `Displays informations about the server`, inline: true},
          {name: `/report`, value: `Report a user to the server support`, inline: true},
          {name: ` `, value: `**Personal:**`, inline: false},
          {name: `/reminder`, value: `Set a reminder for a specific time`, inline: true},
          {name: `/clock`, value: `Get the current time in a specified country`, inline: true},
          {name: `/modify`, value: `Modify a given message`, inline: true},
          {name: `/uptime`, value: `Displays how long the bot has been online`, inline: true},
          {name: ` `, value: `**Fun:**`, inline: false},
          {name: `/meme`, value: `Displays a random meme`, inline: true},
          {name: `/animeme`, value: `Displays a random anime meme`, inline: true},
          {name: `/xp`, value: `Displays specific user\'s xp amount and level`, inline: true},
          {name: '/xp ``leaderboard``', value: `Displays the top 10 users based on their XP and Level`, inline: true},
          {name: `/coinflip`, value: `Flip a coin and see the result`, inline: true},
          {name: `/rps`, value: `Play rock, paper, scissors with this bot`, inline: true},
          {name: `/8ball`, value: `Answers randomly to a yes or no question`, inline: true},
          {name: `/love`, value: `Calculates the love compatibility between two people`, inline: true},
          {name: ` `, value: `**NSFW:**`, inline: false},
          {name: `/nsfw`, value: `Set channel to nsfw for more help...`, inline: true},
          {name: `/nsfwh`, value: `Set channel to nsfw for more help...`, inline: true},
        )
        .setFooter({text:'This Bot belongs to: darrenefecto#4662'});

        // Embed is on limit because it can't take more fields than 25


        const embed2 = new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle('**All NSFW Commands:**')

        if (interaction.channel.nsfw) {
          embed2.addFields
          (
            {name: ` `, value: `**NSFW:**`, inline: false},
            {name: '/nsfw ``boobs``', value: `Sends a random boobs`, inline: true},
            {name: '/nsfw ``cumsluts``', value: `Sends random cumsluts`, inline: true},
            {name: '/nsfw ``ass``', value: `Sends a random pic of ass`, inline: true},
            {name: '/nsfw ``cosplay``', value: `Sends a random pic of cosplay`, inline: true},
            {name: '/nsfw ``blowjob``', value: `Sends random blowjob`, inline: true},
            {name: '/nsfw ``tights``', value: `Sends random tights`, inline: true},
            {name: ` `, value: ` `, inline: false},
            {name: ` `, value: `**NSFWH:**`, inline: false},
            {name: '/nsfwh ``hentai``', value: `Sends a random hentai`, inline: true},
            {name: '/nsfwh ``boobs``', value: `Sends random hentai boobs`, inline: true},
          )
          .setFooter({text: 'This Bot belongs to: darrenefecto#4662'});
        }

      await send({ embeds: [embed1], ephemeral: true }, interaction);
      if (interaction.channel.nsfw)
        await send({ embeds: [embed2], ephemeral: true }, interaction);
    }
    catch(err)
    {
      console.log(err)
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