import type { Component } from 'vue'

/**
 * Deck Engine v2 — registro de efeitos de fundo (backgrounds animados).
 *
 * Um efeito é um componente Vue decorativo renderizado pelo
 * `DeckSlideBackground` dentro da camada `.slide-bg` (atrás de todo o
 * conteúdo do slide — z-index:-1 sob o `isolation: isolate` do `.slide`).
 * A camada só existe no client, no slide ativo, fora do export PDF e com o
 * toggle "Fundos animados" ligado — o efeito não precisa se preocupar com
 * nada disso.
 *
 * ## Como criar um novo efeito (Canvas 2D via `useDeckBgCanvas`)
 *
 * 1. Crie `Bg<Nome>.vue` nesta pasta com um `<canvas ref>` preenchendo a
 *    camada (`position:absolute; inset:0; width/height:100%`) e chame
 *    `useDeckBgCanvas(canvasRef, { render, onColorsChanged? })`. O composable
 *    cuida do contrato inteiro:
 *    - Coordenadas lógicas fixas de 1280×720 (backing store com cap de dpr;
 *      recompute em resize/fullscreen — o `.stage` escala via transform).
 *    - Loop rAF gateado por `ambientOn` (pausa em aba oculta, reduced-motion,
 *      export e pelo toggle "Animações contínuas") e cleanup no unmount.
 *    - Frame estático determinístico: `render(t=0)` no mount — é o que
 *      reduced-motion e ambient-off exibem. O desenho deve ser função PURA
 *      de `t`, com geometria seeded via `mulberry32` (nunca `Math.random()`).
 *    - Cores resolvidas das CSS vars do tema (`--bge-accent`,
 *      `--bge-accent-2`, `--bg`, `--grid-line`) entregues em `frame.colors`
 *      e relidas na troca claro/escuro — nunca hex fixo no efeito.
 *      Reconstrua sprites offscreen em `onColorsChanged`.
 *    - `--bge-speed` já multiplica o relógio `t`; a opacidade da camada
 *      (`--bge-opacity`) é aplicada no `.slide-bg` pelo host — não a
 *      reaplique no efeito.
 *    Performance: nunca `shadowBlur`/`ctx.filter` por frame — use sprites
 *    radiais pré-renderizados ou desenho em offscreen de baixa resolução
 *    esticado com smoothing (blur gratuito). Alvo <2ms de scripting/frame.
 * 2. Registre-o em `DECK_BACKGROUNDS` (uma linha — o import dinâmico gera um
 *    chunk próprio, carregado sob demanda na primeira ativação do slide).
 * 3. Opcional: adicione um preset semântico em `DECK_BACKGROUND_PRESETS`.
 * 4. Use no slide: `<DeckSlide effect="meu-preset">` ou
 *    `:effect="{ type: 'nome', opacity: 0.4, speed: 0.8, accent: 'mix' }"`.
 */

/** Acento do efeito, resolvido para as vars semânticas do tema. */
export type DeckBackgroundAccent = 'cyan' | 'coral' | 'mix'

/** Configuração de um background animado de slide. */
export interface DeckBackgroundConfig {
  /** Nome do efeito em `DECK_BACKGROUNDS` ('aurora' | 'glow' | 'constellation' | 'flow' | 'embers' | 'ribbon'). */
  type: string
  /** Força visual da camada (0..1). Default 0.5 (via CSS `--bge-opacity`). */
  opacity?: number
  /** Multiplicador de velocidade dos loops (1 = ritmo autoral do efeito). */
  speed?: number
  /** Acento: 'cyan' (máquina, default), 'coral' (humano) ou 'mix' (ambos). */
  accent?: DeckBackgroundAccent
}

/** Valor aceito pela prop `effect` do DeckSlide: nome de efeito/preset ou config. */
export type DeckBackgroundInput = string | DeckBackgroundConfig

/** Efeitos disponíveis — cada um é um chunk lazy próprio. */
export const DECK_BACKGROUNDS: Record<string, () => Promise<Component>> = {
  aurora: () => import('./BgAurora.vue').then(m => m.default),
  glow: () => import('./BgGlow.vue').then(m => m.default),
  constellation: () => import('./BgConstellation.vue').then(m => m.default),
  flow: () => import('./BgFlow.vue').then(m => m.default),
  embers: () => import('./BgEmbers.vue').then(m => m.default),
  ribbon: () => import('./BgRibbon.vue').then(m => m.default),
}

/** Presets semânticos reutilizáveis entre apresentações. */
export const DECK_BACKGROUND_PRESETS: Record<string, DeckBackgroundConfig> = {
  /** Aurora para slides de impacto (fundo deep). */
  'impact-aurora': { type: 'aurora', opacity: 0.5, speed: 0.8 },
  /** Respiração coral para citações (voz humana). */
  'quote-glow': { type: 'glow', accent: 'coral', opacity: 0.45 },
  /** Rede de nós conectados para mapas/sumários. */
  'tech-constellation': { type: 'constellation', opacity: 0.4 },
  /** Linhas fluidas para slides de transição/fluxo. */
  'flow-field': { type: 'flow', accent: 'mix', opacity: 0.35 },
  /** Fitas de energia convergentes para o clímax da narrativa. */
  'climax-ribbon': { type: 'ribbon', accent: 'mix', opacity: 0.5, speed: 0.8 },
}

/** Normaliza a prop `effect`: preset → config do preset; nome → `{ type }`. */
export function resolveBackgroundConfig(input: DeckBackgroundInput): DeckBackgroundConfig {
  if (typeof input !== 'string') return input
  return DECK_BACKGROUND_PRESETS[input] ?? { type: input }
}
