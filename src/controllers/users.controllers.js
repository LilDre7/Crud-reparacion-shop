// Importar el modelo de usuario si es necesario
const User = require("../models/user.model");

// ! Estas son las rutas son 👉🏾 /:id 👈🏾  //

// == OBTENER UN USARIO == //
exports.findOneUser = async (req, res) => {
  try {
    const { id } = req.params;

    const repair = await User.findOne({
      where: {
        status: "available",
        id,
      },
    });

    if (!repair)
      return res.json({
        status: "error",
        message: "No se encontro el usuario buscado 🎈",
      });

    return res.json({
      status: "success",
      message: "Usuario fue encontrada 😻",
    });
  } catch (error) {
    return res.json({
      status: error,
      message: "Error al obtener el usuario  🦉 ",
    });
  }
};

// == ACTUALIZAR USUARIO == //
exports.updateUser = async (req, res) => {
  try {
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
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `Usuario con ${id} no funciona! 🐣`,
      });
    }

    // Actualizar el usuario con la información proporcionada
    const updatedUser = await user.update({ name, email });

    // Enviar la confirmación de éxito al cliente
    res.status(200).json({
      status: "success",
      message: "The user has been updated 🥷🏾 ",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Algo salió muy mal! 👁️ ",
    });
  }
};

// == ACTUALIZAR EL ESTADO == //
exports.disableUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: `Usuario con ${id} no funciona! 🦄`,
      });
    }

    await user.update({ status: "available" });

    return res.status(200).json({
      status: "success",
      message: "La cuenta de usuario ha sido deshabilitada! 🐌",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Hubo un error en la base de datos! ⚗️",
    });
  }
};

// !! Estas son las rutas son 👉🏾 / 👈🏾  //

// == GET ALL USER == //
exports.findAllUser = (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Aqui todos los usuarios  ㋡",
  });
};

// == CREATE ONE USER == //
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Aqui verifico si esta disponible el email
    const emailNotAvailable = await User.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (emailNotAvailable) {
      return res.status(400).json({
        status: "fail",
        message:
          " ⛽ El usuario ya existe en la base de datos no puede ser usado. 🏁 ",
      });
    }

    // Si el email esta disponible, se crea el usuario
    const user = await User.create({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      password: password.toLowerCase(),
      role: role.toLowerCase(),
    });

    res.status(201).json({
      ok: true,
      message: "Usuario creado 🐌",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Error al crear usuario 👁️",
      error,
    });
  }
};
