<template>
  <!-- Mapa D1 — O que é IA/LLM · Steps: 3
       ① analogia (autocompletar gigante) ② previsão do próximo token ③ ressalva -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o mapa da IA · o básico</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Afinal, o que é essa "IA"?</DeckReveal>

    <DeckStep :at="1" class="lead">
      Um <b>LLM</b> é, no fundo, um <b class="hl">autocompletar gigante</b>.
    </DeckStep>

    <DeckStep :at="2" variant="sc" class="predict deck-card">
      <span class="predict-tag mono">prevê o próximo pedaço →</span>
      <p class="p-line mono">
        o gato subiu no <span class="ghost">telhado</span><span class="caret" aria-hidden="true">▌</span>
      </p>
      <p class="p-line mono">
        <span class="kw">function</span> soma(a, b) { <span class="kw">return</span> <span class="ghost">a + b }</span><span class="caret" aria-hidden="true">▌</span>
      </p>
      <p class="predict-note">Treinado lendo bilhões de textos <b>e código</b> — igual à sugestão do teclado do celular, só que muitíssimo mais poderoso.</p>
    </DeckStep>

    <DeckStep :at="3" class="caveat">
      <TriangleAlert :size="18" class="cav-icon" />
      <span>Ele <b>prevê</b> — não "entende" como você. Por isso às vezes erra com toda a confiança. <b class="hl">Você continua no comando.</b></span>
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { TriangleAlert } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[26]
</script>

<style scoped>
.s-title { font-size: 46px; margin-top: 10px; }
.lead { margin-top: 40px; font-size: 30px; line-height: 1.4; color: var(--text); font-family: 'Space Grotesk', sans-serif; }
.lead b { font-weight: 700; }
.hl { color: var(--cyan); }
.predict { margin-top: 34px; max-width: 720px; position: relative; padding: 26px 28px; }
.predict-tag { position: absolute; top: -11px; left: 22px; background: var(--bg); padding: 0 10px; font-size: 12px; letter-spacing: 0.06em; color: var(--coral); }
.p-line { font-size: 19px; line-height: 2; color: var(--text2); }
.kw { color: var(--coral); }
.ghost { color: var(--cyan); background: color-mix(in srgb, var(--cyan) 14%, transparent); border-radius: 4px; padding: 1px 6px; }
.caret { color: var(--cyan); margin-left: 2px; }
.predict-note { margin-top: 16px; font-size: 15px; line-height: 1.5; color: var(--text2); }
.predict-note b { color: var(--text); }
.caveat { margin-top: 30px; display: flex; align-items: flex-start; gap: 12px; font-size: 18px; line-height: 1.5; color: var(--text2); max-width: 760px; }
.cav-icon { color: var(--coral); flex-shrink: 0; margin-top: 3px; }
.caveat b { color: var(--text); }
.caveat b.hl { color: var(--cyan); }

/* Ambient: 1 elemento vivo — os carets de predição piscando. */
.deck-root.ambient-on .slide.active .caret { animation: amb-blink 1.1s linear infinite; }
</style>
