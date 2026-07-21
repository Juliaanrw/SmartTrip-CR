const mongoose = require("mongoose");

const perfilSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El usuario es obligatorio"],
      unique: true
    },

    nombre_completo: {
      type: String,
      required: [true, "El nombre completo es obligatorio"],
      trim: true
    },

    telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true
    },

    preferencias_viaje: {
      type: [String],
      default: []
    },

    rango_presupuesto: {
      type: String,
      required: [true, "El rango de presupuesto es obligatorio"],
      trim: true
    },

    tipo_vehiculo: {
      type: String,
      required: [true, "El tipo de vehículo es obligatorio"],
      trim: true
    }
  },
  {
    collection: "perfiles",
    versionKey: false
  }
);

module.exports = mongoose.model("Perfil", perfilSchema);
