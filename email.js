const Imap = require('node-imap'),
    inspect = require('util').inspect;
const EventEmitter = require ('events');
let config = null;
let client = null;
let emailEvts = null;

function init(_config) {
    config = _config;
    client = new Imap(config);
    
    client.once('ready',()=>{
        console.log(`Logged into ${config.host}:${config.port}`);

        openInbox(()=>{}); //We do this so the following client.on('mail') works. Might not be needed, but it's here just in case.
        parseMail();
    });

    client.on('mail',(numNew)=>{
        if (numNew > 0) {
            parseMail();
        }
    });

    client.on('error',(err)=>{
        if (err) throw err;
    })

    client.connect();

    emailEvts = new EmailEvtEmitter();
    return emailEvts;
}

class EmailEvtEmitter extends EventEmitter {}

function parseMail() {
    openInbox(function(err, box) {
        if (err) throw err;
        client.seq.search([['X-GM-RAW','-label:read-by-discord-bot']],(err2,results) => {
            if (err2) throw err2;
            if (results.length < 1) return;
            let f = client.seq.fetch(results,{bodies:'HEADER.FIELDS (FROM TO SUBJECT DATE)', struct: true});
            f.on('message',(msg,seqno)=>{
                console.log('Message #%d', seqno);
                                
                msg.on('body', function(stream, info) {
                    var buffer = '';
                    stream.on('data', function(chunk) {
                        buffer += chunk.toString('utf8');
                    });
                    stream.once('end', function() {
                        let data = Imap.parseHeader(buffer);
                        data.inboxLength = box.messages.total;
                        emailEvts.emit('message',data);
                    });
                });
                client.seq.addLabels(seqno,['read-by-discord-bot'],(err)=>{console.log('Tried adding label to #%d',seqno);if (err) {throw err;}});
            });
        });
    });
}

function openInbox(cb) {
    client.openBox('INBOX',false,cb);
}

module.exports = {parseMail,init}