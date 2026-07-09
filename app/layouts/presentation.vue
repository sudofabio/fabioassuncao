<template>
  <div class="presentation-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { DECK_THEME_STORAGE_KEY } from '~/composables/useDeckColorMode'

// Anti-flash: aplica a classe `deck-light` no <html> antes do primeiro paint
// (as rotas de apresentação são prerenderizadas com o tema dark embutido).
// Atributos do <html> ficam fora da hidratação do Vue — sem mismatch.
useHead({
  script: [
    {
      innerHTML: `try{if(localStorage.getItem('${DECK_THEME_STORAGE_KEY}')==='light')document.documentElement.classList.add('deck-light')}catch(e){}`,
      tagPosition: 'head',
    },
  ],
})
</script>

<style>
/* Layout de apresentação: sem nav global, sem overlay de ruído, palco escuro
   ocupando a viewport inteira (o deck controla o próprio scale/letterbox).
   O #070d18 é só o fallback pré-CSS — o letterbox temático vive no .viewport. */
.presentation-layout {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #070d18;
}
</style>
