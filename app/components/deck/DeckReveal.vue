<template>
  <component :is="tag" class="r" :class="variant" :style="revealStyle">
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  /** Elemento renderizado (div, h1, h2, p, span, ...). */
  tag: { type: String, default: 'div' },
  /** Atraso da animação. Número = segundos; string = valor CSS (ex.: '.4s'). */
  delay: { type: [Number, String], default: 0 },
  /** Variante de entrada: 'lf' | 'rt' | 'sc' | 'dn' (ou vazio). */
  variant: { type: String, default: '' },
})

const revealStyle = computed(() => ({
  '--d': typeof props.delay === 'number' ? `${props.delay}s` : props.delay,
}))
</script>
