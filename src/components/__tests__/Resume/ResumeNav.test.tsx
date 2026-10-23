import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ResumeNav from '../../Resume/ResumeNav';

describe('ResumeNav', () => {
  it('renders navigation element', () => {
    render(<ResumeNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('renders links to all resume sections', () => {
    render(<ResumeNav />);

    expect(screen.getByRole('link', { name: /experiência/i })).toHaveAttribute(
      'href',
      '#experience',
    );
    expect(screen.getByRole('link', { name: /formação/i })).toHaveAttribute(
      'href',
      '#education',
    );
    expect(screen.getByRole('link', { name: /competências/i })).toHaveAttribute(
      'href',
      '#skills',
    );
    expect(screen.getByRole('link', { name: /cursos/i })).toHaveAttribute(
      'href',
      '#courses',
    );
    expect(screen.getByRole('link', { name: /referências/i })).toHaveAttribute(
      'href',
      '#references',
    );
  });

  it('renders 5 navigation links', () => {
    render(<ResumeNav />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBe(5);
  });

  it('has correct CSS class', () => {
    render(<ResumeNav />);

    const nav = document.querySelector('.resume-nav');
    expect(nav).toBeInTheDocument();
  });

  it('experience link is active by default', () => {
    render(<ResumeNav />);

    const experienceLink = screen.getByRole('link', { name: /experiência/i });
    expect(experienceLink).toHaveClass('active');
  });

  it('names its landmark in Portuguese', () => {
    render(<ResumeNav />);

    expect(
      screen.getByRole('navigation', { name: 'Seções do currículo' }),
    ).toBeInTheDocument();
  });

  // Sections the page leaves out (empty education, no courses) must not be
  // offered as in-page links that point at nothing.
  it('omits the sections the page does not render', () => {
    render(<ResumeNav omit={['education', 'courses']} />);

    const hrefs = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['#experience', '#skills', '#references']);
  });
});
