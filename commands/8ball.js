const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Answers randomly to a yes or no question!')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question you want to ask the magic 8-ball')
                .setRequired(true)),
    async execute(interaction) {
        const responses = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes - definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy, try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'Outlook not so good.',
            'My sources say no.',
            'Very doubtful.'
        ];

        const question = interaction.options.getString('question');

        const randomIndex = Math.floor(Math.random() * responses.length);
        const response = responses[randomIndex];

        const embed = new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle(`**"${question}"**`)
        .setDescription(`${response}`)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()

        await send({ embeds: [embed] }, interaction);
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