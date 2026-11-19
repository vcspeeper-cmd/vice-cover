// Procedural Canvas 2D set dressing: sunset sky with sun disc & haze bands,
// seeded city skyline with lit windows, bezier palm-tree silhouettes, film grain, and vignette.

import { deriveSeed, mulberry32, randInt, randRange } from './prng.js';
import { getGradePalette } from './grade.js';

/** Draws the sunset sky backdrop, sun disc with retro horizon slices, and atmospheric haze bands. */
export function drawSkyBackdrop(ctx, width, height, gradeId, seed) {
  const palette = getGradePalette(gradeId);
  const rng = mulberry32(deriveSeed(seed, 101));

  // Rich multi-stop sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0.0, palette.sky[0]);
  skyGrad.addColorStop(0.28, palette.sky[1]);
  skyGrad.addColorStop(0.56, palette.sky[2]);
  skyGrad.addColorStop(0.80, palette.sky[3]);
  skyGrad.addColorStop(1.0, palette.sky[4]);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Diagonal subtle coastal light rays from upper horizon
  ctx.save();
  ctx.globalAlpha = 0.09;
  const sunX = width * randRange(rng, 0.38, 0.62);
  const sunY = height * randRange(rng, 0.09, 0.15);
  const sunR = Math.min(width, height) * randRange(rng, 0.15, 0.20);

  for (let i = 0; i < 9; i++) {
    const angle = randRange(rng, -Math.PI * 0.9, Math.PI * 0.15);
    const spread = randRange(rng, 0.03, 0.08);
    const rayLen = Math.max(width, height) * 1.3;
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(sunX + Math.cos(angle - spread) * rayLen, sunY + Math.sin(angle - spread) * rayLen);
    ctx.lineTo(sunX + Math.cos(angle + spread) * rayLen, sunY + Math.sin(angle + spread) * rayLen);
    ctx.closePath();
    ctx.fillStyle = palette.sun[0];
    ctx.fill();
  }
  ctx.restore();

  // Outer sun halo
  const halo = ctx.createRadialGradient(sunX, sunY, sunR * 0.25, sunX, sunY, sunR * 2.5);
  halo.addColorStop(0, palette.sun[0]);
  halo.addColorStop(0.45, palette.sun[1]);
  halo.addColorStop(1, palette.sun[2]);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Crisp glowing sun disc with subtle horizontal horizon cutout bars
  ctx.save();
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.clip();

  const discGrad = ctx.createLinearGradient(sunX, sunY - sunR, sunX, sunY + sunR);
  discGrad.addColorStop(0, palette.sun[0]);
  discGrad.addColorStop(0.75, palette.sun[1]);
  discGrad.addColorStop(1, palette.sky[2]);
  ctx.fillStyle = discGrad;
  ctx.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);

  // Atmospheric horizontal cuts across lower half of sun
  ctx.fillStyle = palette.sky[2];
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < 5; i++) {
    const sliceY = sunY + sunR * (0.18 + i * 0.155);
    const sliceH = sunR * (0.02 + i * 0.014);
    ctx.fillRect(sunX - sunR, sliceY, sunR * 2, sliceH);
  }
  ctx.restore();

  // Horizontal coastal haze bands across the sky
  ctx.save();
  const bandCount = 7;
  for (let i = 0; i < bandCount; i++) {
    const by = height * (0.14 + (i / bandCount) * 0.72) + randRange(rng, -height * 0.02, height * 0.02);
    const bh = height * randRange(rng, 0.012, 0.045);
    const bandGrad = ctx.createLinearGradient(0, by, 0, by + bh);
    bandGrad.addColorStop(0, 'rgba(255,255,255,0)');
    bandGrad.addColorStop(0.5, palette.haze);
    bandGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = bandGrad;
    ctx.fillRect(0, by, width, bh);
  }
  ctx.restore();
}

