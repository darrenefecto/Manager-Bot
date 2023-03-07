const { SlashCommandBuilder } = require('discord.js');

// Map to store reminders
const reminders = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('Set a reminder for a specific time!')
    .addStringOption(option => 
        option.setName('time')
            .setDescription('Time when you want to be reminded (in minutes)')
            .setRequired(true)
    )
    .addStringOption(option => 
        option.setName('message')
            .setDescription('Message to be reminded of')
            .setRequired(true)
    ),
  async execute(interaction) {
    const time = interaction.options.getString('time');
    const message = interaction.options.getString('message');

    if (isNaN(time) || time < 1 || time > 1440) {
      return send('Please provide a valid time between 1 and 1440 minutes.', interaction);
    }

    const timeUnit = time === '1' ? 'minute' : 'minutes';
    const timeInMillis = time * 60 * 1000;

    const dmChannel = await interaction.user.createDM();
    
    // Create a new reminder object
    const reminder = {
      message: message,
      time: time,
      timeUnit: timeUnit,
      timeout: setTimeout(() => {
        dmChannel.send(`You asked me to remind you of "${message}" ${time} ${timeUnit} ago.`, interaction);
        reminders.delete(interaction.user.id);
      }, timeInMillis)
    };

    // Save the reminder to the Map
    reminders.set(interaction.user.id, reminder);

    await dmChannel.send(`I will remind you of "${message}" in ${time} ${timeUnit}.`);

    return send(`I have sent you a DM to confirm your reminder.`, interaction);
  },
};

async function send(message, interaction) {
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp(message);
  } else {
    await interaction.reply(message);
  }
}
