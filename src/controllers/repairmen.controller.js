// Importar el modelo de usuario si es necesario
const REPAIR = require("../models/repairmen.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/user.model");

//TODO: Estas son las rutas son 👉🏾 /:id 👈🏾  //

// == OBTENER UNA MOTO // findOneRepair == //
exports.findOneRepair = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await REPAIR.findOne({
    where: {
      id,
    },
  });

  if (!repair)
    next(
      new AppError(
        "No se encontro la moto, este no es tu taller 🚑 "
      )
    );

  return res.json({
    status: "success",
    message: "Reparacion fue encontrada 🚨⛽",
    repair,
  });
});

// == ACTUALIZAR EL ESTADO ==  // updateRepair == //
exports.updateRepair = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await REPAIR.findOne({
    where: {
      status: "pending",
      id,
    },
  });

  if (!repair)
    next(
      new AppError(
        `La reparacion con ${id} no se encuentra o ya esta completa! 👻`
      )
    );

  await repair.update({ status: "completed" });

  return res.status(200).json({
    status: "success",
    message: "Tu monto esta lista vaya monte! 🐌",
  });
});

// == CANCELAR LA REPARACION ==  // disableRepair == //
exports.disableRepair = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await REPAIR.findOne({
    where: {
      // Hacer busqueda pero decide hacerlo de la otra forma
      // status: "pending",
      id,
    },
  });

  if (!repair)
    next(new AppError("No se encontró la moto para reparar 🚨"));

  if (repair.status === "completed")
    next(
      new AppError(
        "No se puede cancelar una reparación ya completada 🧞‍♂️👁️"
      )
    );

  if (repair.status == "cancelled")
    next(new AppError("La reparación ya fue cancelada 🚑"));

  await repair.update({ status: "cancelled" });

  return res.json({
    status: "success",
    message: " 🥶 Reparación cancelada exitosamente 🤬 ",
  });
});

//TODO: Estas son las rutas son 👉🏾 / 👈🏾  //

// == OBTENER LA LISTA DE MOTOS // findAllRepair  == //
exports.findAllRepair = async (req, res) => {
  const { id } = req.params;

  const repairs = await REPAIR.findAll({
    where: { status: ["pending", "completed"] },
    attributes: {
      exclude: ["status"],
    },
    // include: [
    //   {
    //     model: User,
    //   },
    // ],
  });

  return res.status(200).json({
    results: repairs.length,
    status: "success",
    message: "Aqui todas los reparaciones  🐲",
    data: {
      repairs,
    },
  });
};

// == CREAR UNA CITA // createRepair  == //
exports.createRepair = catchAsync(async (req, res, next) => {
  const { date, motorsNumber, description } = req.body;
  const { id } = req.sessionUser;

  const repair = await REPAIR.create({
    date,
    motorsNumber: motorsNumber,
    description,
    userId: id,
  });

  res.status(201).json({
    message: "Motorcycle repair created successfully",
    repair,
  });
});
