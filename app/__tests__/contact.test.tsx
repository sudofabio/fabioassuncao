import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ContactPage from '../contact/page';

describe('contact page', () => {
  it('uses the main region as the centering surface without a duplicate footer', () => {
    render(<ContactPage />);

    expect(screen.getByRole('main')).toHaveClass('page-main--contact');
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    // One address on the page: the large readout, not a second icon for it.
    const mailto = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('mailto:'));
    expect(mailto).toHaveLength(1);
    expect(mailto[0]).toHaveAttribute(
      'href',
      'mailto:contato@fabioassuncao.com',
    );
  });

  it('offers the quote request and WhatsApp as actions', () => {
    render(<ContactPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Fale comigo' }),
    ).toBeInTheDocument();
    const quote = screen.getAllByRole('link', { name: /orçamento/i });
    expect(quote.length).toBeGreaterThan(0);
    for (const link of quote) {
      expect(link.getAttribute('href')).toMatch(
        /^\/trabalhe-comigo\/?#orcamento$/,
      );
    }
    const whatsapp = screen.getAllByRole('link', { name: /whatsapp/i });
    expect(whatsapp.length).toBeGreaterThan(0);
    for (const link of whatsapp) {
      expect(link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\//);
      expect(link).toHaveAttribute('target', '_blank');
    }
  });
});
