const colors = require("colors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// ** Utilities ** //
const AppError = require("./utils/appError");

// ** Ejecutando express ** //
const app = express();

// ** Middlewares ** //
app.use(express.json());

// Cors es para que el servidor pueda comunicarse con el front
app.use(cors());

// Morgan no va a ayudar a ver las respuesta de nuestras peticones en consola
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ** Middlewares para el manejo de errores globales ** //
const globalErrorHandler = require("./controllers/error.controller");

//** Routes **//
const usersRoutes = require("./routes/users.routes");

const repairsRoutes = require("./routes/repairmen.routes");

// Peticion para los usuarios
app.use("/api/v1/users", usersRoutes);

// Peticion para las reparaciones
app.use("/api/v1/repairs", repairsRoutes);

// Errores de rutas globales
app.use("*", (req, res, next) => {
  return next(
    new AppError(
      `La ruta es incorrecta o no valida ${req.originalUrl} 🚑 `,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
