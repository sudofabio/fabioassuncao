<template>
  <div ref="el" class="deck-chart" :style="{ width: `${width}px`, height: `${height}px` }" />
</template>

<script setup>
import { SLIDE_KEY, DECK_KEY } from './context'

/**
 * Wrapper ECharts com renderer SVG (obrigatório para o export PDF via snapdom)
 * e dimensões explícitas — o palco é fixo em 1280×720, então nada de resize
 * observers. A animação de entrada toca quando o slide ativa (ou quando o
 * step `at` é revelado); no export, a engine chama `finalize()` para render
 * estático determinístico.
 */
const props = defineProps({
  /** Option completa do ECharts. */
  option: { type: Object, required: true },
  /** Largura em px do palco 1280×720. */
  width: { type: Number, required: true },
  /** Altura em px do palco 1280×720. */
  height: { type: Number, required: true },
  /** Anima apenas quando o step de ordem `at` for revelado (0 = na entrada do slide). */
  at: { type: Number, default: 0 },
})

const el = ref(null)
const slide = inject(SLIDE_KEY, null)
const deck = inject(DECK_KEY, null)

let chart = null
let unregister = null

const shouldShow = computed(() => {
  if (!slide) return true
  if (props.at > 0) return slide.isStepOn(props.at)
  return slide.isActive.value
})

function apply(animate, { clear = true } = {}) {
  if (!chart) return
  if (clear) chart.clear()
  chart.setOption({ ...props.option, animation: animate })
}

/** Estado final estático para o export: sem animação + aguarda o render. */
function finalize() {
  return new Promise((resolve) => {
    if (!chart) return resolve()
    const timer = setTimeout(done, 1200)
    function done() {
      clearTimeout(timer)
      chart?.off('finished', done)
      resolve()
    }
    chart.on('finished', done)
    apply(false)
  })
}

onMounted(async () => {
  // Import dinâmico: não quebra o prerender SSR (nuxt generate).
  const [core, renderers, chartsMod, components] = await Promise.all([
    import('echarts/core'),
    import('echarts/renderers'),
    import('echarts/charts'),
    import('echarts/components'),
  ])
  core.use([
    renderers.SVGRenderer,
    chartsMod.LineChart,
    chartsMod.PieChart,
    chartsMod.BarChart,
    components.GridComponent,
    components.TooltipComponent,
    components.LegendComponent,
    components.MarkPointComponent,
    components.MarkLineComponent,
    components.GraphicComponent,
  ])

  chart = core.init(el.value, null, { renderer: 'svg', width: props.width, height: props.height })

  const still = () => deck?.reducedMotion.value || deck?.exporting.value

  if (shouldShow.value) apply(!still())

  watch(shouldShow, (on) => {
    if (on) apply(!still())
  })
  // Option mutada (ex.: séries reveladas por step): merge sem clear — apenas
  // o conteúdo novo anima; o que já estava desenhado permanece.
  watch(() => props.option, () => apply(!still(), { clear: false }), { deep: true })

  if (deck && slide) {
    unregister = deck.registerChart({ slideIndex: slide.index, finalize })
  }
})

onBeforeUnmount(() => {
  unregister?.()
  chart?.dispose()
  chart = null
})
</script>
