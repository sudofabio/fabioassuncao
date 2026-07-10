<template>
  <!--
    Logos de marca adaptáveis ao tema. SVGs monocromáticos (currentColor /
    fill único escuro) ficam ilegíveis quando servidos via <img> — currentColor
    resolve para preto dentro do documento isolado do <img>. Para esses,
    renderizamos a forma via CSS mask com background-color: currentColor, de
    modo que herdem a cor do tema. Logos coloridos seguem como <img>.
    Ocupa 100% do container — dimensione no elemento pai.
  -->
  <span
    v-if="isMono"
    class="brand-logo mono"
    role="img"
    :aria-label="alt"
    :style="{ '--brand-src': `url('${src}')` }"
  ></span>
  <img v-else :src="src" :alt="alt" class="brand-logo" />
</template>

<script setup>
const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
})

// Marcas monocromáticas cadastradas em public/.../logos/ que precisam do mask.
const MONO = ['openai', 'anthropic', 'aws', 'roadmap-sh', 'cursor', 'v0', 'antigravity', 'github-copilot']

const isMono = computed(() => {
  const base = props.src.split('/').pop()?.replace('.svg', '') ?? ''
  return MONO.includes(base)
})
</script>

<style scoped>
.brand-logo { display: inline-block; width: 100%; height: 100%; object-fit: contain; }
.brand-logo.mono {
  background-color: currentColor;
  -webkit-mask: var(--brand-src) center / contain no-repeat;
  mask: var(--brand-src) center / contain no-repeat;
}
</style>
