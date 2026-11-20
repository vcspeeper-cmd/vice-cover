// GTA-inspired display lettering: custom-drawn vector glyphs (A-Z, 0-9, punctuation)
// in bold condensed uppercase with -6 deg skew, character advance widths, auto-fit sizing,
// heavy dark ink outline, crisp light inner stroke, chromatic fringe, and three finishes.

import { getGradePalette } from './grade.js';
import { computePanels } from './layout.js';
import { deriveSeed, mulberry32, randInt, randRange } from './prng.js';

export const LETTERING_STYLES = [
  { id: 'block', label: 'Block Ink' },
  { id: 'chrome', label: 'Chrome 80s' },
  { id: 'neon', label: 'Neon Glow' },
];

const SKEW_RAD = (-6 * Math.PI) / 180;
const CONDENSE_X = 0.78;

// Relative advance widths in 1.0 em height units for each character
const ADVANCE_WIDTHS = {
  'A': 0.70, 'B': 0.65, 'C': 0.65, 'D': 0.68, 'E': 0.60, 'F': 0.58,
  'G': 0.70, 'H': 0.68, 'I': 0.32, 'J': 0.52, 'K': 0.66, 'L': 0.56,
  'M': 0.82, 'N': 0.68, 'O': 0.72, 'P': 0.64, 'Q': 0.72, 'R': 0.66,
  'S': 0.62, 'T': 0.62, 'U': 0.68, 'V': 0.68, 'W': 0.88, 'X': 0.66,
  'Y': 0.66, 'Z': 0.64,
  '0': 0.68, '1': 0.36, '2': 0.62, '3': 0.62, '4': 0.66, '5': 0.62,
  '6': 0.64, '7': 0.60, '8': 0.66, '9': 0.64,
  ' ': 0.30, '-': 0.45, "'": 0.25, '!': 0.30, '?': 0.60, '.': 0.28, '&': 0.72
};

function getAdvanceWidth(ch) {
  return ADVANCE_WIDTHS[ch] || 0.65;
}

