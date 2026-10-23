import { afterEach, describe, expect, it, vi } from 'vitest';

import { RESEND_API_URL, TURNSTILE_VERIFY_URL } from '../_lib/quote';
import {
  DEFAULT_SENDER,
  type Env,
  MAX_BODY_BYTES,
  onRequest,
  onRequestPost,
  QUOTE_RECIPIENT,
} from '../api/orcamento';

const URL_ = 'https://fabioassuncao.com/api/orcamento';

const fields = {
  name: 'Maria Silva',
  email: 'maria@example.com',
  type: 'palestra',
  scope: 'Palestra de 40 minutos sobre IA para estudantes de computação.',
  deadline: 'Março',
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

/** Stubs the two upstream services, recording every call. */
function stubUpstream({
  turnstile = true,
  resend = true,
}: {
  turnstile?: boolean;
  resend?: boolean;
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
      throw new Error(`unexpected fetch ${url}`);
    },
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

async function bodyOf(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

describe('POST /api/orcamento', () => {
  it('sends a valid JSON submission', async () => {
    const fetchMock = stubUpstream();

    const response = await onRequestPost({
      request: jsonRequest(fields, { 'CF-Connecting-IP': '203.0.113.9' }),
      env: configured,
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe(
      'application/json; charset=utf-8',
    );
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    await expect(bodyOf(response)).resolves.toEqual({ ok: true });

    const turnstileInit = fetchMock.mock.calls[0][1] as unknown as RequestInit;
    expect(
      new URLSearchParams(String(turnstileInit.body)).get('remoteip'),
    ).toBe('203.0.113.9');

    const resendInit = fetchMock.mock.calls[1][1] as unknown as RequestInit;
    const message = JSON.parse(String(resendInit.body));
    expect(message.to).toEqual([QUOTE_RECIPIENT]);
    expect(message.from).toBe(DEFAULT_SENDER);
    expect(message.reply_to).toBe(fields.email);
  });

  it('uses the configured sender when one is set', async () => {
    const fetchMock = stubUpstream();

    await onRequestPost({
      request: jsonRequest(fields),
      env: { ...configured, QUOTE_FROM_EMAIL: 'Orçamentos <o@example.com>' },
    });

    const resendInit = fetchMock.mock.calls[1][1] as unknown as RequestInit;
    expect(JSON.parse(String(resendInit.body)).from).toBe(
      'Orçamentos <o@example.com>',
    );
  });

  it('accepts a form-urlencoded submission with the implicit Turnstile field', async () => {
    stubUpstream();
    const { turnstileToken, ...rest } = fields;
    const body = new URLSearchParams({
      ...rest,
      'cf-turnstile-response': turnstileToken,
    });

    const response = await onRequestPost({
      request: new Request(URL_, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      }),
      env: configured,
    });

    expect(response.status).toBe(200);
  });

  it('accepts a multipart submission', async () => {
    stubUpstream();
    // Encoded by hand: under jsdom the global `FormData` is jsdom's, which the
    // runtime's `Request` does not know how to serialise.
    const boundary = 'quote-boundary';
    const body = `${Object.entries(fields)
      .map(
        ([key, value]) =>
          `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`,
      )
      .join('')}--${boundary}--\r\n`;

    const response = await onRequestPost({
      request: new Request(URL_, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
        body,
      }),
      env: configured,
    });

    expect(response.status).toBe(200);
  });

  it('returns 400 with field errors for an invalid submission', async () => {
    const fetchMock = stubUpstream();

    const response = await onRequestPost({
      request: jsonRequest({ ...fields, email: 'nope' }),
      env: configured,
    });

    expect(response.status).toBe(400);
    const body = await bodyOf(response);
    expect(body.ok).toBe(false);
    expect(body.errors).toHaveProperty('email');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 400 for malformed JSON and unsupported content types', async () => {
    stubUpstream();

    const malformed = await onRequestPost({
      request: jsonRequest('{not json'),
      env: configured,
    });
    const plain = await onRequestPost({
      request: new Request(URL_, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: 'oi',
      }),
      env: configured,
    });

    expect(malformed.status).toBe(400);
    expect(plain.status).toBe(400);
  });

  it('returns 413 for an oversized body', async () => {
    const fetchMock = stubUpstream();

    const response = await onRequestPost({
      request: jsonRequest({ ...fields, scope: 'x'.repeat(MAX_BODY_BYTES) }),
      env: configured,
    });

    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('stops reading a chunked body once it passes the limit', async () => {
    const fetchMock = stubUpstream();
    const chunk = new TextEncoder().encode('x'.repeat(4096));
    let pulled = 0;
    // An endless stream with no Content-Length: only a running count can stop
    // it, so a 413 here proves the body is never buffered whole.
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 1;
        controller.enqueue(chunk);
      },
    });
    const request = new Request('https://fabioassuncao.com/api/orcamento', {
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
      env: configured,
    });

    expect(response.status).toBe(403);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns 502 when Resend fails', async () => {
    stubUpstream({ resend: false });

    const response = await onRequestPost({
      request: jsonRequest(fields),
      env: configured,
    });

    expect(response.status).toBe(502);
    await expect(bodyOf(response)).resolves.toMatchObject({ ok: false });
  });
});

describe('other methods', () => {
  it('returns 405 and advertises POST', async () => {
    const response = onRequest();

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
    await expect(bodyOf(response)).resolves.toMatchObject({ ok: false });
  });
});
