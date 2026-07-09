<template>
  <div
    ref="rootRef"
    class="deck-root"
    :class="{ 'with-presenter': presenterOn }"
    role="region"
    aria-roledescription="carousel"
    :aria-label="ariaLabel"
  >
    <div class="topbar" :class="{ hide: !chromeVisible }" :style="{ width: progressWidth }"></div>

    <div ref="viewportRef" class="viewport">
      <div ref="stageRef" class="stage" :style="stageStyle" @click="onStageClick">
        <slot />
      </div>
    </div>

    <div class="controls" :class="{ hide: !chromeVisible }">
      <template v-if="exitTo">
        <NuxtLink :to="exitTo" class="ctrl-exit" title="Sair da apresentação" aria-label="Sair da apresentação">
          <X :size="20" />
        </NuxtLink>
        <span class="ctrl-sep" aria-hidden="true"></span>
      </template>
      <button type="button" title="Anterior" aria-label="Slide anterior" @click.stop="prev">
        <ChevronLeft :size="20" />
      </button>
      <div class="dots-nav">
        <i
          v-for="i in total"
          :key="i"
          :class="{ on: i - 1 === slideIndex }"
          role="button"
          :aria-label="`Ir para o slide ${i}`"
          @click.stop="go(i - 1)"
        ></i>
      </div>
      <span class="counter">{{ counterText }}</span>
      <button type="button" title="Próximo" aria-label="Próximo slide" @click.stop="next">
        <ChevronRight :size="20" />
      </button>
      <button
        v-if="!isNarrow"
        type="button"
        :title="pinned ? 'Ocultar controles' : 'Fixar controles'"
        :aria-label="pinned ? 'Ocultar controles' : 'Fixar controles'"
        :aria-pressed="pinned"
        @click.stop="pinned = !pinned"
      >
        <PinOff v-if="pinned" :size="20" />
        <Pin v-else :size="20" />
      </button>
      <button
        v-if="!isNarrow"
        type="button"
        :title="isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'"
        :aria-label="isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'"
        :aria-pressed="isFullscreen"
        @click.stop="toggleFullscreen"
      >
        <Minimize v-if="isFullscreen" :size="20" />
        <Maximize v-else :size="20" />
      </button>
      <span class="ctrl-sep" aria-hidden="true"></span>
      <button
        type="button"
        title="Baixar apresentação em PDF"
        aria-label="Baixar apresentação em PDF"
        :disabled="exporting"
        @click.stop="onDownload"
      >
        <Download :size="20" />
      </button>
    </div>

    <div ref="helpRef" class="help" :class="{ hide: !chromeVisible }">
      <button
        type="button"
        class="help-btn"
        title="Ajuda e atalhos"
        aria-label="Ajuda e atalhos"
        :aria-expanded="helpOpen"
        @click.stop="helpOpen = !helpOpen"
      >
        <Info :size="20" />
      </button>
      <div v-if="helpOpen" class="help-panel" role="dialog" aria-label="Como navegar na apresentação">
        <p class="help-title">Como navegar</p>
        <ul>
          <li v-for="(item, i) in helpItems" :key="i">{{ item }}</li>
        </ul>
        <p v-if="helpNote" class="help-note">{{ helpNote }}</p>
      </div>
    </div>

    <DeckNotes
      v-if="presenterOn"
      :metas="registry"
      :slide-index="slideIndex"
      :step-index="stepIndex"
      :steps-count="stepsCounts[slideIndex] || 0"
      :total="total"
    />

    <div v-if="exporting" class="deck-export-overlay" role="status" aria-live="polite">
      <div class="deck-export-card">
        <div class="deck-export-spinner" aria-hidden="true"></div>
        <div class="deck-export-title">Gerando PDF…</div>
        <div class="deck-export-progress">{{ exportProgress.done }} / {{ exportProgress.total }} slides</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, ChevronLeft, ChevronRight, Pin, PinOff, Minimize, Maximize, Download, Info } from 'lucide-vue-next'
import { DECK_KEY } from './context'
import DeckNotes from './DeckNotes.vue'
import { exportDeckToPdf } from '~/composables/useDeckPdf'

