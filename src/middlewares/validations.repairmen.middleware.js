const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const REPAIR = require("../models/repairmen.model");

const repairExist = catchAsync(async (req, res, next) => {
  // Validar que un servicio pendiente (status pending) exista, en caso de que no, enviar mensaje de error
  const { status } = req.body;

  const repair = await REPAIR.findOne({
    where: {
      status: "pending",
    },
  });

  if (!repair)
    next(new AppError("No hay servicios pendientes 🦊 ", 400));

  req.repair = repair;

  res.status(200).json({
    status: "success",
    message:
      "El usuario pendiente si existe en nuestra base de datos 🐲",
  });

  next();
});

module.exports = { repairExist };
