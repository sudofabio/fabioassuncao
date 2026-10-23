import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import profile from '@/data/profile.json';
import work from '@/data/resume/work';
import { currentPosition } from '@/lib/career';

import Footer from '../../Template/Footer';

describe('Footer', () => {
  it('renders the footer with correct structure', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays the name and role', () => {
    render(<Footer />);

    expect(screen.getByText(profile.name)).toBeInTheDocument();
    // No employer is published yet, so the role stands on its own rather
    // than reading "… at undefined".
    const current = currentPosition(work);
    expect(current?.name).toBeUndefined();
    expect(screen.getByText(current?.position ?? '')).toBeInTheDocument();
    expect(screen.queryByText(/undefined|\bat\b/)).not.toBeInTheDocument();
  });

  it('does not introduce unrelated headings into the page outline', () => {
    render(<Footer />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('displays the current year in copyright', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`© ${currentYear}`)),
    ).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /^sobre$/i })).toHaveAttribute(
      'href',
      '/about',
    );
    expect(screen.getByRole('link', { name: /currículo/i })).toHaveAttribute(
      'href',
      '/resume',
    );
    expect(screen.getByRole('link', { name: /projetos/i })).toHaveAttribute(
      'href',
      '/projects',
    );
    expect(screen.getByRole('link', { name: /palestras/i })).toHaveAttribute(
      'href',
      '/presentations',
    );
    expect(screen.getByRole('link', { name: /^contato$/i })).toHaveAttribute(
      'href',
      '/contact',
    );
  });

  it('renders contact icons section', () => {
    render(<Footer />);

    // Contact icons are rendered via ContactIcons component
    const socialSection = document.querySelector('.footer-social');
    expect(socialSection).toBeInTheDocument();
    expect(screen.getByText('Redes')).toBeInTheDocument();
  });

  it('links the source to this repository, in a new tab', () => {
    render(<Footer />);

    const source = screen.getByRole('link', { name: /código-fonte/i });
    expect(source).toHaveAttribute(
      'href',
      'https://github.com/fabioassuncao/fabioassuncao',
    );
    expect(source).toHaveAttribute('target', '_blank');
    expect(source).toHaveTextContent('(abre em nova aba)');
  });

  it('has link to home from avatar', () => {
    render(<Footer />);

    const avatarLink = document.querySelector('.footer-avatar');
    expect(avatarLink).toHaveAttribute('href', '/');
  });
});
