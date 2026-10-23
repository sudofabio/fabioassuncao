import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import projects, {
  archive,
  type Project,
  pendingProducts,
  shipped,
} from '../projects';
import work, { type Position } from '../resume/work';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Complete register order: live first, then activity date, then title. */
function compareActivity(a: Project, b: Project): number {
  const liveOrder = Number(Boolean(b.ongoing)) - Number(Boolean(a.ongoing));
  if (liveOrder !== 0) return liveOrder;

  const dateOrder =
    Date.parse(b.endDate ?? b.date) - Date.parse(a.endDate ?? a.date);
  return dateOrder || a.title.localeCompare(b.title);
}

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function numericClaims(value: string): string[] {
  return (value.match(/\d[\d,]*(?:\.\d+)?(?:[KMB]\+?|%|-[A-Z])?\+?/gi) ?? [])
    .map((claim) => claim.replaceAll(',', '').replace(/\+$/, '').toUpperCase())
    .filter(Boolean);
}

describe('projects data', () => {
  it('exports an array of projects', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it('each project has required properties', () => {
    for (const project of projects) {
      expect(typeof project.title).toBe('string');
      expect(typeof project.date).toBe('string');
      expect(typeof project.desc).toBe('string');
      expect(['shipped', 'archive']).toContain(project.status);

      // Optional, but a declared backing role must name one.
      if (project.sourceWork !== undefined) {
        expect(project.sourceWork.trim().length, project.title).toBeGreaterThan(
          0,
        );
      }
    }
  });

  it('project titles are non-empty', () => {
    for (const project of projects) {
      expect(project.title.trim().length).toBeGreaterThan(0);
    }
  });

  it('project descriptions are non-empty', () => {
    for (const project of projects) {
      expect(project.desc.trim().length).toBeGreaterThan(0);
    }
  });

  /**
   * The image is optional so that a new entry does not need art invented for
   * it, but a path that is declared has to resolve — a card that renders a
   * missing file is worse than a card with no picture.
   */
  it('image paths resolve to a committed file', () => {
    for (const project of projects) {
      if (project.image === undefined) continue;

      expect(project.image.startsWith('/')).toBe(true);
      expect(
        existsSync(join(process.cwd(), 'public', project.image)),
        `${project.title}: ${project.image} is not in public/`,
      ).toBe(true);
    }
  });

  it('dates are valid date strings', () => {
    for (const project of projects) {
      expect(isValidIsoDate(project.date), `${project.title}: date`).toBe(true);

      if (project.endDate) {
        expect(
          isValidIsoDate(project.endDate),
          `${project.title}: endDate`,
        ).toBe(true);
        expect(Date.parse(project.endDate)).toBeGreaterThan(
          Date.parse(project.date),
        );
      }
    }
  });

  it('rejects normalized and non-ISO calendar dates', () => {
    expect(isValidIsoDate('2026-02-31')).toBe(false);
    expect(isValidIsoDate('March 9, 2026')).toBe(false);
  });

  /** `ongoing` is what earns the amber "Present"; a finished thing cannot. */
  it('never marks an entry both ongoing and finished', () => {
    for (const project of projects) {
      if (project.ongoing) expect(project.endDate).toBeUndefined();
    }
  });

  it('links are valid URLs when present', () => {
    for (const project of projects) {
      if (project.link) {
        const url = new URL(project.link);

        expect(url.protocol, project.title).toBe('https:');
        expect(url.username, project.title).toBe('');
        expect(url.password, project.title).toBe('');
      }
    }
  });

  it('tech is a non-empty array when present', () => {
    for (const project of projects) {
      if (project.tech) {
        expect(Array.isArray(project.tech)).toBe(true);
        expect(project.tech.length).toBeGreaterThan(0);
      }
    }
  });

  it('has unique project titles', () => {
    const titles = projects.map((p) => p.title);

    expect(new Set(titles).size).toBe(titles.length);
  });

  it('splits into a shipped register and an archive, and keeps both', () => {
    expect(shipped.length).toBeGreaterThan(0);
    expect(archive.length).toBeGreaterThan(0);
    // Groups stay contiguous in the file, so reading it top to bottom reads
    // the same way the page does.
    expect(projects).toEqual([...shipped, ...archive]);
  });

  it.each([
    ['shipped', shipped],
    ['archive', archive],
  ])('orders %s by most recent activity first', (_, group) => {
    expect(group).toEqual([...group].sort(compareActivity));
  });

  /**
   * An entry that names a résumé role must agree with that internal record.
   * This is a consistency gate, not proof of external truth or link health. A
   * project may outlive the job, so only a declared project end date is
   * compared. Roles are matched by their `position`, since the employer is
   * optional until it is confirmed for publication.
   */
  describe('agreement with the résumé', () => {
    function agreementProblems(
      project: Project,
      positions: Position[],
    ): string[] {
      if (project.sourceWork === undefined) return [];

      const position = positions.find(
        (entry) => entry.position === project.sourceWork,
      );
      if (!position) return [`no résumé role "${project.sourceWork}"`];

      const problems: string[] = [];
      if (project.date !== position.startDate) problems.push('start date');
      if (project.endDate && project.endDate !== position.endDate) {
        problems.push('end date');
      }
      const record = new Set(numericClaims(JSON.stringify(position)));
      for (const figure of numericClaims(project.desc)) {
        if (!record.has(figure)) problems.push(`figure "${figure}"`);
      }
      return problems;
    }

    const role: Position = {
      position: 'Tech Lead',
      startDate: '2022-01-01',
      endDate: '2024-01-01',
      summary: 'Led 12 engineers across 3 squads.',
    };
    const entry: Project = {
      title: 'Platform',
      sourceWork: 'Tech Lead',
      date: '2022-01-01',
      endDate: '2024-01-01',
      desc: 'A platform built by 12 engineers.',
      status: 'shipped',
    };

    it('accepts an entry that matches its résumé role', () => {
      expect(agreementProblems(entry, [role])).toEqual([]);
    });

    it('flags a missing role, moved dates, and figures the résumé lacks', () => {
      expect(
        agreementProblems({ ...entry, sourceWork: 'CTO' }, [role]),
      ).toEqual(['no résumé role "CTO"']);
      expect(
        agreementProblems(
          { ...entry, date: '2021-06-01', endDate: '2025-01-01' },
          [role],
        ),
      ).toEqual(['start date', 'end date']);
      expect(
        agreementProblems({ ...entry, desc: 'Served 40 teams.' }, [role]),
      ).toEqual(['figure "40"']);
    });

    it('holds for every entry in the register', () => {
      for (const project of projects) {
        expect(agreementProblems(project, work), project.title).toEqual([]);
      }
    });

    it('compares numeric claims as complete tokens', () => {
      const record = new Set(numericClaims('2026 1M+ 30+ 25% 1-N'));

      expect(record).toEqual(new Set(['2026', '1M', '30', '25%', '1-N']));
      expect(record.has('20')).toBe(false);
      expect(record.has('1%')).toBe(false);
    });
  });

  // Today every entry is a public repository: the date and description are
  // read from it, so each one has to point at it.
  it('links every entry to its public GitHub repository', () => {
    for (const project of projects) {
      expect(project.link, project.title).toMatch(
        /^https:\/\/github\.com\/(?:fabioassuncao|codions-archive)\/[\w.-]+$/,
      );
    }
  });

  it('keeps products without a confirmed description off the page', () => {
    const published = new Set(projects.map((project) => project.title));

    expect(pendingProducts.length).toBeGreaterThan(0);
    for (const product of pendingProducts) {
      expect(published.has(product.title), product.title).toBe(false);
    }
  });
});
