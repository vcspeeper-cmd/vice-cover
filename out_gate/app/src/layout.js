// Poster layouts: computes crisp pixel-aligned multi-panel geometry for each layout mode.

export const LAYOUTS = [
  { id: 'hero', label: 'Hero + 2x2' },
  { id: 'grid', label: 'Banner + 4' },
  { id: 'strip', label: 'Triple Strip' },
  { id: 'mosaic', label: 'Mosaic 1+5' },
  { id: 'triptych', label: 'Triptych' },
];

export const SIZES = {
  tall: { id: 'tall', label: 'Poster 4:5', w: 1080, h: 1350 },
  square: { id: 'square', label: 'Square 1:1', w: 1080, h: 1080 },
  wide: { id: 'wide', label: 'Wide 16:9', w: 1920, h: 1080 },
};

/**
 * Returns panel rectangles in canvas coordinates for the chosen layout and poster dimensions.
 * Panels sit inside a balanced poster frame with sophisticated geometry for poster impact.
 */
export function computePanels(layoutId, width, height) {
  const unit = Math.min(width, height);
  const padX = Math.round(width * 0.045);
  const padTop = Math.round(height * 0.075);
  const padBottom = Math.round(height * 0.135);
  const gutter = Math.max(8, Math.round(unit * 0.015));

  const innerX = padX;
  const innerY = padTop;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;

  if (layoutId === 'triptych') {
    // Three tall equal-width vertical panels with a wide title band at bottom
    const panelW = Math.round((innerW - gutter * 2) / 3);
    const titleBandH = Math.round(height * 0.18);
    const panelH = innerH - titleBandH - gutter;

    return [
      { id: 0, x: innerX, y: innerY, w: panelW, h: panelH, role: 'panel' },
      { id: 1, x: innerX + panelW + gutter, y: innerY, w: panelW, h: panelH, role: 'panel' },
      { id: 2, x: innerX + (panelW + gutter) * 2, y: innerY, w: panelW, h: panelH, role: 'panel' },
    ];
  }

  if (layoutId === 'mosaic') {
    // One large 3-row hero on left, five smaller tilted panels arranged on right
    const leftW = Math.round((innerW - gutter) * 0.55);
    const rightX = innerX + leftW + gutter;
    const rightW = innerW - leftW - gutter;

    const heroH = innerH;
    const smallW = Math.round((rightW - gutter) / 2);
    const smallH = Math.round((innerH - gutter * 2) / 3);

    return [
      { id: 0, x: innerX, y: innerY, w: leftW, h: heroH, role: 'hero', tilt: 0 },
      { id: 1, x: rightX, y: innerY, w: smallW, h: smallH, role: 'cell', tilt: 1.8 },
      { id: 2, x: rightX + smallW + gutter, y: innerY, w: smallW, h: smallH, role: 'cell', tilt: -2.2 },
      { id: 3, x: rightX, y: innerY + smallH + gutter, w: smallW, h: smallH, role: 'cell', tilt: -1.5 },
      { id: 4, x: rightX + smallW + gutter, y: innerY + smallH + gutter, w: smallW, h: smallH, role: 'cell', tilt: 2.1 },
    ];
  }

  if (layoutId === 'grid') {
    // Five panels: wide banner across top, four below
    const topH = Math.round(innerH * 0.42);
    const botY = innerY + topH + gutter;
    const botH = innerH - topH - gutter;
    const rowH = Math.round((botH - gutter) / 2);
    const row2Y = botY + rowH + gutter;
    const row2H = botH - rowH - gutter;

    const midLeftW = Math.round((innerW - gutter) * 0.54);
    const midRightW = innerW - gutter - midLeftW;
    const lowLeftW = Math.round((innerW - gutter) * 0.44);
    const lowRightW = innerW - gutter - lowLeftW;

    return [
      { id: 0, x: innerX, y: innerY, w: innerW, h: topH, role: 'banner' },
      { id: 1, x: innerX, y: botY, w: midLeftW, h: rowH, role: 'cell' },
      { id: 2, x: innerX + midLeftW + gutter, y: botY, w: midRightW, h: rowH, role: 'cell' },
      { id: 3, x: innerX, y: row2Y, w: lowLeftW, h: row2H, role: 'cell' },
      { id: 4, x: innerX + lowLeftW + gutter, y: row2Y, w: lowRightW, h: row2H, role: 'cell' },
    ];
  }

  if (layoutId === 'strip') {
    // Three horizontal widescreen bands stacked vertically.
    const h0 = Math.round((innerH - gutter * 2) * 0.34);
    const h1 = Math.round((innerH - gutter * 2) * 0.36);
    const h2 = innerH - gutter * 2 - h0 - h1;

    return [
      { id: 0, x: innerX, y: innerY, w: innerW, h: h0, role: 'strip' },
      { id: 1, x: innerX, y: innerY + h0 + gutter, w: innerW, h: h1, role: 'strip' },
      { id: 2, x: innerX, y: innerY + h0 + gutter + h1 + gutter, w: innerW, h: h2, role: 'strip' },
    ];
  }

  // Default: 'hero' — one tall hero panel on the left (~55% width) + 2x2 grid on the right.
  const leftW = Math.round((innerW - gutter) * 0.55);
  const rightX = innerX + leftW + gutter;
  const rightW = innerW - leftW - gutter;

  const col1W = Math.round((rightW - gutter) * 0.52);
  const col2W = rightW - gutter - col1W;
  const row1H = Math.round((innerH - gutter) * 0.48);
  const row2H = innerH - gutter - row1H;

  return [
    { id: 0, x: innerX, y: innerY, w: leftW, h: innerH, role: 'hero' },
    { id: 1, x: rightX, y: innerY, w: col1W, h: row1H, role: 'cell' },
    { id: 2, x: rightX + col1W + gutter, y: innerY, w: col2W, h: row1H, role: 'cell' },
    { id: 3, x: rightX, y: innerY + row1H + gutter, w: col1W, h: row2H, role: 'cell' },
    { id: 4, x: rightX + col1W + gutter, y: innerY + row1H + gutter, w: col2W, h: row2H, role: 'cell' },
  ];
}

/** Hit-tests a canvas point (px, py) against computed panel rectangles. Returns panel index or -1. */
export function hitTestPanel(panels, px, py) {
  for (let i = panels.length - 1; i >= 0; i--) {
    const p = panels[i];
    if (px >= p.x && px <= p.x + p.w && py >= p.y && py <= p.y + p.h) {
      return i;
    }
  }
  return -1;
}
