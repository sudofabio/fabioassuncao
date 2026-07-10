<template>
  <canvas ref="canvasEl" class="bge-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
// Embers (canvas): motes luminosos subindo muito devagar com balanço senoidal
// e pulso de brilho — faíscas de provocação. Desenhados de sprites radiais
// pré-renderizados (núcleo denso + halo), nunca shadowBlur por frame. A
// posição é função pura de (seed, t): em t=0 os motes já cobrem a tela toda e
// o wrap no topo é determinístico (o x de retorno deriva do ciclo).
import { useDeckBgCanvas, mulberry32, bgRgba } from '~/composables/useDeckBgCanvas'

const canvasEl = ref(null)

const TAU = Math.PI * 2
const COUNT = 32
const WRAP = 800 // altura do ciclo vertical (720 + folga para nascer/morrer fora)

const rand = mulberry32(20260710)
const motes = Array.from({ length: COUNT }, (_, i) => ({
  x0: rand() * 1280,
  y0: rand() * WRAP,
  size: 8 + rand() * 18,
  rise: 4 + rand() * 6,
  swayAmp: 8 + rand() * 12,
  swayT: 6 + rand() * 6,
  swayP: rand() * TAU,
  aBase: 0.6 + (rand() - 0.5) * 0.2,
  aAmp: 0.25,
  pulseT: 5 + rand() * 7,
  pulseP: rand() * TAU,
  variant: i % 5 < 2 ? 1 : 0, // ~40% no segundo acento (visível só no 'mix')
}))

// Sprites 64×64 por acento: núcleo denso até 20% do raio, halo até a borda.
let sprites = [null, null]
function buildSprites(colors) {
  sprites = [colors.accent, colors.accent2].map((color) => {
    const s = document.createElement('canvas')
    s.width = 64
    s.height = 64
    const c = s.getContext('2d')
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, bgRgba(color, 0.9))
    g.addColorStop(0.2, bgRgba(color, 0.5))
    g.addColorStop(0.6, bgRgba(color, 0.12))
    g.addColorStop(1, bgRgba(color, 0))
    c.fillStyle = g
    c.fillRect(0, 0, 64, 64)
    return s
  })
}

function render({ ctx, t }) {
  for (const m of motes) {
    const travel = m.y0 - m.rise * t
    const cycle = Math.floor(travel / WRAP)
    const y = ((travel % WRAP) + WRAP) % WRAP - 40
    // A cada volta o mote retorna noutro x — deslocamento determinístico.
    const x = (((m.x0 + cycle * 173) % 1280) + 1280) % 1280
      + m.swayAmp * Math.sin((t / m.swayT) * TAU + m.swayP)
    const alpha = m.aBase + m.aAmp * Math.sin((t / m.pulseT) * TAU + m.pulseP)
    const sprite = sprites[m.variant]
    if (!sprite) continue
    ctx.globalAlpha = Math.min(Math.max(alpha, 0.35), 0.85)
    ctx.drawImage(sprite, x - m.size / 2, y - m.size / 2, m.size, m.size)
  }
  ctx.globalAlpha = 1
}

useDeckBgCanvas(canvasEl, { render, onColorsChanged: buildSprites })
</script>

<style scoped>
.bge-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
</style>
