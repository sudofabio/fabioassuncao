import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import profile from '@/data/profile.json';
import { getWritingItems } from '@/lib/writing';
import LinksPage from '../links/page';

const stripTrailingSlash = (href: string | null) => href?.replace(/\/$/, '');

describe('links page', () => {
  it('opens with the portrait, the name, and a one-line bio', () => {
    const { container } = render(<LinksPage />);

    expect(container.querySelector('.links-avatar img')).toHaveAttribute(
      'alt',
      profile.name,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: profile.name }),
    ).toBeInTheDocument();
    expect(container.querySelector('.links-bio')?.textContent?.trim()).toMatch(
      /^Desenvolvedor de software e Tech Lead/,
    );
  });

  it('puts WhatsApp and the quote request first, then the networks in order', () => {
    render(<LinksPage />);

    const list = screen.getByRole('list');
    const labels = within(list)
      .getAllByRole('link')
      .map((link) =>
        (link.textContent ?? '').replace(' (abre em nova aba)', '').trim(),
      );

    expect(labels.slice(0, 2)).toEqual([
      'Conversar no WhatsApp',
      'Pedir orçamento',
    ]);
    expect(labels.slice(2, 8)).toEqual([
      'YouTube',
      'Instagram',
      'TikTok',
      'LinkedIn',
      'GitHub',
      'X',
    ]);
  });

  it('leaves Threads out until its profile is confirmed', () => {
    render(<LinksPage />);

    expect(
      screen.queryByRole('link', { name: /threads/i }),
    ).not.toBeInTheDocument();
  });

  it('fills the two conversion actions and links the quote form anchor', () => {
    render(<LinksPage />);

    const whatsapp = screen.getByRole('link', { name: /whatsapp/i });
    expect(whatsapp).toHaveClass('links-button--primary');
    expect(whatsapp.getAttribute('href')).toMatch(
      /^https:\/\/wa\.me\/5598985643922\?text=/,
    );

    const quote = screen.getByRole('link', { name: 'Pedir orçamento' });
    expect(quote).toHaveClass('links-button--primary');
    expect(quote.getAttribute('href')).toMatch(
      /^\/trabalhe-comigo\/?#orcamento$/,
    );
  });

  it('opens every off-site link in a new tab and says so', () => {
    render(<LinksPage />);

    const external = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('http'));

    expect(external.length).toBeGreaterThanOrEqual(7);
    for (const link of external) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link.querySelector('.sr-only')).toHaveTextContent(
        '(abre em nova aba)',
      );
    }
  });

  it('links the latest article', () => {
    const latest = getWritingItems().find((item) => item.date);
    render(<LinksPage />);

    expect(latest).toBeDefined();
    const link = screen.getByRole('link', {
      name: `Último artigo: ${latest?.title}`,
    });
    expect(stripTrailingSlash(link.getAttribute('href'))).toBe(
      stripTrailingSlash(latest?.url ?? null),
    );
  });

  it('hides the footer, keeping the page to one screen of buttons', () => {
    render(<LinksPage />);

    expect(screen.getByRole('main')).toHaveClass('page-main--links');
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });
});
