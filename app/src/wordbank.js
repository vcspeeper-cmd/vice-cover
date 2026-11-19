// Deterministic caption word bank and title generator for Vice Cover.

export const MOODS = ['heat', 'night', 'salt', 'chrome', 'dust', 'rain'];

export const ADJECTIVES = [
  'SUNBURNT', 'SUNKEN', 'NEON', 'GOLDEN', 'RUSTED',
  'MIDNIGHT', 'BLEACHED', 'VELVET', 'SILENT', 'SOLITARY',
  'DESERT', 'COASTAL', 'BITTER', 'RECKLESS', 'BURNING',
  'HAZY', 'FADED', 'CHROME', 'SALTED', 'SHADOW'
];

export const NOUNS = [
  'OUTLAW', 'MIRAGE', 'EXPRESS', 'RUNAWAY', 'HORIZON',
  'BOULEVARD', 'DRIFTER', 'CORONA', 'EMPIRE', 'HAVEN',
  'TEMPEST', 'VERDICT', 'SYNDICATE', 'CORRIDOR', 'PHANTOM',
  'VALLEY', 'HARBOR', 'HIGHWAY', 'CIRCUIT', 'RECKONING'
];

export const PLACES = [
  'PALM BAY', 'PELICAN CAYS', 'CORAL CREST', 'SABAL RIDGE',
  'SOLANA BEACH', 'SAN MATEO', 'COCO BAYOU', 'MIRAMAR DOCKS',
  'AMBER KEY', 'MARINA REACH', 'FLAMINGO HARBOR', 'VERONA ISLES',
  'VISTA HARBOR', 'OCEAN REACH', 'SUNSET REEF', 'LAUREL CANYON',
  'BAYSHORE STRIP', 'POINT ROYALE', 'STARLIGHT SHORES', 'CYPRESS RUN'
];

export const TAGS = [
  'NO WAY OUT OF THIS TOWN',
  'NO ANSWERS AT THE END OF THE ROAD',
  'BURNING DIESEL AND LOST PROMISES',
  'WHERE SUNLIGHT TURNS TO DUST',
  'CHASING SHADOWS DOWN THE STRIP',
  'CHROME SHARDS IN THE NEON LIGHT',
  'EVERY DEBT COMES DUE AT DAWN',
  'SALT AIR AND HIGHWAY HEAT',
  'STOLEN CARS AND SUNBURNED HEARTS',
  'NOTHING STAYS BURIED IN THE SWAMP',
  'LONG NIGHTS ALONG THE BAYOU',
  'MIDNIGHT RUNNERS UNDER VIOLET SKIES',
  'THE TIDE TAKES EVERYTHING EVENTUALLY',
  'RUNNING BLIND ON EMPTY TANKS',
  'LATE NIGHT DREAMS AND COLD CASH',
  'ANOTHER DAWN ON OCEAN DRIVE',
  'PAST THE MARINA AFTER DARK',
  'FEVER DREAMS ON COASTAL ROADS',
  'THE SUN GOES DOWN ON SOLITUDE',
  'SILENT STREETS AND BURNING CHROME'
];

