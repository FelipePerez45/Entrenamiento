// SQLite en navegador via sql.js. Persistencia en IndexedDB.
// Mismo patrón que la app de Nutrición para que luego sea fácil enchufar el sync.

const DB_IDB_NAME   = 'entreno-coach10';
const DB_IDB_STORE  = 'db';
const DB_IDB_KEY    = 'sqlite-blob';
const SQLJS_VERSION = '1.10.3';
const SQLJS_CDN     = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/`;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS tablas (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre               TEXT NOT NULL,
  fecha                TEXT,
  activa               INTEGER DEFAULT 1,
  recomendaciones_json TEXT,
  created_at           TEXT DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS dias (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  tabla_id  INTEGER NOT NULL,
  numero    INTEGER NOT NULL,
  nombre    TEXT NOT NULL,
  tipo      TEXT,
  FOREIGN KEY (tabla_id) REFERENCES tablas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ejercicios (
  id                       INTEGER PRIMARY KEY AUTOINCREMENT,
  dia_id                   INTEGER NOT NULL,
  orden                    INTEGER NOT NULL,
  nombre                   TEXT NOT NULL,
  tipo                     TEXT NOT NULL,
  duracion_min             INTEGER,
  series_planificadas      INTEGER DEFAULT 3,
  repeticiones_planificadas INTEGER DEFAULT 10,
  video_url                TEXT,
  FOREIGN KEY (dia_id) REFERENCES dias(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS registros (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  ejercicio_id  INTEGER NOT NULL,
  fecha         TEXT NOT NULL,
  duracion_min  INTEGER,
  completado    INTEGER DEFAULT 1,
  notas         TEXT,
  created_at    TEXT DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (ejercicio_id) REFERENCES ejercicios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS series (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  registro_id   INTEGER NOT NULL,
  num           INTEGER NOT NULL,
  repeticiones  INTEGER,
  peso_kg       REAL,
  FOREIGN KEY (registro_id) REFERENCES registros(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_dias_tabla       ON dias(tabla_id);
CREATE INDEX IF NOT EXISTS idx_ejercicios_dia   ON ejercicios(dia_id);
CREATE INDEX IF NOT EXISTS idx_registros_ej     ON registros(ejercicio_id);
CREATE INDEX IF NOT EXISTS idx_registros_fecha  ON registros(fecha);
CREATE INDEX IF NOT EXISTS idx_series_registro  ON series(registro_id);
`;

