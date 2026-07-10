<template>
  <!-- Evolução do dev com IA · Steps: 7 (uma etapa por clique) + caixa Vibe Coding no 4 -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">antes do método · como chegamos até aqui</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">A evolução do dev com IA</DeckReveal>

    <div class="timeline">
      <div class="axis" aria-hidden="true"></div>
      <template v-for="(e, i) in ETAPAS_EVOLUCAO" :key="e.titulo">
        <DeckStep v-if="i > 0" :at="i + 1" class="connector" aria-hidden="true">
          <span class="conn-line"></span>
        </DeckStep>
        <DeckStep :at="i + 1" variant="dn" class="etapa" :class="{ atual: e.atual }">
          <span class="node" :class="{ 'node-atual': e.atual }"></span>
          <span class="ano mono">{{ e.ano }}</span>
          <component :is="ICONS[e.icon]" :size="26" class="et-icon" :class="{ 'icon-atual': e.atual }" />
          <b class="et-titulo">{{ e.titulo }}</b>
          <span class="et-desc">{{ e.desc }}</span>
        </DeckStep>
      </template>
    </div>

    <div class="rodape">
      <DeckStep :at="4" variant="sc" class="fato">
        <BadgeInfo :size="16" class="fato-icon" />
        <div>
          <b>{{ VIBE_CODING_FATO.termo }}</b> — {{ VIBE_CODING_FATO.origem }}.
          <span class="fato-sub">{{ VIBE_CODING_FATO.reconhecimento }}. {{ VIBE_CODING_FATO.nuance }}</span>
        </div>
      </DeckStep>

      <DeckStep :at="7" :delay="0.3" class="sintese">
        Do fórum → ao chat → ao editor. O problema sempre foi o mesmo: <b class="hl">contexto</b>. O SDD é a resposta madura.
      </DeckStep>
    </div>
  </DeckSlide>
</template>

<script setup>
import { Search, MessageSquare, Code2, Sparkles, Megaphone, ShieldCheck, FileCheck2, BadgeInfo } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { ETAPAS_EVOLUCAO, VIBE_CODING_FATO } from '~/data/presentations/alem-do-codigo/evolucao'

const nota = NOTAS[31]
const ICONS = { Search, MessageSquare, Code2, Sparkles, Megaphone, ShieldCheck, FileCheck2 }
</script>

<style scoped>
.s-title { font-size: 42px; margin-top: 10px; }
.timeline { position: relative; display: flex; align-items: stretch; margin-top: 56px; }
.axis { position: absolute; top: 7px; left: 6px; right: 6px; height: 2px; background: var(--border); }
.etapa { position: relative; flex: 1; display: flex; flex-direction: column; gap: 5px; padding: 24px 8px 0; }
.node { position: absolute; top: 0; left: 8px; width: 15px; height: 15px; border-radius: 50%; background: var(--bg2); border: 3px solid var(--text2); }
.node-atual { border-color: var(--coral); background: var(--coral); box-shadow: 0 0 16px color-mix(in srgb, var(--coral) 70%, transparent); }
.ano { font-size: 12px; color: var(--cyan); letter-spacing: 0.02em; }
.et-icon { color: var(--text2); margin-top: 2px; }
.icon-atual { color: var(--coral); filter: drop-shadow(0 0 9px color-mix(in srgb, var(--coral) 55%, transparent)); }
.et-titulo { font-family: 'Space Grotesk', sans-serif; font-size: 15.5px; line-height: 1.2; }
.etapa.atual .et-titulo { color: var(--coral); }
.et-desc { font-size: 11.5px; line-height: 1.35; color: var(--text2); }
.connector { display: flex; align-items: flex-start; padding: 3px 0 0; }
.conn-line { display: block; width: 12px; height: 2px; background: var(--cyan); opacity: 0.5; position: relative; margin-top: 6px; }
.conn-line::before { content: ''; position: absolute; left: 0; top: 0; width: 6px; height: 100%; background: linear-gradient(90deg, transparent, var(--cyan), transparent); opacity: 0; will-change: transform; }
.rodape { margin-top: 40px; display: flex; flex-direction: column; gap: 18px; }
.fato { display: flex; align-items: flex-start; gap: 11px; padding: 14px 18px; border-radius: 10px; border: 1px solid color-mix(in srgb, var(--coral) 30%, var(--border)); background: color-mix(in srgb, var(--coral) 6%, transparent); font-size: 14px; line-height: 1.5; max-width: 900px; }
.fato-icon { color: var(--coral); flex-shrink: 0; margin-top: 2px; }
.fato b { color: var(--text); }
.fato-sub { display: block; margin-top: 3px; color: var(--text2); font-size: 13px; }
.sintese { font-size: 19px; color: var(--text2); text-align: center; }
.sintese b.hl { color: var(--cyan); }

/* Ambient: o nó do SDD (destino) é o farol; o fluxo corre pelos conectores. */
.deck-root.ambient-on .slide.active .node-atual { --amb-bright: 1.7; animation: amb-glow 3.6s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .icon-atual { --amb-bright: 1.4; animation: amb-glow 3.6s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .conn-line::before { animation: conn-flow 2.6s linear infinite; }
@keyframes conn-flow {
  0% { transform: translateX(-6px); opacity: 0; }
  30% { opacity: 0.9; }
  70% { opacity: 0.9; }
  100% { transform: translateX(12px); opacity: 0; }
}
</style>
