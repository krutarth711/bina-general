const config = require('../config/db.config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, 
    {
        host: config.HOST,
        dialect: config.dialect,
        logging: false
    }
);

/**
 * Handle Connection
 */
const checkConnection = async() => {
    try {
        console.log('DB:', config.DB);
        await sequelize.authenticate();
        console.log("Connected to database successfully.!");
    } catch (error) {
        console.log('Unable to connect to the database:', error);
        throw new Error(error);
    }
};

checkConnection();


const db = {};

db.Sequelize = Sequelize;
db.customSequelize = sequelize;

db.users = require('../models/user.model')(sequelize, Sequelize);

/**
 * Reference and Relationship
 */
// db.users.hasMany(db.contacts);
// db.contacts.belongsTo(db.users)

module.exports = db;