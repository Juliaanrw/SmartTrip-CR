const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const ResenaLugar = require("../models/ResenaLugar");

// GET /api/resenas-lugares
// Obtener todas las reseñas
router.get("/", async (req, res) => {
  try {
    const resenas = await ResenaLugar.find()
      .populate("lugar_id", "nombre provincia canton categoria")
      .populate("usuario_id", "correo rol estado")
      .sort({ fecha_publicacion: -1 });

    res.status(200).json({
      cantidad: resenas.length,
      resenas
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las reseñas",
      error: error.message
    });
  }
});

// GET /api/resenas-lugares/:id
// Obtener una reseña por ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID de la reseña no es válido"
      });
    }

    const resena = await ResenaLugar.findById(req.params.id)
      .populate("lugar_id", "nombre provincia canton categoria")
      .populate("usuario_id", "correo rol estado");

    if (!resena) {
      return res.status(404).json({
        mensaje: "Reseña no encontrada"
      });
    }

    res.status(200).json(resena);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener la reseña",
      error: error.message
    });
  }
});

// POST /api/resenas-lugares
// Crear una reseña
router.post("/", async (req, res) => {
  try {
    const { lugar_id, usuario_id } = req.body;

    if (!lugar_id || !mongoose.Types.ObjectId.isValid(lugar_id)) {
      return res.status(400).json({
        mensaje: "El lugar_id es obligatorio y debe ser válido"
      });
    }

    if (!usuario_id || !mongoose.Types.ObjectId.isValid(usuario_id)) {
      return res.status(400).json({
        mensaje: "El usuario_id es obligatorio y debe ser válido"
      });
    }

    const nuevaResena = new ResenaLugar(req.body);
    const resenaGuardada = await nuevaResena.save();

    res.status(201).json({
      mensaje: "Reseña creada correctamente",
      resena: resenaGuardada
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear la reseña",
      error: error.message
    });
  }
});

// PUT /api/resenas-lugares/:id
// Actualizar una reseña
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID de la reseña no es válido"
      });
    }

    if (
      req.body.lugar_id &&
      !mongoose.Types.ObjectId.isValid(req.body.lugar_id)
    ) {
      return res.status(400).json({
        mensaje: "El lugar_id proporcionado no es válido"
      });
    }

    if (
      req.body.usuario_id &&
      !mongoose.Types.ObjectId.isValid(req.body.usuario_id)
    ) {
      return res.status(400).json({
        mensaje: "El usuario_id proporcionado no es válido"
      });
    }

    const resenaActualizada = await ResenaLugar.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("lugar_id", "nombre provincia canton categoria")
      .populate("usuario_id", "correo rol estado");

    if (!resenaActualizada) {
      return res.status(404).json({
        mensaje: "Reseña no encontrada"
      });
    }

    res.status(200).json({
      mensaje: "Reseña actualizada correctamente",
      resena: resenaActualizada
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar la reseña",
      error: error.message
    });
  }
});

// DELETE /api/resenas-lugares/:id
// Eliminar una reseña
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID de la reseña no es válido"
      });
    }

    const resenaEliminada = await ResenaLugar.findByIdAndDelete(
      req.params.id
    );

    if (!resenaEliminada) {
      return res.status(404).json({
        mensaje: "Reseña no encontrada"
      });
    }

    res.status(200).json({
      mensaje: "Reseña eliminada correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar la reseña",
      error: error.message
    });
  }
});

module.exports = router;
