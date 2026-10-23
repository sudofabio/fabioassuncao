import { describe, expect, it, vi } from 'vitest';

import type { LeadAnswers } from '../_lib/lead';
import {
  buildLeadEmail,
  leadWebhookPayload,
  postLeadWebhook,
} from '../_lib/lead-delivery';
import { validateLead } from '../_lib/lead-validation';

const valid = {
  name: 'Maria Silva',
  reason: 'construir',
  systems: ['sistema-web', 'api'],
  owner: 'fornecedor',
  role: 'dono',
  budget: '20-50k',
  origin: 'instagram',
  videoMention: 'O do PHP',
  whatsapp: '(98) 98888-7777',
  email: 'maria@example.com',
  company: 'Empresa X',
  consent: true,
  utm: { utm_source: 'instagram', utm_medium: 'bio' },
  turnstileToken: 'token-123',
};

function errorsOf(input: unknown): Record<string, string> {
  const result = validateLead(input);
  if (result.ok) throw new Error('expected a validation failure');
  return result.errors;
}

describe('validateLead', () => {
  it('accepts a complete submission and trims every string', () => {
    const result = validateLead({
      ...valid,
      name: '  Maria Silva  ',
      company: ' Empresa X ',
      utm: { utm_source: ' instagram ' },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe('Maria Silva');
      expect(result.data.company).toBe('Empresa X');
      expect(result.data.utm).toEqual({ utm_source: 'instagram' });
      expect(result.data.consent).toBe(true);
    }
  });

  it('accepts the minimum: no e-mail, company, video or UTMs', () => {
    const {
      email: _e,
      company: _c,
      videoMention: _v,
      utm: _u,
      ...minimum
    } = valid;
    const result = validateLead(minimum);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.email).toBeUndefined();
      expect(result.data.utm).toEqual({});
    }
  });

  it('rejects anything that is not an object', () => {
    for (const input of [null, 'x', 42, ['a']]) {
      expect(errorsOf(input)).toEqual({ form: 'Envio inválido.' });
    }
  });

  it('reports every missing required field with gender agreement', () => {
    const errors = errorsOf({});

    expect(Object.keys(errors).sort()).toEqual(
      [
        'budget',
        'consent',
        'name',
        'origin',
        'owner',
        'reason',
        'role',
        'turnstileToken',
        'whatsapp',
      ].sort(),
    );
    expect(errors.name).toBe('Nome é obrigatório.');
    expect(errors.budget).toBe('Faixa de investimento é obrigatória.');
    expect(errors.origin).toBe('Origem é obrigatória.');
    expect(errors.turnstileToken).toBe('Verificação anti-spam é obrigatória.');
  });

  it('rejects options outside the contract', () => {
    const errors = errorsOf({
      ...valid,
      reason: 'hackear',
      owner: 'x',
      role: 'ceo',
      budget: '1-bilhao',
      origin: 'orkut',
    });

    expect(errors).toMatchObject({
      reason: 'Escolha um motivo da lista.',
      role: 'Escolha um papel da lista.',
      budget: 'Escolha uma faixa de investimento da lista.',
      origin: 'Escolha uma origem da lista.',
    });
    expect(errors.owner).toBeDefined();
  });

  it('rejects values that are not strings instead of coercing them', () => {
    const errors = errorsOf({ ...valid, name: ['Maria'], reason: 1 });

    expect(errors.name).toBe('Nome precisa ser texto.');
    expect(errors.reason).toBe('Escolha um motivo da lista.');
  });

  it('enforces name length', () => {
    expect(errorsOf({ ...valid, name: 'M' }).name).toMatch(/pelo menos 2/);
    expect(errorsOf({ ...valid, name: 'x'.repeat(121) }).name).toMatch(
      /no máximo 120/,
    );
  });

  describe('systems', () => {
    it('requires at least one scenario unless the reason is mentorship', () => {
      expect(errorsOf({ ...valid, systems: [] }).systems).toBe(
        'Escolha pelo menos um cenário.',
      );
      const { systems: _s, ...withoutSystems } = valid;
      expect(errorsOf(withoutSystems).systems).toBe(
        'Escolha pelo menos um cenário.',
      );
    });

    it('drops the scenario for mentorship, which skips the question', () => {
      const result = validateLead({
        ...valid,
        reason: 'mentoria',
        systems: ['api'],
      });

      expect(result.ok && result.data.systems).toEqual([]);
      const { systems: _s, ...withoutSystems } = valid;
      expect(validateLead({ ...withoutSystems, reason: 'mentoria' }).ok).toBe(
        true,
      );
    });

    it('rejects unknown ids, non-arrays and oversized lists', () => {
      expect(errorsOf({ ...valid, systems: ['nuvem'] }).systems).toBe(
        'Escolha um cenário da lista.',
      );
      expect(errorsOf({ ...valid, systems: 'api' }).systems).toBe(
        'Cenário inválido.',
      );
      expect(
        errorsOf({ ...valid, systems: Array.from({ length: 8 }, () => 'api') })
          .systems,
      ).toMatch(/no máximo 7/);
    });

    it('collapses duplicates', () => {
      const result = validateLead({ ...valid, systems: ['api', 'api'] });
      expect(result.ok && result.data.systems).toEqual(['api']);
    });
  });

  it('accepts a cited video only from a social network', () => {
    expect(errorsOf({ ...valid, origin: 'google' }).videoMention).toMatch(
      /rede/,
    );
    expect(
      errorsOf({ ...valid, videoMention: 'x'.repeat(201) }).videoMention,
    ).toMatch(/no máximo 200/);
  });

  it('validates WhatsApp digits and characters', () => {
    expect(validateLead({ ...valid, whatsapp: '+55 98 98888-7777' }).ok).toBe(
      true,
    );
    for (const whatsapp of ['1234567', 'nove-oito', '1'.repeat(21)]) {
      expect(errorsOf({ ...valid, whatsapp }).whatsapp).toBe(
        'WhatsApp inválido. Use só números, com DDD.',
      );
    }
  });

  it('validates the optional e-mail and company', () => {
    expect(errorsOf({ ...valid, email: 'maria@' }).email).toBe(
      'E-mail inválido.',
    );
    expect(errorsOf({ ...valid, company: 'x'.repeat(121) }).company).toMatch(
      /Empresa pode ter no máximo 120/,
    );
  });

  it('requires consent to be exactly true', () => {
    for (const consent of [false, 'true', 1, undefined]) {
      expect(errorsOf({ ...valid, consent }).consent).toMatch(/concordar/);
    }
  });

  it('accepts only the five UTM keys, as short strings', () => {
    expect(errorsOf({ ...valid, utm: { gclid: 'x' } }).utm).toBeDefined();
    expect(errorsOf({ ...valid, utm: { utm_source: 1 } }).utm).toBeDefined();
    expect(
      errorsOf({ ...valid, utm: { utm_source: 'x'.repeat(201) } }).utm,
    ).toBeDefined();
    expect(errorsOf({ ...valid, utm: ['instagram'] }).utm).toBeDefined();
  });

  it('never carries a client-sent score into the data', () => {
    const result = validateLead({ ...valid, score: 99, temperature: 'quente' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect('score' in result.data).toBe(false);
      expect('temperature' in result.data).toBe(false);
    }
  });
});

