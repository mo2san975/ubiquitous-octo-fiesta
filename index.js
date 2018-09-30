const Discord = require('discord.js');
const https = require('https');
const fetch = require('node-fetch');
const agent = new https.Agent({ keepAlive: true});
const slowMode = new Discord.Client();

const token = process.env.TOKEN;
slowMode.login(token);
const prefix = 's!';

slowMode.on('ready', () => {
    console.log('Bot is ready.');
    slowMode.user.setActivity(`serving ${slowMode.guilds.size} servers`);
})
slowMode.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    slowMode.user.setActivity(`serving ${slowMode.guilds.size} servers`);

});

slowMode.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    slowMode.user.setActivity(`serving ${slowMode.guilds.size} servers`);

});
slowMode.on('message', (message) => {
    if(message.author.bot) return;
    if(!message.guild) return;
    
    if(!message.content.startsWith(prefix)) return;
    
    let args = message.content.slice(prefix.length).split(' ');
    let cmd = args.shift();
    
    if(cmd == 'set') {
        
        if(!args[0] || isNaN(args[0])) return message.channel.send('Please enter a **valid number** of seconds to set slowmode time.')
     
        let number = parseInt(args[0]);
     
        if(number > -1 && number < 121) {
           /* let req = https.request({
                host: 'discordapp.com',
                path: `/api/v6/channels/${message.channel.id}`,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${token}`,
                },
                body: JSON.stringify({
                    name: "123"
                })
            }, (res) => {
                 console.log(`STATUS: ${res.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                });
                res.on('end', () => {
                    console.log('No more data in response.');
                });
            })
            req.on('error', (err) => {
                console.log(err.message)
            })
            req.end();*/
            
            fetch(`https://discordapp.com/api/v6/channels/${message.channel.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bot ${token}`,
                },
                agent,
                body: JSON.stringify({rate_limit_per_user: number}),
            });
            
            message.channel.send(`The slowmode time in this channel [${message.channel.name}] has been set to ${number} second(s)`)
            
        } else {
            message.channel.send("The seconds time must be (0 - 120)")   
        }
    }
})
