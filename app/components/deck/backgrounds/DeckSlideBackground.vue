<template>
  <div v-if="show" class="slide-bg" aria-hidden="true" :style="layerStyle">
    <component :is="effectComp" v-if="effectComp" />
  </div>
</template>

<script setup>
import { DECK_KEY, SLIDE_KEY } from '../context'
import { DECK_BACKGROUNDS } from './registry'

const props = defineProps({
  /** Config normalizada do efeito (ver DeckBackgroundConfig no registry). */
  config: { type: Object, required: true },
})

const deck = inject(DECK_KEY)
const slide = inject(SLIDE_KEY)

// A camada só existe no client, no slide ativo, fora do export e com o toggle
// "Fundos animados" ligado. Reduced-motion/ambient NÃO desmontam: a camada
// permanece no estado base estático (é o fallback visual de graça).
const show = computed(() => deck.backgroundsOn.value && slide.isActive.value)

// Import dinâmico manual (não defineAsyncComponent): resolve só no client, na
// primeira ativação, e permite fail-safe silencioso para tipo desconhecido.
const effectComp = shallowRef(null)
let loadRequested = false
watch(show, on => {
  if (!on || loadRequested) return
  loadRequested = true
  const loader = DECK_BACKGROUNDS[props.config.type]
  if (!loader) {
    console.warn(`[deck] efeito de fundo desconhecido: "${props.config.type}"`)
    return
  }
  loader().then(comp => { effectComp.value = comp })
}, { immediate: true })

const ACCENTS = {
  cyan: ['var(--cyan)', 'var(--cyan)'],
  coral: ['var(--coral)', 'var(--coral)'],
  mix: ['var(--cyan)', 'var(--coral)'],
}

const layerStyle = computed(() => {
  const [accent, accent2] = ACCENTS[props.config.accent] ?? ACCENTS.cyan
  const style = { '--bge-accent': accent, '--bge-accent-2': accent2 }
  if (props.config.opacity != null) style['--bge-opacity'] = String(props.config.opacity)
  if (props.config.speed) style['--bge-speed'] = String(props.config.speed)
  return style
})
</script>
