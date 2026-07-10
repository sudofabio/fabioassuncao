<template>
  <!-- Sumário — panorama da palestra · Steps: 6 (um bloco por clique, em cascata) -->
  <DeckSlide :title="nota.title" :notes="nota.notes" effect="tech-constellation">
    <DeckReveal :delay="0.05" class="eyebrow">o mapa de hoje</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">O que vem por aí</DeckReveal>

    <div class="blocos">
      <DeckStep
        v-for="(b, i) in BLOCOS"
        :key="b.titulo"
        :at="i + 1"
        variant="sc"
        class="bloco deck-card"
      >
        <span class="num mono">{{ String(i + 1).padStart(2, '0') }}</span>
        <component :is="b.icon" :size="30" class="bloco-icon" />
        <b class="bloco-titulo">{{ b.titulo }}</b>
        <span class="bloco-desc">{{ b.desc }}</span>
      </DeckStep>
    </div>

    <DeckStep :at="6" :delay="0.4" class="foot">
      Em resumo: do mercado à prática, sem hype e sem terrorismo.
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { TrendingUp, Code2, Boxes, Workflow, TerminalSquare, Compass } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[35]

const BLOCOS = [
  { icon: TrendingUp, titulo: 'Mercado & IA', desc: 'o que mudou de verdade' },
  { icon: Code2, titulo: 'O papel do dev', desc: 'código virou commodity' },
  { icon: Boxes, titulo: 'Ferramentas & agentes', desc: 'modelos, MCP, skills, subagentes' },
  { icon: Workflow, titulo: 'O método', desc: 'de vibe coding a SDD e loop' },
  { icon: TerminalSquare, titulo: 'Na prática', desc: 'do problema ao Pull Request' },
  { icon: Compass, titulo: 'O novo desenvolvedor', desc: 'para onde a gente vai' },
]
</script>

<style scoped>
.s-title { font-size: 46px; margin-top: 10px; }
.blocos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 44px; }
.bloco { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 24px 22px; }
.num { position: absolute; top: 16px; right: 18px; font-size: 20px; color: var(--coral); opacity: 0.55; }
.bloco-icon { color: var(--cyan); }
.bloco-titulo { font-family: 'Space Grotesk', sans-serif; font-size: 21px; margin-top: 6px; }
.bloco-desc { font-size: 14px; color: var(--text2); }
.foot { margin-top: 34px; text-align: center; font-size: 17px; color: var(--text2); }

/* Ambient: os ícones respiram em onda (glow escalonado), 1 movimento discreto. */
.deck-root.ambient-on .slide.active .bloco-icon { --amb-bright: 1.5; animation: amb-glow 5s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .bloco:nth-child(2) .bloco-icon { animation-delay: -0.8s; }
.deck-root.ambient-on .slide.active .bloco:nth-child(3) .bloco-icon { animation-delay: -1.6s; }
.deck-root.ambient-on .slide.active .bloco:nth-child(4) .bloco-icon { animation-delay: -2.4s; }
.deck-root.ambient-on .slide.active .bloco:nth-child(5) .bloco-icon { animation-delay: -3.2s; }
.deck-root.ambient-on .slide.active .bloco:nth-child(6) .bloco-icon { animation-delay: -4s; }
</style>
