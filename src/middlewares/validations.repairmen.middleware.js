const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const REPAIR = require("../models/repairmen.model");
const User = require("../models/user.model");

exports.repairExist = catchAsync(async (req, res, next) => {
  // Validar que un servicio pendiente (status pending) exista, en caso de que no, enviar mensaje de error
  const { id } = req.params;

  const repair = await REPAIR.findOne({
    where: {
      id,
      status: "pending",
    },
    include: [
      {
        model: User,
        attributes: ["id", "name", "email", "role"],
      },
    ],
  });

  if (!repair) {
    const completedRepair = await REPAIR.findOne({
      where: {
        id,
        status: "completed",
      },
    });

    if (completedRepair) {
      return res.status(404).json({
        status: "error",
        message: `la reparación con id:${id} ya fue completada`,
      });
    }

    return next(
      new AppError(`La repacion con el id:${id} no existe`, 404)
    );
  }

  req.user = repair.user;
  req.repair = repair;
  next();
});
