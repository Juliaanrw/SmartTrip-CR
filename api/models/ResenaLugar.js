const mongoose = require("mongoose");

const resenaLugarSchema = new mongoose.Schema(
  {
    lugar_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lugar",
      required: [true, "El lugar turístico es obligatorio"]
    },

    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El usuario es obligatorio"]
    },

    calificacion: {
      type: Number,
      required: [true, "La calificación es obligatoria"],
      min: [1, "La calificación mínima es 1"],
      max: [5, "La calificación máxima es 5"],
      validate: {
        validator: Number.isInteger,
        message: "La calificación debe ser un número entero"
      }
    },

    comentario: {
      type: String,
      required: [true, "El comentario es obligatorio"],
      trim: true
    },

    fecha_publicacion: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "resenas_lugares",
    versionKey: false
  }
);

module.exports = mongoose.model("ResenaLugar", resenaLugarSchema);
