import type { Ref } from 'vue'
import { DECK_KEY } from '~/components/deck/context'

/**
 * Deck Engine v2 — infraestrutura comum dos efeitos de fundo em Canvas 2D.
 *
 * Encapsula tudo o que o contrato do registry exige de um efeito canvas:
 * - Coordenadas lógicas fixas de 1280×720 (o palco do deck), com backing
 *   store dimensionado pelo tamanho real na tela × devicePixelRatio. O
 *   `.stage` escala via `transform: scale()` (não dispara ResizeObserver),
 *   então o recompute acontece em `resize`/`fullscreenchange` medindo o
 *   `getBoundingClientRect()` do canvas.
 * - Loop rAF gateado por `ambientOn` (pausa em aba oculta, reduced-motion,
 *   export e pelo toggle "Animações contínuas"). O relógio é acumulado: o
 *   tempo não salta ao pausar/retomar e começa em 0.
 * - Frame estático determinístico: um `render(t=0)` no mount — é o que
 *   reduced-motion e ambient-off exibem. O desenho deve ser função pura de
 *   `t` com geometria seeded (nunca `Math.random()`).
 * - Cores resolvidas das CSS vars do tema (`--bge-accent`, `--bge-accent-2`,
 *   `--bg`, `--grid-line`), relidas quando o modo claro/escuro muda —
 *   `onColorsChanged` permite reconstruir sprites offscreen.
 * - Cleanup completo no unmount.
 */

/** Cor decomposta — pronta para interpolação e `rgba()`. */
export interface BgRGB {
  r: number
  g: number
  b: number
}

/** Cores do tema resolvidas no momento do render (mudam com light/dark). */
export interface BgColors {
  accent: BgRGB
  accent2: BgRGB
  bg: BgRGB
  gridLine: BgRGB
}

/** Argumento do callback de render de um frame. */
export interface BgFrame {
  ctx: CanvasRenderingContext2D
  /** Largura lógica (sempre 1280). */
  w: number
  /** Altura lógica (sempre 720). */
  h: number
  /** Tempo acumulado em segundos (0 no frame estático; já multiplicado por `--bge-speed`). */
  t: number
  colors: BgColors
}

export interface DeckBgCanvasOptions {
  render: (frame: BgFrame) => void
  /** Chamado quando as cores do tema mudam — reconstrua sprites offscreen aqui. */
  onColorsChanged?: (colors: BgColors) => void
  /** Cap do fator de resolução do backing store (default 2). */
  maxDpr?: number
}

/** Palco lógico do deck (ver DeckStage). */
export const BG_W = 1280
export const BG_H = 720

/** mulberry32 — PRNG minúsculo e determinístico (convenção: nunca Math.random()). */
export function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** `rgba()` CSS a partir de uma cor decomposta. */
export function bgRgba(c: BgRGB, alpha: number): string {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`
}

/** Interpolação linear entre duas cores (k em 0..1). */
export function bgMix(a: BgRGB, b: BgRGB, k: number): BgRGB {
  return {
    r: Math.round(a.r + (b.r - a.r) * k),
    g: Math.round(a.g + (b.g - a.g) * k),
    b: Math.round(a.b + (b.b - a.b) * k),
  }
}

/** Parser de hex (#rgb/#rrggbb) com fallback para vars ausentes. */
function parseHex(value: string, fallback: BgRGB): BgRGB {
  const v = value.trim()
  const m3 = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(v)
  if (m3) {
    return {
      r: parseInt(m3[1]! + m3[1]!, 16),
      g: parseInt(m3[2]! + m3[2]!, 16),
      b: parseInt(m3[3]! + m3[3]!, 16),
    }
  }
  const m6 = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(v)
  if (m6) {
    return {
      r: parseInt(m6[1]!, 16),
      g: parseInt(m6[2]!, 16),
      b: parseInt(m6[3]!, 16),
    }
  }
  return fallback
}

const FALLBACKS: BgColors = {
  accent: { r: 55, g: 198, b: 244 },   // --cyan (dark)
  accent2: { r: 242, g: 118, b: 46 },  // --coral (dark)
  bg: { r: 11, g: 21, b: 38 },         // --bg (dark)
  gridLine: { r: 24, g: 44, b: 73 },   // --grid-line (dark)
}

export function useDeckBgCanvas(
  canvasRef: Ref<HTMLCanvasElement | null>,
  opts: DeckBgCanvasOptions,
): void {
  const deck = inject(DECK_KEY)
  const { mode } = useDeckColorMode()
  const maxDpr = opts.maxDpr ?? 2

  let ctx: CanvasRenderingContext2D | null = null
  let colors: BgColors = FALLBACKS
  let speed = 1
  let t = 0
  let raf = 0
  let lastTs = 0
  let resizeRaf = 0

  function readColors() {
    const canvas = canvasRef.value
    if (!canvas) return
    const cs = getComputedStyle(canvas)
    colors = {
      accent: parseHex(cs.getPropertyValue('--bge-accent'), FALLBACKS.accent),
      accent2: parseHex(cs.getPropertyValue('--bge-accent-2'), FALLBACKS.accent2),
      bg: parseHex(cs.getPropertyValue('--bg'), FALLBACKS.bg),
      gridLine: parseHex(cs.getPropertyValue('--grid-line'), FALLBACKS.gridLine),
    }
    const s = parseFloat(cs.getPropertyValue('--bge-speed'))
    speed = Number.isFinite(s) && s > 0 ? s : 1
  }

  function computeSize() {
    const canvas = canvasRef.value
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0) return
    const k = Math.min(Math.max((rect.width * window.devicePixelRatio) / BG_W, 1), maxDpr)
    const w = Math.round(BG_W * k)
    const h = Math.round(BG_H * k)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    ctx.setTransform(k, 0, 0, k, 0, 0)
  }

  function renderFrame() {
    if (!ctx) return
    ctx.save()
    ctx.clearRect(0, 0, BG_W, BG_H)
    opts.render({ ctx, w: BG_W, h: BG_H, t, colors })
    ctx.restore()
  }

  function loop(ts: number) {
    // dt clampado: após throttle (aba oculta etc.) o tempo não salta.
    const dt = Math.min((ts - lastTs) / 1000, 0.1)
    lastTs = ts
    t += dt * speed
    renderFrame()
    raf = requestAnimationFrame(loop)
  }

  function start() {
    if (raf || !ctx) return
    lastTs = performance.now()
    raf = requestAnimationFrame(loop)
  }

  function stop() {
    if (!raf) return
    cancelAnimationFrame(raf)
    raf = 0
  }

  // Mede depois do layout assentar (applyScale do stage roda no mesmo evento).
  function onResize() {
    if (resizeRaf) return
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = 0
      computeSize()
      renderFrame()
    })
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return
    readColors()
    opts.onColorsChanged?.(colors)
    computeSize()
    renderFrame() // frame estático determinístico (t=0)
    window.addEventListener('resize', onResize)
    document.addEventListener('fullscreenchange', onResize)
    if (deck?.ambientOn.value) start()
  })

  if (deck) {
    watch(deck.ambientOn, on => {
      if (on) start()
      else stop()
    })
  }

  // Troca de tema ao vivo: relê as cores resolvidas e re-renderiza mesmo pausado.
  watch(mode, () => {
    nextTick(() => {
      readColors()
      opts.onColorsChanged?.(colors)
      renderFrame()
    })
  })

  onBeforeUnmount(() => {
    stop()
    if (resizeRaf) cancelAnimationFrame(resizeRaf)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('fullscreenchange', onResize)
    ctx = null
  })
}
