const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('modify')
    .setDescription('Modify a given message!')
    .addSubcommand(subcommand =>
        subcommand
        .setName('encrypt')
        .setDescription('Encrypt a given message')
        .addStringOption(option =>
            option
            .setName('message')
            .setDescription('The message to encrypt')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('decrypt')
        .setDescription('Decrypt a given message')
        .addStringOption(option =>
            option
            .setName('message')
            .setDescription('The message to decrypt')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('reverse')
        .setDescription('Reverse a given message')
        .addStringOption(option =>
            option
            .setName('message')
            .setDescription('The message to reverse')
            .setRequired(true)
        )
    ),
    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
            case 'encrypt': {
                const message = interaction.options.getString('message');
                const encryptedMessage = encrypt(message);
                await send(`The encrypted message is: ${encryptedMessage}`, interaction);
                break;
            }
            case 'decrypt': {
                const message = interaction.options.getString('message');
                const decryptedMessage = decrypt(message);
                await send(`The decrypted message is: ${decryptedMessage}`, interaction);
                break;
            }
            case 'reverse': {
                const message = interaction.options.getString('message');
                const reversedMessage = reverse(message);
                await send(`The reversed message is: ${reversedMessage}`, interaction);
                break;
            }
            default:
                await send('Invalid Command', interaction)
            }
        }
        catch (err) {
            await send('There was an error while processing your request.', interaction);
            console.log(err)
        }
    },
};

function encrypt(message) {
    let encryptedMessage = '';
    for (let i = 0; i < message.length; i++) {
      const charCode = message.charCodeAt(i);
      encryptedMessage += String.fromCharCode(charCode + 1);
    }
    return encryptedMessage;
  }
  
  function decrypt(message) {
    let decryptedMessage = '';
    for (let i = 0; i < message.length; i++) {
      const charCode = message.charCodeAt(i);
      decryptedMessage += String.fromCharCode(charCode - 1);
    }
    return decryptedMessage;
  }
  
  function reverse(message) {
    let reversedMessage = '';
    for (let i = message.length - 1; i >= 0; i--) {
      reversedMessage += message.charAt(i);
    }
    return reversedMessage;
  }
  





async function send(message, interaction)
{
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp(message);
    } else {
        await interaction.reply(message);
    }
}
