import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Experience from '../../Resume/Experience';

const mockJobs = [
  {
    name: 'Acme Corp',
    position: 'Senior Engineer',
    url: 'https://acme.com',
    startDate: '2020-01-01',
    endDate: '2023-06-30',
    summary: 'Led engineering team.',
    highlights: ['Built features', 'Improved performance'],
  },
  {
    name: 'Startup Inc',
    position: 'Software Engineer',
    url: 'https://startup.com',
    startDate: '2018-01-01',
    endDate: '2019-12-31',
    highlights: ['Wrote code'],
  },
];

describe('Experience', () => {
  it('renders the experience section with title', () => {
    render(<Experience data={mockJobs} />);

    expect(
      screen.getByRole('heading', { name: /experiência/i }),
    ).toBeInTheDocument();
  });

  it('renders all jobs', () => {
    render(<Experience data={mockJobs} />);

    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Startup Inc')).toBeInTheDocument();
  });

  it('renders job positions', () => {
    render(<Experience data={mockJobs} />);

    expect(screen.getByText(/Senior Engineer/)).toBeInTheDocument();
    expect(screen.getByText(/Software Engineer/)).toBeInTheDocument();
  });

  it('renders jobs with company links', () => {
    render(<Experience data={mockJobs} />);

    const links = screen.getAllByRole('link');
    expect(
      links.some((l) => l.getAttribute('href') === 'https://acme.com'),
    ).toBe(true);
    expect(
      links.some((l) => l.getAttribute('href') === 'https://startup.com'),
    ).toBe(true);
  });

  it('handles empty jobs array', () => {
    render(<Experience data={[]} />);

    expect(
      screen.getByRole('heading', { name: /experiência/i }),
    ).toBeInTheDocument();
    // No job articles
    const articles = document.querySelectorAll('.jobs-container');
    expect(articles.length).toBe(0);
  });

  /**
   * The spine used to render in raw array order, and the real data had drifted
   * out of sequence, so a section that reads as a timeline ran backwards in the
   * middle. `tierFor` was already written not to depend on array position;
   * sorting is the other half of that.
   */
  it('renders the most recently held role first regardless of source order', () => {
    const shuffled = [
      {
        ...mockJobs[1],
        name: 'Oldest Co',
        startDate: '2014-01-01',
        endDate: '2015-01-01',
      },
      {
        ...mockJobs[0],
        name: 'Newest Co',
        startDate: '2023-01-01',
        endDate: '2024-01-01',
      },
      {
        ...mockJobs[1],
        name: 'Middle Co',
        startDate: '2018-01-01',
        endDate: '2019-01-01',
      },
    ];

    render(<Experience data={shuffled} />);

    const companies = Array.from(document.querySelectorAll('.job-company')).map(
      (node) => node.textContent,
    );

    expect(companies).toEqual(['Newest Co', 'Middle Co', 'Oldest Co']);
  });

  it('gives the lead tier to the newest substantive start', () => {
    const shuffled = [
      { ...mockJobs[1], name: 'Oldest Co', startDate: '2015-01-01' },
      { ...mockJobs[0], name: 'Newest Co', startDate: '2024-01-01' },
    ];

    render(<Experience data={shuffled} />);

    const lead = document.querySelector('.jobs-container--lead');
    expect(lead?.querySelector('.job-company')?.textContent).toBe('Newest Co');
  });

  it('measures every ongoing role against a single shared instant', () => {
    const now = new Date('2026-07-28T12:00:00Z').getTime();

    render(
      <Experience
        data={[
          { ...mockJobs[0], name: 'Still Going', endDate: undefined },
          { ...mockJobs[1], name: 'Also Going', endDate: undefined },
        ]}
        now={now}
      />,
    );

    const durations = Array.from(
      document.querySelectorAll('.daterange-duration [aria-hidden="true"]'),
    ).map((node) => node.textContent);

    // 2020-01-01 and 2018-01-01 respectively, both measured to `now`, and
    // both hedged because an ongoing tenure is only a floor once built.
    expect(durations).toEqual(['6 a 6 m+', '8 a 6 m+']);
  });

  // Portuguese titles: "Estagiário" marks the early tier as "intern" did.
  it('steps an internship down to the early tier', () => {
    render(
      <Experience
        data={[
          {
            position: 'Estagiário de Desenvolvimento',
            startDate: '2008-01-01',
            endDate: '2010-01-01',
          },
          {
            position: 'Engenheiro de Software',
            startDate: '2014-01-01',
            endDate: '2016-01-01',
          },
        ]}
      />,
    );

    const early = document.querySelector('.jobs-container--early');
    expect(early).toHaveTextContent('Estagiário de Desenvolvimento');
    expect(document.querySelector('.jobs-container--lead')).toHaveTextContent(
      'Engenheiro de Software',
    );
  });

  // Roles without a published employer still order and render, keyed apart
  // by their titles.
  it('renders roles with no company name in timeline order', () => {
    render(
      <Experience
        data={[
          {
            position: 'Older role',
            startDate: '2012-01-01',
            endDate: '2014-01-01',
          },
          {
            position: 'Newer role',
            startDate: '2016-01-01',
            endDate: '2019-01-01',
          },
        ]}
      />,
    );

    const titles = Array.from(
      document.querySelectorAll('.job-position'),
      (node) => node.textContent,
    );
    expect(titles).toEqual(['Newer role', 'Older role']);
    expect(document.querySelector('.job-company')).toBeNull();
  });
});
