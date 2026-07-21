const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Usuario = require("../models/Usuario");

// GET /api/usuarios
// Listar todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select("-contrasena_hash")
      .sort({ fecha_creacion: -1 });

    res.status(200).json({
      cantidad: usuarios.length,
      usuarios
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los usuarios",
      error: error.message
    });
  }
});

// GET /api/usuarios/:id
// Obtener un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
      });
    }

    const usuario = await Usuario.findById(req.params.id)
      .select("-contrasena_hash");

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el usuario",
      error: error.message
    });
  }
});

// POST /api/usuarios
// Crear un usuario
router.post("/", async (req, res) => {
  try {
    const correoExistente = await Usuario.findOne({
      correo: req.body.correo
    });

    if (correoExistente) {
      return res.status(409).json({
        mensaje: "Ya existe un usuario registrado con ese correo"
      });
    }

    const nuevoUsuario = new Usuario(req.body);
    const usuarioGuardado = await nuevoUsuario.save();

    const respuesta = usuarioGuardado.toObject();
    delete respuesta.contrasena_hash;

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: respuesta
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear el usuario",
      error: error.message
    });
  }
});

// PUT /api/usuarios/:id
// Actualizar un usuario
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
      });
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select("-contrasena_hash");

    if (!usuarioActualizado) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Usuario actualizado correctamente",
      usuario: usuarioActualizado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar el usuario",
      error: error.message
    });
  }
});

// DELETE /api/usuarios/:id
// Eliminar un usuario
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID proporcionado no es válido"
      });
    }

    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuarioEliminado) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Usuario eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar el usuario",
      error: error.message
    });
  }
});

module.exports = router;
