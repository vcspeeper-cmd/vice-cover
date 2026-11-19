// Real per-pixel colour grading on ImageData buffers (multiply/overlay/split-tone curves).

export const GRADES = [
  {
    id: 'sunset',
    label: 'Sunset Vice',
    swatch: 'linear-gradient(135deg, #ff7e38, #e6268c)',
    sky: ['#1b0a33', '#6b185c', '#d93872', '#ff7b47', '#ffd166'],
    sun: ['#fff6b8', '#ff9e44', 'rgba(255, 76, 132, 0)'],
    haze: 'rgba(255, 198, 128, 0.22)',
    silhouette: '#12071e',
    windowColors: ['#ffe484', '#ff92c2', '#7ff6ff', '#ffb86b'],
    fringeA: 'rgba(255, 60, 150, 0.72)',
    fringeB: 'rgba(56, 232, 255, 0.65)',
  },
  {
    id: 'neon',
    label: 'Neon Nights',
    swatch: 'linear-gradient(135deg, #00e5ff, #ff1ead)',
    sky: ['#070b26', '#141752', '#491278', '#b5179e', '#00d4ff'],
    sun: ['#c8ffff', '#ff3ec9', 'rgba(0, 212, 255, 0)'],
    haze: 'rgba(72, 240, 255, 0.20)',
    silhouette: '#07081a',
    windowColors: ['#4ef6ff', '#ff5ce0', '#fff07c', '#7c9eff'],
    fringeA: 'rgba(255, 24, 174, 0.85)',
    fringeB: 'rgba(0, 240, 255, 0.85)',
  },
  {
    id: 'noir',
    label: 'Midnight Noir',
    swatch: 'linear-gradient(135deg, #1b283b, #6f94b8)',
    sky: ['#070c14', '#142033', '#273d59', '#4f6d8c', '#9eb8cf'],
    sun: ['#e6f1fa', '#86a9c9', 'rgba(72, 108, 145, 0)'],
    haze: 'rgba(180, 210, 235, 0.16)',
    silhouette: '#060a10',
    windowColors: ['#dceeff', '#9bc7eb', '#ffe4ad', '#b8d4e8'],
    fringeA: 'rgba(120, 190, 255, 0.65)',
    fringeB: 'rgba(255, 120, 140, 0.45)',
  },
  {
    id: 'gold',
    label: 'Amber Heat',
    swatch: 'linear-gradient(135deg, #ffb703, #9e3d0a)',
    sky: ['#1e0f07', '#54200c', '#9c3e12', '#e07a16', '#ffe07d'],
    sun: ['#fff8cc', '#ffba33', 'rgba(224, 108, 16, 0)'],
    haze: 'rgba(255, 224, 130, 0.22)',
    silhouette: '#170a04',
    windowColors: ['#fff1a8', '#ffbb54', '#ffe066', '#ff8c42'],
    fringeA: 'rgba(255, 175, 20, 0.72)',
    fringeB: 'rgba(255, 65, 95, 0.55)',
  },
];

const GRADE_MAP = Object.fromEntries(GRADES.map((g) => [g.id, g]));

export function getGradePalette(gradeId) {
  return GRADE_MAP[gradeId] ?? GRADE_MAP.sunset;
}

