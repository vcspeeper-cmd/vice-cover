// Ready-made poster looks for the Vice Cover poster studio.

export const PRESETS = [
  {
    id: 'pastel-boulevard',
    label: 'Pastel Boulevard',
    caption: 'PALM SHADOWS',
    tagline: 'OCEAN DRIVE AT NOON',
    layout: 'hero',
    grade: 'gold',
    lettering: 'block',
    seed: 1984,
    mood: 'Pastel Daytime',
  },
  {
    id: 'magenta-dusk',
    label: 'Magenta Dusk',
    caption: 'DUSK CRUISER',
    tagline: 'BURNING SKYLINE PASS',
    layout: 'quad',
    grade: 'sunset',
    lettering: 'neon',
    seed: 2048,
    mood: 'Hot Dusk',
  },
  {
    id: 'teal-pier',
    label: 'Teal Night Pier',
    caption: 'COASTAL LIGHTS',
    tagline: 'MIDNIGHT ON THE MARINA',
    layout: 'strip',
    grade: 'vice',
    lettering: 'chrome',
    seed: 3072,
    mood: 'Night Pier',
  },
  {
    id: 'monochrome-street',
    label: 'Monochrome Noir Street',
    caption: 'SHADOW CITY',
    tagline: 'NO WAY OUT TONIGHT',
    layout: 'mosaic',
    grade: 'noir',
    lettering: 'block',
    seed: 4096,
    mood: 'Monochrome Noir',
  },
  {
    id: 'gold-skyline',
    label: 'Gold Hour Skyline',
    caption: 'AMBER RUSH',
    tagline: 'GOLDEN HOUR HIGHLIGHTS',
    layout: 'triptych',
    grade: 'gold',
    lettering: 'chrome',
    seed: 5120,
    mood: 'Gold Hour',
  },
  {
    id: 'storm-skyline',
    label: 'Storm Skyline',
    caption: 'LIGHTNING BAY',
    tagline: 'TEMPEST OVER THE CITY',
    layout: 'grid',
    grade: 'noir',
    lettering: 'chrome',
    seed: 6144,
    mood: 'Storm-Lit',
  },
  {
    id: 'washed-film',
    label: 'Washed Film Look',
    caption: 'SUNFADED DAYS',
    tagline: 'RETRO GRAIN MEMORIES',
    layout: 'hero',
    grade: 'sunset',
    lettering: 'block',
    seed: 7168,
    mood: 'Washed-Out Film',
  },
  {
    id: 'neon-arcade',
    label: 'Neon Arcade',
    caption: 'HIGH SCORE VICE',
    tagline: 'GLOWING CABIN RUSH',
    layout: 'quad',
    grade: 'neon',
    lettering: 'neon',
    seed: 8192,
    mood: 'Neon Arcade',
  },
  {
    id: 'desert-highway',
    label: 'Desert Highway',
    caption: 'HEATWAVE RUN',
    tagline: 'ENDLESS ASPHALT HORIZON',
    layout: 'strip',
    grade: 'gold',
    lettering: 'block',
    seed: 9216,
    mood: 'Desert Highway',
  },
  {
    id: 'rooftop-pool',
    label: 'Rooftop Pool',
    caption: 'AZURE SKYLINE',
    tagline: 'HIGH RISE CHILL',
    layout: 'triptych',
    grade: 'vice',
    lettering: 'neon',
    seed: 10240,
    mood: 'Rooftop Pool',
  },
  {
    id: 'harbour-dawn',
    label: 'Harbour Dawn',
    caption: 'MORNING MIST',
    tagline: 'FIRST RAYS AT THE DOCKS',
    layout: 'mosaic',
    grade: 'sunset',
    lettering: 'chrome',
    seed: 11264,
    mood: 'Harbour Dawn',
  },
  {
    id: 'rain-downtown',
    label: 'Rain-Slick Downtown',
    caption: 'NEON REFLECTIONS',
    tagline: 'WET ASPHALT MIDNIGHT',
    layout: 'grid',
    grade: 'neon',
    lettering: 'chrome',
    seed: 12288,
    mood: 'Rain-Slick Downtown',
  },
];

/**
 * Groups the presets by mood and returns them in a stable order.
 * Returns an object mapping mood string to array of preset objects.
 */
export function presetsByMood() {
  const groups = {};
  for (const preset of PRESETS) {
    if (!groups[preset.mood]) {
      groups[preset.mood] = [];
    }
    groups[preset.mood].push(preset);
  }
  return groups;
}

/**
 * Returns the preset with the given id, or null if not found.
 */
export function findPreset(id) {
  return PRESETS.find((p) => p.id === id) ?? null;
}

/**
 * Walks the list by a signed step and wraps around.
 */
export function nextPreset(id, step = 1) {
  if (PRESETS.length === 0) return null;
  const idx = PRESETS.findIndex((p) => p.id === id);
  if (idx < 0) return PRESETS[0];
  const count = PRESETS.length;
  const nextIdx = (idx + (step % count) + count) % count;
  return PRESETS[nextIdx];
}

/**
 * Takes a function returning a number in [0,1) and returns a preset,
 * keeping the choice deterministic when passed a seeded PRNG.
 */
export function randomPreset(rand = Math.random) {
  if (PRESETS.length === 0) return null;
  const val = typeof rand === 'function' ? rand() : Math.random();
  const idx = Math.floor(val * PRESETS.length) % PRESETS.length;
  return PRESETS[idx];
}

