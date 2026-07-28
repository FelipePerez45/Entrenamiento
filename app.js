// App principal Entrenamiento Coach10.

const STATE = {
  tab: 'entreno',
  tablaId: null,
  diaId: null,
  ejercicioId: null,           // ejercicio abierto en el modal
  ejFecha: hoyISO(),
  ejSeries: [],                // [{ num, repeticiones, peso_kg }]
};

// Máximo de series que se pueden registrar en una sesión.
// La Tabla 3 planifica 4 series, así que se deja margen para una extra.
const MAX_SERIES = 6;

const $  = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

// ============= Helpers ===========================================

function hoyISO() {
  const d = new Date();
  return localISO(d);
}
function localISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function shiftDayISO(iso, delta) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return localISO(date);
}
function formatFecha(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function formatFechaLarga(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(d);
}

function vimeoEmbedUrl(url) {
  if (!url) return null;
  // Soporta https://vimeo.com/ID/HASH y https://vimeo.com/ID
  const m = url.match(/vimeo\.com\/(\d+)(?:\/([\w]+))?/);
  if (!m) return null;
  const id = m[1];
  const hash = m[2];
  return `https://player.vimeo.com/video/${id}${hash ? ('?h=' + hash) : ''}`;
}

function youtubeEmbedUrl(url) {
  if (!url) return null;
  // Soporta youtu.be/ID, youtube.com/watch?v=ID, /embed/ID y /shorts/ID
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  if (!m) return null;
  return `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0`;
}

// Devuelve la URL de reproducción incrustada (Vimeo o YouTube) o null si no se reconoce.
function videoEmbedUrl(url) {
  return vimeoEmbedUrl(url) || youtubeEmbedUrl(url);
}

// Nombre de la plataforma, para el enlace "abrir en…" de respaldo.
function videoPlataforma(url) {
  if (!url) return null;
  if (/vimeo\.com/.test(url))            return 'Vimeo';
  if (/youtu\.be|youtube\.com/.test(url)) return 'YouTube';
  return 'el navegador';
}

// ---- Repeticiones objetivo por serie ----------------------------
// La tabla puede traer un esquema por serie en recomendaciones.reps_por_serie
// (ej. Tabla 3: [12, 12, 10, 8]). Si no lo trae, se usa el valor único
// planificado del ejercicio para todas las series.

function tablaIdDeEjercicio(e) {
  const d = (e && e.dia_id != null) ? DB.getDia(e.dia_id) : null;
  return d ? d.tabla_id : STATE.tablaId;
}

function repsObjetivo(e) {
  const total = e.series_planificadas || 3;
  const base  = e.repeticiones_planificadas || 10;
  const t = DB.getTabla(tablaIdDeEjercicio(e));
  const esq = (t && t.recomendaciones && Array.isArray(t.recomendaciones.reps_por_serie))
    ? t.recomendaciones.reps_por_serie.map(Number).filter(n => Number.isFinite(n) && n > 0)
    : [];
  return Array.from({ length: total }, (_, i) => {
    if (!esq.length) return base;
    return esq[i] != null ? esq[i] : esq[esq.length - 1];
  });
}

// Texto resumido: "4 × 12 reps" o "4 series × 12/12/10/8 reps"
function repsObjetivoTexto(e, corto = false) {
  const reps  = repsObjetivo(e);
  const total = reps.length;
  const iguales = reps.every(r => r === reps[0]);
  const detalle = iguales ? `${reps[0]}` : reps.join('/');
  return corto ? `${total} × ${detalle} reps` : `${total} series × ${detalle} reps`;
}

function toast(msg, kind = 'ok') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast' + (kind === 'error' ? ' error' : '');
  setTimeout(() => t.classList.add('hidden'), 2400);
}

// ============= Tabs ==============================================

function goTab(tab) {
  STATE.tab = tab;
  $$('.tab-panel').forEach(p => p.classList.toggle('hidden', p.dataset.tab !== tab));
  $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.go === tab));
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (tab === 'entreno')   renderEntreno();
  if (tab === 'historial') renderHistorial();
  if (tab === 'tablas')    renderTablasManager();
}

// ============= ENTRENO (tabla activa + días) =====================

function renderEntreno() {
  renderTablaSelector();
  renderRecomendaciones();
  renderDiaChips();
  renderEjerciciosDia();
}

