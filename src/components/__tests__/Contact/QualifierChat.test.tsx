import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  siteKey: '',
  renderWidget: vi.fn(
    (_container: HTMLElement, options: { callback: (t: string) => void }) => {
      options.callback('token-123');
      return 'widget-1';
    },
  ),
  trackLead: vi.fn(),
}));

vi.mock('@/lib/turnstile', () => ({
  get TURNSTILE_SITE_KEY() {
    return state.siteKey;
  },
  loadTurnstile: () =>
    Promise.resolve({ render: state.renderWidget, reset: vi.fn() }),
}));

vi.mock('@/lib/analytics', () => ({
  trackLead: state.trackLead,
  onWhatsappClick: vi.fn(),
}));

import QualifierChat from '../../Contact/QualifierChat';

function answerName(name: string) {
  const input = screen.getByPlaceholderText('Seu nome');
  fireEvent.change(input, { target: { value: name } });
  fireEvent.submit(input.closest('form') as HTMLFormElement);
}

function choose(label: string | RegExp) {
  fireEvent.click(screen.getByRole('button', { name: label }));
}

/** Answers every question up to the contact step. */
function reachContact(reason: RegExp = /Quero construir/) {
  answerName('Ana');
  choose(reason);
  fireEvent.click(screen.getByLabelText('Sistema web/ERP próprio'));
  choose('Continuar');
  choose('Fornecedor/agência');
  choose('Dono/sócio');
  choose('R$ 20–50 mil');
  choose('Google');
}

function fillContact() {
  fireEvent.change(screen.getByLabelText('WhatsApp'), {
    target: { value: '(98) 90000-0000' },
  });
  fireEvent.click(screen.getByRole('checkbox', { name: /Concordo/ }));
}

beforeEach(() => {
  window.history.replaceState(
    {},
    '',
    '/contato/?utm_source=instagram&utm_medium=bio&utm_campaign=autoridade-2026q4&fbclid=x',
  );
});

afterEach(() => {
  state.siteKey = '';
  state.renderWidget.mockClear();
  state.trackLead.mockClear();
  vi.unstubAllGlobals();
});

describe('QualifierChat', () => {
  it('opens on the name question and moves no focus before the first answer', () => {
    render(<QualifierChat />);

    expect(document.querySelector('.chat-bubble--fabio')).toHaveTextContent(
      'Oi! Eu sou o Fábio. Como posso te chamar?',
    );
    expect(document.activeElement).toBe(document.body);
  });

  it('asks one question at a time and keeps the answers in a live log', () => {
    render(<QualifierChat />);

    answerName('Ana');
    expect(
      screen.getByText('Prazer, Ana! O que te trouxe aqui hoje?'),
    ).toBeInTheDocument();
    choose(/Quero construir/);

    const log = document.querySelector('.chat-log') as HTMLElement;
    expect(log).toHaveAttribute('aria-live', 'polite');
    expect(within(log).getByText('Ana')).toBeInTheDocument();
    expect(
      within(log).getByText('Quero construir um sistema, app ou plataforma'),
    ).toBeInTheDocument();
    const bubbles = document.querySelectorAll('.chat-bubble--fabio');
    expect(bubbles[bubbles.length - 1]).toHaveTextContent(
      /Me conta rapidinho do seu cenário/,
    );
  });

  it('offers WhatsApp at once when the visitor reports an incident', () => {
    render(<QualifierChat />);

    answerName('Ana');
    choose(/Saiu uma falha/);

    const urgent = document.querySelector('.chat-urgent') as HTMLElement;
    expect(urgent).toHaveTextContent('Se for urgente');
    const link = within(urgent).getByRole('link');
    expect(link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(decodeURIComponent(link.getAttribute('href') ?? '')).toMatch(
      /Aqui é Ana.*incidente/,
    );
  });

  it('skips the scenario question for mentorship', () => {
    render(<QualifierChat />);

    answerName('Ana');
    choose(/mentoria/);
    expect(screen.getByText('Quem cuida dele hoje?')).toBeInTheDocument();
  });

  it('disables the contact step without a Turnstile key and points to direct channels', () => {
    render(<QualifierChat />);
    reachContact();

    const fieldset = document.querySelector(
      '.chat-contact fieldset',
    ) as HTMLFieldSetElement;
    expect(fieldset).toBeDisabled();
    const notice = document.querySelector('.chat-contact .quote-notice');
    expect(notice).toHaveTextContent('ainda não está disponível');
    expect(notice?.querySelector('a[href^="https://wa.me/"]')).not.toBeNull();
    expect(notice?.querySelector('a[href^="mailto:"]')).not.toBeNull();
  });

  it('posts the answers with the URL UTMs and no client score, then shows the fit closing', async () => {
    state.siteKey = '1x00000000000000000000AA';
    const fetchMock = vi.fn(async () =>
      Response.json({
        ok: true,
        score: 9,
        temperature: 'quente',
        closing: 'fit',
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    render(<QualifierChat />);
    reachContact();
    await waitFor(() => expect(state.renderWidget).toHaveBeenCalled());
    fillContact();
    fireEvent.submit(
      document.querySelector('.chat-contact') as HTMLFormElement,
    );

    expect(
      await screen.findByText(/Te respondo em até 24 h úteis/),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe('/api/lead');
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      name: 'Ana',
      reason: 'construir',
      systems: ['sistema-web'],
      owner: 'fornecedor',
      role: 'dono',
      budget: '20-50k',
      origin: 'google',
      whatsapp: '(98) 90000-0000',
      consent: true,
      turnstileToken: 'token-123',
      utm: {
        utm_source: 'instagram',
        utm_medium: 'bio',
        utm_campaign: 'autoridade-2026q4',
      },
    });
    expect(body).not.toHaveProperty('score');
    expect(body).not.toHaveProperty('temperature');
    expect(body.utm).not.toHaveProperty('fbclid');
    expect(state.trackLead).toHaveBeenCalledWith({
      score: 9,
      temperature: 'quente',
      budget: '20-50k',
    });
  });

  it('shows the server error with WhatsApp and e-mail as alternatives', async () => {
    state.siteKey = '1x00000000000000000000AA';
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json(
          { ok: false, error: 'Serviço de envio não configurado.' },
          { status: 503 },
        ),
      ),
    );

    render(<QualifierChat />);
    reachContact();
    await waitFor(() => expect(state.renderWidget).toHaveBeenCalled());
    fillContact();
    fireEvent.submit(
      document.querySelector('.chat-contact') as HTMLFormElement,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Serviço de envio não configurado.');
    expect(alert.querySelector('a[href^="https://wa.me/"]')).not.toBeNull();
    expect(alert.querySelector('a[href^="mailto:"]')).not.toBeNull();
    expect(state.trackLead).not.toHaveBeenCalled();
  });

  it('starts over from the first question', () => {
    render(<QualifierChat />);

    answerName('Ana');
    choose(/Quero usar IA/);
    choose('Recomeçar');

    expect(document.querySelectorAll('.chat-turn')).toHaveLength(1);
    expect(screen.getByPlaceholderText('Seu nome')).toBeInTheDocument();
  });
});
