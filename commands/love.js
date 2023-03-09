const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('love')
    .setDescription('Calculates the love compatibility between two people!')
    .addUserOption(option =>
      option.setName('person1')
        .setDescription('The name of the first person.')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('person2')
        .setDescription('The name of the second person.')
        .setRequired(true)),
  async execute(interaction) {
    try {
      const person1 = interaction.options.getUser('person1');
      const person2 = interaction.options.getUser('person2');
      
      // Calculate the love compatibility between the two people
      const loveScore = Math.floor(Math.random() * 101);
      
      // Create and send the response embed
      const embed = new EmbedBuilder()
        .setColor('#ff69b4')
        .setTitle('Love Compatibility')
        .setDescription(`The love compatibility between ${person1} and ${person2} is ${loveScore}%!`)
        if (loveScore > 50)
        {
            embed.setFooter({text: 'Love is in the air... ❤️'})
        }
        else {
            embed.setFooter({text: 'Love isn\'t in the air... 💔'})
        }
        embed.setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } catch(err) {
      console.log(err);
      await interaction.reply('An error occurred while trying to calculate the love compatibility. Please try again later.');
    }
  },
};
