import { describe, expect, it } from 'vitest';

import { SERVICES_NOTE, serviceGroups } from '../services';

const services = serviceGroups.flatMap((group) => group.services);

describe('services data', () => {
  it('keeps the five "para quem quer…" groups of site-fabio.md §4', () => {
    expect(serviceGroups.map((group) => group.need)).toEqual([
      'Construir um sistema',
      'Saber exatamente o que construir antes de investir',
      'Usar IA de verdade no negócio',
      'Proteger e atualizar o que já tem',
      'Ter um sênior do lado',
    ]);
  });

  it('uses unique group ids and unique catalogue codes', () => {
    const ids = serviceGroups.map((group) => group.id);
    expect(new Set(ids).size).toBe(ids.length);
    const codes = services.map((service) => service.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const code of codes) expect(code).toMatch(/^O\d{1,2}$/);
  });

  it('gives every service a name and a summary', () => {
    for (const service of services) {
      expect(service.name.trim().length, service.code).toBeGreaterThan(0);
      expect(service.summary.trim().length, service.code).toBeGreaterThan(0);
    }
  });

  /**
   * Prices await DECISOES 18 and a legal review. Defining one publishes it,
   * so this guard has to be changed on purpose together with that decision.
   */
  it('publishes no price before the decision', () => {
    for (const service of services) {
      expect(service.price, service.code).toBeUndefined();
    }
    expect(JSON.stringify(serviceGroups)).not.toMatch(/R\$/);
  });

  it('states the commitments, with the Codions as the team behind', () => {
    expect(SERVICES_NOTE).toMatch(/Codions/);
    expect(SERVICES_NOTE).toMatch(/proposta por escrito/);
    expect(SERVICES_NOTE).toMatch(/NDA/);
  });
});