/** Draws a seeded coastal skyline silhouette along the bottom with glowing lit windows. */
export function drawCitySkyline(ctx, width, height, gradeId, seed) {
  const palette = getGradePalette(gradeId);
  const rng = mulberry32(deriveSeed(seed, 202));

  const baseY = height;
  const maxTowerH = height * 0.21;
  const minTowerH = height * 0.075;

  // Far hazy skyline layer for atmospheric depth
  ctx.save();
  ctx.fillStyle = palette.sky[1];
  ctx.globalAlpha = 0.55;
  let fx = -width * 0.02;
  while (fx < width * 1.02) {
    const bw = width * randRange(rng, 0.03, 0.075);
    const bh = height * randRange(rng, 0.09, 0.24);
    ctx.fillRect(fx, baseY - bh, bw + 1, bh);
    if (rng() > 0.65) {
      // Spire or penthouse crown
      const cw = bw * randRange(rng, 0.35, 0.6);
      const ch = bh * randRange(rng, 0.12, 0.25);
      ctx.fillRect(fx + (bw - cw) * 0.5, baseY - bh - ch, cw, ch);
    }
    fx += bw * randRange(rng, 0.78, 1.02);
  }
  ctx.restore();

  // Foreground dark skyline silhouette + seeded illuminated windows
  ctx.save();
  const buildings = [];
  let x = -width * 0.015;
  while (x < width * 1.015) {
    const bw = Math.round(width * randRange(rng, 0.032, 0.082));
    // Taller towers toward the flanks so the center remains open for the caption
    const edgeFactor = Math.abs((x + bw * 0.5) / width - 0.5) * 2;
    const hScale = 0.68 + edgeFactor * 0.45;
    const bh = Math.round(randRange(rng, minTowerH, maxTowerH) * hScale);
    const roofStyle = randInt(rng, 0, 3);
    buildings.push({ x: Math.round(x), w: bw, h: bh, roofStyle });
    x += bw * randRange(rng, 0.86, 1.03);
  }

  ctx.fillStyle = palette.silhouette;
  for (const b of buildings) {
    const topY = baseY - b.h;
    ctx.fillRect(b.x, topY, b.w + 1, b.h + 2);
    if (b.roofStyle === 1) {
      // Art Deco stepped crown
      const sw = Math.round(b.w * 0.56);
      const sh = Math.round(b.h * 0.14);
      ctx.fillRect(b.x + Math.round((b.w - sw) / 2), topY - sh, sw, sh + 1);
      // Thin antenna spire
      const aw = Math.max(2, Math.round(width * 0.002));
      ctx.fillRect(b.x + Math.round(b.w / 2 - aw / 2), topY - sh - Math.round(sh * 1.1), aw, Math.round(sh * 1.1));
    } else if (b.roofStyle === 2) {
      // Slanted modern tower roof
      ctx.beginPath();
      ctx.moveTo(b.x, topY);
      ctx.lineTo(b.x + b.w, topY - Math.round(b.w * 0.25));
      ctx.lineTo(b.x + b.w, topY + 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Glowing window grid inside buildings
  const winW = Math.max(2, Math.round(width * 0.0042));
  const winH = Math.max(3, Math.round(height * 0.0055));
  const gapX = Math.max(3, Math.round(winW * 1.9));
  const gapY = Math.max(4, Math.round(winH * 1.85));

  for (const b of buildings) {
    const topY = baseY - b.h + Math.round(gapY * 0.9);
    const leftX = b.x + Math.round(gapX * 0.6);
    const rightX = b.x + b.w - Math.round(gapX * 0.6) - winW;
    const density = randRange(rng, 0.16, 0.42);
    const isBandStyle = rng() > 0.72;

    for (let wy = topY; wy < baseY - gapY * 0.8; wy += gapY) {
      const floorLit = rng() < density;
      for (let wx = leftX; wx <= rightX; wx += gapX) {
        const lit = isBandStyle ? (floorLit && rng() < 0.75) : (rng() < density);
        if (!lit) continue;
        const color = palette.windowColors[randInt(rng, 0, palette.windowColors.length - 1)];
        ctx.fillStyle = color;
        ctx.globalAlpha = randRange(rng, 0.45, 0.95);
        ctx.fillRect(wx, wy, winW, winH);
      }
    }
  }

  // Thin atmospheric horizon glow hugging the skyline base
  const glowH = height * 0.06;
  const glow = ctx.createLinearGradient(0, baseY - glowH, 0, baseY);
  glow.addColorStop(0, 'rgba(0,0,0,0)');
  glow.addColorStop(1, palette.silhouette);
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = glow;
  ctx.fillRect(0, baseY - glowH, width, glowH);
  ctx.restore();
}

/** Draws a single palm frond with drooping feathered leaflets along a quadratic spine. */
function drawPalmFrond(ctx, ox, oy, angle, length, droop, leafletCount, thickness) {
  const ex = ox + Math.cos(angle) * length;
  const ey = oy + Math.sin(angle) * length + droop;
  const cx = ox + Math.cos(angle) * length * 0.52;
  const cy = oy + Math.sin(angle) * length * 0.45 - Math.abs(droop) * 0.25;

  // Frond central spine
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.quadraticCurveTo(cx, cy, ex, ey);
  ctx.lineWidth = Math.max(1.5, thickness);
  ctx.lineCap = 'round';
  ctx.stroke();

  // Feathered blade leaflets hanging from spine
  const sideSign = Math.cos(angle) >= 0 ? 1 : -1;
  for (let i = 2; i <= leafletCount; i++) {
    const t = i / (leafletCount + 1);
    const mt = 1 - t;
    const px = mt * mt * ox + 2 * mt * t * cx + t * t * ex;
    const py = mt * mt * oy + 2 * mt * t * cy + t * t * ey;

    // Tangent vector
    const tx = 2 * mt * (cx - ox) + 2 * t * (ex - cx);
    const ty = 2 * mt * (cy - oy) + 2 * t * (ey - cy);
    const tanAngle = Math.atan2(ty, tx);

    // Taper leaflets toward tip and base
    const env = Math.sin(t * Math.PI);
    const bladeLen = length * 0.24 * (0.35 + env * 0.85);
    const bladeAngle = tanAngle + sideSign * (0.55 + t * 0.35);
    const bx = px + Math.cos(bladeAngle) * bladeLen;
    const by = py + Math.sin(bladeAngle) * bladeLen + bladeLen * 0.32;
    const bmx = (px + bx) * 0.5 + Math.cos(bladeAngle - sideSign * 0.25) * bladeLen * 0.14;
    const bmy = (py + by) * 0.5;

    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(bmx, bmy, bx, by);
    ctx.lineTo(px + Math.cos(tanAngle) * (length / leafletCount) * 0.65, py + Math.sin(tanAngle) * (length / leafletCount) * 0.65);
    ctx.closePath();
    ctx.fill();
  }
}

/** Draws a single palm tree with curved tapered bezier trunk and radial fan of fronds. */
function drawPalmTree(ctx, baseX, baseY, height, lean, scale, rng, color) {
  const tipX = baseX + lean;
  const tipY = baseY - height;
  const ctrlX = baseX + lean * 0.32 + randRange(rng, -height * 0.08, height * 0.08);
  const ctrlY = baseY - height * 0.52;

  const baseHalfW = Math.max(4, height * 0.042 * scale);
  const tipHalfW = Math.max(1.8, height * 0.013 * scale);

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  // Tapered curved trunk built from left/right offset bezier curves
  ctx.beginPath();
  ctx.moveTo(baseX - baseHalfW, baseY + 6);
  ctx.quadraticCurveTo(ctrlX - (baseHalfW + tipHalfW) * 0.45, ctrlY, tipX - tipHalfW, tipY);
  ctx.lineTo(tipX + tipHalfW, tipY);
  ctx.quadraticCurveTo(ctrlX + (baseHalfW + tipHalfW) * 0.45, ctrlY, baseX + baseHalfW, baseY + 6);
  ctx.closePath();
  ctx.fill();

  // Small cluster of coconuts at crown
  const nutR = Math.max(2, tipHalfW * 1.15);
  for (let c = -1; c <= 1; c++) {
    ctx.beginPath();
    ctx.arc(tipX + c * nutR * 0.9, tipY + nutR * 0.9, nutR, 0, Math.PI * 2);
    ctx.fill();
  }

  // Radial fan of 8 to 10 fronds
  const frondCount = randInt(rng, 8, 10);
  for (let i = 0; i < frondCount; i++) {
    const frac = i / (frondCount - 1);
    // Spread from far left (-195 deg) over top to far right (+15 deg)
    const angle = (-Math.PI * 1.08) + frac * (Math.PI * 1.16) + randRange(rng, -0.09, 0.09);
    const frondLen = height * randRange(rng, 0.30, 0.46);
    const droop = frondLen * randRange(rng, 0.18, 0.42);
    const leaflets = randInt(rng, 11, 16);
    const spineThick = Math.max(1.5, height * 0.0085);
    drawPalmFrond(ctx, tipX, tipY, angle, frondLen, droop, leaflets, spineThick);
  }

  ctx.restore();
}

/** Draws a silhouette row of Vice City palm trees framing the bottom edges and skyline. */
export function drawPalmRow(ctx, width, height, gradeId, seed) {
  const palette = getGradePalette(gradeId);
  const rng = mulberry32(deriveSeed(seed, 303));
  const unit = Math.min(width, height);

  // Anchor hero framing palms on left & right flanks plus smaller mid-distance palms along the foot
  const trees = [
    // Tall left flank palms leaning gently inward
    { x: width * randRange(rng, 0.015, 0.05), h: unit * randRange(rng, 0.44, 0.54), lean: width * randRange(rng, 0.05, 0.10), s: 1.05 },
    { x: width * randRange(rng, 0.09, 0.15), h: unit * randRange(rng, 0.28, 0.37), lean: width * randRange(rng, -0.02, 0.06), s: 0.9 },
    // Subtle lower mid-left and mid-right silhouettes
    { x: width * randRange(rng, 0.21, 0.28), h: unit * randRange(rng, 0.16, 0.22), lean: width * randRange(rng, -0.03, 0.03), s: 0.8 },
    { x: width * randRange(rng, 0.72, 0.79), h: unit * randRange(rng, 0.16, 0.23), lean: width * randRange(rng, -0.03, 0.03), s: 0.8 },
    // Tall right flank palms leaning inward
    { x: width * randRange(rng, 0.85, 0.91), h: unit * randRange(rng, 0.29, 0.38), lean: width * randRange(rng, -0.06, 0.02), s: 0.92 },
    { x: width * randRange(rng, 0.945, 0.985), h: unit * randRange(rng, 0.45, 0.55), lean: width * randRange(rng, -0.10, -0.05), s: 1.05 },
  ];

  // Add 2 extra seeded mid-horizon palms for wider posters
  if (width / height > 1.25) {
    trees.push(
      { x: width * randRange(rng, 0.33, 0.41), h: unit * randRange(rng, 0.14, 0.19), lean: width * randRange(rng, -0.02, 0.03), s: 0.78 },
      { x: width * randRange(rng, 0.59, 0.67), h: unit * randRange(rng, 0.14, 0.19), lean: width * randRange(rng, -0.03, 0.02), s: 0.78 },
    );
  }

  for (const t of trees) {
    drawPalmTree(ctx, t.x, height + 4, t.h, t.lean, t.s, rng, palette.silhouette);
  }
}

/** Draws repeatable deterministic film grain using a small seeded noise tile. */
export function drawFilmGrain(ctx, width, height, seed, intensity = 0.042) {
  const tileSize = 128;
  const tile = document.createElement('canvas');
  tile.width = tileSize;
  tile.height = tileSize;
  const tctx = tile.getContext('2d');
  const img = tctx.createImageData(tileSize, tileSize);
  const data = img.data;
  const rng = mulberry32(deriveSeed(seed, 404));

  for (let i = 0; i < data.length; i += 4) {
    // Subtle organic film grain (centered around 128)
    const v = Math.floor(100 + ((rng() + rng()) * 0.5) * 56);
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255;
  }
  tctx.putImageData(img, 0, 0);

  ctx.save();
  ctx.globalAlpha = intensity;
  ctx.globalCompositeOperation = 'overlay';
  const pattern = ctx.createPattern(tile, 'repeat');
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/** Draws a subtle dark cinematic vignette around the poster edges. */
export function drawVignette(ctx, width, height) {
  const cx = width * 0.5;
  const cy = height * 0.48;
  const innerR = Math.min(width, height) * 0.38;
  const outerR = Math.hypot(width, height) * 0.56;

  const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.68, 'rgba(10, 4, 20, 0.14)');
  grad.addColorStop(1, 'rgba(5, 2, 12, 0.58)');

  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
