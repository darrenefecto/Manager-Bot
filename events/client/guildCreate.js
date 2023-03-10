const { REST, Routes, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const { TOKEN, applicationId } = require('../../config');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(`${__dirname}`, "..", "..",'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`../../commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(TOKEN);

module.exports = {
	name: Events.GuildCreate,
    once: true,
	async execute(client) {
        try {
            if (!client || !client.guilds) {
                console.error('Invalid client object or missing guilds property.');
                return;
            }

            // Refresh commands for each guild the bot is connected to
            const promises = [];
            for (const guild of client.guilds.cache.values()) {
                promises.push(
                    await rest.put(
                        Routes.applicationGuildCommands(applicationId, guild.id),
                        { body: commands },
                    )
                );
            }
            await Promise.allSettled(promises);

        } catch (error) {
            console.error(error);
        }
	},
};