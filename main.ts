// Entrypoint for the Vice Cover gta6-cover-art-01 entry (Node 22, standard library only).
// Validates app/ and screenshots/ against the competition caps, copies them into the output directory,
// and writes dossier.json using the vendored make.fun library.
//
// Premium poster editor with custom-drawn vector lettering, multiple layout modes,
// colour grades, keyboard shortcuts, undo/redo, and preflight size validation.

import { cpSync, lstatSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const CAPS = {
  text_max_bytes: 163840,
  screenshots: { min: 3, max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
} as const;

interface PreflightReport {
  problems: string[];
  appFiles: number;
  appEntries: number;
  appBytes: number;
  screenshots: number;
}

/** Walks app/ and screenshots/ under `root` and collects every cap or structure violation. */
function validateEntry(root: string): PreflightReport {
  const problems: string[] = [];
  let appFiles = 0;
  let appEntries = 0;
  let appBytes = 0;
  let hasIndexHtml = false;

  const appDir = join(root, 'app');
  let appStat;
  try {
    appStat = lstatSync(appDir);
  } catch {
    problems.push('app/: directory does not exist');
  }

  if (appStat && !appStat.isDirectory()) {
    problems.push('app/: path is not a directory');
  } else if (appStat) {
    const stack: string[] = [''];
    while (stack.length > 0) {
      const rel = stack.pop()!;
      const dirPath = rel === '' ? appDir : join(appDir, rel);
      let entries;
      try {
        entries = readdirSync(dirPath, { withFileTypes: true });
      } catch (err) {
        problems.push(`app/${rel === '' ? '' : `${rel}/`}: cannot be read (${(err as Error).message})`);
        continue;
      }
      entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      for (const entry of entries) {
        const relPath = rel === '' ? entry.name : `${rel}/${entry.name}`;
        const pathBytes = Buffer.byteLength(relPath, 'utf8');
        if (pathBytes > CAPS.app_path_max_bytes) {
          problems.push(`app/${relPath}: path is ${pathBytes} bytes (max ${CAPS.app_path_max_bytes})`);
        }
        let st;
        try {
          st = lstatSync(join(appDir, relPath));
        } catch (err) {
          problems.push(`app/${relPath}: cannot stat (${(err as Error).message})`);
          continue;
        }
        appEntries++;
        if (st.isDirectory()) {
          stack.push(relPath);
        } else if (st.isFile()) {
          appFiles++;
          appBytes += st.size;
          if (relPath === 'index.html') hasIndexHtml = true;
        } else {
          problems.push(`app/${relPath}: symbolic links and special files are not allowed`);
        }
      }
    }

    if (!hasIndexHtml) {
      problems.push('app/index.html: missing required entry page');
    }
    if (appEntries > CAPS.app_max_files) {
      problems.push(`app/: ${appEntries} entries exceeds limit of ${CAPS.app_max_files}`);
    }
    if (appBytes > CAPS.app_max_bytes) {
      problems.push(`app/: ${appBytes} bytes exceeds limit of ${CAPS.app_max_bytes}`);
    }
  }

  let screenshots = 0;
  const shotsDir = join(root, 'screenshots');
  let shotsStat;
  try {
    shotsStat = lstatSync(shotsDir);
  } catch {
    problems.push('screenshots/: directory does not exist');
  }

  if (shotsStat && !shotsStat.isDirectory()) {
    problems.push('screenshots/: path is not a directory');
  } else if (shotsStat) {
    let entries;
    try {
      entries = readdirSync(shotsDir, { withFileTypes: true });
    } catch (err) {
      problems.push(`screenshots/: cannot be read (${(err as Error).message})`);
      entries = [];
    }
    const visible = entries
      .filter((e) => !e.name.startsWith('.'))
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

    for (const entry of visible) {
      let st;
      try {
        st = lstatSync(join(shotsDir, entry.name));
      } catch (err) {
        problems.push(`screenshots/${entry.name}: cannot stat (${(err as Error).message})`);
        continue;
      }
      if (!st.isFile()) {
        problems.push(`screenshots/${entry.name}: expected a regular file`);
        continue;
      }
      screenshots++;
      if (st.size > CAPS.screenshots.max_bytes) {
        problems.push(
          `FATAL: screenshots/${entry.name}: ${st.size} bytes exceeds limit of ${CAPS.screenshots.max_bytes}`,
        );
      }
    }

    if (screenshots < CAPS.screenshots.min || screenshots > CAPS.screenshots.max) {
      problems.push(
        `screenshots/: found ${screenshots} file(s); expected between ${CAPS.screenshots.min} and ${CAPS.screenshots.max}`,
      );
    }
  }

  return { problems, appFiles, appEntries, appBytes, screenshots };
}

const here = fileURLToPath(new URL('.', import.meta.url));
const checkOnly = process.argv.includes('--check');
const report = validateEntry(here);

if (checkOnly) {
  if (report.problems.length > 0) {
    for (const problem of report.problems) console.error(problem);
    process.exit(1);
  }
  console.log(
    `ok (${report.appFiles} app files, ${report.appBytes} bytes, ${report.screenshots} screenshots)`,
  );
  process.exit(0);
}

if (report.problems.length > 0) {
  console.error('preflight failed loudly; refusing to write output:');
  for (const problem of report.problems) console.error(`  - ${problem}`);
  process.exit(1);
}

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps: reference/gate.json
const dossier = buildDossier(out, {
  text_max_bytes: CAPS.text_max_bytes,
  screenshots: { max: CAPS.screenshots.max, max_bytes: CAPS.screenshots.max_bytes },
  app_max_files: CAPS.app_max_files,
  app_max_bytes: CAPS.app_max_bytes,
  app_path_max_bytes: CAPS.app_path_max_bytes,
});
writeFileSync(join(out, 'dossier.json'), dossier);

console.log(
  `wrote ${out}: ${report.appFiles} app files (${report.appBytes} bytes), ${report.screenshots} screenshots, dossier.json (${dossier.byteLength} bytes)`,
);