// Filled vector glyph definitions drawn in box (0,0) to (w, 1.0)
const GLYPHS = {
  'A': (w) => {
    const p = new Path2D();
    // Outer triangular arch
    p.moveTo(0, 1.0);
    p.lineTo(w * 0.36, 0);
    p.lineTo(w * 0.64, 0);
    p.lineTo(w, 1.0);
    p.lineTo(w * 0.76, 1.0);
    p.lineTo(w * 0.66, 0.68);
    p.lineTo(w * 0.34, 0.68);
    p.lineTo(w * 0.24, 1.0);
    p.closePath();
    // Counter triangle
    p.moveTo(w * 0.40, 0.46);
    p.lineTo(w * 0.60, 0.46);
    p.lineTo(w * 0.50, 0.18);
    p.closePath();
    return p;
  },
  'B': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.70, 0);
    p.quadraticCurveTo(w, 0, w, 0.26);
    p.quadraticCurveTo(w, 0.46, w * 0.75, 0.48);
    p.quadraticCurveTo(w * 0.98, 0.52, w * 0.98, 0.74);
    p.quadraticCurveTo(w * 0.98, 1.0, w * 0.68, 1.0);
    p.lineTo(0, 1.0);
    p.closePath();
    // Top bowl counter
    p.moveTo(w * 0.22, 0.20);
    p.lineTo(w * 0.56, 0.20);
    p.quadraticCurveTo(w * 0.74, 0.20, w * 0.74, 0.33);
    p.quadraticCurveTo(w * 0.74, 0.44, w * 0.56, 0.44);
    p.lineTo(w * 0.22, 0.44);
    p.closePath();
    // Bottom bowl counter
    p.moveTo(w * 0.22, 0.58);
    p.lineTo(w * 0.58, 0.58);
    p.quadraticCurveTo(w * 0.76, 0.58, w * 0.76, 0.72);
    p.quadraticCurveTo(w * 0.76, 0.84, w * 0.58, 0.84);
    p.lineTo(w * 0.22, 0.84);
    p.closePath();
    return p;
  },
  'C': (w) => {
    const p = new Path2D();
    p.moveTo(w, 0.28);
    p.lineTo(w * 0.76, 0.20);
    p.quadraticCurveTo(w * 0.24, 0.18, w * 0.22, 0.50);
    p.quadraticCurveTo(w * 0.24, 0.82, w * 0.76, 0.80);
    p.lineTo(w, 0.72);
    p.lineTo(w, 1.0);
    p.quadraticCurveTo(0, 1.02, 0, 0.50);
    p.quadraticCurveTo(0, -0.02, w, 0);
    p.closePath();
    return p;
  },
  'D': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.58, 0);
    p.quadraticCurveTo(w, 0, w, 0.50);
    p.quadraticCurveTo(w, 1.0, w * 0.58, 1.0);
    p.lineTo(0, 1.0);
    p.closePath();
    // Single counter
    p.moveTo(w * 0.22, 0.20);
    p.lineTo(w * 0.50, 0.20);
    p.quadraticCurveTo(w * 0.76, 0.20, w * 0.76, 0.50);
    p.quadraticCurveTo(w * 0.76, 0.80, w * 0.50, 0.80);
    p.lineTo(w * 0.22, 0.80);
    p.closePath();
    return p;
  },
  'E': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w, 0);
    p.lineTo(w, 0.20);
    p.lineTo(w * 0.22, 0.20);
    p.lineTo(w * 0.22, 0.40);
    p.lineTo(w * 0.88, 0.40);
    p.lineTo(w * 0.88, 0.58);
    p.lineTo(w * 0.22, 0.58);
    p.lineTo(w * 0.22, 0.80);
    p.lineTo(w, 0.80);
    p.lineTo(w, 1.0);
    p.lineTo(0, 1.0);
    p.closePath();
    return p;
  },
  'F': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w, 0);
    p.lineTo(w, 0.20);
    p.lineTo(w * 0.22, 0.20);
    p.lineTo(w * 0.22, 0.40);
    p.lineTo(w * 0.88, 0.40);
    p.lineTo(w * 0.88, 0.58);
    p.lineTo(w * 0.22, 0.58);
    p.lineTo(w * 0.22, 1.0);
    p.lineTo(0, 1.0);
    p.closePath();
    return p;
  },
  'G': (w) => {
    const p = new Path2D();
    p.moveTo(w, 0.28);
    p.lineTo(w * 0.76, 0.20);
    p.quadraticCurveTo(w * 0.24, 0.18, w * 0.22, 0.50);
    p.quadraticCurveTo(w * 0.24, 0.82, w * 0.76, 0.80);
    p.lineTo(w * 0.76, 0.58);
    p.lineTo(w * 0.52, 0.58);
    p.lineTo(w * 0.52, 0.40);
    p.lineTo(w, 0.40);
    p.lineTo(w, 1.0);
    p.quadraticCurveTo(0, 1.02, 0, 0.50);
    p.quadraticCurveTo(0, -0.02, w, 0);
    p.closePath();
    return p;
  },
  'H': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.22, 0);
    p.lineTo(w * 0.22, 0.40);
    p.lineTo(w * 0.78, 0.40);
    p.lineTo(w * 0.78, 0);
    p.lineTo(w, 0);
    p.lineTo(w, 1.0);
    p.lineTo(w * 0.78, 1.0);
    p.lineTo(w * 0.78, 0.58);
    p.lineTo(w * 0.22, 0.58);
    p.lineTo(w * 0.22, 1.0);
    p.lineTo(0, 1.0);
    p.closePath();
    return p;
  },
  'I': (w) => {
    const p = new Path2D();
    p.rect(0, 0, w, 1.0);
    return p;
  },
  'J': (w) => {
    const p = new Path2D();
    p.moveTo(w * 0.38, 0);
    p.lineTo(w, 0);
    p.lineTo(w, 0.72);
    p.quadraticCurveTo(w, 1.02, w * 0.48, 1.0);
    p.quadraticCurveTo(0, 1.0, 0, 0.68);
    p.lineTo(w * 0.22, 0.68);
    p.quadraticCurveTo(w * 0.22, 0.82, w * 0.48, 0.82);
    p.quadraticCurveTo(w * 0.78, 0.82, w * 0.78, 0.68);
    p.lineTo(w * 0.78, 0.20);
    p.lineTo(w * 0.38, 0.20);
    p.closePath();
    return p;
  },
  'K': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.22, 0);
    p.lineTo(w * 0.22, 0.40);
    p.lineTo(w * 0.64, 0);
    p.lineTo(w, 0);
    p.lineTo(w * 0.48, 0.48);
    p.lineTo(w, 1.0);
    p.lineTo(w * 0.68, 1.0);
    p.lineTo(w * 0.22, 0.56);
    p.lineTo(w * 0.22, 1.0);
    p.lineTo(0, 1.0);
    p.closePath();
    return p;
  },
  'L': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.22, 0);
    p.lineTo(w * 0.22, 0.80);
    p.lineTo(w, 0.80);
    p.lineTo(w, 1.0);
    p.lineTo(0, 1.0);
    p.closePath();
    return p;
  },
  'M': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.26, 0);
    p.lineTo(w * 0.50, 0.55);
    p.lineTo(w * 0.74, 0);
    p.lineTo(w, 0);
    p.lineTo(w, 1.0);
    p.lineTo(w * 0.78, 1.0);
    p.lineTo(w * 0.78, 0.30);
    p.lineTo(w * 0.56, 0.80);
    p.lineTo(w * 0.44, 0.80);
    p.lineTo(w * 0.22, 0.30);
    p.lineTo(w * 0.22, 1.0);
    p.lineTo(0, 1.0);
    p.closePath();
    return p;
  },
  'N': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.26, 0);
    p.lineTo(w * 0.78, 0.70);
    p.lineTo(w * 0.78, 0);
    p.lineTo(w, 0);
    p.lineTo(w, 1.0);
    p.lineTo(w * 0.74, 1.0);
    p.lineTo(w * 0.22, 0.30);
    p.lineTo(w * 0.22, 1.0);
    p.lineTo(0, 1.0);
    p.closePath();
    return p;
  },
  'O': (w) => {
    const p = new Path2D();
    p.moveTo(w * 0.50, 0);
    p.quadraticCurveTo(w, 0, w, 0.50);
    p.quadraticCurveTo(w, 1.0, w * 0.50, 1.0);
    p.quadraticCurveTo(0, 1.0, 0, 0.50);
    p.quadraticCurveTo(0, 0, w * 0.50, 0);
    p.closePath();
    // Inner counter
    p.moveTo(w * 0.50, 0.20);
    p.quadraticCurveTo(w * 0.76, 0.20, w * 0.76, 0.50);
    p.quadraticCurveTo(w * 0.76, 0.80, w * 0.50, 0.80);
    p.quadraticCurveTo(w * 0.24, 0.80, w * 0.24, 0.50);
    p.quadraticCurveTo(w * 0.24, 0.20, w * 0.50, 0.20);
    p.closePath();
    return p;
  },
  'P': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.70, 0);
    p.quadraticCurveTo(w, 0, w, 0.30);
    p.quadraticCurveTo(w, 0.60, w * 0.70, 0.60);
    p.lineTo(w * 0.22, 0.60);
    p.lineTo(w * 0.22, 1.0);
    p.lineTo(0, 1.0);
    p.closePath();
    // Bowl counter
    p.moveTo(w * 0.22, 0.20);
    p.lineTo(w * 0.58, 0.20);
    p.quadraticCurveTo(w * 0.76, 0.20, w * 0.76, 0.30);
    p.quadraticCurveTo(w * 0.76, 0.40, w * 0.58, 0.40);
    p.lineTo(w * 0.22, 0.40);
    p.closePath();
    return p;
  },
  'Q': (w) => {
    const p = new Path2D();
    p.moveTo(w * 0.50, 0);
    p.quadraticCurveTo(w, 0, w, 0.50);
    p.quadraticCurveTo(w, 0.78, w * 0.80, 0.88);
    p.lineTo(w, 1.0);
    p.lineTo(w * 0.72, 1.0);
    p.lineTo(w * 0.58, 0.84);
    p.quadraticCurveTo(w * 0.54, 0.85, w * 0.50, 0.85);
    p.quadraticCurveTo(0, 0.85, 0, 0.50);
    p.quadraticCurveTo(0, 0, w * 0.50, 0);
    p.closePath();
    // Counter
    p.moveTo(w * 0.50, 0.20);
    p.quadraticCurveTo(w * 0.76, 0.20, w * 0.76, 0.50);
    p.quadraticCurveTo(w * 0.76, 0.68, w * 0.62, 0.70);
    p.lineTo(w * 0.46, 0.52);
    p.lineTo(w * 0.32, 0.66);
    p.quadraticCurveTo(w * 0.24, 0.62, w * 0.24, 0.50);
    p.quadraticCurveTo(w * 0.24, 0.20, w * 0.50, 0.20);
    p.closePath();
    return p;
  },
  'R': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.68, 0);
    p.quadraticCurveTo(w, 0, w, 0.28);
    p.quadraticCurveTo(w, 0.54, w * 0.68, 0.56);
    p.lineTo(w, 1.0);
    p.lineTo(w * 0.72, 1.0);
    p.lineTo(w * 0.44, 0.56);
    p.lineTo(w * 0.22, 0.56);
    p.lineTo(w * 0.22, 1.0);
    p.lineTo(0, 1.0);
    p.closePath();
    // Counter
    p.moveTo(w * 0.22, 0.18);
    p.lineTo(w * 0.56, 0.18);
    p.quadraticCurveTo(w * 0.76, 0.18, w * 0.76, 0.28);
    p.quadraticCurveTo(w * 0.76, 0.38, w * 0.56, 0.38);
    p.lineTo(w * 0.22, 0.38);
    p.closePath();
    return p;
  },
  'S': (w) => {
    const p = new Path2D();
    p.moveTo(w, 0.24);
    p.lineTo(w * 0.78, 0.18);
    p.quadraticCurveTo(w * 0.22, 0.16, w * 0.22, 0.32);
    p.quadraticCurveTo(w * 0.22, 0.46, w * 0.76, 0.54);
    p.quadraticCurveTo(w, 0.60, w, 0.78);
    p.quadraticCurveTo(w, 1.02, w * 0.48, 1.0);
    p.quadraticCurveTo(0, 0.98, 0, 0.72);
    p.lineTo(w * 0.22, 0.76);
    p.quadraticCurveTo(w * 0.22, 0.82, w * 0.48, 0.82);
    p.quadraticCurveTo(w * 0.78, 0.82, w * 0.78, 0.70);
    p.quadraticCurveTo(w * 0.78, 0.58, w * 0.24, 0.48);
    p.quadraticCurveTo(0, 0.42, 0, 0.24);
    p.quadraticCurveTo(0, -0.02, w * 0.52, 0);
    p.quadraticCurveTo(w, 0, w, 0.24);
    p.closePath();
    return p;
  },
  'T': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w, 0);
    p.lineTo(w, 0.20);
    p.lineTo(w * 0.61, 0.20);
    p.lineTo(w * 0.61, 1.0);
    p.lineTo(w * 0.39, 1.0);
    p.lineTo(w * 0.39, 0.20);
    p.lineTo(0, 0.20);
    p.closePath();
    return p;
  },
  'U': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.22, 0);
    p.lineTo(w * 0.22, 0.70);
    p.quadraticCurveTo(w * 0.22, 0.82, w * 0.50, 0.82);
    p.quadraticCurveTo(w * 0.78, 0.82, w * 0.78, 0.70);
    p.lineTo(w * 0.78, 0);
    p.lineTo(w, 0);
    p.lineTo(w, 0.70);
    p.quadraticCurveTo(w, 1.0, w * 0.50, 1.0);
    p.quadraticCurveTo(0, 1.0, 0, 0.70);
    p.closePath();
    return p;
  },
  'V': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.24, 0);
    p.lineTo(w * 0.50, 0.72);
    p.lineTo(w * 0.76, 0);
    p.lineTo(w, 0);
    p.lineTo(w * 0.62, 1.0);
    p.lineTo(w * 0.38, 1.0);
    p.closePath();
    return p;
  },
  'W': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.20, 0);
    p.lineTo(w * 0.36, 0.68);
    p.lineTo(w * 0.50, 0.20);
    p.lineTo(w * 0.64, 0.68);
    p.lineTo(w * 0.80, 0);
    p.lineTo(w, 0);
    p.lineTo(w * 0.74, 1.0);
    p.lineTo(w * 0.56, 1.0);
    p.lineTo(w * 0.50, 0.74);
    p.lineTo(w * 0.44, 1.0);
    p.lineTo(w * 0.26, 1.0);
    p.closePath();
    return p;
  },
  'X': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.28, 0);
    p.lineTo(w * 0.50, 0.38);
    p.lineTo(w * 0.72, 0);
    p.lineTo(w, 0);
    p.lineTo(w * 0.66, 0.50);
    p.lineTo(w, 1.0);
    p.lineTo(w * 0.72, 1.0);
    p.lineTo(w * 0.50, 0.62);
    p.lineTo(w * 0.28, 1.0);
    p.lineTo(0, 1.0);
    p.lineTo(w * 0.34, 0.50);
    p.closePath();
    return p;
  },
  'Y': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w * 0.26, 0);
    p.lineTo(w * 0.50, 0.44);
    p.lineTo(w * 0.74, 0);
    p.lineTo(w, 0);
    p.lineTo(w * 0.61, 0.54);
    p.lineTo(w * 0.61, 1.0);
    p.lineTo(w * 0.39, 1.0);
    p.lineTo(w * 0.39, 0.54);
    p.closePath();
    return p;
  },
  'Z': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w, 0);
    p.lineTo(w, 0.18);
    p.lineTo(w * 0.28, 0.80);
    p.lineTo(w, 0.80);
    p.lineTo(w, 1.0);
    p.lineTo(0, 1.0);
    p.lineTo(0, 0.82);
    p.lineTo(w * 0.72, 0.20);
    p.lineTo(0, 0.20);
    p.closePath();
    return p;
  },
  '0': (w) => {
    const p = new Path2D();
    p.moveTo(w * 0.50, 0);
    p.quadraticCurveTo(w, 0, w, 0.50);
    p.quadraticCurveTo(w, 1.0, w * 0.50, 1.0);
    p.quadraticCurveTo(0, 1.0, 0, 0.50);
    p.quadraticCurveTo(0, 0, w * 0.50, 0);
    p.closePath();
    p.moveTo(w * 0.50, 0.18);
    p.quadraticCurveTo(w * 0.76, 0.18, w * 0.76, 0.50);
    p.quadraticCurveTo(w * 0.76, 0.82, w * 0.50, 0.82);
    p.quadraticCurveTo(w * 0.24, 0.82, w * 0.24, 0.50);
    p.quadraticCurveTo(w * 0.24, 0.18, w * 0.50, 0.18);
    p.closePath();
    return p;
  },
  '1': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0.22);
    p.lineTo(w * 0.45, 0);
    p.lineTo(w, 0);
    p.lineTo(w, 1.0);
    p.lineTo(w * 0.55, 1.0);
    p.lineTo(w * 0.55, 0.22);
    p.lineTo(0, 0.42);
    p.closePath();
    return p;
  },
  '2': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0.24);
    p.quadraticCurveTo(0, 0, w * 0.50, 0);
    p.quadraticCurveTo(w, 0, w, 0.28);
    p.quadraticCurveTo(w, 0.52, w * 0.32, 0.80);
    p.lineTo(w, 0.80);
    p.lineTo(w, 1.0);
    p.lineTo(0, 1.0);
    p.lineTo(0, 0.76);
    p.quadraticCurveTo(w * 0.60, 0.44, w * 0.60, 0.28);
    p.quadraticCurveTo(w * 0.60, 0.20, w * 0.48, 0.20);
    p.quadraticCurveTo(w * 0.24, 0.20, w * 0.22, 0.30);
    p.closePath();
    return p;
  },
  '3': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w, 0);
    p.lineTo(w * 0.56, 0.42);
    p.quadraticCurveTo(w, 0.48, w, 0.72);
    p.quadraticCurveTo(w, 1.02, w * 0.48, 1.0);
    p.quadraticCurveTo(0, 0.98, 0, 0.72);
    p.lineTo(w * 0.22, 0.72);
    p.quadraticCurveTo(w * 0.22, 0.82, w * 0.48, 0.82);
    p.quadraticCurveTo(w * 0.76, 0.82, w * 0.76, 0.70);
    p.quadraticCurveTo(w * 0.76, 0.58, w * 0.44, 0.58);
    p.lineTo(w * 0.28, 0.58);
    p.lineTo(w * 0.62, 0.20);
    p.lineTo(0, 0.20);
    p.closePath();
    return p;
  },
  '4': (w) => {
    const p = new Path2D();
    p.moveTo(w * 0.60, 0);
    p.lineTo(w * 0.84, 0);
    p.lineTo(w * 0.84, 0.60);
    p.lineTo(w, 0.60);
    p.lineTo(w, 0.78);
    p.lineTo(w * 0.84, 0.78);
    p.lineTo(w * 0.84, 1.0);
    p.lineTo(w * 0.62, 1.0);
    p.lineTo(w * 0.62, 0.78);
    p.lineTo(0, 0.78);
    p.lineTo(0, 0.56);
    p.closePath();
    p.moveTo(w * 0.62, 0.22);
    p.lineTo(w * 0.22, 0.60);
    p.lineTo(w * 0.62, 0.60);
    p.closePath();
    return p;
  },
  '5': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w, 0);
    p.lineTo(w, 0.20);
    p.lineTo(w * 0.22, 0.20);
    p.lineTo(w * 0.22, 0.42);
    p.quadraticCurveTo(w, 0.38, w, 0.70);
    p.quadraticCurveTo(w, 1.02, w * 0.48, 1.0);
    p.quadraticCurveTo(0, 0.98, 0, 0.72);
    p.lineTo(w * 0.22, 0.72);
    p.quadraticCurveTo(w * 0.22, 0.82, w * 0.48, 0.82);
    p.quadraticCurveTo(w * 0.76, 0.82, w * 0.76, 0.68);
    p.quadraticCurveTo(w * 0.76, 0.54, w * 0.42, 0.54);
    p.lineTo(0, 0.54);
    p.closePath();
    return p;
  },
  '6': (w) => {
    const p = new Path2D();
    p.moveTo(w * 0.50, 0);
    p.quadraticCurveTo(w, 0, w, 0.22);
    p.lineTo(w * 0.78, 0.22);
    p.quadraticCurveTo(w * 0.76, 0.18, w * 0.50, 0.18);
    p.quadraticCurveTo(w * 0.24, 0.18, w * 0.24, 0.50);
    p.quadraticCurveTo(w * 0.38, 0.42, w * 0.56, 0.42);
    p.quadraticCurveTo(w, 0.42, w, 0.72);
    p.quadraticCurveTo(w, 1.02, w * 0.50, 1.0);
    p.quadraticCurveTo(0, 1.02, 0, 0.50);
    p.quadraticCurveTo(0, 0, w * 0.50, 0);
    p.closePath();
    // Bottom counter
    p.moveTo(w * 0.50, 0.60);
    p.quadraticCurveTo(w * 0.24, 0.60, w * 0.24, 0.72);
    p.quadraticCurveTo(w * 0.24, 0.84, w * 0.50, 0.84);
    p.quadraticCurveTo(w * 0.76, 0.84, w * 0.76, 0.72);
    p.quadraticCurveTo(w * 0.76, 0.60, w * 0.50, 0.60);
    p.closePath();
    return p;
  },
  '7': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w, 0);
    p.lineTo(w * 0.42, 1.0);
    p.lineTo(w * 0.18, 1.0);
    p.lineTo(w * 0.72, 0.20);
    p.lineTo(0, 0.20);
    p.closePath();
    return p;
  },
  '8': (w) => {
    const p = new Path2D();
    p.moveTo(w * 0.50, 0);
    p.quadraticCurveTo(w, 0, w, 0.25);
    p.quadraticCurveTo(w, 0.46, w * 0.68, 0.50);
    p.quadraticCurveTo(w, 0.54, w, 0.75);
    p.quadraticCurveTo(w, 1.0, w * 0.50, 1.0);
    p.quadraticCurveTo(0, 1.0, 0, 0.75);
    p.quadraticCurveTo(0, 0.54, w * 0.32, 0.50);
    p.quadraticCurveTo(0, 0.46, 0, 0.25);
    p.quadraticCurveTo(0, 0, w * 0.50, 0);
    p.closePath();
    // Top counter
    p.moveTo(w * 0.50, 0.18);
    p.quadraticCurveTo(w * 0.74, 0.18, w * 0.74, 0.26);
    p.quadraticCurveTo(w * 0.74, 0.35, w * 0.50, 0.35);
    p.quadraticCurveTo(w * 0.26, 0.35, w * 0.26, 0.26);
    p.quadraticCurveTo(w * 0.26, 0.18, w * 0.50, 0.18);
    p.closePath();
    // Bottom counter
    p.moveTo(w * 0.50, 0.62);
    p.quadraticCurveTo(w * 0.76, 0.62, w * 0.76, 0.74);
    p.quadraticCurveTo(w * 0.76, 0.84, w * 0.50, 0.84);
    p.quadraticCurveTo(w * 0.24, 0.84, w * 0.24, 0.74);
    p.quadraticCurveTo(w * 0.24, 0.62, w * 0.50, 0.62);
    p.closePath();
    return p;
  },
  '9': (w) => {
    const p = new Path2D();
    p.moveTo(w * 0.50, 0);
    p.quadraticCurveTo(w, 0, w, 0.50);
    p.quadraticCurveTo(w, 1.0, w * 0.50, 1.0);
    p.quadraticCurveTo(0, 1.0, 0, 0.78);
    p.lineTo(w * 0.22, 0.78);
    p.quadraticCurveTo(w * 0.24, 0.82, w * 0.50, 0.82);
    p.quadraticCurveTo(w * 0.76, 0.82, w * 0.76, 0.50);
    p.quadraticCurveTo(w * 0.62, 0.58, w * 0.44, 0.58);
    p.quadraticCurveTo(0, 0.58, 0, 0.28);
    p.quadraticCurveTo(0, -0.02, w * 0.50, 0);
    p.closePath();
    // Top counter
    p.moveTo(w * 0.50, 0.18);
    p.quadraticCurveTo(w * 0.24, 0.18, w * 0.24, 0.28);
    p.quadraticCurveTo(w * 0.24, 0.40, w * 0.50, 0.40);
    p.quadraticCurveTo(w * 0.76, 0.40, w * 0.76, 0.28);
    p.quadraticCurveTo(w * 0.76, 0.18, w * 0.50, 0.18);
    p.closePath();
    return p;
  },
  ' ': (w) => new Path2D(),
  '-': (w) => {
    const p = new Path2D();
    p.rect(0, 0.40, w, 0.20);
    return p;
  },
  "'": (w) => {
    const p = new Path2D();
    p.moveTo(0, 0);
    p.lineTo(w, 0);
    p.lineTo(w * 0.6, 0.35);
    p.lineTo(0, 0.35);
    p.closePath();
    return p;
  },
  '!': (w) => {
    const p = new Path2D();
    p.rect(0, 0, w, 0.65);
    p.rect(0, 0.80, w, 0.20);
    return p;
  },
  '?': (w) => {
    const p = new Path2D();
    p.moveTo(0, 0.22);
    p.quadraticCurveTo(0, 0, w * 0.50, 0);
    p.quadraticCurveTo(w, 0, w, 0.26);
    p.quadraticCurveTo(w, 0.48, w * 0.62, 0.56);
    p.lineTo(w * 0.62, 0.68);
    p.lineTo(w * 0.38, 0.68);
    p.lineTo(w * 0.38, 0.52);
    p.quadraticCurveTo(w * 0.74, 0.44, w * 0.74, 0.26);
    p.quadraticCurveTo(w * 0.74, 0.18, w * 0.50, 0.18);
    p.quadraticCurveTo(w * 0.26, 0.18, w * 0.24, 0.28);
    p.closePath();
    p.rect(w * 0.38, 0.80, w * 0.24, 0.20);
    return p;
  },
  '.': (w) => {
    const p = new Path2D();
    p.rect(0, 0.75, w, 0.25);
    return p;
  },
  '&': (w) => {
    const p = new Path2D();
    p.moveTo(w * 0.85, 0.72);
    p.lineTo(w, 0.84);
    p.lineTo(w * 0.75, 1.0);
    p.lineTo(w * 0.48, 0.75);
    p.lineTo(w * 0.28, 0.95);
    p.quadraticCurveTo(0, 1.0, 0, 0.70);
    p.quadraticCurveTo(0, 0.48, w * 0.38, 0.32);
    p.quadraticCurveTo(w * 0.28, 0.18, w * 0.42, 0);
    p.quadraticCurveTo(w * 0.68, 0, w * 0.68, 0.22);
    p.quadraticCurveTo(w * 0.68, 0.38, w * 0.48, 0.50);
    p.lineTo(w * 0.68, 0.72);
    p.closePath();
    // Upper counter
    p.moveTo(w * 0.48, 0.16);
    p.quadraticCurveTo(w * 0.52, 0.16, w * 0.52, 0.22);
    p.quadraticCurveTo(w * 0.52, 0.28, w * 0.44, 0.36);
    p.quadraticCurveTo(w * 0.40, 0.24, w * 0.48, 0.16);
    p.closePath();
    // Lower counter
    p.moveTo(w * 0.24, 0.68);
    p.quadraticCurveTo(w * 0.22, 0.78, w * 0.32, 0.80);
    p.lineTo(w * 0.42, 0.65);
    p.quadraticCurveTo(w * 0.26, 0.58, w * 0.24, 0.68);
    p.closePath();
    return p;
  },
};

