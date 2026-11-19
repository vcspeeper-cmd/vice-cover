# Vice Cover

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/juggle-ales-8k/gta6-cover-art/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/juggle-ales-8k/gta6-cover-art/reward.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

**Vice Cover** is a professional offline GTA-style multi-panel cover art studio built entirely with plain HTML, CSS, and ES modules on Canvas 2D—no external libraries, build tools, or network requests. Drop in your own photos or start from Vice City samples, arrange and reframe each panel with per-panel colour grading, dial in custom-drawn display lettering, and export full-resolution PNG posters directly in the browser.

## Features

### Five Multi-Panel Layouts

Every layout composes photos inside a cream-toned poster frame with crisp 2–4 px dark ink borders, screen-printed light inner hairlines, and sophisticated scene dressing (animated sunset sky, cityscape silhouettes, palm trees, film grain, and vignette):

- **Hero + 2x2 (`hero`)** — Five panels: one tall hero panel (~55% width) on the left paired with an asymmetric 2×2 grid on the right; bold geometric balance perfect for landscape subjects.
- **Banner + 4 (`grid`)** — Five panels: a wide cinematic banner across the top (42% height) over two rows of staggered smaller panels; ideal for action storytelling.
- **Strip x3 (`strip`)** — Three stacked widescreen horizontal bands; panoramic framing for wide landscapes or character triptychs.
- **Mosaic (`mosaic`)** — One large 3-row hero panel plus five smaller tilted (±2.5°) surrounding panels with soft drop shadows; magazine spread feel with asymmetric visual interest.
- **Triptych (`triptych`)** — Three tall equal-width vertical panels with a wide title band stretched across the bottom; classic poster gallery format.

### Four Per-Pixel Colour Grades

Colour grading runs directly on the composed Canvas 2D `ImageData` buffer using a graphic-novel S-curve contrast pass, luminance-preserving saturation shaping, vertical multiply/overlay split-toning, and shadow/highlight tinting:

- **Sunset (`sunset`)** — Warm Vice orange and coral fading into hot magenta-violet with plum shadows; classic Miami Heat aesthetic.
- **Neon (`neon`)** — High-saturation electric cyan to magenta with deep indigo shadows and bright highlights; cyberpunk night energy.
- **Noir (`noir`)** — Desaturated steel-blue atmosphere with punchy contrast, ink blacks, and crisp silver highlights; moody detective fiction.
- **Gold (`gold`)** — Sunlit amber and bronze warmth across midtones, shadows, and highlights; tropical luxury vibes.

### Custom-Drawn Display Lettering

Headlines and optional subtitles render in bold condensed uppercase with:
- **Vector outline glyphs** (A–Z, 0–9, space, `-`, `'`, `!`, `?`, `.`, `&`) — not system fonts; custom polygon letterforms with tight tracking and `-6°` italic skew.
- **Auto-fit sizing** — intelligently shrinks to fit any caption up to 40 characters across one or two balanced lines while staying commanding.
- **Per-line horizontal squeeze** and optional two-tone top/bottom split for visual interest.
- **Hard drop shadow** offset at caption scale, plus thin inner highlight stroke for crispness.
- **Grade-matched chromatic fringe** (magenta/cyan aberration) for poster authenticity.

Three distinct finishes:
- **Block (`block`)** — Iconic solid white GTA lettering with heavy black ink outline and thin light inner rim; poster-shop classic.
- **Chrome (`chrome`)** — 1980s metallic horizon gradient (bright top → dark middle → warm bottom) with dark ink framing and crisp bevel highlight.
- **Neon (`neon`)** — Dark ink housing lit by dual magenta and cyan bloom glows over bright cyan-to-pink gradient core; retro arcade energy.

### Per-Panel Photo Control & Framing

Each panel maintains independent photo assignment, crop, and zoom:

