import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import profile from '@/data/profile.json';

import EmailLink from '../../Contact/EmailLink';

describe('EmailLink', () => {
  it('links to the one public address', () => {
    render(<EmailLink />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `mailto:${profile.email}`);
    expect(profile.email).toBe('contato@fabioassuncao.com');
  });

  it('shows the real address as its visible, accessible name', () => {
    render(<EmailLink />);

    // Static on purpose: no rotating aliases implying a catch-all mailbox.
    expect(
      screen.getByRole('link', { name: profile.email }),
    ).toBeInTheDocument();
    const [local, domain] = profile.email.split('@');
    expect(document.querySelector('.contact-email-prefix')).toHaveTextContent(
      local,
    );
    expect(document.querySelector('.contact-email-domain')).toHaveTextContent(
      `@${domain}`,
    );
  });

  it('never publishes the personal address from the old README', () => {
    const { container } = render(<EmailLink />);

    expect(container.innerHTML).not.toMatch(/gmail\.com/i);
  });
});
