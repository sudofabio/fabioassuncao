import { describe, expect, it, vi } from 'vitest';

import {
  buildEmail,
  escapeHtml,
  QUOTE_TYPES,
  type Quote,
  RESEND_API_URL,
  sendWithResend,
  TURNSTILE_VERIFY_URL,
  validateQuote,
  verifyTurnstile,
} from '../_lib/quote';

const valid = {
  name: 'Maria Silva',
  email: 'maria@example.com',
  whatsapp: '+55 (98) 91234-5678',
  type: 'consultoria',
  scope: 'Preciso revisar a arquitetura de uma API que está lenta.',
  deadline: 'Próximo mês',
  budget: 'R$ 5 mil a R$ 10 mil',
  turnstileToken: 'token-123',
};

describe('validateQuote', () => {
  it('accepts a complete submission', () => {
    const result = validateQuote(valid);

    expect(result).toEqual({ ok: true, data: valid });
  });

  it('accepts every declared type', () => {
    for (const type of QUOTE_TYPES) {
      expect(validateQuote({ ...valid, type }).ok).toBe(true);
    }
  });

  it('trims every field', () => {
    const result = validateQuote({
      ...valid,
      name: '  Maria Silva  ',
      email: ' maria@example.com\n',
    });

    expect(result.ok && result.data.name).toBe('Maria Silva');
    expect(result.ok && result.data.email).toBe('maria@example.com');
  });

  it('omits empty optional fields instead of keeping blank strings', () => {
    const result = validateQuote({ ...valid, whatsapp: '   ', budget: '' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).not.toHaveProperty('whatsapp');
      expect(result.data).not.toHaveProperty('budget');
    }
  });

  it('reports every missing required field in Portuguese', () => {
    const result = validateQuote({});

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(
        ['deadline', 'email', 'name', 'scope', 'turnstileToken', 'type'].sort(),
      );
      expect(result.errors.name).toBe('Nome é obrigatório.');
      // Feminine labels agree in gender.
      expect(result.errors.scope).toBe('Descrição do escopo é obrigatória.');
      expect(result.errors.turnstileToken).toBe(
        'Verificação anti-spam é obrigatória.',
      );
    }
  });

  it('rejects values that are not strings', () => {
    const result = validateQuote({ ...valid, name: ['Maria'], scope: 42 });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toMatch(/texto/);
      expect(result.errors.scope).toMatch(/texto/);
    }
  });

  it.each([null, 'string', 42, ['a']])(
    'rejects a non-object body (%j)',
    (input) => {
      expect(validateQuote(input)).toEqual({
        ok: false,
        errors: { form: 'Envio inválido.' },
      });
    },
  );

  it('enforces length bounds', () => {
    const result = validateQuote({
      ...valid,
      name: 'M',
      scope: 'curto',
      budget: 'x'.repeat(121),
      turnstileToken: 'x'.repeat(2049),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(
        ['budget', 'name', 'scope', 'turnstileToken'].sort(),
      );
    }
  });

  it('rejects a malformed e-mail', () => {
    const result = validateQuote({ ...valid, email: 'maria@example' });

    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.errors.email).toBe('Informe um e-mail válido.');
  });

  it.each(['abc12345678', '1234567', '1'.repeat(21)])(
    'rejects an implausible WhatsApp (%s)',
    (whatsapp) => {
      const result = validateQuote({ ...valid, whatsapp });

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors).toHaveProperty('whatsapp');
    },
  );

  it('rejects a type outside the enum', () => {
    const result = validateQuote({ ...valid, type: 'freela' });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toHaveProperty('type');
  });
});

describe('buildEmail', () => {
  const quote = validateQuote(valid);
  const data = (quote.ok ? quote.data : undefined) as Quote;

  it('labels the type and includes every field in the text body', () => {
    const email = buildEmail(data);

    expect(email.subject).toBe(
      'Pedido de orçamento (Consultoria): Maria Silva',
    );
    expect(email.text).toContain('WhatsApp: +55 (98) 91234-5678');
    expect(email.text).toContain(valid.scope);
  });

  it('escapes visitor-supplied HTML', () => {
    const email = buildEmail({
      ...data,
      name: '<img src=x onerror=alert(1)>',
      scope: '<script>alert("x")</script> & mais',
    });

    expect(email.html).not.toContain('<script>');
    expect(email.html).not.toContain('<img');
    expect(email.html).toContain(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; mais',
    );
  });

  it('keeps line breaks out of the subject', () => {
    const email = buildEmail({ ...data, name: 'Maria\r\nBcc: x@y.z' });

    expect(email.subject).not.toMatch(/[\r\n]/);
  });

  it('shows a dash for absent optional fields', () => {
    const { whatsapp: _w, budget: _b, ...rest } = data;
    const email = buildEmail(rest);

    expect(email.text).toContain('WhatsApp: —');
    expect(email.text).toContain('Faixa de investimento: —');
  });
});

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
