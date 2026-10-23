import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import contact, { SOCIAL_HANDLE } from '@/data/contact';

import ContactIcons from '../Contact/ContactIcons';

describe('ContactIcons', () => {
  it('renders contact icons', () => {
    render(<ContactIcons />);

    // Check if GitHub link is present
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      expect.stringContaining('github.com'),
    );

    // Check if email link is present
    const emailLink = screen.getByRole('link', { name: /e-mail/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:'),
    );
  });

  it('renders one link per contact entry, Threads included', () => {
    render(<ContactIcons />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(contact.length);
    expect(screen.getByRole('link', { name: /threads/i })).toHaveAttribute(
      'href',
      `https://www.threads.com/@${SOCIAL_HANDLE}`,
    );
  });

  it('builds every social profile from the one shared handle', () => {
    render(<ContactIcons />);

    for (const [name, href] of [
      [/instagram/i, `https://www.instagram.com/${SOCIAL_HANDLE}`],
      [/youtube/i, `https://www.youtube.com/@${SOCIAL_HANDLE}`],
      [/tiktok/i, `https://www.tiktok.com/@${SOCIAL_HANDLE}`],
      [/^x /i, `https://x.com/${SOCIAL_HANDLE}`],
    ] as const) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
    }
    expect(SOCIAL_HANDLE).toBe('fabioassuncaohq');
  });

  it('announces off-site links as opening in a new tab', () => {
    render(<ContactIcons />);

    for (const link of screen.getAllByRole('link')) {
      if (link.getAttribute('href')?.startsWith('mailto:')) {
        expect(link).not.toHaveAttribute('target');
        expect(link.getAttribute('aria-label')).toBe('E-mail');
      } else {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link.getAttribute('aria-label')).toMatch(
          /\(abre em nova aba\)$/,
        );
      }
    }
  });

  it('can omit email when the page already has a primary email action', () => {
    render(<ContactIcons includeEmail={false} />);

    expect(
      screen.queryByRole('link', { name: /e-mail/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });
});