const lead: LeadAnswers = {
  name: 'Maria <b>Silva</b>',
  reason: 'construir',
  systems: ['sistema-web', 'api'],
  owner: 'fornecedor',
  role: 'dono',
  budget: '20-50k',
  origin: 'instagram',
  videoMention: 'O do PHP',
  whatsapp: '98988887777',
  email: 'maria@example.com',
  company: 'Empresa & Filhos',
  consent: true,
  utm: { utm_source: 'instagram', utm_medium: 'bio' },
};

describe('buildLeadEmail', () => {
  it('tags the subject with the temperature, name and reason', () => {
    expect(buildLeadEmail(lead, 7, 'quente').subject).toBe(
      '[QUENTE] Maria <b>Silva</b>: Quero construir um sistema, app ou plataforma',
    );
    expect(buildLeadEmail(lead, 5, 'morno').subject).toMatch(/^\[MORNO\] /);
    expect(buildLeadEmail(lead, 1, 'audiencia').subject).toMatch(
      /^\[AUDIÊNCIA\] /,
    );
  });

  it('flags an incident above any temperature', () => {
    expect(
      buildLeadEmail({ ...lead, reason: 'incidente' }, 9, 'quente').subject,
    ).toMatch(/^\[INCIDENTE\] /);
  });

  it('keeps the subject on one line', () => {
    expect(
      buildLeadEmail({ ...lead, name: 'Maria\r\nBcc: x' }, 7, 'quente').subject,
    ).not.toMatch(/[\r\n]/);
  });

  it('labels every field in Portuguese, with score, UTMs and a timestamp', () => {
    const { text } = buildLeadEmail(lead, 7, 'quente', '2026-10-23T12:00:00Z');

    for (const line of [
      'Motivo: Quero construir um sistema, app ou plataforma',
      'Cenário: Sistema web/ERP próprio, API/integração',
      'Quem cuida hoje: Fornecedor/agência',
      'Papel: Dono/sócio',
      'Faixa de investimento: R$ 20–50 mil',
      'Origem: Instagram',
      'Vídeo citado: O do PHP',
      'Pontuação: 7',
      'Temperatura: Quente (responder no mesmo dia)',
      'utm_source: instagram',
      'utm_campaign: —',
      'Recebido em: 2026-10-23T12:00:00Z',
    ]) {
      expect(text).toContain(line);
    }
  });

  it('escapes every visitor value in the HTML body', () => {
    const { html } = buildLeadEmail(lead, 7, 'quente');

    expect(html).toContain('Maria &lt;b&gt;Silva&lt;/b&gt;');
    expect(html).toContain('Empresa &amp; Filhos');
    expect(html).not.toContain('<b>Silva</b>');
  });
});

