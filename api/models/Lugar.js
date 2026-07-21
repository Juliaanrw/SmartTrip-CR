const mongoose = require("mongoose");

const lugarSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del lugar es obligatorio"],
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

    costo_ingreso: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "El costo de ingreso es obligatorio"],
      default: 0
    }
  },
  {
    collection: "lugares_turisticos",
    versionKey: false
  }
);

module.exports = mongoose.model("Lugar", lugarSchema);