const props = defineProps({
  /** Objeto de tema (DeckTheme) — define as CSS custom properties do palco. */
  theme: { type: Object, required: true },
  /** Rótulo acessível da apresentação. */
  ariaLabel: { type: String, default: 'Apresentação' },
  /** Controles fixos (sempre visíveis) por padrão; podem ser ocultados pelo usuário. */
  controlsPinned: { type: Boolean, default: true },
  /** Destino do botão de sair. Vazio = sem botão de sair. */
  exitTo: { type: String, default: '/' },
  /** Nome do arquivo PDF gerado. */
  downloadName: { type: String, default: 'apresentacao.pdf' },
  /**
   * Autoplay dos build steps (padrão): ao entrar num slide, os steps são
   * revelados sozinhos, um a um, respeitando a duração das animações.
   * `false` (ou `?manual=1` na URL) restaura o modo manual clique-a-clique.
   */
  autoplay: { type: Boolean, default: true },
  /** Pausa de leitura (ms) entre o fim da animação de um step e o próximo. */
  stepDwell: { type: Number, default: 1200 },
})

const route = useRoute()
const router = useRouter()

const rootRef = ref(null)
const viewportRef = ref(null)
const stageRef = ref(null)
const helpRef = ref(null)

// ---------- estado central: slide + step ----------
const slideIndex = ref(0)
const stepIndex = ref(0)
const navDirection = ref(1)
const total = ref(0)
const scaleVal = ref(1)
const pinned = ref(props.controlsPinned)
const uiVisible = ref(false)
const chromeVisible = computed(() => pinned.value || uiVisible.value)
const reducedMotion = ref(false)
const exporting = ref(false)

// Presenter mode via ?presenter=1 (client-only: o painel tem timer e não
// deve entrar no HTML prerenderizado — evita hydration mismatch).
const isMounted = ref(false)
const presenterOn = computed(() => isMounted.value && route.query.presenter === '1')

// Painel de ajuda adaptado ao dispositivo.
const helpOpen = ref(false)
const isTouch = ref(false)
const isFullscreen = ref(false)
const isNarrow = ref(false)
const helpItems = computed(() => {
  if (isTouch.value) {
    const items = [
      'Toque à direita da tela para avançar',
      'Toque à esquerda para voltar',
    ]
    if (!isNarrow.value) {
      items.push('Botão de tela cheia para expandir')
      items.push('Botão de fixar para ocultar ou mostrar a barra')
    }
    items.push('Botão de download para baixar em PDF')
    return items
  }
  return [
    autoplayOn.value
      ? '← → ou espaço: trocar de slide (o conteúdo aparece sozinho)'
      : '← → ou espaço: avançar etapas e slides',
    'F: entrar ou sair da tela cheia',
    'C: ocultar ou mostrar os controles',
    'Botão de download: baixar em PDF',
  ]
})
const helpNote = computed(() =>
  isNarrow.value
    ? 'Esta apresentação foi pensada para telas maiores (desktop, notebook e tablet). Em celulares ela funciona, mas a leitura e o desempenho são melhores em telas maiores.'
    : ''
)

// ---------- registro de slides, steps, timelines e gráficos ----------
// Arrays não-reativos onde possível (evitam mutação reativa durante o render).
const registry = []
function registerSlide(meta = {}) {
  const index = registry.length
  registry.push(meta)
  return index
}

// stepsCounts precisa de reatividade rasa (presenter mostra "step x/y").
const stepsCounts = reactive({})
function setStepsCount(index, count) {
  stepsCounts[index] = count
}

const timelines = []
function registerTimeline(handle) {
  timelines.push(handle)
  return () => {
    const i = timelines.indexOf(handle)
    if (i >= 0) timelines.splice(i, 1)
  }
}

const charts = []
function registerChart(handle) {
  charts.push(handle)
  return () => {
    const i = charts.indexOf(handle)
    if (i >= 0) charts.splice(i, 1)
  }
}

provide(DECK_KEY, {
  registerSlide,
  setStepsCount,
  slideIndex,
  stepIndex,
  navDirection,
  reducedMotion,
  exporting,
  registerTimeline,
  registerChart,
})

const stageStyle = computed(() => ({
  ...props.theme.vars,
  transform: `translate(-50%, -50%) scale(${scaleVal.value})`,
}))

const pad = n => String(n).padStart(2, '0')
const counterText = computed(() => `${pad(slideIndex.value + 1)} / ${pad(total.value)}`)
const progressWidth = computed(() =>
  total.value ? `${((slideIndex.value + 1) / total.value) * 100}%` : '0%'
)

// ---------- navegação ----------
// Autoplay (padrão): avançar/voltar troca de slide; os steps do slide ativo
// são revelados sozinhos pelo driver abaixo. Modo manual (`:autoplay="false"`
// ou `?manual=1`): comportamento clique-a-clique — avançar consome os steps
// antes de trocar de slide.
const autoplayOn = computed(() =>
  props.autoplay && route.query.manual !== '1' && !exporting.value
)

