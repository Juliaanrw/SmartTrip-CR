

const API_ROOT = 'http://localhost:3000/api';



function esc(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

function formatearColones(valor) {
  const numero = Number(valor) || 0;
  return numero.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function obtenerCosto(lugar) {
  const valor = lugar.costo_ingreso;
  if (valor && typeof valor === 'object' && '$numberDecimal' in valor) {
    return valor.$numberDecimal;
  }
  return valor;
}

function formatFecha(valor) {
  if (!valor) return '—';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '—';
  return fecha.toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric' });
}

function estrellas(calificacion) {
  const n = Number(calificacion) || 0;
  const llenas = '★'.repeat(n);
  const vacias = '☆'.repeat(Math.max(0, 5 - n));
  return `<span class="st-estrellas" title="${n} de 5">${llenas}${vacias}</span>`;
}

const CATEGORIA_CONFIG = {
  'Playa': { clase: 'badge-cat-playa', icono: 'bi-water' },
  'Montaña': { clase: 'badge-cat-montana', icono: 'bi-triangle-fill' },
  'Volcán': { clase: 'badge-cat-volcan', icono: 'bi-fire' },
  'Parque Nacional': { clase: 'badge-cat-parque', icono: 'bi-tree-fill' },
  'Catarata': { clase: 'badge-cat-catarata', icono: 'bi-droplet-fill' },
  'Cultural': { clase: 'badge-cat-cultural', icono: 'bi-bank2' },
  'Aventura': { clase: 'badge-cat-aventura', icono: 'bi-compass-fill' },
};

function badgeCategoria(categoria) {
  const config = CATEGORIA_CONFIG[categoria] || { clase: 'badge-cat-otro', icono: 'bi-geo-alt-fill' };
  return `<span class="badge badge-categoria ${config.clase}"><i class="bi ${config.icono} me-1"></i>${esc(categoria)}</span>`;
}

function badgeRol(rol) {
  const clase = { turista: 'badge-rol-turista', administrador: 'badge-rol-administrador', proveedor: 'badge-rol-proveedor' }[rol] || 'badge-cat-otro';
  return `<span class="badge ${clase}">${esc(rol)}</span>`;
}

function badgeEstado(estado) {
  const clase = estado === 'activo' ? 'badge-estado-activo' : 'badge-estado-inactivo';
  return `<span class="badge ${clase}">${esc(estado)}</span>`;
}



const ENTIDADES = [
  {
    key: 'lugares',
    label: 'Lugares Turísticos',
    icon: 'bi-geo-alt-fill',
    endpoint: `${API_ROOT}/lugares`,
    listKey: 'lugares',
    singularKey: 'lugar',
    nombreSingular: 'lugar turístico',
    idField: '_id',
    campos: [
      { id: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej. Playa Conchal' },
      { id: 'provincia', label: 'Provincia', type: 'select', required: true, options: ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'] },
      { id: 'canton', label: 'Cantón', type: 'text', required: true, placeholder: 'Ej. Santa Cruz' },
      { id: 'categoria', label: 'Categoría', type: 'select', required: true, options: ['Playa', 'Montaña', 'Volcán', 'Parque Nacional', 'Catarata', 'Cultural', 'Aventura'] },
      { id: 'costo_ingreso', label: 'Costo de ingreso (₡)', type: 'number', required: true, min: 0, step: 0.01, placeholder: '0.00' },
    ],
    columnas: [
      { header: 'Nombre', render: (r) => `<span class="fw-semibold">${esc(r.nombre)}</span>` },
      { header: 'Provincia', render: (r) => esc(r.provincia) },
      { header: 'Cantón', render: (r) => esc(r.canton) },
      { header: 'Categoría', render: (r) => badgeCategoria(r.categoria) },
      { header: 'Costo (₡)', align: 'end', render: (r) => `₡${formatearColones(obtenerCosto(r))}` },
    ],
    filtro: (r, termino) => [r.nombre, r.provincia, r.canton, r.categoria].filter(Boolean).some((c) => c.toLowerCase().includes(termino)),
  },
  {
    key: 'usuarios',
    label: 'Usuarios',
    icon: 'bi-people-fill',
    endpoint: `${API_ROOT}/usuarios`,
    listKey: 'usuarios',
    singularKey: 'usuario',
    nombreSingular: 'usuario',
    idField: '_id',
    campos: [
      { id: 'correo', label: 'Correo', type: 'email', required: true, placeholder: 'nombre@correo.com' },
      {
        id: 'contrasena_hash',
        label: 'Contraseña',
        type: 'password',
        required: (esEdicion) => !esEdicion,
        placeholder: 'Mínimo 6 caracteres',
        ayudaEdicion: 'Dejar en blanco para mantener la actual.',
      },
      { id: 'rol', label: 'Rol', type: 'select', required: true, options: ['turista', 'administrador', 'proveedor'] },
      { id: 'estado', label: 'Estado', type: 'select', required: true, options: ['activo', 'inactivo'] },
    ],
    columnas: [
      { header: 'Correo', render: (r) => `<span class="fw-semibold">${esc(r.correo)}</span>` },
      { header: 'Rol', render: (r) => badgeRol(r.rol) },
      { header: 'Estado', render: (r) => badgeEstado(r.estado) },
      { header: 'Creado', render: (r) => formatFecha(r.fecha_creacion) },
    ],
    filtro: (r, termino) => [r.correo, r.rol, r.estado].filter(Boolean).some((c) => c.toLowerCase().includes(termino)),
  },
  {
    key: 'itinerarios',
    label: 'Itinerarios',
    icon: 'bi-map-fill',
    endpoint: `${API_ROOT}/itinerarios`,
    listKey: 'itinerarios',
    singularKey: 'itinerario',
    nombreSingular: 'itinerario',
    idField: '_id',
    campos: [
      { id: 'nombre_viaje', label: 'Nombre del viaje', type: 'text', required: true, placeholder: 'Ej. Aventura en Guanacaste' },
      { id: 'creador_id', label: 'Creador', type: 'reference', required: true, refEntidad: 'usuarios', refLabel: (u) => u.correo },
      { id: 'dias_duracion', label: 'Duración (días)', type: 'number', required: true, min: 1, step: 1, placeholder: 'Ej. 5' },
      { id: 'fecha_inicio', label: 'Fecha de inicio', type: 'date', required: true },
      { id: 'detalles_itinerario', label: 'Detalles', type: 'textarea', required: true, placeholder: 'Describe las actividades planificadas...' },
    ],
    columnas: [
      { header: 'Viaje', render: (r) => `<span class="fw-semibold">${esc(r.nombre_viaje)}</span>` },
      { header: 'Creador', render: (r) => esc(r.creador_id?.correo ?? '—') },
      { header: 'Duración', align: 'center', render: (r) => `${r.dias_duracion} día(s)` },
      { header: 'Inicio', render: (r) => formatFecha(r.fecha_inicio) },
    ],
    filtro: (r, termino) => [r.nombre_viaje, r.creador_id?.correo, r.detalles_itinerario].filter(Boolean).some((c) => c.toLowerCase().includes(termino)),
  },
  {
    key: 'resenas',
    label: 'Reseñas',
    icon: 'bi-star-fill',
    endpoint: `${API_ROOT}/resenas-lugares`,
    listKey: 'resenas',
    singularKey: 'resena',
    nombreSingular: 'reseña',
    idField: '_id',
    campos: [
      { id: 'lugar_id', label: 'Lugar turístico', type: 'reference', required: true, refEntidad: 'lugares', refLabel: (l) => l.nombre },
      { id: 'usuario_id', label: 'Usuario', type: 'reference', required: true, refEntidad: 'usuarios', refLabel: (u) => u.correo },
      { id: 'calificacion', label: 'Calificación (1 a 5)', type: 'number', required: true, min: 1, max: 5, step: 1, placeholder: '1-5' },
      { id: 'comentario', label: 'Comentario', type: 'textarea', required: true, placeholder: 'Escribe tu experiencia...' },
    ],
    columnas: [
      { header: 'Lugar', render: (r) => esc(r.lugar_id?.nombre ?? '—') },
      { header: 'Usuario', render: (r) => esc(r.usuario_id?.correo ?? '—') },
      { header: 'Calificación', align: 'center', render: (r) => estrellas(r.calificacion) },
      { header: 'Comentario', render: (r) => `<span class="text-truncate-cell" title="${esc(r.comentario)}">${esc(r.comentario)}</span>` },
    ],
    filtro: (r, termino) => [r.lugar_id?.nombre, r.usuario_id?.correo, r.comentario].filter(Boolean).some((c) => c.toLowerCase().includes(termino)),
  },
];

const estado = {};
ENTIDADES.forEach((entidad) => {
  estado[entidad.key] = { cache: [], idEnEdicion: null, ultimoIdGuardado: null, idPendienteEliminar: null, nombrePendienteEliminar: null };
});

let deleteModal;
let entidadActiva = ENTIDADES[0].key;



function construirInterfaz() {
  const tabsEl = document.getElementById('entity-tabs');
  const contentEl = document.getElementById('tab-content');

  tabsEl.innerHTML = ENTIDADES.map(
    (entidad, i) => `
    <li class="nav-item">
      <button class="nav-link ${i === 0 ? 'active' : ''}" data-tab="${entidad.key}" type="button">
        <i class="bi ${entidad.icon} me-1"></i>${entidad.label}
      </button>
    </li>
  `
  ).join('');

  contentEl.innerHTML = ENTIDADES.map((entidad, i) => construirPanel(entidad, i === 0)).join('');

  tabsEl.querySelectorAll('button[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => cambiarTab(btn.dataset.tab));
  });
}

function construirPanel(entidad, visible) {
  return `
    <div class="entity-panel ${visible ? '' : 'd-none'}" id="panel-${entidad.key}">
      <div class="row g-4">
        <!-- Formulario -->
        <div class="col-lg-4">
          <div class="card shadow-sm st-card">
            <div class="card-body">
              <h2 class="h5 card-title mb-3" id="form-title-${entidad.key}">
                <i class="bi bi-plus-circle me-1"></i> Agregar ${entidad.nombreSingular}
              </h2>

              <form id="form-${entidad.key}" class="st-form" novalidate>
                <input type="hidden" id="id-${entidad.key}" />
                ${entidad.campos.map((campo) => construirCampo(entidad, campo)).join('')}

                <div class="d-flex gap-2 mt-1">
                  <button type="submit" class="btn st-btn-primary flex-fill" id="submit-btn-${entidad.key}">
                    <i class="bi bi-save2 me-1"></i> Guardar
                  </button>
                  <button type="button" class="btn btn-outline-secondary d-none" id="cancel-btn-${entidad.key}">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Tabla -->
        <div class="col-lg-8">
          <div class="card shadow-sm st-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="h5 card-title mb-0 d-flex align-items-center gap-2">
                  <i class="bi ${entidad.icon}"></i> ${entidad.label}
                  <span class="badge rounded-pill st-badge-count" id="contador-${entidad.key}">0</span>
                </h2>
                <button class="btn btn-sm btn-outline-secondary" id="refresh-btn-${entidad.key}">
                  <i class="bi bi-arrow-clockwise"></i> Actualizar
                </button>
              </div>

              <div class="mb-3">
                <div class="input-group">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control" id="buscador-${entidad.key}" placeholder="Buscar en ${entidad.label.toLowerCase()}..." />
                </div>
              </div>

              <div id="alert-box-${entidad.key}"></div>

              <div class="table-responsive">
                <table class="table table-hover align-middle">
                  <thead>
                    <tr>
                      ${entidad.columnas.map((c) => `<th class="${c.align === 'end' ? 'text-end' : c.align === 'center' ? 'text-center' : ''}">${c.header}</th>`).join('')}
                      <th class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="tbody-${entidad.key}">
                    <tr>
                      <td colspan="${entidad.columnas.length + 1}" class="text-center text-muted py-4">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Cargando...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function construirCampo(entidad, campo) {
  const requerido = typeof campo.required === 'function' ? campo.required(false) : campo.required;
  const idCompleto = `${campo.id}-${entidad.key}`;

  let control = '';

  if (campo.type === 'select') {
    control = `
      <select class="form-select" id="${idCompleto}" ${requerido ? 'required' : ''}>
        <option value="" selected disabled>Seleccione...</option>
        ${campo.options.map((op) => `<option value="${esc(op)}">${esc(op)}</option>`).join('')}
      </select>`;
  } else if (campo.type === 'reference') {
    control = `
      <select class="form-select" id="${idCompleto}" ${requerido ? 'required' : ''} data-ref-entidad="${campo.refEntidad}">
        <option value="" selected disabled>Cargando opciones...</option>
      </select>`;
  } else if (campo.type === 'textarea') {
    control = `<textarea class="form-control" id="${idCompleto}" rows="3" ${requerido ? 'required' : ''} placeholder="${esc(campo.placeholder || '')}"></textarea>`;
  } else {
    const extra = [
      campo.min !== undefined ? `min="${campo.min}"` : '',
      campo.max !== undefined ? `max="${campo.max}"` : '',
      campo.step !== undefined ? `step="${campo.step}"` : '',
    ].join(' ');
    control = `<input type="${campo.type}" class="form-control" id="${idCompleto}" ${requerido ? 'required' : ''} ${extra} placeholder="${esc(campo.placeholder || '')}" />`;
  }

  return `
    <div class="mb-3">
      <label for="${idCompleto}" class="form-label">${esc(campo.label)}</label>
      ${control}
      ${campo.ayudaEdicion ? `<div class="form-text d-none" id="ayuda-${idCompleto}">${esc(campo.ayudaEdicion)}</div>` : ''}
      <div class="invalid-feedback">Este campo es obligatorio.</div>
    </div>`;
}

function cambiarTab(key) {
  entidadActiva = key;
  document.querySelectorAll('.entity-panel').forEach((p) => p.classList.add('d-none'));
  document.getElementById(`panel-${key}`).classList.remove('d-none');
  document.querySelectorAll('button[data-tab]').forEach((b) => b.classList.toggle('active', b.dataset.tab === key));
}



async function cargarOpcionesReferencia(entidad) {
  const camposReferencia = entidad.campos.filter((c) => c.type === 'reference');
  if (camposReferencia.length === 0) return;

  for (const campo of camposReferencia) {
    const refEntidad = ENTIDADES.find((e) => e.key === campo.refEntidad);
    try {
      const respuesta = await fetch(refEntidad.endpoint);
      const datos = await respuesta.json();
      const lista = datos[refEntidad.listKey] || [];
      const select = document.getElementById(`${campo.id}-${entidad.key}`);
      if (!select) continue;

      select.innerHTML =
        `<option value="" selected disabled>Seleccione...</option>` +
        lista.map((item) => `<option value="${item[refEntidad.idField]}">${esc(campo.refLabel(item))}</option>`).join('');
    } catch (error) {
      console.error(`No se pudieron cargar las opciones de ${campo.refEntidad}`, error);
    }
  }
}


function resetearFormulario(entidad) {
  const form = document.getElementById(`form-${entidad.key}`);
  form.reset();
  form.classList.remove('was-validated', 'editing');
  document.getElementById(`id-${entidad.key}`).value = '';
  document.getElementById(`form-title-${entidad.key}`).innerHTML = `<i class="bi bi-plus-circle me-1"></i> Agregar ${entidad.nombreSingular}`;
  document.getElementById(`submit-btn-${entidad.key}`).innerHTML = '<i class="bi bi-save2 me-1"></i> Guardar';
  document.getElementById(`cancel-btn-${entidad.key}`).classList.add('d-none');
  estado[entidad.key].idEnEdicion = null;

  entidad.campos.forEach((campo) => {
    if (campo.ayudaEdicion) {
      document.getElementById(`ayuda-${campo.id}-${entidad.key}`)?.classList.add('d-none');
    }
    const input = document.getElementById(`${campo.id}-${entidad.key}`);
    if (input && typeof campo.required === 'function') {
      input.required = campo.required(false);
    }
  });
}

function entrarModoEdicion(entidad, registro) {
  const form = document.getElementById(`form-${entidad.key}`);
  const id = registro[entidad.idField];
  document.getElementById(`id-${entidad.key}`).value = id;
  estado[entidad.key].idEnEdicion = id;

  entidad.campos.forEach((campo) => {
    const input = document.getElementById(`${campo.id}-${entidad.key}`);
    if (!input) return;

    if (campo.type === 'reference') {
      const valorRef = registro[campo.id];
      input.value = typeof valorRef === 'object' && valorRef !== null ? valorRef._id : valorRef;
    } else if (campo.type === 'date') {
      const fecha = registro[campo.id] ? new Date(registro[campo.id]) : null;
      input.value = fecha ? fecha.toISOString().slice(0, 10) : '';
    } else if (campo.id === 'costo_ingreso') {
      input.value = obtenerCosto(registro);
    } else if (campo.type === 'password') {
      input.value = '';
      input.required = false;
      document.getElementById(`ayuda-${campo.id}-${entidad.key}`)?.classList.remove('d-none');
    } else {
      input.value = registro[campo.id] ?? '';
    }
  });

  form.classList.add('editing');
  document.getElementById(`form-title-${entidad.key}`).innerHTML = `<i class="bi bi-pencil-square me-1"></i> Editar ${entidad.nombreSingular}`;
  document.getElementById(`submit-btn-${entidad.key}`).innerHTML = '<i class="bi bi-arrow-repeat me-1"></i> Actualizar';
  document.getElementById(`cancel-btn-${entidad.key}`).classList.remove('d-none');
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function mostrarAlerta(entidad, mensaje, tipo = 'success') {
  document.getElementById(`alert-box-${entidad.key}`).innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}


function renderizarEstadoVacio(entidad, mensaje) {
  const tbody = document.getElementById(`tbody-${entidad.key}`);
  tbody.innerHTML = `
    <tr>
      <td colspan="${entidad.columnas.length + 1}" class="text-center text-muted">
        <div class="st-empty-state">
          <i class="bi bi-inbox d-block mb-2"></i>
          <p class="mb-2">${mensaje}</p>
        </div>
      </td>
    </tr>`;
}

function renderizarTabla(entidad, registros) {
  const tbody = document.getElementById(`tbody-${entidad.key}`);

  if (!registros || registros.length === 0) {
    renderizarEstadoVacio(entidad, `Aún no hay registros en ${entidad.label.toLowerCase()}.`);
    return;
  }

  tbody.innerHTML = registros
    .map((registro) => {
      const id = registro[entidad.idField];
      const esNueva = id === estado[entidad.key].ultimoIdGuardado;
      const celdas = entidad.columnas
        .map((c) => `<td class="${c.align === 'end' ? 'text-end' : c.align === 'center' ? 'text-center' : ''}">${c.render(registro)}</td>`)
        .join('');
      return `
      <tr data-id="${id}" class="${esNueva ? 'fila-nueva' : ''}">
        ${celdas}
        <td class="text-center">
          <button class="btn btn-sm btn-outline-primary me-1 btn-editar" title="Editar">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      </tr>`;
    })
    .join('');

  estado[entidad.key].ultimoIdGuardado = null;
}

function actualizarContador(entidad, valor) {
  document.getElementById(`contador-${entidad.key}`).textContent = valor;
}

function filtrarYRenderizar(entidad) {
  const buscador = document.getElementById(`buscador-${entidad.key}`);
  const termino = buscador.value.trim().toLowerCase();
  const cache = estado[entidad.key].cache;

  if (!termino) {
    renderizarTabla(entidad, cache);
    actualizarContador(entidad, cache.length);
    return;
  }

  const filtrados = cache.filter((r) => entidad.filtro(r, termino));
  actualizarContador(entidad, `${filtrados.length} / ${cache.length}`);

  if (filtrados.length === 0) {
    renderizarEstadoVacio(entidad, 'Ningún registro coincide con tu búsqueda.');
  } else {
    renderizarTabla(entidad, filtrados);
  }
}


async function cargarDatos(entidad) {
  const tbody = document.getElementById(`tbody-${entidad.key}`);
  tbody.innerHTML = `
    <tr>
      <td colspan="${entidad.columnas.length + 1}" class="text-center text-muted py-4">
        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
        Cargando...
      </td>
    </tr>`;

  try {
    const respuesta = await fetch(entidad.endpoint);
    if (!respuesta.ok) throw new Error(`No se pudo obtener ${entidad.label.toLowerCase()}`);
    const datos = await respuesta.json();
    const lista = datos[entidad.listKey] || [];
    estado[entidad.key].cache = lista;
    actualizarContador(entidad, datos.cantidad ?? lista.length);
    renderizarTabla(entidad, lista);
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="${entidad.columnas.length + 1}" class="text-center text-danger py-4">
          <i class="bi bi-wifi-off fs-4 d-block mb-1"></i>
          No se pudo conectar con la API. Verifique que el servidor esté corriendo.
        </td>
      </tr>`;
    console.error(error);
  }
}

async function guardarRegistro(entidad, datos, id) {
  const url = id ? `${entidad.endpoint}/${id}` : entidad.endpoint;
  const metodo = id ? 'PUT' : 'POST';

  const respuesta = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || `Ocurrió un error al guardar ${entidad.nombreSingular}`);
  }

  return resultado[entidad.singularKey] ?? resultado;
}

