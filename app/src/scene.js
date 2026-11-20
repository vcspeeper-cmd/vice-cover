// Procedural Canvas 2D set dressing: sunset sky with sun disc & haze bands,
// seeded multi-layer city skyline with lit windows, bezier palm-tree silhouettes, film grain, and vignette.

import { deriveSeed, mulberry32, randInt, randRange } from './prng.js';
import { getGradePalette } from './grade.js';

/** Draws the sunset sky backdrop, glowing sun disc with horizon slices, and atmospheric haze bands. */
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

  // Outer sun halo & bloom disc
  const halo = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 3.0);
  halo.addColorStop(0, palette.sun[0]);
  halo.addColorStop(0.35, palette.sun[1]);
  halo.addColorStop(0.70, palette.sun[2]);
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 3.0, 0, Math.PI * 2);
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
  for (let i = 0; i < 6; i++) {
    const sliceY = sunY + sunR * (0.12 + i * 0.14);
    const sliceH = sunR * (0.018 + i * 0.015);
    ctx.fillRect(sunX - sunR, sliceY, sunR * 2, sliceH);
  }
  ctx.restore();

  // Atmospheric haze bands across the sky
  ctx.save();
  const bandCount = 8;
  for (let i = 0; i < bandCount; i++) {
    const by = height * (0.12 + (i / bandCount) * 0.74) + randRange(rng, -height * 0.015, height * 0.015);
    const bh = height * randRange(rng, 0.015, 0.048);
    const bandGrad = ctx.createLinearGradient(0, by, 0, by + bh);
    bandGrad.addColorStop(0, 'rgba(255,255,255,0)');
    bandGrad.addColorStop(0.5, palette.haze);
    bandGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = bandGrad;
    ctx.fillRect(0, by, width, bh);
  }
  ctx.restore();
}

