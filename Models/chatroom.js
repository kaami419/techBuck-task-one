// models/chatroom.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Chatroom = sequelize.define('Chatroom', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'chatrooms',
  underscored: true,
});

Chatroom.sync();


module.exports = {
  Chatroom
};
