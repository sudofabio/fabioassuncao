<template>
  <aside class="presenter" aria-label="Painel do apresentador">
    <div class="pr-main">
      <div class="pr-head">
        <span class="pr-title">{{ current.title || `Slide ${slideIndex + 1}` }}</span>
        <span class="pr-meta">
          slide {{ slideIndex + 1 }}/{{ total }}
          <template v-if="stepsCount > 0"> · step {{ stepIndex }}/{{ stepsCount }}</template>
        </span>
      </div>
      <p class="pr-notes">{{ current.notes || '— sem notas —' }}</p>
    </div>
    <div class="pr-side">
      <div class="pr-next-label">A seguir</div>
      <div class="pr-next">{{ nextTitle }}</div>
      <div class="pr-timer" aria-label="Tempo decorrido">{{ elapsed }}</div>
    </div>
  </aside>
</template>

<script setup>
/**
 * Presenter mode (escopo mínimo): notas do slide atual, contagem de steps,
 * título do próximo slide e timer decorrido. Ativado por ?presenter=1 no
 * DeckStage. Os metadados vêm do registro dos DeckSlide (props title/notes).
 */
const props = defineProps({
  /** Registro de metadados dos slides ({ title, notes }[]). */
  metas: { type: Array, required: true },
  slideIndex: { type: Number, required: true },
  stepIndex: { type: Number, required: true },
  stepsCount: { type: Number, required: true },
  total: { type: Number, required: true },
})

const current = computed(() => props.metas[props.slideIndex] || {})
const nextTitle = computed(() => {
  if (props.slideIndex + 1 >= props.total) return '— fim —'
  const meta = props.metas[props.slideIndex + 1] || {}
  return meta.title || `Slide ${props.slideIndex + 2}`
})

// Timer decorrido desde a montagem (início da apresentação).
const elapsed = ref('00:00')
let start = 0
let interval = null

onMounted(() => {
  start = Date.now()
  interval = setInterval(() => {
    const s = Math.floor((Date.now() - start) / 1000)
    const mm = String(Math.floor(s / 60)).padStart(2, '0')
    const ss = String(s % 60).padStart(2, '0')
    elapsed.value = `${mm}:${ss}`
  }, 1000)
})

onBeforeUnmount(() => clearInterval(interval))
</script>
