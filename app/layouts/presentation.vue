<template>
  <div class="presentation-layout">
    <slot />
  </div>
</template>

<style>
/* Layout de apresentação: sem nav global, sem overlay de ruído, palco escuro
   ocupando a viewport inteira (o deck controla o próprio scale/letterbox). */
.presentation-layout {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #070d18;
}
</style>
