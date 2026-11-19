// Application entry point: boots either a headless screenshot scene (?shot=cover|editor)
// or the full interactive Vice Cover editor pre-populated with sample photos.
// Supports multiple layouts (hero, grid, strip, mosaic, triptych) and keyboard shortcuts.

import { SIZES } from './layout.js';
import { renderPoster } from './render.js';
import { createInitialState, initEditor, loadSamplePhotos } from './editor.js';

function applyQueryParams(state, params) {
  const size = params.get('size');
  if (size && SIZES[size]) state.size = size;

  const grade = params.get('grade');
  if (grade && ['sunset', 'neon', 'noir', 'gold', 'vice'].includes(grade)) {
    state.grade = grade;
  }

  const layout = params.get('layout');
  if (layout && ['hero', 'quad', 'grid', 'strip', 'mosaic', 'triptych'].includes(layout)) {
    state.layout = layout;
  }

  const lettering = params.get('lettering');
  if (lettering && ['block', 'chrome', 'neon'].includes(lettering)) {
    state.lettering = lettering;
  }

  const caption = params.get('caption');
  if (caption !== null) {
    state.caption = caption.slice(0, 40);
  }

  const subtitle = params.get('subtitle');
  if (subtitle !== null) {
    state.subtitle = subtitle.slice(0, 40);
  }

  const seedParam = params.get('seed');
  if (seedParam !== null && Number.isFinite(Number(seedParam))) {
    state.seed = Math.abs(Math.trunc(Number(seedParam))) || 1986;
  }
}

function signalShotReady() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.__shotReady = true;
    });
  });
}

async function boot() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  const state = createInitialState();

  applyQueryParams(state, params);
  await loadSamplePhotos(state);

  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    const canvas = document.getElementById('poster-canvas');
    const spec = SIZES[state.size] ?? SIZES.tall;
    canvas.width = spec.w;
    canvas.height = spec.h;
    renderPoster(canvas, state, { showSelection: false });
    signalShotReady();
    return;
  }

  if (shot === 'editor') {
    document.body.classList.add('shot-editor');
    const editor = initEditor(state, { isShotMode: false });
    editor.syncControlsFromState();
    editor.renderNow();
    signalShotReady();
    return;
  }

  // Normal interactive launch with all keyboard shortcuts and undo/redo support
  initEditor(state, { isShotMode: false });
}

boot();

