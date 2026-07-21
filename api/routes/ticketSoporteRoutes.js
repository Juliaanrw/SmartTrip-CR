const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const TicketSoporte = require("../models/TicketSoporte");

// GET /api/tickets-soporte
// Obtener todos los tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await TicketSoporte.find()
      .populate("usuario_id", "correo rol estado")
      .sort({ ticket_numero: 1 });

    res.status(200).json({
      cantidad: tickets.length,
      tickets
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los tickets de soporte",
      error: error.message
    });
  }
});

// GET /api/tickets-soporte/:id
// Obtener un ticket por ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del ticket no es válido"
      });
    }

    const ticket = await TicketSoporte.findById(req.params.id)
      .populate("usuario_id", "correo rol estado");

    if (!ticket) {
      return res.status(404).json({
        mensaje: "Ticket de soporte no encontrado"
      });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el ticket de soporte",
      error: error.message
    });
  }
});

// POST /api/tickets-soporte
// Crear un ticket
router.post("/", async (req, res) => {
  try {
    const { ticket_numero, usuario_id } = req.body;

    if (!usuario_id || !mongoose.Types.ObjectId.isValid(usuario_id)) {
      return res.status(400).json({
        mensaje: "El usuario_id es obligatorio y debe ser válido"
      });
    }

    const ticketExistente = await TicketSoporte.findOne({
      ticket_numero: ticket_numero?.toUpperCase()
    });

    if (ticketExistente) {
      return res.status(409).json({
        mensaje: "Ya existe un ticket con ese número"
      });
    }

    const nuevoTicket = new TicketSoporte(req.body);
    const ticketGuardado = await nuevoTicket.save();

    res.status(201).json({
      mensaje: "Ticket de soporte creado correctamente",
      ticket: ticketGuardado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo crear el ticket de soporte",
      error: error.message
    });
  }
});

// PUT /api/tickets-soporte/:id
// Actualizar un ticket
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del ticket no es válido"
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

    if (req.body.ticket_numero) {
      const ticketExistente = await TicketSoporte.findOne({
        ticket_numero: req.body.ticket_numero.toUpperCase(),
        _id: { $ne: req.params.id }
      });

      if (ticketExistente) {
        return res.status(409).json({
          mensaje: "Ya existe otro ticket con ese número"
        });
      }
    }

    const ticketActualizado = await TicketSoporte.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("usuario_id", "correo rol estado");

    if (!ticketActualizado) {
      return res.status(404).json({
        mensaje: "Ticket de soporte no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Ticket de soporte actualizado correctamente",
      ticket: ticketActualizado
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar el ticket de soporte",
      error: error.message
    });
  }
});

// DELETE /api/tickets-soporte/:id
// Eliminar un ticket
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: "El ID del ticket no es válido"
      });
    }

    const ticketEliminado = await TicketSoporte.findByIdAndDelete(
      req.params.id
    );

    if (!ticketEliminado) {
      return res.status(404).json({
        mensaje: "Ticket de soporte no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Ticket de soporte eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "No se pudo eliminar el ticket de soporte",
      error: error.message
    });
  }
});

module.exports = router;