/** Draws a seeded multi-layer city skyline along the bottom with glowing lit windows. */
export function drawCitySkyline(ctx, width, height, gradeId, seed) {
  const palette = getGradePalette(gradeId);
  const rng = mulberry32(deriveSeed(seed, 202));

  const baseY = height;
  const maxTowerH = height * 0.22;
  const minTowerH = height * 0.08;

  // 1. Far distant skyline layer
  ctx.save();
  ctx.fillStyle = palette.sky[0];
  ctx.globalAlpha = 0.35;
  let fx = -width * 0.02;
  while (fx < width * 1.02) {
    const bw = width * randRange(rng, 0.04, 0.08);
    const bh = height * randRange(rng, 0.12, 0.28);
    ctx.fillRect(fx, baseY - bh, bw + 1, bh);
    fx += bw * randRange(rng, 0.75, 1.0);
  }
  ctx.restore();

  // 2. Mid hazy skyline layer
  ctx.save();
  ctx.fillStyle = palette.sky[1];
  ctx.globalAlpha = 0.60;
  let mx = -width * 0.02;
  while (mx < width * 1.02) {
    const bw = width * randRange(rng, 0.03, 0.075);
    const bh = height * randRange(rng, 0.09, 0.23);
    ctx.fillRect(mx, baseY - bh, bw + 1, bh);
    if (rng() > 0.65) {
      const cw = bw * randRange(rng, 0.35, 0.6);
      const ch = bh * randRange(rng, 0.12, 0.25);
      ctx.fillRect(mx + (bw - cw) * 0.5, baseY - bh - ch, cw, ch);
    }
    mx += bw * randRange(rng, 0.78, 1.02);
  }
  ctx.restore();

  // 3. Foreground dark skyline silhouette + seeded illuminated windows
  ctx.save();
  const buildings = [];
  let x = -width * 0.015;
  while (x < width * 1.015) {
    const bw = Math.round(width * randRange(rng, 0.024, 0.092));
    const edgeFactor = Math.abs((x + bw * 0.5) / width - 0.5) * 2;
    const hScale = 0.6 + edgeFactor * 0.55;
    const bh = Math.round(randRange(rng, minTowerH, maxTowerH) * hScale);
    const roofStyle = randInt(rng, 0, 4);
    // 1-2 stepped setbacks for taller foreground towers
    const setbacks = [];
    if (bh > height * 0.13 && rng() > 0.45) {
      const steps = randInt(rng, 1, 2);
      let curW = bw;
      let curY = baseY - bh;
      for (let s = 0; s < steps; s++) {
        const sw = Math.round(curW * randRange(rng, 0.52, 0.78));
        const sh = Math.round(bh * randRange(rng, 0.08, 0.17));
        if (sw < 4 || sh < 3) break;
        curY -= sh;
        setbacks.push({ x: Math.round(x + (bw - sw) / 2), y: curY, w: sw, h: sh });
        curW = sw;
      }
    }
    buildings.push({ x: Math.round(x), w: bw, h: bh, roofStyle, setbacks });
    x += bw * randRange(rng, 0.9, 1.04);
  }

  ctx.fillStyle = palette.silhouette;
  for (const b of buildings) {
    const topY = baseY - b.h;
    ctx.fillRect(b.x, topY, b.w + 1, b.h + 2);
    for (const st of b.setbacks) {
      ctx.fillRect(st.x, st.y, st.w, st.h + 1);
    }
    if (b.roofStyle === 1) {
      const sw = Math.round(b.w * 0.46);
      const sh = Math.round(b.h * 0.1);
      const spikeBaseY = b.setbacks.length ? b.setbacks[b.setbacks.length - 1].y : topY;
      ctx.fillRect(b.x + Math.round((b.w - sw) / 2), spikeBaseY - sh, sw, sh + 1);
      const aw = Math.max(2, Math.round(width * 0.002));
      ctx.fillRect(b.x + Math.round(b.w / 2 - aw / 2), spikeBaseY - sh - Math.round(sh * 1.2), aw, Math.round(sh * 1.2));
    } else if (b.roofStyle === 2) {
      const slantBaseY = b.setbacks.length ? b.setbacks[b.setbacks.length - 1].y : topY;
      ctx.beginPath();
      ctx.moveTo(b.x, slantBaseY);
      ctx.lineTo(b.x + b.w, slantBaseY - Math.round(b.w * 0.22));
      ctx.lineTo(b.x + b.w, slantBaseY + 2);
      ctx.closePath();
      ctx.fill();
    } else if (b.roofStyle === 3) {
      // rooftop water tank / plant housing
      const tw = Math.round(b.w * 0.22);
      const th = Math.round(b.h * 0.08);
      const tankBaseY = b.setbacks.length ? b.setbacks[b.setbacks.length - 1].y : topY;
      ctx.fillRect(b.x + Math.round(b.w * 0.18), tankBaseY - th, tw, th + 1);
      ctx.fillRect(b.x + Math.round(b.w * 0.62), tankBaseY - Math.round(th * 0.6), Math.round(tw * 0.7), Math.round(th * 0.6) + 1);
    }
  }

  // Glowing window grid inside buildings
  const winW = Math.max(2, Math.round(width * 0.0042));
  const winH = Math.max(3, Math.round(height * 0.0055));
  const gapX = Math.max(3, Math.round(winW * 1.9));
  const gapY = Math.max(4, Math.round(winH * 1.85));

  for (const b of buildings) {
    const topY = baseY - b.h + Math.round(gapY * 0.9);
    const density = randRange(rng, 0.16, 0.42);
    const isBandStyle = rng() > 0.72;
    const bodies = [{ x: b.x, w: b.w, top: topY }].concat(
      b.setbacks.map((st) => ({ x: st.x, w: st.w, top: st.y + gapY * 0.6 }))
    );

    for (const body of bodies) {
      const bx0 = body.x + Math.round(gapX * 0.55);
      const bx1 = body.x + body.w - Math.round(gapX * 0.55) - winW;
      for (let wy = body.top; wy < baseY - gapY * 0.8; wy += gapY) {
        const floorLit = rng() < density;
        for (let wx = bx0; wx <= bx1; wx += gapX) {
          const lit = isBandStyle ? (floorLit && rng() < 0.75) : (rng() < density);
          if (!lit) continue;
          const color = palette.windowColors[randInt(rng, 0, palette.windowColors.length - 1)];
          ctx.fillStyle = color;
          ctx.globalAlpha = randRange(rng, 0.45, 0.95);
          ctx.fillRect(wx, wy, winW, winH);
        }
      }
    }
    void topY;
  }

  // Horizon glow hugging skyline base
  const glowH = height * 0.07;
  const glow = ctx.createLinearGradient(0, baseY - glowH, 0, baseY);
  glow.addColorStop(0, 'rgba(0,0,0,0)');
  glow.addColorStop(1, palette.silhouette);
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = glow;
  ctx.fillRect(0, baseY - glowH, width, glowH);
  ctx.restore();
}