function stepsOf(i) { return stepsCounts[i] || 0 }

function go(n, step = 0) {
  if (!total.value) return
  const target = Math.min(Math.max(n, 0), total.value - 1)
  navDirection.value = target >= slideIndex.value ? 1 : -1
  slideIndex.value = target
  stepIndex.value = Math.min(Math.max(step, 0), stepsOf(target))
  syncSlideToUrl()
}

function next() {
  if (!autoplayOn.value && stepIndex.value < stepsOf(slideIndex.value)) {
    navDirection.value = 1
    stepIndex.value++
    syncSlideToUrl()
  } else if (slideIndex.value < total.value - 1) {
    go(slideIndex.value + 1)
  }
}

function prev() {
  if (!autoplayOn.value && stepIndex.value > 0) {
    navDirection.value = -1
    stepIndex.value--
    syncSlideToUrl()
  } else if (slideIndex.value > 0) {
    // Ao voltar de slide, entra com todos os steps revelados.
    go(slideIndex.value - 1, stepsOf(slideIndex.value - 1))
  }
}

// ---------- autoplay de steps ----------
// Ao entrar num slide, agenda a revelação sequencial dos steps: cada step
// espera a animação da fase anterior terminar (duração medida da timeline
// GSAP quando houver labels; fallback fixo p/ slides só-CSS) + pausa de
// leitura (stepDwell). Interação do usuário cancela e troca de slide.
const CSS_STEP_ANIM_MS = 700 // transições CSS ≤600ms + pequenos staggers

let autoplayTimer = null

function stopAutoplay() {
  if (autoplayTimer !== null) {
    clearTimeout(autoplayTimer)
    autoplayTimer = null
  }
}

function autoStepDelay(nextStep) {
  const meta = registry[slideIndex.value] || {}
  // Override por slide: array = delay total por step; number = dwell uniforme.
  if (Array.isArray(meta.stepDwell) && typeof meta.stepDwell[nextStep - 1] === 'number') {
    return meta.stepDwell[nextStep - 1]
  }
  const dwell = typeof meta.stepDwell === 'number' ? meta.stepDwell : props.stepDwell
  const tl = timelines.find(t => t.slideIndex === slideIndex.value)
  const animMs = tl?.stepDurationMs?.(nextStep - 1)
  return (animMs ?? CSS_STEP_ANIM_MS) + dwell
}

function scheduleNextStep() {
  stopAutoplay()
  if (!autoplayOn.value) return
  const nextStep = stepIndex.value + 1
  if (nextStep > stepsOf(slideIndex.value)) return
  autoplayTimer = setTimeout(() => {
    autoplayTimer = null
    if (!autoplayOn.value || nextStep !== stepIndex.value + 1) return
    navDirection.value = 1
    stepIndex.value = nextStep
    syncSlideToUrl()
    scheduleNextStep()
  }, autoStepDelay(nextStep))
}

function startAutoplay() {
  stopAutoplay()
  if (!autoplayOn.value) return
  if (reducedMotion.value) {
    // Sem movimento: revela tudo de imediato (timelines já saltam ao fim).
    if (stepIndex.value < stepsOf(slideIndex.value)) {
      stepIndex.value = stepsOf(slideIndex.value)
      syncSlideToUrl()
    }
    return
  }
  scheduleNextStep()
}

watch(slideIndex, () => startAutoplay())
watch(autoplayOn, on => (on ? startAutoplay() : stopAutoplay()))

// Reflete slide/step no hash (#N ou #N/S, 1-based), sem empilhar histórico.
function syncSlideToUrl() {
  if (exporting.value) return
  const hash = stepIndex.value > 0
    ? `#${slideIndex.value + 1}/${stepIndex.value}`
    : `#${slideIndex.value + 1}`
  if (route.hash === hash) return
  router.replace({ hash, query: route.query })
}

// Restaura slide/step iniciais a partir da URL (após total definido).
function restoreSlideFromUrl() {
  const parts = route.hash.slice(1).split('/')
  const rawSlide = Number(parts[0])
  if (!Number.isInteger(rawSlide) || rawSlide < 1) return
  const s = Math.min(Math.max(rawSlide - 1, 0), total.value - 1)
  const rawStep = Number(parts[1])
  const st = Number.isInteger(rawStep) && rawStep > 0 ? Math.min(rawStep, stepsOf(s)) : 0
  slideIndex.value = s
  stepIndex.value = st
  syncSlideToUrl()
}

