const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('krishi_db', 'root', 'Koushik#2005', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;