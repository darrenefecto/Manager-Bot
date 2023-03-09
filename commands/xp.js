const { SlashCommandBuilder } = require('discord.js');
const { addXP, removeXP, setXP, checkXP, send, leaderboard} = require('../xpFunctions')
const { darrenefecto } = require('../config')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('xp')
  .setDescription('Manage user XP')
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Add XP to a user')
      .addIntegerOption(option =>
        option.setName('amount')
          .setDescription('The amount of XP to add')
          .setRequired(true))
      .addUserOption(option =>
        option.setName('user')
          .setDescription('The user to add XP to')
          .setRequired(false)))
  .addSubcommand(subcommand =>
    subcommand
      .setName('remove')
      .setDescription('Remove XP from a user')
      .addIntegerOption(option =>
        option.setName('amount')
          .setDescription('The amount of XP to remove')
          .setRequired(true))
      .addUserOption(option =>
        option.setName('user')
          .setDescription('The user to remove XP from')
          .setRequired(false)))
  .addSubcommand(subcommand =>
    subcommand
      .setName('set')
      .setDescription('Set a user\'s XP')
      .addIntegerOption(option =>
        option.setName('amount')
          .setDescription('The amount of XP to set')
          .setRequired(true))
      .addUserOption(option =>
        option.setName('user')
          .setDescription('The user to set XP for')
          .setRequired(false)))
  .addSubcommand(subcommand =>
    subcommand
      .setName('show')
      .setDescription('Displays specific user\'s xp amount and level')
      .addUserOption(option =>
        option.setName('user')
          .setDescription('The user to show XP state for')
          .setRequired(false)))
  .addSubcommand(subcommand => 
    subcommand
      .setName('leaderboard')
      .setDescription('Displays the top 10 users based on their XP and Level')
  ),
  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'show'){
          const user = interaction.options.getUser('user') || interaction.user;
          checkXP(interaction, user.id);
      }
      else if (subcommand === 'leaderboard'){
        await leaderboard(interaction);
      }
      else if (subcommand === 'add') {
          if (interaction.user.id !== darrenefecto) {
              return send("Only Darrenefecto can use this subcommand right now...", interaction);
          }
        const amount = interaction.options.getInteger('amount');
        const user = interaction.options.getUser('user') || interaction.user;
        await send(`Added ${amount} XP to <@${user.id}>.`, interaction);
        addXP(interaction, user.id, amount);
      } else if (subcommand === 'remove') {
          if (interaction.user.id !== darrenefecto) {
              return send("Only Darrenefecto can use this subcommand right now...", interaction);
          }
        const amount = interaction.options.getInteger('amount');
        const user = interaction.options.getUser('user') || interaction.user;
        await send(`Set <@${user.id}>'s XP to ${amount}.`, interaction);
        removeXP(interaction, user.id, amount);
      } else if (subcommand === 'set') {
          if (interaction.user.id !== darrenefecto) {
              return send("Only Darrenefecto can use this subcommand right now...", interaction);
          }
        const amount = interaction.options.getInteger('amount');
        const user = interaction.options.getUser('user') || interaction.user;
        await send(`Set <@${user.id}>'s XP to ${amount}.`, interaction);
        setXP(interaction, user.id, amount);
      }
    }
    catch (err) {
      await send('There was an error while processing your request.', interaction);
    }
  },
};
