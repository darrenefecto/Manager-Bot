const { SlashCommandBuilder } = require('discord.js');

const MAX_REPEATS = 3;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flip a coin and see the result!'),
	async execute(interaction) {
        try {
            const random = Math.floor(Math.random() * 2);

            const result = random === 0 ? 'Heads' : 'Tails';

            if (checkRepeats(result)) {
                const oppositeResult = random === 1 ? 'Heads' : 'Tails';
                await send(`The coin landed on **${oppositeResult}**!`, interaction);

            } else {
                await send(`The coin landed on **${result}**!`, interaction);
            }
        }
        catch(err)
        {
            await send('There was an error while processing your request.', interaction);
        }
	},
};


// Keep track of the number of times each result has occurred in a row
let consecutiveHeads = 0;
let consecutiveTails = 0;

function checkRepeats(result) {
    if (result === 'Heads') {
        consecutiveHeads++;
        consecutiveTails = 0;
        return consecutiveHeads >= MAX_REPEATS;
    } else {
        consecutiveTails++;
        consecutiveHeads = 0;
        return consecutiveTails >= MAX_REPEATS;
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