const { SlashCommandBuilder } = require('discord.js');
const { bUtils } = require('../bUtils.js');

// start giveaway cmd

module.exports = {
   data: new SlashCommandBuilder()
      .setName('help')
      .setDescription('Get help!'),
      
         


   async execute(interaction) {
      // This is where stuff actually happens!
      


      interaction.reply(await bUtils.embedify(`Help & Information`, `
      Minseo the shy giveaway bot is here to help you with your giveaways!

      **Commands**
      /start - Start a giveaway
      /help - Get help
      /end - End a giveaway
      /reroll - Reroll a giveaway
      
      
      **Links**
      [Invite](https://discord.com/api/oauth2/authorize?client_id=852557080518852678&permissions=8&scope=bot%20applications.commands)
      [Support Server](https://discord.gg/juyeon)

      ` ))



   }
   
};