// Master deterministic poster renderer: composes cream frame, sky backdrop, multi-panel photos,
// per-pixel colour grade, skyline, palms, grain, vignette, and custom-drawn lettering.

import { computePanels } from './layout.js';
import { applyColorGrade, getGradePalette } from './grade.js';
import { drawSkyBackdrop, drawCitySkyline, drawPalmRow, drawFilmGrain, drawVignette } from './scene.js';
import { drawCaption } from './lettering.js';

/**
 * Draws a single photo clipped into a panel rectangle with cover scaling and per-panel pan/zoom.
 */
function drawPanelPhoto(ctx, rect, slot, gradePalette) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();

  if (slot && slot.img && slot.img.naturalWidth > 0 && slot.img.naturalHeight > 0) {
    const img = slot.img;
    const baseScale = Math.max(rect.w / img.naturalWidth, rect.h / img.naturalHeight);
    const zoom = Math.max(1, Math.min(4, slot.zoom ?? 1));
    const drawW = img.naturalWidth * baseScale * zoom;
    const drawH = img.naturalHeight * baseScale * zoom;

    const maxPanX = Math.max(0, (drawW - rect.w) / 2);
    const maxPanY = Math.max(0, (drawH - rect.h) / 2);
    const panX = Math.max(-1, Math.min(1, slot.panX ?? 0));
    const panY = Math.max(-1, Math.min(1, slot.panY ?? 0));

    const dx = rect.x + (rect.w - drawW) / 2 + panX * maxPanX;
    const dy = rect.y + (rect.h - drawH) / 2 + panY * maxPanY;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, drawW, drawH);

    // Subtle edge contrast gradient inside panel for depth
    const panelShade = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
    panelShade.addColorStop(0, 'rgba(255, 210, 170, 0.08)');
    panelShade.addColorStop(0.55, 'rgba(0, 0, 0, 0)');
    panelShade.addColorStop(1, 'rgba(14, 4, 26, 0.28)');
    ctx.fillStyle = panelShade;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  } else {
    // Placeholder gradient if no photo
    const phGrad = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.w, rect.y + rect.h);
    phGrad.addColorStop(0, gradePalette.sky[1]);
    phGrad.addColorStop(1, gradePalette.sky[2]);
    ctx.fillStyle = phGrad;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  }

  ctx.restore();
}

/** Draws the printed-poster 2-4 px dark ink border and hairline light inner edge on each panel. */
function drawPanelFrame(ctx, rect, unit, isSelected) {
  const inkW = Math.max(2, Math.min(4, Math.round(unit * 0.0032)));

  // Soft outer drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(6, 2, 14, 0.45)';
  ctx.shadowBlur = Math.max(6, unit * 0.01);
  ctx.shadowOffsetY = Math.max(2, unit * 0.003);
  ctx.strokeStyle = '#0c0712';
  ctx.lineWidth = inkW;
  ctx.strokeRect(rect.x + inkW * 0.5, rect.y + inkW * 0.5, rect.w - inkW, rect.h - inkW);
  ctx.restore();

  // Dark ink outer border
  ctx.save();
  ctx.strokeStyle = '#0a0610';
  ctx.lineWidth = inkW;
  ctx.strokeRect(rect.x + inkW * 0.5, rect.y + inkW * 0.5, rect.w - inkW, rect.h - inkW);

  // Hairline light inner edge
  const inset = inkW + 1;
  ctx.strokeStyle = 'rgba(255, 245, 232, 0.55)';
  ctx.lineWidth = 1;
  ctx.strokeRect(rect.x + inset, rect.y + inset, rect.w - inset * 2, rect.h - inset * 2);

  // Selection outline (editor only)
  if (isSelected) {
    ctx.strokeStyle = '#38f2ff';
    ctx.lineWidth = Math.max(2, Math.round(unit * 0.0035));
    ctx.setLineDash([Math.max(8, unit * 0.012), Math.max(5, unit * 0.008)]);
    ctx.strokeRect(rect.x - 3, rect.y - 3, rect.w + 6, rect.h + 6);
  }
  ctx.restore();
}

