const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Presupuesto = require("../models/Presupuesto");

// GET /api/presupuestos
// Obtener todos los presupuestos
router.get("/", async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find().populate(
      "itinerario_id",
      "nombre_viaje fecha_inicio dias_duracion"
    );

    res.status(200).json({
      cantidad: presupuestos.length,
      presupuestos
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los presupuestos",
      error: error.message
    });
  }
});

// GET /api/presupuestos/:id
// Obtener un presupuesto por ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del presupuesto no es válido"
      });
    }

    const presupuesto = await Presupuesto.findById(req.params.id).populate(
      "itinerario_id",
      "nombre_viaje fecha_inicio dias_duracion"
    );

    if (!presupuesto) {
      return res.status(404).json({
        mensaje: "Presupuesto no encontrado"
      });
    }

    res.status(200).json(presupuesto);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el presupuesto",
      error: error.message
    });
  }
});

// POST /api/presupuestos
// Crear un presupuesto
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.itinerario_id ||
      !mongoose.Types.ObjectId.isValid(req.body.itinerario_id)
    ) {
      return res.status(400).json({
        mensaje: "El itinerario_id es obligatorio y debe ser válido"
      });
    }

    const nuevoPresupuesto = new Presupuesto(req.body);
    const presupuestoGuardado = await nuevoPresupuesto.save();

    res.status(201).json({
      mensaje: "Presupuesto creado correctamente",
      presupuesto: presupuestoGuardado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear el presupuesto",
      error: error.message
    });
  }
});

// PUT /api/presupuestos/:id
// Actualizar un presupuesto
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del presupuesto no es válido"
      });
    }

    if (
      req.body.itinerario_id &&
      !mongoose.Types.ObjectId.isValid(req.body.itinerario_id)
    ) {
      return res.status(400).json({
        mensaje: "El itinerario_id proporcionado no es válido"
      });
    }

    const presupuestoActualizado =
      await Presupuesto.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      ).populate(
        "itinerario_id",
        "nombre_viaje fecha_inicio dias_duracion"
      );

    if (!presupuestoActualizado) {
      return res.status(404).json({
        mensaje: "Presupuesto no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Presupuesto actualizado correctamente",
      presupuesto: presupuestoActualizado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar el presupuesto",
      error: error.message
    });
  }
});

// DELETE /api/presupuestos/:id
// Eliminar un presupuesto
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del presupuesto no es válido"
      });
    }

    const presupuestoEliminado =
      await Presupuesto.findByIdAndDelete(req.params.id);

    if (!presupuestoEliminado) {
      return res.status(404).json({
        mensaje: "Presupuesto no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Presupuesto eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar el presupuesto",
      error: error.message
    });
  }
});

module.exports = router;
