const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const GrupoViaje = require("../models/GrupoViaje");

// GET /api/grupos-viajes
// Obtener todos los grupos de viaje
router.get("/", async (req, res) => {
  try {
    const grupos = await GrupoViaje.find()
      .populate("itinerario_id", "nombre_viaje fecha_inicio dias_duracion")
      .populate("administrador_id", "correo rol estado");

    res.status(200).json({
      cantidad: grupos.length,
      grupos
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los grupos de viaje",
      error: error.message
    });
  }
});

// GET /api/grupos-viajes/:id
// Obtener un grupo de viaje por ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del grupo de viaje no es válido"
      });
    }

    const grupo = await GrupoViaje.findById(req.params.id)
      .populate("itinerario_id", "nombre_viaje fecha_inicio dias_duracion")
      .populate("administrador_id", "correo rol estado");

    if (!grupo) {
      return res.status(404).json({
        mensaje: "Grupo de viaje no encontrado"
      });
    }

    res.status(200).json(grupo);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el grupo de viaje",
      error: error.message
    });
  }
});

// POST /api/grupos-viajes
// Crear un grupo de viaje
router.post("/", async (req, res) => {
  try {
    const { itinerario_id, administrador_id, codigo_invitacion } = req.body;

    if (
      !itinerario_id ||
      !mongoose.Types.ObjectId.isValid(itinerario_id)
    ) {
      return res.status(400).json({
        mensaje: "El itinerario_id es obligatorio y debe ser válido"
      });
    }

    if (
      !administrador_id ||
      !mongoose.Types.ObjectId.isValid(administrador_id)
    ) {
      return res.status(400).json({
        mensaje: "El administrador_id es obligatorio y debe ser válido"
      });
    }

    const codigoExistente = await GrupoViaje.findOne({
      codigo_invitacion: codigo_invitacion?.toUpperCase()
    });

    if (codigoExistente) {
      return res.status(409).json({
        mensaje: "El código de invitación ya está registrado"
      });
    }

    const nuevoGrupo = new GrupoViaje(req.body);
    const grupoGuardado = await nuevoGrupo.save();

    res.status(201).json({
      mensaje: "Grupo de viaje creado correctamente",
      grupo: grupoGuardado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear el grupo de viaje",
      error: error.message
    });
  }
});

// PUT /api/grupos-viajes/:id
// Actualizar un grupo de viaje
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del grupo de viaje no es válido"
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

    if (
      req.body.administrador_id &&
      !mongoose.Types.ObjectId.isValid(req.body.administrador_id)
    ) {
      return res.status(400).json({
        mensaje: "El administrador_id proporcionado no es válido"
      });
    }

    const grupoActualizado = await GrupoViaje.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("itinerario_id", "nombre_viaje fecha_inicio dias_duracion")
      .populate("administrador_id", "correo rol estado");

    if (!grupoActualizado) {
      return res.status(404).json({
        mensaje: "Grupo de viaje no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Grupo de viaje actualizado correctamente",
      grupo: grupoActualizado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar el grupo de viaje",
      error: error.message
    });
  }
});

// DELETE /api/grupos-viajes/:id
// Eliminar un grupo de viaje
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del grupo de viaje no es válido"
      });
    }

    const grupoEliminado = await GrupoViaje.findByIdAndDelete(req.params.id);

    if (!grupoEliminado) {
      return res.status(404).json({
        mensaje: "Grupo de viaje no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Grupo de viaje eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar el grupo de viaje",
      error: error.message
    });
  }
});

module.exports = router;
