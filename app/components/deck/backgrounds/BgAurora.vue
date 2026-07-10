<template>
  <canvas ref="canvasEl" class="bge-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
// Aurora (canvas): véu luminoso de 4 blobs radiais com mistura aditiva,
// derivando em curvas de Lissajous muito lentas. Desenhado num offscreen de
// baixa resolução e esticado para o palco — o upscale com smoothing faz o
// papel do blur sem custo por frame.
import { useDeckBgCanvas, bgMix, bgRgba } from '~/composables/useDeckBgCanvas'

const canvasEl = ref(null)

const OW = 160
const OH = 90

// Geometria autoral (determinística): posições/raios em frações do palco,
// drifts com períodos longos e delays de fase para o loop nascer no meio.
// mix: 0 = accent, 1 = accent2, 'wander' interpola ao longo do tempo.
const BLOBS = [
  { x: 0.16, y: 0.14, r: 0.55, ax: 0.10, ay: 0.07, tx: 32, ty: 26, px: 0.8, py: 2.1, br: 24, a: 0.50, mix: 0 },
  { x: 0.86, y: 0.22, r: 0.62, ax: 0.08, ay: 0.09, tx: 38, ty: 30, px: 3.6, py: 0.4, br: 28, a: 0.42, mix: 1 },
  { x: 0.44, y: 0.98, r: 0.68, ax: 0.12, ay: 0.06, tx: 40, ty: 34, px: 5.1, py: 1.3, br: 26, a: 0.38, mix: 0 },
  { x: 0.68, y: 0.58, r: 0.42, ax: 0.09, ay: 0.10, tx: 24, ty: 36, px: 1.9, py: 4.2, br: 20, a: 0.30, mix: 'wander' },
]

let off = null
let octx = null

function ensureOffscreen() {
  if (octx) return
  off = document.createElement('canvas')
  off.width = OW
  off.height = OH
  octx = off.getContext('2d')
}

function render({ ctx, w, h, t, colors }) {
  ensureOffscreen()
  if (!octx) return
  octx.clearRect(0, 0, OW, OH)
  octx.globalCompositeOperation = 'lighter'
  const TAU = Math.PI * 2
  for (const b of BLOBS) {
    const mix = b.mix === 'wander' ? 0.5 + 0.5 * Math.sin((t / 45) * TAU) : b.mix
    const color = bgMix(colors.accent, colors.accent2, mix)
    const cx = (b.x + b.ax * Math.sin((t / b.tx) * TAU + b.px)) * OW
    const cy = (b.y + b.ay * Math.sin((t / b.ty) * TAU + b.py)) * OH
    const r = b.r * (1 + 0.12 * Math.sin((t / b.br) * TAU + b.px)) * OW
    const g = octx.createRadialGradient(cx, cy, 0, cx, cy, r)
    g.addColorStop(0, bgRgba(color, b.a))
    g.addColorStop(1, bgRgba(color, 0))
    octx.fillStyle = g
    octx.fillRect(0, 0, OW, OH)
  }
  octx.globalCompositeOperation = 'source-over'
  ctx.drawImage(off, 0, 0, w, h)
}

useDeckBgCanvas(canvasEl, { render })
</script>

<style scoped>
.bge-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
</style>
