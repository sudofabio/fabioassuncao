<template>
  <div
    ref="rootRef"
    class="deck-root"
    :class="{ 'with-presenter': presenterOn, 'ambient-on': ambientOn }"
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
      <button type="button" title="Anterior" aria-label="Slide anterior" @click.stop="prev">
        <ChevronLeft :size="20" />
      </button>
      <DeckSlideNav
        v-model:open="slideNavOpen"
        :metas="registry"
        :total="total"
        :current="slideIndex"
        @select="onSlideNavSelect"
      />
      <button type="button" title="Próximo" aria-label="Próximo slide" @click.stop="next">
        <ChevronRight :size="20" />
      </button>
      <span class="ctrl-sep" aria-hidden="true"></span>
      <button
        type="button"
        :title="isLight ? 'Tema escuro' : 'Tema claro'"
        :aria-label="isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'"
        :aria-pressed="isLight"
        @click.stop="toggleColorMode"
      >
        <Moon v-if="isLight" :size="20" />
        <Sun v-else :size="20" />
      </button>
      <DeckMenu v-model:open="menuOpen" :items="menuItems" @select="onMenuSelect" />
    </div>

    <div v-if="helpOpen" ref="helpRef" class="help-panel" role="dialog" aria-label="Como navegar na apresentação">
      <p class="help-title">Como navegar</p>
      <ul>
        <li v-for="(item, i) in helpItems" :key="i">{{ item }}</li>
      </ul>
      <p v-if="helpNote" class="help-note">{{ helpNote }}</p>
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
import { X, ChevronLeft, ChevronRight, Pin, Minimize, Maximize, Download, Info, Sun, Moon, Sparkles } from 'lucide-vue-next'
import { DECK_KEY } from './context'
import DeckNotes from './DeckNotes.vue'
import DeckMenu from './DeckMenu.vue'
import DeckSlideNav from './DeckSlideNav.vue'
import { exportDeckToPdf } from '~/composables/useDeckPdf'

