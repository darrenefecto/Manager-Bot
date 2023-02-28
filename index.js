const Discord = require('discord.js');
const ytdl = require("ytdl-core");
const axios = require('axios');
const fs = require('fs');

const client = new Discord.Client({ intents: [] });
const TOKEN = 'TokenOfYourBot';

let prefix = "t!"; // Your Prefix
let darrenefecto = "759377679614476331"


const PREFIX_FILE = 'prefix.json';

// Load prefix data from file
let prefixData = {};
try {
  prefixData = JSON.parse(fs.readFileSync(PREFIX_FILE));
} catch (error) {
  console.error(`Error reading prefix file: ${error}`);
}

// Set default prefix if not present in prefix file
const DEFAULT_PREFIX = 't!';
for (const guildId in client.guilds.cache) {
  if (!prefixData[guildId]) {
    prefixData[guildId] = DEFAULT_PREFIX;
  }
}



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
    prefix = prefixData[message.guild.id] || DEFAULT_PREFIX;

    var arg = message.content.toLowerCase().split(" ");

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    try {
        // ---------------- HELP COMMAND ----------------------
        if (command === "help")
        {
            const embed1 = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle('**All General Commands:**')
            .addField(` `, ' ', false)
            .addField(` `, '**General:**', false)
            .addField(`${prefix}clear`, 'Deletes a set of messages', true)
            .addField(`${prefix}kick`, 'Kicks members', true)
            .addField(`${prefix}ban`, 'Bans members', true)
            .addField(`${prefix}role` , 'Distributes roles', true)
            .addField(`${prefix}userinfo`, 'Shows member information', true)
            .addField(`${prefix}setprefix`, 'Change prefix in server', true)
            .addField(` `, ' ', false)
            .addField(` `, '**Fun:**', false)
            .addField(`${prefix}meme`, 'Displays a random meme', true)
            .addField(`${prefix}animeme`, 'Displays a random meme', true)
            .addField(`${prefix}xp`, 'Gives an interface of an user xp amount', true)
            .addField(`${prefix}addxp`, 'Adds xp to an user', true)
            .addField(`${prefix}removexp`, 'Removes xp from an user', true)
            .addField(`${prefix}setxp`, 'Sets the amount of xp of an user', true)
            .addField(` `, ' ', false)
            .addField(` `, '**Music:**', false)
            .addField(`${prefix}play`, 'Plays YouTube audio in a voice channel', true)
            .addField(`${prefix}stop`, 'Stops YouTube audio in a voice channel', true)
            .addField(`${prefix}skip`, 'Skips YouTube audio in a voice channel', true)
            .addField(` `, ' ', false)
            .addField(` `, '**NSFW:**', false)
            .addField(`${prefix}nsfw`, 'Sets channel to nsfw mode', false)

            const embed2 = new Discord.MessageEmbed()
            .setColor(getRandomColor())
            .setTitle('**All NSFW Commands:**')

            if (message.channel.nsfw) {
                embed2.addField(` `, ' ', false)
                .addField(` `, '**3D:**', false)
                .addField(`${prefix}boobs`, 'Sends a random boobs', true)
                .addField(`${prefix}cumsluts`, 'Sends random cumsluts', true)
                .addField(`${prefix}ass`, 'Sends a random pic of ass', true)
                .addField(`${prefix}cosplay`, 'Sends a random pic of cosplay', true)
                .addField(`${prefix}blowjob`, 'Sends random blowjob', true)
                .addField(`${prefix}tights`, 'Sends random tights', true)
                .addField(` `, ' ', false)
                .addField(` `, '**2D:**', false)
                .addField(`${prefix}hentai`, 'Sends a random hentai', true)
                .addField(`${prefix}hboobs`, 'Sends random hentai boobs', true);
            }

            embed1.setFooter('This Bot belongs to: darrenefecto#4662');
            embed2.setFooter('This Bot belongs to: darrenefecto#4662');

            message.channel.send(embed1);
            if (message.channel.nsfw) {
                message.channel.send(embed2);
            }

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
        
            message.channel.bulkDelete(amount, true)
                .then(messages => {
                    const oldMessages = messages.filter(msg => (Date.now() - msg.createdTimestamp) > 1209600000 && !msg.pinned);
                    if (oldMessages.size > 0) {
                        message.channel.bulkDelete(oldMessages, true)
                            .catch(error => {
                                console.error(error);
                                message.reply('Error occurred while deleting old messages.');
                            });
                    }
                })
                .catch(error => {
                    console.error(error);
                    message.reply('Error occurred while deleting messages.');
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
            .addField("ID", user.id)
            .addField("Status", user.presence.status)
            .addField("Joined Server", member.joinedAt.toLocaleDateString())
            .addField("Account Created", user.createdAt.toLocaleDateString())
            .addField("Roles", member.roles.cache.map(role => role.toString()).join(", "))

            message.channel.send(embed);
        }
        // ---------------- SET PREFIX COMMAND ----------------------
        else if (command === 'setprefix') {
            
            if (!message.member.hasPermission('ADMINISTRATOR')) {
              return message.reply('You do not have permission to change the prefix.');
            }
        
            prefixData[message.guild.id] = args[0];
        
            fs.writeFile(PREFIX_FILE, JSON.stringify(prefixData), error => {
              if (error) {
                console.error(`Error writing prefix file: ${error}`);
              }
            });
        
            message.reply(`Prefix changed to ${args[0]}.`);
        }
    }  
    catch(err)
    {
        catchErr(err, message);
    } 
});


