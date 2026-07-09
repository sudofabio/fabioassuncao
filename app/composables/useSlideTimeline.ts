import type { Ref, ShallowRef } from 'vue'
import { DECK_KEY, SLIDE_KEY, type SlideContext } from '~/components/deck/context'

type Timeline = import('gsap').default.core.Timeline

/**
 * Hook de orquestração GSAP por slide (Deck Engine v2, ARQUITETURA §6.2).
 *
 * O slide declara uma timeline pausada em `build(tl)`; a engine:
 * - `play()` quando o slide entra avançando;
 * - `seek(fim)` quando se entra voltando (estado final imediato);
 * - reseta ao início no leave (re-entrada replaya);
 * - ancora labels `step-N` aos build steps (`tweenTo` no avanço do step);
 * - salta ao estado final com reduced-motion e durante o export PDF.
 *
 * Convenção de steps na timeline:
 *   [intro] → addLabel('step-0') → addPause() → [conteúdo do step 1]
 *   → addLabel('step-1') → addPause() → ...
 * O `play()` da entrada para no primeiro `addPause()`; cada step revelado
 * dispara `tweenTo('step-N')` (que atravessa os addPause); voltar um step
 * tweena de volta ao label anterior.
 *
 * Quem revela os steps é indiferente à timeline: por padrão o autoplay do
 * DeckStage os incrementa sozinho (usando as durações medidas dos labels via
 * `stepDurationMs`); em modo manual (`?manual=1` ou `:autoplay="false"`),
 * cada clique do usuário. A convenção addLabel/addPause serve aos dois.
 *
 * Uso: (a) em um componente descendente de DeckSlide (inject resolve sozinho);
 * ou (b) no componente-dono do slide — que RENDERIZA o DeckSlide e portanto não
 * é descendente — passando `slideRef` (template ref do DeckSlide, que expõe `ctx`).
 */
export function useSlideTimeline(
  build: (tl: Timeline) => void,
  slideRef?: Ref<{ ctx: SlideContext } | null>,
): ShallowRef<Timeline | null> {
  const deck = inject(DECK_KEY, null)
  const injected = inject(SLIDE_KEY, null)
  const tlRef = shallowRef<Timeline | null>(null)

  let unregister: (() => void) | null = null

  onMounted(async () => {
    const slide = injected ?? slideRef?.value?.ctx
    if (!deck || !slide) {
      console.warn('[useSlideTimeline] sem contexto de slide (use dentro de um DeckSlide ou passe slideRef).')
      return
    }
    const { gsap } = await import('gsap')
    const tl = gsap.timeline({ paused: true })
    build(tl)
    tlRef.value = tl

    const still = () => deck.reducedMotion.value || deck.exporting.value

    const enter = () => {
      if (still() || deck.navDirection.value === -1) { tl.progress(1).pause(); return }
      // Deep-link no meio dos steps: assume o estado do step atual sem animar.
      const n = slide.currentStep.value
      if (n > 0 && tl.labels[`step-${n}`] !== undefined) { tl.seek(`step-${n}`).pause(); return }
      tl.restart()
    }

    if (slide.isActive.value) enter()

    watch(slide.isActive, (active) => {
      if (active) enter()
      else tl.pause(0)
    })

    // Steps → labels: um label `step-N` na timeline vira âncora do step N.
    watch(slide.currentStep, (n) => {
      if (!slide.isActive.value) return
      const label = `step-${n}`
      if (tl.labels[label] === undefined) return
      if (still()) tl.seek(label).pause()
      else tl.tweenTo(label)
    })

    unregister = deck.registerTimeline({
      slideIndex: slide.index,
      seekEnd: () => { tl.progress(1).pause() },
      // Duração real de cada fase, medida dos labels — o autoplay do DeckStage
      // espera a animação terminar antes de agendar o próximo step.
      stepDurationMs: (n: number) => {
        const end = tl.labels[`step-${n}`]
        if (end === undefined) return null
        const start = n > 0 ? tl.labels[`step-${n - 1}`] : 0
        if (start === undefined) return null
        return Math.max(0, (end - start) * 1000)
      },
    })
  })

  onBeforeUnmount(() => {
    unregister?.()
    tlRef.value?.kill()
    tlRef.value = null
  })

  return tlRef
}
