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
    '--amber': '#E8B44C',     // destaque numérico/alerta suave
    '--navy-soft': '#1D3A5C', // tints de navy (iceberg, gradientes)
    '--grid-line': '#182C49', // linhas de grade/apoio
    '--terminal-bg': '#0A1220', // mock de terminal — escuro nos dois modos
    '--ease': 'cubic-bezier(.2,.75,.2,1)',
  },
  // Modo claro: fundos claros e acentos escurecidos (contraste ≥ ~4.5:1 sobre --bg).
  lightVars: {
    '--bg': '#F5F8FC',
    '--bg2': '#FFFFFF',
    '--bg-deep': '#E9EFF7',
    '--text': '#0E1B2E',
    '--text2': '#44607C',
    '--cyan': '#0B7CA8',
    '--coral': '#C25510',
    '--green': '#178A57',
    '--red': '#C03A2B',
    '--border': '#C9D6E5',
    '--amber': '#A97B14',
    '--navy-soft': '#B9CCE2',
    '--grid-line': '#DCE6F1',
  },
  // ECharts (SVG) não resolve var() — paleta absoluta escolhida pelo modo ativo.
  charts: {
    dark: {
      axisLabel: '#8FA3BF',
      axisLine: '#233650',
      splitLine: '#182C49',
      slideBg: '#0B1526',
      accents: {
        muted: '#8FA3BF',
        green: '#3ECF8E',
        cyan: '#37C6F4',
        coral: '#F2762E',
        red: '#E85D4C',
        amber: '#E8B44C',
      },
    },
    light: {
      axisLabel: '#44607C',
      axisLine: '#C9D6E5',
      splitLine: '#DCE6F1',
      slideBg: '#F5F8FC',
      accents: {
        muted: '#5B7188',
        green: '#178A57',
        cyan: '#0B7CA8',
        coral: '#C25510',
        red: '#C03A2B',
        amber: '#A97B14',
      },
    },
  },
}