const props = defineProps({
  /** Objeto de tema (DeckTheme) — define as CSS custom properties do deck. */
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

// ---------- tema (CSS custom properties + modo claro/escuro) ----------
// As vars vão numa <style> renderizada no SSR (não inline no .stage): style
// inline venceria a classe `html.deck-light`, e o chrome (.controls, .help-*,
// .presenter) vive fora do .stage — por isso o alvo é o .deck-root.
const { isLight, mode: colorMode, toggle: toggleColorMode } = useDeckColorMode()

const cssVars = vars => Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')
useHead({
  style: [
    {
      innerHTML:
        `.deck-root{${cssVars(props.theme.vars)}}` +
        (props.theme.lightVars ? `html.deck-light .deck-root{${cssVars(props.theme.lightVars)}}` : ''),
    },
  ],
})

/** Vars efetivas do modo ativo (export PDF usa o --bg correto). */
const activeVars = computed(() =>
  colorMode.value === 'light' && props.theme.lightVars
    ? { ...props.theme.vars, ...props.theme.lightVars }
    : props.theme.vars
)

// ---------- estado central: slide + step ----------
const slideIndex = ref(0)
const stepIndex = ref(0)
const navDirection = ref(1)
const total = ref(0)
const scaleVal = ref(1)
const pinned = ref(props.controlsPinned)
const uiVisible = ref(false)
const menuOpen = ref(false)
const helpOpen = ref(false)
const slideNavOpen = ref(false)
const chromeVisible = computed(() =>
  pinned.value || uiVisible.value || menuOpen.value || helpOpen.value || slideNavOpen.value
)

// Popovers mutuamente exclusivos.
watch(menuOpen, v => { if (v) { slideNavOpen.value = false; helpOpen.value = false } })
watch(slideNavOpen, v => { if (v) { menuOpen.value = false; helpOpen.value = false } })
const reducedMotion = ref(false)
const exporting = ref(false)
// Sinaliza "completar o slide atual agora": revela todos os steps ao estado
// final. Só o GSAP o honra (salta a sequência longa em vez de tweenar); CSS,
// contadores e gráficos reagem ao stepIndex com sua entrada rápida normal.
const snapSteps = ref(false)

// Presenter mode via ?presenter=1 (client-only: o painel tem timer e não
// deve entrar no HTML prerenderizado — evita hydration mismatch).
const isMounted = ref(false)
const presenterOn = computed(() => isMounted.value && route.query.presenter === '1')

// ---------- animações ambient (loops contínuos dos slides) ----------
// A classe `.ambient-on` no .deck-root é o gate CSS de todo loop infinito dos
// slides (convenção em deck.css). Aditiva e só pós-mount: o HTML prerenderizado
// nunca a tem (sem mismatch/flash) e removê-la devolve os elementos ao estado
// base determinístico — exatamente o que o export PDF precisa capturar.
const { enabled: ambientEnabled, toggle: toggleAmbient } = useDeckAmbient()
const ambientOn = computed(() =>
  isMounted.value && ambientEnabled.value && !exporting.value && !reducedMotion.value
)

// Painel de ajuda adaptado ao dispositivo.
const isTouch = ref(false)
const isFullscreen = ref(false)
const isNarrow = ref(false)
const helpItems = computed(() => {
  if (isTouch.value) {
    return [
      'Deslize para o lado para trocar de slide',
      'Toque à direita da tela para avançar, à esquerda para voltar',
      'Toque no contador (ex.: 07 / 26) para ir a um slide específico',
      'Menu ⋮: tela cheia, PDF, controles e sair',
      'Botão de sol/lua: alternar tema claro ou escuro',
    ]
  }
  return [
    autoplayOn.value
      ? '← → ou espaço: trocar de slide (o conteúdo aparece sozinho)'
      : '← → ou espaço: avançar etapas e slides',
    'G ou clique no contador: ir para um slide específico',
    'F: entrar ou sair da tela cheia',
    'C: ocultar ou mostrar os controles',
    'M: abrir o menu de opções (tela cheia, PDF, sair)',
    'Botão de sol/lua: alternar tema claro ou escuro',
  ]
})
const helpNote = computed(() =>
  isNarrow.value
    ? 'Esta apresentação foi pensada para telas maiores (desktop, notebook e tablet). Em celulares ela funciona, mas a leitura e o desempenho são melhores em telas maiores.'
    : ''
)

// ---------- menu overflow (⋮) ----------
const menuItems = computed(() => {
  const items = [
    {
      id: 'fullscreen',
      label: isFullscreen.value ? 'Sair da tela cheia' : 'Tela cheia',
      icon: isFullscreen.value ? Minimize : Maximize,
    },
    {
      id: 'pdf',
      label: exporting.value ? 'Gerando PDF…' : 'Baixar PDF',
      icon: Download,
      disabled: exporting.value,
    },
    { id: 'ambient', label: 'Animações contínuas', icon: Sparkles, checked: ambientEnabled.value },
    { id: 'pin', label: 'Controles sempre visíveis', icon: Pin, checked: pinned.value },
    { id: 'help', label: 'Atalhos e ajuda', icon: Info },
  ]
  if (props.exitTo) items.push({ id: 'exit', label: 'Sair da apresentação', icon: X })
  return items
})

function onMenuSelect(id) {
  if (id === 'fullscreen') toggleFullscreen()
  else if (id === 'pdf') onDownload()
  else if (id === 'ambient') toggleAmbient()
  else if (id === 'pin') pinned.value = !pinned.value
  else if (id === 'help') helpOpen.value = true
  else if (id === 'exit') router.push(props.exitTo)
}

// Export em andamento: popovers fechados (o overlay cobre tudo).
watch(exporting, v => {
  if (v) {
    menuOpen.value = false
    helpOpen.value = false
    slideNavOpen.value = false
  }
})

function onSlideNavSelect(i) {
  go(i)
}

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
  ambientOn,
  snapSteps,
  registerTimeline,
  registerChart,
})

