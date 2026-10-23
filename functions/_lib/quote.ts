/**
 * Quote-request logic shared by the `/api/orcamento` Pages Function.
 *
 * Pure on purpose: no Workers globals, and every network call takes an
 * injectable `fetch`, so the whole flow runs under Vitest without a runtime.
 * The leading underscore keeps Pages from routing this directory.
 */

export const QUOTE_TYPES = [
  'consultoria',
  'palestra',
  'mentoria',
  'outro',
] as const;

export type QuoteType = (typeof QUOTE_TYPES)[number];

export const QUOTE_TYPE_LABELS: Record<QuoteType, string> = {
  consultoria: 'Consultoria',
  palestra: 'Palestra',
  mentoria: 'Mentoria',
  outro: 'Outro',
};

export interface Quote {
  name: string;
  email: string;
  whatsapp?: string;
  type: QuoteType;
  scope: string;
  deadline: string;
  budget?: string;
  turnstileToken: string;
}

export type QuoteValidation =
  | { ok: true; data: Quote }
  | { ok: false; errors: Record<string, string> };

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

// Deliberately loose: one `@`, no whitespace, a dot in the domain. Deliverability
// is Resend's problem; this only rejects obvious typos before a round trip.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_PATTERN = /^[\d\s()+-]+$/;

interface TextRule {
  label: string;
  /** Grammatical gender of the label, for "é obrigatório/obrigatória". */
  feminine?: boolean;
  min: number;
  max: number;
  required: boolean;
}

const TEXT_RULES = {
  name: { label: 'Nome', min: 2, max: 120, required: true },
  email: { label: 'E-mail', min: 3, max: 254, required: true },
  whatsapp: { label: 'WhatsApp', min: 0, max: 40, required: false },
  type: { label: 'Tipo', min: 1, max: 40, required: true },
  scope: {
    label: 'Descrição do escopo',
    feminine: true,
    min: 20,
    max: 5000,
    required: true,
  },
  deadline: { label: 'Prazo', min: 1, max: 120, required: true },
  budget: {
    label: 'Faixa de investimento',
    feminine: true,
    min: 0,
    max: 120,
    required: false,
  },
  turnstileToken: {
    label: 'Verificação anti-spam',
    feminine: true,
    min: 1,
    max: 2048,
    required: true,
  },
} satisfies Record<keyof Quote, TextRule>;

type Field = keyof typeof TEXT_RULES;

function requiredMessage(rule: TextRule): string {
  return `${rule.label} é ${rule.feminine ? 'obrigatória' : 'obrigatório'}.`;
}

function readText(
  source: Record<string, unknown>,
  field: Field,
  errors: Record<string, string>,
): string | undefined {
  const rule: TextRule = TEXT_RULES[field];
  const raw = source[field];

  if (raw === undefined || raw === null) {
    if (rule.required) errors[field] = requiredMessage(rule);
    return undefined;
  }

  if (typeof raw !== 'string') {
    errors[field] = `${rule.label} precisa ser texto.`;
    return undefined;
  }

  const value = raw.trim();

  if (value.length === 0) {
    if (rule.required) errors[field] = requiredMessage(rule);
    return undefined;
  }

  if (value.length < rule.min) {
    errors[field] =
      `${rule.label} precisa ter pelo menos ${rule.min} caracteres.`;
    return undefined;
  }

  if (value.length > rule.max) {
    errors[field] = `${rule.label} pode ter no máximo ${rule.max} caracteres.`;
    return undefined;
  }

  return value;
}

function isQuoteType(value: string): value is QuoteType {
  return (QUOTE_TYPES as readonly string[]).includes(value);
}

/**
 * Validates a submission from either a JSON body or a converted FormData.
 * Every field is trimmed; anything that is not a string is rejected rather
 * than coerced, so `{ "name": ["a"] }` cannot slip past a length check.
 */
export function validateQuote(input: unknown): QuoteValidation {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { ok: false, errors: { form: 'Envio inválido.' } };
  }

  const source = input as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = readText(source, 'name', errors);
  const email = readText(source, 'email', errors);
  const whatsapp = readText(source, 'whatsapp', errors);
  const type = readText(source, 'type', errors);
  const scope = readText(source, 'scope', errors);
  const deadline = readText(source, 'deadline', errors);
  const budget = readText(source, 'budget', errors);
  const turnstileToken = readText(source, 'turnstileToken', errors);

  if (email !== undefined && !EMAIL_PATTERN.test(email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (whatsapp !== undefined) {
    const digits = whatsapp.replace(/\D/g, '').length;

    if (!WHATSAPP_PATTERN.test(whatsapp) || digits < 8 || digits > 20) {
      errors.whatsapp = 'Informe um WhatsApp válido, com DDD.';
    }
  }

  if (type !== undefined && !isQuoteType(type)) {
    errors.type = 'Escolha um tipo de trabalho da lista.';
  }

  if (
    Object.keys(errors).length > 0 ||
    name === undefined ||
    email === undefined ||
    type === undefined ||
    !isQuoteType(type) ||
    scope === undefined ||
    deadline === undefined ||
    turnstileToken === undefined
  ) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      type,
      scope,
      deadline,
      turnstileToken,
      ...(whatsapp !== undefined ? { whatsapp } : {}),
      ...(budget !== undefined ? { budget } : {}),
    },
  };
}

export const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Server-side Turnstile check. Any network or parse failure counts as a fail. */
export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string | null,
  fetchImpl: FetchLike = fetch,
): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const response = await fetchImpl(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    if (!response.ok) return false;

    const result = (await response.json()) as { success?: unknown };
    return result.success === true;
  } catch {
    return false;
  }
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export interface QuoteEmail {
  subject: string;
  text: string;
  html: string;
}

/** Plain-text and HTML bodies. Every visitor-supplied value is escaped. */
export function buildEmail(data: Quote): QuoteEmail {
  const rows: [string, string][] = [
    ['Nome', data.name],
    ['E-mail', data.email],
    ['WhatsApp', data.whatsapp ?? '—'],
    ['Tipo', QUOTE_TYPE_LABELS[data.type]],
    ['Prazo', data.deadline],
    ['Faixa de investimento', data.budget ?? '—'],
  ];

  // Subject lines are a header: strip line breaks so a name cannot fold one.
  const subjectName = data.name.replace(/[\r\n]+/g, ' ');
  const subject = `Pedido de orçamento (${QUOTE_TYPE_LABELS[data.type]}): ${subjectName}`;

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Escopo:',
    data.scope,
  ].join('\n');

  const html = [
    '<h1>Novo pedido de orçamento</h1>',
    '<table>',
    ...rows.map(
      ([label, value]) =>
        `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
    ),
    '</table>',
    '<h2>Escopo</h2>',
    `<p style="white-space: pre-wrap">${escapeHtml(data.scope)}</p>`,
  ].join('\n');

  return { subject, text, html };
}

export const RESEND_API_URL = 'https://api.resend.com/emails';

export interface ResendMessage {
  apiKey: string;
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

/** Sends through Resend's REST API. Returns false on any non-2xx or error. */
export async function sendWithResend(
  { apiKey, from, to, replyTo, subject, text, html }: ResendMessage,
  fetchImpl: FetchLike = fetch,
): Promise<boolean> {
  try {
    const response = await fetchImpl(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: replyTo,
        subject,
        text,
        html,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
