#!/usr/bin/env node
/**
 * Dependency report for the library root and the Expo example app.
 *
 * For every dependency in `package.json` and `example/package.json` prints the
 * declared specifier, the installed version, the latest npm version and the
 * version recommended by the target Expo SDK (`expo/bundledNativeModules.json`).
 *
 * Usage:
 *   node .skills/update-dependencies/scripts/deps-report.mjs [--sdk <major>] [--json]
 *
 *   --sdk <major>  target Expo SDK (default: the `latest` dist-tag of `expo`)
 *   --json         machine-readable output
 */
import { execFile } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..'
);
const WORKSPACES = { root: ROOT, example: path.join(ROOT, 'example') };

// Must have identical specifiers in root and example (one copy in node_modules).
const SHARED = [
  'react',
  'react-native',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-worklets',
];

const args = process.argv.slice(2);
const sdkArg = args.includes('--sdk') ? args[args.indexOf('--sdk') + 1] : null;
const asJson = args.includes('--json');

let semver = null;
try {
  semver = createRequire(path.join(ROOT, 'package.json'))('semver');
} catch {
  // semver is a transitive dependency; without it range checks fall back to string equality
}

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

// Single-field `npm view --json` may print a value or an array of values
// (one per matching version, ascending) depending on the npm version.
async function npmView(spec, field) {
  try {
    const { stdout } = await run('npm', ['view', spec, field, '--json']);
    const value = stdout.trim() ? JSON.parse(stdout) : null;
    return Array.isArray(value) ? (value.at(-1) ?? null) : value;
  } catch {
    return null;
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    })
  );
  return out;
}

async function resolveExpoVersion() {
  if (!sdkArg) return npmView('expo', 'dist-tags.latest');
  return npmView(`expo@^${sdkArg}.0.0`, 'version');
}

async function loadBundledModules(expoVersion) {
  const dir = await mkdtemp(path.join(tmpdir(), 'expo-sdk-'));
  try {
    const { stdout } = await run('npm', [
      'pack',
      `expo@${expoVersion}`,
      '--pack-destination',
      dir,
      '--silent',
    ]);
    const tarball = path.join(dir, stdout.trim().split('\n').at(-1));
    await run('tar', [
      '-xzf',
      tarball,
      '-C',
      dir,
      'package/bundledNativeModules.json',
    ]);
    return JSON.parse(
      await readFile(
        path.join(dir, 'package/bundledNativeModules.json'),
        'utf8'
      )
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function installedVersion(name, workspaceDir) {
  for (const base of [workspaceDir, ROOT]) {
    const file = path.join(base, 'node_modules', name, 'package.json');
    if (existsSync(file)) return readJson(file).version;
  }
  return null;
}

// 0.x packages break on minor bumps (0.86 -> 0.88), others on major bumps.
function isBreaking(from, to) {
  if (!from || !to) return false;
  const [a1, a2] = from.split('.').map(Number);
  const [b1, b2] = to.split('.').map(Number);
  return a1 === 0 && b1 === 0 ? b2 > a2 : b1 > a1;
}

function matchesExpo(spec, installed, expoRange) {
  if (spec === expoRange) return true;
  if (!semver || !installed) return false;
  return semver.satisfies(installed, expoRange);
}

const expoVersion = await resolveExpoVersion();
const bundled = expoVersion ? await loadBundledModules(expoVersion) : {};

const rows = [];
for (const [workspace, dir] of Object.entries(WORKSPACES)) {
  const pkg = readJson(path.join(dir, 'package.json'));
  for (const section of ['dependencies', 'devDependencies']) {
    for (const [name, spec] of Object.entries(pkg[section] ?? {})) {
      rows.push({
        workspace,
        section,
        name,
        spec,
        installed: installedVersion(name, dir),
      });
    }
  }
}

const names = [...new Set(rows.map((r) => r.name))];
const latest = Object.fromEntries(
  await mapLimit(names, 8, async (name) => [
    name,
    await npmView(name, 'version'),
  ])
);

const specs = (name) =>
  Object.fromEntries(
    rows.filter((r) => r.name === name).map((r) => [r.workspace, r.spec])
  );

for (const row of rows) {
  row.latest = latest[row.name];
  row.expo = bundled[row.name] ?? null;
  const notes = [];
  if (isBreaking(row.installed, row.latest)) notes.push('MAJOR');
  if (row.expo && !matchesExpo(row.spec, row.installed, row.expo))
    notes.push('!expo');
  if (SHARED.includes(row.name)) {
    const { root, example } = specs(row.name);
    if (root !== example) notes.push('root!=example');
  }
  row.notes = notes;
}

const nvmrc = existsSync(path.join(ROOT, '.nvmrc'))
  ? readFileSync(path.join(ROOT, '.nvmrc'), 'utf8').trim()
  : null;
const engines = {
  'expo': expoVersion
    ? await npmView(`expo@${expoVersion}`, 'engines.node')
    : null,
  'react-native': bundled['react-native']
    ? await npmView(`react-native@${bundled['react-native']}`, 'engines.node')
    : null,
};

if (asJson) {
  console.log(JSON.stringify({ expoVersion, nvmrc, engines, rows }, null, 2));
} else {
  console.log(`Target Expo SDK: expo@${expoVersion ?? '?'}`);
  console.log(`.nvmrc: ${nvmrc ?? '-'}`);
  for (const [name, range] of Object.entries(engines)) {
    console.log(`engines.node ${name}: ${range ?? '?'}`);
  }
  console.log('');

  const header = [
    'ws',
    'sec',
    'package',
    'spec',
    'installed',
    'latest',
    'expo',
    'notes',
  ];
  const table = rows.map((r) => [
    r.workspace,
    r.section === 'dependencies' ? 'dep' : 'dev',
    r.name,
    r.spec,
    r.installed ?? '-',
    r.latest ?? '?',
    r.expo ?? '',
    r.notes.join(' '),
  ]);
  const widths = header.map((h, i) =>
    Math.max(h.length, ...table.map((t) => t[i].length))
  );
  for (const line of [header, ...table]) {
    console.log(
      line
        .map((cell, i) => cell.padEnd(widths[i]))
        .join('  ')
        .trimEnd()
    );
  }
  console.log('');
  console.log(
    'MAJOR          breaking update available (major, or minor for 0.x)'
  );
  console.log(
    '!expo          does not match the target Expo SDK recommendation'
  );
  console.log(
    'root!=example  shared package has different specifiers in root and example'
  );
}
