const Discord = require('discord.js');
const ytdl = require("ytdl-core");
const client = new Discord.Client({ intents: [] });
const TOKEN = 'TokenOfYourBot';

const prefix = "t!"; // Your Prefix

function catchErr (err, message) {
    message.channel.send("An error has occurred: ```" + err + "```");
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    let statuses = [
        `music`,
        `${prefix}help`,
        `commands`
    ]

    setInterval(function(){
        let statuse = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(statuse, {type: 'LISTENING'}).catch(console.error);
        
    }, 3000)
})


client.on("message", message => {
    if(message.author.bot || message.type=="dm")return;
    var arg = message.content.toLowerCase().split(" ");

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    try {
        // ---------------- HELP COMMAND ----------------------
        if (command === "help")
        {
            const embed = new Discord.MessageEmbed()
                .setColor(getRandomColor())
                .setTitle('**All Commands:**')
                .addField('t!clear', 'Deletes a set of messages')
                .addField('t!kick', 'Kick members')
                .addField('t!ban', 'Ban members')
                .addField('t!role' , 'Distribute roles')
                .addField('t!userinfo', 'Informations of members')
                .addField('t!play', 'Play youtube audio in voice channel')
                .addField('t!stop', 'Stop youtube audio in voice channel')
                .addField('t!skip', 'Skip youtube audio in voice channel')
                .setFooter('This Bot belongs to: darrenefecto#4662')

            message.channel.send(embed);
        }
        // ---------------- CLEAR COMMAND ----------------------
        else if (command === "clear") {
            if (!message.member.hasPermission("MANAGE_MESSAGES")) {
                return message.reply("You do not have permission to use this command.");
            }

            const amount = parseInt(arg[1]);

            if (isNaN(amount)) {
                return message.reply('Please enter a valid number');
            } else if (amount <= 0 || amount > 100) {
                return message.reply('Please enter a number between 1 and 100');
            }

            message.channel.bulkDelete(amount)
                .catch(error => {
                    console.error(error);
                    message.reply('Error occurred while deleting messages');
                });
        }
        // ---------------- KICK COMMAND ----------------------
        else if (command === "kick") {
            if (!message.member.hasPermission("KICK_MEMBERS")) {
                return message.reply("You don't have permission to use this command");
            }

            const member = message.mentions.members.first();

            if (!member) {
                return message.reply("Please mention a valid member of this server");
            }

            if (!member.kickable) {
                return message.reply("I can't kick this user!");
            }

            const reason = arg.slice(2).join(" ") || "No reason provided";

            member.kick(reason)
                .then(() => message.reply(`${member.user.tag} has been kicked by ${message.author.tag} for ${reason}`))
                .catch(error => {
                    console.error(error);
                    message.reply("Error occurred while kicking member");
                });
        }
        // ---------------- BAN COMMAND ----------------------
        else if (command === "ban") {
            if (!message.member.hasPermission("BAN_MEMBERS")) {
                return message.reply("You don't have permission to use this command");
            }

            const member = message.mentions.members.first();

            if (!member) {
                return message.reply("Please mention a valid member of this server");
            }

            if (!member.bannable) {
                return message.reply("I can't ban this user!");
            }

            const reason = arg.slice(2).join(" ") || "No reason provided";

            member.ban({ reason: reason })
                .then(() => message.reply(`${member.user.tag} has been banned by ${message.author.tag} for ${reason}`))
                .catch(error => {
                    console.error(error);
                    message.reply("Error occurred while banning member");
                });
        }
        // ---------------- ROLE COMMAND ----------------------
        else if (command === "role") {
            if (!message.member.hasPermission("MANAGE_ROLES")) {
                return message.reply("You don't have permission to use this command");
            }

            const member = message.mentions.members.first();

            if (!member) {
                return message.reply("Please mention a valid member of this server");
            }

            const role = message.mentions.roles.first();

            if (!role) {
                return message.reply("Please mention a valid role on this server");
            }

            if (member.roles.cache.has(role.id)) {
                member.roles.remove(role)
                    .then(() => message.reply(`${member.user.tag} has been removed from the ${role.name} role`))
                    .catch(error => {
                        console.error(error);
                        message.reply("Error occurred while removing role");
                    });
            } else {
                member.roles.add(role)
                    .then(() => message.reply(`${member.user.tag} has been added to the ${role.name} role`))
                    .catch(error => {
                        console.error(error);
                        message.reply("Error occurred while adding role");
                    });
            }
        }
        // ---------------- USERINFO COMMAND ----------------------
        else if (command == "userinfo") {

            const user = message.mentions.users.first() || message.author;
            const member = message.guild.members.cache.get(user.id);

            const embed = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addField("Username", `${user.username}#${user.discriminator}`)
            .addField("ID", message.member.hasPermission("ADMINISTRATOR") ? user.id : "*Restricted*")
            .addField("Status", user.presence.status)
            .addField("Joined Server", member.joinedAt.toLocaleDateString())
            .addField("Account Created", user.createdAt.toLocaleDateString())
            .addField("Roles", member.roles.cache.map(role => role.toString()).join(", "))

            message.channel.send(embed);
        }
    }  
    catch(err)
    {
        catchErr(err, message);
    } 
});


// // ---------------- MUSIC COMMAND ----------------------

const queue = new Map();

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        execute(message, args);
        return;
    } else if (command === 'skip') {
        skip(message, args);
        return;
    } 
    else if (command === 'stop') {
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is no song that I could stop!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
});

async function execute(message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.reply('I need the permissions to join and speak in your voice channel!');
    }
    const songInfo = await ytdl.getInfo(args[0].trim());
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };
    let queueContruct = queue.get(message.guild.id);
    if (!queueContruct) {
        queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(message.guild.id, queueContruct);
        queueContruct.songs.push(song);
        try {
            const connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        queueContruct.songs.push(song);
        return message.reply(`${song.title} has been added to the queue!`);
    }
}

function skip(message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('You need to be in a voice channel to skip the music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.reply('I need the permissions to join and speak in your voice channel!');
    }
    const queueContruct = queue.get(message.guild.id);
    if (!queueContruct) return message.reply('There is no song that I could skip!');
    queueContruct.connection.dispatcher.end();
}

async function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url, { filter: 'audioonly', type: 'opus', highWaterMark: 1 << 25, bitrate: 320 }))
    .on('finish', () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', error => {
      console.error(error);
      serverQueue.textChannel.send(`An error occurred while playing: **${song.title}**`);
    });

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}


client.login(TOKEN)