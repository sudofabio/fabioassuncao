<template>
  <!-- Slide 12 — Vibe, Prompt, Loop · ⭐⭐⭐ · Steps: 3 (um nível por clique)
       ÚNICO slide com animação em loop (ciclo do Loop Engineering) — req. 9 -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">três níveis de maturidade com IA</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Da vibe ao sistema</DeckReveal>

    <div class="stairs">
      <DeckStep :at="1" class="degrau d1 deck-card">
        <span class="nivel mono">nível 1</span>
        <Sparkles :size="30" class="icon i1" />
        <b class="d-title">Vibe Coding</b>
        <p class="d-desc">Exploração: "descreva e receba".</p>
        <p class="d-risco"><TriangleAlert :size="14" /> risco: loop infinito de bugs</p>
      </DeckStep>

      <DeckStep :at="2" class="degrau d2 deck-card">
        <span class="nivel mono">nível 2</span>
        <Target :size="30" class="icon i2" />
        <b class="d-title">Prompt Engineering</b>
        <p class="d-desc">Precisão: papel + contexto + restrições + critérios de aceite.</p>
      </DeckStep>

      <DeckStep :at="3" class="degrau d3 deck-card">
        <span class="nivel mono">nível 3</span>
        <b class="d-title loop-title">Loop Engineering</b>
        <p class="d-desc">Automação: o agente se autocorrige, com limites e regras de parada.</p>

        <!-- ciclo girando (única animação em loop da apresentação) -->
        <div class="cycle" aria-hidden="true">
          <svg viewBox="0 0 160 160" class="cycle-svg">
            <circle cx="80" cy="80" r="62" fill="none" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="5 8" class="ring" />
            <polygon points="80,10 87,22 73,22" class="ring-arrow" />
          </svg>
          <span v-for="(fase, i) in ciclo" :key="fase" class="fase mono" :class="`f${i}`">{{ fase }}</span>
        </div>
      </DeckStep>
    </div>

    <DeckStep :at="3" :delay="0.5" class="foot">
      Você deixa de ser digitador e vira <b>arquiteto do processo</b>.
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { Sparkles, Target, TriangleAlert } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[11]

const ciclo = ['objetivo', 'ação', 'observação', 'correção']
</script>

<style scoped>
.s-title { font-size: 44px; margin-top: 10px; }
.stairs { display: grid; grid-template-columns: 1fr 1fr 1.35fr; gap: 22px; margin-top: 44px; align-items: end; }
.degrau { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 22px; }
.d1 { min-height: 190px; }
.d2 { min-height: 240px; }
.d3 { min-height: 300px; border-color: color-mix(in srgb, var(--cyan) 40%, transparent); }
.ring-arrow { fill: var(--cyan); }
.nivel { font-size: 12px; letter-spacing: 0.2em; color: var(--text2); }
.icon { margin-top: 2px; }
.i1 { color: var(--coral); }
.i2 { color: var(--green); }
.d-title { font-family: 'Space Grotesk', sans-serif; font-size: 21px; }
.loop-title { color: var(--cyan); }
.d-desc { font-size: 14.5px; line-height: 1.45; color: var(--text2); }
.d-risco { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--red); margin-top: auto; }
.cycle { position: relative; width: 160px; height: 160px; margin: 10px auto 0; }
.cycle-svg { position: absolute; inset: 0; animation: spin 14s linear infinite; transform-origin: center; }
@keyframes spin { to { transform: rotate(360deg); } }
.fase { position: absolute; font-size: 11px; color: var(--cyan); background: var(--bg2); padding: 2px 7px; border-radius: 20px; border: 1px solid var(--border); }
.f0 { top: -6px; left: 50%; transform: translateX(-50%); }
.f1 { right: -18px; top: 50%; transform: translateY(-50%); }
.f2 { bottom: -6px; left: 50%; transform: translateX(-50%); }
.f3 { left: -18px; top: 50%; transform: translateY(-50%); }
.foot { margin-top: 30px; text-align: center; font-size: 19px; color: var(--text2); }
.foot b { color: var(--cyan); }
@media (prefers-reduced-motion: reduce) { .cycle-svg { animation: none; } }
</style>
