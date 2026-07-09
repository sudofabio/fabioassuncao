import type { Ref } from 'vue'

export interface DeckSwipeOptions {
  onNext: () => void
  onPrev: () => void
  /** Gestos habilitados? (ex.: desligar durante export ou com menu aberto) */
  enabled?: () => boolean
  /** Deslocamento horizontal mínimo (px). */
  minDistance?: number
  /** Tolerância vertical: |dy| < |dx| * ratio (~31° com 0.6). */
  maxOffAxisRatio?: number
  /** Duração máxima do gesto (ms). */
  maxDuration?: number
}

/**
 * Swipe horizontal em touch para navegar slides (esquerda = próximo).
 * Pointer Events com listeners passivos — quem bloqueia o pan horizontal
 * nativo é o CSS `touch-action: pan-y pinch-zoom` no elemento-alvo.
 * A decisão acontece só no pointerup (sem rastrear pointermove); um segundo
 * toque simultâneo aborta o gesto para não interferir no pinch-zoom.
 */
export function useDeckSwipe(targetRef: Ref<HTMLElement | null>, opts: DeckSwipeOptions) {
  const minDistance = opts.minDistance ?? 48
  const maxOffAxisRatio = opts.maxOffAxisRatio ?? 0.6
  const maxDuration = opts.maxDuration ?? 700

  let gesture: { id: number; x0: number; y0: number; t0: number } | null = null
  let lastSwipeAt = 0

  function onPointerDown(e: PointerEvent) {
    if (e.pointerType !== 'touch') return
    if (opts.enabled && !opts.enabled()) return
    if (gesture) {
      // Segundo dedo = pinch: aborta o gesto e deixa o zoom nativo agir.
      gesture = null
      return
    }
    gesture = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now() }
  }

  function onPointerUp(e: PointerEvent) {
    if (!gesture || e.pointerId !== gesture.id) return
    const dx = e.clientX - gesture.x0
    const dy = e.clientY - gesture.y0
    const dt = performance.now() - gesture.t0
    gesture = null
    if (Math.abs(dx) < minDistance) return
    if (Math.abs(dy) >= Math.abs(dx) * maxOffAxisRatio) return
    if (dt > maxDuration) return
    lastSwipeAt = performance.now()
    if (dx < 0) opts.onNext()
    else opts.onPrev()
  }

  function onPointerCancel() {
    gesture = null
  }

  /** O click sintético pós-gesto deve ser ignorado pelas zonas de toque. */
  function swipedRecently() {
    return performance.now() - lastSwipeAt < 350
  }

  function attach(el: HTMLElement) {
    el.addEventListener('pointerdown', onPointerDown, { passive: true })
    el.addEventListener('pointerup', onPointerUp, { passive: true })
    el.addEventListener('pointercancel', onPointerCancel, { passive: true })
  }

  function detach(el: HTMLElement) {
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerCancel)
  }

  watch(targetRef, (el, prev) => {
    if (prev) detach(prev)
    if (el) attach(el)
  })

  onMounted(() => {
    if (targetRef.value) attach(targetRef.value)
  })

  onBeforeUnmount(() => {
    if (targetRef.value) detach(targetRef.value)
    gesture = null
  })

  return { swipedRecently }
}
