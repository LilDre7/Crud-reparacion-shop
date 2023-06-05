const { DataTypes } = require("sequelize");
const { db } = require("./../db/config");

const REPAIR = db.define("repairs", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "cancelled"),
    allowNull: false,
    defaultValue: "pending",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = REPAIR;