// ---------------- MUSIC COMMAND ----------------------

const queue = new Map();

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    prefix = prefixData[message.guild.id] || DEFAULT_PREFIX;

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

// ---------------- MEME COMMAND ----------------------

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    prefix = prefixData[message.guild.id] || DEFAULT_PREFIX;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    
    if (command === 'meme') {
      try {
        const subreddit = message.channel.nsfw ? 'dankmemes' : 'memes';
        const response = await axios.get(`https://www.reddit.com/r/${subreddit}/random/.json`);
        const json = response.data;
        const image = json[0].data.children[0].data.url;
        const title = json[0].data.children[0].data.title;
        
        const embed = new Discord.MessageEmbed()
          .setTitle(title)
          .setImage(image)
          .setFooter(`r/${subreddit}`);
        
        message.channel.send(embed);
      } catch (error) {
        console.error(error);
        message.reply('I was unable to fetch a meme. Please try again later.');
      }
    }

    if (command === 'animeme') {
        try {
          const subreddit = 'animemes';
          const response = await axios.get(`https://www.reddit.com/r/${subreddit}/random/.json`);
          const json = response.data;
          const image = json[0].data.children[0].data.url;
          const title = json[0].data.children[0].data.title;
          
          const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setImage(image)
            .setFooter(`r/${subreddit}`);
          
          message.channel.send(embed);
        } catch (error) {
          console.error(error);
          message.reply('I was unable to fetch a meme. Please try again later.');
        }
      }
});

