const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true
    },

    contrasena_hash: {
      type: String,
      required: [true, "La contraseña es obligatoria"]
    },

    rol: {
      type: String,
      required: [true, "El rol es obligatorio"],
      trim: true,
      default: "turista"
    },

    estado: {
      type: String,
      required: [true, "El estado es obligatorio"],
      trim: true,
      default: "activo"
    },

    fecha_creacion: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "usuarios",
    versionKey: false
  }
);

module.exports = mongoose.model("Usuario", usuarioSchema);
