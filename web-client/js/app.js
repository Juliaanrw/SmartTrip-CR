const API_BASE_URL = "http://localhost:3000";

let moduloActivo = null;
let registrosActuales = [];
let registrosFiltrados = [];
let cacheReferencias = {};
let idPendienteEliminar = null;
let deleteModal;

const navModulos = document.getElementById("nav-modulos");
const navLoading = document.getElementById("nav-loading");
const statsBar = document.getElementById("stats-bar");
const moduloTitulo = document.getElementById("modulo-titulo");
const moduloIcono = document.getElementById("modulo-icono");
const formTitle = document.getElementById("form-title");
const dynamicForm = document.getElementById("dynamic-form");
const formFields = document.getElementById("form-fields");
const idInput = document.getElementById("registro-id");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const refreshBtn = document.getElementById("refresh-btn");
const buscador = document.getElementById("buscador");
const tableHead = document.getElementById("table-head");
const tableBody = document.getElementById("table-body");
const deleteTargetLabel = document.getElementById("delete-target-label");
const toastContainer = document.getElementById("toast-container");

document.addEventListener("DOMContentLoaded", () => {
  deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  construirNav();
  cargarEstadisticas();
  seleccionarModulo(MODULES[0].key);
});

// Navegación entre módulos

function construirNav() {
  navModulos.innerHTML = MODULES.map(
    (m) => `
      <button type="button" class="list-group-item list-group-item-action st-nav-item" data-key="${m.key}">
        <i class="bi ${m.icon} me-2"></i>${m.label}
      </button>
    `
  ).join("");

  navModulos.querySelectorAll(".st-nav-item").forEach((btn) => {
    btn.addEventListener("click", () => seleccionarModulo(btn.dataset.key));
  });
}

async function seleccionarModulo(key) {
  moduloActivo = MODULES_BY_KEY[key];
  if (!moduloActivo) return;

  navModulos.querySelectorAll(".st-nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.key === key);
  });

  moduloTitulo.textContent = moduloActivo.label;
  moduloIcono.className = `bi ${moduloActivo.icon} me-2`;
  buscador.value = "";

  navLoading.classList.remove("d-none");
  await precargarReferencias();
  construirFormulario();
  resetearFormulario();
  await cargarRegistros();
  navLoading.classList.add("d-none");
  enfocarPrimerCampo();
}

// Estadísticas (dashboard superior)

async function cargarEstadisticas() {
  const acentos = ["forest", "ocean", "sunset", "orchid"];

  statsBar.innerHTML = MODULES.map(
    (m, i) => `
      <div class="col-6 col-md-3 col-lg-2">
        <div class="st-stat-card" data-stat-key="${m.key}" data-accent="${acentos[i % acentos.length]}">
          <div class="st-stat-num"><div class="spinner-border spinner-border-sm text-secondary" role="status"></div></div>
          <div class="st-stat-label"><i class="bi ${m.icon} me-1"></i>${m.label}</div>
        </div>
      </div>
    `
  ).join("");

  MODULES.forEach(async (m) => {
    try {
      const resp = await fetch(`${API_BASE_URL}${m.endpoint}`);
      const data = await resp.json();
      const total = (data[m.listKey] || []).length;
      const el = statsBar.querySelector(`[data-stat-key="${m.key}"] .st-stat-num`);
      if (el) el.textContent = total;
    } catch (error) {
      const el = statsBar.querySelector(`[data-stat-key="${m.key}"] .st-stat-num`);
      if (el) el.innerHTML = '<i class="bi bi-x-circle text-danger"></i>';
    }
  });
}

function actualizarEstadistica(key, total) {
  const el = statsBar.querySelector(`[data-stat-key="${key}"] .st-stat-num`);
  if (el) el.textContent = total;
}

// Precarga de listas para los selects tipo "ref"

async function precargarReferencias() {
  const refModules = [...new Set(moduloActivo.fields.filter((f) => f.type === "ref").map((f) => f.refModule))];

  await Promise.all(
    refModules.map(async (key) => {
      if (cacheReferencias[key]) return;
      const mod = MODULES_BY_KEY[key];
      try {
        const resp = await fetch(`${API_BASE_URL}${mod.endpoint}`);
        const data = await resp.json();
        cacheReferencias[key] = data[mod.listKey] || [];
      } catch (error) {
        cacheReferencias[key] = [];
        console.error(`No se pudo precargar ${key} para los selects de referencia`, error);
      }
    })
  );
}

