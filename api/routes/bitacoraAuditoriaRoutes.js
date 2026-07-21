const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const BitacoraAuditoria = require("../models/BitacoraAuditoria");

// GET /api/bitacora-auditoria
// Obtener todos los registros de auditoría
router.get("/", async (req, res) => {
  try {
    const registros = await BitacoraAuditoria.find()
      .populate("usuario_id", "correo rol estado")
      .sort({ fecha_evento: -1 });

    res.status(200).json({
      cantidad: registros.length,
      registros
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener la bitácora de auditoría",
      error: error.message
    });
  }
});

// GET /api/bitacora-auditoria/:id
// Obtener un registro por ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del registro no es válido"
      });
    }

    const registro = await BitacoraAuditoria.findById(req.params.id)
      .populate("usuario_id", "correo rol estado");

    if (!registro) {
      return res.status(404).json({
        mensaje: "Registro de auditoría no encontrado"
      });
    }

    res.status(200).json(registro);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el registro de auditoría",
      error: error.message
    });
  }
});

// POST /api/bitacora-auditoria
// Crear un registro de auditoría
router.post("/", async (req, res) => {
  try {
    if (
      !req.body.usuario_id ||
      !mongoose.Types.ObjectId.isValid(req.body.usuario_id)
    ) {
      return res.status(400).json({
        mensaje: "El usuario_id es obligatorio y debe ser válido"
      });
    }

    const nuevoRegistro = new BitacoraAuditoria(req.body);
    const registroGuardado = await nuevoRegistro.save();

    res.status(201).json({
      mensaje: "Registro de auditoría creado correctamente",
      registro: registroGuardado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear el registro de auditoría",
      error: error.message
    });
  }
});

// PUT /api/bitacora-auditoria/:id
// Actualizar un registro de auditoría
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del registro no es válido"
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

    const registroActualizado =
      await BitacoraAuditoria.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      ).populate("usuario_id", "correo rol estado");

    if (!registroActualizado) {
      return res.status(404).json({
        mensaje: "Registro de auditoría no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Registro de auditoría actualizado correctamente",
      registro: registroActualizado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar el registro de auditoría",
      error: error.message
    });
  }
});

// DELETE /api/bitacora-auditoria/:id
// Eliminar un registro de auditoría
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del registro no es válido"
      });
    }

    const registroEliminado =
      await BitacoraAuditoria.findByIdAndDelete(req.params.id);

    if (!registroEliminado) {
      return res.status(404).json({
        mensaje: "Registro de auditoría no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Registro de auditoría eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar el registro de auditoría",
      error: error.message
    });
  }
});

module.exports = router;
