// **** Aqui van las rutas de mis usuarios *** //
const express = require("express");

// Importando Route como funcion //
const router = express.Router();

// Importando los middlewares para validaciones
const repairmenExists = require("../middlewares/validations.repairmen.middleware");

// Importando los middlewares de validacion de los modelos
const validModelRepair = require("../middlewares/validationModel.repairmen.middleware");

// Importando el middleware de validacion de id
const auth = require("../middlewares/auth.middleware");

// Importando el controlador de mis usuarios //
const repairmenController = require("../controllers/repairmen.controller");

// == Estas son las rutas son 👉🏾 / 👈🏾  => Esta route pueda usarla el cliente //
router
  .route("/")
  .post(
    repairmenExists.repairExist,
    validModelRepair.validationModelRepair,
    repairmenController.createRepair
  );

// !! Lo que hacemos aqui con esta use es proteger las rutas para que solo los employee = empleados puedan usarla y este restringido el uso para los clientes
router.use(auth.protect, auth.restricTo("employee"));

// == Estas son las rutas son 👉🏾 /:id 👈🏾 esta route solo para el empleado  //
router
  .route("/:id")
  .get(repairmenController.findOneRepair)
  .patch(repairmenController.updateRepair)
  .delete(repairmenController.disableRepair);

// == Estas son las rutas son 👉🏾 / 👈🏾 esta route solo para el empleado //
router // 🥷🏾
  .route("/")
  .get(repairmenController.findAllRepair)
  .post(
    repairmenExists.repairExist,
    validModelRepair.validationModelRepair,
    repairmenController.createRepair
  );

module.exports = router;