// Construcción dinámica del formulario

function construirFormulario() {
  formFields.innerHTML = moduloActivo.fields
    .map((f) => {
      const reqAttr = f.required ? "required" : "";
      const idAttr = `campo-${f.name}`;

      if (f.type === "select") {
        const opts = f.options.map((o) => `<option value="${o}">${o}</option>`).join("");
        return campoWrapper(
          f,
          `<select class="form-select" id="${idAttr}" ${reqAttr}>
             <option value="" selected disabled>Seleccione...</option>
             ${opts}
           </select>`
        );
      }

      if (f.type === "ref") {
        const lista = cacheReferencias[f.refModule] || [];
        const opts = lista
          .map((item) => `<option value="${item._id}">${escaparHtml(item[f.refDisplay])}</option>`)
          .join("");
        return campoWrapper(
          f,
          `<select class="form-select" id="${idAttr}" ${reqAttr}>
             <option value="" selected disabled>Seleccione...</option>
             ${opts}
           </select>`
        );
      }

      if (f.type === "textarea") {
        return campoWrapper(
          f,
          `<textarea class="form-control" id="${idAttr}" rows="3" ${reqAttr} placeholder="${f.placeholder || ""}"></textarea>`
        );
      }

      if (f.type === "password") {
        return campoWrapper(
          f,
          `<div class="input-group">
             <input type="password" class="form-control" id="${idAttr}" ${reqAttr} placeholder="${f.placeholder || ""}" />
             <button class="btn btn-outline-secondary" type="button" id="toggle-${idAttr}" aria-label="Mostrar u ocultar contraseña">
               <i class="bi bi-eye"></i>
             </button>
           </div>`
        );
      }

      const extra = [
        f.min !== undefined ? `min="${f.min}"` : "",
        f.max !== undefined ? `max="${f.max}"` : "",
        f.step !== undefined ? `step="${f.step}"` : "",
      ].join(" ");

      return campoWrapper(
        f,
        `<input type="${f.type}" class="form-control" id="${idAttr}" ${reqAttr} ${extra} placeholder="${f.placeholder || ""}" />`
      );
    })
    .join("");

  moduloActivo.fields
    .filter((f) => f.type === "password")
    .forEach((f) => {
      const idAttr = `campo-${f.name}`;
      const btn = document.getElementById(`toggle-${idAttr}`);
      const input = document.getElementById(idAttr);
      btn.addEventListener("click", () => {
        const esPassword = input.type === "password";
        input.type = esPassword ? "text" : "password";
        btn.querySelector("i").className = esPassword ? "bi bi-eye-slash" : "bi bi-eye";
      });
    });
}

function campoWrapper(field, inputHtml) {
  return `
    <div class="mb-3">
      <label for="campo-${field.name}" class="form-label">${field.label}</label>
      ${inputHtml}
      <div class="invalid-feedback">Este campo es obligatorio.</div>
    </div>
  `;
}

function enfocarPrimerCampo() {
  const primerInput = formFields.querySelector("input, select, textarea");
  if (primerInput) primerInput.focus();
}

// Renderizado de la tabla

function construirEncabezadoTabla() {
  const columnas = moduloActivo.fields.map((f) => `<th>${f.label}</th>`).join("");
  tableHead.innerHTML = `<tr>${columnas}<th class="text-center">Acciones</th></tr>`;
}

function renderEstrellas(valor) {
  const n = Number(valor) || 0;
  let html = '<span class="st-stars" title="' + n + ' de 5">';
  for (let i = 1; i <= 5; i++) {
    html += `<i class="bi ${i <= n ? "bi-star-fill" : "bi-star"}"></i>`;
  }
  html += "</span>";
  return html;
}

function valorParaTabla(registro, field) {
  let valor = registro[field.name];

  if (field.renderAsStars) {
    return renderEstrellas(valor);
  }

  if (field.type === "ref") {
    if (valor && typeof valor === "object") {
      return escaparHtml(String(valor[field.refDisplay] ?? valor._id ?? ""));
    }
    return escaparHtml(String(valor ?? ""));
  }

  if (field.isList && Array.isArray(valor)) {
    return escaparHtml(valor.join(", "));
  }

  if (field.type === "password") {
    return valor ? "••••••••" : '<span class="text-muted">—</span>';
  }

  if (field.type === "number" && valor && valor.$numberDecimal !== undefined) {
    return escaparHtml(Number(valor.$numberDecimal).toLocaleString("es-CR", { minimumFractionDigits: 2 }));
  }

  if (field.type === "date" && valor) {
    return new Date(valor).toLocaleDateString("es-CR");
  }

  const texto = String(valor ?? "");
  const escapado = escaparHtml(texto);
  if (field.type === "textarea" && texto.length > 40) {
    return `<span title="${escapado}">${escapado}</span>`;
  }

  return escapado;
}

