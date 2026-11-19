# Vice Cover

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/vcspeeper-cmd/vice-cover/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/vcspeeper-cmd/vice-cover/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

Vice Cover is an offline poster design studio for creating multi-panel cover art directly inside the browser. It runs completely offline from static HTML, CSS, and ES module files with no external libraries, build steps, or network dependencies.

## What it does

### Multi-Panel Poster Layouts
Organize photos across six distinct geometric layout templates with customizable margins and panel bounds:
- **Hero**: Asymmetric split featuring one tall main panel alongside a two-by-two side grid.
- **Quad**: Prominent top hero panel spanning above three horizontal lower panels.
- **Grid**: Panoramic top banner section positioned above staggered lower panels.
- **Strip**: Stacked widescreen horizontal panels for cinematic panorama layouts.
- **Mosaic**: Central vertical hero panel framed by surrounding asymmetric offset panels.
- **Triptych**: Three vertical panels spanned by a full-width bottom headline banner.

### Per-Panel Photos with Focal Framing
Load custom images or sample photos into individual panels with interactive pan, zoom, and focal point adjustment controls:
- Interactive pan and scale adjustments per panel frame.
- Custom image uploading with drag-and-drop or file selection.
- Built-in sample asset loading for rapid composition prototyping.
- Focal point pinning to maintain composition balance across layout changes.
- Frame alignment tools to ensure crisp visual alignment within panel borders.
- Aspect ratio constraint management per panel slot.
- Drag-and-drop photo swapping between layout panels.
- Reset transform options to clear custom panning and zooming.

### Colour Grades
Transform poster aesthetics using per-pixel Canvas 2D image buffer manipulation passes:
- **Sunset**: Warm orange and coral tones fading into deep magenta-violet.
- **Neon**: Vibrant cyan and magenta highlights with dark indigo shadow tones.
- **Noir**: High-contrast desaturated monochrome with moody silver highlights.
- **Gold**: Sunlit amber and bronze warmth across midtones and highlights.
- **Vice**: High-voltage neon pink and cyan atmosphere.
- Direct pixel buffer access for real-time tone adjustments.
- Color curve calculations to maintain image contrast balance.

### Custom Vector Display Lettering
Render crisp headline and subtitle typography using custom vector path outlines:
- Vector character definitions covering uppercase letters, numbers, and punctuation.
- Character advance tables with true per-glyph width metrics.
- Automatic text line wrapping and dynamic auto-fit scaling.
- Choice of Block, Chrome, or Neon finish styles with ink borders and drop shadows.
- Dynamic kerning adjustments ensuring tight character spacing.
- Subtitle placement with proportional font scaling.
- Outline stroke width controls for high contrast visibility.

### Preset Library
Select from pre-configured poster presets that instantly apply complete layout structures, photo combinations, color grades, and caption text:
- Curated combinations matching distinct atmospheric styles.
- One-click application of complete poster setups.
- Instant switching between preset themes.
- Revert functionality to restore initial poster configurations.
- Custom preset state serialization.
- Quick preview thumbnails for visual preset selection.

### Deterministic Caption Generator
Synthesize stylized title captions and subtitles deterministically using a seeded pseudo-random number generator combined with curated vocabulary lists:
- Seedable random state for reproducible caption output.
- Categorized word bank containing themes, adjectives, and title components.
- Quick randomized generation of fresh title ideas.
- Structured phrase building for atmospheric tagline options.
- Seed value input for recreating exact caption pairings.
- History tracking for recently generated captions.

### PNG Export at Three Sizes
Export finished cover art directly to PNG images across three standard target resolutions:
- **Tall**: 800 × 1000 pixels for fast previews.
- **Wide**: 1200 × 900 pixels for landscape formats.
- **Poster**: 1600 × 2000 pixels for full-resolution exports.
- High-dpi rendering pipelines ensuring crisp vector lettering output.
- Instant client-side canvas-to-blob PNG downloading.

## Run it

Serve the studio locally using Node:

```bash
node serve.ts
```

Run validation checks and build the output dossier:

```bash
node main.ts --check
mkdir -p out_gate && MAKEFUN_OUTPUT_DIR=out_gate node main.ts
```

## How it is built

The application is structured into zero-dependency ES modules:

- `app/src/main.js`: Application entry point that initializes interactive studio mode or automated screenshot rendering based on URL parameters.
- `app/src/editor.js`: Manages user interface state, event handling, canvas interactions, image uploads, preset selection, and undo/redo history.
- `app/src/render.js`: Coordinates the drawing pipeline by rendering panel frames, positioned images, vector typography, backdrop scenes, and color grading passes.
- `app/src/scene.js`: Draws procedural background scene layers including gradient sunset skies, haze bands, city skyline silhouettes, palm trees, and vignetting.
- `app/src/layout.js`: Defines coordinate geometry for all six layout modes and specifies canvas target output dimensions.
- `app/src/lettering.js`: Renders custom vector glyph outlines with true character advance widths, auto-wrapping, drop shadows, and visual style finishes.
- `app/src/grade.js`: Implements per-pixel color manipulation algorithms for contrast curves, saturation adjustments, and multi-tone color grading.
- `app/src/presets.js`: Stores curated configuration presets containing panel photo assignments, layout selections, color grades, and captions.
- `app/src/wordbank.js`: Provides structured word lists of adjectives, nouns, and tagline phrases used for caption generation.
- `app/src/prng.js`: Implements a deterministic seeded pseudo-random number generator for reproducible layout generation and caption picking.

## Licence

MIT
