<template>
  <!-- Slide 23 — O novo desenvolvedor · ⭐⭐⭐ · Steps: 2
       ① perfil "digitador" ② transformação → "arquiteto" (tom de PROMOÇÃO) -->
  <DeckSlide :title="nota.title" :notes="nota.notes" :effect="{ type: 'flow', accent: 'mix', opacity: 0.35 }">
    <DeckReveal :delay="0.05" class="eyebrow">juntando tudo</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">O novo desenvolvedor não é quem digita mais rápido</DeckReveal>

    <div class="perfis">
      <DeckStep :at="1" class="perfil deck-card antes">
        <Keyboard :size="34" class="p-icon" />
        <b class="p-title">O digitador de código</b>
        <ul>
          <li>escreve sintaxe</li>
          <li>executa tarefas isoladas</li>
          <li>faz "o básico" genérico</li>
        </ul>
      </DeckStep>

      <DeckStep :at="2" class="transform" aria-hidden="true">
        <MoveRight :size="40" />
        <span class="mono">promoção</span>
      </DeckStep>

      <DeckStep :at="2" class="perfil deck-card depois">
        <DraftingCompass :size="34" class="p-icon coral" />
        <b class="p-title">O arquiteto de soluções</b>
        <ul>
          <li>entende o <b>problema</b> e o contexto</li>
          <li>escreve <b>especificações</b> precisas</li>
          <li>domina arquitetura e <b>segurança</b></li>
          <li>conecta produto e <b>negócio</b></li>
          <li>usa IA como <b>multiplicador</b></li>
        </ul>
      </DeckStep>
    </div>

    <DeckStep :at="2" :delay="0.5" class="foot">
      A IA reduz a barreira de entrada <b>e</b> aumenta a exigência de maturidade, ao mesmo tempo.
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { Keyboard, DraftingCompass, MoveRight } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[22]
</script>

<style scoped>
.s-title { font-size: 40px; margin-top: 10px; }
.perfis { display: grid; grid-template-columns: 1fr auto 1.25fr; gap: 26px; margin-top: 44px; align-items: center; }
.perfil { padding: 28px 26px; display: flex; flex-direction: column; gap: 12px; }
.antes { opacity: 0.9; }
.antes .p-title { color: var(--text2); }
.depois { border-color: color-mix(in srgb, var(--coral) 45%, transparent); box-shadow: 0 0 40px -18px color-mix(in srgb, var(--coral) 50%, transparent); }
/* card-destino respira um glow coral suave (brightness sobe leve — inclui o box-shadow) */
.deck-root.ambient-on .slide.active .depois { animation: amb-glow 6s ease-in-out infinite; --amb-bright: 1.12; }
.p-icon { color: var(--text2); }
.p-icon.coral { color: var(--coral); }
.p-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; }
.perfil ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.perfil li { font-size: 15.5px; color: var(--text2); padding-left: 16px; position: relative; }
.perfil li::before { content: ''; position: absolute; left: 0; top: 9px; width: 6px; height: 6px; border-radius: 50%; background: var(--border); }
.depois li::before { background: var(--coral); }
.depois li b { color: var(--text); }
.transform { display: flex; flex-direction: column; align-items: center; gap: 6px; color: var(--coral); }
.transform .mono { font-size: 11.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text2); }
/* seta MoveRight ganha um nudge horizontal sutil, apontando para o card-destino */
.deck-root.ambient-on .slide.active .transform svg { animation: arrow-nudge 2.8s ease-in-out infinite; }
@keyframes arrow-nudge { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
.foot { margin-top: 38px; text-align: center; font-size: 18.5px; color: var(--text2); }
.foot b { color: var(--coral); }
</style>
