# Vice Cover

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/juggle-ales-8k/gta6-cover-art/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/juggle-ales-8k/gta6-cover-art/reward.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

**Vice Cover** is a professional offline GTA-style multi-panel cover art studio built entirely with plain HTML, CSS, and ES modules on Canvas 2D—no external libraries, build tools, or network requests. Drop in your own photos or start from Vice City samples, reframe panels, dial in custom-drawn display lettering with true proportional character advance widths, choose from five layout modes and five colour grades, and export full-resolution PNG posters directly in the browser.

## Features

### Six Multi-Panel Layouts

Every layout composes photos inside a cream-toned poster frame with crisp 2–4 px dark ink borders, screen-printed light inner hairlines, and sophisticated scene dressing (sunset sky with bloom disc, haze bands, skyline silhouettes with illuminated windows, palm trees, film grain, and vignette):

- **Hero + 2x2 (`hero`)** — Five panels: one tall hero panel (~55% width) on the left paired with an asymmetric 2×2 grid on the right; bold geometric balance perfect for landscape subjects.
- **Quad Hero (`quad`)** — Four panels: 1 massive hero panel across top 60% with consistent margin, 3 smaller side-by-side panels below.
- **Banner + 4 (`grid`)** — Five panels: a wide cinematic banner across the top (42% height) over two rows of staggered smaller panels; ideal for action storytelling.
- **Strip x3 (`strip`)** — Three stacked widescreen horizontal bands; panoramic framing for wide landscapes or character triptychs.
- **Mosaic (`mosaic`)** — One large 3-row hero panel plus five smaller tilted (±2.5°) surrounding panels with soft drop shadows; magazine spread feel with asymmetric visual interest.
- **Triptych (`triptych`)** — Three tall equal-width vertical panels with a wide title band stretched across the bottom; classic poster gallery format.

### Five Per-Pixel Colour Grades

Colour grading runs directly on the composed Canvas 2D `ImageData` buffer using a graphic-novel S-curve contrast pass, luminance-preserving saturation shaping, vertical multiply/overlay split-toning, and shadow/highlight tinting:

- **Sunset (`sunset`)** — Warm Vice orange and coral fading into hot magenta-violet with plum shadows; classic Miami Heat aesthetic.
- **Neon (`neon`)** — High-saturation electric cyan to magenta with deep indigo shadows and bright highlights; cyberpunk night energy.
- **Noir (`noir`)** — Desaturated steel-blue atmosphere with punchy contrast, ink blacks, and crisp silver highlights; moody detective fiction.
- **Gold (`gold`)** — Sunlit amber and bronze warmth across midtones, shadows, and highlights; tropical luxury vibes.
- **Vice (`vice`)** — Hot pink to cyan high-voltage Vice Hotline aesthetic.

### Custom-Drawn Display Lettering

Headlines and optional subtitles render in bold condensed uppercase with:
- **Vector outline glyphs** (A–Z, 0–9, space, `-`, `'`, `!`, `?`, `.`, `&`) with character advance tables (`I`/`1` narrow at 0.36–0.32 em, `M`/`W` wide at 0.82–0.88 em, rest balanced).
- **Auto-fit sizing and line splitter** — intelligently wraps and centers headline text across one or two lines while maintaining correct aspect ratio and advance spacing.
- **Hard drop shadow**, **chromatic fringe**, and **dark backing glow** for clear legibility on complex panel backgrounds.

Three distinct finishes:
- **Block (`block`)** — Iconic solid white GTA lettering with heavy black ink outline and thin light inner rim.
- **Chrome (`chrome`)** — 1980s metallic horizon gradient with dark ink framing and bevel highlights.
- **Neon (`neon`)** — Dark ink housing lit by dual magenta and cyan bloom glows over bright gradient core.

## Development & Usage

Serve locally with Node 22+:
```bash
node serve.ts
```
Then open http://localhost:8080.

Validate and build dossier:
```bash
node main.ts --check
mkdir -p out_gate && MAKEFUN_OUTPUT_DIR=out_gate node main.ts
```

Regenerate screenshots:
```bash
node shots.mjs
```
