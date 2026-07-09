import type { InjectionKey, Ref, ComputedRef } from 'vue'

/**
 * Deck Engine v2 — contexto compartilhado entre a engine (`DeckStage`) e os
 * componentes de slide. A engine é agnóstica de conteúdo: nada específico de
 * uma apresentação vive aqui (extraível como Nuxt Layer no futuro).
 */

/** Modo de cor do deck. `dark` é a base autoral; `light` é derivado por overrides. */
export type DeckColorMode = 'dark' | 'light'

/**
 * Paleta para gráficos ECharts (renderer SVG não resolve `var()` — os valores
 * precisam ser cores absolutas, escolhidas pelo modo ativo).
 */
export interface DeckChartPalette {
  axisLabel: string
  axisLine: string
  splitLine: string
  /** Cor do fundo do slide (borda/label interno de donuts etc.). */
  slideBg: string
  /** Acentos semânticos usados pelas séries. */
  accents: {
    muted: string
    green: string
    cyan: string
    coral: string
    red: string
    amber: string
  }
}

/** Tema de um deck: CSS custom properties aplicadas na raiz (.deck-root). */
export interface DeckTheme {
  /** Modo escuro — base e default. */
  vars: Record<string, string>
  /** Overrides do modo claro (mesclados sobre `vars`). Ausente = deck sem light mode. */
  lightVars?: Record<string, string>
  /** Paletas de gráficos por modo. */
  charts?: Record<DeckColorMode, DeckChartPalette>
}

/** Metadados que um slide registra na engine (usados pelo presenter mode e autoplay). */
export interface DeckSlideMeta {
  title?: string
  notes?: string
  /**
   * Override do timing de autoplay deste slide:
   * - Number: dwell uniforme (ms de pausa de leitura após cada animação);
   * - Array: delay total (ms) antes de cada step (índice 0 = delay do step 1).
   */
  stepDwell?: number | number[]
}

/** Timeline GSAP registrada por um slide — o export PDF a leva ao estado final. */
export interface DeckTimelineHandle {
  slideIndex: number
  seekEnd: () => void
  /**
   * Duração (ms) da fase `n` da timeline, medida dos labels `step-N`:
   * n = 0 → intro (t do label `step-0`); n ≥ 1 → `step-n` − `step-(n-1)`.
   * `null` quando os labels não existem — o autoplay usa o fallback fixo.
   */
  stepDurationMs?: (n: number) => number | null
}

/** Gráfico ECharts registrado por um slide — o export desliga a animação e aguarda o render. */
export interface DeckChartHandle {
  slideIndex: number
  finalize: () => Promise<void>
}

/** Contexto provido por `DeckStage` e consumido por `DeckSlide` e composables. */
export interface DeckContext {
  /** Registra um slide na ordem de renderização e devolve seu índice (0-based). */
  registerSlide: (meta?: DeckSlideMeta) => number
  /** Informa quantos build steps o slide possui (maior ordem registrada). */
  setStepsCount: (slideIndex: number, count: number) => void
  /** Slide ativo (0-based). */
  slideIndex: Ref<number>
  /** Step ativo dentro do slide atual (0 = nenhum step revelado). */
  stepIndex: Ref<number>
  /** Direção da última navegação: +1 avançando, -1 voltando. */
  navDirection: Ref<1 | -1>
  /** Usuário prefere movimento reduzido (ou export em andamento força true). */
  reducedMotion: Ref<boolean>
  /** Export PDF em andamento — steps todos revelados, animações no estado final. */
  exporting: Ref<boolean>
  /**
   * Loops ambient (animações contínuas) permitidos — ligado pelo usuário e
   * sem export/reduced-motion. Em CSS o gate é a classe `.ambient-on` no
   * `.deck-root`; este computed existe para loops dirigidos por JS/GSAP.
   */
  ambientOn: ComputedRef<boolean>
  /**
   * Pedido transiente de "revelar os steps do slide atual ao estado final sem
   * animar", disparado ao completar o slide via avanço. Só o GSAP o honra
   * (salto instantâneo em vez de tween); contadores/gráficos/CSS mantêm sua
   * animação de entrada rápida normal.
   */
  snapSteps: Ref<boolean>
  /** Registra uma timeline GSAP; devolve a função de desregistro. */
  registerTimeline: (handle: DeckTimelineHandle) => () => void
  /** Registra um gráfico ECharts; devolve a função de desregistro. */
  registerChart: (handle: DeckChartHandle) => () => void
}

/** Contexto provido por `DeckSlide` e consumido por steps/reveals/counters/charts. */
export interface SlideContext {
  /** Índice deste slide no deck. */
  index: number
  /** Este slide está ativo? */
  isActive: ComputedRef<boolean>
  /** Registra um build step (ordem de render, ou `at` explícito) e devolve sua ordem (1-based). */
  registerStep: (at?: number) => number
  /** Step atual deste slide (0 quando inativo). */
  currentStep: ComputedRef<number>
  /** O step de ordem `at` está revelado? (sempre true durante export) */
  isStepOn: (at: number) => boolean
}

export const DECK_KEY: InjectionKey<DeckContext> = Symbol('deck')
export const SLIDE_KEY: InjectionKey<SlideContext> = Symbol('deck-slide')