function renderizarTabla(lista) {
  construirEncabezadoTabla();

  if (!lista || lista.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="${moduloActivo.fields.length + 1}" class="text-center text-muted py-4">
          <i class="bi bi-inbox fs-4 d-block mb-1"></i>
          No hay registros que coincidan en ${escaparHtml(moduloActivo.label)}.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = lista
    .map((registro) => {
      const id = registro._id;
      const celdas = moduloActivo.fields.map((f) => `<td>${valorParaTabla(registro, f)}</td>`).join("");
      return `
        <tr data-id="${id}">
          ${celdas}
          <td class="text-center text-nowrap">
            <button class="btn btn-sm btn-outline-primary me-1 btn-editar" title="Editar" aria-label="Editar registro">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar" aria-label="Eliminar registro">
              <i class="bi bi-trash-fill"></i>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

// Buscador 

buscador.addEventListener("keyup", () => {
  const texto = buscador.value.trim().toLowerCase();

  if (!texto) {
    registrosFiltrados = registrosActuales;
    renderizarTabla(registrosFiltrados);
    return;
  }

  registrosFiltrados = registrosActuales.filter((registro) =>
    moduloActivo.fields.some((f) => {
      const plano = valorParaTabla(registro, f).replace(/<[^>]*>/g, "").toLowerCase();
      return plano.includes(texto);
    })
  );

  renderizarTabla(registrosFiltrados);
});

// Utilidades de UI

function mostrarToast(mensaje, tipo = "success") {
  const id = "toast-" + Date.now();
  const icono = tipo === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill";
  const html = `
    <div id="${id}" class="toast align-items-center text-bg-${tipo} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body"><i class="bi ${icono} me-2"></i>${mensaje}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;
  toastContainer.insertAdjacentHTML("beforeend", html);
  const toastEl = document.getElementById(id);
  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();
  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

function resetearFormulario() {
  dynamicForm.reset();
  dynamicForm.classList.remove("was-validated", "editing");
  idInput.value = "";
  formTitle.innerHTML = `<i class="bi bi-plus-circle me-1"></i> Agregar registro`;
  submitBtn.innerHTML = `<i class="bi bi-save2 me-1"></i> Guardar`;
  cancelBtn.classList.add("d-none");

  const campoPass = moduloActivo.fields.find((f) => f.requiredOnCreateOnly);
  if (campoPass) {
    document.getElementById(`campo-${campoPass.name}`).required = true;
  }
}

function entrarModoEdicion(registro) {
  idInput.value = registro._id;

  moduloActivo.fields.forEach((f) => {
    const input = document.getElementById(`campo-${f.name}`);
    if (!input) return;

    let valor = registro[f.name];

    if (f.type === "ref" && valor && typeof valor === "object") {
      valor = valor._id;
    }
    if (f.isList && Array.isArray(valor)) {
      valor = valor.join(", ");
    }
    if (f.type === "number" && valor && valor.$numberDecimal !== undefined) {
      valor = valor.$numberDecimal;
    }
    if (f.type === "date" && valor) {
      valor = new Date(valor).toISOString().split("T")[0];
    }
    if (f.type === "password") {
      valor = "";
      input.required = false;
    }

    input.value = valor ?? "";
  });

  dynamicForm.classList.add("editing");
  formTitle.innerHTML = `<i class="bi bi-pencil-square me-1"></i> Editar registro`;
  submitBtn.innerHTML = `<i class="bi bi-arrow-repeat me-1"></i> Actualizar`;
  cancelBtn.classList.remove("d-none");

  dynamicForm.scrollIntoView({ behavior: "smooth", block: "start" });
  enfocarPrimerCampo();
}

// Llamadas a la API

async function cargarRegistros() {
  tableHead.innerHTML = "";
  tableBody.innerHTML = `
    <tr>
      <td class="text-center text-muted py-4">
        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
        Cargando...
      </td>
    </tr>
  `;

  try {
    const respuesta = await fetch(`${API_BASE_URL}${moduloActivo.endpoint}`);
    if (!respuesta.ok) throw new Error("No se pudo obtener la lista");
    const data = await respuesta.json();
    registrosActuales = data[moduloActivo.listKey] || [];
    registrosFiltrados = registrosActuales;

    cacheReferencias[moduloActivo.key] = registrosActuales;
    actualizarEstadistica(moduloActivo.key, registrosActuales.length);

    renderizarTabla(registrosFiltrados);
  } catch (error) {
    construirEncabezadoTabla();
    tableBody.innerHTML = `
      <tr>
        <td colspan="${moduloActivo.fields.length + 1}" class="text-center text-danger py-4">
          <i class="bi bi-wifi-off fs-4 d-block mb-1"></i>
          No se pudo conectar con la API. Verifique que el servidor esté corriendo en ${API_BASE_URL}.
        </td>
      </tr>
    `;
    console.error(error);
  }
}

function recolectarDatosFormulario() {
  const datos = {};

  moduloActivo.fields.forEach((f) => {
    const input = document.getElementById(`campo-${f.name}`);
    let valor = input.value.trim();

    if (f.type === "password" && idInput.value && valor === "") {
      return;
    }

    if (f.isList) {
      datos[f.name] = valor === "" ? [] : valor.split(",").map((v) => v.trim()).filter(Boolean);
      return;
    }

    if (f.type === "number") {
      datos[f.name] = valor === "" ? undefined : Number(valor);
      return;
    }

    if (f.uppercase) {
      valor = valor.toUpperCase();
    }

    datos[f.name] = valor;
  });

  return datos;
}

async function guardarRegistro(datos, id) {
  const url = id ? `${API_BASE_URL}${moduloActivo.endpoint}/${id}` : `${API_BASE_URL}${moduloActivo.endpoint}`;
  const metodo = id ? "PUT" : "POST";

  const respuesta = await fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const resultado = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || resultado.error || "Ocurrió un error al guardar el registro");
  }

  return resultado;
}

async function eliminarRegistro(id) {
  const respuesta = await fetch(`${API_BASE_URL}${moduloActivo.endpoint}/${id}`, { method: "DELETE" });
  const resultado = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || "Ocurrió un error al eliminar el registro");
  }

  return resultado;
}

