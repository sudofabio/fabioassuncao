<template>
  <component :is="tag" class="dstep" :class="[variant, { on }]" :style="stepStyle">
    <slot :on="on" :order="order" />
  </component>
</template>

<script setup>
import { SLIDE_KEY } from './context'

/**
 * Build step: conteúdo revelado por clique (equivalente ao v-click do Slidev).
 * Registra-se no slide pai na ordem de renderização; "avançar" no deck consome
 * os steps do slide antes de trocar de slide. Vários elementos podem dividir a
 * mesma ordem via `at` (revelam juntos); `delay` permite stagger dentro do step.
 */
const props = defineProps({
  /** Elemento renderizado. */
  tag: { type: String, default: 'div' },
  /** Ordem explícita do step (1-based). Omitido = ordem de renderização. */
  at: { type: Number, default: undefined },
  /** Variante de entrada: 'lf' | 'rt' | 'sc' | 'dn' (ou vazio). */
  variant: { type: String, default: '' },
  /** Atraso da transição (stagger dentro do step). Número = segundos. */
  delay: { type: [Number, String], default: 0 },
})

const slide = inject(SLIDE_KEY)
const order = slide.registerStep(props.at)
const on = computed(() => slide.isStepOn(order))

const stepStyle = computed(() => ({
  '--d': typeof props.delay === 'number' ? `${props.delay}s` : props.delay,
}))
</script>
