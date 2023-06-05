// **** Aqui van las rutas de mis usuarios *** //
const express = require("express");

// Importando Route como funcion //
const router = express.Router();

// Importando el controlador de mis usuarios //
importante: repairmenController = require("../controllers/repairmen.controllers");

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
  .post(repairmenController.createRepair);

module.exports = router;
