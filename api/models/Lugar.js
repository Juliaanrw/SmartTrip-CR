const mongoose = require("mongoose");

const lugarSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del lugar es obligatorio"],
      trim: true
    },

    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true
    },

    provincia: {
      type: String,
      required: [true, "La provincia es obligatoria"],
      trim: true
    },

    canton: {
      type: String,
      required: [true, "El cantón es obligatorio"],
      trim: true
    },

    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true
    },

    precioEstimado: {
      type: Number,
      required: [true, "El precio estimado es obligatorio"],
      min: [0, "El precio no puede ser negativo"]
    },

    direccion: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true
    },

    imagen: {
      type: String,
      default: ""
    },

    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: "lugares"
  }
);

module.exports = mongoose.model("Lugar", lugarSchema);
Agregar esquema Mongoose para lugares
