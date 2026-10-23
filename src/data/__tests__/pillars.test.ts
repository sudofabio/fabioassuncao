import { describe, expect, it } from 'vitest';

import { POSITIONING, pillars, STANDARD } from '../pillars';

describe('pillars data', () => {
  it('uses the six series names of the brand book', () => {
    expect(pillars.map((pillar) => pillar.series)).toEqual([
      'Sem Hype · IA',
      'Alerta · Segurança',
      'Quanto Custa',
      'Na Prática',
      'Bastidor',
      'Dev Sênior',
    ]);
  });

  it('colours each label with a brand tone, and severity only for Alerta', () => {
    for (const pillar of pillars) {
      expect(['signal', 'cobalt', 'risk', 'ink']).toContain(pillar.tone);
      expect(pillar.title.trim().length).toBeGreaterThan(0);
      expect(pillar.text.trim().length).toBeGreaterThan(0);
    }
    expect(pillars.filter((pillar) => pillar.tone === 'risk')).toEqual([
      expect.objectContaining({ series: 'Alerta · Segurança' }),
    ]);
  });

  it('keeps the positioning and the three-part standard', () => {
    expect(POSITIONING).toMatch(/sem hype/);
    expect(STANDARD.map((item) => item.title)).toEqual([
      'Fato com fonte',
      'Leitura de quem viveu',
      'O que fazer',
    ]);
  });

  it('avoids the words the tone guide forbids', () => {
    const copy = JSON.stringify({ pillars, STANDARD, POSITIONING });
    expect(copy).not.toMatch(/100%|garantid|últimas vagas|só hoje|fórmula/i);
  });
});
