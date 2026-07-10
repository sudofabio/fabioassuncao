<template>
  <!-- Slide Fundamentos concretos · Steps: 5
       ① camada volátil (logos alternando) ②③④⑤ os 4 grupos + roadmap.sh no fim
       Fallback estático: cameo-loop atrás do gate ambient; base nunca some. -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o alicerce do novo desenvolvedor</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Ferramentas mudam. Fundamentos permanecem.</DeckReveal>

    <DeckStep :at="1" class="volatil">
      <span class="vol-label mono">camada volátil</span>
      <div class="logo-cycle">
        <span
          v-for="(f, i) in LOGOS_FERRAMENTAS_PIRAMIDE"
          :key="f.nome"
          class="cycle-logo"
          :class="{ last: i === LOGOS_FERRAMENTAS_PIRAMIDE.length - 1 }"
          :style="{ animationDelay: `${(i - LOGOS_FERRAMENTAS_PIRAMIDE.length) * 1.4}s`, color: 'var(--text)' }"
        >
          <BrandLogo :src="f.logo" :alt="f.nome" />
        </span>
      </div>
      <span class="vol-note">os nomes trocam a cada ciclo</span>
    </DeckStep>

    <div class="grupos">
      <DeckStep v-for="(g, i) in GRUPOS_FUNDAMENTOS" :key="g.titulo" :at="i + 2" variant="dn" class="grupo deck-card">
        <div class="g-head">
          <component :is="ICONS[g.icon]" :size="22" class="g-icon" />
          <b class="g-titulo">{{ g.titulo }}</b>
          <span class="g-logos">
            <span v-for="l in g.logos" :key="l" class="g-logo" :style="{ color: 'var(--text2)' }"><BrandLogo :src="l" alt="" /></span>
          </span>
        </div>
        <span class="g-oque mono">{{ g.oque }}</span>
        <p class="g-porque"><span class="tag">a IA não dispensa:</span> {{ g.porqueIA }}</p>
      </DeckStep>
    </div>

    <DeckStep :at="5" :delay="0.3" class="roadmap">
      <span class="rm-logo" :style="{ color: 'var(--coral)' }"><BrandLogo :src="ROADMAP_SH.logo" alt="roadmap.sh" /></span>
      <span><b>{{ ROADMAP_SH.url }}</b>: {{ ROADMAP_SH.label }}.</span>
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { SquareTerminal, GitBranch, Globe, Container } from 'lucide-vue-next'
import BrandLogo from '~/components/slides/alem-do-codigo/BrandLogo.vue'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { LOGOS_FERRAMENTAS_PIRAMIDE } from '~/data/presentations/alem-do-codigo/ferramentas'
import { GRUPOS_FUNDAMENTOS, ROADMAP_SH } from '~/data/presentations/alem-do-codigo/fundamentos'

const nota = NOTAS[23]
const ICONS = { SquareTerminal, GitBranch, Globe, Container }
</script>

<style scoped>
.s-title { font-size: 38px; margin-top: 8px; }

/* camada volátil */
.volatil { margin-top: 26px; display: flex; align-items: center; gap: 14px; justify-content: center; }
.vol-label { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text2); }
.logo-cycle { position: relative; width: 34px; height: 34px; }
.cycle-logo { position: absolute; inset: 0; display: inline-flex; opacity: 0; }
.cycle-logo.last { opacity: 1; }
.deck-root.ambient-on .slide.active .dstep.on .cycle-logo { animation: cameo-loop 7s linear infinite; }
@keyframes cameo-loop { 0% { opacity: 0; } 3% { opacity: 1; } 17% { opacity: 1; } 20% { opacity: 0; } 100% { opacity: 0; } }
.vol-note { font-size: 13px; color: var(--text2); font-style: italic; }

/* 4 grupos */
.grupos { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
.grupo { padding: 16px 20px; display: flex; flex-direction: column; gap: 7px; }
.g-head { display: flex; align-items: center; gap: 10px; }
.g-icon { color: var(--cyan); flex-shrink: 0; }
.g-titulo { font-family: 'Space Grotesk', sans-serif; font-size: 17px; }
.g-logos { margin-left: auto; display: flex; gap: 8px; }
.g-logo { width: 18px; height: 18px; display: inline-flex; }
.g-oque { font-size: 12.5px; color: var(--text2); }
.g-porque { font-size: 13px; line-height: 1.45; color: var(--text2); }
.g-porque .tag { color: var(--coral); font-weight: 600; }

.roadmap { margin-top: 22px; display: flex; align-items: center; gap: 11px; justify-content: center; font-size: 16px; color: var(--text2); }
.rm-logo { width: 20px; height: 20px; display: inline-flex; flex-shrink: 0; }
.roadmap b { color: var(--coral); }

/* Ambient: só o topo volátil anima (a base é estável — é a mensagem). */
</style>
