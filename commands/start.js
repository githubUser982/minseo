const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { bUtils } = require('../bUtils.js');

// start giveaway cmd

module.exports = {
   data: new SlashCommandBuilder()
      .setName('start')
      .setDescription('start a giveaway.')
      .addStringOption(option =>
         option.setName('prize')
            .setDescription('The prize of the giveaway')
            .setRequired(true))
      .addIntegerOption(option =>
         option.setName('winners')
            .setDescription('The number of winners')
            .setRequired(true))
      .addIntegerOption(option =>
         option.setName('duration')
            .setDescription('The duration of the giveaway')
            .setRequired(true))
      .addStringOption(option =>
         option.setName('duration-type')
            .setDescription('The type of duration')
            .setRequired(true)
            .addChoices(
               { name: 'Seconds', value: 'seconds' },
               { name: 'Minutes', value: 'minutes' },
               { name: 'Hours', value: 'hours' },
               { name: 'Days', value: 'days' },
            )
      )
      .addChannelOption(option =>
         option.setName('channel')
            .setDescription('The channel to send the giveaway in')
            .setRequired(false)
      )
      .addStringOption(option =>
         option.setName('ping-role-id')
            .setDescription('role to ping')
            .setRequired(false)
      ),



   async execute(interaction) {
      // This is where stuff actually happens!
      const prize = interaction.options.getString('prize');
      const winners = interaction.options.getInteger('winners');
      const duration = interaction.options.getInteger('duration');
      const durationType = interaction.options.getString('duration-type');
      let channel = interaction.options.getChannel('channel');
      if (!channel) channel = interaction.channel;
      const pingrole = interaction.options.getString('ping-role-id');

      if (!channel.isTextBased()) return interaction.reply({ content: 'You can only start giveaways in text channels!', ephemeral: true });
      

      if (!prize) return interaction.reply({ content: 'You must provide a prize!', ephemeral: true });
      if (!winners) return interaction.reply({ content: 'You must provide a number of winners!', ephemeral: true });
      if (!duration) return interaction.reply({ content: 'You must provide a duration!', ephemeral: true });
      if (!durationType) return interaction.reply({ content: 'You must provide a duration type!', ephemeral: true });


      const now = Date.now();

      let durationModifier
      if (durationType === 'seconds') durationModifier = 1000;
      if (durationType === 'minutes') durationModifier = 60 * 1000
      if (durationType === 'hours') durationModifier = 60 * 60 * 1000
      if (durationType === 'days') durationModifier = 24 * 60 * 60 * 1000

      const durationInMs = duration * durationModifier

      // create giveaway in database

      const dbGiveaway = await giveaways.create({
         guildId: interaction.guildId,
         channelID: channel.id,
         creator: interaction.user.id,
         prize: prize,
         winners: winners,
         ended: false,
         endTime: now + durationInMs,
         pingRole: pingrole
      })

      giveawayMessage = await bUtils.constructGwMessage(dbGiveaway)

      realGwMessage = await channel.send(giveawayMessage)
      dbGiveaway.messageID = realGwMessage.id
      await dbGiveaway.save()



      interaction.reply(await bUtils.embedify(`Giveaway created!`, `\n Prize: ${prize} \n Winners: ${winners} \n Duration: ${duration} ${durationType}`))



   }

};