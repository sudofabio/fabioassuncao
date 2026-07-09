<template>
  <section
    class="slide"
    :class="{ active: isActive, flush }"
    :style="{ background: resolvedBackground }"
    role="group"
    aria-roledescription="slide"
    :aria-hidden="!isActive"
  >
    <slot />
  </section>
</template>

<script setup>
import { DECK_KEY, SLIDE_KEY } from './context'

const props = defineProps({
  /** Background do slide: qualquer valor CSS. 'deep' = fundo de impacto do tema. */
  background: { type: String, default: '' },
  /** Remove o padding interno (slide "sangrado"). */
  flush: { type: Boolean, default: false },
  /** Título curto do slide (presenter mode / acessibilidade). */
  title: { type: String, default: '' },
  /** Notas do apresentador (roteiro de fala). */
  notes: { type: String, default: '' },
  /**
   * Override do timing de autoplay: Number = dwell uniforme (ms após cada
   * animação) ou Array = delay total (ms) antes de cada step.
   */
  stepDwell: { type: [Number, Array], default: undefined },
})

const deck = inject(DECK_KEY)
const index = deck.registerSlide({ title: props.title, notes: props.notes, stepDwell: props.stepDwell })
const isActive = computed(() => deck.slideIndex.value === index)

// Steps registram-se na ordem de renderização (ou com `at` explícito).
// A maior ordem registrada é reportada à engine como stepsCount do slide.
let stepMax = 0
function registerStep(at) {
  const order = at ?? stepMax + 1
  if (order > stepMax) {
    stepMax = order
    deck.setStepsCount(index, stepMax)
  }
  return order
}

const currentStep = computed(() => (isActive.value ? deck.stepIndex.value : 0))

function isStepOn(at) {
  if (deck.exporting.value) return true
  return isActive.value && deck.stepIndex.value >= at
}

const ctx = { index, isActive, registerStep, currentStep, isStepOn }
provide(SLIDE_KEY, ctx)
// Exposto para o componente-dono do slide (que renderiza o DeckSlide e portanto
// não pode usar inject): útil para useSlideTimeline e opções reativas de gráfico.
defineExpose({ ctx })

const resolvedBackground = computed(() => {
  if (!props.background) return 'var(--bg)'
  if (props.background === 'deep') return 'var(--bg-deep)'
  return props.background
})
</script>
