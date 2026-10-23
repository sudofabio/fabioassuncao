import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '../about';

describe('about data', () => {
  it('exports aboutMarkdown as a string', () => {
    expect(typeof aboutMarkdown).toBe('string');
    expect(aboutMarkdown.length).toBeGreaterThan(0);
  });

  it('opens with the intro built on the speaker bio', () => {
    expect(aboutMarkdown.startsWith('# Intro')).toBe(true);
    expect(aboutMarkdown).toContain(
      'Sou desenvolvedor de software, Tech Lead e empreendedor, com mais de 15 anos de experiência',
    );
    expect(aboutMarkdown).toContain(
      'PHP, Go, Node.js/TypeScript, Python e Rust',
    );
  });

  it('mentions the company in one line, as a bio fact only', () => {
    expect(aboutMarkdown.match(/Codions/g)).toHaveLength(1);
  });

  it('contains the career log since 2008', () => {
    expect(aboutMarkdown).toContain('# Desde 2008');
    expect(aboutMarkdown).toContain('De 2008 a 2010');
    expect(aboutMarkdown).toContain('Desde 2022');
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

  it('links only to on-site routes with the canonical trailing slash', () => {
    const links = [...aboutMarkdown.matchAll(/\]\(([^)]+)\)/g)].map(
      (match) => match[1],
    );

    expect(links.length).toBeGreaterThan(0);
    for (const href of links) {
      expect(href).toMatch(/^\/[a-z0-9/-]*\/$/);
    }
  });

  it('contains properly formatted headers', () => {
    const headers = aboutMarkdown.match(/^#+ .+$/gm);

    expect(headers).toEqual(['# Intro', '# Desde 2008']);
  });
});
