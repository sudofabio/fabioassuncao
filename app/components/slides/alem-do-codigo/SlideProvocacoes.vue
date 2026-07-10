<template>
  <!-- Provocações / Q&A · Steps: 4 (uma provocação por clique) -->
  <DeckSlide :title="nota.title" :notes="nota.notes" background="deep">
    <DeckReveal :delay="0.05" class="eyebrow">antes das perguntas · leve pra casa</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Quatro provocações</DeckReveal>

    <div class="provs">
      <DeckStep v-for="(p, i) in PROVOCACOES" :key="i" :at="i + 1" variant="lf" class="prov">
        <component :is="p.icon" :size="24" class="prov-icon" />
        <p class="prov-txt">{{ p.txt }}</p>
      </DeckStep>
    </div>

    <DeckStep :at="4" :delay="0.4" class="foot">
      <MessagesSquare :size="20" /> <span>Agora sim, <b>vamos conversar</b>.</span>
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { Coins, Sparkles, Flame, RotateCcw, MessagesSquare } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[34]

const PROVOCACOES = [
  { icon: Coins, txt: 'Se a IA escreve o código, o que exatamente você está vendendo?' },
  { icon: Sparkles, txt: 'Vibe coding é dívida técnica com marketing melhor?' },
  { icon: Flame, txt: 'Quando a conta da IA subir, os seus fundamentos seguram?' },
  { icon: RotateCcw, txt: 'O seu fluxo de IA tem algo que sabe dizer "não": um teste, um review, um erro real?' },
]
</script>

<style scoped>
.s-title { font-size: 46px; margin-top: 10px; }
.provs { display: flex; flex-direction: column; gap: 16px; margin-top: 44px; max-width: 940px; }
.prov { display: flex; align-items: center; gap: 16px; padding: 18px 22px; border-radius: 12px; background: var(--bg2); border: 1px solid var(--border); }
.prov-icon { color: var(--cyan); flex-shrink: 0; }
.prov:nth-child(even) .prov-icon { color: var(--coral); }
.prov-txt { font-family: 'Space Grotesk', sans-serif; font-size: 22px; line-height: 1.35; }
.foot { margin-top: 36px; display: flex; align-items: center; gap: 11px; font-size: 21px; color: var(--text2); }
.foot svg { color: var(--cyan); }
.foot b { color: var(--text); }

/* Ambient: 1 elemento vivo — o ícone da provocação ativa alterna o brilho. */
.deck-root.ambient-on .slide.active .prov:nth-child(1) .prov-icon { --amb-bright: 1.5; animation: amb-glow 4s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .prov:nth-child(2) .prov-icon { --amb-bright: 1.5; animation: amb-glow 4s ease-in-out infinite 1s; }
.deck-root.ambient-on .slide.active .prov:nth-child(3) .prov-icon { --amb-bright: 1.5; animation: amb-glow 4s ease-in-out infinite 2s; }
.deck-root.ambient-on .slide.active .prov:nth-child(4) .prov-icon { --amb-bright: 1.5; animation: amb-glow 4s ease-in-out infinite 3s; }
</style>
