import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  BASE_POLICY,
  buildCsp,
  enabledTrackerKinds,
  rewriteCspHeader,
  TRACKER_ORIGINS,
} from '../lib/csp.mjs';

const HEADERS = readFileSync(join(process.cwd(), 'public/_headers'), 'utf8');

function committedPolicy(): string {
  const line = HEADERS.split('\n').find((candidate) =>
    candidate.trim().startsWith('Content-Security-Policy:'),
  );
  return line?.split('Content-Security-Policy:')[1]?.trim() ?? '';
}

function directive(policy: string, name: string): string[] {
  const part = policy
    .split(';')
    .map((piece) => piece.trim())
    .find((piece) => piece.startsWith(`${name} `));
  return part?.split(/\s+/).slice(1) ?? [];
}

const KINDS = ['ga4', 'meta', 'linkedin', 'tiktok'] as const;

describe('buildCsp', () => {
  it('without trackers is exactly the base policy committed in public/_headers', () => {
    expect(buildCsp([])).toBe(committedPolicy());
  });

  it.each(KINDS)('adds only the %s origins', (kind) => {
    const base = buildCsp([]);
    const policy = buildCsp([kind]);
    const origins = TRACKER_ORIGINS[kind] as Record<string, string[]>;

    for (const name of Object.keys(BASE_POLICY)) {
      const added = directive(policy, name).filter(
        (source) => !directive(base, name).includes(source),
      );
      expect(added, `${kind} ${name}`).toEqual(origins[name] ?? []);
    }
  });

  it('never widens the directives that must stay locked', () => {
    const policy = buildCsp([...KINDS]);
    for (const name of [
      'default-src',
      'object-src',
      'base-uri',
      'form-action',
      'frame-ancestors',
    ]) {
      expect(directive(policy, name)).toEqual(directive(buildCsp([]), name));
    }
    expect(policy).toMatch(/upgrade-insecure-requests$/);
  });

  it('keeps every source unique when trackers share hosts', () => {
    const sources = directive(buildCsp([...KINDS]), 'connect-src');
    expect(new Set(sources).size).toBe(sources.length);
  });

  it('rejects an unknown tracker', () => {
    expect(() => buildCsp(['hotjar'])).toThrow(/unknown tracker/);
  });
});

describe('enabledTrackerKinds', () => {
  it('reads the same env names as the browser code and validates them', () => {
    expect(
      enabledTrackerKinds({
        NEXT_PUBLIC_GA_TRACKING_ID: 'G-ABC123',
        NEXT_PUBLIC_META_PIXEL_ID: 'not-an-id',
        NEXT_PUBLIC_TIKTOK_PIXEL_ID: 'C4ABCDEFGHIJKLMNOPQR',
      } as unknown as NodeJS.ProcessEnv),
    ).toEqual(['ga4', 'tiktok']);
    expect(enabledTrackerKinds({} as unknown as NodeJS.ProcessEnv)).toEqual([]);
  });
});

describe('rewriteCspHeader', () => {
  it('replaces the policy line and keeps the rest of the file', () => {
    const rewritten = rewriteCspHeader(HEADERS, 'default-src https:');
    expect(rewritten).toContain(
      '  Content-Security-Policy: default-src https:',
    );
    expect(rewritten).toContain('Strict-Transport-Security');
    expect(rewritten.split('\n')).toHaveLength(HEADERS.split('\n').length);
  });

  it('fails without exactly one policy line', () => {
    expect(() =>
      rewriteCspHeader('/*\n  X-Frame-Options: DENY\n', 'x'),
    ).toThrow(/exactly one/);
    expect(() =>
      rewriteCspHeader(
        '/*\n  Content-Security-Policy: a\n  Content-Security-Policy: b\n',
        'x',
      ),
    ).toThrow(/found 2/);
  });
});
