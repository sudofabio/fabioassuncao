<template>
  <!-- Mapa · 3 editores, 1 DNA (VS Code) · Steps: 3
       ① os 3 editores ② revelação: mesmo VS Code por baixo ③ regra de ouro -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o mapa da IA · o segredo dos editores</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">3 editores, 1 DNA</DeckReveal>

    <div class="editores">
      <DeckStep
        v-for="(e, i) in EDITORES"
        :key="e.nome"
        :at="1"
        variant="dn"
        :delay="0.1 * i"
        class="editor deck-card"
      >
        <div class="ed-top">
          <span class="ed-logo"><BrandLogo :src="e.logo" :alt="e.nome" /></span>
          <b class="ed-nome">{{ e.nome }}</b>
        </div>
        <span class="camada" :class="e.cor">camada de agente · {{ e.camada }}</span>
        <div class="code" aria-hidden="true">
          <span class="ln"></span><span class="ln sm"></span><span class="ln"></span>
        </div>
        <div class="base"><Hexagon :size="13" /> VS Code</div>
      </DeckStep>
    </div>

    <DeckStep :at="2" variant="sc" class="dna">
      <GitFork :size="16" />
      <span>Por baixo, os três são <b class="hl">o mesmo VS Code</b>. Cursor e Antigravity são forks. O que muda é a camada de agente por cima.</span>
    </DeckStep>

    <DeckStep :at="3" :delay="0.3" class="foot">
      Aprenda o VS Code de verdade e você <b>transita entre todos</b>. <span class="livre">Antigravity é grátis para uso individual.</span>
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { Hexagon, GitFork } from 'lucide-vue-next'
import BrandLogo from '~/components/slides/alem-do-codigo/BrandLogo.vue'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[29]

const LOGOS = '/presentations/alem-do-codigo/logos'
const EDITORES = [
  { nome: 'VS Code', logo: `${LOGOS}/vscode.svg`, camada: 'GitHub Copilot', cor: 'cyan' },
  { nome: 'Cursor', logo: `${LOGOS}/cursor.svg`, camada: 'Composer', cor: 'coral' },
  { nome: 'Antigravity', logo: `${LOGOS}/antigravity.svg`, camada: 'agentes em paralelo', cor: 'green' },
]
</script>

<style scoped>
.s-title { font-size: 46px; margin-top: 10px; }
.editores { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 42px; }
.editor { display: flex; flex-direction: column; gap: 12px; padding: 20px 20px 0; overflow: hidden; }
.ed-top { display: flex; align-items: center; gap: 11px; color: var(--text); }
.ed-logo { height: 28px; width: 28px; flex-shrink: 0; display: inline-flex; }
.ed-nome { font-family: 'Space Grotesk', sans-serif; font-size: 20px; }
.camada { font-size: 12px; padding: 4px 10px; border-radius: 6px; align-self: flex-start; border: 1px solid var(--border); }
.camada.cyan { color: var(--cyan); border-color: color-mix(in srgb, var(--cyan) 40%, transparent); }
.camada.coral { color: var(--coral); border-color: color-mix(in srgb, var(--coral) 40%, transparent); }
.camada.green { color: var(--green); border-color: color-mix(in srgb, var(--green) 40%, transparent); }
.code { display: flex; flex-direction: column; gap: 7px; padding: 6px 0 14px; }
.code .ln { height: 6px; border-radius: 3px; background: var(--border); width: 100%; opacity: 0.6; }
.code .ln.sm { width: 62%; }
.base { display: flex; align-items: center; gap: 7px; margin: 0 -20px; padding: 11px 20px; background: color-mix(in srgb, var(--cyan) 10%, var(--bg2)); border-top: 1px solid var(--border); font-size: 13.5px; font-weight: 600; color: var(--cyan); }
.dna { margin-top: 26px; display: flex; align-items: center; gap: 11px; justify-content: center; font-size: 17px; color: var(--text2); }
.dna b.hl { color: var(--cyan); }
.dna svg { color: var(--cyan); flex-shrink: 0; }
.foot { margin-top: 24px; text-align: center; font-size: 20px; color: var(--text2); }
.foot b { color: var(--text); }
.livre { display: block; margin-top: 6px; font-size: 14px; color: var(--green); }

/* Ambient: a camada de agente pulsa sobre a base compartilhada. */
.deck-root.ambient-on .slide.active .camada { --amb-o2: 0.55; animation: amb-pulse 3.4s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .editor:nth-child(2) .camada { animation-delay: 1.1s; }
.deck-root.ambient-on .slide.active .editor:nth-child(3) .camada { animation-delay: 2.2s; }
</style>
