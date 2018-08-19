const Sequelize = require('sequelize');
const config = require('./config');

let sequelize = new Sequelize(config.database, config.login, config.password, {
    host: config.host,
    dialect: 'postgres',
    port: config.port,

    pool: {
        max: config.maxConnections,
        min: 0,
        idle: 10000
    }
});

/*sequelize.sync({
    force: true
})*/

module.exports = sequelize;


// Un résultat de commande SQL non trouvé = []
//J'utilise rows.length mais ptet ya mieu
//