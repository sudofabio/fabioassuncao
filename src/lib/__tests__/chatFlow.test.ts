import { describe, expect, it } from 'vitest';

import { LEAD_ORIGINS, SOCIAL_ORIGINS } from '../../../functions/_lib/lead';
import {
  type ChatStep,
  closingMessage,
  isUrgent,
  nextStep,
  questionFor,
  readUtm,
  whatsappTextFor,
} from '../chatFlow';

/** Walks the flow from the first question to the end. */
function walk(draft: Parameters<typeof nextStep>[1]): ChatStep[] {
  const steps: ChatStep[] = [];
  let step: ChatStep | null = 'name';
  while (step) {
    steps.push(step);
    step = nextStep(step, draft);
  }
  return steps;
}

describe('nextStep', () => {
  it('asks every question for a project that came from a social network', () => {
    expect(walk({ reason: 'construir', origin: 'instagram' })).toEqual([
      'name',
      'reason',
      'systems',
      'owner',
      'role',
      'budget',
      'origin',
      'video',
      'contact',
    ]);
  });

  it('skips the scenario question for mentorship, as the script says', () => {
    expect(walk({ reason: 'mentoria', origin: 'google' })).toEqual([
      'name',
      'reason',
      'owner',
      'role',
      'budget',
      'origin',
      'contact',
    ]);
  });

  it('asks "which video?" only after a social-network origin', () => {
    for (const origin of LEAD_ORIGINS.map((option) => option.id)) {
      const next = nextStep('origin', { origin });
      expect(next, origin).toBe(
        SOCIAL_ORIGINS.includes(origin) ? 'video' : 'contact',
      );
    }
  });

  it('ends after the contact step', () => {
    expect(nextStep('contact', {})).toBeNull();
    expect(nextStep('video', {})).toBe('contact');
  });
});

describe('questionFor', () => {
  it('opens as Fábio and greets the visitor by name', () => {
    expect(questionFor('name')).toBe(
      'Oi! Eu sou o Fábio. Como posso te chamar?',
    );
    expect(questionFor('reason', 'Ana')).toBe(
      'Prazer, Ana! O que te trouxe aqui hoje?',
    );
  });

  it('has a non-empty line for every step', () => {
    const steps: ChatStep[] = [
      'name',
      'reason',
      'systems',
      'owner',
      'role',
      'budget',
      'origin',
      'video',
      'contact',
    ];
    for (const step of steps) {
      expect(questionFor(step, 'Ana').trim().length, step).toBeGreaterThan(0);
    }
  });
});

describe('isUrgent and whatsappTextFor', () => {
  it('treats only an incident as urgent', () => {
    expect(isUrgent('incidente')).toBe(true);
    expect(isUrgent('construir')).toBe(false);
    expect(isUrgent(undefined)).toBe(false);
  });

  it('writes the visitor’s own message, naming the incident when there is one', () => {
    expect(whatsappTextFor('Ana', 'incidente')).toMatch(
      /^Oi, Fábio! Aqui é Ana\..*incidente/,
    );
    expect(whatsappTextFor('Ana', 'ia')).toBe(
      'Oi, Fábio! Aqui é Ana. Acabei de preencher o chat do seu site.',
    );
  });
});

describe('closingMessage', () => {
  it('puts WhatsApp first only for an incident', () => {
    expect(closingMessage('incidente', 'Ana').whatsappFirst).toBe(true);
    for (const closing of ['fit', 'sem-orcamento', 'conversa'] as const) {
      expect(closingMessage(closing, 'Ana').whatsappFirst, closing).toBe(false);
    }
  });

  it('promises the 24 h answer to a fit lead', () => {
    expect(closingMessage('fit', 'Ana').text).toMatch(
      /Te respondo em até 24 h úteis/,
    );
  });

  it('never promises a booking link or material that does not exist yet', () => {
    for (const closing of [
      'incidente',
      'fit',
      'sem-orcamento',
      'conversa',
    ] as const) {
      const { title, text } = closingMessage(closing, 'Ana');
      expect(title).toContain('Ana');
      expect(`${title} ${text}`).not.toMatch(
        /agend|agenda|te mandei|enviei|PDF|12 sinais|material no/i,
      );
    }
  });
});

describe('readUtm', () => {
  it('reads the five UTM keys and ignores everything else', () => {
    expect(
      readUtm(
        '?utm_source=instagram&utm_medium=bio&utm_campaign=autoridade-2026q4&utm_content=r020&utm_term=fabio&fbclid=abc&origem=x',
      ),
    ).toEqual({
      utm_source: 'instagram',
      utm_medium: 'bio',
      utm_campaign: 'autoridade-2026q4',
      utm_content: 'r020',
      utm_term: 'fabio',
    });
  });

  it('trims, skips empty values, and caps each value at 200 characters', () => {
    const long = 'x'.repeat(300);
    const utm = readUtm(
      `?utm_source=%20tiktok%20&utm_medium=&utm_content=${long}`,
    );

    expect(utm.utm_source).toBe('tiktok');
    expect(utm).not.toHaveProperty('utm_medium');
    expect(utm.utm_content).toHaveLength(200);
  });

  it('returns an empty object without a query string', () => {
    expect(readUtm('')).toEqual({});
  });
});
