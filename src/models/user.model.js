const { DataTypes } = require("sequelize");
const { db } = require("../db/config");

const User = db.define("user", {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Habilitar si deseas contraseñas únicas por usuario
  },
  role: {
    // enum: permite definir un conjunto de valores predefinidos
    type: DataTypes.ENUM("client", "employee"),
    allowNull: false,
    defaultValue: "client",
  },
  status: {
    type: DataTypes.ENUM("available", "disabled"),
    allowNull: false,
    defaultValue: "available",
  },
});

module.exports = User;
