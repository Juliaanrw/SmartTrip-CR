const mongoose = require("mongoose");

const categoriaTagSchema = new mongoose.Schema(
  {
    nombre_tag: {
      type: String,
      required: [true, "El nombre de la categoría o etiqueta es obligatorio"],
      unique: true,
      trim: true
    },

    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true
    }
  },
  {
    collection: "categorias_tags",
    versionKey: false
  }
);

module.exports = mongoose.model("CategoriaTag", categoriaTagSchema);
