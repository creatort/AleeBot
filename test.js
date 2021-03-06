/****************************************
 * 
 *   AleeBot: Made for discord servers
 *   Copyright (C) 2018 AleeCorp
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * *************************************/
const Discord = require('discord.js');
const economy = require('discord-eco');
const moment = require('moment');
const DBL = require("dblapi.js");
const client = new Discord.Client({
  disableEveryone: true
});
const settings = require('./storage/settings.json')
const fs = require('fs');

const log = message => {

  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);

};

console.log('AleeBot: Copyright (C) 2018 AleeCorp');
console.log('This program comes with ABSOLUTELY NO WARRANTY; for details type `show w\'.');
console.log ('This is free software, and you are welcome to redistribute it');
console.log ('under certain conditions; type `show c\' for details.\n')

if (process.argv.indexOf("--debug") == -1) {
  console.log("Running AleeBot without --debug command line flag. Debug output disabled.\n");
} else {
  console.log('[!] Entering debug mode...')
  client.on('debug', function(info) {
      log(info);
  });
  client.on('warn', function(info) {
      log(info);
  });
}

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./commands', (err, files) => {
  if (err) console.error(err);
  log(`[!] Attempting to load a total of ${files.length} commands into the memory.`);
  files.forEach(file => {
    try {
      const command = require(`./commands/${file}`);
      log(`[!] Attempting to load the command "${command.help.name}".`);
      client.commands.set(command.help.name, command);
      command.conf.aliases.forEach(alias => {
        client.aliases.set(alias, command.help.name);
        log(`[!] Attempting to load "${alias}" as an alias for "${command.help.name}"`);
      });
    }
    catch (err) {
      log('[X] An error has occured trying to load a command. Here is the error.');
      console.log(err.stack);
    }
  });
  log('[>] Command Loading complete!');
  console.log('\n');
});


client.on('ready', () => {
  log('[>] AleeBot is now ready!');
  log(`[i] Logged in as ${client.user.tag}`);
  log(`[i] Prefix: ${settings.prefix}`)
  log(`[i] Bot ID: ${client.user.id}`);
  log(`[i] Token: ${config.abtoken}`);
  log('[i] Running version ' + settings.abVersion + ` and in ${client.guilds.size} guilds`);
  
  client.setInterval(function() {
    const games = [
      'AleeBot ' + settings.abVersion + ' | ' + config.prefix + 'help',
      'Annoying Alee',
      'Coding stuff',
      'Drawing shapes',
      'Fighting AstralMod',
    ];

    client.user.setPresence({
      status: 'online',
      afk: false,
      game: {
        type: 0,
        name: games[Math.floor(Math.random() * games.length)],
      },
    });
  }, 200000);
  client.user.setStatus('online');
});

client.on('guildCreate', guild => {

  log(`[i] New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

});


client.on('guildDelete', guild => {

  log(`[i] I have been removed from: ${guild.name} (id: ${guild.id})`);

});


client.on('message', (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(settings.prefix)) return;
  const args = msg.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift();
  let cmd;

  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }

  if (cmd) {
    if (cmd.conf.guildOnly == true) {
      if (!msg.channel.guild) {
        return msg.channel.createMessage('This command can only be ran in a guild.');
      }
    }
    try {
      cmd.run(client, msg, args);
    }
    catch (e) {
      console.error(e);
    }
  }
});

process.on('unhandledRejection', function(err, p) {

log("[X | UNCAUGHT PROMISE] " + err.stack);

});

process.on('uncaughtException', function (exception) {
  log(exception);
});

client.on("error", error => {
  log(error);
});
