import { describe, expect, it } from 'vitest';

import degrees from '../resume/degrees';

describe('degrees data', () => {
  it('exports an array of degrees', () => {
    expect(Array.isArray(degrees)).toBe(true);
  });

  it('lists the computer science bachelor degree', () => {
    expect(degrees.map((degree) => degree.degree)).toContain(
      'Bacharelado em Ciência da Computação',
    );
  });

  it('each degree has a name and only well-typed optional fields', () => {
    for (const degree of degrees) {
      expect(typeof degree.degree).toBe('string');
      if (degree.school !== undefined) {
        expect(typeof degree.school).toBe('string');
        expect(degree.school.trim().length).toBeGreaterThan(0);
      }
      if (degree.link !== undefined) expect(typeof degree.link).toBe('string');
      if (degree.year !== undefined) expect(typeof degree.year).toBe('number');
    }
  });

  it('never carries a link without the school it points to', () => {
    for (const degree of degrees) {
      if (degree.link !== undefined) expect(degree.school).toBeDefined();
    }
  });

  it('degree years, when stated, are reasonable (1950 to current year + 10)', () => {
    const currentYear = new Date().getFullYear();

    for (const degree of degrees) {
      if (degree.year === undefined) continue;
      expect(degree.year).toBeGreaterThanOrEqual(1950);
      expect(degree.year).toBeLessThanOrEqual(currentYear + 10);
    }
  });

  it('links, when stated, are valid https URLs', () => {
    for (const degree of degrees) {
      if (degree.link === undefined) continue;
      expect(degree.link).toMatch(/^https:\/\/.+/);
    }
  });

  it('dated degrees are ordered by year (most recent first)', () => {
    const years = degrees
      .map((degree) => degree.year)
      .filter((year): year is number => year !== undefined);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it('has unique school entries', () => {
    const schools = degrees
      .map((d) => d.school)
      .filter((school) => school !== undefined);
    expect(new Set(schools).size).toBe(schools.length);
  });

  it('each degree has a non-empty degree name', () => {
    for (const degree of degrees) {
      expect(degree.degree.trim().length).toBeGreaterThan(0);
    }
  });
});
