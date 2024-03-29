const { SlashCommandBuilder } = require('discord.js');
const { bUtils } = require('../bUtils.js');

// start giveaway cmd

module.exports = {
   data: new SlashCommandBuilder()
      .setName('reroll')
      .setDescription('Reroll a giveaway.')
      .addStringOption(option =>
         option.setName('message-id')
            .setDescription('The message ID of the giveaway')
            .setRequired(true))
      .addIntegerOption(option =>
         option.setName('winners')
            .setDescription('The number of winners')
            .setRequired(false)),





   async execute(interaction) {
      // This is where stuff actually happens!
      const messageID = interaction.options.getString('message-id');
      if (!messageID) return interaction.reply({ content: 'You must provide a message ID!', ephemeral: true });

      const giveaway = await giveaways.findOne({ where: { messageID: messageID } });
      if (!giveaway) return interaction.reply({ content: 'I could not find a giveaway with that message ID!', ephemeral: true });

      let winnerCount = interaction.options.getInteger('winners');
      if (!winnerCount) winnerCount = giveaway.winners;

      let dbGiveawayParticipants = await giveawayParticipants.findAll({ where: { giveawayID: giveaway.id } });

      let gwChannel = await botClient.channels.cache.get(giveaway.channelID)

      let WinnersString = ""
      for (let i = 0; i < winnerCount; i++) {
         let winner = dbGiveawayParticipants[Math.floor(Math.random() * dbGiveawayParticipants.length)]
         WinnersString += `Winner: <@${winner.userID}> has won the giveaway for ${giveaway.prize}! \n`

         

         
         // update db
         winner.won = true
         await winner.save()
      }
      gwChannel.send(await bUtils.embedify(`Winners:`, `${WinnersString} \n\n GW message ID: ${messageID}` ))


      interaction.reply(await bUtils.embedify(`Reroll complete`, `It has been rerolled.`))



   }

};