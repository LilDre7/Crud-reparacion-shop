// **** Aqui van las rutas de mis usuarios *** //
const express = require("express");

// Importando Route como funcion //
const router = express.Router();

// Importando los middlewares de los modelos de validacion
const validUserModel = require("../middlewares/validationModel.users.middleware");

// Importando los middlewares para validaciones
const userExists = require("../middlewares/validations.users.middleware");
// const authMiddleware = require("../middlewares/auth.middleware");

// Importando el controlador de mis usuarios //
const userController = require("../controllers/users.controller");

// Importando el auth de los usuarios
const auth = require("../middlewares/auth.middleware");

// == Estas son las rutas son 👉🏾 /create 👈🏾  //
router
  .route("/create")
  .post(
    validUserModel.validationModelUser,
    userController.createUser
  );
// == Estas son las rutas son 👉🏾 /  👈🏾  //
router.route("/").get(userController.findAllUser);

// == Estas son las rutas son 👉🏾 /:id 👈🏾  //
router
  .route("/:id")
  .get(userController.findOneUser)
  .patch(
    auth.protectAccountOwner,
    userExists.userExist,
    userController.updateUser
  )
  .delete(
    userExists.userExist,
    auth.protectAccountOwner,
    userController.disableUser
  );

router.route("/login").post(userController.login);

// ¿ Porque aqui colocamos el middlewares?
// Lo colocamos porque debemos saber si el usuario, despues de esta validacion se actualiza o no
// router.route("/renew").get(userController.renew);

router
  .route("/password/:id")
  .patch(
    userExists.userExist,
    validUserModel.validationModelUpdateUser,
    userController.updatePassword
  );

module.exports = router;
