import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Navigation from '../../Template/Navigation';

// Mock usePathname to control active state
const mockPathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('Navigation', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');

    // Mock matchMedia for ThemeToggle
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders the logo link to home', () => {
    render(<Navigation />);
    const logo = screen.getByRole('link', {
      name: /fábio assunção.*início/i,
    });
    expect(logo).toHaveAttribute('href', '/');
  });

  it('labels the primary navigation landmark', () => {
    render(<Navigation />);

    expect(
      screen.getByRole('navigation', { name: 'Principal' }),
    ).toBeInTheDocument();
  });

  it('renders only primary navigation routes', () => {
    render(<Navigation />);

    expect(screen.getByRole('link', { name: /^sobre$/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /currículo/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /artigos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contato/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projetos/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /palestras/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /trabalhe comigo/i }),
    ).toBeInTheDocument();
    // The bio page is a destination for social links, not navigation.
    expect(
      screen.queryByRole('link', { name: /^links$/i }),
    ).not.toBeInTheDocument();
  });

  it('marks home route as active when on homepage', () => {
    mockPathname.mockReturnValue('/');
    render(<Navigation />);

    // About link should not be active
    const aboutLink = screen.getByRole('link', { name: /^sobre$/i });
    expect(aboutLink).not.toHaveClass('active');
  });

  it('marks about route as active when on about page', () => {
    mockPathname.mockReturnValue('/about');
    render(<Navigation />);

    const aboutLink = screen.getByRole('link', { name: /^sobre$/i });
    expect(aboutLink).toHaveClass('active');
    expect(aboutLink).toHaveAttribute('aria-current', 'page');
  });

  it('marks nested routes as active', () => {
    mockPathname.mockReturnValue('/resume/skills');
    render(<Navigation />);

    const resumeLink = screen.getByRole('link', { name: /currículo/i });
    expect(resumeLink).toHaveClass('active');
  });

  it('renders theme toggle and hamburger menu', () => {
    render(<Navigation />);

    // Theme toggle should be present (placeholder initially due to SSR)
    const navActions = document.querySelector('.nav-actions');
    expect(navActions).toBeInTheDocument();
  });
});
