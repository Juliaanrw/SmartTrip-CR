const mongoose = require("mongoose");

const grupoViajeSchema = new mongoose.Schema(
  {
    nombre_grupo: {
      type: String,
      required: [true, "El nombre del grupo es obligatorio"],
      trim: true
    },

    itinerario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerario",
      required: [true, "El itinerario es obligatorio"]
    },

    codigo_invitacion: {
      type: String,
      required: [true, "El código de invitación es obligatorio"],
      unique: true,
      trim: true,
      uppercase: true
    },

    administrador_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El administrador es obligatorio"]
    }
  },
  {
    collection: "grupos_viajes",
    versionKey: false
  }
);

module.exports = mongoose.model("GrupoViaje", grupoViajeSchema);
