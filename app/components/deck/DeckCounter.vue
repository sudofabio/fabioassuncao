<template>
  <span class="count">{{ display }}</span>
</template>

<script setup>
import { SLIDE_KEY, DECK_KEY } from './context'

const props = defineProps({
  /** Valor final a ser atingido. */
  to: { type: Number, required: true },
  /** Casas decimais. */
  decimals: { type: Number, default: 0 },
  /** Prefixo (ex.: 'R$ '). */
  prefix: { type: String, default: '' },
  /** Sufixo (ex.: '%'). */
  suffix: { type: String, default: '' },
  /** Duração da contagem (ms). */
  duration: { type: Number, default: 1700 },
  /** Atraso antes de iniciar (ms). */
  delay: { type: Number, default: 0 },
  /** Dispara apenas quando o step de ordem `at` for revelado (0 = na entrada do slide). */
  at: { type: Number, default: 0 },
})

const slide = inject(SLIDE_KEY, null)
const deck = inject(DECK_KEY, null)

const current = ref(0)

function fmt(v) {
  const s = v.toLocaleString('pt-BR', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  })
  return props.prefix + s + props.suffix
}
const display = computed(() => fmt(current.value))

const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3)

let raf = null
let timer = null
function clearTimers() {
  cancelAnimationFrame(raf)
  clearTimeout(timer)
  raf = null
  timer = null
}

function animate() {
  clearTimers()
  if (deck?.reducedMotion.value || deck?.exporting.value) { current.value = props.to; return }
  current.value = 0
  const run = () => {
    const t0 = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - t0) / props.duration)
      current.value = props.to * easeOutCubic(p)
      if (p < 1) raf = requestAnimationFrame(step)
      else current.value = props.to
    }
    raf = requestAnimationFrame(step)
  }
  if (props.delay > 0) timer = setTimeout(run, props.delay)
  else run()
}

/** Gatilho: entrada do slide (at=0) ou revelação do step `at`. */
const shouldRun = computed(() => {
  if (!slide) return false
  if (props.at > 0) return slide.isStepOn(props.at)
  return slide.isActive.value
})

onMounted(() => {
  if (shouldRun.value) animate()
  watch(shouldRun, (on) => {
    if (on) animate()
    else { clearTimers(); current.value = 0 }
  })
})

onBeforeUnmount(() => clearTimers())
</script>