function renderTablaSelector() {
  const tablas = DB.listTablas();
  if (!STATE.tablaId) {
    const activa = DB.getTablaActiva() || tablas[0];
    if (activa) STATE.tablaId = activa.id;
  }
  const sel = $('#tabla-select');
  sel.innerHTML = tablas.map(t => `
    <option value="${t.id}" ${t.id === STATE.tablaId ? 'selected' : ''}>${t.nombre}${t.activa ? ' · activa' : ''}</option>
  `).join('');
  sel.onchange = async () => {
    STATE.tablaId = Number(sel.value);
    STATE.diaId   = null;
    await DB.setTablaActiva(STATE.tablaId);
    renderEntreno();
  };

  // Actualiza subtítulo cabecera
  const t = DB.getTabla(STATE.tablaId);
  $('#brand-sub').textContent = 'Entrenamiento · ' + (t ? t.nombre : 'Local');
}

function renderRecomendaciones() {
  const t = DB.getTabla(STATE.tablaId);
  const r = (t && t.recomendaciones) || {};
  const cont = $('#recomendaciones');
  cont.innerHTML = `
    <h4 style="margin:4px 0 6px;color:var(--text);">Tempos</h4>
    <p style="margin:2px 0;">${r.tempos || '—'}</p>
    ${r.positiva ? `<p style="margin:2px 0;"><strong>Positiva:</strong> ${r.positiva}</p>` : ''}
    ${r.negativa ? `<p style="margin:2px 0;"><strong>Negativa:</strong> ${r.negativa}</p>` : ''}

    <h4 style="margin:10px 0 6px;color:var(--text);">Nivel de esfuerzo</h4>
    <table>
      <tbody>
        ${(r.nivel_esfuerzo || []).map(n => `
          <tr><td><strong>Serie ${n.serie}</strong></td><td>${n.descripcion}</td></tr>
        `).join('')}
      </tbody>
    </table>

    <h4 style="margin:10px 0 6px;color:var(--text);">Descanso</h4>
    <p style="margin:2px 0;">${r.descanso || '—'}</p>

    ${r.notas && r.notas.length ? `
      <h4 style="margin:10px 0 6px;color:var(--text);">Notas</h4>
      <ul>${r.notas.map(n => `<li>${n}</li>`).join('')}</ul>
    ` : ''}
  `;
}

function renderDiaChips() {
  const dias = DB.listDias(STATE.tablaId);
  if (!STATE.diaId && dias.length) STATE.diaId = dias[0].id;
  const wrap = $('#dia-chips');
  wrap.innerHTML = dias.map(d => {
    const cuenta = ejerciciosCompletadosHoy(d.id);
    const total  = DB.listEjercicios(d.id).length;
    const badge  = (cuenta > 0 && cuenta === total) ? ' <span class="chip-badge">✓</span>' : '';
    return `<button class="chip ${d.id === STATE.diaId ? 'active' : ''}" data-dia="${d.id}">${d.nombre}${badge}</button>`;
  }).join('');
  wrap.onclick = e => {
    const c = e.target.closest('.chip');
    if (!c) return;
    STATE.diaId = Number(c.dataset.dia);
    renderEntreno();
  };
}

function ejerciciosCompletadosHoy(diaId) {
  const ejs = DB.listEjercicios(diaId);
  let n = 0;
  for (const e of ejs) {
    if (DB.getRegistroEnFecha(e.id, hoyISO())) n++;
  }
  return n;
}

function renderEjerciciosDia() {
  const dia = DB.getDia(STATE.diaId);
  $('#dia-titulo').textContent = dia ? dia.nombre : 'Sin día';
  const cont = $('#ejercicios-list');
  cont.innerHTML = '';
  if (!dia) return;
  const ejs = DB.listEjercicios(dia.id);
  if (!ejs.length) {
    cont.innerHTML = '<div class="empty-state">Aún no hay ejercicios en este día.</div>';
    return;
  }
  ejs.forEach(e => cont.appendChild(ejercicioCard(e)));
}

