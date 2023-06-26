const colors = require("colors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const sanitizer = require("perfect-express-sanitizer");

// ** Utilities ** //
const AppError = require("./utils/appError");

// ** Ejecutando express ** //
const app = express();

// ** Expres-rate-limit es para limitar las peticiones que se realizan a nuestra api ** //
const limiter = rateLimit({
  // Para el maximo de peticones
  max: 20,
  // Para saber el tiempo de cada peticion => Solo por ip se puede 3 peticones.
  windowMs: 60 * 60 * 1000,
  // Mensaje de error
  message:
    "Tienes muchas peticiones, intenta en una 1h o mas tarde 🚩 ",
});

// ** HPP es para proteger nuestra aplicacion contra el ataque de parametros maliciosos ** //
app.use(hpp());

// ** Helmet es para proteger nuestra aplicacion contra algunos ataques ** //
app.use(helmet());

// ** Sanitizer es para limpiar los datos que nos llegan de nuestras peticiones **
// app.use(
//   sanitizer.clean({
//     xss: true,
//     // noSql no es necesario porque no estamos usando ningun tipo de base de datos noSql
//     // noSql: true,
//     sql: true,
//   })
// );
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

app.use("/api/v1", limiter);

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