const stageStyle = computed(() => ({
  transform: `translate(-50%, -50%) scale(${scaleVal.value})`,
}))

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

// Autoplay: se o slide ainda não revelou todos os steps, o 1º avanço completa
// o slide (revela tudo agora, cancelando a espera dos timers) em vez de pular;
// só um novo avanço, com o slide já cheio, troca de slide. Evita pular
// conteúdo por acidente. GSAP longo salta ao fim; CSS/contadores/gráficos
// fazem sua entrada rápida.
function completeCurrentSlide() {
  stopAutoplay()
  navDirection.value = 1
  snapSteps.value = true
  stepIndex.value = stepsOf(slideIndex.value)
  syncSlideToUrl()
  nextTick(() => { snapSteps.value = false })
}

function next() {
  const pending = stepIndex.value < stepsOf(slideIndex.value)
  // Modo manual (?manual=1 / :autoplay="false"): um step por avanço (inalterado).
  if (!autoplayOn.value) {
    if (pending) {
      navDirection.value = 1
      stepIndex.value++
      syncSlideToUrl()
    } else if (slideIndex.value < total.value - 1) {
      go(slideIndex.value + 1)
    }
    return
  }
  // Modo autoplay (padrão): 1º avanço completa o slide; 2º troca de slide.
  if (pending) { completeCurrentSlide(); return }
  if (slideIndex.value < total.value - 1) go(slideIndex.value + 1)
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

// ---------- interação com o palco: tap zones + swipe ----------
const { swipedRecently } = useDeckSwipe(viewportRef, {
  onNext: () => { next(); revealChromeTemporarily() },
  onPrev: () => { prev(); revealChromeTemporarily() },
  enabled: () => !exporting.value && !menuOpen.value && !helpOpen.value && !slideNavOpen.value,
})

function onStageClick(e) {
  if (exporting.value || swipedRecently()) return
  if (isTouch.value) revealChromeTemporarily()
  if (e.clientX < window.innerWidth * 0.32) prev()
  else next()
}

// Em touch não há mousemove: após tap/swipe a chrome aparece por alguns
// segundos (se despinada), senão a barra ficaria inacessível.
let chromeTimer = null
function revealChromeTemporarily(ms = 3000) {
  if (pinned.value) return
  uiVisible.value = true
  clearTimeout(chromeTimer)
  chromeTimer = setTimeout(() => { uiVisible.value = false }, ms)
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
      backgroundColor: activeVars.value['--bg'] || '#0B1526',
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

let motionMq = null
// Não sobrescrever durante o export (ele força reducedMotion=true e restaura depois).
function onMotionChange(e) { if (!exporting.value) reducedMotion.value = e.matches }

function onKeydown(e) {
  if (e.key.toLowerCase() === 'm' && !exporting.value) { e.preventDefault(); menuOpen.value = !menuOpen.value; return }
  if (e.key.toLowerCase() === 'g' && !exporting.value) { e.preventDefault(); slideNavOpen.value = !slideNavOpen.value; return }
  if (menuOpen.value || slideNavOpen.value) {
    // Os painéis tratam as próprias teclas (com stopPropagation); aqui só
    // garantimos que navegação/atalhos não disparem com um popover aberto.
    if (e.key === 'Escape') { menuOpen.value = false; slideNavOpen.value = false }
    return
  }
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
  motionMq = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null
  reducedMotion.value = motionMq?.matches ?? false
  motionMq?.addEventListener('change', onMotionChange)
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
  clearTimeout(chromeTimer)
  // Não vazar o tema do deck para o resto do site.
  document.documentElement.classList.remove('deck-light')
  window.removeEventListener('resize', applyScale)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
  document.removeEventListener('pointerdown', onDocPointerDown)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  narrowMq?.removeEventListener('change', onNarrowChange)
  motionMq?.removeEventListener('change', onMotionChange)
})
</script>

<style src="~/assets/css/deck.css"></style>

<style>
/* Presenter mode: o palco cede a faixa inferior ao painel de notas. */
.deck-root.with-presenter .viewport { bottom: 34vh; }
</style>
