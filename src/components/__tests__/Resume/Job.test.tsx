import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Position } from '@/data/resume/work';

import Job from '../../Resume/Experience/Job';

const NOW = new Date(2026, 6, 28, 12, 0, 0).getTime();

describe('Job', () => {
  const mockJob: Position = {
    name: 'Acme Corp',
    position: 'Senior Engineer',
    url: 'https://acme.com',
    startDate: '2020-01-15',
    endDate: '2023-06-30',
    summary: 'Led development of **critical systems**.',
    highlights: ['Shipped feature X', 'Improved performance by 50%'],
  };

  it('renders company name with link', () => {
    render(<Job data={mockJob} now={NOW} />);

    const link = screen.getByRole('link', { name: /acme corp/i });
    expect(link).toHaveAttribute('href', 'https://acme.com');
  });

  it('renders position title', () => {
    render(<Job data={mockJob} now={NOW} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Senior Engineer',
    );
  });

  it('formats date range correctly', () => {
    render(<Job data={mockJob} now={NOW} />);

    expect(screen.getByText('janeiro de 2020')).toBeInTheDocument();
    expect(screen.getByText('junho de 2023')).toBeInTheDocument();
  });

  it('shows Present for current job (no end date)', () => {
    const currentJob = {
      ...mockJob,
      endDate: undefined,
    };

    render(<Job data={currentJob} now={NOW} />);

    expect(screen.getByText('Atual')).toBeInTheDocument();
  });

  it('renders summary with markdown', () => {
    render(<Job data={mockJob} now={NOW} />);

    // Summary text should be present
    expect(screen.getByText(/led development of/i)).toBeInTheDocument();
  });

  it('renders highlights as list items', () => {
    render(<Job data={mockJob} now={NOW} />);

    expect(screen.getByText('Shipped feature X')).toBeInTheDocument();
    expect(screen.getByText('Improved performance by 50%')).toBeInTheDocument();

    const listItems = document.querySelectorAll('.points li');
    expect(listItems.length).toBe(2);
  });

  it('handles missing summary gracefully', () => {
    const jobWithoutSummary = {
      ...mockJob,
      summary: undefined,
    };

    render(<Job data={jobWithoutSummary} now={NOW} />);

    // Should not crash, highlights should still render
    expect(screen.getByText('Shipped feature X')).toBeInTheDocument();
  });

  it('handles missing highlights gracefully', () => {
    const jobWithoutHighlights = {
      ...mockJob,
      highlights: undefined,
    };

    render(<Job data={jobWithoutHighlights} now={NOW} />);

    // Should not crash, summary should still render
    expect(screen.getByText(/led development/i)).toBeInTheDocument();

    const list = document.querySelector('.points');
    expect(list).not.toBeInTheDocument();
  });

  it('renders as article element', () => {
    render(<Job data={mockJob} now={NOW} />);

    const article = document.querySelector('article.jobs-container');
    expect(article).toBeInTheDocument();
  });

  it('derives the tenure from the two dates', () => {
    render(<Job data={mockJob} now={NOW} />);

    // 2020-01-15 to 2023-06-30.
    const duration = document.querySelector('.daterange-duration');
    expect(duration?.querySelector('[aria-hidden="true"]')?.textContent).toBe(
      '3 a 5 m',
    );
    expect(duration?.querySelector('.sr-only')).toHaveTextContent(
      'Duração: 3 anos 5 meses',
    );
  });

  it('measures an ongoing role to the instant it is given, hedged', () => {
    render(<Job data={{ ...mockJob, endDate: undefined }} now={NOW} />);

    const duration = document.querySelector('.daterange-duration');
    expect(duration?.querySelector('[aria-hidden="true"]')?.textContent).toBe(
      '6 a 6 m+',
    );
    expect(duration?.querySelector('.sr-only')).toHaveTextContent(
      'Duração: 6 anos 6 meses ou mais',
    );
  });

  // "<1 m" is already an upper bound; hedging it would read "menos de 1 mês
  // ou mais", bracketing the value from both sides at once.
  it('does not hedge an ongoing role that has not run a whole month', () => {
    render(
      <Job
        data={{ ...mockJob, startDate: '2026-08-01', endDate: undefined }}
        now={new Date('2026-08-11T12:00:00Z').getTime()}
      />,
    );

    const duration = document.querySelector('.daterange-duration');
    expect(duration?.querySelector('[aria-hidden="true"]')?.textContent).toBe(
      '<1 m',
    );
    expect(duration?.querySelector('.sr-only')).toHaveTextContent(
      'Duração: menos de 1 mês',
    );
  });

  it('speaks the range with a spoken separator', () => {
    render(<Job data={mockJob} now={NOW} />);

    // The dash is aria-hidden; the spoken word joins the two dates.
    expect(
      document.querySelector('.daterange-sep')?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(document.querySelector('.daterange > .sr-only')?.textContent).toBe(
      ' até ',
    );
  });

  // The employer is optional until it is confirmed for publication: the role
  // must then stand alone, with no empty or dangling link.
  it('renders the role alone when no company is published', () => {
    const { name: _name, url: _url, ...anonymous } = mockJob;
    render(<Job data={anonymous} now={NOW} />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Senior Engineer');
    expect(heading.querySelector('.job-company')).toBeNull();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('names a company without a link as plain text', () => {
    render(<Job data={{ ...mockJob, url: undefined }} now={NOW} />);

    const company = document.querySelector('.job-company');
    expect(company?.tagName).toBe('SPAN');
    expect(company).toHaveTextContent('Acme Corp');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  // A year-only record must not gain a month, and month-level tenure from
  // year-only dates would be false precision.
  it('shows only years, and no duration, for a year-precision record', () => {
    render(
      <Job
        data={{
          ...mockJob,
          startDate: '2016-01-01',
          endDate: '2019-01-01',
          datePrecision: 'year',
        }}
        now={NOW}
      />,
    );

    const times = document.querySelectorAll('.daterange time');
    expect([...times].map((time) => time.textContent)).toEqual([
      '2016',
      '2019',
    ]);
    expect(times[0]).toHaveAttribute('datetime', '2016-01-01');
    expect(document.querySelector('.daterange-duration')).toBeNull();
  });

  it('still marks an ongoing year-precision role as current', () => {
    render(
      <Job
        data={{
          ...mockJob,
          startDate: '2022-01-01',
          endDate: undefined,
          datePrecision: 'year',
        }}
        now={NOW}
      />,
    );

    expect(document.querySelector('.daterange time')).toHaveTextContent('2022');
    expect(screen.getByText('Atual')).toBeInTheDocument();
    expect(
      document.querySelector('.jobs-container--current'),
    ).toBeInTheDocument();
  });
});
