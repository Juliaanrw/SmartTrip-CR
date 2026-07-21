const mongoose = require("mongoose");

const servicioLocalSchema = new mongoose.Schema(
  {
    nombre_negocio: {
      type: String,
      required: [true, "El nombre del negocio es obligatorio"],
      trim: true
    },

    tipo_servicio: {
      type: String,
      required: [true, "El tipo de servicio es obligatorio"],
      trim: true
    },

    lugar_turistico_cercano_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lugar",
      required: [true, "El lugar turístico cercano es obligatorio"]
    },

    telefono_contacto: {
      type: String,
      required: [true, "El teléfono de contacto es obligatorio"],
      trim: true
    }
  },
  {
    collection: "servicios_locales",
    versionKey: false
  }
);

module.exports = mongoose.model("ServicioLocal", servicioLocalSchema);
