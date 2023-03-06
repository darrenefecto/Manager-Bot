const { Events } = require('discord.js');
const { addXP } = require('../xpFunctions');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        if (message.author.bot || message.type == "DM") return;
        await addXP(message, message.author.id, 1);
	},
};