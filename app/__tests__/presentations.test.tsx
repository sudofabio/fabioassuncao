import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import presentations from '@/data/presentations';
import PresentationPage, {
  dynamicParams,
  generateStaticParams,
} from '../presentations/[slug]/page';
import PresentationsPage from '../presentations/page';

/**
 * Printed as a QR code on the talk's closing slide. It can never change, and
 * no other talk URL may exist alongside it by accident.
 */
const TALK_SLUG =
  'alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor';
const TALK_TITLE =
  'Além do código: Inteligência artificial e o novo desenvolvedor';

const stripTrailingSlash = (href: string | null) => href?.replace(/\/$/, '');

async function renderTalk() {
  return render(
    await PresentationPage({ params: Promise.resolve({ slug: TALK_SLUG }) }),
  );
}

/** The shared closing call to action (`QuoteCta`): the chat, then WhatsApp. */
function expectQuoteCta() {
  const cta = screen.getByRole('complementary', {
    name: /vamos conversar|palestra/i,
  });
  const talk = within(cta).getByRole('link', { name: 'Fale comigo' });
  expect(talk.getAttribute('href')).toMatch(/^\/contato\/?$/);
  const whatsapp = within(cta).getByRole('link', { name: /whatsapp/i });
  expect(whatsapp.getAttribute('href')).toMatch(/^https:\/\/wa\.me\//);
  expect(whatsapp).toHaveAttribute('target', '_blank');
  expect(whatsapp).toHaveTextContent('(abre em nova aba)');
  expect(within(cta).queryByText(/orçamento/i)).not.toBeInTheDocument();
}

describe('presentations index', () => {
  it('lists the talk, linking to its permanent URL', () => {
    render(<PresentationsPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Palestras' }),
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: new RegExp(TALK_TITLE) });
    expect(stripTrailingSlash(link.getAttribute('href'))).toBe(
      `/presentations/${TALK_SLUG}`,
    );
    expect(link).toHaveTextContent('10º Talk — Vale do Pindaré Tech');
  });

  it('closes with the call to the chat and WhatsApp', () => {
    render(<PresentationsPage />);

    expectQuoteCta();
  });
});

describe('talk page routes', () => {
  it('exports exactly the published talk slug', () => {
    expect(generateStaticParams()).toEqual([{ slug: TALK_SLUG }]);
    expect(presentations.map((talk) => talk.slug)).toEqual([TALK_SLUG]);
  });

  it('refuses unknown slugs rather than rendering them on demand', () => {
    expect(dynamicParams).toBe(false);
  });
});

describe('talk page', () => {
  it('shows the title, event, venue, and date in Brazilian Portuguese', async () => {
    const { container } = await renderTalk();

    expect(
      screen.getByRole('heading', { level: 1, name: TALK_TITLE }),
    ).toBeInTheDocument();
    const facts = container.querySelector('.talk-facts') as HTMLElement;
    expect(
      within(facts).getByText('10º Talk — Vale do Pindaré Tech'),
    ).toBeInTheDocument();
    expect(facts).toHaveTextContent('IFMA Campus Santa Inês, Santa Inês/MA');
    const date = facts.querySelector('time');
    expect(date).toHaveAttribute('dateTime', '2026-07-10');
    expect(date).toHaveTextContent('10 de julho de 2026');
  });

  it('links the slides PDF, which ships in public/', async () => {
    await renderTalk();

    const slides = screen.getByRole('link', { name: /slides \(pdf\)/i });
    const href = slides.getAttribute('href') ?? '';
    expect(href).toBe('/presentations/alem-do-codigo/slides.pdf');
    expect(existsSync(join(process.cwd(), 'public', href))).toBe(true);
  });

  it('links the written summary of the talk', async () => {
    await renderTalk();

    expect(
      stripTrailingSlash(
        screen.getByRole('link', { name: 'Ler o resumo' }).getAttribute('href'),
      ),
    ).toBe('/writing/alem-do-codigo-ia-e-o-novo-desenvolvedor');
  });

  it('offers the contacts and the quote call to action', async () => {
    await renderTalk();

    const contacts = screen.getByRole('region', { name: 'Contatos' });
    expect(
      within(contacts).getByRole('link', { name: 'E-mail' }),
    ).toHaveAttribute('href', 'mailto:contato@fabioassuncao.com');
    expectQuoteCta();
  });
});
