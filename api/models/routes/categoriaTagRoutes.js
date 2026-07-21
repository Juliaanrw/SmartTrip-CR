const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const CategoriaTag = require("../models/CategoriaTag");

// GET /api/categorias-tags
// Obtener todas las categorías y etiquetas
router.get("/", async (req, res) => {
  try {
    const categorias = await CategoriaTag.find().sort({ nombre_tag: 1 });

    res.status(200).json({
      cantidad: categorias.length,
      categorias
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las categorías y etiquetas",
      error: error.message
    });
  }
});

// GET /api/categorias-tags/:id
// Obtener una categoría o etiqueta por ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
      });
    }

    const categoria = await CategoriaTag.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoría o etiqueta no encontrada"
      });
    }

    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener la categoría o etiqueta",
      error: error.message
    });
  }
});

// POST /api/categorias-tags
// Crear una categoría o etiqueta
router.post("/", async (req, res) => {
  try {
    const categoriaExistente = await CategoriaTag.findOne({
      nombre_tag: req.body.nombre_tag
    });

    if (categoriaExistente) {
      return res.status(409).json({
        mensaje: "Ya existe una categoría o etiqueta con ese nombre"
      });
    }

    const nuevaCategoria = new CategoriaTag(req.body);
    const categoriaGuardada = await nuevaCategoria.save();

    res.status(201).json({
      mensaje: "Categoría o etiqueta creada correctamente",
      categoria: categoriaGuardada
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear la categoría o etiqueta",
      error: error.message
    });
  }
});

// PUT /api/categorias-tags/:id
// Actualizar una categoría o etiqueta
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
      });
    }

    if (req.body.nombre_tag) {
      const categoriaExistente = await CategoriaTag.findOne({
        nombre_tag: req.body.nombre_tag,
        _id: { $ne: req.params.id }
      });

      if (categoriaExistente) {
        return res.status(409).json({
          mensaje: "Ya existe otra categoría o etiqueta con ese nombre"
        });
      }
    }

    const categoriaActualizada = await CategoriaTag.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!categoriaActualizada) {
      return res.status(404).json({
        mensaje: "Categoría o etiqueta no encontrada"
      });
    }

    res.status(200).json({
      mensaje: "Categoría o etiqueta actualizada correctamente",
      categoria: categoriaActualizada
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar la categoría o etiqueta",
      error: error.message
    });
  }
});

// DELETE /api/categorias-tags/:id
// Eliminar una categoría o etiqueta
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
      });
    }

    const categoriaEliminada = await CategoriaTag.findByIdAndDelete(
      req.params.id
    );

    if (!categoriaEliminada) {
      return res.status(404).json({
        mensaje: "Categoría o etiqueta no encontrada"
      });
    }

    res.status(200).json({
      mensaje: "Categoría o etiqueta eliminada correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar la categoría o etiqueta",
      error: error.message
    });
  }
});

module.exports = router;
