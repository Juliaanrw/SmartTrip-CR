require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const lugarRoutes = require("./routes/lugarRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const perfilRoutes = require("./routes/perfilRoutes");
const itinerarioRoutes = require("./routes/itinerarioRoutes");
const grupoViajeRoutes = require("./routes/grupoViajeRoutes");



const app = express();
//Middlewares Básicos
app.use(cors());
app.use(express.json());
app.use("/api/lugares", lugarRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/perfiles", perfilRoutes);
app.use("/api/itinerarios", itinerarioRoutes);
app.use("/api/grupos-viajes", grupoViajeRoutes);


//Conexión a MongoDB usando Variables de Entorno
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conexión exitosa a MongoDB desde variables de entorno'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

//Ruta de prueba inicial
app.get('/', (req, res) => {
  res.send('Servidor Base de SmartTrip CR Operando Correctamente');
});

//Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de SmartTrip corriendo en: http://localhost:${PORT}`);
});
