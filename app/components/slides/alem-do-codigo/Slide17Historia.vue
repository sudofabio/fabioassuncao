<template>
  <!-- Slide 17 — Minha história · ⭐⭐⭐ (coração emocional) · Steps: 4
       Fade simples — a emoção está na voz, não na tela. -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow coral-eyebrow">2020–2022 · a pandemia e o ponto fora da curva</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">2022: a decisão mais difícil (e mais óbvia)</DeckReveal>

    <DeckReveal :delay="0.28" class="ctx-pandemia">
      Na pandemia o mercado ferveu: propostas <b>dobravam salários</b> da noite pro dia, <b>75%</b> remoto. E eu vivi isso na pele.
    </DeckReveal>

    <DeckReveal :delay="0.35" class="destaque">
      <MailPlus :size="18" />
      <span><b><DeckCounter :to="20" suffix="+" :duration="900" :delay="450" /></b> mensagens de recrutadores por semana</span>
    </DeckReveal>

    <div class="cenas">
      <template v-for="(c, i) in cenas" :key="c.titulo">
        <DeckStep :at="i + 1" class="cena deck-card">
          <span class="cena-num mono">{{ i + 1 }}</span>
          <component :is="c.icon" :size="32" class="cena-icon" />
          <b class="cena-title">{{ c.titulo }}</b>
          <span class="cena-sub">{{ c.sub }}</span>
        </DeckStep>
      </template>
    </div>

    <DeckStep :at="4" :delay="0.5" class="foot">
      Era um ponto fora da curva, <b>e pontos fora da curva não duram</b>.
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { TriangleAlert, MailPlus, PauseCircle, Laptop } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[16]

const cenas = [
  { icon: TriangleAlert, titulo: 'Clientes em crise', sub: 'contratos quebrando' },
  { icon: MailPlus, titulo: 'Propostas dobradas', sub: 'de 7 pra 14, 15 mil' },
  { icon: PauseCircle, titulo: 'Pausa na Codions', sub: 'testar o mercado' },
  { icon: Laptop, titulo: '2–3 empregos', sub: 'Brasil ↔ EUA, simultâneos' },
]
</script>

<style scoped>
.s-title { font-size: 42px; margin-top: 10px; }
.coral-eyebrow { color: var(--coral); }
.ctx-pandemia { margin-top: 14px; font-size: 16px; line-height: 1.5; color: var(--text2); max-width: 820px; }
.ctx-pandemia b { color: var(--text); }
.destaque { display: inline-flex; align-items: center; gap: 10px; margin-top: 26px; padding: 10px 18px; border-radius: 40px; background: color-mix(in srgb, var(--coral) 8%, transparent); border: 1px solid color-mix(in srgb, var(--coral) 30%, transparent); color: var(--coral); font-size: 16px; white-space: nowrap; width: fit-content; }
.destaque b { font-family: 'Space Grotesk', sans-serif; font-size: 19px; }
.cenas { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 44px; }
.cena { position: relative; display: flex; flex-direction: column; gap: 9px; padding: 26px 20px; }
.cena-num { position: absolute; top: 14px; right: 14px; font-size: 22px; color: var(--border); }
.cena-icon { color: var(--coral); }
.cena-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; margin-top: 4px; }
.cena-sub { font-size: 13.5px; color: var(--text2); }
.foot { margin-top: 46px; text-align: center; font-size: 20px; color: var(--text2); }
.foot b { color: var(--text); }

/* Ambient: respiração MUITO sutil da borda do pill (o slide é deliberadamente sóbrio). */
.deck-root.ambient-on .slide.active .destaque { --amb-bright: 1.12; animation: amb-glow 6s ease-in-out infinite; }
</style>
