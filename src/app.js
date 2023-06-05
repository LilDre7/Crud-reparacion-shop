const colors = require("colors");
const express = require("express");

// ** Ejecutando express ** //
const app = express();

// ** Middlewares ** //
app.use(express.json());

//** Routes **//
const usersRoutes = require("./routes/users.routes");

const repairsRoutes = require("./routes/repairmen.routes");

// Peticion para los usuarios
app.use("/api/v1/users", usersRoutes);

// Peticion para las reparaciones
app.use("/api/v1/repairs", repairsRoutes);

module.exports = app;
