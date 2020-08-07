/* SETUP START */

// Load Discord.js
const Discord = require('discord.js');

// Load config
const config= require('./config.json');

// Load axios
const axios = require('axios');

// Load ping-monitor
const monitor = require('ping-monitor');

// Load canvas
const Canvas = require('canvas');

// Create discord client
const client = new Discord.Client();

// Log when bot is ready and set status
client.once('ready', () => {
    console.log('FiveM:FR Bot');
    console.log('Made by Nylander (Coward Gaming / FiveM:FR Director)');
    console.log('Please wait . . .');
    console.log(' ');
    console.log('The bot has started without any problems!');

    // Set status
    client.user.setStatus('online');
    client.user.setActivity(config.activityText, {
        type: config.activityType,
    })

    setInterval(function(){
        axios.get('http://5.103.156.254:30120/players.json')
        .then(response => {
            client.user.setActivity(`FiveM:FR with ${response.data.length} players`);
        }).catch(error => {
            console.log(error);
        });
    }, 5000);
});

/* SETUP END */

/* BASIC START */

// Welcome message and new role

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

client.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.find(ch => ch.name === 'welcome');
    if(!channel) return console.log('No welcome channel was found!');

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#F3993C';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

    ctx.font = applyText(canvas, member.displayName);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

    ctx.beginPath()
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
    ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the **FiveM:FR** Discord, ${member}!\nWe hope you would enjoy your stay. Please read our rules and guidelines, to ensure everybody is having a great time. :wink:`, attachment);

    // Give role
    const role = channel.guild.roles.find(r => r.name === "Member");
    if(!role) return console.log('No member role was found!');
    member.addRole(role).catch(console.error);

    // Log
    const logChannel = client.channels.get('678619130232045581');
    const joinEmbed = new Discord.RichEmbed()
        .setTitle('A new user has joined!')
        .setAuthor('FiveM:FR Bot')
        .setColor('#F3993C')
        .setFooter('© FiveM:FR | 2020')
        .setTimestamp()
        .addField('User:', member)
        .addField('User ID:', member.id)
    logChannel.send(joinEmbed);
});

// Leave log
client.on('guildMemberRemove', member => {
    const logChannel = client.channels.get('678619130232045581');
    const joinEmbed = new Discord.RichEmbed()
        .setTitle('A user has left!')
        .setAuthor('FiveM:FR Bot')
        .setColor('#F3993C')
        .setFooter('© FiveM:FR | 2020')
        .setTimestamp()
        .addField('User:', member)
        .addField('User ID:', member.id)
    logChannel.send(joinEmbed);
})

/* BASIC END */

// Get current year for copyright
const copyright = new Date().getFullYear();

/* COMMAND SETUP START */
client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

/* COMMAND SETUP END */

/* COMMANDS START */

/* Rules command - temp
if(command === "rules") {
    message.channel.send("__**Rules**__\n\n***Behavior or content directly associated with you in conflict to the rules, FiveM ToS or the Discord ToS is grounds for a warning, mute, kick or ban at the discretion of the staff.***\n**FiveM Terms of Service:** https://fivem.net/terms\n**Discord Terms of Service:** https://discordapp.com/tos\n\n**1.** Refrain from using languages other than English and Danish.\n**2.** Refrain from discussing any politically charged topics.\n**3.** NSFW or objectionable content of any kind is strictly prohibited. If you are unsure if it is NSFW, you shouldn't post it.\n**4.** Nicknames must be able to be mentioned. Homoglyps, Zalgo multiple scripts are prohibited, as well as your nickname must not contain politically, sexual or any offensive characters.\n**5.** Uphold mature conversations and respect each other; excessive profanity, hate speech or any kind of harassment will not be tolerated.\n**6.** Spamming, toxic or aggressive behavior will not be tolerated.\n**7.** Advertising for other FiveM communities or any kind of communities is prohibited. \n**8.** Trading of any kind is prohibited. This applies to any services and begging as well.\n**9.** Alternate accounts are prohibited, if it isn't accepted by a person from the @Management. Ban/Mute evasion will have all accounts permanently banned.\n**10.** Be mindful of channels and their rules; read the channel descriptions and take notice.\n**11.** Do not mention @FiveM:FR Team or @Tester Team unless there is an emergency requiring immediate action.\n**12.** Do not message any other members unless mutually agreed upon.\n**13.** Do not ask or discuss bans. Please ask our support team in #support if you have any questions.\n**14.** Impersonation of other users or public figures is prohibited.\n**15.** Lastly, @Moderating Team and @Management's decisions are final and are not to be argues with.");
} */

/* Suggestion info command - temp
if(command === "suggestioninfocommand") {
    if(!message.member.roles.some(r=>["Management"].includes(r.name)))
    return message.delete();

    const embed = new Discord.RichEmbed()
        .setTitle('Suggestion Information')
        .setColor('#F3993C')
        .setAuthor(client.user.username, client.user.avatarURL)
        .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
        .setThumbnail('https://media.discordapp.net/attachments/678619104201932831/678984927345377320/FiveMFR2.png?width=676&height=676')
        .setTimestamp()
        .addField("How do I submit a suggestion?", "You can submit a suggestion simply by typing this command:\n!suggest <suggestion>\nThen the bot will send your suggestion, and other members can react if they like it or not, or if they don't care.")
        .addField("Does my suggestion get implemented?", 'When a director, developer or designer has reacted with ":white_check_mark:", your suggestion is getting implemented at some time.')
        .addField('I have a question to a suggestion, where can I ask it?', 'You can see who has submitted the suggestion in the message sent by the bot.\nYou can either PM the user or send your question in the #general chat.')
    message.channel.send(embed);
} */

// Ping command
if(command === "ping") {
    const m = await message.channel.send('Pinging . . .');

    const embed = new Discord.RichEmbed()
        .setTitle('Ping Result | FiveM:FR Bot')
        .setColor('#F3993C')
        .setAuthor(message.author.username, message.author.avatarURL)
        .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
        .setTimestamp()
        .addField('Latency', `${m.createdTimestamp - message.createdTimestamp} ms`)
        .addField('API Latency', `${Math.round(client.ping)} ms`)

    m.edit(embed);
}

// Server status command
var serverStatus = "down";

if(command === "status" || command === "serverstatus") {
    const m = await message.channel.send('Loading . . .');

    const server = args[0].toString();
    const port = args[1].toString();
    const servername = args[2].toString();
    const slots = args[3].toString();
    const whiteliststatus = args[4].toString();

    const mon = new monitor({
        address: server,
        port: port,
        interval: 1
    });

    try {
        mon.on('up', function (res, state) {
            axios.get(`http://${server}:${port}/players.json`)
            .then(response => {
    
                var playersTxt = "[";
                var players = response.data;
                players.forEach(updatePlayers);
    
                function updatePlayers(value, index, array) {
                    playersTxt = playersTxt + " " + value.name + ",";
                }
    
                const embed = new Discord.RichEmbed()
                .setTitle('Server Status | FiveM:FR')
                .setColor('#F3993C')
                .setAuthor(message.author.username, message.author.avatarURL)
                .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
                .setTimestamp()
                .addField('Server Name', servername)
                .addField('Server Status', '🟩 Online 🟩')
                .addField('Online Players', `${response.data.length} player(s) / ${slots}`)
                .addField('Players', playersTxt + "]")
                .addField('IP Address', server)
                .addField('Whitelist Status', whiteliststatus)
    
                m.edit(embed);
            }).catch(error => {
                const offlineEmbed = new Discord.RichEmbed()
                .setTitle('Server Status | FiveM:FR')
                .setColor('#F3993C')
                .setAuthor(message.author.username, message.author.avatarURL)
                .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
                .setTimestamp()
                .addField('Server Name', servername)
                .addField('Server Status', '◻️ Unknown ◻️')
                .addField('Online Players', `0 player(s) / ${slots}`)
                .addField('Players', 'No one')
                .addField('IP Address', server + ":" + port)
                .addField('Whitelist Status', whiteliststatus)
    
                m.edit(offlineEmbed);
    
                console.log(error);
            });
        });
    
        mon.on('down', function (res) {
            const offlineEmbed = new Discord.RichEmbed()
            .setTitle('Server Status | FiveM:FR')
            .setColor('#F3993C')
            .setAuthor(message.author.username, message.author.avatarURL)
            .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
            .setTimestamp()
            .addField('Server Name', servername)
            .addField('Server Status', '🟥 Offline 🟥')
            .addField('Online Players', `0 player(s) / ${slots}`)
            .addField('IP Address', server + ":" + port)
    
            m.edit(offlineEmbed);
        });
    
        mon.on('error', function (error) {
            const offlineEmbed = new Discord.RichEmbed()
            .setTitle('Server Status | FiveM:FR')
            .setColor('#F3993C')
            .setAuthor(message.author.username, message.author.avatarURL)
            .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
            .setTimestamp()
            .addField('Server Name', servername)
            .addField('Server Status', '◻️ Unknown ◻️')
            .addField('Online Players', `0 player(s) / ${slots}`)
            .addField('IP Address', server + ":" + port)
    
            m.edit(offlineEmbed);
        });
    } catch (error) {
        const offlineEmbed = new Discord.RichEmbed()
        .setTitle('Server Status | FiveM:FR')
        .setColor('#F3993C')
        .setAuthor(message.author.username, message.author.avatarURL)
        .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
        .setTimestamp()
        .addField('Server Name', servername)
        .addField('Server Status', '◻️ Unknown ◻️')
        .addField('Online Players', `0 player(s) / ${slots}`)
        .addField('IP Address', server + ":" + port)

        m.edit(offlineEmbed);
    }
    

    /*setInterval(function() {
        axios.get(`http://${server}/players.json`)
        .then(response => {

            var playersTxt = "[";
            var players = response.data;
            players.forEach(updatePlayers);

            function updatePlayers(value, index, array) {
                playersTxt = playersTxt + " " + value.name + ",";
            }

            const embed = new Discord.RichEmbed()
            .setTitle('Server Status | FiveM:FR')
            .setColor('#F3993C')
            .setAuthor(message.author.username, message.author.avatarURL)
            .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
            .setTimestamp()
            .addField('Server Name', servername)
            .addField('Server Status', '🟩 Online 🟩')
            .addField('Online Players', `${response.data.length} player(s) / ${slots}`)
            .addField('Players', playersTxt + "]")
            .addField('IP Address', server)

            m.edit(embed);
        }).catch(error => {
            const offlineEmbed = new Discord.RichEmbed()
            .setTitle('Server Status | FiveM:FR')
            .setColor('#F3993C')
            .setAuthor(message.author.username, message.author.avatarURL)
            .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
            .setTimestamp()
            .addField('Server Name', servername)
            .addField('Server Status', '🟥 Offline 🟥')
            .addField('Online Players', `0 player(s) / ${slots}`)
            .addField('IP Address', server)

            m.edit(offlineEmbed);

            console.log(error);
        });
    }, 5000);*/
}

