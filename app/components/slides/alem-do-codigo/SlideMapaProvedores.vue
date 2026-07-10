<template>
  <!-- Mapa D2 — Quem é quem: provedores e modelos · Steps: 2
       ① os provedores (cascata) ② a mensagem-chave -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o mapa da IA · quem treina os modelos</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Quem é quem</DeckReveal>

    <div class="grid">
      <DeckStep
        v-for="(p, i) in PROVEDORES"
        :key="p.nome"
        :at="1"
        variant="sc"
        :delay="0.08 * i"
        class="prov deck-card"
      >
        <div class="prov-logo" :style="{ color: 'var(--text)' }"><BrandLogo :src="p.logo" :alt="p.nome" /></div>
        <b class="prov-nome">{{ p.nome }}</b>
        <span class="prov-modelos">{{ p.modelos }}</span>
        <span class="prov-tag" :class="p.tag.startsWith('aberto') ? 'open' : 'closed'">{{ p.tag }}</span>
      </DeckStep>
    </div>

    <DeckStep :at="2" :delay="0.1" class="foot">
      Pouquíssimas empresas <b>treinam</b> os modelos-base. <b class="hl">Todo o resto constrói em cima delas.</b>
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import BrandLogo from '~/components/slides/alem-do-codigo/BrandLogo.vue'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { PROVEDORES } from '~/data/presentations/alem-do-codigo/conceitos'

const nota = NOTAS[27]
</script>

<style scoped>
.s-title { font-size: 46px; margin-top: 10px; }
.grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-top: 48px; }
.prov { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 9px; padding: 26px 14px 20px; }
.prov-logo { width: 78px; height: 46px; display: flex; align-items: center; justify-content: center; }
.prov-nome { font-family: 'Space Grotesk', sans-serif; font-size: 19px; }
.prov-modelos { font-size: 12.5px; line-height: 1.4; color: var(--text2); min-height: 34px; }
.prov-tag { font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; padding: 2px 9px; border-radius: 999px; border: 1px solid var(--border); }
.prov-tag.open { color: var(--green); border-color: color-mix(in srgb, var(--green) 45%, transparent); }
.prov-tag.closed { color: var(--text2); }
.foot { margin-top: 46px; text-align: center; font-size: 21px; color: var(--text2); }
.foot b { color: var(--text); }
.foot b.hl { color: var(--cyan); }

/* Ambient: destaque rotativo — um logo "acende" por vez, em sequência. */
.deck-root.ambient-on .slide.active .prov-logo .brand-logo { animation: prov-spot 10s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .prov:nth-child(1) .prov-logo .brand-logo { animation-delay: 0s; }
.deck-root.ambient-on .slide.active .prov:nth-child(2) .prov-logo .brand-logo { animation-delay: 2s; }
.deck-root.ambient-on .slide.active .prov:nth-child(3) .prov-logo .brand-logo { animation-delay: 4s; }
.deck-root.ambient-on .slide.active .prov:nth-child(4) .prov-logo .brand-logo { animation-delay: 6s; }
.deck-root.ambient-on .slide.active .prov:nth-child(5) .prov-logo .brand-logo { animation-delay: 8s; }
@keyframes prov-spot {
  0% { transform: none; filter: none; }
  8% { transform: translateY(-3px); filter: drop-shadow(0 0 9px color-mix(in srgb, var(--cyan) 50%, transparent)); }
  16% { transform: none; filter: none; }
  100% { transform: none; filter: none; }
}
</style>