describe('lead webhook', () => {
  it('flattens the lead into the recorded fields', () => {
    expect(leadWebhookPayload(lead, 7, 'quente', 'agora')).toEqual({
      nome: 'Maria <b>Silva</b>',
      whatsapp: '98988887777',
      email: 'maria@example.com',
      empresa: 'Empresa & Filhos',
      motivo: 'construir',
      tipo_sistema: 'sistema-web,api',
      responsavel: 'fornecedor',
      papel: 'dono',
      faixa_investimento: '20-50k',
      origem: 'instagram',
      video_citado: 'O do PHP',
      utm_source: 'instagram',
      utm_medium: 'bio',
      utm_campaign: '',
      utm_content: '',
      utm_term: '',
      pontuacao: 7,
      temperatura: 'quente',
      data_hora: 'agora',
      consentimento: true,
    });
  });

  it('POSTs JSON and reports success', async () => {
    const fetchMock = vi.fn(async () => new Response('ok'));
    const payload = leadWebhookPayload(lead, 7, 'quente', 'agora');

    expect(
      await postLeadWebhook('https://hooks.example/lead', payload, fetchMock),
    ).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe('https://hooks.example/lead');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual(payload);
  });

  it('reports failure on non-2xx and on network errors', async () => {
    const payload = leadWebhookPayload(lead, 7, 'quente');

    expect(
      await postLeadWebhook(
        'https://hooks.example/lead',
        payload,
        async () => new Response('', { status: 500 }),
      ),
    ).toBe(false);
    expect(
      await postLeadWebhook('https://hooks.example/lead', payload, async () => {
        throw new Error('offline');
      }),
    ).toBe(false);
  });
});
