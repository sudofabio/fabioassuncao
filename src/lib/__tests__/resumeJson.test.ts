import { describe, expect, it, vi } from 'vitest';

import { profileLinks } from '@/data/contact';
import profile from '@/data/profile.json';
import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';
import { sortPositions } from '@/lib/career';
import {
  buildJsonResume,
  RESUME_JSON_PATH,
  RESUME_JSON_URL,
  serializeJsonResume,
  toPlainText,
} from '@/lib/resumeJson';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/utils';

/** Root properties JSON Resume v1.0.0 allows; the schema forbids the rest. */
const ROOT_KEYS = [
  '$schema',
  'basics',
  'work',
  'volunteer',
  'education',
  'awards',
  'certificates',
  'publications',
  'skills',
  'languages',
  'interests',
  'references',
  'projects',
  'meta',
];

/** The schema's `iso8601` definition: YYYY, YYYY-MM, or YYYY-MM-DD. */
const ISO8601 =
  /^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$/;

const resume = buildJsonResume();

/**
 * Builds the document against substituted data modules. The published
 * résumé carries no education, courses, or anchored summaries yet, so those
 * mappings are exercised against fixtures instead of being left untested.
 */
async function buildWith(mocks: {
  degrees?: unknown[];
  courses?: unknown[];
  work?: unknown[];
}) {
  vi.resetModules();
  if (mocks.degrees) {
    vi.doMock('@/data/resume/degrees', () => ({ default: mocks.degrees }));
  }
  if (mocks.courses) {
    vi.doMock('@/data/resume/courses', () => ({ default: mocks.courses }));
  }
  if (mocks.work) {
    vi.doMock('@/data/resume/work', () => ({ default: mocks.work }));
  }
  try {
    const module = await import('@/lib/resumeJson');
    return module.buildJsonResume();
  } finally {
    vi.doUnmock('@/data/resume/degrees');
    vi.doUnmock('@/data/resume/courses');
    vi.doUnmock('@/data/resume/work');
    vi.resetModules();
  }
}

const FIXTURE_DEGREES = [
  {
    school: 'Stanford University',
    degree: 'M.S. Computational and Mathematical Engineering (ICME)',
    link: 'https://stanford.edu',
    year: 2016,
  },
  {
    school: 'University at Buffalo',
    degree: 'B.S. Electrical Engineering, Computer Engineering',
    link: 'https://buffalo.edu',
    year: 2012,
  },
];

const FIXTURE_COURSES = [
  {
    title: 'Convex Optimization',
    number: 'EE 364a',
    link: 'https://stanford.edu/class/ee364a/',
    university: 'Stanford University',
  },
  {
    title: 'Machine Learning',
    number: 'CS 229',
    link: 'https://cs229.stanford.edu/',
    university: 'Stanford University',
  },
];

describe('toPlainText', () => {
  it('keeps anchor text and drops the markup', () => {
    expect(
      toPlainText("see <a href='https://example.com'>the docs</a> now"),
    ).toBe('see the docs now');
  });

  it('unwraps markdown links, emphasis, and code', () => {
    expect(
      toPlainText('[docs](https://example.com) are **very** *good* `code`'),
    ).toBe('docs are very good code');
  });

  it('collapses the wrapping and indentation of template literals', () => {
    expect(toPlainText('one\n    two\n\n  three ')).toBe('one two three');
  });

  it('decodes HTML entities', () => {
    expect(toPlainText('Trust &amp; Safety &#38; more')).toBe(
      'Trust & Safety & more',
    );
  });

  it('preserves invalid numeric entities instead of throwing or emitting surrogates', () => {
    for (const entity of [
      '&#1114112;',
      '&#x110000;',
      '&#99999999;',
      '&#xD800;',
      '&#xDFFF;',
    ]) {
      expect(() => toPlainText(`before ${entity} after`)).not.toThrow();
      expect(toPlainText(`before ${entity} after`)).toBe(
        `before ${entity} after`,
      );
    }
  });

  it('decodes valid scalar values at each side of the surrogate range', () => {
    expect(toPlainText('&#xD7FF;&#xE000;&#x10FFFF;')).toBe(
      `${String.fromCodePoint(0xd7ff)}${String.fromCodePoint(
        0xe000,
      )}${String.fromCodePoint(0x10ffff)}`,
    );
  });

  it('leaves underscores alone so identifiers survive', () => {
    expect(toPlainText('the snake_case_name field')).toBe(
      'the snake_case_name field',
    );
  });

  it('preserves angle-bracket comparisons that are not HTML tags', () => {
    expect(
      toPlainText(
        'latency < 50ms and throughput > 1k with Map<string, number>',
      ),
    ).toBe('latency < 50ms and throughput > 1k with Map<string, number>');
  });
});

