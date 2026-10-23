import { afterEach, describe, expect, it, vi } from 'vitest';

import { RESEND_API_URL, TURNSTILE_VERIFY_URL } from '../_lib/delivery';
import {
  DEFAULT_LEAD_SENDER,
  type Env,
  LEAD_RECIPIENT,
  MAX_BODY_BYTES,
  onRequest,
  onRequestPost,
} from '../api/lead';

const URL_ = 'https://fabioassuncao.com/api/lead';
const WEBHOOK = 'https://hooks.example/lead';

const fields = {
  name: 'Maria Silva',
  reason: 'construir',
  systems: ['sistema-web'],
  owner: 'fornecedor',
  role: 'dono',
  budget: '20-50k',
  origin: 'instagram',
  whatsapp: '98988887777',
  email: 'maria@example.com',
  consent: true,
  utm: { utm_source: 'instagram', utm_medium: 'bio' },
  turnstileToken: 'token-123',
};

const configured: Env = {
  TURNSTILE_SECRET_KEY: 'secret',
  RESEND_API_KEY: 're_test',
};

function jsonRequest(body: unknown, headers: HeadersInit = {}): Request {
  return new Request(URL_, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

/** Stubs Turnstile, Resend and the webhook, recording every call. */
function stubUpstream({
  turnstile = true,
  resend = true,
  webhook = true,
}: {
  turnstile?: boolean;
  resend?: boolean;
  webhook?: boolean;
} = {}) {
  const fetchMock = vi.fn(
    async (input: string | URL | Request, _init?: RequestInit) => {
      const url = String(input);
      if (url === TURNSTILE_VERIFY_URL) {
        return Response.json({ success: turnstile });
      }
      if (url === RESEND_API_URL) {
        return resend
          ? Response.json({ id: 'email-1' })
          : new Response('{}', { status: 500 });
      }
      if (url === WEBHOOK) {
        return webhook ? new Response('ok') : new Response('', { status: 500 });
      }
      throw new Error(`unexpected fetch ${url}`);
    },
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function callsTo(fetchMock: ReturnType<typeof stubUpstream>, url: string) {
  return fetchMock.mock.calls.filter(([input]) => String(input) === url);
}

function bodyOf(
  fetchMock: ReturnType<typeof stubUpstream>,
  url: string,
): Record<string, unknown> {
  const [, init] = callsTo(fetchMock, url)[0];
  return JSON.parse(String(init?.body));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('/api/lead', () => {
  it('answers 405 with Allow: POST for other methods', async () => {
    const response = onRequest();

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
  });

  it('accepts only JSON', async () => {
    const fetchMock = stubUpstream();
    const response = await onRequestPost({
      request: new Request(URL_, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'name=Maria',
      }),
      env: configured,
    });

    expect(response.status).toBe(415);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 413 for an oversized body', async () => {
    const fetchMock = stubUpstream();
    const response = await onRequestPost({
      request: jsonRequest({ ...fields, company: 'x'.repeat(MAX_BODY_BYTES) }),
      env: configured,
    });

    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('stops reading a chunked body once it passes the limit', async () => {
    const fetchMock = stubUpstream();
    const chunk = new TextEncoder().encode('x'.repeat(4096));
    let pulled = 0;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 1;
        controller.enqueue(chunk);
      },
    });
    const request = new Request(URL_, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      duplex: 'half',
    } as RequestInit);

    const response = await onRequestPost({ request, env: configured });

    expect(response.status).toBe(413);
    expect(pulled).toBeLessThan(MAX_BODY_BYTES / chunk.byteLength + 3);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 400 for malformed JSON and for invalid answers', async () => {
    const fetchMock = stubUpstream();

    const malformed = await onRequestPost({
      request: jsonRequest('{"name":'),
      env: configured,
    });
    const invalid = await onRequestPost({
      request: jsonRequest({ ...fields, budget: 'muito' }),
      env: configured,
    });

    expect(malformed.status).toBe(400);
    expect(invalid.status).toBe(400);
    expect(await invalid.json()).toMatchObject({
      ok: false,
      errors: { budget: 'Escolha uma faixa de investimento da lista.' },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 503 without naming the missing secret', async () => {
    const fetchMock = stubUpstream();

    for (const env of [
      {},
      { TURNSTILE_SECRET_KEY: 'secret' },
      { RESEND_API_KEY: 're_test' },
    ]) {
      const response = await onRequestPost({
        request: jsonRequest(fields),
        env,
      });
      const text = await response.text();

      expect(response.status).toBe(503);
      expect(text).not.toMatch(/TURNSTILE|RESEND/);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 403 when Turnstile rejects the token, without sending', async () => {
    const fetchMock = stubUpstream({ turnstile: false });

    const response = await onRequestPost({
      request: jsonRequest(fields),
      env: { ...configured, LEAD_WEBHOOK_URL: WEBHOOK },
    });

    expect(response.status).toBe(403);
    expect(callsTo(fetchMock, RESEND_API_URL)).toHaveLength(0);
    expect(callsTo(fetchMock, WEBHOOK)).toHaveLength(0);
  });

  it('mails the lead and returns the score it computed itself', async () => {
    const fetchMock = stubUpstream();

    const response = await onRequestPost({
      // A client-sent score is ignored: dono + construir + R$ 20–50 mil = 7.
      request: jsonRequest({ ...fields, score: 99, temperature: 'audiencia' }),
      env: configured,
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({
      ok: true,
      score: 7,
      temperature: 'quente',
      closing: 'fit',
    });

    const mail = bodyOf(fetchMock, RESEND_API_URL);
    expect(mail.to).toEqual([LEAD_RECIPIENT]);
    expect(mail.from).toBe(DEFAULT_LEAD_SENDER);
    expect(mail.reply_to).toBe('maria@example.com');
    expect(mail.subject).toMatch(/^\[QUENTE\] Maria Silva: /);
    expect(String(mail.text)).toContain('Pontuação: 7');
    expect(callsTo(fetchMock, WEBHOOK)).toHaveLength(0);
  });

  it('flags incidents and omits reply_to without an e-mail', async () => {
    const fetchMock = stubUpstream();
    const { email: _e, ...noEmail } = fields;

    const response = await onRequestPost({
      request: jsonRequest({ ...noEmail, reason: 'incidente' }),
      env: configured,
    });

    expect(await response.json()).toMatchObject({ closing: 'incidente' });
    const mail = bodyOf(fetchMock, RESEND_API_URL);
    expect(mail.subject).toMatch(/^\[INCIDENTE\] /);
    expect('reply_to' in mail).toBe(false);
  });

  it('prefers LEAD_FROM_EMAIL, then QUOTE_FROM_EMAIL, as the sender', async () => {
    const fetchMock = stubUpstream();

    await onRequestPost({
      request: jsonRequest(fields),
      env: {
        ...configured,
        LEAD_FROM_EMAIL: 'Leads <leads@fabioassuncao.com>',
        QUOTE_FROM_EMAIL: 'Orçamento <orcamento@fabioassuncao.com>',
      },
    });
    await onRequestPost({
      request: jsonRequest(fields),
      env: {
        ...configured,
        QUOTE_FROM_EMAIL: 'Orçamento <orcamento@fabioassuncao.com>',
      },
    });

    const senders = callsTo(fetchMock, RESEND_API_URL).map(
      ([, init]) => JSON.parse(String(init?.body)).from,
    );
    expect(senders).toEqual([
      'Leads <leads@fabioassuncao.com>',
      'Orçamento <orcamento@fabioassuncao.com>',
    ]);
  });

  it('posts the recorded fields to the optional webhook', async () => {
    const fetchMock = stubUpstream();

    const response = await onRequestPost({
      request: jsonRequest(fields),
      env: { ...configured, LEAD_WEBHOOK_URL: WEBHOOK },
    });

    expect(response.status).toBe(200);
    expect(bodyOf(fetchMock, WEBHOOK)).toMatchObject({
      nome: 'Maria Silva',
      motivo: 'construir',
      pontuacao: 7,
      temperatura: 'quente',
      utm_source: 'instagram',
      consentimento: true,
    });
  });

  it('still answers 200 when only one channel takes the lead', async () => {
    stubUpstream({ webhook: false });
    const webhookDown = await onRequestPost({
      request: jsonRequest(fields),
      env: { ...configured, LEAD_WEBHOOK_URL: WEBHOOK },
    });
    vi.unstubAllGlobals();

    stubUpstream({ resend: false });
    const mailDown = await onRequestPost({
      request: jsonRequest(fields),
      env: { ...configured, LEAD_WEBHOOK_URL: WEBHOOK },
    });

    expect(webhookDown.status).toBe(200);
    expect(mailDown.status).toBe(200);
  });

  it('returns 502 when no channel takes the lead', async () => {
    stubUpstream({ resend: false, webhook: false });
    const withWebhook = await onRequestPost({
      request: jsonRequest(fields),
      env: { ...configured, LEAD_WEBHOOK_URL: WEBHOOK },
    });
    const withoutWebhook = await onRequestPost({
      request: jsonRequest(fields),
      env: configured,
    });

    expect(withWebhook.status).toBe(502);
    expect(withoutWebhook.status).toBe(502);
  });
});
