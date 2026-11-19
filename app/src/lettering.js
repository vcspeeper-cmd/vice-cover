// GTA-inspired display lettering: custom-drawn vector glyphs (A-Z, 0-9, punctuation)
// in bold condensed uppercase with -6 deg skew, character advance widths, auto-fit sizing,
// heavy dark ink outline, crisp light inner stroke, chromatic fringe, and three finishes.

import { getGradePalette } from './grade.js';

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
  const maxWidth = width * 0.84;

  // Auto-fit condensed font size
  let fontSize = Math.round(unit * (lines.length > 1 ? 0.118 : 0.145));
  const minFontSize = Math.max(26, Math.round(unit * 0.042));
  const trackingRatio = 0.065;

  const fitsAt = (size) => {
    for (const line of lines) {
      const emW = measureTracked(line, trackingRatio);
      const renderedW = emW * size * CONDENSE_X;
      if (renderedW > maxWidth) return false;
    }
    return true;
  };

  while (fontSize > minFontSize && !fitsAt(fontSize)) {
    fontSize -= 2;
  }

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

      // 3. Style-specific fill & outline
      if (styleId === 'neon') {
        // Heavy dark ink housing
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(fontSize, fontSize);
        ctx.strokeStyle = '#090314';
        ctx.lineWidth = heavyOutline / fontSize;
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
        ctx.scale(fontSize, fontSize);
        ctx.fill(glyphPath);

        // Inner bright highlight
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = innerStroke / fontSize;
        ctx.stroke(glyphPath);
        ctx.restore();
      } else if (styleId === 'chrome') {
        // Heavy dark outline
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(fontSize, fontSize);
        ctx.strokeStyle = '#0c0814';
        ctx.lineWidth = heavyOutline / fontSize;
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
        ctx.lineWidth = innerStroke / fontSize;
        ctx.stroke(glyphPath);
        ctx.restore();
      } else {
        // Block: solid white with heavy black outline
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(fontSize, fontSize);
        ctx.strokeStyle = '#0a080e';
        ctx.lineWidth = heavyOutline / fontSize;
        ctx.stroke(glyphPath);

        ctx.fillStyle = '#ffffff';
        ctx.fill(glyphPath);

        ctx.strokeStyle = 'rgba(255, 245, 232, 0.88)';
        ctx.lineWidth = innerStroke / fontSize;
        ctx.stroke(glyphPath);
        ctx.restore();
      }

      x += glyphW + trackingRatio * fontSize;
    }
  }

  // Optional subtitle ribbon
  if (sub) {
    let subSize = Math.max(18, Math.round(fontSize * 0.28));
    const subTrackingRatio = 0.16;
    while (subSize > 14 && measureTracked(sub, subTrackingRatio) * subSize * CONDENSE_X > maxWidth * 0.92) {
      subSize -= 1;
    }

    const subY = (lines.length - 1) * lineHeight + fontSize * 0.62 + subSize * 0.45;
    const subEmW = measureTracked(sub, subTrackingRatio);
    const subPxW = subEmW * subSize;
    const pillPadX = subSize * 0.85;
    const pillH = subSize * 1.65;

    // Angled dark ink nameplate pill
    ctx.fillStyle = 'rgba(10, 6, 18, 0.90)';
    ctx.fillRect(-subPxW / 2 - pillPadX, subY - pillH / 2, subPxW + pillPadX * 2, pillH);

    // Accent border
    ctx.strokeStyle = styleId === 'neon' ? '#00f2ff' : palette.sky[4];
    ctx.lineWidth = Math.max(1.5, subSize * 0.08);
    ctx.strokeRect(-subPxW / 2 - pillPadX, subY - pillH / 2, subPxW + pillPadX * 2, pillH);

    // Subtitle text
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

