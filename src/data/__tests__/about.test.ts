import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '../about';
import work from '../resume/work';

/**
 * The only figures the site may state about Fábio's career
 * (social media project, `01-contexto/fabio.md`): 9,5 mi users, 3 mi students,
 * 57 mil teachers, ~30% and 80%+ cloud savings, 20+ contracts and 20+ people,
 * teams of up to 17 devs, 15+ years, plus the "10º" in the talk's event name.
 */
const APPROVED_FIGURES = new Set([
  '9,5',
  '3',
  '57',
  '30',
  '80',
  '20',
  '17',
  '15',
  '10',
]);

/** Every number in a text that is not a calendar year. */
function figuresIn(text: string): string[] {
  return [...text.matchAll(/\d+(?:,\d+)?/g)]
    .map((match) => match[0])
    .filter((figure) => !/^(19|20)\d{2}$/.test(figure));
}

describe('about data', () => {
  it('exports aboutMarkdown as a string', () => {
    expect(typeof aboutMarkdown).toBe('string');
    expect(aboutMarkdown.length).toBeGreaterThan(0);
  });

  it('opens with the approved intro from the social media project', () => {
    expect(aboutMarkdown.startsWith('# Intro')).toBe(true);
    expect(aboutMarkdown).toContain('Programo desde 2008.');
    expect(aboutMarkdown).toContain(
      'Liderei a tecnologia do Portal QEdu, com mais de 9,5 milhões de usuários',
    );
    expect(aboutMarkdown).toContain('PHP, Node.js e Python');
    expect(aboutMarkdown).toContain('revisão humana em tudo');
  });

  it('presents the Codions as the company behind the work, linked', () => {
    expect(aboutMarkdown).toContain('[Codions](https://codions.com)');
  });

  it('contains the career log since 2008', () => {
    expect(aboutMarkdown).toContain('# Desde 2008');
    expect(aboutMarkdown).toContain('De 2008 a 2012');
    expect(aboutMarkdown).toContain('Desde 2023');
    expect(aboutMarkdown).toContain('De 2024 a 2025');
  });

  it('states no figure outside the approved list', () => {
    const texts = [
      aboutMarkdown,
      ...work.flatMap((job) => [
        job.position,
        job.summary ?? '',
        ...(job.highlights ?? []),
      ]),
    ];

    for (const text of texts) {
      for (const figure of figuresIn(text)) {
        expect(
          APPROVED_FIGURES,
          `${figure} in "${text.slice(0, 60)}…"`,
        ).toContain(figure);
      }
    }
  });

  it('catches an invented figure', () => {
    expect(figuresIn('mais de 600 clientes em 2024')).toEqual(['600']);
    expect(APPROVED_FIGURES.has('600')).toBe(false);
  });

  it('carries none of the upstream template author content', () => {
    for (const upstream of [
      // Upstream employer names, spelled indirectly so the audit search
      // (docs/adapting-guide.md) keeps matching only the attribution.
      ['Open', 'AI'].join(''),
      ['Prompt', 'foo'].join(''),
      'MS-DOS',
      'Buffalo',
      '# Some History',
      '# Websites from People I Admire',
    ]) {
      expect(aboutMarkdown).not.toContain(upstream);
    }
  });

  it('links on-site routes with the canonical trailing slash, and only the Codions off-site', () => {
    const links = [...aboutMarkdown.matchAll(/\]\(([^)]+)\)/g)].map(
      (match) => match[1],
    );

    expect(links.length).toBeGreaterThan(0);
    for (const href of links) {
      if (href.startsWith('https://')) {
        expect(href).toBe('https://codions.com');
      } else {
        expect(href).toMatch(/^\/[a-z0-9/-]*\/$/);
      }
    }
  });

  it('contains properly formatted headers', () => {
    const headers = aboutMarkdown.match(/^#+ .+$/gm);

    expect(headers).toEqual(['# Intro', '# Desde 2008']);
  });
});
