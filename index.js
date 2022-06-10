const Email = require('./email.js');
const Bot = require('./bot.js');

const config = require('./config.json');

let disc = Bot.init(config.discord); //The discord bot client is saved to a variable for posterity. Not actually used anywhere, but maybe sometime!
let email = Email.init(config.email);

email.on('message',(data)=>{ //See email.js
    let {from,to,subject,date,inboxLength} = data;
    Bot.sendDiscordEmbed((new Bot.EmailMessageEmbed(from[0],to[0],subject[0],date[0],inboxLength)).toEmbed()); //See bot.js
});