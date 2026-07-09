import type { DeckTheme } from '~/components/deck/context'

/**
 * Tema da apresentação "Além do código" — paleta "Blueprint da nova engenharia"
 * (DIRECIONAMENTO_VISUAL.md §3–4).
 *
 * Semântica de cor (invariante em toda a apresentação):
 *   ciano  = máquina / dados / técnica
 *   coral  = humano / intenção / risco
 */
export const alemDoCodigoTheme: DeckTheme = {
  vars: {
    '--bg': '#0B1526',        // fundo primário (deep navy)
    '--bg2': '#122036',       // fundo secundário (cards, painéis)
    '--bg-deep': '#070D18',   // slides de impacto/citação (quase preto)
    '--text': '#F2F5F9',      // texto principal (off-white)
    '--text2': '#8FA3BF',     // texto secundário (cinza-azulado)
    '--cyan': '#37C6F4',      // acento primário — máquina/dados
    '--coral': '#F2762E',     // acento secundário — humano/intenção
    '--green': '#3ECF8E',     // sucesso/positivo
    '--red': '#E85D4C',       // alerta/negativo
    '--border': '#233650',    // bordas de cards
    '--ease': 'cubic-bezier(.2,.75,.2,1)',
  },
}
