const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });



const commands = [];
client.commands = new Collection();
const commandsPath = path.join(`${__dirname}`, "..", "..",'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`../../commands/${file}`);
	commands.push(command.data.toJSON());
}

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: `No command matching ${interaction.commandName} was found.`, ephemeral: true });
            } else {
                await interaction.reply({ content: `No command matching ${interaction.commandName} was found.`, ephemeral: true });
            }
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: `Error executing ${interaction.commandName}`, ephemeral: true });
            } else {
                await interaction.reply({ content: `Error executing ${interaction.commandName}`, ephemeral: true });
            }
		}
	},
};