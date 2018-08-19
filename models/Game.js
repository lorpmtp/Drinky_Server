const sequelize = require('./../database.js');

let Game = module.exports = sequelize.define('games', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    drinks: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        allowNull: false // DrinkObject
    }
})