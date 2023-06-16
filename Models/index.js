const { log } = require('async');
const {Sequelize}= require('sequelize');

const sequelize = new Sequelize('test_task','root', 'Password_123', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: console.log,
});

try {
    sequelize.authenticate(); //checks if data given in host and dialect is authenticated or not
    console.log("Connection created successfully");
} catch (error) {
    console.log("Unable to connect to DB", error);
    console.log('error stack =====>>>', error.stack);
}

// sequelize.sync({force: true})
module.exports = sequelize