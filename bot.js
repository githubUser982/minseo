const fs = require('node:fs');
const path = require('node:path');
const { Collection, Client, Formatters, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { bUtils } = require('./bUtils.js');
global.botClient = "Not ready yet"

const { botConfig } = require('./config');
const { database } = require('./database.js');


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

//load slash commands and reset commands

if (botConfig.scheduledRestart !== 0 && botConfig.scheduledRestart) {
	scheduledRestart()
}


async function scheduledRestart() {
	await bUtils.sleep(botConfig.scheduledRestart * 60 * 60 * 1000)
	process.exit()
}

async function registerCommands() {
	let isReloading = false
	if (client.commands) {
		isReloading = true
		// reload commands
		client.commands.forEach(element => {
			delete require.cache[require.resolve(`./commands/${element.data.name}.js`)];
		});

	} else {

	}

	console.log("Registering commands...");
	//load slash commands
	const commands = [];
	client.commands = new Collection();
	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
		commands.push(command.data.toJSON());
	}

	if (!isReloading) {
		const rest = new REST({ version: '10' }).setToken(botConfig.token);

		// Register slash commands to discord
		if (!botConfig.globalCommands) {
			for (let i = 0; i < botConfig.guilds.length; i++) {
				thisGuildId = botConfig.guilds[i]

				rest.put(Routes.applicationGuildCommands(botConfig.clientId, thisGuildId), { body: commands })
					.then(data => console.log(`Successfully registered ${data.length} application commands.`))
					.catch(console.error);
			}
		} else {

			rest.put(Routes.applicationCommands(botConfig.clientId), { body: commands })
				.then(data => console.log(`Successfully registered ${data.length} GLOBAL application commands.`))
				.catch(console.error);
		}
	}
}
registerCommands();
global.reloadCommands = registerCommands;

// Ready event = when the bot is online
client.once('ready', () => {
	// Need to sync every table in the db
	giveaways.sync()
	giveawayParticipants.sync()
	global.botClient = client

	console.log('Minseo is online!');
});


// Interaction event
// Get incoming slash cmds and send them to the right file
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'No no no! I- Something is wrong!', ephemeral: true });
	}
	console.log;
});

// on normal message
client.on('messageCreate', async message => {

})



// Prevent bot from crashing when there is errors:
// This makes it just show the error without shutting down.

process.on('uncaughtException', err => {
	console.log(err);
	bomiLogger(err)
});

process.on('TypeError', (reason, promise) => {
	console.log(reason);
	console.log(promise);
	bomiLogger(reason)
});

process.on('unhandledRejection', (reason, promise) => {
	console.log(reason);
	console.log(promise);
	bomiLogger(reason)
});

client.on('error', (err) => {
	console.log(err);
	bomiLogger(err)
});



// Login to Discord with your client's token
client.login(botConfig.token);

// interactionCreate event listenter for the buttons:
client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
	let leaving = false

	let giveawayID
	if (interaction.customId.includes("-leave")) {
		// leave giveaway. Get the giveaway id from the customId:
		giveawayId = interaction.customId.split("-")[0]
		leaving = true
	}

	giveawayID = parseInt(interaction.customId)

	let dbGiveaway = await giveaways.findOne({ where: { id: giveawayID } });

	if (!dbGiveaway) interaction.reply({ content: "This giveaway doesn't exist anymore, sorry...", ephemeral: true })

	if (dbGiveaway.ended == true) return interaction.reply({ content: "This giveaway has already ended...", ephemeral: true })

	let dbGiveawayParticipant = await giveawayParticipants.findOne({ where: { giveawayID: giveawayID, userID: interaction.user.id } });

	if (!leaving) {
		if (dbGiveawayParticipant) return interaction.reply({ content: "You have already entered this giveaway. >_< ", ephemeral: true })

		dbGiveawayParticipant = await giveawayParticipants.create({
			giveawayID: giveawayID,
			userID: interaction.user.id,
			won: false
		})

		console.log(`User ${interaction.user.username} entered giveaway ${giveawayID}`)
		interaction.reply({ content: "T-thanks you too...", ephemeral: true })

	} else {
		if (!dbGiveawayParticipant) return interaction.reply({ content: "You have not entered this giveaway. >_< ", ephemeral: true })

		dbGiveawayParticipant.destroy()

		console.log(`User ${interaction.user.username} left giveaway ${giveawayID}`)
		interaction.reply({ content: "I hope you'll join the next one!", ephemeral: true })
	}



});

