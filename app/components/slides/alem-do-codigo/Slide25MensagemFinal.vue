<template>
  <!-- Slide 25 — Mensagem final · ⭐⭐⭐ · Steps: 1
       Frase palavra a palavra (GSAP); últimas 2 palavras com pausa maior.
       Retoma o motivo visual da capa (fechamento de ciclo). -->
  <DeckSlide ref="slideEl" :title="nota.title" :notes="nota.notes" background="deep">
    <!-- eco da malha da capa -->
    <svg class="mesh" viewBox="0 0 1280 720" aria-hidden="true">
      <g class="mesh-lines" stroke-width="1" fill="none">
        <path d="M80 640 h180 v-120 h220 v-80 h160" />
        <path d="M1200 90 h-160 v100 h-200 v90 h-140" />
      </g>
      <g class="mesh-dots">
        <circle cx="260" cy="640" r="4" /><circle cx="480" cy="520" r="4" />
        <circle cx="1040" cy="90" r="4" /><circle cx="840" cy="190" r="4" />
      </g>
    </svg>

    <div class="center">
      <p class="frase title">
        <span
          v-for="(w, i) in palavras"
          :key="i"
          :ref="el => (wordRefs[i] = el)"
          class="word"
          :class="{ governa: i >= palavras.length - 3 }"
        >{{ w }}&nbsp;</span>
      </p>
    </div>

    <DeckStep :at="1" class="anchor"><span aria-hidden="true"></span></DeckStep>
  </DeckSlide>
</template>

<script setup>
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[24]

const slideEl = ref(null)

// Frase escolhida na produção (opção 2 do documento mestre — máx. impacto)
const palavras = 'Não lute contra a IA. Torne-se a mente que a governa.'.split(' ')
const wordRefs = []

useSlideTimeline((tl) => {
  tl.addLabel('step-0')
  // pausa deslocada de t=0: GSAP pula addPause exatamente na origem do play
  tl.addPause(0.01)
  // palavra a palavra; pausa maior antes das últimas palavras
  const iniciais = wordRefs.slice(0, palavras.length - 3)
  const finais = wordRefs.slice(palavras.length - 3)
  tl.fromTo(iniciais, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.22, ease: 'power2.out' })
  tl.fromTo(finais, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.5, ease: 'power3.out' }, '+=0.55')
  tl.addLabel('step-1')
}, slideEl)
</script>

<style scoped>
.mesh { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.06; }
.mesh-lines { stroke: var(--cyan); }
.mesh-dots { fill: var(--cyan); }
.center { position: relative; height: 100%; display: flex; align-items: center; justify-content: center; padding: 0 120px; }
.frase { font-size: 66px; line-height: 1.28; text-align: center; max-width: 1000px; }
.word { display: inline-block; opacity: 0; }
.governa { color: var(--coral); text-shadow: 0 0 30px color-mix(in srgb, var(--coral) 40%, transparent); }
.anchor { position: absolute; width: 0; height: 0; overflow: hidden; }

/* ---- ambient (só no slide ativo, ambient ON) ---- */
/* pulso escalonado dos pontos da malha (eco da capa) */
.deck-root.ambient-on .slide.active .mesh-dots circle { animation: amb-pulse 6s ease-in-out infinite; --amb-o1: 1; --amb-o2: .35; }
.deck-root.ambient-on .slide.active .mesh-dots circle:nth-child(2) { animation-delay: 1.5s; }
.deck-root.ambient-on .slide.active .mesh-dots circle:nth-child(3) { animation-delay: 3s; }
.deck-root.ambient-on .slide.active .mesh-dots circle:nth-child(4) { animation-delay: 4.5s; }
/* glow respirante nas palavras coral do fecho — filter não conflita com opacity/y inline do GSAP;
   delays escalonados entre as 3 palavras (que / a / governa). */
.deck-root.ambient-on .slide.active .word.governa { animation: amb-glow 5s ease-in-out infinite; --amb-bright: 1.4; }
.deck-root.ambient-on .slide.active .word.governa:nth-last-of-type(2) { animation-delay: .5s; }
.deck-root.ambient-on .slide.active .word.governa:nth-last-of-type(1) { animation-delay: 1s; }
</style>
