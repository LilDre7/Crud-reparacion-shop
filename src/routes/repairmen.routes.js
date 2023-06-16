// **** Aqui van las rutas de mis usuarios *** //
const express = require("express");

// Importando Route como funcion //
const router = express.Router();

// Importando los middlewares para validaciones
const repairmenExists = require("../middlewares/validations.repairmen.middleware");

// Importando los middlewares de validacion de los modelos
const validModelRepair = require("../middlewares/validationModel.repairmen.middleware");

// Importando el controlador de mis usuarios //
const repairmenController = require("../controllers/repairmen.controllers");

// == Estas son las rutas son 👉🏾 /:id 👈🏾  //
router
  .route("/:id")
  .get(repairmenController.findOneRepair)
  .patch(repairmenController.updateRepair)
  .delete(repairmenController.disableRepair);

// == Estas son las rutas son 👉🏾 / 👈🏾  //
router
  .route("/")
  .get(repairmenController.findAllRepair)
  .post(
    validModelRepair.validationModelRepair,
    repairmenExists.repairExist,
    repairmenController.createRepair
  );

module.exports = router;
