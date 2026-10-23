/**
 * The qualification chat on /contato/: its questions, answer options, and the
 * score that decides how fast a lead is answered.
 *
 * Shared by the browser chat (`src/components/Contact/QualifierChat.tsx`) and
 * the `/api/lead` Pages Function, which recomputes the score instead of
 * trusting the client. Pure on purpose: no Workers or DOM globals.
 *
 * Source of truth for wording and points: the social media project's
 * `05-perfis/chat-qualificacao.md`.
 */

export const LEAD_REASONS = [
  { id: 'construir', label: 'Quero construir um sistema, app ou plataforma' },
  { id: 'ia', label: 'Quero usar IA no meu negócio' },
  {
    id: 'modernizar',
    label: 'Tenho um sistema antigo / preciso modernizar ou atualizar',
  },
  {
    id: 'incidente',
    label: 'Saiu uma falha na notícia, ou já tive um incidente',
  },
  { id: 'mentoria', label: 'Quero mentoria ou um sênior do lado' },
  { id: 'outro', label: 'Outro' },
] as const;

export const LEAD_SYSTEMS = [
  { id: 'site', label: 'Site/WordPress' },
  { id: 'sistema-web', label: 'Sistema web/ERP próprio' },
  { id: 'loja', label: 'Loja virtual' },
  { id: 'app', label: 'App mobile' },
  { id: 'api', label: 'API/integração' },
  { id: 'app-ia', label: 'App feito com IA' },
  { id: 'nao-sei', label: 'Não sei' },
] as const;

export const LEAD_OWNERS = [
  { id: 'time-interno', label: 'Time interno' },
  { id: 'fornecedor', label: 'Fornecedor/agência' },
  { id: 'freelancer', label: 'Freelancer' },
  { id: 'ninguem', label: 'Ninguém fixo' },
  { id: 'eu', label: 'Eu mesmo' },
] as const;

export const LEAD_ROLES = [
  { id: 'dono', label: 'Dono/sócio' },
  { id: 'gestor', label: 'Diretor/gestor' },
  { id: 'ti', label: 'TI/tech lead' },
  { id: 'dev', label: 'Dev' },
  { id: 'outro', label: 'Outro' },
] as const;

export const LEAD_BUDGETS = [
  { id: 'ate-5k', label: 'Até R$ 5 mil' },
  { id: '5-20k', label: 'R$ 5–20 mil' },
  { id: '20-50k', label: 'R$ 20–50 mil' },
  { id: '50k-mais', label: 'Acima de R$ 50 mil' },
  { id: 'nao-sei', label: 'Ainda não sei' },
] as const;

export const LEAD_ORIGINS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'indicacao', label: 'Indicação' },
  { id: 'google', label: 'Google' },
  { id: 'outro', label: 'Outro' },
] as const;

type OptionId<T extends readonly { id: string }[]> = T[number]['id'];

export type LeadReason = OptionId<typeof LEAD_REASONS>;
export type LeadSystem = OptionId<typeof LEAD_SYSTEMS>;
export type LeadOwner = OptionId<typeof LEAD_OWNERS>;
export type LeadRole = OptionId<typeof LEAD_ROLES>;
export type LeadBudget = OptionId<typeof LEAD_BUDGETS>;
export type LeadOrigin = OptionId<typeof LEAD_ORIGINS>;

/** Origins that are social networks, which earn the "which video?" follow-up. */
export const SOCIAL_ORIGINS: readonly LeadOrigin[] = [
  'instagram',
  'tiktok',
  'youtube',
  'linkedin',
];

/** Mentorship skips the "your scenario" question, as the script says. */
export function asksForSystem(reason: LeadReason): boolean {
  return reason !== 'mentoria';
}

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

/** Everything the chat collects; mirrors the "campos que o sistema grava". */
export interface LeadAnswers {
  name: string;
  reason: LeadReason;
  /** Multiple choice; empty when the reason skips the question. */
  systems: LeadSystem[];
  owner: LeadOwner;
  role: LeadRole;
  budget: LeadBudget;
  origin: LeadOrigin;
  videoMention?: string;
  whatsapp: string;
  email?: string;
  company?: string;
  consent: true;
  utm: Partial<Record<UtmKey, string>>;
}

export type LeadScoreInput = Pick<
  LeadAnswers,
  'reason' | 'role' | 'budget' | 'owner'
>;

const BUDGET_POINTS: Record<LeadBudget, number> = {
  'ate-5k': 0,
  '5-20k': 2,
  '20-50k': 3,
  '50k-mais': 3,
  'nao-sei': 1,
};

const PROJECT_REASONS: readonly LeadReason[] = [
  'construir',
  'ia',
  'modernizar',
  'incidente',
];

/**
 * The automatic score from the script's table: an incident adds 5, a project
 * reason 2, an owner or manager 2, the budget 0–3, and "nobody looks after
 * it" 1. An incident is both a project reason and the +5 alert.
 */
export function scoreLead({
  reason,
  role,
  budget,
  owner,
}: LeadScoreInput): number {
  let score = 0;
  if (reason === 'incidente') score += 5;
  if (PROJECT_REASONS.includes(reason)) score += 2;
  if (role === 'dono' || role === 'gestor') score += 2;
  score += BUDGET_POINTS[budget];
  if (owner === 'ninguem') score += 1;
  return score;
}

export type LeadTemperature = 'quente' | 'morno' | 'audiencia';

/** ≥ 7 hot (same day), 4–6 warm (within 24 h), ≤ 3 audience. */
export function temperatureFor(score: number): LeadTemperature {
  if (score >= 7) return 'quente';
  if (score >= 4) return 'morno';
  return 'audiencia';
}

export type LeadClosing = 'incidente' | 'fit' | 'sem-orcamento' | 'conversa';

/**
 * Which closing message the chat shows:
 * - an incident goes straight to WhatsApp;
 * - an owner or manager with R$ 5 mil or more is a fit (answer in 24 h);
 * - below the R$ 5 mil minimum gets the free material, without insisting;
 * - everyone else gets the plain "I'll get back to you".
 */
export function closingFor({
  reason,
  role,
  budget,
}: Pick<LeadAnswers, 'reason' | 'role' | 'budget'>): LeadClosing {
  if (reason === 'incidente') return 'incidente';
  const decides = role === 'dono' || role === 'gestor';
  const hasBudget =
    budget === '5-20k' || budget === '20-50k' || budget === '50k-mais';
  if (decides && hasBudget) return 'fit';
  if (budget === 'ate-5k') return 'sem-orcamento';
  return 'conversa';
}

export function labelOf(
  options: readonly { id: string; label: string }[],
  id: string,
): string {
  return options.find((option) => option.id === id)?.label ?? id;
}
