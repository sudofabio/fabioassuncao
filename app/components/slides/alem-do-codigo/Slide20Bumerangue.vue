<template>
  <!-- Slide 20 — O efeito bumerangue da IA · ⭐⭐⭐ · Steps: 4
       ① 32% (bumerangue sai e VOLTA) ② 55% ③ 50% ④ motivos -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o que as manchetes não contam</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">As empresas que demitiram estão recontratando</DeckReveal>

    <!-- bumerangue: sai e volta (uma vez, no step 1 — timing com "estão recontratando") -->
    <DeckStep :at="1" class="boomerang-wrap" aria-hidden="true">
      <Undo2 :size="34" class="boomerang" />
    </DeckStep>

    <div class="stats">
      <DeckStep v-for="(s, i) in STATS_BUMERANGUE" :key="s.fonte" :at="i + 1" class="stat deck-card">
        <span class="stat-num">
          <DeckCounter :to="s.valor" :at="i + 1" :suffix="s.sufixo" :duration="1000" />
        </span>
        <span class="stat-label">{{ s.rotulo }}</span>
        <span class="stat-fonte mono">{{ s.fonte }}</span>
      </DeckStep>
    </div>

    <DeckStep :at="4" class="motivos deck-card">
      <b class="motivos-title">Por que recontrataram?</b>
      <div v-for="m in MOTIVOS_RECONTRATACAO" :key="m.rotulo" class="motivo">
        <span class="motivo-valor mono"><DeckCounter :to="m.valor" suffix="%" :at="4" :duration="1000" /></span>
        <span class="motivo-track"><i :style="{ width: `${m.valor}%` }"></i></span>
        <span class="motivo-label">{{ m.rotulo }}</span>
      </div>
    </DeckStep>

    <p class="source">{{ FONTE_BUMERANGUE }}</p>
  </DeckSlide>
</template>

<script setup>
import { Undo2 } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { STATS_BUMERANGUE, MOTIVOS_RECONTRATACAO, FONTE_BUMERANGUE } from '~/data/presentations/alem-do-codigo/bumerangue'

const nota = NOTAS[19]
</script>

<style scoped>
.s-title { font-size: 40px; margin-top: 10px; }
.boomerang-wrap { position: absolute; top: 74px; right: 90px; color: var(--coral); }
.dstep.on .boomerang { animation: fly 1.6s ease-in-out 1; }
@keyframes fly {
  0% { transform: translate(0, 0) rotate(0); }
  45% { transform: translate(-260px, 60px) rotate(-320deg); }
  100% { transform: translate(0, 0) rotate(-720deg); }
}
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 36px; }
.stat { display: flex; flex-direction: column; gap: 10px; padding: 24px 22px; }
.stat-num { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 54px; line-height: 1; color: var(--coral); }
.stat-label { font-size: 14px; line-height: 1.45; color: var(--text2); flex: 1; }
.stat-fonte { font-size: 11.5px; letter-spacing: 0.1em; color: var(--cyan); text-transform: uppercase; }
.motivos { margin-top: 20px; padding: 18px 22px; display: flex; flex-direction: column; gap: 10px; }
.motivos-title { font-family: 'Space Grotesk', sans-serif; font-size: 16px; margin-bottom: 2px; }
.motivo { display: grid; grid-template-columns: 52px 180px 1fr; gap: 12px; align-items: center; }
.motivo-valor { font-size: 15px; color: var(--coral); font-weight: 500; }
.motivo-track { height: 8px; background: var(--bg); border-radius: 6px; overflow: hidden; }
/* barra cresce de scaleX(0)→scaleX(1) quando o step 4 revela (width inline = tamanho final;
   o scale anima por cima, sem tocar layout). Mesmo easeOutCubic do DeckCounter que acompanha. */
.motivo-track i { display: block; height: 100%; background: var(--coral); border-radius: 6px; opacity: 0.85; transform: scaleX(0); transform-origin: left; transition: transform 1s cubic-bezier(0.33, 1, 0.68, 1); }
.dstep.on .motivo-track i { transform: scaleX(1); }
.motivo-label { font-size: 13.5px; color: var(--text2); }
@media (prefers-reduced-motion: reduce) { .dstep.on .boomerang { animation: none; } .motivo-track i { transition-duration: .001s; } }
</style>
