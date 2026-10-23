import { describe, expect, it } from 'vitest';

import { sortPositions, timelineKey } from '@/lib/career';
import work from '../resume/work';

/** Exactly `YYYY-MM-DD`, which is what makes a string comparison chronological. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('work data', () => {
  it('exports an array of positions', () => {
    expect(Array.isArray(work)).toBe(true);
    expect(work.length).toBeGreaterThan(0);
  });

  it('each position has required properties', () => {
    for (const job of work) {
      expect(job).toHaveProperty('position');
      expect(job).toHaveProperty('startDate');

      expect(typeof job.position).toBe('string');
      expect(job.position.trim().length).toBeGreaterThan(0);
      expect(typeof job.startDate).toBe('string');
    }
  });

  // The employer is optional until it is confirmed for publication, but a
  // link must always have a name to hang on.
  it('never publishes a company link without a company name', () => {
    for (const job of work) {
      if (job.url !== undefined) {
        expect(typeof job.name).toBe('string');
      }
    }
  });

  // The months come from LinkedIn and are kept, but are not confirmed for
  // publication: every entry stays year-only until they are, and a month
  // record is always the first of its month.
  it('keeps every unconfirmed month behind year precision', () => {
    for (const job of work) {
      expect(job.datePrecision, job.position).toBe('year');
      expect(job.startDate.slice(8)).toBe('01');
      if (job.endDate) expect(job.endDate.slice(8)).toBe('01');
    }
  });

  it('starts the career in 2008 and names the employers of the record', () => {
    const years = work.map((job) => job.startDate.slice(0, 4)).sort();
    expect(years[0]).toBe('2008');

    const names = work.map((job) => job.name).filter(Boolean);
    for (const employer of [
      'Codions',
      'Iede (Portal QEdu)',
      'Zenvia',
      'MPRJ (terceirizado)',
      'VAT Tecnologia',
      'Light Tecnologia',
    ]) {
      expect(names).toContain(employer);
    }
  });

  it('links only the Codions, over https', () => {
    const urls = work.flatMap((job) => (job.url ? [job.url] : []));
    expect(new Set(urls)).toEqual(new Set(['https://codions.com']));
  });

  it('endDate is after startDate when present', () => {
    for (const job of work) {
      if (job.endDate) {
        const start = new Date(job.startDate);
        const end = new Date(job.endDate);
        expect(end.getTime()).toBeGreaterThan(start.getTime());
      }
    }
  });

  it('urls are valid', () => {
    const urlRegex = /^https?:\/\/.+/;

    for (const job of work) {
      if (job.url !== undefined) expect(job.url).toMatch(urlRegex);
    }
  });

  // Resume should show at least one current/active position
  it('has at least one current position (no endDate)', () => {
    const currentJobs = work.filter((job) => !job.endDate);
    expect(currentJobs.length).toBeGreaterThanOrEqual(1);
  });

  it('highlights are arrays when present', () => {
    for (const job of work) {
      if (job.highlights) {
        expect(Array.isArray(job.highlights)).toBe(true);
        expect(job.highlights.length).toBeGreaterThan(0);
      }
    }
  });

  it('uses the supported commitment value when present', () => {
    for (const job of work) {
      if (job.commitment) {
        expect(job.commitment).toBe('part-time');
      }
    }
  });

  it('has positions from different years', () => {
    const years = work.map((job) => new Date(job.startDate).getFullYear());
    const uniqueYears = new Set(years);

    // Resume should contain work from multiple years
    expect(uniqueYears.size).toBeGreaterThan(1);
  });

  it('company names are non-empty when present', () => {
    for (const job of work) {
      if (job.name !== undefined) {
        expect(job.name.trim().length).toBeGreaterThan(0);
      }
    }
  });

  // A date written any other way (`2014/01`, `Jan 2014`) would still parse but
  // would sort wrongly and silently.
  it('dates are plain ISO calendar dates', () => {
    for (const job of work) {
      for (const date of [job.startDate, job.endDate].filter(
        (date) => date !== undefined,
      )) {
        expect(date).toMatch(ISO_DATE);
        const parsed = new Date(`${date}T00:00:00.000Z`);
        expect(Number.isNaN(parsed.valueOf())).toBe(false);
        expect(parsed.toISOString().slice(0, 10)).toBe(date);
      }
    }
  });

  /** Source order is not load-bearing — `Experience` sorts before mapping. */
  it('sorts into a strictly reverse-chronological timeline', () => {
    const ordered = sortPositions(work);

    expect(ordered).toHaveLength(work.length);

    for (let i = 1; i < ordered.length; i += 1) {
      const previous = ordered[i - 1];
      const current = ordered[i];

      expect(
        timelineKey(current).localeCompare(timelineKey(previous)),
      ).toBeLessThanOrEqual(0);

      if (timelineKey(current) === timelineKey(previous)) {
        expect(
          current.startDate.localeCompare(previous.startDate),
        ).toBeLessThanOrEqual(0);
      }
    }
  });
});
