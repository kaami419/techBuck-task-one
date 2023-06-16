const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./index");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    underscored: true,
  }
);

// await Order.sync();


// console.log(Order === sequelize.models.Order);

module.exports = Order;
