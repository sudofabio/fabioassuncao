/**
 * `POST /api/orcamento` — the quote form on `/trabalhe-comigo/`.
 *
 * A Cloudflare Pages Function, deployed beside the static export in `out/`.
 * Validates on the server (the client checks are a convenience), verifies the
 * Turnstile token, and mails the request through Resend. Secrets come from the
 * Pages project's environment; see `.dev.vars.example` for local development.
 */

import {
  buildEmail,
  sendWithResend,
  validateQuote,
  verifyTurnstile,
} from '../_lib/quote';

export interface Env {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  QUOTE_FROM_EMAIL?: string;
}

/** The slice of Pages' `EventContext` this function reads. */
export interface QuoteContext {
  request: Request;
  env: Env;
}

export const QUOTE_RECIPIENT = 'contato@fabioassuncao.com';
export const DEFAULT_SENDER =
  'Site Fábio Assunção <orcamento@fabioassuncao.com>';

/** Generous for a seven-field form; anything larger is not a person typing. */
export const MAX_BODY_BYTES = 16 * 1024;

function json(status: number, body: unknown, headers?: HeadersInit): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set('Content-Type', 'application/json; charset=utf-8');
  responseHeaders.set('Cache-Control', 'no-store');

  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders,
  });
}

class PayloadTooLarge extends Error {}

/**
 * Reads the body once, bounded, then parses it by content type. Content-Length
 * is checked first but not trusted: chunked bodies omit it, so the byte count
 * of what actually arrived is checked too.
 */
async function readSubmission(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    throw new PayloadTooLarge();
  }

  const buffer = await request.arrayBuffer();
  if (buffer.byteLength > MAX_BODY_BYTES) throw new PayloadTooLarge();

  const contentType = request.headers.get('Content-Type') ?? '';

  if (contentType.includes('application/json')) {
    return JSON.parse(new TextDecoder().decode(buffer));
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const form = await new Response(buffer, {
      headers: { 'Content-Type': contentType },
    }).formData();
    const fields: Record<string, unknown> = {};

    form.forEach((value, key) => {
      // Turnstile's implicit widget names its hidden input this way.
      const field = key === 'cf-turnstile-response' ? 'turnstileToken' : key;
      fields[field] = typeof value === 'string' ? value : null;
    });

    return fields;
  }

  return null;
}

export async function onRequestPost({
  request,
  env,
}: QuoteContext): Promise<Response> {
  let submission: unknown;

  try {
    submission = await readSubmission(request);
  } catch (error) {
    if (error instanceof PayloadTooLarge) {
      return json(413, { ok: false, error: 'Mensagem grande demais.' });
    }
    return json(400, { ok: false, errors: { form: 'Envio inválido.' } });
  }

  const result = validateQuote(submission);
  if (!result.ok) return json(400, { ok: false, errors: result.errors });

  // Report a missing configuration without naming which variable is absent.
  if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY) {
    return json(503, { ok: false, error: 'Serviço de envio não configurado.' });
  }

  const human = await verifyTurnstile(
    result.data.turnstileToken,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP'),
  );
  if (!human) {
    return json(403, {
      ok: false,
      error: 'Não foi possível confirmar a verificação anti-spam.',
    });
  }

  const email = buildEmail(result.data);
  const sent = await sendWithResend({
    apiKey: env.RESEND_API_KEY,
    from: env.QUOTE_FROM_EMAIL || DEFAULT_SENDER,
    to: QUOTE_RECIPIENT,
    replyTo: result.data.email,
    ...email,
  });
  if (!sent) {
    return json(502, {
      ok: false,
      error: 'Não foi possível enviar agora. Tente novamente em instantes.',
    });
  }

  return json(200, { ok: true });
}

/** Every other method. `onRequestPost` takes precedence for POST. */
export function onRequest(): Response {
  return json(
    405,
    { ok: false, error: 'Método não permitido.' },
    { Allow: 'POST' },
  );
}
