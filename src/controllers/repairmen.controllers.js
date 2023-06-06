const express = require("express");

// Importar el modelo de usuario si es necesario
const REPAIR = require("../models/repairmen.model");

//TODO: Estas son las rutas son 👉🏾 /:id 👈🏾  //

// == OBTENER UNA MOTO // findOneRepair == //
exports.findOneRepair = async (req, res) => {
  try {
    const { id } = req.params;

    const repair = await REPAIR.findOne({
      where: {
        id,
      },
    });

    if (!repair)
      return res.json({
        status: "error",
        message: "No se encontro la moto, este no es tu taller 🙈 ",
      });

    return res.json({
      status: "success",
      message: "Reparacion fue encontrada 🚨⛽",
      repair,
    });
  } catch (error) {
    return res.status(500).json({
      status: error,
      message: "Error al obtener la moto",
    });
  }
};

// == ACTUALIZAR EL ESTADO ==  // updateRepair == //
exports.updateRepair = async (req, res) => {
  try {
    const { id } = req.params;

    const repair = await REPAIR.findOne({
      where: {
        status: "pending",
        id,
      },
    });

    if (!repair) {
      return res.status(404).json({
        status: "fail",
        message: `La reparacion con ${id} no se encuentra o ya esta completa! 👻`,
      });
    }

    await repair.update({ status: "completed" });

    return res.status(200).json({
      status: "success",
      message: "Tu monto esta lista vaya monte! 🐌",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar la moto ☠️ ",
    });
  }
};

// == CANCELAR LA REPARACION ==  // disableRepair == //
exports.disableRepair = async (req, res) => {
  try {
    const { id } = req.params;

    const repair = await REPAIR.findOne({
      where: {
        id,
      },
    });

    if (!repair)
      return res.json({
        status: "error",
        message: "No se encontró la moto para reparar 🚨",
      });

    if (repair.status === "completed")
      return res.json({
        status: "error",
        message:
          "No se puede cancelar una reparación ya completada 🧞‍♂️👁️",
      });

    await repair.update({ status: "cancelled" });

    return res.json({
      status: "success",
      message: " 🥶 Reparación cancelada exitosamente 🤬 ",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la moto ☠️",
    });
  }
};

//TODO: Estas son las rutas son 👉🏾 / 👈🏾  //

// == OBTENER LA LISTA DE MOTOS // findAllRepair  == //
exports.findAllRepair = async (req, res) => {
  const repairs = await REPAIR.findAll({
    where: {
      status: "pending", // pending, completed, cancelled
    },
  });

  return res.status(200).json({
    message: "Aqui todas los reparaciones  🙈",
    results: repairs.length,
    status: "success",
    ok: true,
    repairs,
  });
};

// == CREAR UNA CITA // createRepair  == //
exports.createRepair = async (req, res) => {
  try {
    const { date, userId } = req.body;

    const repair = await REPAIR.create({
      date,
      userId,
    });

    res.status(201).json({
      ok: true,
      message: "⛽ Reparación creada correctamente 🎈",
      repair,
    });
  } catch (error) {
    return res.status(500).json({
      status: error,
      message: "Error al crear una reparación ☠️🍡",
    });
  }
};
