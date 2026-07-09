<template>
  <!-- Slide 1 — Capa · ⭐⭐⭐ · Steps: 0 -->
  <DeckSlide :title="nota.title" :notes="nota.notes" background="deep" flush>
    <!-- Malha de circuito sutil (estática — sem loop; req. 9) -->
    <svg class="mesh" viewBox="0 0 1280 720" aria-hidden="true">
      <g class="mesh-lines" stroke-width="1" fill="none">
        <path d="M80 640 h180 v-120 h220 v-80 h160" />
        <path d="M1200 90 h-160 v100 h-200 v90 h-140" />
        <path d="M120 120 h140 v90 h180" />
        <path d="M1160 620 h-220 v-100 h-160" />
      </g>
      <g class="mesh-dots">
        <circle cx="260" cy="640" r="4" /><circle cx="480" cy="520" r="4" />
        <circle cx="640" cy="440" r="4" /><circle cx="1040" cy="90" r="4" />
        <circle cx="840" cy="190" r="4" /><circle cx="700" cy="280" r="4" />
        <circle cx="260" cy="120" r="4" /><circle cx="440" cy="210" r="4" />
        <circle cx="940" cy="620" r="4" /><circle cx="780" cy="520" r="4" />
      </g>
    </svg>

    <div class="wrap">
      <DeckReveal :delay="0.1" class="lockup">
        <img :src="LOGO_IFMA" alt="IFMA" class="ifma" />
        <span class="mono lockup-text">{{ EVENTO.lockup }}</span>
      </DeckReveal>

      <DeckReveal tag="h1" :delay="0.35" class="title main-title">
        Além do <span class="kw kw-cyan" style="--kd: 1.1s">código</span>
      </DeckReveal>
      <DeckReveal tag="h2" :delay="0.55" class="title sub-title">
        Inteligência artificial e o novo desenvolvedor
      </DeckReveal>
      <DeckReveal tag="p" :delay="0.75" class="lead thesis">
        A evolução do mercado, a comoditização do código e o novo papel do desenvolvedor
      </DeckReveal>

      <DeckReveal :delay="0.95" class="speaker">
        <span class="speaker-name">Fábio Assunção</span>
        <span class="speaker-sep"></span>
        <span class="speaker-role">15+ anos em desenvolvimento de software</span>
      </DeckReveal>
    </div>

    <DeckReveal :delay="1.3" class="mono terminal-egg">&gt; ./talk --local="IFMA Santa Inês" --run<span class="cursor">▌</span></DeckReveal>
  </DeckSlide>
</template>

<script setup>
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { EVENTO } from '~/data/presentations/alem-do-codigo/contatos'
import { LOGO_IFMA } from '~/data/presentations/alem-do-codigo/ferramentas'

const nota = NOTAS[0]
</script>

<style scoped>
.mesh { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.08; }
.mesh-lines { stroke: var(--cyan); }
.mesh-dots { fill: var(--cyan); }
.wrap { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 0 120px; }
.lockup { display: flex; align-items: center; gap: 16px; margin-bottom: 40px; }
.ifma { height: 44px; width: auto; filter: brightness(0) invert(0.95); }
html.deck-light .ifma { filter: brightness(0) opacity(0.8); }
.lockup-text { font-size: 14px; letter-spacing: 0.22em; color: var(--text2); }
.main-title { font-size: 92px; line-height: 1.02; }
.sub-title { font-size: 40px; color: var(--text2); font-weight: 500; margin-top: 10px; }
.thesis { font-size: 19px; margin-top: 26px; max-width: 640px; }
.speaker { display: flex; align-items: center; gap: 14px; margin-top: 44px; }
.speaker-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; }
.speaker-sep { width: 1.5px; height: 18px; background: var(--border); }
.speaker-role { font-size: 15px; color: var(--text2); }
.terminal-egg { position: absolute; right: 56px; bottom: 104px; font-size: 14px; color: var(--text2); opacity: 0.8; }
.cursor { color: var(--cyan); animation: none; margin-left: 2px; }
</style>
