const mongoose = require("mongoose");

const promocionOfertaSchema = new mongoose.Schema(
  {
    titulo_promocion: {
      type: String,
      required: [true, "El título de la promoción es obligatorio"],
      trim: true
    },

    codigo_cupon: {
      type: String,
      required: [true, "El código del cupón es obligatorio"],
      unique: true,
      trim: true,
      uppercase: true
    },

    porcentaje_descuento: {
      type: Number,
      required: [true, "El porcentaje de descuento es obligatorio"],
      min: [1, "El porcentaje mínimo es 1"],
      max: [100, "El porcentaje máximo es 100"],
      validate: {
        validator: Number.isInteger,
        message: "El porcentaje debe ser un número entero"
      }
    },

    valido_hasta: {
      type: Date,
      required: [true, "La fecha de vencimiento es obligatoria"]
    }
  },
  {
    collection: "promociones_ofertas",
    versionKey: false
  }
);

module.exports = mongoose.model(
  "PromocionOferta",
  promocionOfertaSchema
);
