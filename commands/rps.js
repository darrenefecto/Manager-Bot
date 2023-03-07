const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('rps')
      .setDescription('Play rock, paper, scissors with this bot!')
      .addStringOption((option) =>
        option.setName('move')
          .setDescription('Choose your move: rock, paper, or scissors.')
          .setRequired(true)
          .addChoices(
            { name: 'Rock', value: 'rock' },
            { name: 'Paper', value: 'paper' },
            { name: 'Scissors', value: 'scissors' },
          )
      ),
    async execute(interaction) {
        try {
            
            const choices = ['rock', 'paper', 'scissors'];
        
            const userChoice = interaction.options.getString('move').toLowerCase();
        
            const botChoice = choices[Math.floor(Math.random() * choices.length)];

            let result;
        
            if (userChoice === botChoice) {
                result = "It's a tie! ⭕";
            } else if (
                (userChoice === 'rock' && botChoice === 'scissors') ||
                (userChoice === 'paper' && botChoice === 'rock') ||
                (userChoice === 'scissors' && botChoice === 'paper')
            ) {
                result = 'You win! ✅';
            } else {
                result = 'You lose! ❌';
            }
    
            const embed = new EmbedBuilder()
            .setColor(getRandomColor())
            .setTitle('Rock, Paper, Scissors')
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`You chose: ${userChoice} ${getEmoji(userChoice)}\nBot chose: ${botChoice} ${getEmoji(botChoice)}`)
            .addFields({ name: "Result", value: `${result}` })
            .setFooter({ text: `You played Rock, Paper, Scissors`})
            .setTimestamp()

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

function getEmoji(move) {
    switch (move) {
      case 'rock':
        return ':rock:';
      case 'paper':
        return ':page_with_curl:';
      case 'scissors':
        return ':scissors:';
      default:
        return '';
    }
  }

async function send(message, interaction)
{
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp(message);
  } else {
    await interaction.reply(message);
  }
}
