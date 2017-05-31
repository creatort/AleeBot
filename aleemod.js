const Discord = require('discord.js');
 const client = new Discord.Client();
   
   var expletiveFilter = true;
   var lastMessages = {};
   var sameMessageCount = {};
   

   client.on('ready', () => {
       console.log("AleeMod is now ready!");
   });
   
   client.on('message', message => {
       var msg = message.content;
       if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] > 3) {
           console.log("Spam limits kicking in!");
           switch (Math.floor(Math.random() * 1000) % 4) {
               case 0:
                   message.reply("Well... We all heard you.");
                   break;
               case 1:
                   message.reply("Stop typing the same thing! You're like a broken record!");
                   break;
               case 2:
                   message.reply("Hmm... Not sure if you'd actually say the same thing more than three times in public.");
                   break;
               case 3:
                   message.reply("Is that the only phrase you know? Can you try typing something else?");
                   break;
           }
           message.delete();
           return;
       }
       
       if (expletiveFilter) {
           var exp = msg.search(/(\s|^)(shit|shite|shitty|bullshit|fuck|fucking|ass|penis|cunt|faggot|cock)(\s|$)/i);
           if (exp != -1) { //Gah! They're not supposed to say that!

               switch (Math.floor(Math.random() * 1000) % 5) {
                   case 0:
                       message.reply("Hey! This is not your time to swear.");
                       break;
                   case 1:
                       message.reply("Hey! Let's not have any of that please.");
                       break;
                   case 2:
                       message.reply("Did you just...");
                       break;
                   case 3:
                       message.reply("Cool. Now let's not forget the rules.");
                       break;
                   case 4:
                       message.reply("If I'm not going to delete it, a mod will. Let's save them some work.");
                       break;
               }
               message.delete();
               return;
           }
       }
       
       if (msg.startsWith("mod:")) {
           //Check for moderator/admin permission
           
           //Moderator ID: 285427075043819530
           //Admin ID:     259877121793458179
           if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Moderators")) { 
               var command = msg.substr(4);
               switch (command) {
                   case "ping":
                       message.channel.send('<:vtBoshyTime:280178631886635008> PONG! I want to play pong too... :\'(');
                       break;
                   case "pong":
                       message.channel.send('<:vtBoshyTime:280178631886635008> PING!');
                       break;
                   case "filter":
                       if (expletiveFilter) {
                           message.channel.send(':arrow_forward: Expletive Filter: on');
                       } else {
                           message.channel.send(':arrow_forward: Expletive Filter: off');
                       }
                       message.delete();
                       break;
                   case "filter on":
                       if (expletiveFilter) {
                           message.channel.send(':arrow_forward: Expletive Filter is already on.');
                       } else {
                           expletiveFilter = true;
                           message.channel.send(':white_check_mark: Expletive Filter is now turned on.');
                           console.log("Expletive Filter is now on.");
                       }
                       message.delete();
                       break;
                   case "filter off":
                       if (expletiveFilter) {
                           expletiveFilter = false;
                           message.channel.send(':white_check_mark: Expletive Filter is now turned off.');
                           console.log("Expletive Filter is now off.");
                       } else {
                           message.channel.send(':arrow_forward: Expletive Filter is already off.');
                       }
                       message.delete();
                       break;
                   default:
                       if (command.startsWith("uinfo")) {
                           if (message.channel.id == 277923386959855626) {
                               message.channel.send(':no_entry_sign: Not ready yet. Check back soon!');
                           } else {
                               message.channel.send(':no_entry_sign: NO: Unable to use this command in this channel.');
                           }
                       }
               }
           } else {
               message.reply(':no_entry_sign: NO: What? You\'re not an admin! Why would you be allowed to type that!?');
           }
       }
       
       //Spam limiting
       if (lastMessages[message.author.id] != msg) {
           sameMessageCount[message.author.id] = 0;
       }
       lastMessages[message.author.id] = msg
       sameMessageCount[message.author.id]   = 1;
   });
   
   client.on('guildMemberAdd', usr => {
   });
   
   client.login('token').catch(
     function() {
       console.log("[ERROR] Login failed.");
   });