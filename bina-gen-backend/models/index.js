const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/db.config');

const db = {};

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, config);

db.user = require('./user.model')(sequelize, DataTypes);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;