/** Measures total advance width of a string in EM units with custom tracking. */
function measureTracked(text, trackingEm) {
  if (!text) return 0;
  let total = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    total += getAdvanceWidth(ch);
    if (i < text.length - 1) total += trackingEm;
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
  const maxWidth = width * 0.8;
  const edgePad = width * 0.02;
  const trackingRatio = 0.065;
  const subTrackingRatio = 0.16;
  const skewSlope = Math.abs(Math.tan(SKEW_RAD));

  // Auto-fit condensed font size, re-checking the horizontal extent after the skew.
  let fontSize = Math.round(unit * (lines.length > 1 ? 0.118 : 0.145));
  const minFontSize = Math.max(24, Math.round(unit * 0.038));

  const subSizeFor = (size) => {
    let subSize = Math.max(16, Math.round(size * 0.28));
    while (subSize > 12) {
      const pillW = measureTracked(sub, subTrackingRatio) * subSize + subSize * 1.7;
      if (pillW * CONDENSE_X <= width * 0.86) break;
      subSize -= 1;
    }
    return subSize;
  };

  // Measures the block from the top of the first glyph box down to the pill's bottom edge.
  const metricsFor = (size) => {
    const lineHeight = size * 1.02;
    const subSize = sub ? subSizeFor(size) : 0;
    const pillPadY = size * 0.1;
    const pillH = sub ? subSize * 1.6 : 0;
    if (lines.length === 0) {
      const subTop = pillPadY;
      const blockBottom = subTop + pillH;
      return { lineHeight, subSize, pillH, subTop, blockBottom };
    }
    const lastGlyphBottom = (lines.length - 1) * lineHeight + size;
    const subTop = sub ? lastGlyphBottom + subSize * 0.55 + pillPadY : 0;
    const blockBottom = sub ? subTop + pillH : lastGlyphBottom;
    return { lineHeight, subSize, pillH, subTop, blockBottom };
  };

  const fitsAt = (size) => {
    const m = metricsFor(size);
    const skewShift = skewSlope * m.blockBottom;
    for (const line of lines) {
      const emW = measureTracked(line, trackingRatio);
      const renderedW = emW * size * CONDENSE_X;
      if (renderedW > maxWidth) return false;
      if (renderedW / 2 + skewShift > width / 2 - edgePad) return false;
    }
    if (sub) {
      const pillW = (measureTracked(sub, subTrackingRatio) * m.subSize + m.subSize * 1.7) * CONDENSE_X;
      const pillSkew = skewSlope * (m.subTop + m.pillH);
      if (pillW / 2 + pillSkew > width / 2 - edgePad) return false;
    }
    return true;
  };

  while (fontSize > minFontSize && !fitsAt(fontSize)) {
    fontSize -= 2;
  }

  const { lineHeight, subSize, pillH, subTop, blockBottom } = metricsFor(fontSize);

  const centerX = width * 0.5;
  const heavyOutline = Math.max(6, Math.round(fontSize * 0.165));
  const innerStroke = Math.max(1.5, fontSize * 0.028);
  const fringeShift = Math.max(2, fontSize * 0.032);
  const shadowOffset = Math.max(3, fontSize * 0.065);

  // Anchor the whole block by its bottom edge so nothing ever passes height * 0.955.
  const bottomExtent = blockBottom + shadowOffset + heavyOutline * 0.5;
  let anchorY = height * 0.86 - bottomExtent;
  const lowestAnchor = height * 0.955 - bottomExtent;
  if (anchorY > lowestAnchor) anchorY = lowestAnchor;

  ctx.save();

  // Subtle dark backing glow for readability
  const blockMidY = anchorY + blockBottom * 0.5;
  const glowR = Math.max(width * 0.45, blockBottom * 1.6);
  const backGlow = ctx.createRadialGradient(
    centerX,
    blockMidY,
    fontSize * 0.2,
    centerX,
    blockMidY,
    glowR
  );
  backGlow.addColorStop(0, 'rgba(8, 2, 16, 0.58)');
  backGlow.addColorStop(0.55, 'rgba(8, 2, 16, 0.26)');
  backGlow.addColorStop(1, 'rgba(8, 2, 16, 0)');
  ctx.fillStyle = backGlow;
  const glowTop = Math.max(0, anchorY - height * 0.06);
  ctx.fillRect(0, glowTop, width, Math.min(height, anchorY + blockBottom + height * 0.06) - glowTop);

  // Apply -6 deg skew and horizontal squeeze
  ctx.translate(centerX, anchorY);
  ctx.transform(CONDENSE_X, 0, Math.tan(SKEW_RAD), 1, 0, 0);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineEmW = measureTracked(line, trackingRatio);
    const linePxW = lineEmW * fontSize;
    const y = i * lineHeight;
    let x = -linePxW / 2;

    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      const advEm = getAdvanceWidth(ch);
      const glyphW = advEm * fontSize;
      const glyphFn = GLYPHS[ch] || GLYPHS[' '];
      const glyphPath = glyphFn(advEm);

      // 1. Chromatic aberration fringe (offset glyphs)
      ctx.save();
      ctx.translate(x - fringeShift, y - fringeShift * 0.25);
      ctx.scale(fontSize, fontSize);
      ctx.fillStyle = palette.fringeA;
      ctx.fill(glyphPath);
      ctx.restore();

      ctx.save();
      ctx.translate(x + fringeShift, y + fringeShift * 0.25);
      ctx.scale(fontSize, fontSize);
      ctx.fillStyle = palette.fringeB;
      ctx.fill(glyphPath);
      ctx.restore();

      // 2. Hard drop shadow
      ctx.save();
      ctx.translate(x + shadowOffset, y + shadowOffset);
      ctx.scale(fontSize, fontSize);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fill(glyphPath);
      ctx.restore();

      // 3. Style-specific opaque fill & heavy ink outline
      ctx.save();
      ctx.translate(x, y);

      // Gradients are created in glyph-local pixel space BEFORE the em scale is applied.
      const gradTop = -fontSize * 0.5;
      const gradBottom = fontSize * 0.5;
      const stripGrad = ctx.createLinearGradient(0, gradTop, 0, gradBottom);
      let inkColor = '#0a080e';
      let bevelColor = 'rgba(255, 245, 232, 0.88)';

      if (styleId === 'neon') {
        stripGrad.addColorStop(0.0, '#ffffff');
        stripGrad.addColorStop(0.45, '#a8fbff');
        stripGrad.addColorStop(0.78, '#ff8ee8');
        stripGrad.addColorStop(1.0, '#fff0fb');
        inkColor = '#090314';
        bevelColor = 'rgba(255, 255, 255, 0.9)';

        // Magenta glow drawn behind the letterform so the fill stays solid
        ctx.save();
        ctx.scale(fontSize, fontSize);
        ctx.shadowColor = '#ff1eb8';
        ctx.shadowBlur = fontSize * 0.42;
        ctx.fillStyle = 'rgba(255, 30, 184, 0.55)';
        ctx.fill(glyphPath);
        ctx.restore();
      } else if (styleId === 'chrome') {
        stripGrad.addColorStop(0.00, '#ffffff');
        stripGrad.addColorStop(0.22, '#dbe6f5');
        stripGrad.addColorStop(0.44, '#7f93b3');
        stripGrad.addColorStop(0.54, '#2b3350');
        stripGrad.addColorStop(0.66, '#ffd7ad');
        stripGrad.addColorStop(0.84, '#ffffff');
        stripGrad.addColorStop(1.00, '#ffffff');
        inkColor = '#0c0814';
        bevelColor = 'rgba(255, 255, 255, 0.92)';
      } else {
        stripGrad.addColorStop(0.00, '#fffdf2');
        stripGrad.addColorStop(0.38, '#ffe9a8');
        stripGrad.addColorStop(0.72, '#ffb347');
        stripGrad.addColorStop(1.00, '#ff6f91');
        inkColor = '#0a080e';
        bevelColor = 'rgba(255, 245, 232, 0.88)';
      }

      ctx.scale(fontSize, fontSize);

      // Heavy dark ink outline
      ctx.shadowBlur = 0;
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = heavyOutline / fontSize;
      ctx.lineJoin = 'round';
      ctx.stroke(glyphPath);

      // Opaque gradient fill on the same path
      ctx.fillStyle = stripGrad;
      ctx.fill(glyphPath);

      // Thin inner highlight / bevel
      ctx.strokeStyle = bevelColor;
      ctx.lineWidth = innerStroke / fontSize;
      ctx.stroke(glyphPath);
      ctx.restore();

      x += glyphW + trackingRatio * fontSize;
    }
  }

  // Optional subtitle ribbon, strictly below the last glyph box
  if (sub) {
    // subSize / subTop / pillH were computed up front by metricsFor(fontSize).
    const pillPadX = subSize * 0.85;
    const subEmW = measureTracked(sub, subTrackingRatio);
    const subPxW = subEmW * subSize;

    // Pill rectangle: subTop is the top of the capital box, pillH the full plate height.
    ctx.fillStyle = 'rgba(10, 6, 18, 0.90)';
    ctx.fillRect(-subPxW / 2 - pillPadX, subTop, subPxW + pillPadX * 2, pillH);

    // Accent border
    ctx.strokeStyle = styleId === 'neon' ? '#00f2ff' : palette.sky[4];
    ctx.lineWidth = Math.max(1.5, subSize * 0.08);
    ctx.strokeRect(-subPxW / 2 - pillPadX, subTop, subPxW + pillPadX * 2, pillH);

    // Subtitle text, vertically centred on the plate (glyph box is subSize tall)
    const subY = subTop + pillH / 2 - subSize * 0.5;
    ctx.fillStyle = styleId === 'neon' ? '#9bfbff' : '#fff7e8';
    let subX = -subPxW / 2;
    for (let j = 0; j < sub.length; j++) {
      const ch = sub[j];
      const advEm = getAdvanceWidth(ch);
      const glyphFn = GLYPHS[ch] || GLYPHS[' '];
      const glyphPath = glyphFn(advEm);
      ctx.save();
      ctx.translate(subX, subY);
      ctx.scale(subSize, subSize);
      ctx.fill(glyphPath);
      ctx.restore();
      subX += advEm * subSize + subTrackingRatio * subSize;
    }
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ *
 * Poster furniture: star rating, panel labels, volume tag, coming-soon
 * strapline, barcode and credit strip. All deterministically seeded.
 * ------------------------------------------------------------------ */

const PANEL_LABELS = [
  'THE INSIDER', 'THE BOSS', 'THE RIDER', 'THE DRIVER',
  'THE COURIER', 'THE CLOSER',
];

function furnitureFont(size, weight = 700) {
  return `${weight} ${Math.max(1, Math.round(size))}px system-ui, "Helvetica Neue", Arial, sans-serif`;
}

/** Width of a string when drawn with manual per-character tracking. */
function trackedWidth(ctx, text, trackingPx) {
  const chars = Array.from(text);
  let total = 0;
  for (let i = 0; i < chars.length; i++) {
    total += ctx.measureText(chars[i]).width;
    if (i < chars.length - 1) total += trackingPx;
  }
  return total;
}

/**
 * Draws tracked text (small-caps style letter spacing) and returns its width.
 * align: 'left' | 'center' | 'right'; y is the text baseline.
 */
function drawTrackedText(ctx, text, x, y, trackingPx, align = 'left') {
  const chars = Array.from(text);
  const widths = [];
  let total = 0;
  for (let i = 0; i < chars.length; i++) {
    const w = ctx.measureText(chars[i]).width;
    widths.push(w);
    total += w;
    if (i < chars.length - 1) total += trackingPx;
  }
  let cursor = x;
  if (align === 'center') cursor = x - total / 2;
  else if (align === 'right') cursor = x - total;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], cursor, y);
    cursor += widths[i] + trackingPx;
  }
  return total;
}