/** Draws a single palm frond with drooping feathered leaflets along a quadratic spine. */
function drawPalmFrond(ctx, ox, oy, angle, length, droop, leafletCount, thickness, fillColor, sideSign) {
  const dir = sideSign ?? (Math.cos(angle) >= 0 ? 1 : -1);
  const ex = ox + Math.cos(angle) * length;
  const ey = oy + Math.sin(angle) * length + droop;
  const cx = ox + Math.cos(angle) * length * 0.52;
  const cy = oy + Math.sin(angle) * length * 0.45 - Math.abs(droop) * 0.25;

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = fillColor;
  }

  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.quadraticCurveTo(cx, cy, ex, ey);
  ctx.lineWidth = Math.max(1.5, thickness);
  ctx.lineCap = 'round';
  ctx.stroke();

  for (let i = 1; i <= leafletCount; i++) {
    const t = i / (leafletCount + 1);
    const mt = 1 - t;
    const px = mt * mt * ox + 2 * mt * t * cx + t * t * ex;
    const py = mt * mt * oy + 2 * mt * t * cy + t * t * ey;

    const tx = 2 * mt * (cx - ox) + 2 * t * (ex - cx);
    const ty = 2 * mt * (cy - oy) + 2 * t * (ey - cy);
    const tanAngle = Math.atan2(ty, tx);

    const env = Math.sin(t * Math.PI);
    const bladeLen = length * 0.26 * (0.32 + env * 0.92);
    const bladeAngle = tanAngle + dir * (0.62 + t * 0.42);
    const bx = px + Math.cos(bladeAngle) * bladeLen;
    const by = py + Math.sin(bladeAngle) * bladeLen + bladeLen * 0.36;
    const bmx = (px + bx) * 0.5 + Math.cos(bladeAngle - dir * 0.28) * bladeLen * 0.14;
    const bmy = (py + by) * 0.5;

    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(bmx, bmy, bx, by);
    ctx.lineTo(
      px + Math.cos(tanAngle) * (length / leafletCount) * 0.62,
      py + Math.sin(tanAngle) * (length / leafletCount) * 0.62
    );
    ctx.closePath();
    ctx.fill();
  }
}

/** Mixes a hex silhouette colour toward white/black for the frond depth shades. */
function shadeColor(hex, amount) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const target = amount >= 0 ? 255 : 0;
  const t = Math.abs(amount);
  const mix = (c) => Math.round(c + (target - c) * t);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/** Draws a single palm tree with curved tapered trunk, layered frond crown and coconuts. */
