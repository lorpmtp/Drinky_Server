const sequelize = require('./../database.js');

let User = module.exports = sequelize.define('users', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    mail: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    timeDecay: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: "0"
    },
    gameId: {
        type: Sequelize.INTEGER,
    }
}) // Model tableName will be the same as the model name