// Help command
if(command === "help") {
    const embed = new Discord.RichEmbed()
        .setTitle('Help | FiveM:FR Bot')
        .setColor('#F3993C')
        .setAuthor(message.author.username, message.author.avatarURL)
        .setFooter(`© FiveM:FR | ${copyright}`, client.user.avatarURL)
        .setTimestamp()
        .addField('!ping', 'Shows latency and API latency.')
        .addField('!suggest <suggestion>', 'Send a suggestion in #suggestions-and-ideas.')
    message.channel.send(embed);
}

// Staff help command
if(command === "staffhelp") {
    if(!message.member.roles.some(r=>["Management", "Devlopment Team", "Design Team", "HR & PR Team"]))
    return message.author.send(`Hello, ${message.author}!\nYou aren't permitted to see staff commands.`).then(message.delete());

    const embed = new Discord.RichEmbed()
        .setTitle('Help | FiveM:FR Bot')
        .setColor('#F3993C')
        .setAuthor(message.author.username, message.author.avatarURL)
        .setFooter(`© FiveM:FR | ${copyright}`, client.user.avatarURL)
        .setTimestamp()
        .addField('!warn @user <reason>', 'Warns the specified user with the specified reason.')
        .addField('!news <news text>', 'Sends a news in the #announcements channel.')
        .addField('!purge <messages>', 'Deletes the specified number of messages.')
    message.author.send(embed).then(message.delete());    
}

