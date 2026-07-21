const mongoose = require("mongoose");

const bitacoraAuditoriaSchema = new mongoose.Schema(
  {
    fecha_evento: {
      type: Date,
      default: Date.now
    },

    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El usuario es obligatorio"]
    },

    accion_ejecutada: {
      type: String,
      required: [true, "La acción ejecutada es obligatoria"],
      trim: true,
      uppercase: true
    }
  },
  {
    collection: "bitacora_auditoria",
    versionKey: false
  }
);

module.exports = mongoose.model(
  "BitacoraAuditoria",
  bitacoraAuditoriaSchema
);
