import {
  asksForSystem,
  type LeadAnswers,
  type LeadClosing,
  type LeadReason,
  SOCIAL_ORIGINS,
  UTM_KEYS,
  type UtmKey,
} from '../../functions/_lib/lead';

/**
 * The order of the qualification chat on /contato/ (social media project,
 * `05-perfis/chat-qualificacao.md`). Pure, so the flow is tested without a
 * browser; `QualifierChat` only renders it.
 */
export type ChatStep =
  | 'name'
  | 'reason'
  | 'systems'
  | 'owner'
  | 'role'
  | 'budget'
  | 'origin'
  | 'video'
  | 'contact';

/** Answers collected so far; the contact step fills in the rest. */
export type ChatDraft = Partial<
  Omit<LeadAnswers, 'consent' | 'utm' | 'whatsapp'>
>;

export function nextStep(step: ChatStep, draft: ChatDraft): ChatStep | null {
  switch (step) {
    case 'name':
      return 'reason';
    case 'reason':
      return draft.reason && !asksForSystem(draft.reason) ? 'owner' : 'systems';
    case 'systems':
      return 'owner';
    case 'owner':
      return 'role';
    case 'role':
      return 'budget';
    case 'budget':
      return 'origin';
    case 'origin':
      return draft.origin && SOCIAL_ORIGINS.includes(draft.origin)
        ? 'video'
        : 'contact';
    case 'video':
      return 'contact';
    case 'contact':
      return null;
  }
}

/** Fábio's line for each step, in the script's words. */
export function questionFor(step: ChatStep, name = ''): string {
  switch (step) {
    case 'name':
      return 'Oi! Eu sou o Fábio. Como posso te chamar?';
    case 'reason':
      return `Prazer, ${name}! O que te trouxe aqui hoje?`;
    case 'systems':
      return 'Me conta rapidinho do seu cenário. Pode marcar mais de um.';
    case 'owner':
      return 'Quem cuida dele hoje?';
    case 'role':
      return 'Qual é o seu papel?';
    case 'budget':
      return 'Para eu te indicar o caminho certo: qual investimento faz sentido agora?';
    case 'origin':
      return 'Onde você me conheceu?';
    case 'video':
      return 'Lembra qual vídeo? Se não lembrar, tudo bem.';
    case 'contact':
      return 'Por onde eu te retorno?';
  }
}

/** An incident is urgent: WhatsApp is offered the moment it is chosen. */
export function isUrgent(reason: LeadReason | undefined): boolean {
  return reason === 'incidente';
}

/** The visitor's own WhatsApp message, written from what they answered. */
export function whatsappTextFor(name: string, reason?: LeadReason): string {
  if (reason === 'incidente') {
    return `Oi, Fábio! Aqui é ${name}. Preenchi o chat do seu site: tive um incidente ou vi uma falha que pode me afetar.`;
  }
  return `Oi, Fábio! Aqui é ${name}. Acabei de preencher o chat do seu site.`;
}

export interface ClosingMessage {
  title: string;
  text: string;
  /** Show the WhatsApp button as the main action. */
  whatsappFirst: boolean;
}

/**
 * The closing lines from the script. The 20-minute booking link and the free
 * material (O0) do not exist yet, so the fit and no-budget closings point to
 * WhatsApp instead of promising them.
 * TODO(fabio): link de agenda de 20 min e o material "12 sinais" (isca O0).
 */
export function closingMessage(
  closing: LeadClosing,
  name: string,
): ClosingMessage {
  switch (closing) {
    case 'incidente':
      return {
        title: `${name}, vamos resolver isso agora.`,
        text: 'Me chama no WhatsApp com a mensagem pronta. Eu respondo o quanto antes.',
        whatsappFirst: true,
      };
    case 'fit':
      return {
        title: `Obrigado, ${name}!`,
        text: 'Te respondo em até 24 h úteis. Se quiser adiantar, me chama no WhatsApp.',
        whatsappFirst: false,
      };
    case 'sem-orcamento':
      return {
        title: `Obrigado, ${name}!`,
        text: 'Recebi tudo. Vou te retornar com um caminho para o seu tema. Se surgir dúvida, me chama.',
        whatsappFirst: false,
      };
    case 'conversa':
      return {
        title: `Obrigado, ${name}!`,
        text: 'Recebi tudo e te respondo em até 24 h úteis.',
        whatsappFirst: false,
      };
  }
}

/** UTM parameters from the landing URL, trimmed and capped like the server. */
export function readUtm(search: string): Partial<Record<UtmKey, string>> {
  const params = new URLSearchParams(search);
  const utm: Partial<Record<UtmKey, string>> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) utm[key] = value.slice(0, 200);
  }
  return utm;
}
