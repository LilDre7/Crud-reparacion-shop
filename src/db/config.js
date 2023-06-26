// TODO: Configurar la conexión con la base de datos

const { Sequelize } = require("sequelize");
const db = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "root",
  database: "repairmotors",
  port: 5432,
  logging: false,
});

module.exports = { db };
