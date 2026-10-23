import { render, screen, waitFor, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import { createHeadingId } from '@/lib/anchors';
import AboutContent from '../Sections';

function getActualSectionTitles(markdown: string) {
  return Array.from(markdown.matchAll(/^# (.+)$/gm))
    .map((match) => match[1])
    .filter((title) => title !== 'Intro');
}

describe('AboutContent', () => {
  it('renders intro copy without an Intro heading', () => {
    render(
      <AboutContent
        markdown={`# Intro

Hello from the intro.

# Some History

- Built a thing.`}
      />,
    );

    expect(screen.getByText('Hello from the intro.')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Intro' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Some History' }),
    ).toBeInTheDocument();
  });

  it('gives the career log the log treatment and leaves other sections plain', () => {
    const { container } = render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# Desde 2008

- De 2008 a 2010, um cargo.

# Outra seção

- Um item.`}
      />,
    );

    const sections = container.querySelectorAll('.about-section');

    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveClass('about-section--log');
    expect(sections[1]).toHaveAttribute('class', 'about-section');
  });

  it('adds stable heading ids for deep links', () => {
    render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# Some History

- Built a thing.

# Travel / Geography

- Went somewhere.`}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Some History' }),
    ).toHaveAttribute('id', 'some-history');
    expect(
      screen.getByRole('heading', { name: 'Travel / Geography' }),
    ).toHaveAttribute('id', 'travel-geography');
  });

  it('renders section navigation and self-links for the real about markdown', () => {
    const sectionTitles = getActualSectionTitles(aboutMarkdown);
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);
    const nav = screen.getByRole('navigation', { name: 'Seções da página' });

    expect(within(nav).getAllByRole('link')).toHaveLength(sectionTitles.length);

    for (const title of sectionTitles) {
      const headingId = createHeadingId(title);
      const heading = screen.getByRole('heading', { name: title });

      expect(heading).toHaveAttribute('id', headingId);
      expect(within(nav).getByRole('link', { name: title })).toHaveAttribute(
        'href',
        `#${headingId}`,
      );
      expect(
        container.querySelector(`h2#${headingId} > a[href="#${headingId}"]`),
      ).toBeTruthy();
    }
  });

  it('renders matching hash links and heading ids into static markup', () => {
    const html = renderToStaticMarkup(
      <AboutContent markdown={aboutMarkdown} />,
    );

    expect(html).toContain('href="#desde-2008"');
    expect(html).toContain('id="desde-2008"');
  });

  it('renders only the years stated by the prose', () => {
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);
    const history = container.querySelector('.about-section--log');
    const entries = Array.from(
      history?.querySelectorAll('.log-entry') ?? [],
    ) as HTMLElement[];

    expect(entries).toHaveLength(8);
    expect(
      entries.map((entry) => ({
        year: entry.querySelector('.log-entry-year')?.textContent ?? null,
        age: entry.querySelector('.log-entry-age')?.textContent ?? null,
      })),
    ).toEqual([
      { year: '2008–2010', age: null },
      { year: '2010–2012', age: null },
      { year: '2012–2014', age: null },
      { year: '2014–2016', age: null },
      { year: '2016–2019', age: null },
      { year: '2019–2022', age: null },
      { year: '2022', age: null },
      { year: '2026', age: null },
    ]);

    // Every marker is a leading one, lifted out of the sentence and therefore
    // still exposed: the body no longer repeats it.
    expect(entries[0].querySelector('.log-entry-body')?.textContent).toMatch(
      /^Como estagiário de desenvolvimento/,
    );
    for (const entry of entries) {
      expect(entry.querySelector('.log-entry-marker')).not.toHaveAttribute(
        'aria-hidden',
      );
    }
  });

  it('leaves an undated entry an empty gutter rather than a broken marker', () => {
    const { container } = render(
      <AboutContent
        markdown={`# Intro

Lead.

# Desde 2008

- De 2008 a 2010, um cargo.
- Um marco sem data.`}
      />,
    );
    const markers = Array.from(
      container.querySelectorAll('.about-section--log .log-entry-marker'),
    );
    const empty = markers.filter((marker) => marker.textContent === '');

    expect(markers).toHaveLength(2);
    expect(empty).toHaveLength(1);

    for (const marker of empty) {
      expect(marker.querySelector('.log-entry-year')).toBeNull();
    }
  });

  it('supports same-page hash navigation from section links', async () => {
    window.history.replaceState({}, '', '/about/');

    render(<AboutContent markdown={aboutMarkdown} />);

    const nav = screen.getByRole('navigation', { name: 'Seções da página' });
    const navLink = within(nav).getByRole('link', { name: 'Desde 2008' });

    navLink.click();

    await waitFor(() => {
      expect(window.location.hash).toBe('#desde-2008');
    });
    expect(document.querySelector(window.location.hash)).toHaveTextContent(
      'Desde 2008',
    );

    window.history.replaceState({}, '', '/about/');
    const heading = screen.getByRole('heading', { name: 'Desde 2008' });
    const permalink = within(heading).getByRole('link', {
      name: 'Desde 2008',
    });

    permalink.click();

    await waitFor(() => {
      expect(window.location.hash).toBe('#desde-2008');
    });
  });
});
