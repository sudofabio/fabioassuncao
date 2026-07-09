<template>
  <!-- Slide 7 — Anti-hype · ⭐⭐ · Steps: 3 (pares revelados juntos) -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o que esta palestra NÃO é</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Sem balela: visão de quem está no mercado</DeckReveal>

    <div class="split">
      <div class="col">
        <DeckReveal :delay="0.3" class="col-head hype">
          <Megaphone :size="22" />
          <b>O discurso do hype</b>
        </DeckReveal>
        <DeckStep v-for="(par, i) in pares" :key="`h-${i}`" :at="i + 1" variant="lf" class="item hype-item">
          <XCircle :size="20" class="x" />
          <span>{{ par.hype }}</span>
        </DeckStep>
      </div>

      <div class="divider" aria-hidden="true"></div>

      <div class="col">
        <DeckReveal :delay="0.3" class="col-head real">
          <BadgeCheck :size="22" />
          <b>A realidade do mercado</b>
        </DeckReveal>
        <DeckStep v-for="(par, i) in pares" :key="`r-${i}`" :at="i + 1" variant="rt" class="item real-item">
          <CheckCircle2 :size="20" class="check" />
          <span>{{ par.real }}</span>
        </DeckStep>
      </div>
    </div>
  </DeckSlide>
</template>

<script setup>
import { Megaphone, BadgeCheck, XCircle, CheckCircle2 } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[6]

const pares = [
  { hype: '"Fature 50 mil com IA sem saber programar"', real: 'Fundamentos + método + experiência' },
  { hype: 'Ferramenta mágica que faz tudo sozinha', real: 'Ferramenta multiplica quem tem repertório' },
  { hype: 'Dinheiro fácil, sem esforço, da noite pro dia', real: 'Entrega de valor real, no Brasil e fora' },
]
</script>

<style scoped>
.s-title { font-size: 42px; margin-top: 10px; }
.split { position: relative; display: grid; grid-template-columns: 1fr auto 1fr; gap: 36px; margin-top: 46px; }
.divider { width: 1px; background: linear-gradient(180deg, transparent, var(--border) 20%, var(--border) 80%, transparent); transform: rotate(3deg); }
.col { display: flex; flex-direction: column; gap: 18px; }
.col-head { display: flex; align-items: center; gap: 10px; font-family: 'Space Grotesk', sans-serif; font-size: 20px; margin-bottom: 8px; }
.col-head.hype { color: var(--red); }
.col-head.real { color: var(--green); }
.item { display: flex; align-items: flex-start; gap: 12px; padding: 16px 18px; border-radius: 10px; font-size: 17px; line-height: 1.4; }
.hype-item { background: rgba(232, 93, 76, 0.07); border: 1px solid rgba(232, 93, 76, 0.25); color: var(--text2); font-style: italic; }
.real-item { background: rgba(62, 207, 142, 0.06); border: 1px solid rgba(62, 207, 142, 0.25); }
.x { color: var(--red); flex: none; margin-top: 2px; }
.check { color: var(--green); flex: none; margin-top: 2px; }
</style>
