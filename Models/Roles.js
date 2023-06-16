const {DataTypes} = require("sequelize")
const sequelize = require("./index")

const Role = sequelize.define(
    "Role",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            // defaultValue: null
          },
        role_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        tableName: "roles",
        underscored: true,
      }
)

// await Role.sync();


module.exports = Role;
