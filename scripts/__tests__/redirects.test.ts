import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Cloudflare Pages rules: `source destination status`, comments ignored. */
const rules = readFileSync(join(process.cwd(), 'public/_redirects'), 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split(/\s+/));

describe('public/_redirects', () => {
  it('sends the old contact page and the bio link page to the chat', () => {
    expect(rules).toEqual([
      ['/contact', '/contato/', '301'],
      ['/contact/', '/contato/', '301'],
      ['/links', '/contato/', '301'],
      ['/links/', '/contato/', '301'],
    ]);
  });

  it('only redirects inside this site', () => {
    for (const [, destination] of rules) {
      expect(destination.startsWith('/')).toBe(true);
      expect(destination).not.toMatch(/^\/\//);
    }
  });
});
