<template>
  <!-- Slide 4 — Software está em tudo · ⭐⭐ · Steps: 1 (grid em cascata) -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o que estamos chamando de desenvolvimento</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Software está em tudo</DeckReveal>
    <DeckReveal tag="p" :delay="0.25" class="lead s-lead">
      Criar soluções digitais que resolvem problemas de pessoas, empresas e governos.
    </DeckReveal>

    <div class="grid">
      <DeckStep
        v-for="(c, i) in categorias"
        :key="c.titulo"
        :at="1"
        :delay="0.09 * i"
        class="deck-card cat"
      >
        <component :is="c.icon" :size="34" class="cat-icon" />
        <b class="cat-title">{{ c.titulo }}</b>
        <span class="cat-desc">{{ c.desc }}</span>
        <span v-if="c.logos" class="cat-logos">
          <img v-for="l in c.logos" :key="l" :src="l" alt="" class="cat-logo" />
        </span>
      </DeckStep>
    </div>
  </DeckSlide>
</template>

<script setup>
import { Smartphone, Globe, Building2, Workflow, Package, Server, PlugZap } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { LOGOS_PLATAFORMAS } from '~/data/presentations/alem-do-codigo/ferramentas'

const nota = NOTAS[3]

const categorias = [
  { icon: Smartphone, titulo: 'Apps', desc: 'no seu celular', logos: [LOGOS_PLATAFORMAS.android, LOGOS_PLATAFORMAS.ios] },
  { icon: Globe, titulo: 'Websites', desc: 'e plataformas' },
  { icon: Building2, titulo: 'Sistemas', desc: 'empresariais e de governo' },
  { icon: Workflow, titulo: 'Automações', desc: 'de processos' },
  { icon: Package, titulo: 'Produtos digitais', desc: 'SaaS e serviços' },
  { icon: Server, titulo: 'Infraestrutura', desc: 'cloud e servidores' },
  { icon: PlugZap, titulo: 'Integrações', desc: 'sistemas conversando' },
]
</script>

<style scoped>
.s-title { font-size: 46px; margin-top: 10px; }
.s-lead { margin-top: 12px; max-width: 760px; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 40px; }
.cat { display: flex; flex-direction: column; gap: 8px; padding: 22px; position: relative; }
.cat-icon { color: var(--cyan); }
.cat-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; margin-top: 4px; }
.cat-desc { font-size: 13.5px; color: var(--text2); }
.cat-logos { position: absolute; top: 18px; right: 16px; display: flex; gap: 8px; }
.cat-logo { height: 20px; width: auto; opacity: 0.55; filter: brightness(0) invert(0.85); }
</style>
