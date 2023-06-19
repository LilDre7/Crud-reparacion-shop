const AppError = require("../utils/appError");

// ¿Que hace este logger? 🚨
// Bueno este logger con la libreria de winston nos damos un ayudita para saber con las config que yo haya creado mi funcion el error en un archivo especifico asi podemos saber en cualquir momento de cualquier error que se haya creado o pues ejuecuatdo
const logger = require("../utils/logger");

// Esta function es creada para los errores de expiracion del JWT y su expiracion
const handleJWTExpiredError = () =>
  new AppError("Token expired, please login again", 401);

// Esta funtion es para validar si el token tiene una mala formacion: example: Se borro un caracter o es un token mal creado
const handleJTWError = () =>
  new AppError("Invalid token, please login again", 401);

const sendErrorDev = (err, res) => {
  logger.info(err);
  // Y esto errores son para el desarrollo
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  logger.info(err);
  // Este quiere decir que el error es de tipo Operational osea del usuario o ya sea del back-end
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // *** Y esta es la que se encarga de mostrar el error es del desarrollo *** //
  else {
    res.status(500).json({
      status: "fail",
      message: "Something went very wrong 🚑 ",
    });
  }
};
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode || 500;
  err.status || "fail";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === "production") {
    let error = err;

    if (error.name === "CastError") error = handleCastErrorDB();

    if (error.name === "TokenExpiredError")
      error = handleJWTExpiredError();

    if (error.name === "JsonWebTokenError")
      error = handleJTWError();

    sendErrorProd(error, res);
  }

  next();
};

module.exports = globalErrorHandler;