function onStageClick(e) {
  if (exporting.value) return
  if (e.clientX < window.innerWidth * 0.32) prev()
  else next()
}

// ---------- exportação em PDF ----------
const exportProgress = ref({ done: 0, total: 0 })

async function onDownload() {
  if (exporting.value || !total.value) return

  const saved = {
    slideIndex: slideIndex.value,
    stepIndex: stepIndex.value,
    scaleVal: scaleVal.value,
    reducedMotion: reducedMotion.value,
  }

  exporting.value = true
  exportProgress.value = { done: 0, total: total.value }
  // reducedMotion=true faz contadores saltarem ao valor final;
  // scaleVal=1 garante captura nativa em 1280×720.
  reducedMotion.value = true
  scaleVal.value = 1
  await nextTick()

  try {
    await exportDeckToPdf({
      stageEl: stageRef.value,
      setActive: (i) => {
        navDirection.value = 1
        slideIndex.value = i
        stepIndex.value = stepsOf(i)
      },
      finalizeSlide: async (i) => {
        // Estado final determinístico: timelines GSAP no fim + ECharts sem animação.
        for (const t of timelines) {
          if (t.slideIndex === i) t.seekEnd()
        }
        await Promise.all(
          charts.filter(c => c.slideIndex === i).map(c => c.finalize())
        )
      },
      total: total.value,
      filename: props.downloadName,
      backgroundColor: props.theme.vars['--bg'] || '#0B1526',
      onProgress: (done, tot) => { exportProgress.value = { done, total: tot } },
    })
  } catch (err) {
    console.error('[DeckStage] Falha ao gerar PDF:', err)
  } finally {
    slideIndex.value = saved.slideIndex
    stepIndex.value = saved.stepIndex
    scaleVal.value = saved.scaleVal
    reducedMotion.value = saved.reducedMotion
    exporting.value = false
  }
}

defineExpose({ onDownload, go, next, prev })

// ---------- scale / fullscreen / eventos ----------
function applyScale() {
  const vp = viewportRef.value
  const w = vp?.clientWidth || window.innerWidth
  const h = vp?.clientHeight || window.innerHeight
  scaleVal.value = Math.min(w / 1280, h / 720)
}

function toggleFullscreen() {
  const el = rootRef.value || document.documentElement
  if (!document.fullscreenElement) el.requestFullscreen?.()
  else document.exitFullscreen?.()
}

function onFullscreenChange() { isFullscreen.value = !!document.fullscreenElement }

let narrowMq = null
function onNarrowChange(e) { isNarrow.value = e.matches }

function onKeydown(e) {
  if (e.key === 'Escape' && helpOpen.value) { e.preventDefault(); helpOpen.value = false; return }
  if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(e.key)) { e.preventDefault(); next() }
  else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev() }
  else if (e.key === 'Home') go(0)
  else if (e.key === 'End') go(total.value - 1, stepsOf(total.value - 1))
  else if (e.key.toLowerCase() === 'f') toggleFullscreen()
  else if (e.key.toLowerCase() === 'c') pinned.value = !pinned.value
}

function onDocPointerDown(e) {
  if (helpOpen.value && helpRef.value && !helpRef.value.contains(e.target)) helpOpen.value = false
}

function onMouseMove(e) { uiVisible.value = e.clientY >= window.innerHeight - 100 }
function onMouseLeave() { uiVisible.value = false }

onMounted(() => {
  isMounted.value = true
  total.value = registry.length
  restoreSlideFromUrl()
  reducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  startAutoplay()
  isTouch.value = window.matchMedia?.('(hover: none) and (pointer: coarse)').matches ?? false
  isFullscreen.value = !!document.fullscreenElement
  narrowMq = window.matchMedia?.('(max-width: 640px)') ?? null
  isNarrow.value = narrowMq?.matches ?? false
  narrowMq?.addEventListener('change', onNarrowChange)
  applyScale()
  window.addEventListener('resize', applyScale)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)
  document.addEventListener('pointerdown', onDocPointerDown)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

watch(presenterOn, () => nextTick(applyScale))

onBeforeUnmount(() => {
  stopAutoplay()
  window.removeEventListener('resize', applyScale)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
  document.removeEventListener('pointerdown', onDocPointerDown)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  narrowMq?.removeEventListener('change', onNarrowChange)
})
</script>

<style src="~/assets/css/deck.css"></style>

<style>
/* Presenter mode: o palco cede a faixa inferior ao painel de notas. */
.deck-root.with-presenter .viewport { bottom: 34vh; }
</style>
