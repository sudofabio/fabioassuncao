import { describe, expect, it } from 'vitest';

import courses from '../resume/courses';
import degrees from '../resume/degrees';

describe('courses data', () => {
  // Empty until coursework is supplied; the résumé then omits the section.
  it('exports an array of courses', () => {
    expect(Array.isArray(courses)).toBe(true);
  });

  // resumeJson.ts joins coursework to a degree by exact school name, so a
  // course naming no listed school would silently vanish from /resume.json.
  it('files every course under a listed school', () => {
    const schools = new Set(degrees.map((degree) => degree.school));
    for (const course of courses) {
      expect(schools.has(course.university), course.title).toBe(true);
    }
  });

  it('each course has required properties', () => {
    for (const course of courses) {
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('number');
      expect(course).toHaveProperty('link');
      expect(course).toHaveProperty('university');

      expect(typeof course.title).toBe('string');
      expect(typeof course.number).toBe('string');
      expect(typeof course.link).toBe('string');
      expect(typeof course.university).toBe('string');
    }
  });

  it('course numbers are non-empty', () => {
    for (const course of courses) {
      expect(course.number.trim().length).toBeGreaterThan(0);
    }
  });

  it('course titles are non-empty', () => {
    for (const course of courses) {
      expect(course.title.trim().length).toBeGreaterThan(0);
    }
  });

  it('links are valid URLs', () => {
    const urlRegex = /^https?:\/\/.+/;

    for (const course of courses) {
      expect(course.link).toMatch(urlRegex);
    }
  });

  it('has unique course titles', () => {
    const titles = courses.map((c) => c.title);
    const uniqueTitles = new Set(titles);

    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('has unique course numbers', () => {
    const numbers = courses.map((c) => c.number);
    const uniqueNumbers = new Set(numbers);

    expect(uniqueNumbers.size).toBe(numbers.length);
  });

  it('all courses have valid university names', () => {
    for (const course of courses) {
      expect(course.university.trim().length).toBeGreaterThan(0);
    }
  });
});
