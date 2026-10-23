import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { pillars } from '@/data/pillars';
import { serviceGroups } from '@/data/services';
import { getWritingItems } from '@/lib/writing';
import HomePage from '../page';
import WritingPage from '../writing/page';

const stripTrailingSlash = (href: string | null | undefined) =>
  href?.replace(/\/$/, '');

describe('writing information architecture', () => {
  it('surfaces up to the three newest dated items on the homepage', () => {
    const expected = getWritingItems()
      .filter((item) => item.date)
      .slice(0, 3);

    render(<HomePage />);
    const section = screen.getByRole('region', { name: 'Artigos recentes' });
    // Talks and projects share the card styling, so count within the section.
    const cards = section.querySelectorAll('.home-writing-item');
    const viewAll = within(section).getByRole('link', {
      name: /todos os artigos/i,
    });

    expect(expected.length).toBeGreaterThan(0);
    expect(cards).toHaveLength(expected.length);
    expect(
      [...cards].map((card) => card.querySelector('h3')?.textContent),
    ).toEqual(expected.map((item) => item.title));
    // `next/link` drops the configured trailing slash in this environment; see
    // the featured-item test below. Normalise rather than pin the shape.
    expect(stripTrailingSlash(viewAll.getAttribute('href'))).toBe('/writing');
  });

  it('groups owned essays, external articles, and guides under real headings', () => {
    const items = getWritingItems();
    const { container } = render(<WritingPage />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Neste site' }),
    ).toBeInTheDocument();
    // An empty group is left out rather than shipped as a bare heading.
    const groups = [
      ['Em outros lugares', items.some((item) => item.isExternal && item.date)],
      ['Guias', items.some((item) => item.isExternal && !item.date)],
    ] as const;
    for (const [name, hasItems] of groups) {
      const heading = screen.queryByRole('heading', { level: 2, name });
      if (hasItems) {
        expect(heading).toBeInTheDocument();
      } else {
        expect(heading).not.toBeInTheDocument();
      }
    }

    expect(container.querySelectorAll('.writing-item h3')).toHaveLength(
      getWritingItems().length,
    );
  });

  it('features exactly the newest dated item, wherever it is grouped', () => {
    const newest = getWritingItems().find((item) => item.date);
    const { container } = render(<WritingPage />);
    const featured = container.querySelectorAll('.writing-item--featured');

    expect(featured).toHaveLength(1);
    // Compared exactly while the newest dated item happened to be an external
    // link, which renders as a plain anchor. An on-site post renders through
    // `next/link`, which drops the canonical trailing slash here because
    // `trailingSlash: true` is build-time config the unit-test environment
    // never applies — the export itself keeps the slash. Normalise it away so
    // this asserts which item is featured, not which element type renders it.
    expect(stripTrailingSlash(featured[0]?.getAttribute('href'))).toBe(
      stripTrailingSlash(newest?.url),
    );
  });

  it('shows provenance beside every external-link arrow', () => {
    const externalItems = getWritingItems().filter((item) => item.isExternal);
    const { container } = render(<WritingPage />);
    const externalLinks = [
      ...container.querySelectorAll('a.writing-item[target="_blank"]'),
    ];

    expect(externalLinks).toHaveLength(externalItems.length);
    externalLinks.forEach((link, index) => {
      expect(link.querySelector('.writing-source')).toHaveTextContent(
        externalItems[index].source,
      );
      expect(link.querySelector('.writing-external')).toHaveTextContent('↗');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link.querySelector('.sr-only')).toHaveTextContent(
        'abre em nova aba',
      );
    });
  });

  it('orders the homepage: hero, pillars, services, talks, writing', () => {
    const { container } = render(<HomePage />);
    const main = container.querySelector('main') as HTMLElement;

    expect(
      within(main)
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual([
      'Sobre o que eu falo',
      'O que eu faço',
      'Palestras',
      'Artigos recentes',
    ]);
    expect(main.querySelector('.hero')).not.toBeNull();
    // The project register lives on /projects/, not on the homepage.
    expect(
      screen.queryByRole('region', { name: 'Projetos em destaque' }),
    ).not.toBeInTheDocument();
  });

  it('shows the six content pillars with their series labels', () => {
    render(<HomePage />);

    const pillarsSection = screen.getByRole('region', {
      name: 'Sobre o que eu falo',
    });
    const cards = pillarsSection.querySelectorAll('.pillar-card');
    expect(cards).toHaveLength(pillars.length);
    expect(pillars).toHaveLength(6);
    for (const pillar of pillars) {
      expect(
        within(pillarsSection).getByText(pillar.series),
      ).toBeInTheDocument();
    }
  });

  it('summarises the services by name only and links to the details', () => {
    render(<HomePage />);

    const services = screen.getByRole('region', { name: 'O que eu faço' });
    expect(services.querySelector('.service-groups--compact')).not.toBeNull();
    expect(services.querySelector('.service-summary')).toBeNull();
    for (const group of serviceGroups) {
      expect(within(services).getByText(group.need)).toBeInTheDocument();
    }
    expect(
      stripTrailingSlash(
        within(services)
          .getByRole('link', { name: 'Fale comigo' })
          .getAttribute('href'),
      ),
    ).toBe('/contato');
    expect(
      stripTrailingSlash(
        within(services)
          .getByRole('link', { name: 'Ver os detalhes' })
          .getAttribute('href'),
      ),
    ).toBe('/trabalhe-comigo');
  });

  it('lists the talk on the homepage', () => {
    render(<HomePage />);

    const talks = screen.getByRole('region', { name: 'Palestras' });
    expect(
      within(talks).getByRole('link', {
        name: /Além do código: Inteligência artificial e o novo desenvolvedor/,
      }),
    ).toBeInTheDocument();
  });
});