/** Five-pointed star path centred at (cx, cy). */
function starPath(ctx, cx, cy, outerR, innerR) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/**
 * Draws printed-poster furniture in the poster's own palette:
 * star rating + review quote, panel captions, volume tag, coming-soon
 * strapline, seeded barcode and the bottom credit strip.
 */
export function drawPosterFurniture(ctx, width, height, state, palette) {
  const unit = Math.min(width, height);
  const margin = width * 0.045;
  const ink = 'rgba(10, 6, 18, 0.92)';

  ctx.save();

  // ---- soft dark scrim bands behind the furniture -------------------
  const topScrim = ctx.createLinearGradient(0, 0, 0, height * 0.16);
  topScrim.addColorStop(0, 'rgba(8, 2, 16, 0.55)');
  topScrim.addColorStop(0.55, 'rgba(8, 2, 16, 0.24)');
  topScrim.addColorStop(1, 'rgba(8, 2, 16, 0)');
  ctx.fillStyle = topScrim;
  ctx.fillRect(0, 0, width, height * 0.16);

  const bottomScrim = ctx.createLinearGradient(0, height * 0.8, 0, height);
  bottomScrim.addColorStop(0, 'rgba(8, 2, 16, 0)');
  bottomScrim.addColorStop(0.5, 'rgba(8, 2, 16, 0.3)');
  bottomScrim.addColorStop(1, 'rgba(8, 2, 16, 0.55)');
  ctx.fillStyle = bottomScrim;
  ctx.fillRect(0, height * 0.8, width, height * 0.2);

  // ---- 1. star rating + review quote (top band) ---------------------
  const stars = Math.max(0, Math.min(5, Math.round(state.stars ?? 5)));
  const starR = Math.max(5, unit * 0.0125);
  const starGap = starR * 2.9;
  const starCY = height * 0.047;
  const starRowW = starR * 2 + starGap * 4;
  const starX = margin + starR;

  for (let i = 0; i < 5; i++) {
    const cx = starX + i * starGap;
    starPath(ctx, cx, starCY, starR, starR * 0.44);
    if (i < stars) {
      ctx.fillStyle = palette.sky[4] || '#ffd166';
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 6, 18, 0.9)';
      ctx.lineWidth = Math.max(1, starR * 0.16);
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(255, 245, 232, 0.68)';
      ctx.lineWidth = Math.max(1, starR * 0.16);
      ctx.stroke();
    }
  }

  const quoteSize = Math.max(10, unit * 0.0152);
  ctx.font = furnitureFont(quoteSize, 600);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff7e8';
  const quoteTracking = quoteSize * 0.11;
  const quoteText = '“PURE GOLDEN-HOUR MAYHEM” — THE HARBOR GAZETTE';
  let quoteX = starX + starRowW + unit * 0.03;
  const quoteMax = width - margin - unit * 0.22;
  let shaped = quoteText;
  if (trackedWidth(ctx, shaped, quoteTracking) > quoteMax - quoteX) {
    // Trim with an ellipsis if the top band is too narrow (wide posters).
    while (shaped.length > 8 &&
           trackedWidth(ctx, shaped, quoteTracking) > quoteMax - quoteX) {
      shaped = shaped.slice(0, -2);
    }
    shaped = `${shaped.replace(/[\s—-]+$/, '')}…`;
  }
  drawTrackedText(ctx, shaped, quoteX, starCY + quoteSize * 0.05, quoteTracking, 'left');

  // ---- 3. volume tag (top right) -------------------------------------
  const volSize = Math.max(9, unit * 0.016);
  ctx.font = furnitureFont(volSize, 800);
  const volTracking = volSize * 0.16;
  const volText = 'VOL. 1';
  const volW = trackedWidth(ctx, volText, volTracking);
  const volPadX = volSize * 0.7;
  const volPadY = volSize * 0.5;
  const volBoxW = volW + volPadX * 2;
  const volBoxH = volSize + volPadY * 2;
  const volX = width - margin - volBoxW;
  const volY = starCY - volBoxH / 2;
  ctx.fillStyle = 'rgba(10, 6, 18, 0.72)';
  ctx.fillRect(volX, volY, volBoxW, volBoxH);
  ctx.strokeStyle = 'rgba(255, 240, 224, 0.75)';
  ctx.lineWidth = Math.max(1, unit * 0.0016);
  ctx.strokeRect(volX, volY, volBoxW, volBoxH);
  ctx.fillStyle = '#fff7e8';
  drawTrackedText(ctx, volText, volX + volBoxW / 2, starCY + volSize * 0.36, volTracking, 'center');

  // ---- 2. panel labels under each photo panel ------------------------
  const panels = computePanels(state.layout, width, height);
  const labelSize = Math.max(9, unit * 0.0145);
  const labelTracking = labelSize * 0.16;
  const labelPadX = labelSize * 0.75;
  const labelPadY = labelSize * 0.42;
  const labelGap = Math.max(3, unit * 0.007);

  for (let i = 0; i < panels.length; i++) {
    const rect = panels[i];
    const label = PANEL_LABELS[i % PANEL_LABELS.length];
    let fontPx = labelSize;
    let textW = 0;
    do {
      ctx.font = furnitureFont(fontPx, 700);
      textW = trackedWidth(ctx, label, labelTracking * (fontPx / labelSize));
      if (textW + labelPadX * 2 <= rect.w) break;
      fontPx -= 0.5;
    } while (fontPx > 6);

    const padX = labelPadX * (fontPx / labelSize);
    const padY = labelPadY * (fontPx / labelSize);
    const plateW = textW + padX * 2;
    const plateH = fontPx + padY * 2;
    let px = rect.x + rect.w / 2 - plateW / 2;
    px = Math.max(margin * 0.5, Math.min(width - margin * 0.5 - plateW, px));
    const py = rect.y + rect.h + labelGap;

    ctx.fillStyle = ink;
    ctx.fillRect(px, py, plateW, plateH);
    ctx.strokeStyle = 'rgba(255, 240, 224, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 0.5, py + 0.5, plateW - 1, plateH - 1);

    ctx.fillStyle = '#fff7e8';
    ctx.font = furnitureFont(fontPx, 700);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    drawTrackedText(
      ctx,
      label,
      px + plateW / 2,
      py + plateH / 2 + fontPx * 0.04,
      labelTracking * (fontPx / labelSize),
      'center'
    );
  }

  // ---- 4. COMING SOON (bottom left) ----------------------------------
  const soonSize = Math.max(12, unit * 0.022);
  const soonTracking = soonSize * 0.34;
  const soonY = height * 0.925;

  // dark ink halo first so the strapline stays legible over the photo
  ctx.save();
  ctx.font = furnitureFont(soonSize, 800);
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(2, soonSize * 0.14);
  ctx.strokeStyle = 'rgba(10, 6, 18, 0.9)';
  ctx.fillStyle = 'rgba(10, 6, 18, 0.9)';
  drawTrackedText(ctx, 'COMING SOON', margin, soonY, soonTracking, 'left');
  // re-run as stroke for the outline effect (fill+stroke on the same glyphs)
  {
    const chars = Array.from('COMING SOON');
    let cx = margin;
    for (let i = 0; i < chars.length; i++) {
      const penW = ctx.measureText(chars[i]).width;
      if (chars[i] !== ' ') ctx.strokeText(chars[i], cx, soonY);
      cx += penW + soonTracking;
    }
  }
  ctx.restore();

  ctx.font = furnitureFont(soonSize, 800);
  ctx.fillStyle = '#fff7e8';
  drawTrackedText(ctx, 'COMING SOON', margin, soonY, soonTracking, 'left');

  // ---- 5. barcode (bottom right) -------------------------------------
  const rng = mulberry32(deriveSeed(state.seed ?? 1986, 707));
  const barCount = randInt(rng, 28, 40);
  const barcodeW = Math.min(width * 0.24, unit * 0.26);
  const barcodeH = unit * 0.045;
  const barcodeRight = width - margin;
  const barcodeLeft = barcodeRight - barcodeW;
  const barcodeBottom = height * 0.928;
  const barcodeTop = barcodeBottom - barcodeH;

  const slots = [];
  let rawTotal = 0;
  for (let i = 0; i < barCount; i++) {
    const w = randRange(rng, 0.55, 2.1);
    const gap = randRange(rng, 0.55, 1.45);
    slots.push({ w, gap });
    rawTotal += w + gap;
  }
  const scale = barcodeW / rawTotal;

  // quiet zone plate so the bars read over a busy photo
  ctx.fillStyle = 'rgba(255, 250, 242, 0.9)';
  const bq = unit * 0.008;
  ctx.fillRect(barcodeLeft - bq, barcodeTop - bq, barcodeW + bq * 2, barcodeH + bq * 2);

  ctx.fillStyle = '#0a0610';
  let bx = barcodeLeft;
  for (let i = 0; i < slots.length; i++) {
    const bw = Math.max(1, slots[i].w * scale);
    const shortBar = rng() < 0.28;
    const bh = shortBar ? barcodeH * 0.82 : barcodeH;
    ctx.fillRect(bx, barcodeTop, bw, bh);
    bx += slots[i].w * scale + slots[i].gap * scale;
  }

  // thin number line under the barcode, deterministic digits
  const numSize = Math.max(7, unit * 0.0105);
  ctx.font = furnitureFont(numSize, 600);
  ctx.fillStyle = 'rgba(255, 250, 242, 0.92)';
  ctx.textAlign = 'left';
  const numTracking = numSize * 0.22;
  const numDigits = [];
  for (let i = 0; i < 13; i++) {
    numDigits.push(randInt(rng, 0, 9));
    if (i === 0 || i === 6) numDigits.push(' ');
  }
  const numText = numDigits.join('');
  drawTrackedText(ctx, numText, barcodeRight, barcodeBottom + numSize * 1.15, numTracking, 'right');

  // ---- 6. credit strip (very bottom) ---------------------------------
  const creditSize = Math.max(7.5, unit * 0.0118);
  const creditTracking = creditSize * 0.2;
  ctx.font = furnitureFont(creditSize, 600);
  ctx.fillStyle = 'rgba(255, 247, 232, 0.9)';
  ctx.textAlign = 'left';
  const creditText = 'A SUNSET PICTURES PRODUCTION · STARRING YOU · SHOT ON YOUR OWN CAMERA';
  let creditShaped = creditText;
  const creditMax = width - margin * 2;
  while (creditShaped.length > 12 &&
         trackedWidth(ctx, creditShaped, creditTracking) > creditMax) {
    creditShaped = creditShaped.slice(0, -2);
  }
  drawTrackedText(ctx, creditShaped, width / 2, height * 0.973, creditTracking, 'center');

  ctx.restore();
}

