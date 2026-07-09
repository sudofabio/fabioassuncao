/**
 * Modelos de trabalho — dados VALIDADOS (Pesquisa Código Fonte TV 2026).
 * NÃO alterar/arredondar além do especificado no APRESENTACAO_BASE.md (slide 19).
 */

import type { DeckChartPalette } from '~/components/deck/context'

/** `cor` é um token semântico resolvido pela paleta do tema (dark/light) no slide. */
export const MODELOS_2026: { nome: string; valor: number; cor: keyof DeckChartPalette['accents'] }[] = [
  { nome: 'Remoto', valor: 60.08, cor: 'cyan' },
  { nome: 'Híbrido', valor: 22.44, cor: 'green' },
  { nome: 'Presencial', valor: 17.48, cor: 'muted' },
]

/** Tendência do remoto 2022→2026 (sparkline discreto). */
export const TENDENCIA_REMOTO = [
  { ano: '2022', valor: 75.05 },
  { ano: '2023', valor: 72.95 },
  { ano: '2024', valor: 65.74 },
  { ano: '2025', valor: 61.77 },
  { ano: '2026', valor: 60.08 },
]

export const CALLOUTS_TRABALHO = {
  pressaoRetorno: 39.48,
  produtividadeRemoto: 76.67,
  atuamExterior: 14,
  maisDeUmContrato: 22.5,
}

export const FONTE_TRABALHO = 'Fonte: Pesquisa Código Fonte TV 2026 (pesquisa.codigofonte.com.br)'