function drawPalmTree(ctx, baseX, baseY, height, lean, scale, rng, color) {
  const tipX = baseX + lean;
  const tipY = baseY - height;
  const ctrlX = baseX + lean * 0.34 + randRange(rng, -height * 0.09, height * 0.09);
  const ctrlY = baseY - height * 0.52;

  const baseHalfW = Math.max(4, height * 0.045 * scale);
  const tipHalfW = Math.max(1.8, height * 0.014 * scale);

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  // Curved, tapered trunk
  ctx.beginPath();
  ctx.moveTo(baseX - baseHalfW, baseY + 6);
  ctx.quadraticCurveTo(ctrlX - (baseHalfW + tipHalfW) * 0.48, ctrlY, tipX - tipHalfW, tipY);
  ctx.lineTo(tipX + tipHalfW, tipY);
  ctx.quadraticCurveTo(ctrlX + (baseHalfW + tipHalfW) * 0.48, ctrlY, baseX + baseHalfW, baseY + 6);
  ctx.closePath();
  ctx.fill();

  // Two lighter trunk facets so the curve reads against the sky
  ctx.save();
  ctx.strokeStyle = shadeColor(color, 0.16);
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = Math.max(1, baseHalfW * 0.3);
  ctx.beginPath();
  ctx.moveTo(baseX - baseHalfW * 0.35, baseY + 4);
  ctx.quadraticCurveTo(ctrlX - baseHalfW * 0.2, ctrlY, tipX - tipHalfW * 0.4, tipY + 2);
  ctx.stroke();
  ctx.restore();

  // Crown of coconuts
  const nutR = Math.max(2, tipHalfW * 1.2);
  ctx.fillStyle = shadeColor(color, 0.08);
  for (let c = -1; c <= 1; c++) {
    ctx.beginPath();
    ctx.arc(tipX + c * nutR * 0.95, tipY + nutR * (0.85 + Math.abs(c) * 0.18), nutR, 0, Math.PI * 2);
    ctx.fill();
  }

  // Layered fronds: back shades first, brightest on top, 9-13 per tree
  const frondCount = randInt(rng, 9, 13);
  const shadeBack = shadeColor(color, 0.2);
  const shadeMid = shadeColor(color, 0.34);
  const shadeFront = shadeColor(color, 0.5);

  for (let i = 0; i < frondCount; i++) {
    const frac = i / Math.max(1, frondCount - 1);
    const angle = -Math.PI * 1.12 + frac * (Math.PI * 1.24) + randRange(rng, -0.12, 0.12);
    const frondLen = height * randRange(rng, 0.28, 0.5);
    const droop = frondLen * randRange(rng, 0.16, 0.5);
    const leaflets = randInt(rng, 10, 18);
    const spineThick = Math.max(1.4, height * 0.0075 * scale);
    const isFront = randRange(rng, -1, 1) > 0.15;
    const fill = i < frondCount * 0.34 ? shadeBack : isFront ? shadeFront : shadeMid;
    const sideSign = randRange(rng, -1, 1) >= 0 ? 1 : -1;
    drawPalmFrond(ctx, tipX, tipY, angle, frondLen, droop, leaflets, spineThick, fill, sideSign);
  }

  ctx.restore();
}

/** Draws palm tree silhouettes at two scales framing the poster flanks and skyline. */
export function drawPalmRow(ctx, width, height, gradeId, seed) {
  const palette = getGradePalette(gradeId);
  const rng = mulberry32(deriveSeed(seed, 303));
  const unit = Math.min(width, height);

  // Background smaller scale palms
  const bgTrees = [
    { x: width * randRange(rng, 0.12, 0.18), h: unit * randRange(rng, 0.22, 0.28), lean: width * randRange(rng, 0.02, 0.05), s: 0.75 },
    { x: width * randRange(rng, 0.80, 0.86), h: unit * randRange(rng, 0.22, 0.28), lean: width * randRange(rng, -0.05, -0.02), s: 0.75 },
  ];

  for (const t of bgTrees) {
    drawPalmTree(ctx, t.x, height + 4, t.h, t.lean, t.s, rng, palette.silhouette);
  }

  // Foreground larger scale framing palms
  const fgTrees = [
    { x: width * randRange(rng, 0.015, 0.05), h: unit * randRange(rng, 0.44, 0.54), lean: width * randRange(rng, 0.05, 0.10), s: 1.05 },
    { x: width * randRange(rng, 0.08, 0.13), h: unit * randRange(rng, 0.30, 0.38), lean: width * randRange(rng, -0.02, 0.04), s: 0.9 },
    { x: width * randRange(rng, 0.86, 0.92), h: unit * randRange(rng, 0.30, 0.38), lean: width * randRange(rng, -0.04, 0.02), s: 0.9 },
    { x: width * randRange(rng, 0.945, 0.985), h: unit * randRange(rng, 0.45, 0.55), lean: width * randRange(rng, -0.10, -0.05), s: 1.05 },
  ];

  if (width / height > 1.25) {
    fgTrees.push(
      { x: width * randRange(rng, 0.33, 0.41), h: unit * randRange(rng, 0.14, 0.19), lean: width * randRange(rng, -0.02, 0.03), s: 0.78 },
      { x: width * randRange(rng, 0.59, 0.67), h: unit * randRange(rng, 0.14, 0.19), lean: width * randRange(rng, -0.03, 0.02), s: 0.78 },
    );
  }

  for (const t of fgTrees) {
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

/** Draws a subtle dark cinematic vignette around poster edges. */
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
