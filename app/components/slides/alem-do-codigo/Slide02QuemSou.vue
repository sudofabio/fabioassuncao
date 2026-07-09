<template>
  <!-- Slide 2 — Quem sou eu · ⭐⭐⭐ · Steps: 1 (pilares acendem em sequência rápida) -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">quem sou eu</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">15+ anos construindo soluções</DeckReveal>

    <div class="grid">
      <DeckReveal variant="sc" :delay="0.3" class="photo-col">
        <div class="photo-card">
          <img :src="PALESTRANTE.foto" alt="Fábio Assunção" class="photo" />
        </div>
        <p class="photo-caption"><b>Fábio Assunção</b><br />Dev · Tech Lead · Empreendedor</p>
      </DeckReveal>

      <div class="pillars-col">
        <DeckReveal tag="p" :delay="0.4" class="lead bio">{{ PALESTRANTE.minibio }}</DeckReveal>

        <div class="timeline">
          <div class="track"></div>
          <DeckStep
            v-for="(p, i) in pilares"
            :key="p.titulo"
            :at="1"
            :delay="0.12 * i"
            class="pillar"
          >
            <span class="node"></span>
            <component :is="p.icon" :size="30" class="pillar-icon" />
            <b class="pillar-title">{{ p.titulo }}</b>
            <span class="pillar-desc">{{ p.desc }}</span>
          </DeckStep>
        </div>
      </div>
    </div>
  </DeckSlide>
</template>

<script setup>
import { Code, Cloud, Users, Briefcase } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { PALESTRANTE } from '~/data/presentations/alem-do-codigo/contatos'

const nota = NOTAS[1]

// 4 pilares da minibio oficial (PALESTRANTE/README.md) — nada além dela.
const pilares = [
  { icon: Code, titulo: 'Backend & Arquitetura', desc: 'de sistemas' },
  { icon: Cloud, titulo: 'Cloud computing', desc: 'soluções escaláveis' },
  { icon: Users, titulo: 'Liderança técnica', desc: 'Tech Lead' },
  { icon: Briefcase, titulo: 'Empreendedorismo', desc: 'engenharia + produto + negócio' },
]
</script>

<style scoped>
.s-title { font-size: 46px; margin-top: 10px; }
.grid { display: grid; grid-template-columns: 300px 1fr; gap: 56px; margin-top: 40px; align-items: start; }
.photo-card { width: 260px; height: 260px; border-radius: 18px; overflow: hidden; border: 1px solid var(--border); position: relative; }
.photo { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.05); }
/* Tratamento duotone navy/ciano */
.photo-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(160deg, color-mix(in srgb, var(--cyan) 28%, transparent), color-mix(in srgb, var(--bg) 55%, transparent)); mix-blend-mode: color; }
.photo-caption { margin-top: 14px; font-size: 15px; line-height: 1.5; color: var(--text2); }
.photo-caption b { color: var(--text); font-family: 'Space Grotesk', sans-serif; }
.bio { font-size: 19px; max-width: 720px; }
.timeline { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 48px; }
.track { position: absolute; top: 5px; left: 8px; right: 8px; height: 2px; background: var(--border); }
.pillar { position: relative; padding-top: 26px; }
.node { position: absolute; top: 0; left: 0; width: 12px; height: 12px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 12px color-mix(in srgb, var(--cyan) 60%, transparent); }
.pillar-icon { color: var(--text2); }
.pillar-title { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 17px; margin-top: 10px; }
.pillar-desc { display: block; font-size: 13.5px; color: var(--text2); margin-top: 4px; }

/* ambient: os nós ciano respiram (brilho escalonado). O glow é box-shadow —
   animado via filter brightness (amb-glow), não via box-shadow. */
.deck-root.ambient-on .slide.active .node { --amb-bright: 1.5; animation: amb-glow 5s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .pillar:nth-child(3) .node { animation-delay: -1.25s; }
.deck-root.ambient-on .slide.active .pillar:nth-child(4) .node { animation-delay: -2.5s; }
.deck-root.ambient-on .slide.active .pillar:nth-child(5) .node { animation-delay: -3.75s; }
</style>
