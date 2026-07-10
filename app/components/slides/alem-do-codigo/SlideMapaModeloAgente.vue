<template>
  <!-- Mapa D3 — Modelo × Ferramenta × Agente × Editor · Steps: 4 (um conceito por clique) -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o mapa da IA · o vocabulário que confunde</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Modelo × Ferramenta × Editor × Agente</DeckReveal>

    <div class="cols">
      <DeckStep
        v-for="(d, i) in DEFINICOES"
        :key="d.termo"
        :at="i + 1"
        variant="dn"
        class="col deck-card"
        :class="{ agent: d.termo === 'Agente' }"
      >
        <span class="analogia">{{ d.analogia }}</span>
        <component :is="ICONS[d.icon]" :size="30" class="col-icon" />
        <b class="termo">{{ d.termo }}</b>
        <p class="desc">{{ d.descricao }}</p>
        <span class="exemplos mono">{{ d.exemplos }}</span>
      </DeckStep>
    </div>

    <DeckStep :at="4" :delay="0.4" class="foot">
      O agente é o piloto automático. <b>Mas quem define o destino é você.</b>
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { Cpu, Wrench, PanelsTopLeft, Bot } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { DEFINICOES } from '~/data/presentations/alem-do-codigo/conceitos'

const nota = NOTAS[28]
const ICONS = { Cpu, Wrench, PanelsTopLeft, Bot }
</script>

<style scoped>
.s-title { font-size: 42px; margin-top: 10px; }
.cols { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 46px; align-items: stretch; }
.col { display: flex; flex-direction: column; gap: 9px; padding: 22px 18px; }
.analogia { font-size: 13px; letter-spacing: 0.04em; color: var(--coral); font-style: italic; }
.col-icon { color: var(--cyan); margin-top: 2px; }
.termo { font-family: 'Space Grotesk', sans-serif; font-size: 23px; }
.desc { font-size: 13.5px; line-height: 1.45; color: var(--text2); flex: 1; }
.exemplos { font-size: 11.5px; color: var(--text2); opacity: 0.8; }
.col.agent { border-color: color-mix(in srgb, var(--coral) 45%, var(--border)); }
.col.agent .col-icon { color: var(--coral); }
.foot { margin-top: 40px; text-align: center; font-size: 20px; color: var(--text2); }
.foot b { color: var(--coral); }

/* Ambient: 1 elemento vivo — o ícone do agente (o piloto que age) respira. */
.deck-root.ambient-on .slide.active .col.agent .col-icon { --amb-bright: 1.5; animation: amb-glow 3.6s ease-in-out infinite; }
</style>
