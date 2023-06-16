// Importar el modelo de usuario si es necesario
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const generatejwt = require("../utils/jwt");

// ! Estas son las rutas son 👉🏾 /:id 👈🏾  //

// == OBTENER UN USARIO == //
exports.findOneUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await User.findOne({
    where: {
      status: "available",
      id,
    },
  });

  if (!repair)
    next(new AppError("No se encontro el usuario buscado 🎈"));

  return res.json({
    status: "success",
    message: "El usuario fue encontrado 😻",
  });
});

// == ACTUALIZAR USUARIO == //
exports.updateUser = catchAsync(async (req, res, next) => {
  // Obtener el ID del usuario que se va a actualizar
  const { id } = req.params;

  // Obtener la información que se va a actualizar del body
  const { name, email } = req.body;

  // Buscar el usuario que se va a actualizar
  const user = await User.findOne({
    where: {
      id,
      status: "available",
    },
  });

  // Validar si el usuario existe
  if (!user) next(new AppError(`Usuario con ${id} no funciona! 🐣`));

  // Actualizar el usuario con la información proporcionada
  const updatedUser = await user.update({ name, email });

  // Enviar la confirmación de éxito al cliente
  res.status(200).json({
    status: "success",
    message: "The user has been updated 🥷🏾 ",
    user: updatedUser,
  });
});

// == ACTUALIZAR EL ESTADO == //
exports.disableUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) next(new AppError(`Usuario con ${id} no funciona! 🦄`));

  await user.update({ status: "available" });

  return res.status(200).json({
    status: "success",
    message: "La cuenta de usuario ha sido deshabilitada! 🐌",
  });
});

// !! Estas son las rutas son 👉🏾 / 👈🏾  //

// == GET ALL USER == //
exports.findAllUser = (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Aqui todos los usuarios  ㋡",
  });
};

// == CREATE ONE USER == //
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Creacion para la encriptacion de contraseñas con bcrypt
  const salt = await bcrypt.genSalt(10);
  const encrytedPassword = await bcrypt.hash(password, salt);

  // Aqui verifico si esta disponible el email
  const emailNotAvailable = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (emailNotAvailable)
    next(
      new AppError(
        " ⛽ El usuario ya existe en la base de datos no puede ser usado. 🏁 "
      )
    );

  // Si el email esta disponible, se crea el usuario
  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encrytedPassword,
    role: role.toLowerCase(),
  });
  // Genero el token de autenticacion
  const token = await generatejwt(user.id);

  res.status(201).json({
    ok: true,
    message: "Usuario creado 🐌",
    token,
    user: {
      id: user.name,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// == LOGIN == //
exports.login = catchAsync(async (req, res, next) => {
  // Traernos del req.body => email / password
  const { email, password } = req.body;

  // Buscar el usuario en la base de datos y revisar si existen
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: "available",
    },
  });

  if (!user)
    next(new AppError(`El usuario con este ${email} no existe 🚑`));

  // Validar si la contraseña es correcta
  // De esta forma evaluamos que la contraseña sea correcta, esto se hace con validaciones de bcrypt
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError(`La contraseña no es correcta 🦊`, 401));
  }

  // Generar el token
  const token = await generatejwt(user.id);

  // Enviar la información del usuario
  res.status(200).json({
    status: "success",
    message: "Tu login fue exitoso 🐲",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {});

// exports.renew = catchAsync(async (req, res, next) => {});
