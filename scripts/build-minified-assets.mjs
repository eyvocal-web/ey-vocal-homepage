import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const tempDir = mkdtempSync(path.join(tmpdir(), 'eyvocal-minify-'));
const tempCssPath = path.join(tempDir, 'app.css');
const cssOutputPath = path.join(rootDir, 'css', 'app.min.css');
const jsOutputPath = path.join(rootDir, 'js', 'app.min.js');

const cssSources = [
  'css/reset.css',
  'css/variables.css',
  'css/global.css',
  'css/sections.css'
];

try {
  const cssBundle = cssSources
    .map((source) => readFileSync(path.join(rootDir, source), 'utf8'))
    .join('\n');

  writeFileSync(tempCssPath, cssBundle, 'utf8');
  mkdirSync(path.dirname(cssOutputPath), { recursive: true });
  mkdirSync(path.dirname(jsOutputPath), { recursive: true });

  execFileSync(
    'npx',
    ['esbuild', tempCssPath, '--minify', `--outfile=${cssOutputPath}`],
    { cwd: rootDir, stdio: 'inherit' }
  );

  execFileSync(
    'npx',
    ['esbuild', 'js/main.js', '--minify', `--outfile=${jsOutputPath}`],
    { cwd: rootDir, stdio: 'inherit' }
  );
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
