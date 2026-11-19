// Seeded deterministic PRNG (mulberry32) and sampling helpers.

/** Returns a deterministic float generator in [0, 1) seeded by a 32-bit unsigned integer. */
export function mulberry32(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Derives an independent child seed from a base seed and a salt integer. */
export function deriveSeed(seed, salt) {
  let h = (seed >>> 0) ^ Math.imul(salt >>> 0, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

/** Uniform float in [min, max). */
export function randRange(rng, min, max) {
  return min + rng() * (max - min);
}

/** Uniform integer in [min, max] inclusive. */
export function randInt(rng, min, max) {
  return Math.floor(min + rng() * (max - min + 1));
}