function ejercicioCard(e) {
  const card = document.createElement('div');
  card.className = 'ejercicio-card';
  const doneToday = DB.getRegistroEnFecha(e.id, hoyISO());
  if (doneToday) card.classList.add('done');
  const last = DB.lastRegistroEjercicio(e.id);

  const infoLine = e.tipo === 'cardio'
    ? `<span class="ej-tag cardio">CARDIO</span> <span>${e.duracion_min || 0} min</span>`
    : `<span class="ej-tag series">SERIES</span> <span>${repsObjetivoTexto(e, true)}</span>`;

  let lastData = '';
  if (last) {
    if (e.tipo === 'cardio' && last.duracion_min) {
      lastData = `🕒 Última: ${last.duracion_min} min · ${formatFecha(last.fecha)}`;
    } else if (e.tipo === 'series' && last.series && last.series.length) {
      const best = last.series.reduce((m, s) => (s.peso_kg > (m?.peso_kg || 0) ? s : m), null);
      if (best) lastData = `🏋️ Última: ${best.peso_kg || 0} kg × ${best.repeticiones || '?'} · ${formatFecha(last.fecha)}`;
    }
  }

  card.innerHTML = `
    <div class="ej-orden">${e.orden}</div>
    <div class="ej-meta">
      <div class="ej-nombre">${e.nombre}</div>
      <div class="ej-info-line">${infoLine}</div>
      ${lastData ? `<div class="ej-last-data">${lastData}</div>` : ''}
    </div>
    <div class="ej-card-arrow">›</div>
  `;
  card.onclick = () => openEjercicio(e.id);
  return card;
}

// ============= MODAL: Detalle ejercicio ==========================

function openEjercicio(id) {
  STATE.ejercicioId = id;
  STATE.ejFecha = hoyISO();
  loadSesionDelDia();
  renderEjercicioModal();
  $('#ej-modal').classList.remove('hidden');
}

function closeEjercicio() {
  $('#ej-modal').classList.add('hidden');
  // Limpia el iframe para parar el vídeo
  $('#ej-video-wrap').innerHTML = '';
  STATE.ejercicioId = null;
}

function loadSesionDelDia() {
  const reg = DB.getRegistroEnFecha(STATE.ejercicioId, STATE.ejFecha);
  if (reg) {
    STATE.ejSesion = reg;
    STATE.ejSeries = DB.listSeries(reg.id).map(s => ({
      num: s.num, repeticiones: s.repeticiones, peso_kg: s.peso_kg,
    }));
    STATE.ejNotas    = reg.notas || '';
    STATE.ejDuracion = reg.duracion_min || null;
  } else {
    STATE.ejSesion = null;
    STATE.ejSeries = [];
    STATE.ejNotas = '';
    STATE.ejDuracion = null;
  }
}

