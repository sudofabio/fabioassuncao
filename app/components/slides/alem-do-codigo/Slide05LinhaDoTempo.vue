<template>
  <!-- Slide 5 — Linha do tempo · ⭐⭐⭐ · Steps: 4 (uma era por clique; era atual com glow) -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o que é desenvolvimento, e como ele evoluiu</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">No começo, você era só "desenvolvedor"</DeckReveal>

    <DeckReveal :delay="0.24" class="ctx-strip">
      <b class="ctx-lead">Software está em tudo:</b>
      <span v-for="c in categorias" :key="c.t" class="ctx-item"><component :is="c.i" :size="16" /> {{ c.t }}</span>
    </DeckReveal>

    <div class="timeline">
      <div class="axis"></div>
      <div
        v-for="(era, i) in eras"
        :key="era.titulo"
        class="era-col"
      >
        <DeckStep :at="i + 1" class="era" :class="{ atual: era.atual }">
          <span class="era-node" :class="{ 'node-atual': era.atual }"></span>
          <span class="era-num mono">{{ String(i + 1).padStart(2, '0') }}</span>
          <component :is="era.icon" :size="34" class="era-icon" :class="{ 'icon-atual': era.atual }" />
          <b class="era-title">{{ era.titulo }}</b>
          <ul class="era-bullets">
            <li v-for="b in era.bullets" :key="b">{{ b }}</li>
          </ul>
        </DeckStep>
        <DeckStep :at="i + 1" class="axis-fill" aria-hidden="true"><span></span></DeckStep>
      </div>
    </div>
  </DeckSlide>
</template>

<script setup>
import { Terminal, GitBranch, Blocks, BrainCircuit, Smartphone, Globe, Building2, Workflow, Package, Server, PlugZap } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[4]

const categorias = [
  { i: Smartphone, t: 'apps' },
  { i: Globe, t: 'sites' },
  { i: Building2, t: 'sistemas' },
  { i: Workflow, t: 'automações' },
  { i: Package, t: 'produtos' },
  { i: Server, t: 'infra' },
  { i: PlugZap, t: 'integrações' },
]

const eras = [
  { icon: Terminal, titulo: 'O Início', bullets: ['dev "faz-tudo"', 'web vs desktop'], atual: false },
  { icon: GitBranch, titulo: 'A Especialização', bullets: ['front · back · DevOps · QA', 'ascensão do ágil'], atual: false },
  { icon: Blocks, titulo: 'As Plataformas', bullets: ['low-code / no-code', '"democratizar"'], atual: false },
  { icon: BrainCircuit, titulo: 'A Nova Era', bullets: ['IA e agentes', 'código via linguagem natural'], atual: true },
]
</script>

<style scoped>
.s-title { font-size: 44px; margin-top: 10px; }
.ctx-strip { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 20px; }
.ctx-lead { font-family: 'Space Grotesk', sans-serif; font-size: 15px; color: var(--text); }
.ctx-item { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; color: var(--text2); }
.ctx-item svg { color: var(--cyan); }
.timeline { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px; margin-top: 56px; }
.axis { position: absolute; top: 7px; left: 10px; right: 10px; height: 2px; background: var(--border); }
.era-col { position: relative; }
/* o segmento do eixo "cresce" (scaleX) da esquerda p/ direita, sincronizado com
   a entrada da era — em vez de acender de uma vez. A entrada padrão do dstep é
   neutralizada aqui para o preenchimento parecer contínuo. */
.axis-fill { transform: none; opacity: 1; }
.axis-fill span { position: absolute; top: 7px; left: -26px; right: 0; height: 2px; background: var(--cyan); opacity: 0.5; display: block; transform: scaleX(0); transform-origin: left; transition: transform 0.7s var(--ease) 0.08s; }
.axis-fill.on span { transform: scaleX(1); }
.era-col:first-child .axis-fill span { left: 10px; }
.era { position: relative; padding-top: 34px; }
.era-node { position: absolute; top: 0; left: 0; width: 16px; height: 16px; border-radius: 50%; background: var(--bg2); border: 3px solid var(--text2); }
.node-atual { border-color: var(--cyan); background: var(--cyan); box-shadow: 0 0 18px color-mix(in srgb, var(--cyan) 75%, transparent); }
.era-num { position: absolute; top: 30px; right: 6px; font-size: 40px; color: var(--border); font-weight: 500; }
.era-icon { color: var(--text2); }
.icon-atual { color: var(--cyan); filter: drop-shadow(0 0 10px color-mix(in srgb, var(--cyan) 60%, transparent)); }
.era-title { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 21px; margin-top: 12px; }
.era.atual .era-title { color: var(--cyan); }
.era-bullets { list-style: none; margin-top: 10px; display: flex; flex-direction: column; gap: 5px; }
.era-bullets li { font-size: 14.5px; color: var(--text2); padding-left: 14px; position: relative; }
.era-bullets li::before { content: ''; position: absolute; left: 0; top: 8px; width: 5px; height: 5px; border-radius: 50%; background: var(--border); }
.era.atual .era-bullets li::before { background: var(--cyan); }

/* ambient: o nó da era atual vira farol — pulso de glow ciano mais perceptível;
   o ícone da era atual (drop-shadow) respira junto. */
.deck-root.ambient-on .slide.active .node-atual { --amb-bright: 1.7; animation: amb-glow 3.5s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .icon-atual { --amb-bright: 1.4; animation: amb-glow 3.5s ease-in-out infinite; }
</style>
