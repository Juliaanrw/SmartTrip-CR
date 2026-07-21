const mongoose = require("mongoose");

const itinerarioSchema = new mongoose.Schema(
  {
    nombre_viaje: {
      type: String,
      required: [true, "El nombre del viaje es obligatorio"],
      trim: true
    },

    creador_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El creador del itinerario es obligatorio"]
    },

    dias_duracion: {
      type: Number,
      required: [true, "La duración del viaje es obligatoria"],
      min: [1, "La duración debe ser de al menos un día"],
      validate: {
        validator: Number.isInteger,
        message: "La duración debe ser un número entero"
      }
    },

    fecha_inicio: {
      type: Date,
      required: [true, "La fecha de inicio es obligatoria"]
    },

    detalles_itinerario: {
      type: String,
      required: [true, "Los detalles del itinerario son obligatorios"],
      trim: true
    }
  },
  {
    collection: "itinerarios",
    versionKey: false
  }
);

module.exports = mongoose.model("Itinerario", itinerarioSchema);
