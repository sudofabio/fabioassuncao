<template>
  <canvas ref="canvasEl" class="bge-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
// Ribbon (canvas): campo de energia do clímax — fitas largas atravessando a
// tela em diagonal suave, puxadas de leve para o centro (onde o morph
// tipográfico acende). O gradiente ao longo da fita nasce no primeiro acento
// (ciano/máquina) e termina no segundo (coral/humano): a transformação da
// palestra desenhada no fundo. Fitas em camadas de stroke com composição
// aditiva = bordas macias sem blur; pulso global sutil ecoa o "acender".
import { useDeckBgCanvas, mulberry32, bgRgba } from '~/composables/useDeckBgCanvas'

const canvasEl = ref(null)

const TAU = Math.PI * 2
const STEP = 24
const X0 = -40
const SAMPLES = Math.ceil((1360 - X0) / STEP) + 1
const PULL = 0.25 // convergência para o centro vertical

const rand = mulberry32(20260710)
const ribbons = Array.from({ length: 5 }, (_, i) => ({
  // Diagonais suaves: entra numa altura e sai noutra.
  yl: (0.12 + (i / 4) * 0.72 + (rand() - 0.5) * 0.08) * 720,
  yr: (0.12 + (i / 4) * 0.72 + (rand() - 0.5) * 0.5) * 720,
  a1: 22 + rand() * 26,
  l1: 520 + rand() * 320,
  t1: 18 + rand() * 12,
  p1: rand() * TAU,
  a2: 8 + rand() * 10,
  l2: 220 + rand() * 160,
  t2: 18 + rand() * 12,
  p2: rand() * TAU,
  halfW: 20 + rand() * 25, // meia-espessura: fitas de 40–90px
  alpha: 0.10 + rand() * 0.05,
}))

let gradient = null
let gradientKey = ''

function ribbonY(r, x, t) {
  const f = (x + 40) / 1360
  const edge = r.yl + (r.yr - r.yl) * f
  const wave = r.a1 * Math.sin(x / r.l1 + (t / r.t1) * TAU + r.p1)
    + r.a2 * Math.sin(x / r.l2 - (t / r.t2) * TAU + r.p2)
  // Puxa o miolo da fita em direção ao centro (bell em seno).
  const bell = Math.sin(Math.PI * Math.min(Math.max(f, 0), 1))
  return (edge + wave) * (1 - PULL * bell) + 360 * PULL * bell
}

function render({ ctx, t, colors }) {
  const key = `${colors.accent.r},${colors.accent.g},${colors.accent.b}|${colors.accent2.r},${colors.accent2.g},${colors.accent2.b}`
  if (key !== gradientKey) {
    gradient = ctx.createLinearGradient(0, 0, 1280, 0)
    gradient.addColorStop(0, bgRgba(colors.accent, 1))
    gradient.addColorStop(1, bgRgba(colors.accent2, 1))
    gradientKey = key
  }

  // Pulso de brilho global muito sutil (~12s), ecoando o acender do SDD.
  const pulse = 0.85 + 0.15 * Math.sin((t / 12) * TAU)

  ctx.globalCompositeOperation = 'lighter'
  ctx.strokeStyle = gradient
  ctx.lineCap = 'round'

  for (const r of ribbons) {
    ctx.beginPath()
    for (let s = 0; s < SAMPLES; s++) {
      const x = X0 + s * STEP
      const y = ribbonY(r, x, t)
      if (s === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    // Três camadas sobre o mesmo path: larga/fraca → estreita/densa.
    ctx.globalAlpha = r.alpha * 0.55 * pulse
    ctx.lineWidth = r.halfW * 2
    ctx.stroke()
    ctx.globalAlpha = r.alpha * 0.9 * pulse
    ctx.lineWidth = r.halfW * 1.1
    ctx.stroke()
    ctx.globalAlpha = r.alpha * 1.3 * pulse
    ctx.lineWidth = r.halfW * 0.4
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
}

useDeckBgCanvas(canvasEl, { render })
</script>

<style scoped>
.bge-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
</style>
