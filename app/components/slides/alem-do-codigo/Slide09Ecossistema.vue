<template>
  <!-- Slide 9 — O novo arsenal · ⭐⭐ · Steps: 2 (① prototipação ② engenharia) -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o ecossistema de ferramentas</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">O novo arsenal do desenvolvedor</DeckReveal>

    <div class="clusters">
      <DeckStep :at="1" class="cluster">
        <div class="cluster-head">
          <FlaskConical :size="22" class="head-icon proto" />
          <b>Prototipação &amp; Vibe Coding</b>
          <span class="head-sub">qualquer pessoa cria algo funcional</span>
        </div>
        <div class="logos">
          <div v-for="f in FERRAMENTAS_PROTOTIPACAO" :key="f.nome" class="logo-card deck-card">
            <img :src="f.logo" :alt="f.nome" class="logo-img" />
            <span class="logo-name">{{ f.nome }}</span>
          </div>
        </div>
      </DeckStep>

      <div class="divider" aria-hidden="true"></div>

      <DeckStep :at="2" class="cluster">
        <div class="cluster-head">
          <Wrench :size="22" class="head-icon eng" />
          <b>Engenharia com IA</b>
          <span class="head-sub">profissionais extraem o máximo</span>
        </div>
        <div class="logos">
          <div v-for="f in FERRAMENTAS_ENGENHARIA" :key="f.nome" class="logo-card deck-card">
            <img :src="f.logo" :alt="f.nome" class="logo-img" />
            <span class="logo-name">{{ f.nome }}</span>
          </div>
        </div>
      </DeckStep>
    </div>

    <DeckStep :at="2" :delay="0.4" class="foot">
      A diferença não está na ferramenta. <b>Está em como você a usa.</b>
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { FlaskConical, Wrench } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { FERRAMENTAS_PROTOTIPACAO, FERRAMENTAS_ENGENHARIA } from '~/data/presentations/alem-do-codigo/ferramentas'

const nota = NOTAS[8]
</script>

<style scoped>
.s-title { font-size: 44px; margin-top: 10px; }
.clusters { display: grid; grid-template-columns: 1fr auto 1.2fr; gap: 30px; margin-top: 44px; align-items: start; }
.divider { width: 1px; align-self: stretch; background: linear-gradient(195deg, transparent, var(--border) 15%, var(--border) 85%, transparent); transform: rotate(4deg); }
.cluster-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
.cluster-head b { font-family: 'Space Grotesk', sans-serif; font-size: 20px; }
.head-icon { align-self: center; }
.head-icon.proto { color: var(--coral); }
.head-icon.eng { color: var(--cyan); }
.head-sub { font-size: 13.5px; color: var(--text2); width: 100%; }
.logos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.cluster:last-of-type .logos { grid-template-columns: repeat(2, 1fr); }
.logo-card { display: flex; align-items: center; gap: 12px; padding: 16px 18px; }
.logo-img { height: 30px; width: 30px; object-fit: contain; }
.logo-name { font-size: 15.5px; font-weight: 600; }
.foot { margin-top: 40px; text-align: center; font-size: 19px; color: var(--text2); }
.foot b { color: var(--coral); }

/* ambient: mesmo sheen do slide 07 no divisor diagonal. */
.deck-root.ambient-on .slide.active .divider { --amb-o2: 0.45; animation: amb-pulse 5s ease-in-out infinite; }
</style>