// ---------------- NSFW COMMAND ----------------------

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    prefix = prefixData[message.guild.id] || DEFAULT_PREFIX;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'nsfw') {
    // Check if user has permission to manage channels
    if (!message.member.hasPermission('MANAGE_CHANNELS')) {
        return message.reply('You do not have permission to manage channels.');
    }
    
    // Get the channel to make NSFW
    const channel = message.mentions.channels.first() || message.channel;

    // Make the channel NSFW
    channel.setNSFW(true, 'This channel is now NSFW')
        .then(updatedChannel => {
        message.channel.send(`The channel ${updatedChannel.name} is now NSFW.`);
        })
        .catch(err => {
        console.log(err);
        message.channel.send(`There was an error making the channel NSFW: ${err}`);
        });
    }

    // Category Boobs
    if (command === 'boobs') {
        if (!message.channel.nsfw) {
            return message.reply('This command can only be used in a NSFW channel.');
        }

        axios.get('https://www.reddit.com/r/bigboobsgw/hot.json')
        .then(response => {
            const posts = response.data.data.children;
            const imagePosts = posts.filter(post => /\.(jpg|jpeg|png|gif|gifv)$/i.test(post.data.url));
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
            const imageUrl = randomPost.data.url.replace(/\.gifv/g, '.gif');
    
            message.channel.send({ files: [imageUrl] });
        })
        .catch(error => {
            console.log(error);
            message.channel.send('There was an error getting the image :(');
        });
    }

    // Category Cumsluts
    if (command === 'cumsluts') {
        if (!message.channel.nsfw) {
            return message.reply('This command can only be used in a NSFW channel.');
        }

        axios.get('https://www.reddit.com/r/cumsluts/hot.json')
        .then(response => {
            const posts = response.data.data.children;
            const imagePosts = posts.filter(post => /\.(jpg|jpeg|png|gif|gifv)$/i.test(post.data.url));
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
            const imageUrl = randomPost.data.url.replace(/\.gifv/g, '.gif');
    
            message.channel.send({ files: [imageUrl] });
        })
        .catch(error => {
            console.log(error);
            message.channel.send('There was an error getting the image :(');
        });
    }

    // Category Cosplay
    if (command === 'cosplay') {
        if (!message.channel.nsfw) {
            return message.reply('This command can only be used in a NSFW channel.');
        }

        axios.get('https://www.reddit.com/r/cosplaygirls/hot.json')
        .then(response => {
            const posts = response.data.data.children;
            const imagePosts = posts.filter(post => /\.(jpg|jpeg|png|gif|gifv)$/i.test(post.data.url));
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
            const imageUrl = randomPost.data.url.replace(/\.gifv/g, '.gif');
    
            message.channel.send({ files: [imageUrl] });
        })
        .catch(error => {
            console.log(error);
            message.channel.send('There was an error getting the image :(');
        });
    }

    // Category Ass
    if (command === 'ass') {
        if (!message.channel.nsfw) {
            return message.reply('This command can only be used in a NSFW channel.');
        }

        axios.get('https://www.reddit.com/r/ass/hot.json')
        .then(response => {
            const posts = response.data.data.children;
            const imagePosts = posts.filter(post => /\.(jpg|jpeg|png|gif|gifv)$/i.test(post.data.url));
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
            const imageUrl = randomPost.data.url.replace(/\.gifv/g, '.gif');
    
            message.channel.send({ files: [imageUrl] });
        })
        .catch(error => {
            console.log(error);
            message.channel.send('There was an error getting the image :(');
        });
    }

    // Category Blowjob
    if (command === 'blowjob') {
        if (!message.channel.nsfw) {
            return message.reply('This command can only be used in a NSFW channel.');
        }

        axios.get('https://www.reddit.com/r/blowjob/hot.json')
        .then(response => {
            const posts = response.data.data.children;
            const imagePosts = posts.filter(post => /\.(jpg|jpeg|png|gif|gifv)$/i.test(post.data.url));
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
            const imageUrl = randomPost.data.url.replace(/\.gifv/g, '.gif');
    
            message.channel.send({ files: [imageUrl] });
        })
        .catch(error => {
            console.log(error);
            message.channel.send('There was an error getting the image :(');
        });
    }

    // Category Thigths
    if (command === 'tights') {
        if (!message.channel.nsfw) {
            return message.reply('This command can only be used in a NSFW channel.');
        }

        axios.get('https://www.reddit.com/r/tights/hot.json')
        .then(response => {
            const posts = response.data.data.children;
            const imagePosts = posts.filter(post => /\.(jpg|jpeg|png|gif|gifv)$/i.test(post.data.url));
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
            const imageUrl = randomPost.data.url.replace(/\.gifv/g, '.gif');
    
            message.channel.send({ files: [imageUrl] });
        })
        .catch(error => {
            console.log(error);
            message.channel.send('There was an error getting the image :(');
        });
    }

    // Category Hanime
    if (command === 'hentai') {
        if (!message.channel.nsfw) {
            return message.reply('This command can only be used in a NSFW channel.');
        }
        axios.get('https://www.reddit.com/r/hentai/hot.json')
        .then(response => {
            const posts = response.data.data.children;
            const imagePosts = posts.filter(post => /\.(jpg|jpeg|png|gif|gifv)$/i.test(post.data.url));
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
            const imageUrl = randomPost.data.url.replace(/\.gifv/g, '.gif');
    
            message.channel.send({ files: [imageUrl] });
        })
        .catch(error => {
            console.log(error);
            message.channel.send('There was an error getting the image :(');
        });
    }

    // Category hboobs
    if (command === 'hboobs') {
        if (!message.channel.nsfw) {
            return message.reply('This command can only be used in a NSFW channel.');
        }
        axios.get('https://www.reddit.com/r/AnimeBust/hot.json')
        .then(response => {
            const posts = response.data.data.children;
            const imagePosts = posts.filter(post => /\.(jpg|jpeg|png|gif|gifv)$/i.test(post.data.url));
            const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
            const imageUrl = randomPost.data.url.replace(/\.gifv/g, '.gif');
    
            message.channel.send({ files: [imageUrl] });
        })
        .catch(error => {
            console.log(error);
            message.channel.send('There was an error getting the image :(');
        });
    }

});