// Suggestion command
if(command === "suggest") {
    if(message.channel.id === '678616272841343021') {
        const suggestion = args.join(' ');
        
        if(!suggestion)
        return message.author.send(`Hello, ${message.author}!\nYou can't send a blank suggestion. Please try again, with some content.`).then(message.delete());

        const embed = new Discord.RichEmbed()
            .setTitle('Suggestion | FiveM:FR Bot')
            .setColor('#F3993C')
            .setAuthor(message.author.username, message.author.avatarURL)
            .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
            .setTimestamp()
            .addField('Suggestion', suggestion)
            .addField('Suggested by', message.author.username)
        message.channel.send(embed).then(function(message) {
            message.react('👍');
            message.react('👎');
            message.react('🤷');
        }).then(message.delete());
    } else {
        return message.author.send(`Hello, ${message.author}!\nYou can only send suggestions in our **#suggestions-and-ideas** channel.`).then(message.delete());
    }
}

// News command
if(command === "news") {
    if(!message.member.roles.some(r=>["Management", "Devlopment Team", "Design Team", "HR & PR Team"]))
    return message.author.send(`Hello, ${message.author}!\nYou aren't permitted to send news and announcements on our server.`).then(message.delete());

    const news = args.join(' ');
    const newsChannel = client.channels.get('678615514221641759');

    const embed = new Discord.RichEmbed()
        .setTitle('Announcement | FiveM:FR Bot')
        .setColor('#F3993C')
        .setAuthor(message.author.username, message.author.avatarURL)
        .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
        .setTimestamp()
        .addField('Announcement', news)
        .addField('Written By', message.author.username)
    newsChannel.send(embed).then(message.delete());
    newsChannel.send("@everyone");
}

