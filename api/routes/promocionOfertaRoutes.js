const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const PromocionOferta = require("../models/PromocionOferta");

// GET /api/promociones-ofertas
router.get("/", async (req, res) => {
  try {
    const promociones = await PromocionOferta.find().sort({
      valido_hasta: 1
    });

    res.status(200).json({
      cantidad: promociones.length,
      promociones
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las promociones y ofertas",
      error: error.message
    });
  }
});

// GET /api/promociones-ofertas/:id
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
      });
    }

    const promocion = await PromocionOferta.findById(req.params.id);

    if (!promocion) {
      return res.status(404).json({
        mensaje: "Promoción u oferta no encontrada"
      });
    }

    res.status(200).json(promocion);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener la promoción u oferta",
      error: error.message
    });
  }
});

// POST /api/promociones-ofertas
router.post("/", async (req, res) => {
  try {
    const codigoExistente = await PromocionOferta.findOne({
      codigo_cupon: req.body.codigo_cupon?.toUpperCase()
    });

    if (codigoExistente) {
      return res.status(409).json({
        mensaje: "Ya existe una promoción con ese código de cupón"
      });
    }

    const nuevaPromocion = new PromocionOferta(req.body);
    const promocionGuardada = await nuevaPromocion.save();

    res.status(201).json({
      mensaje: "Promoción u oferta creada correctamente",
      promocion: promocionGuardada
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear la promoción u oferta",
      error: error.message
    });
  }
});

// PUT /api/promociones-ofertas/:id
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
      });
    }

    if (req.body.codigo_cupon) {
      const codigoExistente = await PromocionOferta.findOne({
        codigo_cupon: req.body.codigo_cupon.toUpperCase(),
        _id: { $ne: req.params.id }
      });

      if (codigoExistente) {
        return res.status(409).json({
          mensaje: "Ya existe otra promoción con ese código de cupón"
        });
      }
    }

    const promocionActualizada =
      await PromocionOferta.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!promocionActualizada) {
      return res.status(404).json({
        mensaje: "Promoción u oferta no encontrada"
      });
    }

    res.status(200).json({
      mensaje: "Promoción u oferta actualizada correctamente",
      promocion: promocionActualizada
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar la promoción u oferta",
      error: error.message
    });
  }
});

// DELETE /api/promociones-ofertas/:id
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
      });
    }

    const promocionEliminada =
      await PromocionOferta.findByIdAndDelete(req.params.id);

    if (!promocionEliminada) {
      return res.status(404).json({
        mensaje: "Promoción u oferta no encontrada"
      });
    }

    res.status(200).json({
      mensaje: "Promoción u oferta eliminada correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar la promoción u oferta",
      error: error.message
    });
  }
});

module.exports = router;
