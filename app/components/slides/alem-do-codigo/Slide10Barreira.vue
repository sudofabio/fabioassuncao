<template>
  <!-- Slide 10 — A barreira despencou · ⭐⭐⭐ (momento wow) · Steps: 2
       ① os dois cenários "de antes" (empresa · freelancer)  ② o cenário com IA + punchline -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">vibe coding e a quebra da barreira de entrada</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">A barreira de entrada despencou</DeckReveal>

    <div class="cenarios">
      <DeckStep
        v-for="c in CENARIOS"
        :key="c.nome"
        :at="c.at"
        variant="dn"
        class="cen deck-card"
        :class="{ hot: c.hot }"
      >
        <div class="cen-head">
          <component :is="c.icon" :size="22" class="cen-icon" />
          <b class="cen-nome">{{ c.nome }}</b>
        </div>
        <div class="cen-custo">
          {{ c.custo }}<span v-if="c.custoBrl" class="cen-brl">{{ c.custoBrl }}</span>
        </div>
        <ul class="cen-meta">
          <li><Timer :size="14" /> {{ c.prazo }}</li>
          <li><Users :size="14" /> {{ c.gente }}</li>
          <li><Target :size="14" /> {{ c.foco }}</li>
        </ul>
        <span class="cen-nota">{{ c.nota }}</span>
      </DeckStep>
    </div>

    <DeckStep :at="2" :delay="0.5" class="foot">
      Gerar ficou barato. Quem só fazia o básico <b>perdeu a exclusividade do básico</b>.
    </DeckStep>

    <p class="source">Cenários diferentes, não equivalências · gerar protótipo ficou acessível; virar produto ainda exige engenharia</p>
  </DeckSlide>
</template>

<script setup>
import { Timer, Users, Target, Building2, User, Sparkles } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[9]

const CENARIOS = [
  { at: 1, icon: Building2, nome: 'Empresa tradicional', custo: 'R$ 20–100 mil', prazo: 'semanas a meses', gente: 'time: PM, devs, QA', foco: 'entrega completa', nota: 'contrato, garantia e responsabilidade' },
  { at: 1, icon: User, nome: 'Freelancer', custo: 'R$ 10–20 mil', prazo: 'dias a semanas', gente: 'uma pessoa', foco: 'MVP sob medida', nota: 'escopo e suporte limitados' },
  { at: 2, icon: Sparkles, nome: 'Com IA', custo: 'US$ 20–200/mês', custoBrl: '≈ R$ 103–1.028', prazo: 'horas a dias', gente: 'você + a IA', foco: 'protótipo rápido', nota: 'virar produto ainda exige engenharia', hot: true },
]
</script>

<style scoped>
.s-title { font-size: 44px; margin-top: 10px; }
.cenarios { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 36px; align-items: stretch; }
.cen { display: flex; flex-direction: column; gap: 14px; padding: 22px 22px 20px; }
.cen.hot { border-color: color-mix(in srgb, var(--coral) 45%, var(--border)); background: color-mix(in srgb, var(--coral) 7%, transparent); }
.cen-head { display: flex; align-items: center; gap: 10px; }
.cen-icon { color: var(--text2); }
.cen.hot .cen-icon { color: var(--coral); }
.cen-nome { font-family: 'Space Grotesk', sans-serif; font-size: 18px; }
.cen-custo { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 27px; display: flex; flex-direction: column; }
.cen.hot .cen-custo { color: var(--coral); }
.cen-brl { font-size: 14px; font-weight: 500; color: var(--text2); margin-top: 2px; }
.cen-meta { list-style: none; display: flex; flex-direction: column; gap: 7px; margin-top: 2px; }
.cen-meta li { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--text2); }
.cen-meta svg { color: var(--text2); flex-shrink: 0; }
.cen-nota { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border); font-size: 12.5px; line-height: 1.4; color: var(--text2); }
.cen.hot .cen-nota { color: color-mix(in srgb, var(--coral) 85%, var(--text)); }
.foot { margin-top: 30px; font-size: 19px; color: var(--text2); text-align: center; }
.foot b { color: var(--text); }

/* ambient: o cenário "Com IA" (punchline coral) respira suavemente. */
.deck-root.ambient-on .slide.active .cen.hot { --amb-bright: 1.08; animation: amb-glow 5s ease-in-out infinite; }
</style>
