// Captures the 4 competition screenshots of Vice Cover by serving app/ locally on 127.0.0.1:8137
// and driving headless Chromium via Playwright. Fails loudly if any file exceeds 262144 bytes,
// or if pixel dimensions breach the [480, 1280] boundaries.

import { createReadStream, mkdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/browser-sandbox/vcp-browser/loom/node_modules/playwright/index.mjs';

const HERE = resolve(fileURLToPath(new URL('.', import.meta.url)));
const APP_ROOT = join(HERE, 'app');
const SHOTS_DIR = join(HERE, 'screenshots');
const CHROME_PATH = '/root/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const HOST = '127.0.0.1';
const PORT = 8137;
const MAX_BYTES = 262144;
const MAX_LONG_SIDE = 1280;
const MIN_SHORT_SIDE = 480;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const SCENES = [
  {
    file: '1-cover.jpg',
    width: 1024,
    height: 1280,
    query: '?shot=cover&size=tall&grade=sunset&layout=mosaic&lettering=block&caption=MIDNIGHT%20IN%20LEONIDA&subtitle=SOUTH%20BEACH%20EDITION&seed=1986',
  },
  {
    file: '2-editor.jpg',
    width: 1280,
    height: 800,
    query: '?shot=editor&size=tall&grade=sunset&layout=hero&lettering=block&caption=MIDNIGHT%20IN%20LEONIDA&subtitle=SOUTH%20BEACH%20EDITION&seed=1986',
  },
  {
    file: '3-cover-wide.jpg',
    width: 1280,
    height: 720,
    query: '?shot=cover&size=wide&grade=neon&layout=grid&lettering=neon&caption=NEON%20BOULEVARD&subtitle=VICE%20AFTER%20DARK&seed=2026',
  },
  {
    file: '4-cover-square.jpg',
    width: 1024,
    height: 1024,
    query: '?shot=cover&size=square&grade=gold&layout=triptych&lettering=chrome&caption=GOLDEN%20GETAWAY&subtitle=OCEAN%20DRIVE%20HEIST&seed=7777',
  },
];

function startServer() {
  return new Promise((resolveServer, rejectServer) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? '/', `http://${HOST}:${PORT}`);
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const file = resolve(join(APP_ROOT, normalize(pathname)));
      if (file !== APP_ROOT && !file.startsWith(APP_ROOT + sep)) {
        res.writeHead(403).end('forbidden');
        return;
      }
      let size;
      try {
        const st = statSync(file);
        if (!st.isFile()) throw new Error('not a file');
        size = st.size;
      } catch {
        res.writeHead(404).end('not found');
        return;
      }
      res.writeHead(200, {
        'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
        'content-length': size,
        'cache-control': 'no-store',
      });
      createReadStream(file).pipe(res);
    });
    server.on('error', rejectServer);
    server.listen(PORT, HOST, () => resolveServer(server));
  });
}

async function main() {
  mkdirSync(SHOTS_DIR, { recursive: true });
  const server = await startServer();
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });

    const context = await browser.newContext({ deviceScaleFactor: 1 });
    const page = await context.newPage();

    const errors = [];
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    });

    for (const scene of SCENES) {
      const longSide = Math.max(scene.width, scene.height);
      const shortSide = Math.min(scene.width, scene.height);
      if (longSide > MAX_LONG_SIDE) {
        throw new Error(`${scene.file} long side ${longSide}px exceeds max ${MAX_LONG_SIDE}px`);
      }
      if (shortSide < MIN_SHORT_SIDE) {
        throw new Error(`${scene.file} short side ${shortSide}px is below min ${MIN_SHORT_SIDE}px`);
      }

      await page.setViewportSize({ width: scene.width, height: scene.height });
      const targetUrl = `http://${HOST}:${PORT}/${scene.query}`;
      await page.goto(targetUrl, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.__shotReady === true, null, { timeout: 20000 });

      const outPath = join(SHOTS_DIR, scene.file);
      let quality = 88;
      let bytes = Infinity;
      while (quality >= 72) {
        await page.screenshot({
          path: outPath,
          type: 'jpeg',
          quality,
        });
        bytes = statSync(outPath).size;
        if (bytes <= MAX_BYTES) break;
        quality -= 3;
      }

      console.log(`${scene.file}: ${bytes} bytes (${scene.width}x${scene.height}, q=${quality})`);
      if (bytes > MAX_BYTES) {
        throw new Error(`${scene.file} is ${bytes} bytes, exceeding the ${MAX_BYTES} byte limit!`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Browser errors during capture:\n${errors.join('\n')}`);
    }
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
