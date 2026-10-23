import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import profile from '@/data/profile.json';

import PrivacyPage, { metadata } from '../privacidade/page';

describe('/privacidade/ page', () => {
  it('covers who is responsible, what is collected, sharing, and rights', () => {
    const { container } = render(<PrivacyPage />);
    const page = container.querySelector('article') as HTMLElement;

    expect(
      [...page.querySelectorAll('h2')].map((heading) => heading.textContent),
    ).toEqual([
      'Quem é o responsável',
      'O que é coletado e para quê',
      'Com quem os dados são compartilhados',
      'Seus direitos',
    ]);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Política de privacidade',
      }),
    ).toBeInTheDocument();
  });

  it('names the services that actually touch the data', () => {
    const { container } = render(<PrivacyPage />);
    const text = container.querySelector('article')?.textContent ?? '';

    expect(text).toMatch(/Turnstile/);
    expect(text).toMatch(/Resend/);
    expect(text).toMatch(/Cloudflare/);
  });

  it('loads measurement only after consent', () => {
    const { container } = render(<PrivacyPage />);
    const text = container.querySelector('article')?.textContent ?? '';

    expect(text).toMatch(/só depois que\s+você clica em .Aceitar./);
    expect(text).toMatch(/Se você recusar, nada disso\s+é carregado/);
  });

  it('lists the LGPD rights and where to exercise them', () => {
    const { container } = render(<PrivacyPage />);
    const page = container.querySelector('article') as HTMLElement;

    expect(page.textContent).toMatch(/LGPD/);
    expect(page.textContent).toMatch(/revogar o consentimento/);
    const emails = [...page.querySelectorAll('a[href^="mailto:"]')];
    expect(emails.length).toBeGreaterThan(0);
    for (const email of emails) {
      expect(email).toHaveAttribute('href', `mailto:${profile.email}`);
    }
  });

  it('declares /privacidade/ as its canonical URL', () => {
    expect(metadata.alternates?.canonical).toBe(
      'https://fabioassuncao.com/privacidade/',
    );
  });
});
