const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const ServicioLocal = require("../models/ServicioLocal");

// GET /api/servicios-locales
// Obtener todos los servicios locales
router.get("/", async (req, res) => {
  try {
    const servicios = await ServicioLocal.find()
      .populate(
        "lugar_turistico_cercano_id",
        "nombre provincia canton categoria"
      )
      .sort({ nombre_negocio: 1 });

    res.status(200).json({
      cantidad: servicios.length,
      servicios
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los servicios locales",
      error: error.message
    });
  }
});

// GET /api/servicios-locales/:id
// Obtener un servicio local por ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del servicio local no es válido"
      });
    }

    const servicio = await ServicioLocal.findById(req.params.id)
      .populate(
        "lugar_turistico_cercano_id",
        "nombre provincia canton categoria"
      );

    if (!servicio) {
      return res.status(404).json({
        mensaje: "Servicio local no encontrado"
      });
    }

    res.status(200).json(servicio);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el servicio local",
      error: error.message
    });
  }
});

// POST /api/servicios-locales
// Crear un servicio local
router.post("/", async (req, res) => {
  try {
    const { lugar_turistico_cercano_id } = req.body;

    if (
      !lugar_turistico_cercano_id ||
      !mongoose.Types.ObjectId.isValid(lugar_turistico_cercano_id)
    ) {
      return res.status(400).json({
        mensaje:
          "El lugar_turistico_cercano_id es obligatorio y debe ser válido"
      });
    }

    const nuevoServicio = new ServicioLocal(req.body);
    const servicioGuardado = await nuevoServicio.save();

    res.status(201).json({
      mensaje: "Servicio local creado correctamente",
      servicio: servicioGuardado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear el servicio local",
      error: error.message
    });
  }
});

// PUT /api/servicios-locales/:id
// Actualizar un servicio local
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del servicio local no es válido"
      });
    }

    if (
      req.body.lugar_turistico_cercano_id &&
      !mongoose.Types.ObjectId.isValid(
        req.body.lugar_turistico_cercano_id
      )
    ) {
      return res.status(400).json({
        mensaje:
          "El lugar_turistico_cercano_id proporcionado no es válido"
      });
    }

    const servicioActualizado =
      await ServicioLocal.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      ).populate(
        "lugar_turistico_cercano_id",
        "nombre provincia canton categoria"
      );

    if (!servicioActualizado) {
      return res.status(404).json({
        mensaje: "Servicio local no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Servicio local actualizado correctamente",
      servicio: servicioActualizado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar el servicio local",
      error: error.message
    });
  }
});

// DELETE /api/servicios-locales/:id
// Eliminar un servicio local
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del servicio local no es válido"
      });
    }

    const servicioEliminado =
      await ServicioLocal.findByIdAndDelete(req.params.id);

    if (!servicioEliminado) {
      return res.status(404).json({
        mensaje: "Servicio local no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Servicio local eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar el servicio local",
      error: error.message
    });
  }
});

module.exports = router;
