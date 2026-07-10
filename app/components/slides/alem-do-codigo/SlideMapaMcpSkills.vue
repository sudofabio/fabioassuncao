<template>
  <!-- Mapa D5 — MCP, Skills e agentes · Steps: 3 (um conceito por clique) -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o mapa da IA · o vocabulário novo</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">MCP, Skills e agentes</DeckReveal>

    <div class="cards">
      <DeckStep
        v-for="(c, i) in VOCABULARIO"
        :key="c.termo"
        :at="i + 1"
        variant="rt"
        class="card deck-card"
      >
        <component :is="ICONS[c.icon]" :size="28" class="card-icon" />
        <div class="card-head">
          <b class="termo">{{ c.termo }}</b>
          <span class="resumo">{{ c.resumo }}</span>
        </div>
        <p class="detalhe">{{ c.detalhe }}</p>
      </DeckStep>
    </div>

    <DeckStep :at="3" :delay="0.4" class="foot">
      <span>E o meu <b class="hl">Issue Flow</b> é exatamente isso: skills + agente + automação.</span>
      <span class="gancho"><ArrowRight :size="16" /> daqui a pouco, rodando</span>
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { Cable, Package, Workflow, ArrowRight } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { VOCABULARIO } from '~/data/presentations/alem-do-codigo/conceitos'

const nota = NOTAS[30]
const ICONS = { Cable, Package, Workflow }
</script>

<style scoped>
.s-title { font-size: 46px; margin-top: 10px; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 46px; }
.card { display: flex; flex-direction: column; gap: 12px; padding: 24px 22px; }
.card-icon { color: var(--cyan); }
.card-head { display: flex; flex-direction: column; gap: 3px; }
.termo { font-family: 'Space Grotesk', sans-serif; font-size: 22px; }
.resumo { font-size: 13px; color: var(--coral); }
.detalhe { font-size: 14.5px; line-height: 1.5; color: var(--text2); }
.foot { margin-top: 44px; text-align: center; font-size: 21px; color: var(--text2); display: flex; flex-direction: column; align-items: center; gap: 10px; }
.foot b.hl { color: var(--cyan); }
.gancho { display: inline-flex; align-items: center; gap: 7px; font-size: 15px; color: var(--coral); }

/* Ambient: 1 elemento vivo — o gancho para o Issue Flow desliza suave. */
.deck-root.ambient-on .slide.active .gancho { --amb-y: -3px; animation: amb-float 3s ease-in-out infinite; }
</style>