- **Add Photos** or drag and drop image files anywhere onto the page (dropping directly over a panel targets that panel first; multiple files fan across panels).
- Click any panel to select it, **drag** inside the panel to pan along the available cover-fit overflow, and **scroll the mouse wheel** or use the **Panel Zoom** slider to zoom smoothly from `1.0x` to `4.0x`.
- **Per-panel colour grading** — apply a distinct grade to each panel independently for mixed moods within a single poster.
- **Per-panel brightness/contrast/saturation controls** — fine-tune individual photo exposure and tone.
- **Reset Crop**, **Fill all panels with this photo**, or **Use Samples** to quickly reset or recompose.

### Deterministic Procedural Scene Dressing

All set dressing is driven by a seeded `mulberry32` PRNG (starting at `#1986` and stepped via **Reroll Seed**), so any seed reproduces the exact same poster across preview, exports, and screenshots:

- **Cream/off-white poster frame** — thin inner rule, bottom title band with caption, tagline line, and "VI"-style numeral block drawn from custom geometry.
- **Sunset sky backdrop** — diagonal light rays, a glowing sun disc sliced by horizontal horizon bars, and layered atmospheric haze bands; animated for each seed.
- **Two-layer coastal city skyline** — hazy distant towers and foreground Art Deco crowns with seeded illuminated window grids; foreground silhouette with varied roof styles (stepped crowns, slanted modern, antenna spires).
- **Bezier palm-tree silhouettes** — framing the flanks and bottom horizon with tapered curved trunks, coconuts, and feathered drooping fronds; hero palms on left/right flanks plus mid-distance and wide-format supplementary trees.
- **Paper-grain overlay** — deterministic film grain tile blended via `overlay` mode; subtle, photographic texture.
- **Cinematic vignette** — soft radial darkening around edges; lifts subject focus toward centre.
- **Chromatic fringe** — subtle colour separation on panel edges (grade-matched aberration).

### Three Native PNG Export Sizes

Preview runs at a responsive ~860 px long edge for smooth interactive panning, while exporting always re-renders cleanly onto a fresh offscreen canvas (without editor selection outlines) at full native resolution:

| Format | Aspect Ratio | Export Resolution |
| --- | --- | --- |
| Tall Poster | 4:5 | `1080 × 1350` |
| Square Cover | 1:1 | `1080 × 1080` |
| Wide Key Art | 16:9 | `1920 × 1080` |



## Editor Workflow

The Vice Cover editor is built for speed and tactile control:

- **Left panel photo tray** — thumbnails of loaded images with drag-to-reorder and **Add photos** drop zone.
- **Centre canvas** — live poster preview at responsive scale; click to select panels, drag to pan, wheel to zoom.
- **Right inspector panel** — layout, size, grade, caption/tagline text fields, per-panel zoom control, lettering finish selector, seed readout, and big **Export PNG** button.
- **Keyboard shortcuts** — `1`/`2`/`3`/`4`/`5` to switch layouts, `E` to export, `R` to reseed, `Z` to cycle grades, `L` to rotate lettering styles.
- **Undo/Redo stack** — `Ctrl+Z` / `Cmd+Z` to undo, `Ctrl+Shift+Z` / `Cmd+Shift+Z` to redo photo loads, pan adjustments, and caption changes.
- **Status line** — live feedback on crop adjustments, exports, and file operations.

All work is local: photos come from `<input type="file">` or drag/drop, read with `createImageBitmap`, and never leave your browser. Every asset (samples, fonts as Path2D geometry) lives in `app/` or as `data:` URIs.



Requires Node.js 22+ with no install or build step:

```bash
node serve.ts
```

Then open [http://localhost:8080](http://localhost:8080) in a desktop browser.

## Validate & Build the Submission Bundle

Check `app/` and `screenshots/` against the competition caps without writing any files:

```bash
node main.ts --check
```

Copy `app/` and `screenshots/` into an output directory and generate `dossier.json`:

```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Regenerate Screenshots

Capture the four showcase renders (`1-cover.jpg`, `2-editor.jpg`, `3-cover-wide.jpg`, and `4-cover-square.jpg`) into `screenshots/` with headless Chromium:

```bash
node shots.mjs
```