function renderEjercicioModal() {
  const e = DB.getEjercicio(STATE.ejercicioId);
  if (!e) return;

  $('#ej-title').textContent = e.nombre;

  // Vídeo (Vimeo o YouTube)
  const embed = videoEmbedUrl(e.video_url);
  const vWrap = $('#ej-video-wrap');
  if (embed) {
    vWrap.innerHTML = `<iframe src="${embed}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  } else if (e.video_url) {
    vWrap.innerHTML = `<div class="no-video">Vídeo no incrustable — usa el enlace de abajo</div>`;
  } else {
    vWrap.innerHTML = `<div class="no-video">Sin vídeo disponible</div>`;
  }

  // Info
  const info = $('#ej-info');
  // Enlace directo de respaldo, siempre disponible si el ejercicio tiene vídeo
  const enlace = e.video_url
    ? `<a class="pill" href="${e.video_url}" target="_blank" rel="noopener">▶️ Ver en ${videoPlataforma(e.video_url)} ↗</a>`
    : '';
  if (e.tipo === 'cardio') {
    info.innerHTML = `<span class="pill">🚴 Cardio · ${e.duracion_min || 0} min recomendados</span>${enlace}`;
  } else {
    info.innerHTML = `
      <span class="pill">💪 ${repsObjetivoTexto(e)}</span>
      <span class="pill">⏱️ 1s positiva · 3s negativa</span>
      ${enlace}
    `;
  }

  // Fecha
  $('#ej-date').value = STATE.ejFecha;
  $('#ej-date-pretty').textContent = formatFechaLarga(STATE.ejFecha);

  // Botón de borrar visible sólo si ya existe la sesión
  $('#ej-delete-session').style.visibility = STATE.ejSesion ? 'visible' : 'hidden';

  // Series o cardio
  renderSeriesSection(e);

  // Notas
  $('#ej-notas').value = STATE.ejNotas || '';

  // Historial
  renderEjercicioHistorial(e);
}

function renderSeriesSection(e) {
  const wrap = $('#ej-series-wrap');
  if (e.tipo === 'cardio') {
    wrap.innerHTML = `
      <div class="form-row">
        <label>Minutos realizados</label>
        <input type="number" min="0" max="600" step="1" id="ej-duracion"
               value="${STATE.ejDuracion != null ? STATE.ejDuracion : ''}"
               placeholder="${e.duracion_min || 0}">
      </div>
    `;
    $('#ej-duracion').oninput = ev => {
      const v = ev.target.value;
      STATE.ejDuracion = v === '' ? null : Number(v);
    };
    return;
  }

  // Series
  const seriesActuales = STATE.ejSeries;
  const objetivo = repsObjetivo(e);           // ej. [12, 12, 10, 8]
  if (!seriesActuales.length) {
    // Pre-rellenar con las series planificadas (3, 4, … según la tabla)
    const plan = e.series_planificadas || 3;
    for (let i = 1; i <= plan; i++) {
      seriesActuales.push({ num: i, repeticiones: null, peso_kg: null });
    }
  }
  // Repeticiones recomendadas de cada serie registrada (si hay más series de las
  // planificadas, se mantiene la última del esquema).
  const objetivoDe = num => objetivo[num - 1] != null ? objetivo[num - 1] : objetivo[objetivo.length - 1];

  const esfuerzo = (DB.getTabla(tablaIdDeEjercicio(e))?.recomendaciones?.nivel_esfuerzo) || [];
  const esfuerzoDe = num => (esfuerzo.find(n => Number(n.serie) === num) || {}).descripcion || '';

  wrap.innerHTML = `
    <h3 class="section-title" style="margin-top:14px;">Series</h3>
    <p class="hint" style="margin:-4px 0 10px;">
      🎯 Objetivo: ${objetivo.map((r, i) => `S${i + 1} <strong>${r}</strong>`).join(' · ')} reps
    </p>
    <div class="series-actions">
      <button class="btn ghost" id="btn-add-serie" ${seriesActuales.length >= MAX_SERIES ? 'disabled' : ''}>+ Añadir serie</button>
      <button class="btn ghost" id="btn-copy-last">📋 Copiar última sesión</button>
    </div>
    <div class="series-table">
      <div class="series-header">
        <span>Serie</span>
        <span>Repeticiones</span>
        <span>Peso (kg)</span>
        <span></span>
      </div>
      ${seriesActuales.map((s, idx) => `
        <div class="series-row" data-idx="${idx}">
          <div class="ser-num" title="${esfuerzoDe(s.num)}">${s.num}</div>
          <input type="number" min="0" max="100" step="1" data-field="repeticiones"
                 value="${s.repeticiones != null ? s.repeticiones : ''}"
                 placeholder="${objetivoDe(s.num)} reps">
          <input type="number" min="0" max="500" step="0.5" data-field="peso_kg"
                 value="${s.peso_kg != null ? s.peso_kg : ''}" placeholder="kg">
          <button class="ser-rm" data-rm="${idx}" aria-label="Quitar serie">×</button>
        </div>
      `).join('')}
    </div>
  `;

  // Bindings
  wrap.querySelectorAll('.series-row').forEach(row => {
    const idx = Number(row.dataset.idx);
    row.querySelectorAll('input').forEach(inp => {
      inp.oninput = e2 => {
        const v = e2.target.value;
        const field = e2.target.dataset.field;
        STATE.ejSeries[idx][field] = v === '' ? null : Number(v);
      };
    });
    row.querySelector('[data-rm]').onclick = () => {
      STATE.ejSeries.splice(idx, 1);
      // Renumera
      STATE.ejSeries.forEach((s, i) => { s.num = i + 1; });
      renderSeriesSection(e);
    };
  });

  $('#btn-add-serie').onclick = () => {
    if (STATE.ejSeries.length >= MAX_SERIES) return;
    STATE.ejSeries.push({ num: STATE.ejSeries.length + 1, repeticiones: null, peso_kg: null });
    renderSeriesSection(e);
  };

  $('#btn-copy-last').onclick = () => {
    const last = DB.lastRegistroEjercicio(e.id);
    if (!last || !last.series || !last.series.length) {
      toast('No hay sesión anterior para copiar', 'error');
      return;
    }
    STATE.ejSeries = last.series.map((s, i) => ({
      num: i + 1, repeticiones: s.repeticiones, peso_kg: s.peso_kg,
    }));
    renderSeriesSection(e);
  };
}

function renderEjercicioHistorial(e) {
  const cont = $('#ej-historial');
  const regs = DB.listRegistros(e.id, 30);
  if (!regs.length) {
    cont.innerHTML = '<div class="empty-state">Sin sesiones aún.</div>';
    return;
  }
  cont.innerHTML = regs.map(r => {
    const series = DB.listSeries(r.id);
    let detalle = '';
    if (e.tipo === 'cardio') {
      detalle = `${r.duracion_min || 0} min`;
    } else if (series.length) {
      detalle = series.map(s => `S${s.num}: ${s.repeticiones || '?'}×${s.peso_kg != null ? s.peso_kg + 'kg' : '—'}`).join(' · ');
    } else {
      detalle = 'sin datos';
    }
    return `
      <div class="historial-card">
        <div>
          <div class="date">${formatFecha(r.fecha)}</div>
          <div class="stats">${detalle}</div>
        </div>
      </div>
    `;
  }).join('');
}

async function guardarSesion() {
  const e = DB.getEjercicio(STATE.ejercicioId);
  if (!e) return;
  const payload = {
    ejercicio_id: e.id,
    fecha:        STATE.ejFecha,
    duracion_min: e.tipo === 'cardio' ? (STATE.ejDuracion || null) : null,
    completado:   1,
    notas:        $('#ej-notas').value.trim() || null,
    series:       e.tipo === 'series' ? STATE.ejSeries.filter(s => s.repeticiones != null || s.peso_kg != null) : [],
  };
  await DB.upsertSesion(payload);
  toast('Sesión guardada ✓');
  loadSesionDelDia();
  renderEjercicioModal();
}

async function borrarSesion() {
  if (!STATE.ejSesion) return;
  if (!confirm('¿Borrar esta sesión?')) return;
  await DB.deleteSesion(STATE.ejSesion.id);
  toast('Borrada');
  loadSesionDelDia();
  renderEjercicioModal();
}

// ============= HISTORIAL =========================================

function renderHistorial() {
  const s = DB.stats();
  $('#stats-grid').innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${s.totalTablas}</div>
      <div class="stat-label">Tablas</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${s.totalSesiones}</div>
      <div class="stat-label">Sesiones</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${s.diasUnicos}</div>
      <div class="stat-label">Días entrenados</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${s.totalEjercicios}</div>
      <div class="stat-label">Ejercicios totales</div>
    </div>
  `;

  const regs = DB.todosLosRegistros(200);
  const cont = $('#historial-list');
  if (!regs.length) {
    cont.innerHTML = '<div class="empty-state">Aún no has registrado ninguna sesión.</div>';
    return;
  }
  cont.innerHTML = regs.map(r => {
    let detalle = '';
    if (r.ejercicio_tipo === 'cardio') detalle = `${r.duracion_min || 0} min`;
    else {
      const ss = DB.listSeries(r.id);
      detalle = ss.length ? ss.map(s => `${s.repeticiones || '?'}×${s.peso_kg != null ? s.peso_kg + 'kg' : '—'}`).join(' · ') : 'sin series';
    }
    return `
      <div class="historial-card">
        <div>
          <div class="date">${r.ejercicio_nombre}</div>
          <div class="stats">${formatFecha(r.fecha)} · ${r.dia_nombre} · ${r.tabla_nombre}</div>
          <div class="stats">${detalle}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ============= TABLAS (gestor) ===================================

function renderTablasManager() {
  const tablas = DB.listTablas();
  const cont = $('#tablas-list');
  if (!tablas.length) {
    cont.innerHTML = '<div class="empty-state">Aún no hay tablas.</div>';
    return;
  }
  cont.innerHTML = '';
  tablas.forEach(t => {
    const dias = DB.listDias(t.id);
    const totalEjs = dias.reduce((sum, d) => sum + DB.listEjercicios(d.id).length, 0);
    const card = document.createElement('div');
    card.className = 'tabla-card' + (t.activa ? ' activa' : '');
    card.innerHTML = `
      <div>
        <span class="nombre">${t.nombre}</span>
        ${t.activa ? '<span class="activa-badge">ACTIVA</span>' : ''}
      </div>
      <div class="meta">
        ${t.fecha ? `📅 ${formatFecha(t.fecha)} · ` : ''}
        ${dias.length} día${dias.length === 1 ? '' : 's'} · ${totalEjs} ejercicio${totalEjs === 1 ? '' : 's'}
      </div>
      <div class="acciones">
        ${!t.activa ? `<button data-act="activar" data-id="${t.id}">Activar</button>` : ''}
        <button data-act="editar" data-id="${t.id}">Editar</button>
        <button data-act="duplicar" data-id="${t.id}">Duplicar</button>
        <button data-act="borrar" data-id="${t.id}" class="danger">Borrar</button>
      </div>
    `;
    cont.appendChild(card);
  });

  cont.onclick = async e => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const id  = Number(b.dataset.id);
    const act = b.dataset.act;
    if (act === 'activar') {
      await DB.setTablaActiva(id);
      toast('Tabla activada');
      STATE.tablaId = id;
      STATE.diaId = null;
      renderTablasManager();
    } else if (act === 'editar') {
      openEditorTabla(id);
    } else if (act === 'duplicar') {
      await duplicarTabla(id);
    } else if (act === 'borrar') {
      const t = DB.getTabla(id);
      if (!confirm(`¿Borrar "${t.nombre}"? Se perderán todas las sesiones asociadas.`)) return;
      await DB.deleteTabla(id);
      toast('Borrada');
      if (STATE.tablaId === id) { STATE.tablaId = null; STATE.diaId = null; }
      renderTablasManager();
    }
  };
}

async function duplicarTabla(id) {
  const t = DB.getTabla(id);
  if (!t) return;
  const dias = DB.listDias(id);
  const seed = {
    nombre: t.nombre + ' (copia)',
    fecha: hoyISO(),
    activa: 0,
    recomendaciones: t.recomendaciones,
    dias: dias.map(d => ({
      numero: d.numero,
      nombre: d.nombre,
      tipo:   d.tipo,
      ejercicios: DB.listEjercicios(d.id).map(e => ({
        orden: e.orden, nombre: e.nombre, tipo: e.tipo,
        duracion_min: e.duracion_min,
        series: e.series_planificadas, repeticiones: e.repeticiones_planificadas,
        video_url: e.video_url,
      })),
    })),
  };
  await DB.seedFromObject(seed);
  toast('Duplicada');
  renderTablasManager();
}

async function nuevaTablaVacia() {
  const nombre = prompt('Nombre de la nueva tabla (ej. "Tabla 2"):');
  if (!nombre) return;
  const num = DB.listTablas().length + 1;
  const seed = {
    nombre: nombre.trim() || ('Tabla ' + num),
    fecha:  hoyISO(),
    activa: 0,
    recomendaciones: DB.getTablaActiva()?.recomendaciones || {},
    dias: Array.from({ length: 5 }, (_, i) => ({
      numero: i + 1,
      nombre: `Día ${i + 1}`,
      tipo:   '',
      ejercicios: [],
    })),
  };
  await DB.seedFromObject(seed);
  toast('Tabla creada — edítala para añadir ejercicios');
  renderTablasManager();
}

// ============= EDITOR de tabla (días + ejercicios) ===============

let EDIT_TABLA_ID = null;

function openEditorTabla(id) {
  EDIT_TABLA_ID = id;
  renderEditorTabla();
  $('#edit-tabla-modal').classList.remove('hidden');
}

function closeEditorTabla() {
  $('#edit-tabla-modal').classList.add('hidden');
  // Refresca vistas que pueden haber cambiado
  if (STATE.tablaId === EDIT_TABLA_ID) renderEntreno();
  renderTablasManager();
  EDIT_TABLA_ID = null;
}

function renderEditorTabla() {
  const t = DB.getTabla(EDIT_TABLA_ID);
  if (!t) return;
  const dias = DB.listDias(t.id);
  const body = $('#edit-tabla-body');
  body.innerHTML = `
    <div class="form-row">
      <label>Nombre de la tabla</label>
      <input type="text" id="edit-tabla-nombre" value="${(t.nombre || '').replace(/"/g, '&quot;')}">
    </div>
    <div class="form-row">
      <label>Fecha</label>
      <input type="date" id="edit-tabla-fecha" value="${t.fecha || ''}">
    </div>

    <h3 class="section-title">Días y ejercicios</h3>
    <div id="edit-days"></div>

    <div class="actions">
      <button class="btn ghost block" id="btn-add-day">+ Añadir día</button>
    </div>

    <div class="actions">
      <button class="btn primary block" id="btn-save-tabla">Guardar cambios</button>
    </div>
  `;

  $('#edit-tabla-nombre').oninput = e => {
    DB.updateTabla({ id: t.id, nombre: e.target.value, fecha: $('#edit-tabla-fecha').value, activa: t.activa, recomendaciones: t.recomendaciones });
  };
  $('#edit-tabla-fecha').onchange = e => {
    DB.updateTabla({ id: t.id, nombre: $('#edit-tabla-nombre').value, fecha: e.target.value, activa: t.activa, recomendaciones: t.recomendaciones });
  };

  $('#btn-add-day').onclick = async () => {
    const dias = DB.listDias(t.id);
    const next = dias.length + 1;
    await DB.createDia({ tabla_id: t.id, numero: next, nombre: `Día ${next}`, tipo: '' });
    renderEditorTabla();
  };

  $('#btn-save-tabla').onclick = () => {
    toast('Guardado ✓');
    closeEditorTabla();
  };

  renderEditorDays(t);
}

function renderEditorDays(t) {
  const wrap = $('#edit-days');
  const dias = DB.listDias(t.id);
  wrap.innerHTML = '';
  dias.forEach(d => {
    const ejs = DB.listEjercicios(d.id);
    const card = document.createElement('div');
    card.className = 'editor-day';
    card.innerHTML = `
      <div class="editor-day-head">
        <input type="text" value="${(d.nombre || '').replace(/"/g, '&quot;')}" data-day-name="${d.id}" style="background:transparent;border:0;border-bottom:1px solid var(--border);padding:6px 4px;font-weight:700;font-size:15px;">
        <button class="text-btn danger-text" data-del-day="${d.id}">Borrar día</button>
      </div>
      <div data-eje-list="${d.id}">
        ${ejs.map(e => `
          <div class="editor-ejercicio" data-eje="${e.id}">
            <span style="color:var(--accent);font-weight:800;">${e.orden}</span>
            <input type="text" value="${(e.nombre || '').replace(/"/g, '&quot;')}" data-field="nombre" data-id="${e.id}" placeholder="Nombre ejercicio">
            <button data-del-eje="${e.id}" aria-label="Borrar">×</button>
          </div>
          <div style="display:flex;gap:6px;margin:0 0 8px 26px;flex-wrap:wrap;">
            <select data-field="tipo" data-id="${e.id}" style="flex:0 0 110px;padding:6px 8px;font-size:13px;">
              <option value="series"  ${e.tipo === 'series'  ? 'selected' : ''}>Series</option>
              <option value="cardio"  ${e.tipo === 'cardio'  ? 'selected' : ''}>Cardio</option>
            </select>
            ${e.tipo === 'cardio' ? `
              <input type="number" data-field="duracion_min" data-id="${e.id}" value="${e.duracion_min || ''}" placeholder="min" style="flex:0 0 80px;padding:6px 8px;font-size:13px;">
            ` : `
              <input type="number" data-field="series_planificadas" data-id="${e.id}" value="${e.series_planificadas || 3}" placeholder="series" style="flex:0 0 80px;padding:6px 8px;font-size:13px;">
              <input type="number" data-field="repeticiones_planificadas" data-id="${e.id}" value="${e.repeticiones_planificadas || 10}" placeholder="reps" style="flex:0 0 80px;padding:6px 8px;font-size:13px;">
            `}
            <input type="url" data-field="video_url" data-id="${e.id}" value="${e.video_url || ''}" placeholder="https://vimeo.com/… o https://youtu.be/…" style="flex:1 1 100%;padding:6px 8px;font-size:13px;">
          </div>
        `).join('')}
      </div>
      <button class="btn ghost" data-add-eje="${d.id}" style="font-size:13px;padding:6px 12px;">+ Añadir ejercicio</button>
    `;
    wrap.appendChild(card);
  });

  // Bindings
  wrap.querySelectorAll('input[data-day-name]').forEach(inp => {
    inp.onchange = async () => {
      await DB.updateDia({ id: Number(inp.dataset.dayName), nombre: inp.value,
                           numero: DB.getDia(Number(inp.dataset.dayName)).numero,
                           tipo: DB.getDia(Number(inp.dataset.dayName)).tipo });
    };
  });
  wrap.querySelectorAll('[data-del-day]').forEach(b => {
    b.onclick = async () => {
      if (!confirm('¿Borrar este día y todos sus ejercicios?')) return;
      await DB.deleteDia(Number(b.dataset.delDay));
      renderEditorDays(t);
    };
  });
  wrap.querySelectorAll('[data-del-eje]').forEach(b => {
    b.onclick = async () => {
      if (!confirm('¿Borrar este ejercicio?')) return;
      await DB.deleteEjercicio(Number(b.dataset.delEje));
      renderEditorDays(t);
    };
  });
  wrap.querySelectorAll('[data-add-eje]').forEach(b => {
    b.onclick = async () => {
      const diaId = Number(b.dataset.addEje);
      const orden = DB.listEjercicios(diaId).length + 1;
      await DB.createEjercicio({
        dia_id: diaId, orden, nombre: 'Nuevo ejercicio', tipo: 'series',
        series_planificadas: 3, repeticiones_planificadas: 10,
      });
      renderEditorDays(t);
    };
  });
  wrap.querySelectorAll('input[data-field],select[data-field]').forEach(el => {
    el.onchange = async () => {
      const id = Number(el.dataset.id);
      const field = el.dataset.field;
      const e = DB.getEjercicio(id);
      if (!e) return;
      const val = el.type === 'number' ? (el.value === '' ? null : Number(el.value)) : el.value;
      e[field] = val;
      await DB.updateEjercicio(e);
      if (field === 'tipo') renderEditorDays(t);
    };
  });
}

// ============= MENÚ ==============================================

function openMenu()  { $('#menu-modal').classList.remove('hidden'); }
function closeMenu() { $('#menu-modal').classList.add('hidden'); }

// ============= INIT ==============================================

async function main() {
  try {
    await DB.init();
  } catch (e) {
    console.error(e);
    $('#loading p').textContent = 'Error cargando la base de datos.';
    return;
  }
  $('#loading').classList.add('hidden');

  // Tabs
  $$('.tab-btn').forEach(b => b.onclick = () => goTab(b.dataset.go));

  // Modal ejercicio
  $('#ej-close').onclick = closeEjercicio;
  $('#ej-modal').onclick = e => { if (e.target.id === 'ej-modal') closeEjercicio(); };
  $('#ej-save').onclick = guardarSesion;
  $('#ej-delete-session').onclick = borrarSesion;
  $('#ej-day-prev').onclick = () => { STATE.ejFecha = shiftDayISO(STATE.ejFecha, -1); loadSesionDelDia(); renderEjercicioModal(); };
  $('#ej-day-next').onclick = () => { STATE.ejFecha = shiftDayISO(STATE.ejFecha, +1); loadSesionDelDia(); renderEjercicioModal(); };
  $('#ej-day-today').onclick = () => { STATE.ejFecha = hoyISO(); loadSesionDelDia(); renderEjercicioModal(); };
  $('#ej-date').onchange = e => { STATE.ejFecha = e.target.value || hoyISO(); loadSesionDelDia(); renderEjercicioModal(); };
  $('#ej-notas').oninput = e => { STATE.ejNotas = e.target.value; };

  // Modal editor tabla
  $('#edit-tabla-close').onclick = closeEditorTabla;

  // Tablas tab
  $('#btn-nueva-tabla').onclick = nuevaTablaVacia;

  // Menú
  $('#btn-menu').onclick = openMenu;
  $('#btn-close-menu').onclick = closeMenu;
  $('#menu-modal').onclick = e => { if (e.target.id === 'menu-modal') closeMenu(); };
  $('#btn-export').onclick = () => { DB.exportToFile(); toast('Descargando…'); };
  $('#file-import').onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    if (!confirm('¿Reemplazar la BD actual?')) return;
    await DB.importFromFile(f);
    toast('Importado ✓');
    closeMenu();
    goTab(STATE.tab);
  };
  $('#btn-reset').onclick = async () => {
    if (!confirm('Esto borrará TODO y dejará solo las tablas de fábrica (Tabla 1, 2 y 3). ¿Seguro?')) return;
    await DB.reset();
    toast('Reiniciado');
    closeMenu();
    STATE.tablaId = null; STATE.diaId = null;
    goTab('entreno');
  };

  goTab('entreno');
}

main();
