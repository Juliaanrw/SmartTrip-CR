const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Itinerario = require("../models/Itinerario");

// GET /api/itinerarios
// Obtener todos los itinerarios
router.get("/", async (req, res) => {
  try {
    const itinerarios = await Itinerario.find()
      .populate("creador_id", "correo rol estado")
      .sort({ fecha_inicio: 1 });

    res.status(200).json({
      cantidad: itinerarios.length,
      itinerarios
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los itinerarios",
      error: error.message
    });
  }
});

// GET /api/itinerarios/:id
// Obtener un itinerario por ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del itinerario no es válido"
      });
    }

    const itinerario = await Itinerario.findById(req.params.id)
      .populate("creador_id", "correo rol estado");

    if (!itinerario) {
      return res.status(404).json({
        mensaje: "Itinerario no encontrado"
      });
    }

    res.status(200).json(itinerario);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el itinerario",
      error: error.message
    });
  }
});

// POST /api/itinerarios
// Crear un itinerario
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.creador_id ||
      !mongoose.Types.ObjectId.isValid(req.body.creador_id)
    ) {
      return res.status(400).json({
        mensaje: "El creador_id es obligatorio y debe ser válido"
      });
    }

    const nuevoItinerario = new Itinerario(req.body);
    const itinerarioGuardado = await nuevoItinerario.save();

    res.status(201).json({
      mensaje: "Itinerario creado correctamente",
      itinerario: itinerarioGuardado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear el itinerario",
      error: error.message
    });
  }
});

// PUT /api/itinerarios/:id
// Actualizar un itinerario
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del itinerario no es válido"
      });
    }

    if (
      req.body.creador_id &&
      !mongoose.Types.ObjectId.isValid(req.body.creador_id)
    ) {
      return res.status(400).json({
        mensaje: "El creador_id proporcionado no es válido"
      });
    }

    const itinerarioActualizado = await Itinerario.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("creador_id", "correo rol estado");

    if (!itinerarioActualizado) {
      return res.status(404).json({
        mensaje: "Itinerario no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Itinerario actualizado correctamente",
      itinerario: itinerarioActualizado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar el itinerario",
      error: error.message
    });
  }
});

// DELETE /api/itinerarios/:id
// Eliminar un itinerario
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del itinerario no es válido"
      });
    }

    const itinerarioEliminado = await Itinerario.findByIdAndDelete(
      req.params.id
    );

    if (!itinerarioEliminado) {
      return res.status(404).json({
        mensaje: "Itinerario no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Itinerario eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar el itinerario",
      error: error.message
    });
  }
});

module.exports = router;
