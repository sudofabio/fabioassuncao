import { describe, expect, it, vi } from 'vitest';

import {
  escapeHtml,
  RESEND_API_URL,
  sendWithResend,
  TURNSTILE_VERIFY_URL,
  verifyTurnstile,
} from '../_lib/delivery';

describe('escapeHtml', () => {
  it('escapes the five significant characters', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;');
  });
});

describe('verifyTurnstile', () => {
  it('posts the token, secret, and IP and reads success', async () => {
    const fetchImpl = vi.fn(async () => Response.json({ success: true }));

    await expect(
      verifyTurnstile('tok', 'secret', '203.0.113.1', fetchImpl),
    ).resolves.toBe(true);

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe(TURNSTILE_VERIFY_URL);
    const body = new URLSearchParams(String(init.body));
    expect(body.get('secret')).toBe('secret');
    expect(body.get('response')).toBe('tok');
    expect(body.get('remoteip')).toBe('203.0.113.1');
  });

  it('omits remoteip when unknown', async () => {
    const fetchImpl = vi.fn(async () => Response.json({ success: true }));

    await verifyTurnstile('tok', 'secret', null, fetchImpl);

    const [, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(new URLSearchParams(String(init.body)).has('remoteip')).toBe(false);
  });

  it('fails closed on a negative answer, an HTTP error, or a network error', async () => {
    await expect(
      verifyTurnstile('t', 's', null, async () =>
        Response.json({ success: false }),
      ),
    ).resolves.toBe(false);
    await expect(
      verifyTurnstile(
        't',
        's',
        null,
        async () => new Response('', { status: 500 }),
      ),
    ).resolves.toBe(false);
    await expect(
      verifyTurnstile('t', 's', null, async () => {
        throw new Error('offline');
      }),
    ).resolves.toBe(false);
  });
});

describe('sendWithResend', () => {
  const message = {
    apiKey: 're_test',
    from: 'Site <orcamento@example.com>',
    to: 'contato@example.com',
    replyTo: 'maria@example.com',
    subject: 'Assunto',
    text: 'texto',
    html: '<p>texto</p>',
  };

  it('posts an authorised JSON message and reports success', async () => {
    const fetchImpl = vi.fn(async () => Response.json({ id: '1' }));

    await expect(sendWithResend(message, fetchImpl)).resolves.toBe(true);

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe(RESEND_API_URL);
    expect(new Headers(init.headers).get('Authorization')).toBe(
      'Bearer re_test',
    );
    expect(JSON.parse(String(init.body))).toEqual({
      from: message.from,
      to: [message.to],
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  });

  it('reports failure on an HTTP error or a network error', async () => {
    await expect(
      sendWithResend(message, async () => new Response('', { status: 422 })),
    ).resolves.toBe(false);
    await expect(
      sendWithResend(message, async () => {
        throw new Error('offline');
      }),
    ).resolves.toBe(false);
  });
});
