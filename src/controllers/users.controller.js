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
    data: {
      repair,
    },
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
  if (!user)
    next(new AppError(`Usuario con ${id} no funciona! 🐣`));

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

  if (!user)
    next(new AppError(`Usuario con ${id} no funciona! 🦄`));

  await user.update({ status: "disabled" });

  return res.status(200).json({
    status: "success",
    message: "La cuenta de usuario ha sido deshabilitada! 🐌",
  });
});

// !! Estas son las rutas son 👉🏾 / 👈🏾  //

// == GET ALL USER == //
exports.findAllUser = catchAsync(async (req, res) => {
  const user = await User.findAll({
    where: { status: "available" },
    attributes: {
      exclude: ["status", "password"],
    },
  });

  res.status(200).json({
    ok: true,
    message: "Aqui todos los usuarios  🧑🏾‍🎤",
    result: user.length,
    data: {
      user,
    },
  });
});

// == CREATE ONE USER == //
exports.createUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // Crear un usuario con contraseña encriptada
  const { name, email, password, role } = req.body;

  // Validar si el usuario con ese email ya existe
  const userExist = await User.findOne({
    where: {
      email: email,
    },
  });

  if (userExist)
    return next(
      new AppError(
        `El email: ${email} ya existe en nuestra base 🥷🏾`
      ),
      400
    );

  // Encriptar la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear el usuario y enviarlo encriptado

  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    role,
  });

  // Genarar token de autenticacion
  const token = await generatejwt(user.id);

  // Enviar la información del usuario
  res.status(201).json({
    ok: true,
    message: "Usuario creado 🐌",
    token,
    data: {
      user,
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
      email: email,
      status: "available",
    },
  });

  // Este if verifica si exite el email o si esta available de lo contrario dara un error
  if (user === null || user.status === "disabled")
    next(
      new AppError(
        `El usuario con este email: ${email} no existe o es disabled 🚑`
      )
    );

  // Validar si la contraseña es correcta
  // De esta forma evaluamos que la contraseña sea correcta, esto se hace con validaciones de bcrypt
  if (!(await bcrypt.compare(password, user.password))) {
    return next(
      new AppError(`La contraseña no es correcta 🦊`, 401)
    );
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
      email: user.email.toLowerCase(),
      role: user.role,
    },
  });
});

// == UPDATE PASSWORD == //
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { user } = req;

  const { currentPassword, newPassword } = req.body;

  if (!(await bcrypt.compare(currentPassword, user.password)))
    return next(
      new AppError(
        `La contraseña actual no es correcta  🚑`,
        401
      )
    );

  const salt = await bcrypt.genSalt(10);
  const encrytedPassword = await bcrypt.hash(newPassword, salt);

  await user.update({
    password: encrytedPassword,
    passwordChangedAt: new Date(),
  });

  res.status(200).json({
    status: "success",
    message:
      "La contraseña ha sido actualizada correctamente  🧑🏾‍🎤",
  });
});

// exports.renew = catchAsync(async (req, res, next) => {});
