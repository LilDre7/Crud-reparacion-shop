const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Validar que el usuario existe dado un ID, en caso de que no, enviar mensaje de error
const userExist = catchAsync(async (req, res, next) => {
  // Aqui lo que hacemos es encontrar al id que vamos a rerificar si existe
  // y si existe lo guardamos en una variable
  // Si no existe, enviamos un mensaje de error
  const { id } = req.params;
  const user = await User.findOne({
    where: {
      id,
    },
  });

  // Este if para para verificar el user fue encontrado con el where
  if (!user) {
    return next(new AppError("El usuario no existe 🚨", 404));
  }

  req.user = user;

  // IMPORTANTE EL NEXT()
  next();
});

module.exports = { userExist };
