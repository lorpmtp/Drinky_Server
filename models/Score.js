const sequelize = require('./../database.js');

let Score = sequelize.define('scores', {
    drinkId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pushTime: {
        type: Sequelize.BIGINT,
        defaultValue: null
    }
})

Score.belongsTo(User, {
    foreignKey: 'fk_userId'
})


Score.belongsTo(Game, {
    foreignKey: 'fk_gameId'
})

module.exports = Score;