async function eliminarRegistro(entidad, id) {
  const respuesta = await fetch(`${entidad.endpoint}/${id}`, { method: 'DELETE' });
  const resultado = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || `Ocurrió un error al eliminar ${entidad.nombreSingular}`);
  }

  return resultado;
}


function activarEventos(entidad) {
  const form = document.getElementById(`form-${entidad.key}`);
  const submitBtn = document.getElementById(`submit-btn-${entidad.key}`);
  const cancelBtn = document.getElementById(`cancel-btn-${entidad.key}`);
  const refreshBtn = document.getElementById(`refresh-btn-${entidad.key}`);
  const buscador = document.getElementById(`buscador-${entidad.key}`);
  const tbody = document.getElementById(`tbody-${entidad.key}`);

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    if (!form.checkValidity()) {
      evento.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    const id = document.getElementById(`id-${entidad.key}`).value || null;
    const datos = {};

    entidad.campos.forEach((campo) => {
      const input = document.getElementById(`${campo.id}-${entidad.key}`);
      let valor = input.value;

      if (campo.type === 'password' && id && !valor) {
        return;
      }
      if (campo.type === 'number') {
        valor = valor === '' ? undefined : Number(valor);
      }
      if (valor !== undefined && valor !== '') {
        datos[campo.id] = valor;
      }
    });

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Guardando...`;

    try {
      const registroGuardado = await guardarRegistro(entidad, datos, id);
      estado[entidad.key].ultimoIdGuardado = registroGuardado?.[entidad.idField] ?? null;
      mostrarAlerta(entidad, id ? `${capitaliza(entidad.nombreSingular)} actualizado correctamente.` : `${capitaliza(entidad.nombreSingular)} agregado correctamente.`, 'success');
      resetearFormulario(entidad);
      buscador.value = '';
      await cargarDatos(entidad);
    } catch (error) {
      mostrarAlerta(entidad, error.message, 'danger');
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = id ? '<i class="bi bi-arrow-repeat me-1"></i> Actualizar' : '<i class="bi bi-save2 me-1"></i> Guardar';
    }
  });

  cancelBtn.addEventListener('click', () => resetearFormulario(entidad));
  refreshBtn.addEventListener('click', () => {
    buscador.value = '';
    cargarDatos(entidad);
  });
  buscador.addEventListener('input', () => filtrarYRenderizar(entidad));

  tbody.addEventListener('click', async (evento) => {
    const fila = evento.target.closest('tr[data-id]');
    if (!fila) return;
    const id = fila.dataset.id;

    if (evento.target.closest('.btn-editar')) {
      try {
        const respuesta = await fetch(`${entidad.endpoint}/${id}`);
        if (!respuesta.ok) throw new Error(`No se pudo cargar ${entidad.nombreSingular}`);
        const registro = await respuesta.json();
        await cargarOpcionesReferencia(entidad);
        entrarModoEdicion(entidad, registro);
      } catch (error) {
        mostrarAlerta(entidad, error.message, 'danger');
      }
    }

    if (evento.target.closest('.btn-eliminar')) {
      estado[entidad.key].idPendienteEliminar = id;
      estado[entidad.key].nombrePendienteEliminar = fila.querySelector('td')?.textContent ?? 'este registro';
      document.getElementById('delete-target-name').textContent = estado[entidad.key].nombrePendienteEliminar;
      document.getElementById('confirm-delete-btn').dataset.entidad = entidad.key;
      deleteModal.show();
    }
  });
}

function capitaliza(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}


document.addEventListener('DOMContentLoaded', async () => {
  construirInterfaz();
  deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

  document.getElementById('confirm-delete-btn').addEventListener('click', async (evento) => {
    const key = evento.currentTarget.dataset.entidad;
    const entidad = ENTIDADES.find((e) => e.key === key);
    const info = estado[key];
    if (!entidad || !info.idPendienteEliminar) return;

    try {
      await eliminarRegistro(entidad, info.idPendienteEliminar);
      mostrarAlerta(entidad, `${capitaliza(entidad.nombreSingular)} eliminado correctamente.`, 'success');
      deleteModal.hide();
      await cargarDatos(entidad);
    } catch (error) {
      mostrarAlerta(entidad, error.message, 'danger');
    } finally {
      info.idPendienteEliminar = null;
      info.nombrePendienteEliminar = null;
    }
  });

  for (const entidad of ENTIDADES) {
    activarEventos(entidad);
    await cargarOpcionesReferencia(entidad);
    await cargarDatos(entidad);
  }
});