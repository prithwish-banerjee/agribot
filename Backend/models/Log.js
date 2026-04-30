const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Log = sequelize.define('Log', {
    crop: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expense: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    profit: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    irrigationDate: {
        type: DataTypes.DATE
    },
    sprayDate: {
        type: DataTypes.DATE
    },
    notes: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Log;