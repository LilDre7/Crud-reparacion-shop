// **** Aqui van las rutas de mis usuarios *** //
const express = require("express");

// Importando Route como funcion //
const router = express.Router();

// Importando el controlador de mis usuarios //
importante: userController = require("../controllers/users.controllers");

// == Estas son las rutas son 👉🏾 /:id 👈🏾  //
router
  .route("/:id")
  .get(userController.findOneUser)
  .patch(userController.updateUser)
  .delete(userController.disableUser);

// == Estas son las rutas son 👉🏾 / 👈🏾  //
router
  .route("/")
  .get(userController.findAllUser)
  .post(userController.createUser);

module.exports = router;
