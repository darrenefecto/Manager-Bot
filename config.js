const fs = require('node:fs');

let TOKEN;
let keepAlive;
let darrenefecto = "759377679614476331";
let applicationId = "1079374608626622514";

// Check if Replit used
if (process.env.REPLIT_DB_URL || fs.existsSync('.replit')) {
    TOKEN = process.env["TOKEN"];
    keepAlive = require('./server.js') // Remove this if you dont want this
} else {
    TOKEN = 'YourBotToken';
}

module.exports = {
    TOKEN,
    applicationId,
    darrenefecto,
    keepAlive,
}