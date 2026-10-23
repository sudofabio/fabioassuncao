import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildCsp } from '../lib/csp.mjs';

const finalizer = resolve(process.cwd(), 'scripts/finalize-export.mjs');
const HEADERS = readFileSync(resolve(process.cwd(), 'public/_headers'), 'utf8');
const TRACKER_ENV_NAMES = [
  'NEXT_PUBLIC_GA_TRACKING_ID',
  'NEXT_PUBLIC_META_PIXEL_ID',
  'NEXT_PUBLIC_LINKEDIN_PARTNER_ID',
  'NEXT_PUBLIC_TIKTOK_PIXEL_ID',
];
const roots: string[] = [];

function write(root: string, path: string, contents: string) {
  const destination = join(root, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, contents);
}

/** An export with no route handlers, so the run never needs Vite. */
function createFixture({
  headers = HEADERS,
}: {
  headers?: string | null;
} = {}) {
  const root = mkdtempSync(join(tmpdir(), 'finalize-export-'));
  roots.push(root);
  mkdirSync(join(root, 'app'), { recursive: true });
  write(root, 'dist/client/index.html', '<!doctype html>');
  if (headers !== null) write(root, 'dist/client/_headers', headers);
  return root;
}

function run(root: string, env: Record<string, string> = {}) {
  const base = { ...process.env };
  for (const name of TRACKER_ENV_NAMES) delete base[name];
  const result = spawnSync(process.execPath, [finalizer], {
    cwd: root,
    encoding: 'utf8',
    env: { ...base, ...env },
  });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

function policyIn(root: string): string {
  const headers = readFileSync(join(root, 'dist/client/_headers'), 'utf8');
  const line = headers
    .split('\n')
    .find((candidate) => candidate.includes('Content-Security-Policy:'));
  return line?.split('Content-Security-Policy:')[1]?.trim() ?? '';
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('finalize-export CSP', () => {
  it('keeps the base policy when no tracker is enabled', () => {
    const root = createFixture();
    const { status, output } = run(root);

    expect(status).toBe(0);
    expect(output).toContain('CSP trackers: none');
    expect(policyIn(root)).toBe(buildCsp([]));
  });

  it('opens the policy only for the trackers whose IDs are set', () => {
    const root = createFixture();
    const { status, output } = run(root, {
      NEXT_PUBLIC_META_PIXEL_ID: '123456789012345',
      NEXT_PUBLIC_GA_TRACKING_ID: 'not-valid',
    });

    expect(status).toBe(0);
    expect(output).toContain('CSP trackers: meta');
    expect(policyIn(root)).toBe(buildCsp(['meta']));
    expect(policyIn(root)).not.toContain('googletagmanager');
  });

  it('fails closed without a _headers file', () => {
    const root = createFixture({ headers: null });
    const { status, output } = run(root);

    expect(status).toBe(1);
    expect(output).toContain('_headers not found');
  });

  it('fails closed when _headers has no policy line', () => {
    const root = createFixture({ headers: '/*\n  X-Frame-Options: DENY\n' });
    const { status, output } = run(root);

    expect(status).toBe(1);
    expect(output).toMatch(/exactly one Content-Security-Policy/);
  });

  it('still renames metadata route artifacts', () => {
    const root = createFixture();
    write(root, 'dist/client/sitemap.xml.route', '<urlset/>');

    expect(run(root).status).toBe(0);
    expect(existsSync(join(root, 'dist/client/sitemap.xml'))).toBe(true);
    expect(existsSync(join(root, 'dist/client/sitemap.xml.route'))).toBe(false);
  });
});
