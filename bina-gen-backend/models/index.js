const { Sequelize, DataTypes } = require('sequelize');

const db = {};

db.user = require('./user.model')(Sequelize, DataTypes);

module.exports = db;