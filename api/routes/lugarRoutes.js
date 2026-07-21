const express = require("express");
const router = express.Router();
const Lugar = require("../models/Lugar");

// GET /api/lugares
// Obtener todos los lugares
router.get("/", async (req, res) => {
  try {
    const lugares = await Lugar.find().sort({ createdAt: -1 });

    res.status(200).json({
      cantidad: lugares.length,
      lugares
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los lugares",
      error: error.message
    });
  }
});

// GET /api/lugares/:id
// Obtener un lugar por su ID
router.get("/:id", async (req, res) => {
  try {
    const lugar = await Lugar.findById(req.params.id);

    if (!lugar) {
      return res.status(404).json({
        mensaje: "Lugar no encontrado"
      });
    }

    res.status(200).json(lugar);
  } catch (error) {
    res.status(400).json({
      mensaje: "El ID proporcionado no es válido",
      error: error.message
    });
  }
});

// POST /api/lugares
// Crear un lugar nuevo
router.post("/", async (req, res) => {
  try {
    const nuevoLugar = new Lugar(req.body);
    const lugarGuardado = await nuevoLugar.save();

    res.status(201).json({
      mensaje: "Lugar creado correctamente",
      lugar: lugarGuardado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear el lugar",
      error: error.message
    });
  }
});

// PUT /api/lugares/:id
// Actualizar un lugar
router.put("/:id", async (req, res) => {
  try {
    const lugarActualizado = await Lugar.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!lugarActualizado) {
      return res.status(404).json({
        mensaje: "Lugar no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Lugar actualizado correctamente",
      lugar: lugarActualizado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar el lugar",
      error: error.message
    });
  }
});

// DELETE /api/lugares/:id
// Eliminar un lugar
router.delete("/:id", async (req, res) => {
  try {
    const lugarEliminado = await Lugar.findByIdAndDelete(req.params.id);

    if (!lugarEliminado) {
      return res.status(404).json({
        mensaje: "Lugar no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Lugar eliminado correctamente",
      lugar: lugarEliminado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo eliminar el lugar",
      error: error.message
    });
  }
});

module.exports = router;
Agregar rutas CRUD para lugares
