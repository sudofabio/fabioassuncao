/**
 * Server-side validation for the qualification chat (`/api/lead`).
 *
 * Every option is checked against the shared contract in `./lead.ts`, every
 * string is trimmed, and anything of the wrong type is rejected rather than
 * coerced. Messages are Brazilian Portuguese with gender agreement, because the
 * chat shows them to the visitor as they are.
 */

import {
  asksForSystem,
  LEAD_BUDGETS,
  LEAD_ORIGINS,
  LEAD_OWNERS,
  LEAD_REASONS,
  LEAD_ROLES,
  LEAD_SYSTEMS,
  type LeadAnswers,
  type LeadOrigin,
  type LeadSystem,
  SOCIAL_ORIGINS,
  UTM_KEYS,
  type UtmKey,
} from './lead';

export type ValidLead = LeadAnswers & { turnstileToken: string };

export type LeadValidation =
  | { ok: true; data: ValidLead }
  | { ok: false; errors: Record<string, string> };

// Deliberately loose: one `@`, no whitespace, a dot in the domain.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_PATTERN = /^[\d\s()+-]+$/;

const MAX_SYSTEMS = LEAD_SYSTEMS.length;
const MAX_UTM_LENGTH = 200;

type Errors = Record<string, string>;

interface TextRule {
  label: string;
  feminine?: boolean;
  min: number;
  max: number;
  required: boolean;
}

function requiredMessage(rule: TextRule): string {
  return `${rule.label} é ${rule.feminine ? 'obrigatória' : 'obrigatório'}.`;
}

/** Trimmed string, or undefined with an error recorded when it is invalid. */
function readText(
  source: Record<string, unknown>,
  field: string,
  rule: TextRule,
  errors: Errors,
): string | undefined {
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

/** One of the contract's option ids, or undefined with an error recorded. */
function readOption<T extends string>(
  source: Record<string, unknown>,
  field: string,
  options: readonly { id: T }[],
  missing: string,
  invalid: string,
  errors: Errors,
): T | undefined {
  const raw = source[field];
  if (raw === undefined || raw === null || raw === '') {
    errors[field] = missing;
    return undefined;
  }
  const value = typeof raw === 'string' ? raw.trim() : undefined;
  const match = options.find((option) => option.id === value);
  if (!match) {
    errors[field] = invalid;
    return undefined;
  }
  return match.id;
}

function readSystems(
  source: Record<string, unknown>,
  required: boolean,
  errors: Errors,
): LeadSystem[] | undefined {
  const raw = source.systems;

  if (raw === undefined || raw === null) {
    if (required) errors.systems = 'Escolha pelo menos um cenário.';
    return required ? undefined : [];
  }
  if (!Array.isArray(raw)) {
    errors.systems = 'Cenário inválido.';
    return undefined;
  }
  if (raw.length > MAX_SYSTEMS) {
    errors.systems = `Escolha no máximo ${MAX_SYSTEMS} cenários.`;
    return undefined;
  }

  const ids: LeadSystem[] = [];
  for (const item of raw) {
    const value = typeof item === 'string' ? item.trim() : undefined;
    const match = LEAD_SYSTEMS.find((option) => option.id === value);
    if (!match) {
      errors.systems = 'Escolha um cenário da lista.';
      return undefined;
    }
    if (!ids.includes(match.id)) ids.push(match.id);
  }

  if (required && ids.length === 0) {
    errors.systems = 'Escolha pelo menos um cenário.';
    return undefined;
  }
  return ids;
}

function readUtm(
  source: Record<string, unknown>,
  errors: Errors,
): Partial<Record<UtmKey, string>> | undefined {
  const raw = source.utm;
  if (raw === undefined || raw === null) return {};
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    errors.utm = 'Parâmetros de campanha inválidos.';
    return undefined;
  }

  const utm: Partial<Record<UtmKey, string>> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!(UTM_KEYS as readonly string[]).includes(key)) {
      errors.utm = 'Parâmetros de campanha inválidos.';
      return undefined;
    }
    if (typeof value !== 'string' || value.length > MAX_UTM_LENGTH) {
      errors.utm = 'Parâmetros de campanha inválidos.';
      return undefined;
    }
    const trimmed = value.trim();
    if (trimmed) utm[key as UtmKey] = trimmed;
  }
  return utm;
}

