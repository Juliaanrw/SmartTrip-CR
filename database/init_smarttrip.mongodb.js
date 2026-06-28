/* global use, db */
// Base de datos para SmartTrip CR


use('smarttrip_db');

// Las variables para los IDs para poder relacionar las colecciones 
const idUsuario = ObjectId();
const idLugar = ObjectId();
const idItinerario = ObjectId();

// 1. Usuarios
db.usuarios.insertOne({
  _id: idUsuario,
  correo: "usuario.viajero@cenfotec.ac.cr",
  contrasena_hash: "clave123", 
  rol: "turista",
  estado: "activo",
  fecha_creacion: new Date()
});

// 2. Perfiles
db.perfiles.insertOne({
  _id: ObjectId(),
  usuario_id: idUsuario,
  nombre_completo: "Julian Quesada",
  telefono: "8888-1111",
  preferencias_viaje: ["playa", "montaña"], 
  rango_presupuesto: "medio",
  tipo_vehiculo: "4x4"
});

// 3. Lugares Turísticos
db.lugares_turisticos.insertOne({
  _id: idLugar,
  nombre: "Playa Conchal",
  provincia: "Guanacaste",
  canton: "Santa Cruz",
  categoria: "Playa",
  costo_ingreso: NumberDecimal("0.00") 
});

// 4. Itinerarios
db.itinerarios.insertOne({
  _id: idItinerario,
  nombre_viaje: "Fin de semana en Guanacaste",
  creador_id: idUsuario,
  dias_duracion: NumberInt(2), 
  fecha_inicio: new Date("2026-07-11"), 
  detalles_itinerario: "Día 1: Visita a Playa Conchal. Día 2: Retorno a la casa."
});

// 5. Grupos de Viaje
db.grupos_viajes.insertOne({
  _id: ObjectId(),
  nombre_grupo: "Paseo con los compas de la U",
  itinerario_id: idItinerario,
  codigo_invitacion: "TRIP2026",
  administrador_id: idUsuario
});

// 6. Presupuestos
db.presupuestos.insertOne({
  _id: ObjectId(),
  itinerario_id: idItinerario,
  monto_maximo_colones: NumberDecimal("120000.00"), 
  total_gastado: NumberDecimal("35000.00"),        
  descripcion_gastos: "Gasto en combustible y meriendas."
});

// 7. Reseñas de Lugares
db.resenas_lugares.insertOne({
  _id: ObjectId(),
  lugar_id: idLugar,
  usuario_id: idUsuario,
  calificacion: NumberInt(5), 
  comentario: "Excelente lugar, el agua es sumamente cristalina.",
  fecha_publicacion: new Date()
});

// 8. Servicios Locales
db.servicios_locales.insertOne({
  _id: ObjectId(),
  nombre_negocio: "Restaurante Mariscos del Pacífico",
  tipo_servicio: "Alimentación",
  lugar_turistico_cercano_id: idLugar,
  telefono_contacto: "2654-0000"
});

// 9.  Categorias_Tags
db.categorias_tags.insertOne({
  _id: ObjectId(),
  nombre_tag: "Pet Friendly",
  descripcion: "Permiten el ingreso con mascotas."
});

// 10. Promociones 
db.promociones_ofertas.insertOne({
  _id: ObjectId(),
  titulo_promocion: "15% de descuento en almuerzos",
  codigo_cupon: "SMARTCONCHAL",
  porcentaje_descuento: NumberInt(15),
  valido_hasta: new Date("2026-12-31")
});

// 11. Bitácora de Auditoría
db.bitacora_auditoria.insertOne({
  _id: ObjectId(),
  fecha_evento: new Date(),
  usuario_id: idUsuario,
  accion_ejecutada: "LOGIN_EXITOSO"
});

// 12. Tickets de Soporte
db.tickets_soporte.insertOne({
  _id: ObjectId(),
  ticket_numero: "ST-001",
  usuario_id: idUsuario,
  asunto: "Error en código",
  mensaje: "El código de invitación no funciona.",
  estado: "abierto"
});