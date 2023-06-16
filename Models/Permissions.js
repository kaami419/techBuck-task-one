const {DataTypes} = require("sequelize");
const sequelize = require("./index")

const Permission = sequelize.define(
    "Permission",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        isSeller: {
            type: DataTypes.BOOLEAN,
            allowNull: false,

        },
        isBuyer: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: "permissions",
        underscored: true,
      }
)

module.exports = Permission