const DB = (() => {
  let _SQL = null;
  let _db = null;

  function idbOpen() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_IDB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(DB_IDB_STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  async function idbLoadBlob() {
    const idb = await idbOpen();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(DB_IDB_STORE, 'readonly');
      const req = tx.objectStore(DB_IDB_STORE).get(DB_IDB_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror   = () => reject(req.error);
    });
  }

  async function idbSaveBlob(uint8) {
    const idb = await idbOpen();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(DB_IDB_STORE, 'readwrite');
      tx.objectStore(DB_IDB_STORE).put(uint8, DB_IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  }

  async function init() {
    if (_db) return _db;
    _SQL = await initSqlJs({ locateFile: f => SQLJS_CDN + f });
    const existing = await idbLoadBlob();
    _db = existing ? new _SQL.Database(existing) : new _SQL.Database();
    _db.exec(SCHEMA);
    // Si está vacío, sembrar todas las tablas (MES 1, MES 2, …)
    const c = exec('SELECT COUNT(*) AS n FROM tablas')[0].n;
    if (c === 0) {
      await seedTodas();
    }
    await persist();
    return _db;
  }

  async function persist() {
    if (!_db) return;
    await idbSaveBlob(_db.export());
  }

  function run(sql, params = []) {
    const stmt = _db.prepare(sql);
    stmt.bind(params);
    stmt.step();
    stmt.free();
  }

  function exec(sql, params = []) {
    const stmt = _db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  }

  function lastInsertId() {
    return exec('SELECT last_insert_rowid() AS id')[0].id;
  }

  // ---- Seed ------------------------------------------------------------

  // Siembra todas las tablas definidas en la semilla, en orden (MES 1, MES 2, …).
  async function seedTodas() {
    const seed = window.ENTRENO_SEED || {};
    const tablas = [seed.TABLA_1, seed.TABLA_2, seed.TABLA_3, seed.TABLA_4].filter(Boolean);
    for (const t of tablas) await seedFromObject(t);
  }

  async function seedFromObject(tabla) {
    run(
      `INSERT INTO tablas (nombre, fecha, activa, recomendaciones_json) VALUES (?,?,?,?)`,
      [tabla.nombre, tabla.fecha || null, tabla.activa ? 1 : 0, JSON.stringify(tabla.recomendaciones || {})]
    );
    const tablaId = lastInsertId();
    for (const d of tabla.dias) {
      run(`INSERT INTO dias (tabla_id, numero, nombre, tipo) VALUES (?,?,?,?)`,
          [tablaId, d.numero, d.nombre, d.tipo || null]);
      const diaId = lastInsertId();
      for (const e of d.ejercicios) {
        run(
          `INSERT INTO ejercicios (dia_id, orden, nombre, tipo, duracion_min, series_planificadas, repeticiones_planificadas, video_url)
           VALUES (?,?,?,?,?,?,?,?)`,
          [diaId, e.orden, e.nombre, e.tipo, e.duracion_min || null,
           e.series || 3, e.repeticiones || 10, e.video_url || null]
        );
      }
    }
    await persist();
  }

  // ---- Tablas ----------------------------------------------------------

  function listTablas() {
    return exec('SELECT * FROM tablas ORDER BY activa DESC, created_at DESC').map(t => {
      try { t.recomendaciones = JSON.parse(t.recomendaciones_json || '{}'); } catch (e) { t.recomendaciones = {}; }
      return t;
    });
  }

  function getTabla(id) {
    const t = exec('SELECT * FROM tablas WHERE id = ?', [id])[0];
    if (!t) return null;
    try { t.recomendaciones = JSON.parse(t.recomendaciones_json || '{}'); } catch (e) { t.recomendaciones = {}; }
    return t;
  }

  async function createTabla(t) {
    run(
      'INSERT INTO tablas (nombre, fecha, activa, recomendaciones_json) VALUES (?,?,?,?)',
      [t.nombre, t.fecha || null, t.activa ? 1 : 0, JSON.stringify(t.recomendaciones || {})]
    );
    const id = lastInsertId();
    await persist();
    return id;
  }

  async function updateTabla(t) {
    run(
      'UPDATE tablas SET nombre = ?, fecha = ?, activa = ?, recomendaciones_json = ? WHERE id = ?',
      [t.nombre, t.fecha || null, t.activa ? 1 : 0, JSON.stringify(t.recomendaciones || {}), t.id]
    );
    await persist();
  }

  async function setTablaActiva(id) {
    run('UPDATE tablas SET activa = 0');
    run('UPDATE tablas SET activa = 1 WHERE id = ?', [id]);
    await persist();
  }

  async function deleteTabla(id) {
    run('DELETE FROM tablas WHERE id = ?', [id]);
    await persist();
  }

  function getTablaActiva() {
    const t = exec('SELECT * FROM tablas WHERE activa = 1 ORDER BY created_at DESC LIMIT 1')[0];
    if (!t) return null;
    try { t.recomendaciones = JSON.parse(t.recomendaciones_json || '{}'); } catch (e) { t.recomendaciones = {}; }
    return t;
  }

  // ---- Días ------------------------------------------------------------

  function listDias(tablaId) {
    return exec('SELECT * FROM dias WHERE tabla_id = ? ORDER BY numero ASC', [tablaId]);
  }

  function getDia(id) {
    return exec('SELECT * FROM dias WHERE id = ?', [id])[0] || null;
  }

  async function createDia(d) {
    run('INSERT INTO dias (tabla_id, numero, nombre, tipo) VALUES (?,?,?,?)',
        [d.tabla_id, d.numero, d.nombre, d.tipo || null]);
    const id = lastInsertId();
    await persist();
    return id;
  }

  async function updateDia(d) {
    run('UPDATE dias SET numero = ?, nombre = ?, tipo = ? WHERE id = ?',
        [d.numero, d.nombre, d.tipo || null, d.id]);
    await persist();
  }

  async function deleteDia(id) {
    run('DELETE FROM dias WHERE id = ?', [id]);
    await persist();
  }

  // ---- Ejercicios ------------------------------------------------------

  function listEjercicios(diaId) {
    return exec('SELECT * FROM ejercicios WHERE dia_id = ? ORDER BY orden ASC', [diaId]);
  }

  function getEjercicio(id) {
    return exec('SELECT * FROM ejercicios WHERE id = ?', [id])[0] || null;
  }

  async function createEjercicio(e) {
    run(
      `INSERT INTO ejercicios (dia_id, orden, nombre, tipo, duracion_min, series_planificadas, repeticiones_planificadas, video_url)
       VALUES (?,?,?,?,?,?,?,?)`,
      [e.dia_id, e.orden, e.nombre, e.tipo, e.duracion_min || null,
       e.series_planificadas || 3, e.repeticiones_planificadas || 10, e.video_url || null]
    );
    const id = lastInsertId();
    await persist();
    return id;
  }

  async function updateEjercicio(e) {
    run(
      `UPDATE ejercicios
       SET orden = ?, nombre = ?, tipo = ?, duracion_min = ?, series_planificadas = ?,
           repeticiones_planificadas = ?, video_url = ?
       WHERE id = ?`,
      [e.orden, e.nombre, e.tipo, e.duracion_min || null,
       e.series_planificadas || 3, e.repeticiones_planificadas || 10, e.video_url || null, e.id]
    );
    await persist();
  }

  async function deleteEjercicio(id) {
    run('DELETE FROM ejercicios WHERE id = ?', [id]);
    await persist();
  }

  // ---- Registros + Series ---------------------------------------------

  function listRegistros(ejercicioId, limit = 30) {
    return exec(
      'SELECT * FROM registros WHERE ejercicio_id = ? ORDER BY fecha DESC LIMIT ?',
      [ejercicioId, limit]
    );
  }

  function getRegistroEnFecha(ejercicioId, fecha) {
    return exec(
      'SELECT * FROM registros WHERE ejercicio_id = ? AND fecha = ? LIMIT 1',
      [ejercicioId, fecha]
    )[0] || null;
  }

  function listSeries(registroId) {
    return exec('SELECT * FROM series WHERE registro_id = ? ORDER BY num ASC', [registroId]);
  }

  // Guarda (insert/update) un registro para un ejercicio en una fecha concreta + sus series
  async function upsertSesion(payload) {
    const { ejercicio_id, fecha } = payload;
    const existing = getRegistroEnFecha(ejercicio_id, fecha);
    let regId;
    if (existing) {
      regId = existing.id;
      run('UPDATE registros SET duracion_min = ?, completado = ?, notas = ? WHERE id = ?',
          [payload.duracion_min || null, payload.completado == null ? 1 : payload.completado, payload.notas || null, regId]);
      run('DELETE FROM series WHERE registro_id = ?', [regId]);
    } else {
      run(
        `INSERT INTO registros (ejercicio_id, fecha, duracion_min, completado, notas)
         VALUES (?,?,?,?,?)`,
        [ejercicio_id, fecha, payload.duracion_min || null,
         payload.completado == null ? 1 : payload.completado, payload.notas || null]
      );
      regId = lastInsertId();
    }
    if (Array.isArray(payload.series)) {
      for (const s of payload.series) {
        if (s.repeticiones == null && s.peso_kg == null) continue;
        run('INSERT INTO series (registro_id, num, repeticiones, peso_kg) VALUES (?,?,?,?)',
            [regId, s.num, s.repeticiones == null ? null : Number(s.repeticiones),
             s.peso_kg == null ? null : Number(s.peso_kg)]);
      }
    }
    await persist();
    return regId;
  }

  async function deleteSesion(registroId) {
    run('DELETE FROM registros WHERE id = ?', [registroId]);
    await persist();
  }

  function lastRegistroEjercicio(ejercicioId) {
    const r = exec(
      'SELECT * FROM registros WHERE ejercicio_id = ? ORDER BY fecha DESC LIMIT 1',
      [ejercicioId]
    )[0];
    if (!r) return null;
    r.series = listSeries(r.id);
    return r;
  }

  function todosLosRegistros(limit = 200) {
    return exec(
      `SELECT r.*, e.nombre AS ejercicio_nombre, e.tipo AS ejercicio_tipo,
              d.numero AS dia_numero, d.nombre AS dia_nombre, t.nombre AS tabla_nombre
       FROM registros r
       JOIN ejercicios e ON e.id = r.ejercicio_id
       JOIN dias d ON d.id = e.dia_id
       JOIN tablas t ON t.id = d.tabla_id
       ORDER BY r.fecha DESC, r.id DESC
       LIMIT ?`,
      [limit]
    );
  }

  // ---- Estadísticas ---------------------------------------------------

  function stats() {
    return {
      totalTablas:     exec('SELECT COUNT(*) AS n FROM tablas')[0].n,
      totalEjercicios: exec('SELECT COUNT(*) AS n FROM ejercicios')[0].n,
      totalSesiones:   exec('SELECT COUNT(*) AS n FROM registros')[0].n,
      diasUnicos:      exec('SELECT COUNT(DISTINCT fecha) AS n FROM registros')[0].n,
    };
  }

  // ---- Export / Import / Reset ----------------------------------------

  function exportToFile() {
    const data = _db.export();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fecha = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `entrenamiento-coach10-${fecha}.sqlite`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importFromFile(file) {
    const buf = new Uint8Array(await file.arrayBuffer());
    _db.close();
    _db = new _SQL.Database(buf);
    _db.exec(SCHEMA);
    await persist();
  }

  async function reset() {
    _db.close();
    _db = new _SQL.Database();
    _db.exec(SCHEMA);
    await seedTodas();
    await persist();
  }

  return {
    init,
    listTablas, getTabla, createTabla, updateTabla, setTablaActiva, deleteTabla, getTablaActiva,
    listDias, getDia, createDia, updateDia, deleteDia,
    listEjercicios, getEjercicio, createEjercicio, updateEjercicio, deleteEjercicio,
    listRegistros, getRegistroEnFecha, listSeries, upsertSesion, deleteSesion,
    lastRegistroEjercicio, todosLosRegistros,
    stats,
    exportToFile, importFromFile, reset,
    seedFromObject,
  };
})();

window.DB = DB;
