const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes a set of interactions!')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of interactions to delete')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
      return send("You do not have permission to use this command.", interaction);
    }

    const amount = interaction.options.getInteger('amount');

    if (isNaN(amount)) {
      return send('Please enter a valid number', interaction);
    } else if (amount <= 0 || amount > 100) {
      return send('Please enter a number between 1 and 100', interaction);
    }

    interaction.channel.bulkDelete(amount, true)
      .then(deletedMessages => {
        if (deletedMessages) {
          const oldMessages = deletedMessages.filter(msg => (Date.now() - msg.createdTimestamp) > 1209600000 && !msg.pinned);
          if (oldMessages.size > 0) {
            interaction.channel.bulkDelete(oldMessages, true)
              .catch(error => {
                console.error(error);
                send('Error occurred while deleting old messages.', interaction);
              });
          }
        }
      })
      .catch(error => {
        console.error(error);
        send('Error occurred while deleting messages.', interaction);
      });

    await send('Message deleted! :white_check_mark:', interaction)
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
