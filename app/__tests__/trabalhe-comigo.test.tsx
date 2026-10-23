import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import WorkWithMePage from '../trabalhe-comigo/page';

describe('trabalhe comigo page', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('opens on the client pains, then the formats, then the quote form', () => {
    render(<WorkWithMePage />);

    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Trabalhe comigo' }),
    ).toBeInTheDocument();
    expect(headings).toEqual([
      'Isso é você?',
      'Como posso ajudar',
      'Pedir orçamento',
      'Ainda não é a hora?',
    ]);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  it('anchors the quote section at #orcamento, where every CTA points', () => {
    const { container } = render(<WorkWithMePage />);

    const section = container.querySelector('section#orcamento');
    expect(section).not.toBeNull();
    expect(section).toHaveAttribute('aria-labelledby', 'work-quote-title');
    expect(section?.querySelector('form.quote-form')).not.toBeNull();
  });

  it('labels every field the server validates', () => {
    render(<WorkWithMePage />);

    const form = screen.getByRole('group', { name: 'Pedido de orçamento' });
    const fields = [
      ['Nome', 'name'],
      ['E-mail', 'email'],
      ['WhatsApp (opcional)', 'whatsapp'],
      ['Tipo de trabalho', 'type'],
      ['Descrição do escopo', 'scope'],
      ['Prazo', 'deadline'],
      ['Faixa de investimento (opcional)', 'budget'],
    ] as const;

    for (const [label, name] of fields) {
      expect(within(form).getByLabelText(label)).toHaveAttribute('name', name);
    }
    for (const required of ['Nome', 'E-mail', 'Tipo de trabalho', 'Prazo']) {
      expect(within(form).getByLabelText(required)).toBeRequired();
    }
    expect(within(form).getByLabelText('Descrição do escopo')).toBeRequired();
    expect(
      within(form).getByLabelText('WhatsApp (opcional)'),
    ).not.toBeRequired();
  });

  it('offers exactly the four work types', () => {
    render(<WorkWithMePage />);

    const select = screen.getByLabelText('Tipo de trabalho');
    const options = within(select)
      .getAllByRole('option')
      .filter((option) => option.getAttribute('value') !== '')
      .map((option) => [option.getAttribute('value'), option.textContent]);

    expect(options).toEqual([
      ['consultoria', 'Consultoria'],
      ['palestra', 'Palestra'],
      ['mentoria', 'Mentoria'],
      ['outro', 'Outro'],
    ]);
  });

  it('posts through script only, so the static export has no dead form target', () => {
    const { container } = render(<WorkWithMePage />);

    expect(container.querySelector('form')).not.toHaveAttribute('action');
  });

  it('disables the form without a Turnstile site key and points to e-mail and WhatsApp', async () => {
    // The key is read when the module loads, so load it fresh without one.
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', '');
    vi.resetModules();
    const { default: Page } = await import('../trabalhe-comigo/page');
    const { container } = render(<Page />);

    const fieldset = screen.getByRole('group', { name: 'Pedido de orçamento' });
    expect(fieldset).toBeDisabled();

    const notice = container.querySelector('#quote-disabled');
    expect(notice).not.toBeNull();
    expect(
      within(notice as HTMLElement).getByRole('link', {
        name: 'contato@fabioassuncao.com',
      }),
    ).toHaveAttribute('href', 'mailto:contato@fabioassuncao.com');
    expect(
      within(notice as HTMLElement)
        .getByRole('link', { name: /whatsapp/i })
        .getAttribute('href'),
    ).toMatch(/^https:\/\/wa\.me\/5598985643922\?text=/);
    expect(container.querySelector('.quote-turnstile')).toBeNull();
  });

  it('enables the form and mounts the Turnstile slot when a site key is built in', async () => {
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', '1x00000000000000000000AA');
    vi.resetModules();
    const { default: Page } = await import('../trabalhe-comigo/page');
    const { container } = render(<Page />);

    expect(
      screen.getByRole('group', { name: 'Pedido de orçamento' }),
    ).not.toBeDisabled();
    expect(container.querySelector('#quote-disabled')).toBeNull();
    expect(container.querySelector('.quote-turnstile')).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Enviar pedido' }),
    ).toHaveAttribute('type', 'submit');
  });
});
