<template>
  <!-- Slide 10 — A barreira despencou · ⭐⭐⭐ (momento wow) · Steps: 2
       ① ANTES (barras crescem + valores)  ② HOJE (US$ 20 + queda) -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">vibe coding e a quebra da barreira de entrada</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">A barreira de entrada despencou</DeckReveal>

    <div class="compare">
      <DeckStep :at="1" class="side antes">
        <span class="side-label mono">ANTES</span>
        <div class="bars">
          <div class="bar-col">
            <span class="bar-value">R$ <DeckCounter :to="100" :at="1" suffix=" mil" :duration="1300" /></span>
            <div class="bar b-empresa"></div>
            <span class="bar-label">Empresa<br /><i>R$ 20–100 mil</i></span>
          </div>
          <div class="bar-col">
            <span class="bar-value">R$ <DeckCounter :to="20" :at="1" suffix=" mil" :duration="1300" :delay="250" /></span>
            <div class="bar b-freela"></div>
            <span class="bar-label">Freelancer<br /><i>R$ 10–20 mil</i></span>
          </div>
        </div>
        <span class="tempo"><Timer :size="16" /> semanas ou meses</span>
      </DeckStep>

      <DeckStep :at="2" class="drop" aria-hidden="true">
        <TrendingDown :size="46" />
      </DeckStep>

      <DeckStep :at="2" class="side hoje">
        <span class="side-label mono hoje-label">HOJE</span>
        <div class="bars">
          <div class="bar-col">
            <span class="bar-value hoje-value">US$ <DeckCounter :to="20" :at="2" :duration="1200" /><span class="mes">/mês</span></span>
            <div class="bar b-hoje"></div>
            <span class="bar-label">Assinatura de IA<br /><i>+ algumas horas descrevendo</i></span>
          </div>
        </div>
        <span class="tempo hoje-tempo"><Timer :size="16" /> horas ou dias</span>
      </DeckStep>
    </div>

    <DeckStep :at="2" :delay="0.5" class="foot">
      Quem só fazia o básico <b>perdeu a exclusividade do básico</b>.
    </DeckStep>

    <p class="source">Valores aproximados de mercado · comparação de PROTÓTIPO, não de produto final</p>
  </DeckSlide>
</template>

<script setup>
import { Timer, TrendingDown } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[9]
</script>

<style scoped>
.s-title { font-size: 44px; margin-top: 10px; }
.compare { display: grid; grid-template-columns: 1.3fr auto 1fr; gap: 40px; margin-top: 40px; align-items: end; }
.side { display: flex; flex-direction: column; gap: 14px; }
.side-label { font-size: 14px; letter-spacing: 0.24em; color: var(--text2); }
.hoje-label { color: var(--coral); }
.bars { display: flex; gap: 40px; align-items: flex-end; height: 260px; }
.bar-col { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 10px; height: 100%; }
.bar { width: 92px; border-radius: 8px 8px 0 0; transform: scaleY(0); transform-origin: bottom; transition: transform 1.2s var(--ease) 0.15s; }
.dstep.on .bar { transform: scaleY(1); }
.b-empresa { height: 180px; background: linear-gradient(180deg, var(--text2), color-mix(in srgb, var(--text2) 55%, var(--bg))); }
.b-freela { height: 76px; background: linear-gradient(180deg, color-mix(in srgb, var(--text2) 78%, var(--bg)), color-mix(in srgb, var(--text2) 45%, var(--bg))); }
.b-hoje { height: 14px; background: var(--coral); box-shadow: 0 0 20px color-mix(in srgb, var(--coral) 45%, transparent); }
.bar-value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 24px; }
.hoje-value { color: var(--coral); font-size: 30px; }
.mes { font-size: 16px; color: var(--text2); font-weight: 500; }
.bar-label { font-size: 13.5px; text-align: center; line-height: 1.35; }
.bar-label i { color: var(--text2); font-style: normal; }
.tempo { display: inline-flex; align-items: center; gap: 7px; font-size: 14px; color: var(--text2); }
.hoje-tempo { color: var(--coral); }
.drop { color: var(--red); padding-bottom: 110px; }
.foot { margin-top: 34px; font-size: 19px; color: var(--text2); text-align: center; }
.foot b { color: var(--text); }
</style>
