const {Client, Intents, MessageEmbed} = require('discord.js');
let client = null;
let config = null;

function init(_config) {
    config = _config;
    token = config.token;

    client = new Client({intents:[Intents.FLAGS.GUILDS]});
    
    client.on('ready',()=>{
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.login(token);

    return client;
}

function sendDiscordEmbed(embed) {
    let channelId = config.channel;
    let channelManager = client.channels;
    channelManager.fetch(channelId).then((channel)=>{
        channel.guild.members.fetch(config.userToPing).then(userToPing=>{
            channel.send({content:`${userToPing.toString()} - you have a new email! <https://gmail.com>`,embeds:[embed]});
        });
    });
}

class EmailMessageEmbed {
    constructor(from,to,subject,date,inboxLength) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.date = date;
        this.inboxLength = inboxLength;
    }

    toEmbed() {
        let self = this;
        let from = (config.censorSenderEmails?'<Hidden by Config>':this.from);
        let to = (config.censorYourEmail?'<Hidden by Config>':this.to);
        return new MessageEmbed({title:`New Email!`,description:`Amount of Emails in Inbox: ${self.inboxLength}`,fields:[{name:'Subject:',value:self.subject},{name:'From:',value:from},{name:'To:',value:to},{name:'Sent On:',value:self.date}]})
    }
}

module.exports = {init,sendDiscordEmbed,EmailMessageEmbed};