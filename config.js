const fs = require('node:fs');

let TOKEN;
let mongoDB;
let keepAlive;
let darrenefecto = "759377679614476331";
let applicationId = "1079374608626622514";

// Check if Replit used
if (process.env.REPLIT_DB_URL || fs.existsSync('.replit')) {
    TOKEN = process.env["TOKEN"];
    mongoDB = process.env["mongoDB"];
    keepAlive = require('./server.js') // Remove this if you dont want this
} else {
    TOKEN = 'YourBotToken';
    mongoDB = 'mongodb+srv://discordbot:<password>@rest of link in here!...'
}

module.exports = {
    TOKEN,
    mongoDB,
    applicationId,
    darrenefecto,
    keepAlive,
}