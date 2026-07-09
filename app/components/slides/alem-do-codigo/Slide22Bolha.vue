<template>
  <!-- Slide 22 — Quem está pagando essa conta? · ⭐⭐⭐ · Steps: 4
       ① Pichai ② 1,5% AIE ③ subsídio ④ frase-síntese
       Somente dados confirmados (BBC) — SEM exemplos Uber/Microsoft (regra inviolável). -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <!-- bolha que cresce devagar e NÃO estoura -->
    <svg class="bolha" viewBox="0 0 300 300" aria-hidden="true">
      <circle cx="150" cy="150" r="120" fill="none" stroke-width="1.5" opacity="0.35" class="b-ring b-ring-stroke" />
      <circle cx="150" cy="150" r="120" opacity="0.05" class="b-ring b-ring-fill" />
    </svg>

    <DeckReveal :delay="0.05" class="eyebrow amber">a bolha e o modelo econômico delicado</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Quem está pagando essa conta?</DeckReveal>

    <div class="sinais">
      <DeckStep :at="1" class="sinal deck-card">
        <MessageSquareQuote :size="26" class="s-icon amber-i" />
        <p class="sinal-quote">"{{ QUOTES_PICHAI.imune }}"</p>
        <p class="sinal-sub">"{{ QUOTES_PICHAI.racional }}"</p>
        <span class="sinal-fonte mono">{{ QUOTES_PICHAI.autor }} · {{ QUOTES_PICHAI.cargo }} ({{ QUOTES_PICHAI.fonte }})</span>
      </DeckStep>

      <DeckStep :at="2" class="sinal deck-card">
        <Zap :size="26" class="s-icon amber-i" />
        <span class="sinal-num"><DeckCounter :to="1.5" :decimals="1" :at="2" suffix="%" :duration="900" /></span>
        <p class="sinal-sub">{{ ELETRICIDADE_IA.rotulo }}</p>
        <span class="sinal-fonte mono">{{ ELETRICIDADE_IA.fonte }}</span>
      </DeckStep>

      <DeckStep :at="3" class="sinal deck-card">
        <DollarSign :size="26" class="s-icon amber-i" />
        <span class="sinal-num">US$ 20<span class="mes">/mês</span></span>
        <p class="sinal-sub">é <b>subsídio</b>: preços artificialmente baixos, sustentados por bilhões em caixa queimado</p>
        <span class="sinal-fonte mono">médio prazo: preço sobe, ferramenta muda — ou some</span>
      </DeckStep>
    </div>

    <DeckStep :at="4" class="synth">
      <p class="title synth-text">Ferramentas mudam. <span class="kw kw-coral" style="--kd: .3s">Fundamentos permanecem.</span></p>
    </DeckStep>

    <p class="source">{{ FONTE_BOLHA }}</p>
  </DeckSlide>
</template>

<script setup>
import { MessageSquareQuote, Zap, DollarSign } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { QUOTES_PICHAI, ELETRICIDADE_IA, FONTE_BOLHA } from '~/data/presentations/alem-do-codigo/quotes'

const nota = NOTAS[21]
</script>

<style scoped>
.s-title { font-size: 42px; margin-top: 10px; }
.amber { color: var(--amber); }
.bolha { position: absolute; right: -50px; top: -70px; width: 300px; pointer-events: none; z-index: -1; opacity: 0.65; }
.b-ring { transform-origin: center; transform: scale(0.85); transition: transform 6s ease-out; }
.b-ring-stroke { stroke: var(--amber); }
.b-ring-fill { fill: var(--amber); }
.slide.active .b-ring { transform: scale(1); }
.sinais { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 18px; margin-top: 34px; }
.sinal { display: flex; flex-direction: column; gap: 9px; padding: 22px; }
.s-icon { margin-bottom: 2px; }
.amber-i { color: var(--amber); }
.sinal-quote { font-family: 'Space Grotesk', sans-serif; font-size: 19px; line-height: 1.35; font-weight: 500; }
.sinal-num { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 46px; line-height: 1; color: var(--amber); }
.mes { font-size: 18px; color: var(--text2); font-weight: 500; }
.sinal-sub { font-size: 13.5px; line-height: 1.45; color: var(--text2); flex: 1; }
.sinal-sub b { color: var(--text); }
.sinal-fonte { font-size: 11px; color: var(--text2); opacity: 0.8; }
.synth { margin-top: 26px; text-align: center; }
.synth-text { font-size: 30px; font-weight: 500; }
</style>
