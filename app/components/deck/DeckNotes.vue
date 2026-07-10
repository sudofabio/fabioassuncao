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
      <div class="pr-timer-row">
        <span class="pr-timer" :class="{ paused: !running }" aria-label="Tempo decorrido">{{ elapsed }}</span>
        <button
          type="button"
          class="pr-timer-btn"
          :title="running ? 'Pausar cronômetro' : 'Retomar cronômetro'"
          :aria-label="running ? 'Pausar cronômetro' : 'Retomar cronômetro'"
          :aria-pressed="!running"
          @click="toggleTimer"
        >
          <Pause v-if="running" :size="14" />
          <Play v-else :size="14" />
        </button>
        <button type="button" class="pr-timer-btn" title="Zerar cronômetro" aria-label="Zerar cronômetro" @click="resetTimer">
          <RotateCcw :size="14" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
/**
 * Presenter mode: notas do slide atual, contagem de steps, título do próximo
 * slide e cronômetro com pausa/zerar. Ativado pelo menu ⋮ ("Notas do
 * palestrante"), tecla N ou ?presenter=1 no DeckStage. Os metadados vêm do
 * registro dos DeckSlide (props title/notes).
 */
import { Pause, Play, RotateCcw } from 'lucide-vue-next'

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

// Cronômetro: acumulador (ms) + período corrente. Pausar congela sem perder
// o tempo já contado; zerar volta a 00:00 mantendo o estado rodando/pausado.
const running = ref(true)
const elapsed = ref('00:00')
let accumulated = 0
let startedAt = 0
let interval = null

function format(ms) {
  const s = Math.floor(ms / 1000)
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

function tick() {
  elapsed.value = format(accumulated + (running.value ? Date.now() - startedAt : 0))
}

function toggleTimer() {
  if (running.value) {
    accumulated += Date.now() - startedAt
    clearInterval(interval)
    interval = null
  } else {
    startedAt = Date.now()
    interval = setInterval(tick, 1000)
  }
  running.value = !running.value
  tick()
}

function resetTimer() {
  accumulated = 0
  startedAt = Date.now()
  tick()
}

onMounted(() => {
  startedAt = Date.now()
  interval = setInterval(tick, 1000)
})

onBeforeUnmount(() => clearInterval(interval))
</script>