// Warn command
if(command === "warn") {
    if(!message.member.roles.some(r=>["Management", "Moderating Team"].includes(r.name)))
    return message.author.send(`Hello, ${message.author}!\nYou don't have the required permission level to warn users.`).then(message.delete());

    const warnMember = message.mentions.users.first();
    if(!warnMember)
    return message.author.send(`Hello, ${message.author}!\nYou need to specify which user you want to warn.`).then(message.delete());

    const warnReason = args.slice(1).join(' ');
    if(!warnReason)
    return message.author.send(`Hello, ${message.author}!\nYou need to specify why you want to give ${warnMember} a warning.`).then(message.delete());

    // Message to user
    const warningEmbed = new Discord.RichEmbed()
        .setTitle('You have been warned!')
        .setColor('#F3993C')
        .setAuthor(message.author.username, message.author.avatarURL)
        .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
        .setTimestamp()
        .addField('Warned by', message.author.username)
        .addField('Warned for', warnReason)
        .addField('If you wanna complain', 'Then contact a person from our **HR & PR Team** or one of the **Directors**.')
    warnMember.send(warningEmbed);

    // Message to log
    const logChannel = client.channels.get('678619130232045581');
    const logEmbed = new Discord.RichEmbed()
        .setTitle('A user have received a warning!')
        .setColor('#F3993C')
        .setAuthor(message.author.username, message.author.avatarURL)
        .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
        .setTimestamp()
        .addField('Warned by', message.author.username)
        .addField('Warned for', warnReason)
    logChannel.send(logEmbed);
}

// Purge command
if(command === "purge") {
    if(!message.member.roles.some(r=>["Management", "Moderating Team"].includes(r.name)))
    return message.author.send(`Hello, ${message.author}!\nYou don't have the required permission level to purge messages.`).then(message.delete());

    const deleteCount = parseInt(args[0], [10]);

    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
    return message.author.send(`Hello, ${message.author}!\nYou can only purge 2 to 100 messages per command.`).then(message.delete());

    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched).catch(error=>message.reply(`Sorry, the messages couldn't be deleted because of an error: ${error}`));

    // Log embed
    const logChannel = client.channels.get('678619130232045581');
    const logEmbed = new Discord.RichEmbed()
        .setTitle('Messages has been purged!')
        .setColor('#F3993C')
        .setAuthor(message.author.username, message.author.avatarURL)
        .setFooter('© FiveM:FR | 2020', client.user.avatarURL)
        .setTimestamp()
        .addField('Purged by', message.author.username)
        .addField('Messages purged', deleteCount)
    logChannel.send(logEmbed);
}

/* COMMANDS END */
})

// Login to Discord
client.login(config.token);