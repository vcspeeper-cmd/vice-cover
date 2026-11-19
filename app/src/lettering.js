// GTA-inspired display lettering: custom-drawn vector glyphs (A-Z, 0-9, punctuation)
// in bold condensed uppercase with -6 deg skew, letter spacing, auto-fit sizing,
// heavy dark ink outline, crisp light inner stroke, chromatic fringe, and three finishes.

import { getGradePalette } from './grade.js';

export const LETTERING_STYLES = [
  { id: 'block', label: 'Block Ink' },
  { id: 'chrome', label: 'Chrome 80s' },
  { id: 'neon', label: 'Neon Glow' },
];

const SKEW_RAD = (-6 * Math.PI) / 180;
const CONDENSE_X = 0.78;

// Vector glyph table: each glyph is a function that draws a Path2D into a context at (0,0) with width w
// Glyphs are normalized to fit roughly in a 1.0 unit square vertically, scaled by fontSize
const GLYPHS = {
  'A': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.15 * w, 1.0 * w);
    p.lineTo(0.5 * w, 0.0 * w);
    p.lineTo(0.85 * w, 1.0 * w);
    p.lineTo(0.72 * w, 1.0 * w);
    p.lineTo(0.62 * w, 0.52 * w);
    p.lineTo(0.38 * w, 0.52 * w);
    p.lineTo(0.28 * w, 1.0 * w);
    p.closePath();
    return p;
  },
  'B': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    p.lineTo(0.72 * w, 1.0 * w);
    p.quadraticCurveTo(0.82 * w, 0.88 * w, 0.82 * w, 0.76 * w);
    p.quadraticCurveTo(0.82 * w, 0.62 * w, 0.72 * w, 0.52 * w);
    p.lineTo(0.18 * w, 0.52 * w);
    p.lineTo(0.72 * w, 0.52 * w);
    p.quadraticCurveTo(0.82 * w, 0.42 * w, 0.82 * w, 0.26 * w);
    p.quadraticCurveTo(0.82 * w, 0.12 * w, 0.72 * w, 0.0 * w);
    p.closePath();
    return p;
  },
  'C': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.82 * w, 0.1 * w);
    p.quadraticCurveTo(0.72 * w, 0.0 * w, 0.35 * w, 0.0 * w);
    p.lineTo(0.35 * w, 1.0 * w);
    p.quadraticCurveTo(0.72 * w, 1.0 * w, 0.82 * w, 0.9 * w);
    return p;
  },
  'D': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    p.lineTo(0.65 * w, 1.0 * w);
    p.quadraticCurveTo(0.82 * w, 0.88 * w, 0.82 * w, 0.5 * w);
    p.quadraticCurveTo(0.82 * w, 0.12 * w, 0.65 * w, 0.0 * w);
    p.closePath();
    return p;
  },
  'E': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.82 * w, 0.0 * w);
    p.lineTo(0.18 * w, 0.0 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    p.moveTo(0.18 * w, 0.5 * w);
    p.lineTo(0.75 * w, 0.5 * w);
    return p;
  },
  'F': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.82 * w, 0.0 * w);
    p.moveTo(0.18 * w, 0.5 * w);
    p.lineTo(0.75 * w, 0.5 * w);
    return p;
  },
  'G': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.82 * w, 0.1 * w);
    p.quadraticCurveTo(0.72 * w, 0.0 * w, 0.35 * w, 0.0 * w);
    p.lineTo(0.35 * w, 1.0 * w);
    p.quadraticCurveTo(0.72 * w, 1.0 * w, 0.82 * w, 0.9 * w);
    p.lineTo(0.82 * w, 0.5 * w);
    p.lineTo(0.45 * w, 0.5 * w);
    return p;
  },
  'H': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    p.moveTo(0.82 * w, 0.0 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    p.moveTo(0.18 * w, 0.5 * w);
    p.lineTo(0.82 * w, 0.5 * w);
    return p;
  },
  'I': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.5 * w, 0.0 * w);
    p.lineTo(0.5 * w, 1.0 * w);
    p.moveTo(0.25 * w, 0.0 * w);
    p.lineTo(0.75 * w, 0.0 * w);
    p.moveTo(0.25 * w, 1.0 * w);
    p.lineTo(0.75 * w, 1.0 * w);
    return p;
  },
  'J': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.75 * w, 0.0 * w);
    p.lineTo(0.75 * w, 0.85 * w);
    p.quadraticCurveTo(0.75 * w, 1.0 * w, 0.5 * w, 1.0 * w);
    p.quadraticCurveTo(0.2 * w, 1.0 * w, 0.2 * w, 0.85 * w);
    return p;
  },
  'K': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    p.moveTo(0.82 * w, 0.0 * w);
    p.lineTo(0.18 * w, 0.5 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    return p;
  },
  'L': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    return p;
  },
  'M': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 1.0 * w);
    p.lineTo(0.18 * w, 0.0 * w);
    p.lineTo(0.5 * w, 0.4 * w);
    p.lineTo(0.82 * w, 0.0 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    return p;
  },
  'N': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 1.0 * w);
    p.lineTo(0.18 * w, 0.0 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    p.lineTo(0.82 * w, 0.0 * w);
    return p;
  },
  'O': (ctx, w) => {
    const p = new Path2D();
    p.ellipse(0.5 * w, 0.5 * w, 0.32 * w, 0.5 * w, 0, 0, Math.PI * 2);
    return p;
  },
  'P': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 1.0 * w);
    p.lineTo(0.18 * w, 0.0 * w);
    p.lineTo(0.72 * w, 0.0 * w);
    p.quadraticCurveTo(0.82 * w, 0.08 * w, 0.82 * w, 0.26 * w);
    p.quadraticCurveTo(0.82 * w, 0.42 * w, 0.72 * w, 0.5 * w);
    p.lineTo(0.18 * w, 0.5 * w);
    return p;
  },
  'Q': (ctx, w) => {
    const p = new Path2D();
    p.ellipse(0.5 * w, 0.45 * w, 0.32 * w, 0.45 * w, 0, 0, Math.PI * 2);
    p.moveTo(0.7 * w, 0.75 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    return p;
  },
  'R': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 1.0 * w);
    p.lineTo(0.18 * w, 0.0 * w);
    p.lineTo(0.72 * w, 0.0 * w);
    p.quadraticCurveTo(0.82 * w, 0.08 * w, 0.82 * w, 0.26 * w);
    p.quadraticCurveTo(0.82 * w, 0.42 * w, 0.72 * w, 0.5 * w);
    p.lineTo(0.18 * w, 0.5 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    return p;
  },
  'S': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.82 * w, 0.15 * w);
    p.quadraticCurveTo(0.72 * w, 0.0 * w, 0.35 * w, 0.0 * w);
    p.quadraticCurveTo(0.18 * w, 0.0 * w, 0.18 * w, 0.2 * w);
    p.quadraticCurveTo(0.18 * w, 0.35 * w, 0.5 * w, 0.45 * w);
    p.quadraticCurveTo(0.82 * w, 0.55 * w, 0.82 * w, 0.8 * w);
    p.quadraticCurveTo(0.82 * w, 1.0 * w, 0.48 * w, 1.0 * w);
    p.quadraticCurveTo(0.18 * w, 1.0 * w, 0.18 * w, 0.85 * w);
    return p;
  },
  'T': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.0 * w, 0.0 * w);
    p.lineTo(1.0 * w, 0.0 * w);
    p.moveTo(0.5 * w, 0.0 * w);
    p.lineTo(0.5 * w, 1.0 * w);
    return p;
  },
  'U': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.18 * w, 0.85 * w);
    p.quadraticCurveTo(0.18 * w, 1.0 * w, 0.5 * w, 1.0 * w);
    p.quadraticCurveTo(0.82 * w, 1.0 * w, 0.82 * w, 0.85 * w);
    p.lineTo(0.82 * w, 0.0 * w);
    return p;
  },
  'V': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.5 * w, 1.0 * w);
    p.lineTo(0.82 * w, 0.0 * w);
    return p;
  },
  'W': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.1 * w, 0.0 * w);
    p.lineTo(0.35 * w, 1.0 * w);
    p.lineTo(0.5 * w, 0.55 * w);
    p.lineTo(0.65 * w, 1.0 * w);
    p.lineTo(0.9 * w, 0.0 * w);
    return p;
  },
  'X': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    p.moveTo(0.82 * w, 0.0 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    return p;
  },
  'Y': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.5 * w, 0.55 * w);
    p.lineTo(0.82 * w, 0.0 * w);
    p.moveTo(0.5 * w, 0.55 * w);
    p.lineTo(0.5 * w, 1.0 * w);
    return p;
  },
  'Z': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.82 * w, 0.0 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.82 * w, 0.0 * w);
    p.moveTo(0.18 * w, 1.0 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    return p;
  },
  '0': (ctx, w) => {
    const p = new Path2D();
    p.ellipse(0.5 * w, 0.5 * w, 0.3 * w, 0.5 * w, 0, 0, Math.PI * 2);
    p.moveTo(0.25 * w, 0.25 * w);
    p.lineTo(0.75 * w, 0.75 * w);
    return p;
  },
  '1': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.5 * w, 0.0 * w);
    p.lineTo(0.5 * w, 1.0 * w);
    p.moveTo(0.25 * w, 1.0 * w);
    p.lineTo(0.75 * w, 1.0 * w);
    return p;
  },
  '2': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.25 * w);
    p.quadraticCurveTo(0.18 * w, 0.0 * w, 0.5 * w, 0.0 * w);
    p.quadraticCurveTo(0.82 * w, 0.0 * w, 0.82 * w, 0.25 * w);
    p.quadraticCurveTo(0.82 * w, 0.5 * w, 0.18 * w, 0.85 * w);
    p.lineTo(0.82 * w, 0.85 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    return p;
  },
  '3': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.72 * w, 0.0 * w);
    p.quadraticCurveTo(0.82 * w, 0.08 * w, 0.82 * w, 0.25 * w);
    p.quadraticCurveTo(0.82 * w, 0.4 * w, 0.5 * w, 0.5 * w);
    p.quadraticCurveTo(0.82 * w, 0.6 * w, 0.82 * w, 0.75 * w);
    p.quadraticCurveTo(0.82 * w, 0.92 * w, 0.72 * w, 1.0 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    return p;
  },
  '4': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.68 * w, 0.0 * w);
    p.lineTo(0.18 * w, 0.65 * w);
    p.lineTo(0.82 * w, 0.65 * w);
    p.moveTo(0.68 * w, 0.0 * w);
    p.lineTo(0.68 * w, 1.0 * w);
    return p;
  },
  '5': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.82 * w, 0.0 * w);
    p.lineTo(0.18 * w, 0.0 * w);
    p.lineTo(0.18 * w, 0.5 * w);
    p.lineTo(0.72 * w, 0.5 * w);
    p.quadraticCurveTo(0.82 * w, 0.58 * w, 0.82 * w, 0.75 * w);
    p.quadraticCurveTo(0.82 * w, 0.92 * w, 0.72 * w, 1.0 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    return p;
  },
  '6': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.72 * w, 0.0 * w);
    p.quadraticCurveTo(0.18 * w, 0.0 * w, 0.18 * w, 0.5 * w);
    p.lineTo(0.18 * w, 0.85 * w);
    p.quadraticCurveTo(0.18 * w, 1.0 * w, 0.5 * w, 1.0 * w);
    p.quadraticCurveTo(0.82 * w, 1.0 * w, 0.82 * w, 0.75 * w);
    p.quadraticCurveTo(0.82 * w, 0.55 * w, 0.5 * w, 0.5 * w);
    p.quadraticCurveTo(0.18 * w, 0.5 * w, 0.18 * w, 0.65 * w);
    return p;
  },
  '7': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.0 * w);
    p.lineTo(0.82 * w, 0.0 * w);
    p.lineTo(0.25 * w, 1.0 * w);
    return p;
  },
  '8': (ctx, w) => {
    const p = new Path2D();
    p.ellipse(0.5 * w, 0.35 * w, 0.32 * w, 0.35 * w, 0, 0, Math.PI * 2);
    p.ellipse(0.5 * w, 0.65 * w, 0.32 * w, 0.35 * w, 0, 0, Math.PI * 2);
    return p;
  },
  '9': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.82 * w, 1.0 * w);
    p.quadraticCurveTo(0.82 * w, 0.5 * w, 0.5 * w, 0.5 * w);
    p.quadraticCurveTo(0.18 * w, 0.5 * w, 0.18 * w, 0.25 * w);
    p.quadraticCurveTo(0.18 * w, 0.0 * w, 0.28 * w, 0.0 * w);
    p.quadraticCurveTo(0.82 * w, 0.0 * w, 0.82 * w, 0.5 * w);
    return p;
  },
  ' ': (ctx, w) => new Path2D(),
  '-': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.15 * w, 0.5 * w);
    p.lineTo(0.85 * w, 0.5 * w);
    return p;
  },
  "'": (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.5 * w, 0.0 * w);
    p.lineTo(0.35 * w, 0.3 * w);
    return p;
  },
  '!': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.5 * w, 0.0 * w);
    p.lineTo(0.5 * w, 0.7 * w);
    p.arc(0.5 * w, 0.9 * w, 0.08 * w, 0, Math.PI * 2);
    return p;
  },
  '?': (ctx, w) => {
    const p = new Path2D();
    p.moveTo(0.18 * w, 0.15 * w);
    p.quadraticCurveTo(0.18 * w, 0.0 * w, 0.5 * w, 0.0 * w);
    p.quadraticCurveTo(0.82 * w, 0.0 * w, 0.82 * w, 0.25 * w);
    p.quadraticCurveTo(0.82 * w, 0.45 * w, 0.5 * w, 0.55 * w);
    p.lineTo(0.5 * w, 0.7 * w);
    p.arc(0.5 * w, 0.9 * w, 0.08 * w, 0, Math.PI * 2);
    return p;
  },
  '.': (ctx, w) => {
    const p = new Path2D();
    p.arc(0.5 * w, 0.85 * w, 0.1 * w, 0, Math.PI * 2);
    return p;
  },
  '&': (ctx, w) => {
    const p = new Path2D();
    p.arc(0.35 * w, 0.3 * w, 0.15 * w, 0, Math.PI * 2);
    p.moveTo(0.5 * w, 0.45 * w);
    p.lineTo(0.75 * w, 1.0 * w);
    p.moveTo(0.5 * w, 0.45 * w);
    p.lineTo(0.18 * w, 1.0 * w);
    p.lineTo(0.82 * w, 1.0 * w);
    return p;
  },
};

