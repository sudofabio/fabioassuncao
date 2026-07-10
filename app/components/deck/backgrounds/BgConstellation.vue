<template>
  <canvas ref="canvasEl" class="bge-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
// Constellation (canvas): rede de nós conectados por proximidade — o "mapa"
// da palestra como fundo. Três bandas de profundidade (nós distantes menores,
// mais fracos e mais lentos), drift orgânico em Lissajous e alguns nós de
// destaque acesos no acento, com halo via sprite pré-renderizado (nunca
// shadowBlur por frame).
import { useDeckBgCanvas, mulberry32, bgMix, bgRgba } from '~/composables/useDeckBgCanvas'

const canvasEl = ref(null)

const TAU = Math.PI * 2
const COUNT = 46
const LINK_DIST = 150

// Bandas de profundidade: [fração dos nós, raio min/max, alpha, fator de drift]
const BANDS = [
  { until: 0.45, rMin: 1.0, rMax: 1.6, alpha: 0.25, drift: 0.5 },
  { until: 0.80, rMin: 1.6, rMax: 2.4, alpha: 0.45, drift: 0.8 },
  { until: 1.00, rMin: 2.4, rMax: 3.2, alpha: 0.70, drift: 1.0 },
]

const rand = mulberry32(20260710)
const nodes = Array.from({ length: COUNT }, (_, i) => {
  const band = BANDS.find(b => i / COUNT < b.until) ?? BANDS[2]
  return {
    x0: 30 + rand() * 1220,
    y0: 30 + rand() * 660,
    r: band.rMin + rand() * (band.rMax - band.rMin),
    alpha: band.alpha,
    ax: (10 + rand() * 18) * band.drift,
    ay: (10 + rand() * 18) * band.drift,
    tx: 22 + rand() * 20,
    ty: 22 + rand() * 20,
    px: rand() * TAU,
    py: rand() * TAU,
    near: band === BANDS[2],
  }
})

// Seis nós "near" acesos no acento (alternando o segundo acento — só visível
// no 'mix'), com halo de sprite.
const nearIdx = nodes.map((n, i) => (n.near ? i : -1)).filter(i => i >= 0)
const accentNodes = new Map(nearIdx.slice(0, 6).map((idx, j) => [idx, j % 2]))

// Sprites de halo 32×32 por acento, reconstruídos na troca de tema.
let sprites = [null, null]
function buildSprites(colors) {
  sprites = [colors.accent, colors.accent2].map((color) => {
    const s = document.createElement('canvas')
    s.width = 32
    s.height = 32
    const c = s.getContext('2d')
    const g = c.createRadialGradient(16, 16, 0, 16, 16, 16)
    g.addColorStop(0, bgRgba(color, 0.85))
    g.addColorStop(0.25, bgRgba(color, 0.35))
    g.addColorStop(1, bgRgba(color, 0))
    c.fillStyle = g
    c.fillRect(0, 0, 32, 32)
    return s
  })
}

const pos = new Float64Array(COUNT * 2)

function render({ ctx, t, colors }) {
  for (let i = 0; i < COUNT; i++) {
    const n = nodes[i]
    pos[i * 2] = n.x0 + n.ax * Math.sin((t / n.tx) * TAU + n.px)
    pos[i * 2 + 1] = n.y0 + n.ay * Math.sin((t / n.ty) * TAU + n.py)
  }

  // Linhas por proximidade (~1k pares por frame — trivial).
  const lineColor = bgMix(colors.gridLine, colors.accent, 0.3)
  ctx.lineWidth = 1
  for (let i = 0; i < COUNT; i++) {
    const xi = pos[i * 2]
    const yi = pos[i * 2 + 1]
    for (let j = i + 1; j < COUNT; j++) {
      const dx = pos[j * 2] - xi
      const dy = pos[j * 2 + 1] - yi
      const d2 = dx * dx + dy * dy
      if (d2 > LINK_DIST * LINK_DIST) continue
      const d = Math.sqrt(d2)
      ctx.strokeStyle = bgRgba(lineColor, (1 - d / LINK_DIST) * 0.35)
      ctx.beginPath()
      ctx.moveTo(xi, yi)
      ctx.lineTo(pos[j * 2], pos[j * 2 + 1])
      ctx.stroke()
    }
  }

  // Nós: neutros nas bandas de fundo, acesos nos seis de destaque.
  const nodeColor = bgMix(colors.gridLine, colors.accent, 0.55)
  for (let i = 0; i < COUNT; i++) {
    const n = nodes[i]
    const x = pos[i * 2]
    const y = pos[i * 2 + 1]
    const accentVariant = accentNodes.get(i)
    if (accentVariant != null && sprites[accentVariant]) {
      ctx.drawImage(sprites[accentVariant], x - 14, y - 14, 28, 28)
      ctx.fillStyle = bgRgba(accentVariant ? colors.accent2 : colors.accent, 0.9)
    } else {
      ctx.fillStyle = bgRgba(nodeColor, n.alpha)
    }
    ctx.beginPath()
    ctx.arc(x, y, n.r, 0, TAU)
    ctx.fill()
  }
}

useDeckBgCanvas(canvasEl, { render, onColorsChanged: buildSprites })
</script>

<style scoped>
.bge-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
</style>
