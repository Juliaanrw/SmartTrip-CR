
const PROVINCIAS_CR = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"];

const MODULES = [
  {
    key: "lugares",
    label: "Lugares Turísticos",
    icon: "bi-geo-alt-fill",
    endpoint: "/api/lugares",
    listKey: "lugares",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true, placeholder: "Ej. Playa Conchal" },
      { name: "provincia", label: "Provincia", type: "select", required: true, options: PROVINCIAS_CR },
      { name: "canton", label: "Cantón", type: "text", required: true, placeholder: "Ej. Santa Cruz" },
      {
        name: "categoria",
        label: "Categoría",
        type: "select",
        required: true,
        options: ["Playa", "Montaña", "Volcán", "Parque Nacional", "Catarata", "Cultural", "Aventura"],
      },
      { name: "costo_ingreso", label: "Costo de ingreso (₡)", type: "number", required: true, min: 0, step: 0.01 },
    ],
  },

  {
    key: "usuarios",
    label: "Usuarios",
    icon: "bi-people-fill",
    endpoint: "/api/usuarios",
    listKey: "usuarios",
    fields: [
      { name: "correo", label: "Correo", type: "email", required: true, placeholder: "usuario@correo.com" },
      {
        name: "contrasena_hash",
        label: "Contraseña",
        type: "password",
        required: true,
        requiredOnCreateOnly: true,
        placeholder: "Dejar en blanco para no cambiarla",
      },
      { name: "rol", label: "Rol", type: "select", required: true, options: ["turista", "administrador", "operador"] },
      { name: "estado", label: "Estado", type: "select", required: true, options: ["activo", "inactivo", "suspendido"] },
    ],
  },

  {
    key: "perfiles",
    label: "Perfiles",
    icon: "bi-person-vcard-fill",
    endpoint: "/api/perfiles",
    listKey: "perfiles",
    fields: [
      { name: "usuario_id", label: "Usuario", type: "ref", refModule: "usuarios", refDisplay: "correo", required: true },
      { name: "nombre_completo", label: "Nombre completo", type: "text", required: true },
      { name: "telefono", label: "Teléfono", type: "text", required: true, placeholder: "Ej. 8888-8888" },
      {
        name: "preferencias_viaje",
        label: "Preferencias de viaje",
        type: "text",
        required: false,
        isList: true,
        placeholder: "Separadas por coma: playa, aventura, cultura",
      },
      { name: "rango_presupuesto", label: "Rango de presupuesto", type: "select", required: true, options: ["Económico", "Medio", "Alto"] },
      { name: "tipo_vehiculo", label: "Tipo de vehículo", type: "select", required: true, options: ["Ninguno", "Carro", "Moto", "SUV", "Bus"] },
    ],
  },

  {
    key: "itinerarios",
    label: "Itinerarios",
    icon: "bi-map-fill",
    endpoint: "/api/itinerarios",
    listKey: "itinerarios",
    fields: [
      { name: "nombre_viaje", label: "Nombre del viaje", type: "text", required: true },
      { name: "creador_id", label: "Creador", type: "ref", refModule: "usuarios", refDisplay: "correo", required: true },
      { name: "dias_duracion", label: "Días de duración", type: "number", required: true, min: 1, step: 1 },
      { name: "fecha_inicio", label: "Fecha de inicio", type: "date", required: true },
      { name: "detalles_itinerario", label: "Detalles", type: "textarea", required: true },
    ],
  },

  {
    key: "grupos-viajes",
    label: "Grupos de Viaje",
    icon: "bi-people",
    endpoint: "/api/grupos-viajes",
    listKey: "grupos",
    fields: [
      { name: "nombre_grupo", label: "Nombre del grupo", type: "text", required: true },
      { name: "itinerario_id", label: "Itinerario", type: "ref", refModule: "itinerarios", refDisplay: "nombre_viaje", required: true },
      { name: "codigo_invitacion", label: "Código de invitación", type: "text", required: true, uppercase: true },
      { name: "administrador_id", label: "Administrador", type: "ref", refModule: "usuarios", refDisplay: "correo", required: true },
    ],
  },

  {
    key: "presupuestos",
    label: "Presupuestos",
    icon: "bi-cash-coin",
    endpoint: "/api/presupuestos",
    listKey: "presupuestos",
    fields: [
      { name: "itinerario_id", label: "Itinerario", type: "ref", refModule: "itinerarios", refDisplay: "nombre_viaje", required: true },
      { name: "monto_maximo_colones", label: "Monto máximo (₡)", type: "number", required: true, min: 0, step: 0.01 },
      { name: "total_gastado", label: "Total gastado (₡)", type: "number", required: true, min: 0, step: 0.01 },
      { name: "descripcion_gastos", label: "Descripción de gastos", type: "textarea", required: true },
    ],
  },

  {
    key: "resenas-lugares",
    label: "Reseñas de Lugares",
    icon: "bi-star-fill",
    endpoint: "/api/resenas-lugares",
    listKey: "resenas",
    fields: [
      { name: "lugar_id", label: "Lugar turístico", type: "ref", refModule: "lugares", refDisplay: "nombre", required: true },
      { name: "usuario_id", label: "Usuario", type: "ref", refModule: "usuarios", refDisplay: "correo", required: true },
      { name: "calificacion", label: "Calificación (1-5)", type: "number", required: true, min: 1, max: 5, step: 1 },
      { name: "comentario", label: "Comentario", type: "textarea", required: true },
    ],
  },

  {
    key: "servicios-locales",
    label: "Servicios Locales",
    icon: "bi-shop",
    endpoint: "/api/servicios-locales",
    listKey: "servicios",
    fields: [
      { name: "nombre_negocio", label: "Nombre del negocio", type: "text", required: true },
      {
        name: "tipo_servicio",
        label: "Tipo de servicio",
        type: "select",
        required: true,
        options: ["Restaurante", "Hospedaje", "Transporte", "Guía turístico", "Alquiler de equipo", "Otro"],
      },
      { name: "lugar_turistico_cercano_id", label: "Lugar turístico cercano", type: "ref", refModule: "lugares", refDisplay: "nombre", required: true },
      { name: "telefono_contacto", label: "Teléfono de contacto", type: "text", required: true },
    ],
  },

  {
    key: "categorias-tags",
    label: "Categorías / Tags",
    icon: "bi-tags-fill",
    endpoint: "/api/categorias-tags",
    listKey: "categorias",
    fields: [
      { name: "nombre_tag", label: "Nombre", type: "text", required: true },
      { name: "descripcion", label: "Descripción", type: "textarea", required: true },
    ],
  },

  {
    key: "promociones-ofertas",
    label: "Promociones / Ofertas",
    icon: "bi-percent",
    endpoint: "/api/promociones-ofertas",
    listKey: "promociones",
    fields: [
      { name: "titulo_promocion", label: "Título", type: "text", required: true },
      { name: "codigo_cupon", label: "Código de cupón", type: "text", required: true, uppercase: true },
      { name: "porcentaje_descuento", label: "% de descuento", type: "number", required: true, min: 1, max: 100, step: 1 },
      { name: "valido_hasta", label: "Válido hasta", type: "date", required: true },
    ],
  },

  {
    key: "bitacora-auditoria",
    label: "Bitácora de Auditoría",
    icon: "bi-clipboard-data-fill",
    endpoint: "/api/bitacora-auditoria",
    listKey: "registros",
    fields: [
      { name: "usuario_id", label: "Usuario", type: "ref", refModule: "usuarios", refDisplay: "correo", required: true },
      { name: "accion_ejecutada", label: "Acción ejecutada", type: "text", required: true, uppercase: true, placeholder: "Ej. LOGIN, CREAR_LUGAR" },
    ],
  },

  {
    key: "tickets-soporte",
    label: "Tickets de Soporte",
    icon: "bi-life-preserver",
    endpoint: "/api/tickets-soporte",
    listKey: "tickets",
    fields: [
      { name: "ticket_numero", label: "Número de ticket", type: "text", required: true, uppercase: true },
      { name: "usuario_id", label: "Usuario", type: "ref", refModule: "usuarios", refDisplay: "correo", required: true },
      { name: "asunto", label: "Asunto", type: "text", required: true },
      { name: "mensaje", label: "Mensaje", type: "textarea", required: true },
      { name: "estado", label: "Estado", type: "select", required: true, options: ["abierto", "en_proceso", "cerrado"] },
    ],
  },
];

// Acceso rápido por key
const MODULES_BY_KEY = Object.fromEntries(MODULES.map((m) => [m.key, m]));
