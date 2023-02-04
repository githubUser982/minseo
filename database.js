const { Sequelize } = require('sequelize');

// Note that big S Sequelize is the library, small s sequelize is the object of your databases
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});


giveaways = sequelize.define('giveaways', {
   creator: Sequelize.STRING,
   prize: Sequelize.STRING,
   winners: Sequelize.INTEGER,
   channelID: Sequelize.STRING,
   messageID: Sequelize.STRING,
   ended: Sequelize.BOOLEAN,
   endTime: Sequelize.INTEGER,
   pingRole: Sequelize.STRING,

});

giveawayParticipants = sequelize.define('giveawayParticipants', {
   userID: Sequelize.STRING,
   giveawayID: Sequelize.STRING,
   won: Sequelize.BOOLEAN,
});







module.exports = sequelize

console.log("Database Loaded!")