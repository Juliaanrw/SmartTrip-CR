const mongoose = require("mongoose");

const presupuestoSchema = new mongoose.Schema(
  {
    itinerario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerario",
      required: [true, "El itinerario es obligatorio"]
    },

    monto_maximo_colones: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "El monto máximo es obligatorio"]
    },

    total_gastado: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "El total gastado es obligatorio"],
      default: 0
    },

    descripcion_gastos: {
      type: String,
      required: [true, "La descripción de los gastos es obligatoria"],
      trim: true
    }
  },
  {
    collection: "presupuestos",
    versionKey: false
  }
);

module.exports = mongoose.model("Presupuesto", presupuestoSchema);
