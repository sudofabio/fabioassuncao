<template>
  <!-- Slide 9 (D4) — O arsenal do desenvolvedor · Steps: 3 (uma família por clique) -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o mapa da IA · o arsenal</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">O arsenal do desenvolvedor</DeckReveal>

    <div class="familias">
      <DeckStep :at="1" variant="dn" class="familia">
        <div class="fam-head">
          <FlaskConical :size="20" class="fam-icon proto" />
          <b>Prototipação</b>
          <span class="fam-sub">navegador · validar ideia, MVP descartável</span>
        </div>
        <div class="logos">
          <div v-for="f in FERRAMENTAS_PROTOTIPACAO" :key="f.nome" class="logo-card deck-card">
            <span class="logo-img"><BrandLogo :src="f.logo" :alt="f.nome" /></span>
            <span class="logo-name">{{ f.nome }}</span>
          </div>
        </div>
      </DeckStep>

      <DeckStep :at="2" variant="dn" class="familia">
        <div class="fam-head">
          <PanelsTopLeft :size="20" class="fam-icon edit" />
          <b>Editores com IA</b>
          <span class="fam-sub">o dia a dia dentro do código</span>
        </div>
        <div class="logos">
          <div v-for="f in FERRAMENTAS_EDITORES" :key="f.nome" class="logo-card deck-card">
            <span class="logo-img"><BrandLogo :src="f.logo" :alt="f.nome" /></span>
            <span class="logo-name">{{ f.nome }}</span>
          </div>
        </div>
      </DeckStep>

      <DeckStep :at="3" variant="dn" class="familia">
        <div class="fam-head">
          <SquareTerminal :size="20" class="fam-icon cli" />
          <b>Agentes de terminal</b>
          <span class="fam-sub">automação de repo inteiro · onde o Issue Flow vive</span>
        </div>
        <div class="logos">
          <div v-for="f in FERRAMENTAS_ENGENHARIA" :key="f.nome" class="logo-card deck-card">
            <span class="logo-img"><BrandLogo :src="f.logo" :alt="f.nome" /></span>
            <span class="logo-name">{{ f.nome }}</span>
          </div>
        </div>
      </DeckStep>
    </div>

    <DeckStep :at="3" :delay="0.4" class="foot">
      Navegador para <b>explorar</b> · editor para <b>produzir</b> · terminal para <b>automatizar</b>.
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { FlaskConical, PanelsTopLeft, SquareTerminal } from 'lucide-vue-next'
import BrandLogo from '~/components/slides/alem-do-codigo/BrandLogo.vue'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { FERRAMENTAS_PROTOTIPACAO, FERRAMENTAS_EDITORES, FERRAMENTAS_ENGENHARIA } from '~/data/presentations/alem-do-codigo/ferramentas'

const nota = NOTAS[8]
</script>

<style scoped>
.s-title { font-size: 44px; margin-top: 10px; }
.familias { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 42px; align-items: start; }
.fam-head { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; margin-bottom: 16px; }
.fam-head b { font-family: 'Space Grotesk', sans-serif; font-size: 19px; }
.fam-icon { align-self: center; }
.fam-icon.proto { color: var(--coral); }
.fam-icon.edit { color: var(--cyan); }
.fam-icon.cli { color: var(--green); }
.fam-sub { font-size: 12.5px; color: var(--text2); width: 100%; }
.logos { display: flex; flex-direction: column; gap: 11px; }
.logo-card { display: flex; align-items: center; gap: 12px; padding: 13px 16px; color: var(--text); }
.logo-img { height: 26px; width: 26px; flex-shrink: 0; display: inline-flex; }
.logo-name { font-size: 14.5px; font-weight: 600; }
.foot { margin-top: 38px; text-align: center; font-size: 18.5px; color: var(--text2); }
.foot b { color: var(--text); }

/* Ambient: cada família tem uma borda de destaque suave, alternando. */
.deck-root.ambient-on .slide.active .familia:nth-child(1) .fam-icon { --amb-bright: 1.4; animation: amb-glow 4s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .familia:nth-child(2) .fam-icon { --amb-bright: 1.4; animation: amb-glow 4s ease-in-out infinite 1.3s; }
.deck-root.ambient-on .slide.active .familia:nth-child(3) .fam-icon { --amb-bright: 1.4; animation: amb-glow 4s ease-in-out infinite 2.6s; }
</style>
