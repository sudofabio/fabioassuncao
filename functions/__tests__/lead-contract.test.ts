import { describe, expect, it } from 'vitest';

import {
  asksForSystem,
  closingFor,
  LEAD_REASONS,
  type LeadScoreInput,
  labelOf,
  scoreLead,
  temperatureFor,
} from '../_lib/lead';

const base: LeadScoreInput = {
  reason: 'outro',
  role: 'outro',
  budget: 'ate-5k',
  owner: 'time-interno',
};

describe('scoreLead (tabela de chat-qualificacao.md)', () => {
  it('scores nothing for an "other" lead below the minimum', () => {
    expect(scoreLead(base)).toBe(0);
  });

  it('adds the +5 alert and the +2 project reason for an incident', () => {
    expect(scoreLead({ ...base, reason: 'incidente' })).toBe(7);
  });

  it.each([
    ['construir', 2],
    ['ia', 2],
    ['modernizar', 2],
    ['mentoria', 0],
    ['outro', 0],
  ] as const)('reason %s adds %i', (reason, points) => {
    expect(scoreLead({ ...base, reason })).toBe(points);
  });

  it.each([
    ['dono', 2],
    ['gestor', 2],
    ['ti', 0],
    ['dev', 0],
    ['outro', 0],
  ] as const)('role %s adds %i', (role, points) => {
    expect(scoreLead({ ...base, role })).toBe(points);
  });

  it.each([
    ['ate-5k', 0],
    ['5-20k', 2],
    ['20-50k', 3],
    ['50k-mais', 3],
    ['nao-sei', 1],
  ] as const)('budget %s adds %i', (budget, points) => {
    expect(scoreLead({ ...base, budget })).toBe(points);
  });

  it('adds 1 when nobody looks after the system', () => {
    expect(scoreLead({ ...base, owner: 'ninguem' })).toBe(1);
  });

  it('adds the rows up: owner + project + R$ 20–50 mil = 2 + 2 + 3', () => {
    expect(
      scoreLead({
        reason: 'construir',
        role: 'dono',
        budget: '20-50k',
        owner: 'time-interno',
      }),
    ).toBe(7);
  });

  it('reaches the maximum with an unowned incident and a large budget', () => {
    expect(
      scoreLead({
        reason: 'incidente',
        role: 'gestor',
        budget: '50k-mais',
        owner: 'ninguem',
      }),
    ).toBe(13);
  });
});

describe('temperatureFor', () => {
  it.each([
    [0, 'audiencia'],
    [3, 'audiencia'],
    [4, 'morno'],
    [6, 'morno'],
    [7, 'quente'],
    [13, 'quente'],
  ] as const)('score %i is %s', (score, temperature) => {
    expect(temperatureFor(score)).toBe(temperature);
  });
});

describe('closingFor', () => {
  it('sends any incident straight to WhatsApp, whatever the budget', () => {
    expect(
      closingFor({ reason: 'incidente', role: 'dev', budget: 'ate-5k' }),
    ).toBe('incidente');
  });

  it.each([
    ['dono', '5-20k'],
    ['gestor', '20-50k'],
    ['dono', '50k-mais'],
  ] as const)('treats %s with %s as a fit', (role, budget) => {
    expect(closingFor({ reason: 'construir', role, budget })).toBe('fit');
  });

  it('sends below-minimum budgets to the free material', () => {
    expect(
      closingFor({ reason: 'construir', role: 'dono', budget: 'ate-5k' }),
    ).toBe('sem-orcamento');
  });

  it('keeps a plain conversation for the rest', () => {
    expect(closingFor({ reason: 'ia', role: 'dono', budget: 'nao-sei' })).toBe(
      'conversa',
    );
    expect(closingFor({ reason: 'ia', role: 'dev', budget: '20-50k' })).toBe(
      'conversa',
    );
  });
});

describe('asksForSystem', () => {
  it('skips the scenario question only for mentorship', () => {
    for (const { id } of LEAD_REASONS) {
      expect(asksForSystem(id)).toBe(id !== 'mentoria');
    }
  });
});

describe('labelOf', () => {
  it('returns the label, or the id when it is unknown', () => {
    expect(labelOf(LEAD_REASONS, 'ia')).toBe('Quero usar IA no meu negócio');
    expect(labelOf(LEAD_REASONS, 'nada')).toBe('nada');
  });
});
