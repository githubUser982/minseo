const { SlashCommandBuilder } = require('discord.js');
const { bUtils } = require('../bUtils.js');

// start giveaway cmd

module.exports = {
   data: new SlashCommandBuilder()
      .setName('end')
      .setDescription('End a giveaway.')
      .addStringOption(option =>
         option.setName('message-id')
            .setDescription('The message ID of the giveaway')
            .setRequired(true)),

         


   async execute(interaction) {
      // This is where stuff actually happens!
      const messageID = interaction.options.getString('message-id');
      if (!messageID) return interaction.reply({ content: 'You must provide a message ID!', ephemeral: true });

      const giveaway = await giveaways.findOne({ messageID: messageID });
      if (!giveaway) return interaction.reply({ content: 'I could not find a giveaway with that message ID!', ephemeral: true });

      giveaway.ended = true;
      await giveaway.save();

      interaction.reply(await bUtils.embedify(`Giveaway ended.`, `It has been ended but not destroyed.` ))



   }
   
};