// ---------------- LEVEL SYSTEM ----------------------

let xp = {};
let levelMultiplier = 10;
let levelUpMessage = "Congratulations, {user} have leveled up to level {level}!";

try {
  xp = JSON.parse(fs.readFileSync("levels.json"));
} catch (err) {
  console.error("Failed to load xp state:", err);
}

function saveXP() {
  fs.writeFile("levels.json", JSON.stringify(xp), err => {
    if (err) {
      console.error("Failed to save xp state:", err);
    }
  });
}

function addXP(message, user, amount) {
  if (!xp[user]) xp[user] = { level: 0, xp: 0 };
  xp[user].xp += amount;
  let userLevel = xp[user].level;
  let userXP = xp[user].xp;
  let levelXP = userLevel * levelMultiplier;
  if (userXP >= levelXP) {
    xp[user].level++;
    userLevel++;
    userXP -= levelXP;
    message.channel.send(levelUpMessage.replace("{level}", userLevel).replace("{user}", `<@${user}>`));
    addXP(message, user, 0);
  }
  saveXP();
}

function removeXP(message, user, amount) {
  if (!xp[user]) xp[user] = { level: 0, xp: 0 };
  let userXP = xp[user].xp;
  if (userXP - amount < 0) xp[user].xp = 0;
  else xp[user].xp -= amount;
  message.channel.send(`Removed ${amount} XP from <@${user}>.`);
  saveXP();
}

function setXP(message, user, amount) {
    if (!xp[user]) xp[user] = { level: 0, xp: 0 };
    xp[user].xp = amount;
    let userLevel = xp[user].level;
    let userXP = xp[user].xp;
    let levelXP = userLevel * levelMultiplier;
    if (userXP >= levelXP) {
        xp[user].level++;
        userLevel++;
        userXP -= levelXP;
        message.channel.send(levelUpMessage.replace("{level}", userLevel).replace("{user}", `<@${user}>`));
        addXP(user, 0);
    }
}

function checkXP(message, user) {
  if (!xp[user]) xp[user] = { level: 0, xp: 0 };
  let userXP = xp[user].xp;
  message.channel.send(`<@${user}> currently have ${userXP} XP.`);
}



client.on("message", message => {
  if (message.author.bot || message.type == "dm") return;
  prefix = prefixData[message.guild.id] || DEFAULT_PREFIX;

  addXP(message, message.author.id, 1);

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  try {
    // ---------------- LEVELING COMMANDS ----------------------
    if (command === "addxp") {

        if (message.author.id !== darrenefecto) return message.channel.send("You do not have permission to use this command.");

        let amount = parseInt(args[0]);
        if (isNaN(amount)) {
            message.channel.send("Please provide a valid amount of XP to add.");
            return;
        }

        const mentions = message.mentions.users;
        const user = mentions.size ? mentions.first().id : message.author.id;

        addXP(message, user, amount);
        message.channel.send(`Added ${amount} XP to <@${user}>.`);
        return;
    }
    else if (command === "removexp") {
        if (message.author.id !== darrenefecto) return message.channel.send("You do not have permission to use this command.");

        let amount = parseInt(args[0]);
        if (isNaN(amount)) {
        message.channel.send("Please provide a valid amount of XP to remove.");
        return;
        }

        const mentions = message.mentions.users;
        const user = mentions.size ? mentions.first().id : message.author.id;

        removeXP(message, user, amount);
        return;
    }
    else if (command === "setxp") {
        if (message.author.id !== darrenefecto) return message.channel.send("You do not have permission to use this command.");
        
        let amount = parseInt(args[0]);
        if (isNaN(amount)) {
            message.channel.send("Please provide a valid amount of XP to set.");
            return;
        }
        let user = message.mentions.users.first();
        if (!user) {
            message.channel.send("Please mention a user.");
            return;
        }
        setXP(message, user.id, amount);
        message.channel.send(`Set ${user}'s XP to ${amount}.`);
        return;
    }
    else if (command === "xp") {
        const mentions = message.mentions.users;
        const user = mentions.size ? mentions.first().id : message.author.id;
        checkXP(message, user);
        return;
    }
  }
  catch(err) {
    catchErr(err, message);
  } 
});

client.login(TOKEN)