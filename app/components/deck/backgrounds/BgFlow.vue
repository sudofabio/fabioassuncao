<template>
  <canvas ref="canvasEl" class="bge-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
// Flow (canvas): linhas fluidas horizontais com gradiente entre os acentos e
// profundidade (linhas "fundas" mais largas e fracas). No 'mix', o gradiente
// nasce ciano à esquerda e termina coral à direita — a direção da
// transformação do slide. Glow barato: segunda passada mais larga por baixo.
import { useDeckBgCanvas, mulberry32, bgRgba } from '~/composables/useDeckBgCanvas'

const canvasEl = ref(null)

const TAU = Math.PI * 2
const RIBBONS = 7
const STEP = 24
const X0 = -20
const SAMPLES = Math.ceil((1320 - X0) / STEP) + 1

const rand = mulberry32(20260710)
const ribbons = Array.from({ length: RIBBONS }, (_, i) => ({
  baseY: (0.2 + (i / (RIBBONS - 1)) * 0.65 + (rand() - 0.5) * 0.06) * 720,
  a1: 14 + rand() * 20,
  l1: 420 + rand() * 360,
  v1: 0.15 + rand() * 0.2,
  p1: rand() * TAU,
  a2: 6 + rand() * 8,
  l2: 160 + rand() * 140,
  v2: 0.15 + rand() * 0.2,
  p2: rand() * TAU,
  driftT: 30 + rand() * 20,
  driftP: rand() * TAU,
  // Profundidade: intercala fundo/frente para as vizinhas não se parecerem.
  depth: (i % 3) / 2,
}))

// Gradiente horizontal accent→accent2, cacheado por paleta.
let gradient = null
function buildGradient(ctx, colors) {
  gradient = ctx.createLinearGradient(0, 0, 1280, 0)
  gradient.addColorStop(0, bgRgba(colors.accent, 1))
  gradient.addColorStop(1, bgRgba(colors.accent2, 1))
}
let gradientKey = ''

function ribbonY(r, x, t) {
  return (
    r.baseY
    + 10 * Math.sin((t / r.driftT) * TAU + r.driftP)
    + r.a1 * Math.sin(x / r.l1 + t * r.v1 + r.p1)
    + r.a2 * Math.sin(x / r.l2 - t * r.v2 + r.p2)
  )
}

function render({ ctx, t, colors }) {
  const key = `${colors.accent.r},${colors.accent.g},${colors.accent.b}|${colors.accent2.r},${colors.accent2.g},${colors.accent2.b}`
  if (key !== gradientKey) {
    buildGradient(ctx, colors)
    gradientKey = key
  }
  ctx.lineCap = 'round'
  ctx.strokeStyle = gradient

  for (const r of ribbons) {
    const width = 1.2 + r.depth * 1.4
    const alpha = 0.5 - r.depth * 0.32
    ctx.beginPath()
    for (let s = 0; s < SAMPLES; s++) {
      const x = X0 + s * STEP
      const y = ribbonY(r, x, t)
      if (s === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    // Passada de glow (larga e fraca) e passada principal sobre o mesmo path.
    ctx.globalAlpha = alpha * 0.25
    ctx.lineWidth = width * 3
    ctx.stroke()
    ctx.globalAlpha = alpha
    ctx.lineWidth = width
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

useDeckBgCanvas(canvasEl, { render })
</script>

<style scoped>
.bge-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
</style>
