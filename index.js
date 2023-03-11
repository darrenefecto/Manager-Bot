const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { TOKEN, mongoDB, keepAlive } = require('./config');
const { connect, connection } = require('mongoose')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();


// Client Events
const eventsPath = path.join(__dirname, 'events/client');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


// Mongomoose Events
const mongoPath = path.join(__dirname, 'events/mongo');
const mongoFiles = fs.readdirSync(mongoPath).filter(file => file.endsWith('.js'));

for (const file of mongoFiles) {
	const filePath = path.join(mongoPath, file);
	const event = require(filePath);
	if (event.once) {
		connection.once(event.name, (...args) => event.execute(...args, client));
	} else {
		connection.on(event.name, (...args) => event.execute(...args, client));
	}
}



client.login(TOKEN)

if (typeof keepAlive !== 'undefined') {
    keepAlive();
    console.log("Is keeping alive!")
} 
else {
    console.log("Isn't keeping alive...");
}

(async () => {
	await connect(mongoDB).catch(console.error);
})();
