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
    // !! Profe lo puse tipo NUMBER , Porque no me funciono el tipo date DATE
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
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