function clamp255(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function overlayChannel(base, blend) {
  return base < 0.5
    ? 2 * base * blend
    : 1 - 2 * (1 - base) * (1 - blend);
}

function softContrast(x, amount) {
  // Smooth S-curve around 0.5 for punchy graphic-novel tonal separation.
  const centered = x - 0.5;
  const curved = centered + amount * centered * (1 - 4 * centered * centered);
  return curved + 0.5;
}

/**
 * Applies a real per-pixel colour grade in-place to a canvas 2D context.
 * Uses vertical gradient split-toning, multiply + overlay blending, saturation shaping,
 * and highlight/shadow colour shifts directly on the RGBA pixel buffer.
 */
export function applyColorGrade(ctx, width, height, gradeId) {
  const img = ctx.getImageData(0, 0, width, height);
  const data = img.data;
  const invH = height > 1 ? 1 / (height - 1) : 0;

  // Grade colour matrices (normalized 0..1)
  let topR, topG, topB, botR, botG, botB;
  let shR, shG, shB, hiR, hiG, hiB;
  let satBoost, contrastAmt, overlayMix, multMix;

  if (gradeId === 'neon') {
    // Cyan top -> electric magenta bottom, deep indigo shadows, crisp highlights
    topR = 0.08; topG = 0.90; topB = 1.00;
    botR = 1.00; botG = 0.14; botB = 0.76;
    shR = 0.06; shG = 0.08; shB = 0.28;
    hiR = 0.95; hiG = 0.98; hiB = 1.00;
    satBoost = 1.32;
    contrastAmt = 0.42;
    overlayMix = 0.42;
    multMix = 0.22;
  } else if (gradeId === 'noir') {
    // Cool desaturated steel-blue mood with crisp silver highlights and ink blacks
    topR = 0.34; topG = 0.50; topB = 0.70;
    botR = 0.16; botG = 0.27; botB = 0.42;
    shR = 0.05; shG = 0.10; shB = 0.18;
    hiR = 0.86; hiG = 0.93; hiB = 1.00;
    satBoost = 0.34;
    contrastAmt = 0.52;
    overlayMix = 0.36;
    multMix = 0.26;
  } else if (gradeId === 'gold') {
    // Warm sunlit amber/bronze across shadows and highlights
    topR = 1.00; topG = 0.80; topB = 0.34;
    botR = 0.86; botG = 0.38; botB = 0.08;
    shR = 0.18; shG = 0.09; shB = 0.03;
    hiR = 1.00; hiG = 0.94; hiB = 0.72;
    satBoost = 1.18;
    contrastAmt = 0.38;
    overlayMix = 0.40;
    multMix = 0.24;
  } else {
    // 'sunset': vibrant Vice orange/coral top fading to hot magenta-violet bottom
    topR = 1.00; topG = 0.58; topB = 0.22;
    botR = 0.94; botG = 0.16; botB = 0.58;
    shR = 0.18; shG = 0.05; shB = 0.24;
    hiR = 1.00; hiG = 0.92; hiB = 0.76;
    satBoost = 1.28;
    contrastAmt = 0.40;
    overlayMix = 0.40;
    multMix = 0.20;
  }

  let idx = 0;
  for (let y = 0; y < height; y++) {
    const t = y * invH;
    const gr = topR + (botR - topR) * t;
    const gg = topG + (botG - topG) * t;
    const gb = topB + (botB - topB) * t;

    for (let x = 0; x < width; x++) {
      let r = data[idx] / 255;
      let g = data[idx + 1] / 255;
      let b = data[idx + 2] / 255;

      // 1. Graphic-novel contrast S-curve
      r = softContrast(r, contrastAmt);
      g = softContrast(g, contrastAmt);
      b = softContrast(b, contrastAmt);

      // 2. Luminance & saturation shaping
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = lum + (r - lum) * satBoost;
      g = lum + (g - lum) * satBoost;
      b = lum + (b - lum) * satBoost;

      // Clamp intermediate before blend maths
      r = r < 0 ? 0 : r > 1 ? 1 : r;
      g = g < 0 ? 0 : g > 1 ? 1 : g;
      b = b < 0 ? 0 : b > 1 ? 1 : b;

      // 3. Multiply + Overlay blend with vertical grade colour
      const or = overlayChannel(r, gr);
      const og = overlayChannel(g, gg);
      const ob = overlayChannel(b, gb);

      const mr = r * gr;
      const mg = g * gg;
      const mb = b * gb;

      const baseMix = 1 - overlayMix - multMix;
      r = r * baseMix + or * overlayMix + mr * multMix;
      g = g * baseMix + og * overlayMix + mg * multMix;
      b = b * baseMix + ob * overlayMix + mb * multMix;

      // 4. Split-tone shadows and highlights
      const shadowW = (1 - lum) * (1 - lum) * 0.28;
      const highW = lum * lum * 0.16;
      r = r * (1 - shadowW) + shR * shadowW + (hiR - 0.5) * highW;
      g = g * (1 - shadowW) + shG * shadowW + (hiG - 0.5) * highW;
      b = b * (1 - shadowW) + shB * shadowW + (hiB - 0.5) * highW;

      data[idx] = clamp255(Math.round(r * 255));
      data[idx + 1] = clamp255(Math.round(g * 255));
      data[idx + 2] = clamp255(Math.round(b * 255));
      idx += 4;
    }
  }

  ctx.putImageData(img, 0, 0);
}
