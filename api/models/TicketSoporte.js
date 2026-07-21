const mongoose = require("mongoose");

const ticketSoporteSchema = new mongoose.Schema(
  {
    ticket_numero: {
      type: String,
      required: [true, "El número del ticket es obligatorio"],
      unique: true,
      trim: true,
      uppercase: true
    },

    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El usuario es obligatorio"]
    },

    asunto: {
      type: String,
      required: [true, "El asunto es obligatorio"],
      trim: true
    },

    mensaje: {
      type: String,
      required: [true, "El mensaje es obligatorio"],
      trim: true
    },

    estado: {
      type: String,
      required: [true, "El estado es obligatorio"],
      enum: {
        values: ["abierto", "en_proceso", "cerrado"],
        message: "El estado debe ser abierto, en_proceso o cerrado"
      },
      default: "abierto"
    }
  },
  {
    collection: "tickets_soporte",
    versionKey: false
  }
);

module.exports = mongoose.model(
  "TicketSoporte",
  ticketSoporteSchema
);
