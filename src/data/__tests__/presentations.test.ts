import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getPostSlugs } from '@/lib/posts';

import presentations, {
  presentationPath,
  sortedPresentations,
} from '../presentations';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Projected as a QR code on the closing slide of the talk, so this exact path
 * can never change.
 */
const TALK_SLUG =
  'alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor';

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

describe('presentations data', () => {
  it('keeps the URL printed on the talk slides', () => {
    const talk = presentations.find((entry) => entry.slug === TALK_SLUG);

    expect(talk).toBeDefined();
    expect(talk && presentationPath(talk)).toBe(`/presentations/${TALK_SLUG}/`);
    expect(talk?.date).toBe('2026-07-10');
  });

  it('uses unique, URL-safe slugs', () => {
    const slugs = presentations.map((talk) => talk.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(SLUG);
    }
  });

  it('dates every talk with a real calendar date', () => {
    for (const talk of presentations) {
      expect(isValidIsoDate(talk.date), talk.slug).toBe(true);
    }
  });

  it('has non-empty copy for lists and the talk page', () => {
    for (const talk of presentations) {
      for (const value of [
        talk.title,
        talk.event,
        talk.venue,
        talk.city,
        talk.description,
      ]) {
        expect(value.trim().length, talk.slug).toBeGreaterThan(0);
      }
      expect(talk.summary.length, talk.slug).toBeGreaterThan(0);
    }
  });

  it('points slide PDFs at committed files under public/', () => {
    for (const talk of presentations) {
      if (talk.slidesPdf === undefined) continue;

      expect(talk.slidesPdf).toMatch(/^\/[^/].*\.pdf$/);
      expect(
        existsSync(join(process.cwd(), 'public', talk.slidesPdf)),
        talk.slidesPdf,
      ).toBe(true);
    }
  });

  it('links summaries only to published posts', () => {
    const published = new Set(getPostSlugs());

    for (const talk of presentations) {
      if (talk.postSlug === undefined) continue;
      expect(published.has(talk.postSlug), talk.postSlug).toBe(true);
    }
  });

  it('sorts newest first without mutating the source list', () => {
    const before = presentations.map((talk) => talk.slug);
    const sorted = sortedPresentations();

    for (let index = 1; index < sorted.length; index += 1) {
      expect(
        sorted[index - 1].date.localeCompare(sorted[index].date),
      ).toBeGreaterThanOrEqual(0);
    }
    expect(presentations.map((talk) => talk.slug)).toEqual(before);
  });
});
