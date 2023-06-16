// **** Aqui van las rutas de mis usuarios *** //
const express = require("express");

// Importando Route como funcion //
const router = express.Router();

// Importando los middlewares de los modelos de validacion
const validUserModel = require("../middlewares/validationModel.users.middleware");

// Importando los middlewares para validaciones
const userExists = require("../middlewares/validations.users.middleware");

// Importando el controlador de mis usuarios //
const userController = require("../controllers/users.controllers");

// == Estas son las rutas son 👉🏾 /:id 👈🏾  //
router
  .route("/:id")
  .get(userController.findOneUser)
  .patch(userExists.userExist, userController.updateUser)
  .delete(userController.disableUser);

// == Estas son las rutas son 👉🏾 / 👈🏾  //
router
  .route("/")
  .get(userController.findAllUser)
  .post(
    validUserModel.validationModelUser,
    userController.createUser
  );

module.exports = router;
