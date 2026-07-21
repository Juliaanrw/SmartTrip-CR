const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Perfil = require("../models/Perfil");

// GET /api/perfiles
// Listar todos los perfiles
router.get("/", async (req, res) => {
  try {
    const perfiles = await Perfil.find()
      .populate("usuario_id", "correo rol estado");

    res.status(200).json({
      cantidad: perfiles.length,
      perfiles
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los perfiles",
      error: error.message
    });
  }
});

// GET /api/perfiles/:id
// Obtener un perfil por ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
      });
    }

    const perfil = await Perfil.findById(req.params.id)
      .populate("usuario_id", "correo rol estado");

    if (!perfil) {
      return res.status(404).json({
        mensaje: "Perfil no encontrado"
      });
    }

    res.status(200).json(perfil);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el perfil",
      error: error.message
    });
  }
});

// POST /api/perfiles
// Crear un perfil
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

    const perfilExistente = await Perfil.findOne({
      usuario_id: req.body.usuario_id
    });

    if (perfilExistente) {
      return res.status(409).json({
        mensaje: "El usuario ya tiene un perfil registrado"
      });
    }

    const nuevoPerfil = new Perfil(req.body);
    const perfilGuardado = await nuevoPerfil.save();

    res.status(201).json({
      mensaje: "Perfil creado correctamente",
      perfil: perfilGuardado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear el perfil",
      error: error.message
    });
  }
});

// PUT /api/perfiles/:id
// Actualizar un perfil
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
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

    const perfilActualizado = await Perfil.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("usuario_id", "correo rol estado");

    if (!perfilActualizado) {
      return res.status(404).json({
        mensaje: "Perfil no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Perfil actualizado correctamente",
      perfil: perfilActualizado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar el perfil",
      error: error.message
    });
  }
});

// DELETE /api/perfiles/:id
// Eliminar un perfil
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
      });
    }

    const perfilEliminado = await Perfil.findByIdAndDelete(req.params.id);

    if (!perfilEliminado) {
      return res.status(404).json({
        mensaje: "Perfil no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Perfil eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar el perfil",
      error: error.message
    });
  }
});

module.exports = router;
