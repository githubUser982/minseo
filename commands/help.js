const { SlashCommandBuilder } = require('discord.js');
const { bUtils } = require('../bUtils.js');

// start giveaway cmd

module.exports = {
   data: new SlashCommandBuilder()
      .setName('help')
      .setDescription('Get help!'),




   async execute(interaction) {
      // This is where stuff actually happens!
      // interaction.deferReply()
      // Check that I have required permissions

      let neededPerms = ["SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS", "READ_MESSAGE_HISTORY",]

      let permsOkay = true
      let missingPerms = []

      for (let i = 0; i < neededPerms.length; i++) {
         if (!interaction.guild.members.me.permissions.has(neededPerms[i])) {
            permsOkay = false
            missingPerms.push(neededPerms[i])
         }
      }

      if (!permsOkay) interaction.channel.send("Configuration problem, I am missing permissions. Give me: " + missingPerms.join(", "))

      interaction.channel.send(await bUtils.embedify(`Help & Information`, `
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

      await interaction.reply("||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| ")

   }

};