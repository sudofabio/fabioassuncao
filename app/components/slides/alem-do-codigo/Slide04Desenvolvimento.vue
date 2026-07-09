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
        <span v-if="c.logos || c.glyphs" class="cat-logos">
          <span v-for="l in c.logos" :key="l" class="cat-chip">
            <img :src="l" alt="" class="cat-logo" />
          </span>
          <span v-for="(g, gi) in c.glyphs" :key="'g' + gi" class="cat-chip">
            <component :is="g" :size="16" class="cat-glyph" />
          </span>
        </span>
      </DeckStep>
    </div>
  </DeckSlide>
</template>

<script setup>
import { Smartphone, Globe, Building2, Workflow, Package, Server, PlugZap, LayoutDashboard, Cloud, Webhook, Share2 } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { LOGOS_PLATAFORMAS, LOGOS_NAVEGADORES, LOGOS_INFRA, LOGOS_AUTOMACAO } from '~/data/presentations/alem-do-codigo/ferramentas'

const nota = NOTAS[3]

const categorias = [
  { icon: Smartphone, titulo: 'Apps', desc: 'no seu celular', logos: [LOGOS_PLATAFORMAS.android, LOGOS_PLATAFORMAS.ios] },
  { icon: Globe, titulo: 'Websites', desc: 'e plataformas', logos: [LOGOS_NAVEGADORES.chrome, LOGOS_NAVEGADORES.firefox, LOGOS_NAVEGADORES.edge, LOGOS_NAVEGADORES.safari] },
  { icon: Building2, titulo: 'Sistemas', desc: 'empresariais e de governo', logos: [LOGOS_PLATAFORMAS.windows, LOGOS_PLATAFORMAS.linux, LOGOS_PLATAFORMAS.macos] },
  { icon: Workflow, titulo: 'Automações', desc: 'de processos', logos: [LOGOS_AUTOMACAO.linux, LOGOS_AUTOMACAO.bash, LOGOS_AUTOMACAO.git] },
  { icon: Package, titulo: 'Produtos digitais', desc: 'SaaS e serviços', glyphs: [LayoutDashboard, Cloud, Webhook] },
  { icon: Server, titulo: 'Infraestrutura', desc: 'cloud e servidores', logos: [LOGOS_INFRA.docker, LOGOS_INFRA.kubernetes, LOGOS_INFRA.linux] },
  { icon: PlugZap, titulo: 'Integrações', desc: 'sistemas conversando', glyphs: [Webhook, Share2] },
]
</script>

<style scoped>
.s-title { font-size: 46px; margin-top: 10px; }
.s-lead { margin-top: 12px; max-width: 760px; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 34px; }
.cat { display: flex; flex-direction: column; gap: 8px; padding: 20px; position: relative; }
.cat-icon { color: var(--cyan); }
.cat-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; margin-top: 4px; }
.cat-desc { font-size: 13.5px; color: var(--text2); }

/* Faixa de logos no rodapé do card: exemplos concretos da categoria.
   Cada marca fica num chip de fundo neutro para garantir contraste nos dois
   temas (logos escuras como macOS/Safari não somem no dark). */
.cat-logos { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; padding-top: 12px; }
.cat-chip {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 8px;
  background: color-mix(in srgb, var(--text) 8%, transparent);
  border: 1px solid var(--border);
}
.cat-logo { height: 18px; width: 18px; object-fit: contain; }
.cat-glyph { color: var(--cyan); }
html.deck-light .cat-chip { background: color-mix(in srgb, #0a0e14 5%, transparent); }

/* ambient: respiração de brilho mínima nos ícones (o mais discreto do deck). */
.deck-root.ambient-on .slide.active .cat-icon { --amb-bright: 1.15; animation: amb-glow 6s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .cat:nth-child(2) .cat-icon { animation-delay: -0.8s; }
.deck-root.ambient-on .slide.active .cat:nth-child(3) .cat-icon { animation-delay: -1.6s; }
.deck-root.ambient-on .slide.active .cat:nth-child(4) .cat-icon { animation-delay: -2.4s; }
.deck-root.ambient-on .slide.active .cat:nth-child(5) .cat-icon { animation-delay: -3.2s; }
.deck-root.ambient-on .slide.active .cat:nth-child(6) .cat-icon { animation-delay: -4s; }
.deck-root.ambient-on .slide.active .cat:nth-child(7) .cat-icon { animation-delay: -4.8s; }
</style>
