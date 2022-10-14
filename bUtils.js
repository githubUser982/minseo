
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

let bUtils = {
    sleep: function (ms) { // This is a nice way to make the bot wait for a bit. sleep(1000) will make the bot wait for 1 second.
       return new Promise(resolve => setTimeout(resolve, ms));
    },
 

    // embed
 
    embedify: async function (title, messageContent) {
      let embed = {
         embeds: [{
            title: title,
            color: 16770560, // Add a default color here that you like
            description: `${messageContent}`,
            // You can add more defaults like a thumbnail or footer
            footer: { text: "Minseo bot, written by bomi" }
         }]
      }
      return embed
   },

   msToTime: function (duration) {
      let milliseconds = parseInt((duration % 1000) / 100),
         seconds = parseInt((duration / 1000) % 60),
         minutes = parseInt((duration / (1000 * 60)) % 60),
         hours = parseInt((duration / (1000 * 60 * 60)) % 24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      return hours + ":" + minutes + ":" + seconds
   },

   constructGwMessage: async function (dbGiveaway) {
      // prepare message to send in giveaway channel

      const lebalOptions = ["Thank you Minseo, I love you", "You're doing great Minseo", "Good job, thanks."]

      const row = new ActionRowBuilder()
         .addComponents(
            new ButtonBuilder()
               .setCustomId(`${dbGiveaway.id}`)
               .setLabel(lebalOptions[Math.floor(Math.random() * lebalOptions.length)])
               .setStyle(ButtonStyle.Primary),
         );

      let titlePing

      if (dbGiveaway.pingRole) titlePing = "<@&" + dbGiveaway.pingRole + ">"
      else titlePing = "H-here's a giveaway...!"

      let timeRemaining = dbGiveaway.endTime - Date.now()
      timeRemaining = this.msToTime(timeRemaining)

      const giveawayMessage = {
         //ping a role here
         content: titlePing,
         embeds: [
            {
               title: `Giveaway for ${dbGiveaway.prize}!`,
               description: `Press the button to enter!\nHosted by: <@${dbGiveaway.creator}> \n Winners: ${dbGiveaway.winners}`,
               color: 16770560,
               footer: {
                  text: `Ends ${timeRemaining} from now...`
               }
            }],
         components: [row]
      }

      return giveawayMessage
   }
   



 }
 
 module.exports = { bUtils }