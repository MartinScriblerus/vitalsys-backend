// This file uses sequelize ORM, the database config, and the
// user's local  
const Sequelize = require('sequelize')
const config = require('./config')
const {db, username, password, host} = config

const sequelize = new Sequelize(
    db,
    username,
    password,
    {
        host,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        },
        logging: false
    }
)

module.exports = sequelize