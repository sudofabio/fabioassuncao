<template>
  <!-- Slide 16 — 2020–2022: quando o mercado ferveu · ⭐⭐ · Steps: 3 -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">a pandemia: o ponto fora da curva</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">2020–2022: quando o mercado ferveu</DeckReveal>

    <!-- linha ascendente sutil ao fundo -->
    <svg class="spark" viewBox="0 0 600 200" aria-hidden="true">
      <path d="M0 190 C120 185, 200 150, 300 110 S 520 20, 600 5" fill="none" stroke="var(--cyan)" stroke-width="3" opacity="0.15" />
    </svg>

    <div class="stats">
      <DeckStep :at="1" class="stat deck-card">
        <Flame :size="30" class="stat-icon coral" />
        <span class="stat-num"><DeckCounter :to="2" :at="1" suffix="×" :duration="900" /></span>
        <span class="stat-label">propostas <b>dobrando salários</b> da noite pro dia</span>
      </DeckStep>

      <DeckStep :at="2" class="stat deck-card">
        <TrendingUp :size="30" class="stat-icon cyan" />
        <span class="stat-num">R$ <DeckCounter :to="10" :at="2" suffix=" mil+" :duration="1100" /></span>
        <span class="stat-label">para devs com <b>~3 anos</b> de carreira</span>
      </DeckStep>

      <DeckStep :at="2" :delay="0.15" class="stat deck-card">
        <TrendingUp :size="30" class="stat-icon cyan" />
        <span class="stat-num">R$ <DeckCounter :to="30" :at="2" suffix=" mil+" :duration="1100" :delay="200" /></span>
        <span class="stat-label">para <b>sêniores</b> com 10+ anos</span>
      </DeckStep>

      <DeckStep :at="3" class="stat deck-card">
        <Home :size="30" class="stat-icon green" />
        <span class="stat-num"><DeckCounter :to="75" :at="3" suffix="%" :duration="1100" /></span>
        <span class="stat-label">da força de trabalho <b>remota</b> em 2022</span>
      </DeckStep>
    </div>

    <DeckStep :at="3" :delay="0.4" class="foot">
      Carência extrema de profissionais: <b>todo mundo</b> recebia proposta.
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { Flame, TrendingUp, Home } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[15]
</script>

<style scoped>
.s-title { font-size: 44px; margin-top: 10px; }
.spark { position: absolute; right: 60px; bottom: 40px; width: 600px; pointer-events: none; }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 56px; }
.stat { display: flex; flex-direction: column; gap: 10px; padding: 26px 22px; }
.stat-icon.coral { color: var(--coral); }
.stat-icon.cyan { color: var(--cyan); }
.stat-icon.green { color: var(--green); }
.stat-num { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 42px; line-height: 1; }
.stat-label { font-size: 14.5px; line-height: 1.45; color: var(--text2); }
.stat-label b { color: var(--text); }
.foot { margin-top: 44px; font-size: 19px; color: var(--text2); text-align: center; }
.foot b { color: var(--coral); }

/* Ambient: a linha ascendente respira e o ícone Flame tremeluz ("mercado ferveu"). */
.deck-root.ambient-on .slide.active .spark path { --amb-o1: .15; --amb-o2: .08; animation: amb-pulse 6s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .stat-icon.coral { animation: flame-flicker 3s ease-in-out infinite; }
@keyframes flame-flicker {
  0%, 100% { opacity: 1; filter: brightness(1); }
  20% { opacity: 0.85; filter: brightness(1.15); }
  45% { opacity: 1; filter: brightness(0.95); }
  60% { opacity: 0.9; filter: brightness(1.2); }
  80% { opacity: 0.95; filter: brightness(1.05); }
}
</style>
