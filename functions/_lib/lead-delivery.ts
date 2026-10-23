/**
 * Where a qualified lead goes: an e-mail to the Fábio's inbox (through Resend,
 * see `./quote.ts`) and, optionally, a JSON webhook for a sheet, n8n or CRM.
 *
 * The e-mail subject carries the temperature so the inbox sorts itself; an
 * incident is flagged above everything else. Every visitor-supplied value is
 * escaped in the HTML body and stripped of line breaks in the subject.
 */

import { escapeHtml } from './delivery';
import {
  LEAD_BUDGETS,
  LEAD_ORIGINS,
  LEAD_OWNERS,
  LEAD_REASONS,
  LEAD_ROLES,
  LEAD_SYSTEMS,
  type LeadAnswers,
  type LeadTemperature,
  labelOf,
  UTM_KEYS,
} from './lead';

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export interface LeadEmail {
  subject: string;
  text: string;
  html: string;
}

const TEMPERATURE_TAGS: Record<LeadTemperature, string> = {
  quente: '[QUENTE]',
  morno: '[MORNO]',
  audiencia: '[AUDIÊNCIA]',
};

const TEMPERATURE_LABELS: Record<LeadTemperature, string> = {
  quente: 'Quente (responder no mesmo dia)',
  morno: 'Morno (responder em até 24 h)',
  audiencia: 'Audiência (isca + Stories)',
};

function systemsLabel(lead: LeadAnswers): string {
  return lead.systems.length > 0
    ? lead.systems.map((id) => labelOf(LEAD_SYSTEMS, id)).join(', ')
    : '—';
}

/** Header-safe: a name cannot fold the subject into a second line. */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

/** Rows shared by the plain-text and HTML bodies, in the chat's order. */
function leadRows(
  lead: LeadAnswers,
  score: number,
  temperature: LeadTemperature,
  receivedAt: string,
): [string, string][] {
  const rows: [string, string][] = [
    ['Nome', lead.name],
    ['Motivo', labelOf(LEAD_REASONS, lead.reason)],
    ['Cenário', systemsLabel(lead)],
    ['Quem cuida hoje', labelOf(LEAD_OWNERS, lead.owner)],
    ['Papel', labelOf(LEAD_ROLES, lead.role)],
    ['Faixa de investimento', labelOf(LEAD_BUDGETS, lead.budget)],
    ['Origem', labelOf(LEAD_ORIGINS, lead.origin)],
    ['Vídeo citado', lead.videoMention ?? '—'],
    ['WhatsApp', lead.whatsapp],
    ['E-mail', lead.email ?? '—'],
    ['Empresa', lead.company ?? '—'],
    ['Pontuação', String(score)],
    ['Temperatura', TEMPERATURE_LABELS[temperature]],
    ['Consentimento', lead.consent ? 'Sim' : 'Não'],
  ];

  for (const key of UTM_KEYS) {
    rows.push([key, lead.utm[key] ?? '—']);
  }
  rows.push(['Recebido em', receivedAt]);
  return rows;
}

export function buildLeadEmail(
  lead: LeadAnswers,
  score: number,
  temperature: LeadTemperature,
  receivedAt: string = new Date().toISOString(),
): LeadEmail {
  const tag =
    lead.reason === 'incidente' ? '[INCIDENTE]' : TEMPERATURE_TAGS[temperature];
  const subject = `${tag} ${oneLine(lead.name)}: ${labelOf(LEAD_REASONS, lead.reason)}`;

  const rows = leadRows(lead, score, temperature, receivedAt);

  const text = [
    'Novo contato pelo chat de fabioassuncao.com/contato',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join('\n');

  const html = [
    '<h1>Novo contato pelo chat</h1>',
    '<table>',
    ...rows.map(
      ([label, value]) =>
        `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
    ),
    '</table>',
  ].join('\n');

  return { subject, text, html };
}

/** The "campos que o sistema grava", flat, for a sheet, n8n or a CRM. */
export interface LeadWebhookPayload {
  nome: string;
  whatsapp: string;
  email: string;
  empresa: string;
  motivo: string;
  tipo_sistema: string;
  responsavel: string;
  papel: string;
  faixa_investimento: string;
  origem: string;
  video_citado: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  pontuacao: number;
  temperatura: LeadTemperature;
  data_hora: string;
  consentimento: boolean;
}

export function leadWebhookPayload(
  lead: LeadAnswers,
  score: number,
  temperature: LeadTemperature,
  receivedAt: string = new Date().toISOString(),
): LeadWebhookPayload {
  return {
    nome: lead.name,
    whatsapp: lead.whatsapp,
    email: lead.email ?? '',
    empresa: lead.company ?? '',
    motivo: lead.reason,
    tipo_sistema: lead.systems.join(','),
    responsavel: lead.owner,
    papel: lead.role,
    faixa_investimento: lead.budget,
    origem: lead.origin,
    video_citado: lead.videoMention ?? '',
    utm_source: lead.utm.utm_source ?? '',
    utm_medium: lead.utm.utm_medium ?? '',
    utm_campaign: lead.utm.utm_campaign ?? '',
    utm_content: lead.utm.utm_content ?? '',
    utm_term: lead.utm.utm_term ?? '',
    pontuacao: score,
    temperatura: temperature,
    data_hora: receivedAt,
    consentimento: lead.consent,
  };
}

/** POSTs the payload as JSON. Returns false on any non-2xx or network error. */
export async function postLeadWebhook(
  url: string,
  payload: LeadWebhookPayload,
  fetchImpl: FetchLike = fetch,
): Promise<boolean> {
  try {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}
