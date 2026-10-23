import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import contact, { WHATSAPP_DISPLAY } from '@/data/contact';
import profile from '@/data/profile.json';

import ContactPage, { metadata } from '../contato/page';

describe('/contato/ page', () => {
  it('opens as "Fale comigo" with the qualification chat', () => {
    const { container } = render(<ContactPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Fale comigo' }),
    ).toBeInTheDocument();
    expect(container.querySelector('.chat')).not.toBeNull();
    expect(container.querySelector('.chat-bubble--fabio')).toHaveTextContent(
      'Oi! Eu sou o Fábio. Como posso te chamar?',
    );
  });

  it('keeps the direct channels visible for anyone who would rather talk', () => {
    render(<ContactPage />);

    const direct = screen.getByRole('complementary', {
      name: 'Prefere falar direto?',
    });
    expect(
      within(direct).getByRole('link', {
        name: new RegExp(
          `WhatsApp ${WHATSAPP_DISPLAY.replace(/[()]/g, '\\$&')}`,
        ),
      }),
    ).toHaveAttribute('target', '_blank');
    expect(
      within(direct).getByRole('link', { name: profile.email }),
    ).toHaveAttribute('href', `mailto:${profile.email}`);
    // Every social profile from the shared data, without a second e-mail.
    const profiles = contact.filter((item) => item.id !== 'email');
    const hrefs = within(direct)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    for (const item of profiles) {
      expect(hrefs, item.id).toContain(item.link);
    }
  });

  it('declares /contato/ as its canonical URL', () => {
    expect(metadata.alternates?.canonical).toBe(
      'https://fabioassuncao.com/contato/',
    );
    expect(metadata.title).toBe('Fale comigo');
  });
});
