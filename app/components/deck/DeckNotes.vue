<template>
  <aside class="presenter" aria-label="Painel do apresentador" :style="{ '--pr-font-scale': fontScale }">
    <div ref="mainRef" class="pr-main" @wheel="onManualScroll" @touchmove="onManualScroll">
      <p v-for="(block, i) in parsed.blocks" :key="`${slideIndex}-${i}`" class="pr-speech">{{ block }}</p>
      <p v-if="!parsed.blocks.length" class="pr-speech pr-speech-empty">— sem notas —</p>
      <p v-if="parsed.transition" class="pr-transition">{{ parsed.transition }}</p>
    </div>
    <div class="pr-side">
      <div class="pr-title">{{ current.title || `Slide ${slideIndex + 1}` }}</div>
      <div class="pr-meta">
        slide {{ slideIndex + 1 }}/{{ total }}
        <template v-if="stepsCount > 0"> · passo {{ stepIndex }}/{{ stepsCount }}</template>
      </div>
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
      <div class="pr-scroll-row">
        <span class="pr-scroll-label">Rolagem</span>
        <button
          type="button"
          class="pr-timer-btn"
          :title="scrollOn ? 'Pausar rolagem automática' : 'Retomar rolagem automática'"
          :aria-label="scrollOn ? 'Pausar rolagem automática' : 'Retomar rolagem automática'"
          :aria-pressed="!scrollOn"
          @click="toggleScroll"
        >
          <Pause v-if="scrollOn" :size="14" />
          <Play v-else :size="14" />
        </button>
        <button type="button" class="pr-timer-btn" title="Diminuir velocidade" aria-label="Diminuir velocidade da rolagem" @click="changeSpeed(-0.25)">
          <Minus :size="14" />
        </button>
        <span class="pr-scroll-speed" aria-label="Velocidade da rolagem">{{ speedLabel }}</span>
        <button type="button" class="pr-timer-btn" title="Aumentar velocidade" aria-label="Aumentar velocidade da rolagem" @click="changeSpeed(0.25)">
          <Plus :size="14" />
        </button>
      </div>
      <div class="pr-scroll-row">
        <span class="pr-scroll-label">Fonte</span>
        <button type="button" class="pr-timer-btn" title="Diminuir fonte" aria-label="Diminuir tamanho da fonte" @click="changeFont(-0.1)">
          <Minus :size="14" />
        </button>
        <span class="pr-scroll-speed" aria-label="Tamanho da fonte">{{ fontLabel }}</span>
        <button type="button" class="pr-timer-btn" title="Aumentar fonte" aria-label="Aumentar tamanho da fonte" @click="changeFont(0.1)">
          <Plus :size="14" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
/**
 * Presenter mode em estilo teleprompter: a área principal mostra apenas o
 * texto falado, grande e de alto contraste; título, posição, passos e
 * direções de cena ficam na coluna lateral, junto do próximo slide e do
 * cronômetro com pausa/zerar. Ativado pelo menu ⋮ ("Notas do palestrante"),
 * tecla N ou ?presenter=1 no DeckStage. Os metadados vêm do registro dos
 * DeckSlide (props title/notes).
 *
 * Convenção interpretada no campo `notes`:
 * - Cada linha não vazia é um parágrafo da fala.
 * - A linha iniciada por "→" é a frase de transição para o próximo slide:
 *   aparece esmaecida no fim do prompter, sem a seta.
 * - Trechos entre colchetes são marcação de produção, não fala: são
 *   removidos e nunca exibidos.
 *
 * Quando a fala não cabe no painel, o texto rola sozinho em velocidade
 * ajustável (controle "Rolagem" na lateral, persistido em localStorage);
 * rolar manualmente pausa a rolagem automática.
 */
import { Minus, Pause, Play, Plus, RotateCcw } from 'lucide-vue-next'

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

function parseNotes(raw) {
  const transitions = []
  const blocks = []

  for (const line of String(raw || '').split('\n')) {
    const text = line.replace(/\[[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim()
    if (!text) continue
    if (text.startsWith('→')) transitions.push(text.slice(1).trim())
    else blocks.push(text)
  }

  return { blocks, transition: transitions.join(' ') }
}

const parsed = computed(() => parseNotes(current.value.notes))

// Rolagem automática (teleprompter): rAF move o scroll do prompter quando a
// fala não cabe no painel. Posição acumulada em float (scrollTop arredonda),
// pausa de leitura no início de cada slide, e rolagem manual desliga o
// automático até o apresentador retomar.
const SCROLL_PXPS = 24 // px/s na velocidade 1×
const SCROLL_STORAGE = 'deck-notes-scroll'
const START_HOLD_MS = 1500

const mainRef = ref(null)
const scrollOn = ref(true)
const scrollSpeed = ref(1)
const speedLabel = computed(() => `${parseFloat(scrollSpeed.value.toFixed(2))}×`)

// Tamanho da fonte do prompter: multiplicador sobre o clamp base do CSS
// (--pr-font-scale), ajustável na lateral e persistido com as demais prefs.
const fontScale = ref(1)
const fontLabel = computed(() => `${Math.round(fontScale.value * 100)}%`)

function changeFont(delta) {
  fontScale.value = Math.round(Math.min(1.8, Math.max(0.6, fontScale.value + delta)) * 10) / 10
}

let scrollPos = 0
let holdUntil = 0
let lastFrame = 0
let rafId = null

function scrollFrame(t) {
  rafId = requestAnimationFrame(scrollFrame)
  const dt = lastFrame ? t - lastFrame : 0
  lastFrame = t
  const el = mainRef.value
  if (!el) return
  const max = el.scrollHeight - el.clientHeight
  if (!scrollOn.value || t < holdUntil || max <= 0 || scrollPos >= max) {
    scrollPos = el.scrollTop // acompanha rolagem manual sem "puxar" de volta
    return
  }
  scrollPos = Math.min(scrollPos + SCROLL_PXPS * scrollSpeed.value * (dt / 1000), max)
  el.scrollTop = scrollPos
}

function toggleScroll() {
  scrollOn.value = !scrollOn.value
  if (scrollOn.value) holdUntil = 0
}

function changeSpeed(delta) {
  scrollSpeed.value = Math.min(3, Math.max(0.25, scrollSpeed.value + delta))
}

function onManualScroll() {
  scrollOn.value = false
}

watch([scrollOn, scrollSpeed, fontScale], ([on, speed, font]) => {
  try { localStorage.setItem(SCROLL_STORAGE, JSON.stringify({ on, speed, font })) } catch { /* noop */ }
})

// Ao trocar de slide, volta o prompter para o topo e segura a rolagem por
// alguns instantes para o apresentador se situar.
watch(() => props.slideIndex, () => {
  scrollPos = 0
  holdUntil = performance.now() + START_HOLD_MS
  if (mainRef.value) mainRef.value.scrollTop = 0
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

  try {
    const saved = JSON.parse(localStorage.getItem(SCROLL_STORAGE) || 'null')
    if (saved && typeof saved.on === 'boolean') scrollOn.value = saved.on
    else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) scrollOn.value = false
    if (saved && Number.isFinite(saved.speed)) scrollSpeed.value = Math.min(3, Math.max(0.25, saved.speed))
    if (saved && Number.isFinite(saved.font)) fontScale.value = Math.min(1.8, Math.max(0.6, saved.font))
  } catch { /* noop */ }

  holdUntil = performance.now() + START_HOLD_MS
  rafId = requestAnimationFrame(scrollFrame)
})

onBeforeUnmount(() => {
  clearInterval(interval)
  cancelAnimationFrame(rafId)
})
</script>
