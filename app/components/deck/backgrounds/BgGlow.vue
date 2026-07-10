<template>
  <canvas ref="canvasEl" class="bge-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
// Glow (canvas): campo de luz respirante ancorado no terço inferior, com dois
// lóbulos satélites fracos derivando nas laterais e uma variação sutil de
// temperatura de cor. Offscreen de baixa resolução esticado = blur gratuito.
import { useDeckBgCanvas, bgMix, bgRgba } from '~/composables/useDeckBgCanvas'

const canvasEl = ref(null)

const OW = 160
const OH = 90
const TAU = Math.PI * 2

let off = null
let octx = null

function ensureOffscreen() {
  if (octx) return
  off = document.createElement('canvas')
  off.width = OW
  off.height = OH
  octx = off.getContext('2d')
}

// Desenha um brilho elíptico (gradiente circular escalado verticalmente).
function lobe(cx, cy, rx, squash, color, alpha) {
  octx.save()
  octx.translate(cx, cy)
  octx.scale(1, squash)
  const g = octx.createRadialGradient(0, 0, 0, 0, 0, rx)
  g.addColorStop(0, bgRgba(color, alpha))
  g.addColorStop(0.45, bgRgba(color, alpha * 0.38))
  g.addColorStop(1, bgRgba(color, 0))
  octx.fillStyle = g
  octx.fillRect(-rx, -rx, rx * 2, rx * 2)
  octx.restore()
}

function render({ ctx, w, h, t, colors }) {
  ensureOffscreen()
  if (!octx) return
  octx.clearRect(0, 0, OW, OH)
  octx.globalCompositeOperation = 'lighter'

  // Temperatura: desliza até 6% em direção ao segundo acento num ciclo longo.
  const temp = 0.06 * (0.5 + 0.5 * Math.sin((t / 30) * TAU))
  const color = bgMix(colors.accent, colors.accent2, temp)

  // Halo dominante — respiração de 9s (alpha .7→1, raio ±7%).
  const breathe = 0.5 + 0.5 * Math.sin((t / 9) * TAU - Math.PI / 2)
  lobe(
    OW * 0.5,
    OH * 1.06,
    OW * 0.52 * (1 + 0.07 * breathe),
    0.55,
    color,
    0.42 * (0.7 + 0.3 * breathe),
  )

  // Satélites fracos (20% do brilho) derivando devagar nas bordas.
  lobe(
    OW * (0.10 + 0.04 * Math.sin((t / 26) * TAU + 1.2)),
    OH * (0.82 + 0.05 * Math.sin((t / 21) * TAU)),
    OW * 0.22,
    0.7,
    color,
    0.085,
  )
  lobe(
    OW * (0.90 + 0.04 * Math.sin((t / 34) * TAU + 4.0)),
    OH * (0.86 + 0.05 * Math.sin((t / 27) * TAU + 2.5)),
    OW * 0.24,
    0.7,
    color,
    0.085,
  )

  octx.globalCompositeOperation = 'source-over'
  ctx.drawImage(off, 0, 0, w, h)
}

useDeckBgCanvas(canvasEl, { render })
</script>

<style scoped>
.bge-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
</style>
