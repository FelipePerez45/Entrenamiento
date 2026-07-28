// Semilla de las tablas del entrenador, separadas por MES (MES 1, MES 2, …).
//   · MES 1 — Tabla 1 (PDF "Tabla 1 GYM - Felipe Alejandro Pérez 21_05_26").
//   · MES 2 — Tabla 2 (PDF "Tabla 2 GYM - Felipe Alejandro Pérez 21_06_26").
//   · MES 3 — Tabla 3 (PDF "Tabla 3 GYM - Felipe Alejandro Pérez 19_07_26").
// Cada mes se añade una nueva tabla aquí (SEED_TABLA_N) y a window.ENTRENO_SEED;
// también se pueden crear/editar nuevas tablas desde la propia app.
// Los nombres de los ejercicios son inferidos por el contenido visual del vídeo
// (el PDF original no los etiqueta), se pueden editar desde la app.

const SEED_TABLA_1 = {
  nombre:  'MES 1 — Tabla 1',
  fecha:   '2026-05-21',
  activa:  0,
  recomendaciones: {
    tempos: '1 segundo para la positiva, 3 segundos para la negativa.',
    positiva: 'Momento del ejercicio en el que contraes el músculo.',
    negativa: 'Momento excéntrico en el que aguantas la carga a la posición inicial.',
    nivel_esfuerzo: [
      { serie: 1, descripcion: 'FALLO − 2' },
      { serie: 2, descripcion: 'FALLO − 1' },
      { serie: 3, descripcion: 'FALLO' },
    ],
    descanso: '60 segundos entre series.',
    notas: [
      'Subir de peso siempre que sea posible cumpliendo las leyes anteriores.',
    ],
  },
  dias: [
    {
      numero: 1,
      nombre: 'Día 1 — Cardio',
      tipo:   'cardio',
      ejercicios: [
        { orden: 1, nombre: 'Cardio en bici', tipo: 'cardio', duracion_min: 40,
          video_url: 'https://vimeo.com/536327098/fef4e62f02' },
      ],
    },
    {
      numero: 2,
      nombre: 'Día 2 — Fullbody',
      tipo:   'fullbody',
      ejercicios: [
        { orden: 1, nombre: 'Calentamiento — remo', tipo: 'cardio', duracion_min: 5,
          video_url: 'https://vimeo.com/538089277/dd99b93922' },
        { orden: 2, nombre: 'Press de pecho (máquina)', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/523648209/20de96f697' },
        { orden: 3, nombre: 'Elevaciones laterales con mancuernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/546837503/96d52f5081' },
        { orden: 4, nombre: 'Curl bíceps con cable (martillo)', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527844115/685067787b' },
        { orden: 5, nombre: 'Jalón al pecho', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527236731/9422ac73d7' },
        { orden: 6, nombre: 'Curl bíceps con mancuernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/560448080/83bfa1033e' },
        { orden: 7, nombre: 'Curl femoral', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527220815/54e98d8957' },
        { orden: 8, nombre: 'Prensa de piernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/546834877/ba1fa16ec8' },
        { orden: 9, nombre: 'Cardio final — bici', tipo: 'cardio', duracion_min: 20,
          video_url: 'https://vimeo.com/536327098/fef4e62f02' },
      ],
    },
    {
      numero: 3,
      nombre: 'Día 3 — Fullbody',
      tipo:   'fullbody',
      ejercicios: [
        { orden: 1, nombre: 'Calentamiento — bici', tipo: 'cardio', duracion_min: 5,
          video_url: 'https://vimeo.com/536327098/fef4e62f02' },
        { orden: 2, nombre: 'Press banca con mancuernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/536298440/b81cc03ac0' },
        { orden: 3, nombre: 'Press inclinado con mancuernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/536311053/1abcefc180' },
        { orden: 4, nombre: 'Curl muñecas (cable)', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527218481/55d1cbd061' },
        { orden: 5, nombre: 'Remo unilateral con mancuerna', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/554726433/35d141ecf1' },
        { orden: 6, nombre: 'Curl bíceps frontal (cable)', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527205116/79df373a7e' },
        { orden: 7, nombre: 'Prensa de piernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/546834877/ba1fa16ec8' },
        { orden: 8, nombre: 'Curl femoral', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527220815/54e98d8957' },
        { orden: 9, nombre: 'Cardio final — bici', tipo: 'cardio', duracion_min: 20,
          video_url: 'https://vimeo.com/536327098/fef4e62f02' },
      ],
    },
    {
      numero: 4,
      nombre: 'Día 4 — Fullbody',
      tipo:   'fullbody',
      ejercicios: [
        { orden: 1, nombre: 'Calentamiento — remo', tipo: 'cardio', duracion_min: 5,
          video_url: 'https://vimeo.com/538089277/dd99b93922' },
        { orden: 2, nombre: 'Press militar con barra', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/554740021/5af31076cb' },
        { orden: 3, nombre: 'Jalón al pecho', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527236731/9422ac73d7' },
        { orden: 4, nombre: 'Press frontal con cable', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/536324671/0667d24ed9' },
        { orden: 5, nombre: 'Curl bíceps con barra (cable)', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/574927919/c7e3198b27' },
        { orden: 6, nombre: 'Zancadas con mancuernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/536328747/2e82c6abcb' },
        { orden: 7, nombre: 'Prensa horizontal de piernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527233725/ded517b55a' },
        { orden: 8, nombre: 'Cardio final — bici', tipo: 'cardio', duracion_min: 20,
          video_url: 'https://vimeo.com/536327098/fef4e62f02' },
      ],
    },
    {
      numero: 5,
      nombre: 'Día 5 — Cardio',
      tipo:   'cardio',
      ejercicios: [
        { orden: 1, nombre: 'Cardio en bici', tipo: 'cardio', duracion_min: 40,
          video_url: 'https://vimeo.com/536327098/fef4e62f02' },
      ],
    },
  ],
};

// Tabla 2 del entrenador — MES 2 (PDF "Tabla 2 GYM - Felipe Alejandro Pérez 21_06_26").
// Mismos criterios que la Tabla 1: los nombres de los ejercicios se infieren del
// contenido visual del vídeo (el PDF no los etiqueta) y se pueden editar desde la app.
// Esquema de repeticiones de fuerza: 10 / 8 / 8 (ver recomendaciones).
const SEED_TABLA_2 = {
  nombre:  'MES 2 — Tabla 2',
  fecha:   '2026-06-21',
  activa:  0,
  recomendaciones: {
    tempos: '1 segundo para la positiva, 3 segundos para la negativa.',
    positiva: 'Momento del ejercicio en el que contraes el músculo.',
    negativa: 'Momento excéntrico en el que aguantas la carga a la posición inicial.',
    nivel_esfuerzo: [
      { serie: 1, descripcion: 'FALLO − 2' },
      { serie: 2, descripcion: 'FALLO − 1' },
      { serie: 3, descripcion: 'FALLO' },
    ],
    descanso: '60 segundos entre series.',
    notas: [
      'Subir de peso siempre que sea posible cumpliendo las leyes anteriores.',
      'Repeticiones por serie en los ejercicios de fuerza: 10 / 8 / 8.',
    ],
  },
  dias: [
    {
      numero: 1,
      nombre: 'Día 1 — Cardio',
      tipo:   'cardio',
      ejercicios: [
        { orden: 1, nombre: 'Cardio en bici', tipo: 'cardio', duracion_min: 40,
          video_url: 'https://vimeo.com/536327098/fef4e62f02' },
      ],
    },
    {
      numero: 2,
      nombre: 'Día 2 — Fullbody',
      tipo:   'fullbody',
      ejercicios: [
        { orden: 1, nombre: 'Calentamiento — remo', tipo: 'cardio', duracion_min: 5,
          video_url: 'https://vimeo.com/538089277/dd99b93922' },
        { orden: 2, nombre: 'Press banca con barra', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/536294267/903843ae8e' },
        { orden: 3, nombre: 'Jalón al pecho', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527236731/9422ac73d7' },
        { orden: 4, nombre: 'Elevación lateral con cable', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/781412956/c9cdb757d1' },
        { orden: 5, nombre: 'Curl bíceps con mancuernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/560448080/83bfa1033e' },
        { orden: 6, nombre: 'Curl bíceps con cable (martillo)', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527844115/685067787b' },
        { orden: 7, nombre: 'Prensa de piernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/546834877/ba1fa16ec8' },
        { orden: 8, nombre: 'Abdominales', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://youtu.be/cSgu0Gj7v40' },
        { orden: 9, nombre: 'Cardio final — bici', tipo: 'cardio', duracion_min: 20,
          video_url: 'https://vimeo.com/536327098/fef4e62f02' },
      ],
    },
    {
      numero: 3,
      nombre: 'Día 3 — Tren superior',
      tipo:   'fullbody',
      ejercicios: [
        { orden: 1, nombre: 'Calentamiento — elíptica', tipo: 'cardio', duracion_min: 5,
          video_url: 'https://vimeo.com/527297408/2fdf8afc90' },
        { orden: 2, nombre: 'Press banca con barra', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/546842517/4a8db9bf81' },
        { orden: 3, nombre: 'Press inclinado con mancuernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/536311053/1abcefc180' },
        { orden: 4, nombre: 'Jalón al pecho', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527236731/9422ac73d7' },
        { orden: 5, nombre: 'Jalón al pecho (agarre abierto)', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527239313/3006b13227' },
        { orden: 6, nombre: 'Curl bíceps en banco inclinado', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/576223475/c91ce4787d' },
        { orden: 7, nombre: 'Pullover con mancuerna', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/536335568/70768f29bb' },
        { orden: 8, nombre: 'Cardio final — bici', tipo: 'cardio', duracion_min: 20,
          video_url: 'https://vimeo.com/536327098/fef4e62f02' },
      ],
    },
    {
      numero: 4,
      nombre: 'Día 4 — Tren inferior',
      tipo:   'fullbody',
      ejercicios: [
        { orden: 1, nombre: 'Calentamiento — elíptica', tipo: 'cardio', duracion_min: 5,
          video_url: 'https://vimeo.com/527297408/2fdf8afc90' },
        { orden: 2, nombre: 'Sentadilla con barra', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527196450/4d7287d7a9' },
        { orden: 3, nombre: 'Curl femoral', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/527220815/54e98d8957' },
        { orden: 4, nombre: 'Zancadas con mancuernas', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/536328747/2e82c6abcb' },
        { orden: 5, nombre: 'Hip thrust (empuje de cadera)', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/554713172/d3cf073d80' },
        { orden: 6, nombre: 'Zancadas en multipower (Smith)', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://vimeo.com/592107454/4cde12a8a6' },
        { orden: 7, nombre: 'Oblicuos', tipo: 'series', series: 3, repeticiones: 10,
          video_url: 'https://youtu.be/xq6MHZgI1XE' },
        { orden: 8, nombre: 'Cardio final — bici', tipo: 'cardio', duracion_min: 20,
          video_url: 'https://vimeo.com/536327098/fef4e62f02' },
      ],
    },
    {
      numero: 5,
      nombre: 'Día 5 — Cardio',
      tipo:   'cardio',
      ejercicios: [
        { orden: 1, nombre: 'Cardio en bici', tipo: 'cardio', duracion_min: 40,
          video_url: 'https://vimeo.com/536327098/fef4e62f02' },
      ],
    },
  ],
};

// Tabla 3 del entrenador — MES 3 (PDF "Tabla 3 GYM - Felipe Alejandro Pérez 19_07_26").
// Novedades de esta tabla respecto a las anteriores:
//   · 4 series por ejercicio de fuerza (antes 3), con esquema 12 / 12 / 10 / 8 repeticiones.
//   · Descanso de 50 segundos entre series (antes 60).
//   · Los días dejan de ser "fullbody": se reparten por grupos musculares.
//   · Cardio en escaladora (stepper) como calentamiento/final en varios días.
// Igual que en las tablas anteriores, los nombres de los ejercicios se infieren del
// contenido visual del vídeo (el PDF no los etiqueta) y se pueden editar desde la app.
// Los ejercicios de abdominales/oblicuos son enlaces de YouTube, no de Vimeo.
const SEED_TABLA_3 = {
  nombre:  'MES 3 — Tabla 3',
  fecha:   '2026-07-19',
  activa:  1,
  recomendaciones: {
    tempos: '1 segundo para la positiva, 3 segundos para la negativa.',
    positiva: 'Momento del ejercicio en el que contraes el músculo.',
    negativa: 'Momento excéntrico en el que aguantas la carga a la posición inicial.',
    nivel_esfuerzo: [
      { serie: 1, descripcion: 'FALLO − 2' },
      { serie: 2, descripcion: 'FALLO − 1' },
      { serie: 3, descripcion: 'FALLO' },
      { serie: 4, descripcion: 'FALLO + 1' },
    ],
    descanso: '50 segundos entre series.',
    // Repeticiones objetivo de cada serie en los ejercicios de fuerza.
    // La app las usa como referencia al registrar (ver renderSeriesSection en app.js).
    reps_por_serie: [12, 12, 10, 8],
    notas: [
      'Subir de peso siempre que sea posible cumpliendo las leyes anteriores.',
      'Repeticiones por serie en los ejercicios de fuerza: 12 / 12 / 10 / 8.',
    ],
  },
  dias: [
    {
      numero: 1,
      nombre: 'Día 1 — Pectoral / Espalda / Cuádriceps / Abs',
      tipo:   'fuerza',
      ejercicios: [
        { orden: 1, nombre: 'Calentamiento — remo', tipo: 'cardio', duracion_min: 5,
          video_url: 'https://vimeo.com/538089277/dd99b93922' },
        { orden: 2, nombre: 'Press de pecho (máquina)', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/523648209/20de96f697' },
        { orden: 3, nombre: 'Jalón al pecho', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527236731/9422ac73d7' },
        { orden: 4, nombre: 'Jalón al pecho (agarre neutro)', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527190465/e9783c826e' },
        { orden: 5, nombre: 'Remo unilateral con mancuerna', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/554726433/35d141ecf1' },
        { orden: 6, nombre: 'Prensa de piernas', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527195170/dfc45e22fd' },
        { orden: 7, nombre: 'Abdominales', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://youtu.be/cSgu0Gj7v40' },
        { orden: 8, nombre: 'Cardio final — escaladora (ritmo intenso)', tipo: 'cardio', duracion_min: 20,
          video_url: 'https://vimeo.com/528803433/d8506bc517' },
      ],
    },
    {
      numero: 2,
      nombre: 'Día 2 — Hombros / Bíceps / Tríceps',
      tipo:   'fuerza',
      ejercicios: [
        { orden: 1, nombre: 'Calentamiento — elíptica', tipo: 'cardio', duracion_min: 5,
          video_url: 'https://vimeo.com/527297408/2fdf8afc90' },
        { orden: 2, nombre: 'Press militar sentado con barra (multipower)', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527198434/5b9d4a096c' },
        { orden: 3, nombre: 'Elevaciones laterales con mancuernas', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/546837503/96d52f5081' },
        { orden: 4, nombre: 'Curl bíceps con barra (polea)', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527205116/79df373a7e' },
        { orden: 5, nombre: 'Curl martillo con mancuernas', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/575466779/eca17730a9' },
        { orden: 6, nombre: 'Curl bíceps con cable (martillo)', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527844115/685067787b' },
        { orden: 7, nombre: 'Cardio final — escaladora (ritmo intenso)', tipo: 'cardio', duracion_min: 20,
          video_url: 'https://vimeo.com/528803433/d8506bc517' },
      ],
    },
    {
      numero: 3,
      nombre: 'Día 3 — Cuádriceps / Isquios / Glúteos',
      tipo:   'fuerza',
      ejercicios: [
        { orden: 1, nombre: 'Calentamiento — escaladora', tipo: 'cardio', duracion_min: 5,
          video_url: 'https://vimeo.com/528803433/d8506bc517' },
        { orden: 2, nombre: 'Curl femoral sentado', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527220815/54e98d8957' },
        { orden: 3, nombre: 'Prensa de piernas', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527223306/6990a74380' },
        { orden: 4, nombre: 'Peso muerto rumano con barra', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/536330537/5d08f0ce10' },
        { orden: 5, nombre: 'Patada de glúteo en máquina', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527229466/7803d31a9f' },
        { orden: 6, nombre: 'Hip thrust (empuje de cadera)', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/554713172/d3cf073d80' },
        { orden: 7, nombre: 'Oblicuos', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://youtu.be/xq6MHZgI1XE' },
        { orden: 8, nombre: 'Cardio final — escaladora (ritmo intenso)', tipo: 'cardio', duracion_min: 20,
          video_url: 'https://vimeo.com/528803433/d8506bc517' },
      ],
    },
    {
      numero: 4,
      nombre: 'Día 4 — Pectoral / Tríceps / Espalda / Bíceps / Abs',
      tipo:   'fuerza',
      ejercicios: [
        { orden: 1, nombre: 'Calentamiento — remo', tipo: 'cardio', duracion_min: 5,
          video_url: 'https://vimeo.com/538089277/dd99b93922' },
        { orden: 2, nombre: 'Press banca con barra', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/523634069/6ddd7d8798' },
        { orden: 3, nombre: 'Extensión de tríceps sobre la cabeza (polea)', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/554740021/5af31076cb' },
        { orden: 4, nombre: 'Jalón al pecho (agarre abierto)', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527239313/3006b13227' },
        { orden: 5, nombre: 'Jalón al pecho', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527236731/9422ac73d7' },
        { orden: 6, nombre: 'Curl bíceps sentado en banco inclinado', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://vimeo.com/527244462/2a04bb66b4' },
        { orden: 7, nombre: 'Abdominales', tipo: 'series', series: 4, repeticiones: 12,
          video_url: 'https://youtu.be/cSgu0Gj7v40' },
        { orden: 8, nombre: 'Cardio final — escaladora (ritmo intenso)', tipo: 'cardio', duracion_min: 20,
          video_url: 'https://vimeo.com/528803433/d8506bc517' },
      ],
    },
    {
      numero: 5,
      nombre: 'Día 5 — Cardio',
      tipo:   'cardio',
      ejercicios: [
        { orden: 1, nombre: 'Cardio en escaladora', tipo: 'cardio', duracion_min: 45,
          video_url: 'https://vimeo.com/528803433/d8506bc517' },
      ],
    },
  ],
};

window.ENTRENO_SEED = { TABLA_1: SEED_TABLA_1, TABLA_2: SEED_TABLA_2, TABLA_3: SEED_TABLA_3 };
