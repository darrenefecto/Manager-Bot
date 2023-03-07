const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment-timezone');

const flagUrls = {
  'America/New_York': 'https://flagcdn.com/80x60/us.png',
  'America/Toronto': 'https://flagcdn.com/80x60/ca.png',
  'America/Mexico_City': 'https://flagcdn.com/80x60/mx.png',
  'America/Sao_Paulo': 'https://flagcdn.com/80x60/br.png',
  'Europe/London': 'https://flagcdn.com/80x60/gb.png',
  'Europe/Berlin': 'https://flagcdn.com/80x60/de.png',
  'Europe/Paris': 'https://flagcdn.com/80x60/fr.png',
  'Europe/Rome': 'https://flagcdn.com/80x60/it.png',
  'Europe/Madrid': 'https://flagcdn.com/80x60/es.png',
  'Europe/Moscow': 'https://flagcdn.com/80x60/ru.png',
  'Asia/Shanghai': 'https://flagcdn.com/80x60/cn.png',
  'Asia/Tokyo': 'https://flagcdn.com/80x60/jp.png',
  'Asia/Seoul': 'https://flagcdn.com/80x60/kr.png',
  'Australia/Sydney': 'https://flagcdn.com/80x60/au.png',
  'Pacific/Auckland': 'https://flagcdn.com/80x60/nz.png',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clock')
    .setDescription('Get the current time in a specified country!')
    .addStringOption(option =>
      option.setName('timezone')
      .setDescription('Enter a timezone to get the current time in')
      .setRequired(true)
      .addChoices(
        { name: 'United States', value: 'America/New_York' },
        { name: 'Canada', value: 'America/Toronto' },
        { name: 'Mexico', value: 'America/Mexico_City' },
        { name: 'Brazil', value: 'America/Sao_Paulo' },
        { name: 'United Kingdom', value: 'Europe/London' },
        { name: 'Germany', value: 'Europe/Berlin' },
        { name: 'France', value: 'Europe/Paris' },
        { name: 'Italy', value: 'Europe/Rome' },
        { name: 'Spain', value: 'Europe/Madrid' },
        { name: 'Russia', value: 'Europe/Moscow' },
        { name: 'China', value: 'Asia/Shanghai' },
        { name: 'Japan', value: 'Asia/Tokyo' },
        { name: 'South Korea', value: 'Asia/Seoul' },
        { name: 'Australia', value: 'Australia/Sydney' },
        { name: 'New Zealand', value: 'Pacific/Auckland' },
      )
    ),
  async execute(interaction) {
    try {
      const timezone = interaction.options.getString('timezone');
      const currentTime = moment().tz(timezone).format('hh:mm A, dddd, MMMM Do, YYYY');
      
      const flag = flagUrls[timezone];

      const embed = new EmbedBuilder()
      .setColor(getRandomColor())
      .setTitle(`**Current time in: ${timezone}**`)
      .setDescription(`The current time in ${timezone} is ${currentTime}.`)
      .setThumbnail(flag)
      .setTimestamp()

      await send({ embeds: [embed], ephemeral: true }, interaction);
    } catch (error) {
      await send('There was an error while processing your request.', interaction);
    }

  },
};

function getRandomColor() {
  return Math.floor(Math.random() * 16777215);
}

async function send(message, interaction) {
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp(message);
  } else {
    await interaction.reply(message);
  }
}