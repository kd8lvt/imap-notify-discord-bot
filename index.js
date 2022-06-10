let Email = require('./email.js');
let Bot = require('./bot.js');

let config = require('./config.json');

disc = Bot.init(config.discord);
email = Email.init(config.email);

email.on('message',(data)=>{
    let {from,to,subject,date,inboxLength} = data;
    Bot.sendDiscordEmbed((new Bot.EmailMessageEmbed(from[0],to[0],subject[0],date[0],inboxLength)).toEmbed());
});