export const MOOD_DICTIONARY = {
  heat: {
    adjectives: ['SUNBURNT', 'BURNING', 'HAZY', 'GOLDEN', 'DESERT', 'BLEACHED'],
    nouns: ['EXPRESS', 'HORIZON', 'MIRAGE', 'CORONA', 'VALLEY', 'HIGHWAY'],
    places: ['SABAL RIDGE', 'SOLANA BEACH', 'AMBER KEY', 'LAUREL CANYON', 'CYPRESS RUN'],
    tags: [
      'WHERE SUNLIGHT TURNS TO DUST',
      'SALT AIR AND HIGHWAY HEAT',
      'STOLEN CARS AND SUNBURNED HEARTS',
      'RUNNING BLIND ON EMPTY TANKS'
    ]
  },
  night: {
    adjectives: ['MIDNIGHT', 'NEON', 'VELVET', 'SILENT', 'SHADOW', 'RECKLESS'],
    nouns: ['OUTLAW', 'RUNAWAY', 'DRIFTER', 'PHANTOM', 'CIRCUIT', 'SYNDICATE'],
    places: ['PALM BAY', 'FLAMINGO HARBOR', 'BAYSHORE STRIP', 'STARLIGHT SHORES', 'OCEAN REACH'],
    tags: [
      'CHASING SHADOWS DOWN THE STRIP',
      'LONG NIGHTS ALONG THE BAYOU',
      'MIDNIGHT RUNNERS UNDER VIOLET SKIES',
      'LATE NIGHT DREAMS AND COLD CASH'
    ]
  },
  salt: {
    adjectives: ['COASTAL', 'SALTED', 'SUNKEN', 'BLEACHED', 'BITTER', 'SOLITARY'],
    nouns: ['HARBOR', 'HAVEN', 'TEMPEST', 'CORRIDOR', 'HORIZON', 'DRIFTER'],
    places: ['PELICAN CAYS', 'COCO BAYOU', 'MIRAMAR DOCKS', 'VERONA ISLES', 'SUNSET REEF'],
    tags: [
      'THE TIDE TAKES EVERYTHING EVENTUALLY',
      'PAST THE MARINA AFTER DARK',
      'FEVER DREAMS ON COASTAL ROADS',
      'NOTHING STAYS BURIED IN THE SWAMP'
    ]
  },
  chrome: {
    adjectives: ['CHROME', 'NEON', 'GOLDEN', 'RECKLESS', 'BURNING', 'SUNBURNT'],
    nouns: ['CIRCUIT', 'EXPRESS', 'SYNDICATE', 'EMPIRE', 'PHANTOM', 'OUTLAW'],
    places: ['POINT ROYALE', 'BAYSHORE STRIP', 'MARINA REACH', 'STARLIGHT SHORES', 'CORAL CREST'],
    tags: [
      'CHROME SHARDS IN THE NEON LIGHT',
      'BURNING DIESEL AND LOST PROMISES',
      'EVERY DEBT COMES DUE AT DAWN',
      'SILENT STREETS AND BURNING CHROME'
    ]
  },
  dust: {
    adjectives: ['DESERT', 'RUSTED', 'BLEACHED', 'FADED', 'BITTER', 'SOLITARY'],
    nouns: ['VALLEY', 'HIGHWAY', 'MIRAGE', 'RECKONING', 'CORRIDOR', 'DRIFTER'],
    places: ['SABAL RIDGE', 'LAUREL CANYON', 'SAN MATEO', 'CYPRESS RUN', 'AMBER KEY'],
    tags: [
      'NO ANSWERS AT THE END OF THE ROAD',
      'NO WAY OUT OF THIS TOWN',
      'THE SUN GOES DOWN ON SOLITUDE',
      'RUNNING BLIND ON EMPTY TANKS'
    ]
  },
  rain: {
    adjectives: ['SILENT', 'SHADOW', 'SUNKEN', 'VELVET', 'MIDNIGHT', 'HAZY'],
    nouns: ['TEMPEST', 'VERDICT', 'HARBOR', 'CORRIDOR', 'SYNDICATE', 'PHANTOM'],
    places: ['MIRAMAR DOCKS', 'VERONA ISLES', 'VISTA HARBOR', 'FLAMINGO HARBOR', 'PALM BAY'],
    tags: [
      'ANOTHER DAWN ON OCEAN DRIVE',
      'EVERY DEBT COMES DUE AT DAWN',
      'CHASING SHADOWS DOWN THE STRIP',
      'NOTHING STAYS BURIED IN THE SWAMP'
    ]
  }
};

/** Picks one entry from an array chosen by a rand function returning a float in [0,1). */
export function pick(list, rand = Math.random) {
  if (!list || list.length === 0) return '';
  const r = typeof rand === 'function' ? rand() : Math.random();
  const idx = Math.floor(r * list.length) % list.length;
  return list[idx];
}

/** Generates a caption object with headline, tagline, and mood. */
export function makeCaption(rand = Math.random) {
  const chosenMood = pick(MOODS, rand);
  return makeCaptionFor(chosenMood, rand);
}

/** Generates a caption object restricted to a specific mood family. */
export function makeCaptionFor(mood, rand = Math.random) {
  const selectedMood = MOODS.includes(mood) ? mood : pick(MOODS, rand);
  const dict = MOOD_DICTIONARY[selectedMood] || {
    adjectives: ADJECTIVES,
    nouns: NOUNS,
    places: PLACES,
    tags: TAGS
  };

  const adj = pick(dict.adjectives, rand);
  const noun = pick(dict.nouns, rand);
  const place = pick(dict.places, rand);

  // Decide whether headline is 2 or 3 words (50% chance using rand)
  const useThreeWords = rand() > 0.5;
  const headline = useThreeWords ? `${adj} ${noun} OF ${place}` : `${adj} ${noun}`;
  const tagline = pick(dict.tags, rand);

  return {
    headline: headline.toUpperCase(),
    tagline: tagline.toUpperCase(),
    mood: selectedMood
  };
}

/** Returns count distinct caption objects for a mood, never repeating headlines. */
export function captionIdeas(mood, count = 3, rand = Math.random) {
  const results = [];
  const seenHeadlines = new Set();
  let attempts = 0;

  while (results.length < count && attempts < count * 20) {
    attempts++;
    const cap = mood ? makeCaptionFor(mood, rand) : makeCaption(rand);
    if (!seenHeadlines.has(cap.headline)) {
      seenHeadlines.add(cap.headline);
      results.push(cap);
    }
  }
  return results;
}