describe('json resume document', () => {
  it('declares the schema it conforms to and adds no keys of its own', () => {
    expect(resume.$schema).toBe(
      'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    );
    for (const key of Object.keys(resume)) {
      expect(ROOT_KEYS).toContain(key);
    }
  });

  it('builds basics from the shared profile facts', () => {
    expect(resume.basics).toMatchObject({
      name: AUTHOR_NAME,
      label: profile.role,
      email: profile.email,
      image: `${SITE_URL}/images/me.jpg`,
      url: `${SITE_URL}/`,
      summary: SITE_DESCRIPTION,
    });
  });

  // The profile states a country, not a city, so nothing is invented.
  it('states the country as an ISO code and no city', () => {
    expect(resume.basics.location).toEqual({
      countryCode: profile.countryCode,
    });
    expect(resume.basics.location).toEqual({ countryCode: 'BR' });
  });

  it('lists every public profile, and no conversation channel, with its handle', () => {
    expect(resume.basics.profiles).toHaveLength(profileLinks.length);
    expect(resume.basics.profiles).toContainEqual({
      network: 'GitHub',
      username: 'fabioassuncao',
      url: 'https://github.com/fabioassuncao',
    });
    expect(resume.basics.profiles).toContainEqual({
      network: 'LinkedIn',
      username: 'fabioassuncao',
      url: 'https://www.linkedin.com/in/fabioassuncao',
    });
    const networks = resume.basics.profiles.map((entry) => entry.network);
    expect(networks).not.toContain('WhatsApp');
    expect(networks).not.toContain('E-mail');
    expect(
      resume.basics.profiles.every((entry) => entry.username.length > 0),
    ).toBe(true);
  });

  it('carries every position in résumé order', () => {
    expect(resume.work.map((position) => position.position)).toEqual(
      sortPositions(work).map((position) => position.position),
    );
  });

  // Employers are not published until confirmed, and the document must not
  // carry empty name/url keys in their place.
  it('omits name and url for a role with no published employer', () => {
    for (const [index, position] of sortPositions(work).entries()) {
      if (position.name === undefined) {
        expect(resume.work[index]).not.toHaveProperty('name');
      }
      if (position.url === undefined) {
        expect(resume.work[index]).not.toHaveProperty('url');
      }
    }
  });

  // A year-only record must not gain a month on its way into the document.
  it('publishes year-only dates as YYYY', () => {
    for (const [index, position] of sortPositions(work).entries()) {
      if (position.datePrecision !== 'year') continue;
      expect(resume.work[index].startDate).toBe(position.startDate.slice(0, 4));
      if (position.endDate) {
        expect(resume.work[index].endDate).toBe(position.endDate.slice(0, 4));
      }
    }
  });

  it('omits endDate for the current role rather than inventing one', () => {
    expect(resume.work[0]).not.toHaveProperty('endDate');
    expect(resume.work[0]).toMatchObject({
      name: 'Codions',
      startDate: '2023',
    });
    expect(resume.work[1]).toMatchObject({
      name: 'Iede (Portal QEdu)',
      startDate: '2024',
      endDate: '2025',
    });
  });

  it('keeps day precision and employer fields for a fully dated role', async () => {
    const built = await buildWith({
      work: [
        {
          name: 'Acme',
          position: 'Engineer',
          url: 'https://acme.example',
          startDate: '2020-03-15',
          endDate: '2023-06-30',
        },
      ],
    });

    expect(built.work).toEqual([
      {
        name: 'Acme',
        position: 'Engineer',
        url: 'https://acme.example',
        startDate: '2020-03-15',
        endDate: '2023-06-30',
      },
    ]);
  });

  it('reduces summaries carrying inline anchors to plain text', async () => {
    const built = await buildWith({
      work: [
        {
          position: 'Engineer',
          startDate: '2020-01-01',
          summary: `Building <a href='https://example.com'>the platform</a>
    at scale, with **care**.`,
          highlights: ['Shipped [the API](https://example.com/api).'],
        },
      ],
    });

    expect(built.work[0].summary).toBe(
      'Building the platform at scale, with care.',
    );
    expect(built.work[0].highlights).toEqual(['Shipped the API.']);
  });

  it('leaves no markup or uncollapsed whitespace anywhere in the prose', () => {
    const prose = resume.work.flatMap((position) => [
      position.summary ?? '',
      ...(position.highlights ?? []),
    ]);

    expect(prose.length).toBeGreaterThan(0);
    for (const text of prose) {
      expect(text).not.toMatch(/[<>]/);
      expect(text).not.toMatch(/\[[^\]]+\]\([^)]*\)/);
      expect(text).not.toMatch(/\s{2,}|[\n\r\t]/);
    }
  });

  it('uses schema-valid dates throughout', () => {
    for (const position of resume.work) {
      expect(position.startDate).toMatch(ISO8601);
      if (position.endDate) expect(position.endDate).toMatch(ISO8601);
    }
    for (const entry of resume.education) {
      if (entry.endDate !== undefined) expect(entry.endDate).toMatch(ISO8601);
    }
  });

  it('carries exactly the published education', () => {
    expect(resume.education).toHaveLength(degrees.length);
  });

  it('leaves out the education fields the data does not state', () => {
    expect(resume.education).toEqual([
      {
        institution: 'Faculdade Pitágoras',
        area: 'Bacharelado em Ciência da Computação',
      },
    ]);
    for (const entry of resume.education) {
      expect(entry).not.toHaveProperty('url');
      expect(entry).not.toHaveProperty('endDate');
    }
  });

  it('omits the institution too when a degree names no school', async () => {
    const built = await buildWith({
      degrees: [{ degree: 'Bacharelado em Ciência da Computação' }],
      courses: [],
    });

    expect(built.education).toEqual([
      { area: 'Bacharelado em Ciência da Computação' },
    ]);
  });

  it('splits the degree string into studyType and area', async () => {
    const education = (
      await buildWith({ degrees: FIXTURE_DEGREES, courses: FIXTURE_COURSES })
    ).education;

    expect(education[0]).toMatchObject({
      institution: 'Stanford University',
      url: 'https://stanford.edu',
      studyType: 'M.S.',
      area: 'Computational and Mathematical Engineering (ICME)',
      endDate: '2016',
    });
    expect(education[1]).toMatchObject({
      institution: 'University at Buffalo',
      studyType: 'B.S.',
      area: 'Electrical Engineering, Computer Engineering',
      endDate: '2012',
    });
  });

  it('files coursework under the school it was taken at', async () => {
    const education = (
      await buildWith({ degrees: FIXTURE_DEGREES, courses: FIXTURE_COURSES })
    ).education;

    expect(education[0].courses).toHaveLength(FIXTURE_COURSES.length);
    expect(education[0].courses).toContain('EE 364a - Convex Optimization');
    // Every fixture course is a Stanford course, so Buffalo carries none
    // rather than an empty array.
    expect(education[1]).not.toHaveProperty('courses');
  });

  it('files each course under exactly one degree', async () => {
    // Cardinality across the whole document, not per entry: attaching courses
    // by substring containment published all 13 Stanford courses under every
    // degree whose school name merely contained "Stanford", and the per-entry
    // assertions above never looked at the extra entry. A second school with a
    // superstring name is the case the current data cannot express.
    expect(
      resume.education.flatMap((entry) => entry.courses ?? []),
    ).toHaveLength(courses.length);

    const education = (
      await buildWith({
        degrees: [
          ...FIXTURE_DEGREES,
          {
            school: 'Stanford University Graduate School of Business',
            degree: 'M.B.A.',
            link: 'https://gsb.stanford.edu',
            year: 2018,
          },
        ],
        courses: FIXTURE_COURSES,
      })
    ).education;

    expect(education).toHaveLength(FIXTURE_DEGREES.length + 1);
    expect(education.flatMap((entry) => entry.courses ?? [])).toHaveLength(
      FIXTURE_COURSES.length,
    );
    expect(education.at(-1)).not.toHaveProperty('courses');
  });

  it('groups skills by category with keywords ordered by competency', () => {
    expect(resume.skills.map((skill) => skill.name)).toEqual(
      categories.map((category) => category.name),
    );

    for (const group of resume.skills) {
      const expected = skills
        .filter((skill) => skill.category.includes(group.name))
        .map((skill) => skill.title);

      expect(group.keywords).toHaveLength(expected.length);
      expect([...group.keywords].sort()).toEqual([...expected].sort());

      const competencies = group.keywords.map(
        (keyword) =>
          skills.find((skill) => skill.title === keyword)?.competency ?? 0,
      );
      expect(competencies).toEqual([...competencies].sort((a, b) => b - a));
    }
  });

  it('keeps the canonical file-like without inventing a modification date', () => {
    expect(RESUME_JSON_PATH).toBe('/resume.json');
    expect(RESUME_JSON_URL).toBe(`${SITE_URL}/resume.json`);
    expect(resume.meta.canonical).toBe(RESUME_JSON_URL);
    expect(resume.meta.canonical).not.toMatch(/resume\.json\/$/);
    // Work dates describe employment, not edits to profile, education, skills,
    // prose, or this generator. JSON Resume makes lastModified optional.
    expect(resume.meta).not.toHaveProperty('lastModified');
    expect(serializeJsonResume()).not.toContain('lastModified');
  });

  it('serializes to stable, pretty-printed bytes', () => {
    const serialized = serializeJsonResume();

    expect(serialized).toBe(serializeJsonResume());
    expect(serialized.endsWith('\n')).toBe(true);
    expect(serialized).toContain('\n  "basics": {');
    expect(JSON.parse(serialized)).toEqual(resume);
  });
});
