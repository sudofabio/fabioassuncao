/**
 * `POST /api/lead`: the qualification chat on `/contato/`.
 *
 * A Cloudflare Pages Function, deployed beside the static export in
 * `dist/client/`. It validates on the server, verifies the Turnstile token,
 * recomputes the score from the answers (a client-sent score is ignored),
 * mails the lead through Resend and, when `LEAD_WEBHOOK_URL` is set, posts it
 * to a webhook as well. Secrets come from the Pages project's environment;
 * see `.dev.vars.example` for local development.
 */

import { sendWithResend, verifyTurnstile } from '../_lib/delivery';
import {
  json,
  methodNotAllowed,
  PayloadTooLarge,
  readBounded,
} from '../_lib/http';
import { closingFor, scoreLead, temperatureFor } from '../_lib/lead';
import {
  buildLeadEmail,
  leadWebhookPayload,
  postLeadWebhook,
} from '../_lib/lead-delivery';
import { validateLead } from '../_lib/lead-validation';

export interface Env {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  LEAD_FROM_EMAIL?: string;
  /** Kept as a fallback so one verified sender serves both endpoints. */
  QUOTE_FROM_EMAIL?: string;
  LEAD_WEBHOOK_URL?: string;
}

/** The slice of Pages' `EventContext` this function reads. */
export interface LeadContext {
  request: Request;
  env: Env;
}

export const LEAD_RECIPIENT = 'contato@fabioassuncao.com';
export const DEFAULT_LEAD_SENDER =
  'Site Fábio Assunção <contato@fabioassuncao.com>';

/** A dozen short answers; anything larger is not a person in a chat. */
export const MAX_BODY_BYTES = 16 * 1024;

const NOT_SENT = 'Não foi possível enviar agora. Tente novamente em instantes.';

export async function onRequestPost({
  request,
  env,
}: LeadContext): Promise<Response> {
  const contentType = request.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/json')) {
    await request.body?.cancel();
    return json(415, { ok: false, error: 'Envie os dados em JSON.' });
  }

  let submission: unknown;
  try {
    const buffer = await readBounded(request, MAX_BODY_BYTES);
    submission = JSON.parse(new TextDecoder().decode(buffer));
  } catch (error) {
    if (error instanceof PayloadTooLarge) {
      return json(413, { ok: false, error: 'Mensagem grande demais.' });
    }
    return json(400, { ok: false, errors: { form: 'Envio inválido.' } });
  }

  const result = validateLead(submission);
  if (!result.ok) return json(400, { ok: false, errors: result.errors });

  // Report a missing configuration without naming which variable is absent.
  if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY) {
    return json(503, { ok: false, error: 'Serviço de envio não configurado.' });
  }

  const { turnstileToken, ...lead } = result.data;

  const human = await verifyTurnstile(
    turnstileToken,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP'),
  );
  if (!human) {
    return json(403, {
      ok: false,
      error: 'Não foi possível confirmar a verificação anti-spam.',
    });
  }

  const score = scoreLead(lead);
  const temperature = temperatureFor(score);
  const closing = closingFor(lead);
  const receivedAt = new Date().toISOString();

  const email = buildLeadEmail(lead, score, temperature, receivedAt);
  const [mailed, hooked] = await Promise.all([
    sendWithResend({
      apiKey: env.RESEND_API_KEY,
      from: env.LEAD_FROM_EMAIL || env.QUOTE_FROM_EMAIL || DEFAULT_LEAD_SENDER,
      to: LEAD_RECIPIENT,
      replyTo: lead.email,
      ...email,
    }),
    env.LEAD_WEBHOOK_URL
      ? postLeadWebhook(
          env.LEAD_WEBHOOK_URL,
          leadWebhookPayload(lead, score, temperature, receivedAt),
        )
      : Promise.resolve(false),
  ]);

  // The lead is safe if either channel took it.
  if (!mailed && !hooked) {
    return json(502, { ok: false, error: NOT_SENT });
  }

  return json(200, { ok: true, score, temperature, closing });
}

/** Every other method. `onRequestPost` takes precedence for POST. */
export function onRequest(): Response {
  return methodNotAllowed();
}
