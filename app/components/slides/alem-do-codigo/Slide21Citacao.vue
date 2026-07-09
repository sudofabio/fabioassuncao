<template>
  <!-- Slide 21 — "Uma narrativa conveniente demais" · ⭐⭐ · Steps: 1
       Apenas a citação nº 1 de Huang (regra inviolável). Sem foto — nome + cargo. -->
  <DeckSlide :title="nota.title" :notes="nota.notes" background="deep">
    <div class="center">
      <span class="aspas title" aria-hidden="true">"</span>
      <DeckStep :at="1" tag="blockquote" class="quote">
        <p class="quote-text title">{{ QUOTE_HUANG.texto }}</p>
      </DeckStep>
      <DeckStep :at="1" :delay="0.6" class="attr">
        <b>{{ QUOTE_HUANG.autor }}</b>
        <span>{{ QUOTE_HUANG.cargo }} ({{ QUOTE_HUANG.fonte }})</span>
      </DeckStep>
    </div>
  </DeckSlide>
</template>

<script setup>
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { QUOTE_HUANG } from '~/data/presentations/alem-do-codigo/quotes'

const nota = NOTAS[20]
</script>

<style scoped>
.center { position: relative; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 130px; }
.aspas { position: absolute; top: 60px; left: 110px; font-size: 220px; line-height: 1; color: var(--cyan); opacity: 0.16; }
.quote-text { font-size: 46px; line-height: 1.32; font-weight: 500; }
.attr { margin-top: 44px; display: flex; flex-direction: column; gap: 6px; }
.attr b { font-family: 'Space Grotesk', sans-serif; font-size: 20px; color: var(--coral); }
.attr span { font-size: 15px; color: var(--text2); }
</style>
