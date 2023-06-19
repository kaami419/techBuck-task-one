// models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Message = sequelize.define('Message', {
  message_info: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  chatroom_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'messages'
});

Message.sync();


module.exports = {
  Message
};