// Eventos

dynamicForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!dynamicForm.checkValidity()) {
    dynamicForm.classList.add("was-validated");
    return;
  }
  dynamicForm.classList.add("was-validated");

  const id = idInput.value;
  const datos = recolectarDatosFormulario();

  submitBtn.disabled = true;
  try {
    await guardarRegistro(datos, id);
    mostrarToast(`Registro ${id ? "actualizado" : "creado"} correctamente en ${escaparHtml(moduloActivo.label)}.`, "success");
    resetearFormulario();
    await cargarRegistros();
  } catch (error) {
    mostrarToast(error.message, "danger");
  } finally {
    submitBtn.disabled = false;
  }
});

cancelBtn.addEventListener("click", resetearFormulario);
refreshBtn.addEventListener("click", cargarRegistros);

tableBody.addEventListener("click", (e) => {
  const fila = e.target.closest("tr[data-id]");
  if (!fila) return;
  const id = fila.dataset.id;
  const registro = registrosActuales.find((r) => r._id === id);
  if (!registro) return;

  if (e.target.closest(".btn-editar")) {
    entrarModoEdicion(registro);
  }

  if (e.target.closest(".btn-eliminar")) {
    idPendienteEliminar = id;
    const primerCampo = moduloActivo.fields[0];
    deleteTargetLabel.textContent = valorParaTabla(registro, primerCampo).replace(/<[^>]*>/g, "") || id;
    deleteModal.show();
  }
});

document.getElementById("confirm-delete-btn").addEventListener("click", async () => {
  if (!idPendienteEliminar) return;
  const btn = document.getElementById("confirm-delete-btn");
  btn.disabled = true;

  try {
    await eliminarRegistro(idPendienteEliminar);
    mostrarToast("Registro eliminado correctamente.", "success");
    await cargarRegistros();
  } catch (error) {
    mostrarToast(error.message, "danger");
  } finally {
    btn.disabled = false;
    idPendienteEliminar = null;
    deleteModal.hide();
  }
});