/**
 * Validates a JSON submission from the chat. The score is never read from the
 * input: the handler recomputes it from the validated answers.
 */
export function validateLead(input: unknown): LeadValidation {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { ok: false, errors: { form: 'Envio inválido.' } };
  }

  const source = input as Record<string, unknown>;
  const errors: Errors = {};

  const name = readText(
    source,
    'name',
    { label: 'Nome', min: 2, max: 120, required: true },
    errors,
  );
  const reason = readOption(
    source,
    'reason',
    LEAD_REASONS,
    'Motivo é obrigatório.',
    'Escolha um motivo da lista.',
    errors,
  );
  const systems = readSystems(
    source,
    reason === undefined ? false : asksForSystem(reason),
    errors,
  );
  const owner = readOption(
    source,
    'owner',
    LEAD_OWNERS,
    'Informe quem cuida do sistema hoje.',
    'Escolha uma opção da lista para quem cuida do sistema.',
    errors,
  );
  const role = readOption(
    source,
    'role',
    LEAD_ROLES,
    'Papel é obrigatório.',
    'Escolha um papel da lista.',
    errors,
  );
  const budget = readOption(
    source,
    'budget',
    LEAD_BUDGETS,
    'Faixa de investimento é obrigatória.',
    'Escolha uma faixa de investimento da lista.',
    errors,
  );
  const origin = readOption<LeadOrigin>(
    source,
    'origin',
    LEAD_ORIGINS,
    'Origem é obrigatória.',
    'Escolha uma origem da lista.',
    errors,
  );
  const videoMention = readText(
    source,
    'videoMention',
    { label: 'Vídeo citado', min: 0, max: 200, required: false },
    errors,
  );
  if (
    videoMention !== undefined &&
    origin !== undefined &&
    !SOCIAL_ORIGINS.includes(origin)
  ) {
    errors.videoMention = 'Vídeo citado só vale para quem veio de uma rede.';
  }

  const whatsapp = readText(
    source,
    'whatsapp',
    { label: 'WhatsApp', min: 1, max: 40, required: true },
    errors,
  );
  if (whatsapp !== undefined) {
    const digits = whatsapp.replace(/\D/g, '').length;
    if (!WHATSAPP_PATTERN.test(whatsapp) || digits < 8 || digits > 20) {
      errors.whatsapp = 'WhatsApp inválido. Use só números, com DDD.';
    }
  }

  const email = readText(
    source,
    'email',
    { label: 'E-mail', min: 3, max: 254, required: false },
    errors,
  );
  if (email !== undefined && !EMAIL_PATTERN.test(email)) {
    errors.email = 'E-mail inválido.';
  }

  const company = readText(
    source,
    'company',
    { label: 'Empresa', feminine: true, min: 0, max: 120, required: false },
    errors,
  );

  if (source.consent !== true) {
    errors.consent =
      'É preciso concordar em ser contatado e com a política de privacidade.';
  }

  const utm = readUtm(source, errors);

  const turnstileToken = readText(
    source,
    'turnstileToken',
    {
      label: 'Verificação anti-spam',
      feminine: true,
      min: 1,
      max: 2048,
      required: true,
    },
    errors,
  );

  if (
    Object.keys(errors).length > 0 ||
    name === undefined ||
    reason === undefined ||
    systems === undefined ||
    owner === undefined ||
    role === undefined ||
    budget === undefined ||
    origin === undefined ||
    whatsapp === undefined ||
    utm === undefined ||
    turnstileToken === undefined
  ) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      reason,
      systems: asksForSystem(reason) ? systems : [],
      owner,
      role,
      budget,
      origin,
      ...(videoMention !== undefined ? { videoMention } : {}),
      whatsapp,
      ...(email !== undefined ? { email } : {}),
      ...(company !== undefined ? { company } : {}),
      consent: true,
      utm,
      turnstileToken,
    },
  };
}
