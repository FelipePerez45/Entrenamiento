// Semilla con la Tabla 1 del entrenador (PDF "Tabla 1 GYM - Felipe Alejandro Pérez 21_05_26").
// Cada semana se pueden añadir nuevas tablas desde la propia app.
// Los nombres de los ejercicios son inferidos por el contenido visual del vídeo
// (el PDF original no los etiqueta), se pueden editar desde la app.

const SEED_TABLA_1 = {
  nombre:  'Tabla 1',
  fecha:   '2026-05-21',
  activa:  1,
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

window.ENTRENO_SEED = { TABLA_1: SEED_TABLA_1 };