/**
 * Renders the full Vice Cover poster onto `canvas` at full resolution.
 * Returns the computed panel rectangles for hit-testing.
 */
export function renderPoster(canvas, state, options = {}) {
  const { showSelection = false } = options;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const width = canvas.width;
  const height = canvas.height;
  const unit = Math.min(width, height);
  const gradePalette = getGradePalette(state.grade);

  // 1. Cream poster background
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, width, height);

  // 2. Sunset sky backdrop with sun disc & haze
  drawSkyBackdrop(ctx, width, height, state.grade, state.seed);

  // 3. Multi-panel layout photos
  const panels = computePanels(state.layout, width, height);
  for (let i = 0; i < panels.length; i++) {
    drawPanelPhoto(ctx, panels[i], state.panels[i], gradePalette);
  }

  // 4. Real per-pixel colour grade
  applyColorGrade(ctx, width, height, state.grade);

  // 5. Crisp ink panel borders & light inner hairlines
  for (let i = 0; i < panels.length; i++) {
    drawPanelFrame(ctx, panels[i], unit, false);
  }

  // 6. Outer poster hairline frame accent
  ctx.save();
  const outerInset = Math.max(8, Math.round(unit * 0.014));
  ctx.strokeStyle = 'rgba(255, 240, 224, 0.24)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(outerInset, outerInset, width - outerInset * 2, height - outerInset * 2);
  ctx.restore();

  // 7. Seeded city skyline with lit windows
  drawCitySkyline(ctx, width, height, state.grade, state.seed);

  // 8. Palm-tree silhouette row
  drawPalmRow(ctx, width, height, state.grade, state.seed);

  // 9. Film grain & vignette
  drawFilmGrain(ctx, width, height, state.seed, 0.032);
  drawVignette(ctx, width, height);

  // 10. Custom-drawn GTA-style caption + subtitle
  drawCaption(ctx, width, height, state.caption, state.subtitle, state.lettering, state.grade);

  // 11. Optional editor selection indicator
  if (showSelection && state.selectedPanel >= 0 && state.selectedPanel < panels.length) {
    const sel = panels[state.selectedPanel];
    ctx.save();
    ctx.strokeStyle = '#38f2ff';
    ctx.lineWidth = Math.max(3, Math.round(unit * 0.004));
    ctx.shadowColor = 'rgba(56, 242, 255, 0.75)';
    ctx.shadowBlur = 10;
    ctx.strokeRect(sel.x + 2, sel.y + 2, sel.w - 4, sel.h - 4);

    // Panel badge tag
    const badgeH = Math.max(22, Math.round(unit * 0.032));
    const badgeW = Math.max(76, Math.round(unit * 0.11));
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(10, 8, 18, 0.86)';
    ctx.fillRect(sel.x + 10, sel.y + 10, badgeW, badgeH);
    ctx.strokeStyle = '#38f2ff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sel.x + 10, sel.y + 10, badgeW, badgeH);
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${Math.round(badgeH * 0.52)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`PANEL ${state.selectedPanel + 1}`, sel.x + 10 + badgeW / 2, sel.y + 10 + badgeH / 2 + 1);
    ctx.restore();
  }

  return panels;
}

/**
 * Re-renders the poster at full target resolution onto a fresh offscreen canvas and triggers PNG download.
 */
export function exportPosterPng(state, targetW, targetH, filename) {
  return new Promise((resolve, reject) => {
    const offscreen = document.createElement('canvas');
    offscreen.width = targetW;
    offscreen.height = targetH;
    renderPoster(offscreen, state, { showSelection: false });
    offscreen.toBlob((blob) => {
      if (!blob) {
        reject(new Error('PNG export failed'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      resolve({ filename, bytes: blob.size });
    }, 'image/png');
  });
}
