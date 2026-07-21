require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const lugarRoutes = require("./routes/lugarRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const perfilRoutes = require("./routes/perfilRoutes");
const itinerarioRoutes = require("./routes/itinerarioRoutes");
const grupoViajeRoutes = require("./routes/grupoViajeRoutes");
const presupuestoRoutes = require("./routes/presupuestoRoutes");
const resenaLugarRoutes = require("./routes/resenaLugarRoutes");
const servicioLocalRoutes = require("./routes/servicioLocalRoutes");
const categoriaTagRoutes = require("./routes/categoriaTagRoutes");
const promocionOfertaRoutes = require("./routes/promocionOfertaRoutes");
const bitacoraAuditoriaRoutes = require("./routes/bitacoraAuditoriaRoutes");
const ticketSoporteRoutes = require("./routes/ticketSoporteRoutes");


const app = express();
//Middlewares Básicos
app.use(cors());
app.use(express.json());
app.use("/api/lugares", lugarRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/perfiles", perfilRoutes);
app.use("/api/itinerarios", itinerarioRoutes);
app.use("/api/grupos-viajes", grupoViajeRoutes);
app.use("/api/presupuestos", presupuestoRoutes);
app.use("/api/resenas-lugares", resenaLugarRoutes);
app.use("/api/servicios-locales", servicioLocalRoutes);
app.use("/api/categorias-tags", categoriaTagRoutes);
app.use("/api/promociones-ofertas", promocionOfertaRoutes);
app.use("/api/bitacora-auditoria", bitacoraAuditoriaRoutes);
app.use("/api/tickets-soporte", ticketSoporteRoutes);


//Conexión a MongoDB usando Variables de Entorno
const MONGO_URI = process.env.MONGO_URI;

// Ruta de prueba inicial
app.get("/", (req, res) => {
  res.send("Servidor Base de SmartTrip CR Operando Correctamente");
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("La variable MONGO_URI no está definida en el archivo .env");
    }

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("Conexión exitosa a MongoDB");

    app.listen(PORT, () => {
      console.log(
        `Servidor de SmartTrip corriendo en: http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("No se pudo conectar a MongoDB:");
    console.error(error.message);
    process.exit(1);
  }
};

iniciarServidor();
