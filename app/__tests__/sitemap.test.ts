import { describe, expect, it } from 'vitest';

import presentations, { presentationPath } from '@/data/presentations';
import { SITE_URL } from '@/lib/utils';
import sitemap from '../sitemap';

describe('sitemap', () => {
  it('uses trailing slashes for exported page routes', () => {
    const entries = sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: `${SITE_URL}/` }),
        expect.objectContaining({ url: `${SITE_URL}/about/` }),
        expect.objectContaining({ url: `${SITE_URL}/resume/` }),
        expect.objectContaining({ url: `${SITE_URL}/projects/` }),
        expect.objectContaining({ url: `${SITE_URL}/writing/` }),
        expect.objectContaining({ url: `${SITE_URL}/presentations/` }),
        expect.objectContaining({ url: `${SITE_URL}/trabalhe-comigo/` }),
        expect.objectContaining({ url: `${SITE_URL}/contact/` }),
        expect.objectContaining({ url: `${SITE_URL}/links/` }),
      ]),
    );
  });

  it('does not invent modification dates for static pages', () => {
    // Posts and talks are dated content; everything else is a static page.
    const staticEntries = sitemap().filter(
      (entry) =>
        !entry.url.startsWith(`${SITE_URL}/writing/`) &&
        !(
          entry.url.startsWith(`${SITE_URL}/presentations/`) &&
          entry.url !== `${SITE_URL}/presentations/`
        ),
    );

    expect(
      staticEntries.every((entry) => entry.lastModified === undefined),
    ).toBe(true);
  });

  it('uses trailing slashes for post routes', () => {
    const entries = sitemap();
    const postEntries = entries.filter(
      (entry) =>
        entry.url.startsWith(`${SITE_URL}/writing/`) &&
        entry.url !== `${SITE_URL}/writing/`,
    );

    expect(postEntries.length).toBeGreaterThan(0);
    expect(postEntries.every((entry) => entry.url.endsWith('/'))).toBe(true);
  });

  it('lists every talk at its exact public URL, dated by the talk', () => {
    const entries = sitemap();

    for (const talk of presentations) {
      const entry = entries.find(
        (candidate) => candidate.url === `${SITE_URL}${presentationPath(talk)}`,
      );
      expect(entry, talk.slug).toBeDefined();
      expect(entry?.url.endsWith('/')).toBe(true);
      expect(entry?.lastModified).toEqual(new Date(talk.date));
    }
    expect(entries.map((entry) => entry.url)).toContain(
      `${SITE_URL}/presentations/alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor/`,
    );
  });

  it('no longer lists the removed stats page', () => {
    expect(sitemap().map((entry) => entry.url)).not.toContain(
      `${SITE_URL}/stats/`,
    );
  });
});