/** Measures total advance width of a string with custom tracking (letter spacing). */
function measureTracked(ctx, text, unitSize, tracking) {
  if (!text) return 0;
  let total = 0;
  for (let i = 0; i < text.length; i++) {
    total += unitSize * 0.55;
    if (i < text.length - 1) total += tracking;
  }
  return total;
}

/** Wraps caption into 1 or 2 punchy lines when long. */
function splitLines(raw) {
  const clean = raw.trim().replace(/\s+/g, ' ').toUpperCase();
  if (!clean) return [];
  if (clean.length <= 15 || !clean.includes(' ')) return [clean];

  const words = clean.split(' ');
  let bestIdx = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const diff = Math.abs(a.length - b.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return [words.slice(0, bestIdx).join(' '), words.slice(bestIdx).join(' ')];
}

/**
 * Renders the poster caption and optional subtitle in the lower third using custom vector glyphs.
 */
export function drawCaption(ctx, width, height, caption, subtitle, styleId, gradeId) {
  const lines = splitLines(caption);
  const sub = (subtitle ?? '').trim().replace(/\s+/g, ' ').toUpperCase();
  if (lines.length === 0 && !sub) return;

  const palette = getGradePalette(gradeId);
  const unit = Math.min(width, height);
  const maxWidth = width * 0.84;

  // Auto-fit condensed font size
  let fontSize = Math.round(unit * (lines.length > 1 ? 0.118 : 0.145));
  const minFontSize = Math.max(26, Math.round(unit * 0.042));
  const trackingRatio = 0.065;

  const fitsAt = (size) => {
    const tracking = size * trackingRatio;
    for (const line of lines) {
      const renderedW = measureTracked(ctx, line, size, tracking) * CONDENSE_X;
      if (renderedW > maxWidth) return false;
    }
    return true;
  };

  while (fontSize > minFontSize && !fitsAt(fontSize)) {
    fontSize -= 2;
  }

  const tracking = fontSize * trackingRatio;
  const lineHeight = fontSize * 0.96;

  // Anchor block in lower third
  const subBlock = sub ? fontSize * 0.44 : 0;
  const blockH = lines.length * lineHeight + subBlock;
  const centerX = width * 0.5;
  const anchorY = height * 0.805 - blockH * 0.5 + fontSize * 0.44;

  ctx.save();

  // Subtle dark backing glow for readability
  const glowR = Math.max(width * 0.45, blockH * 1.6);
  const backGlow = ctx.createRadialGradient(
    centerX,
    anchorY + (lines.length - 1) * lineHeight * 0.5,
    fontSize * 0.2,
    centerX,
    anchorY + (lines.length - 1) * lineHeight * 0.5,
    glowR
  );
  backGlow.addColorStop(0, 'rgba(8, 2, 16, 0.58)');
  backGlow.addColorStop(0.55, 'rgba(8, 2, 16, 0.26)');
  backGlow.addColorStop(1, 'rgba(8, 2, 16, 0)');
  ctx.fillStyle = backGlow;
  ctx.fillRect(0, height * 0.52, width, height * 0.48);

  // Apply -6 deg skew and horizontal squeeze
  ctx.translate(centerX, anchorY);
  ctx.transform(CONDENSE_X, 0, Math.tan(SKEW_RAD), 1, 0, 0);

  const heavyOutline = Math.max(6, Math.round(fontSize * 0.165));
  const innerStroke = Math.max(1.5, fontSize * 0.028);
  const fringeShift = Math.max(2, fontSize * 0.032);
  const shadowOffset = Math.max(3, fontSize * 0.065);
  const glyphScale = fontSize / 1.0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const y = i * lineHeight;
    const lineW = measureTracked(ctx, line, fontSize, tracking);
    let x = -lineW / 2;

    for (const ch of line) {
      const glyphFn = GLYPHS[ch] || GLYPHS[' '];
      const glyphPath = glyphFn(ctx, 1.0);

      // 1. Chromatic aberration fringe (offset glyphs)
      ctx.save();
      ctx.translate(x - fringeShift, y - fringeShift * 0.25);
      ctx.scale(glyphScale, glyphScale);
      ctx.fillStyle = palette.fringeA;
      ctx.fill(glyphPath);
      ctx.restore();

      ctx.save();
      ctx.translate(x + fringeShift, y + fringeShift * 0.25);
      ctx.scale(glyphScale, glyphScale);
      ctx.fillStyle = palette.fringeB;
      ctx.fill(glyphPath);
      ctx.restore();

      // 2. Hard drop shadow
      ctx.save();
      ctx.translate(x + shadowOffset, y + shadowOffset);
      ctx.scale(glyphScale, glyphScale);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fill(glyphPath);
      ctx.restore();

      // 3. Style-specific fill & outline
      if (styleId === 'neon') {
        // Heavy dark ink housing
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(glyphScale, glyphScale);
        ctx.strokeStyle = '#090314';
        ctx.lineWidth = heavyOutline / glyphScale;
        ctx.stroke(glyphPath);
        ctx.restore();

        // Neon glow with shadowBlur
        ctx.save();
        ctx.translate(x, y);
        ctx.shadowColor = '#ff1eb8';
        ctx.shadowBlur = fontSize * 0.34;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        const neonGrad = ctx.createLinearGradient(0, -fontSize * 0.45, 0, fontSize * 0.45);
        neonGrad.addColorStop(0.0, '#ffffff');
        neonGrad.addColorStop(0.35, '#9bfbff');
        neonGrad.addColorStop(0.70, '#ff8ee8');
        neonGrad.addColorStop(1.0, '#fff0fb');
        ctx.fillStyle = neonGrad;
        ctx.scale(glyphScale, glyphScale);
        ctx.fill(glyphPath);

        // Inner bright highlight
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = innerStroke / glyphScale;
        ctx.stroke(glyphPath);
        ctx.restore();
      } else if (styleId === 'chrome') {
        // Heavy dark outline
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(glyphScale, glyphScale);
        ctx.strokeStyle = '#0c0814';
        ctx.lineWidth = heavyOutline / glyphScale;
        ctx.stroke(glyphPath);

        // Chrome gradient
        const chromeGrad = ctx.createLinearGradient(0, -fontSize * 0.44, 0, fontSize * 0.44);
        chromeGrad.addColorStop(0.00, '#ffffff');
        chromeGrad.addColorStop(0.24, '#c7d6eb');
        chromeGrad.addColorStop(0.46, '#485b78');
        chromeGrad.addColorStop(0.51, '#1c2033');
        chromeGrad.addColorStop(0.56, '#ffd2a8');
        chromeGrad.addColorStop(0.76, '#eef4ff');
        chromeGrad.addColorStop(1.00, '#8092ad');
        ctx.fillStyle = chromeGrad;
        ctx.fill(glyphPath);

        // Thin light bevel
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = innerStroke / glyphScale;
        ctx.stroke(glyphPath);
        ctx.restore();
      } else {
        // Block: solid white with heavy black outline
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(glyphScale, glyphScale);
        ctx.strokeStyle = '#0a080e';
        ctx.lineWidth = heavyOutline / glyphScale;
        ctx.stroke(glyphPath);

        ctx.fillStyle = '#ffffff';
        ctx.fill(glyphPath);

        ctx.strokeStyle = 'rgba(255, 245, 232, 0.88)';
        ctx.lineWidth = innerStroke / glyphScale;
        ctx.stroke(glyphPath);
        ctx.restore();
      }

      x += fontSize * 0.55 + tracking;
    }
  }

  // Optional subtitle ribbon
  if (sub) {
    let subSize = Math.max(18, Math.round(fontSize * 0.28));
    const subTracking = subSize * 0.16;
    while (subSize > 14 && measureTracked(ctx, sub, subSize, subTracking) * CONDENSE_X > maxWidth * 0.92) {
      subSize -= 1;
    }

    const subY = (lines.length - 1) * lineHeight + fontSize * 0.62 + subSize * 0.45;
    const textW = measureTracked(ctx, sub, subSize, subSize * 0.16);
    const pillPadX = subSize * 0.85;
    const pillH = subSize * 1.65;

    // Angled dark ink nameplate pill
    ctx.fillStyle = 'rgba(10, 6, 18, 0.90)';
    ctx.fillRect(-textW / 2 - pillPadX, subY - pillH / 2, textW + pillPadX * 2, pillH);

    // Accent border
    ctx.strokeStyle = styleId === 'neon' ? '#00f2ff' : palette.sky[4];
    ctx.lineWidth = Math.max(1.5, subSize * 0.08);
    ctx.strokeRect(-textW / 2 - pillPadX, subY - pillH / 2, textW + pillPadX * 2, pillH);

    // Subtitle text (simple rendering for subtitle)
    ctx.fillStyle = styleId === 'neon' ? '#9bfbff' : '#fff7e8';
    let subX = -textW / 2;
    for (const ch of sub) {
      const glyphFn = GLYPHS[ch] || GLYPHS[' '];
      const glyphPath = glyphFn(ctx, 1.0);
      ctx.save();
      ctx.translate(subX, subY);
      ctx.scale(subSize / 1.0, subSize / 1.0);
      ctx.fill(glyphPath);
      ctx.restore();
      subX += subSize * 0.55 + subSize * 0.16;
    }
  }

  ctx.restore();
}