endChecker()
async function endChecker() {

	while (true) {
		await bUtils.sleep(10000)
		let dbGiveaways = await giveaways.findAll({ where: { ended: false } });

		for (let i = 0; i < dbGiveaways.length; i++) {
			try {
				thisGiveaway = dbGiveaways[i]

				const now = new Date();

				if (thisGiveaway.endTime < now) {
					console.log(`Giveaway ${thisGiveaway.id} has ended!`)
					thisGiveaway.ended = true
					await thisGiveaway.save()
					// time is up!!!
					let gwChannel = await client.channels.cache.get(thisGiveaway.channelID)
					if (!gwChannel) gwChannel = await client.channels.cache.get(thisGiveaway.channelID)
					if (!gwChannel) {
						console.log(`Channel ${thisGiveaway.channelID} not found, skipping...`)
						continue

					}
					// get all participants
					let dbGiveawayParticipants = await giveawayParticipants.findAll({ where: { giveawayID: thisGiveaway.id } });

					if (dbGiveawayParticipants.length == 0) {
						// no participants, send message and end giveaway
						console.log(`No participants in giveaway ${thisGiveaway.id}`)
						thisGiveaway.ended = true
						await thisGiveaway.save()
						gwChannel.send("No one entered the giveaway, so it has been ended.")
						return
					}

					// get random winner for the number of particioants

					let winnerString = ""

					for (let i = 0; i < thisGiveaway.winners; i++) {

						if (dbGiveawayParticipants.length < (i + 1)) break

						let winner = dbGiveawayParticipants[Math.floor(Math.random() * dbGiveawayParticipants.length)]
						let winnerUser = await client.users.fetch(winner.userID)

						// send dm to winner
						// winnerUser.send({ content: `You have won the giveaway for ${thisGiveaway.prize}!` })
						winnerString += `<@${winner.userID}> has won ${thisGiveaway.prize}\n`

						// update db
						winner.won = true
						await winner.save()
					}
					if (winnerString == "") winnerString = "No one won the giveaway, sorry"

					gwChannel.send(await bUtils.embedify(`Uhm excuse me...`, `Uh... \n\n ${winnerString}... >_<`))


					console.log("Giveaway message:")
					console.log(thisGiveaway.messageID)

					let messageFail = false
					let oldGwMessage = await gwChannel.messages.fetch(thisGiveaway.messageID).catch(() => { messageFail = true })
					if (!oldGwMessage) messageFail = true

					if (messageFail) {
						// DM the creator
						await bUtils.DM(thisGiveaway.creator, `Configuration problem: I do not have access to the message of my giveaway, you possible deleted it. **I have deleted your giveaway and will not be updating it further.**`)
						console.log("DMed message failer: " + thisGiveaway.creator)
						await thisGiveaway.destroy()
						continue
					}

					const giveawayMessage = {
						content: `S-sorry, but the giveaway for ${thisGiveaway.prize} has ended...`,
						embeds: [
							{
								title: `Ended.. Sorry... but it was ${thisGiveaway.prize}... `,
								description: `This giveaway has ended...!\nHosted by: <@${thisGiveaway.creator}>`,
								color: 16770560,
								footer: {
									text: `Ended at: ${new Date().toLocaleString()}`
								}
							}]

					}


					await oldGwMessage.edit(giveawayMessage).catch(err => console.log(err))
					console.log("Giveaway end successful!")
				} else {
					// time not up yet
					//add a message to the giveaway message to show how much time is left

					let channelFail = false
					let gwChannel = await client.channels.fetch(thisGiveaway.channelID).catch(() => { channelFail = true })

					// Handle user fails
					if (!gwChannel) channelFail = true
					if (channelFail) {
						// DM the creator
						await bUtils.DM(thisGiveaway.creator, `Configuration problem: I do not have access to the channel where you started my giveaway. **I have deleted your giveaway and will not be updating it further.**`)
						console.log("DMed channel failer: " + thisGiveaway.creator)
						await thisGiveaway.destroy()
						continue
					}
					if (!gwChannel.messages) {
						gwChannel.send(`Configuration problem: I don't have access to messages in this channel.`)
						continue
					}

					let oldGwMessage = await gwChannel.messages.fetch(thisGiveaway.messageID)

					let newGiveawayMessage = await bUtils.constructGwMessage(thisGiveaway)

					await oldGwMessage.edit(newGiveawayMessage).catch(err => console.log(err))




				}

			} catch(error) {
				console.log(error)
				bomiLogger(error)

			 }
		} // end gw loop
	}
}

async function bomiLogger(err) {

	let errorTitle = err.toString()
	let errorStack = err.stack || "No stack trace avalible"

	// Prepare logging file:
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = mm + '_' + dd + '_' + yyyy + "_log_errors.txt"
	today = "logs/" + today
	fs.appendFileSync(today, `${errorTitle} \n ${errorStack}\n\n\n`)
}



ExitIfRamUsageHigh()
async function ExitIfRamUsageHigh() {
	while (true) {
		await bUtils.sleep(30000)
		let ramUsed = process.memoryUsage()
		let ramUsed_rss = Math.round((ramUsed.rss / 1024) / 1024)
		if (ramUsed_rss > botConfig.maxRamUsage) process.exit()
	}

}