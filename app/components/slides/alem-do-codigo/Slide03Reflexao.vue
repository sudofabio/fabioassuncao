<template>
  <!-- Slide 3 — Desenvolver ≠ digitar código · ⭐⭐⭐ (âncora) · Steps: 2
       ① risco corta "Escrever sintaxe"  ② "Resolver problemas reais" -->
  <DeckSlide ref="slideEl" :title="nota.title" :notes="nota.notes" background="deep">
    <div class="center">
      <p ref="oldRef" class="title old">
        Escrever sintaxe
        <span ref="strikeRef" class="strike" aria-hidden="true"></span>
      </p>

      <div ref="arrowRef" class="arrow" aria-hidden="true">
        <MoveDown :size="44" />
      </div>

      <p ref="newRef" class="title new">
        Resolver <span class="accent">problemas reais</span>
      </p>

      <p ref="footRef" class="foot">O código é apenas o meio. O fim é a solução.</p>
    </div>

    <!-- âncoras de step para a timeline GSAP -->
    <DeckStep :at="1" class="anchor"><span aria-hidden="true"></span></DeckStep>
    <DeckStep :at="2" class="anchor"><span aria-hidden="true"></span></DeckStep>
  </DeckSlide>
</template>

<script setup>
import { MoveDown } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[2]

const slideEl = ref(null)

const oldRef = ref(null)
const strikeRef = ref(null)
const arrowRef = ref(null)
const newRef = ref(null)
const footRef = ref(null)

useSlideTimeline((tl) => {
  // entrada: só a frase antiga aparece
  tl.fromTo(oldRef.value, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
  tl.addLabel('step-0')
  tl.addPause()
  // step 1: o risco corta a frase (no momento da fala "não é digitar código")
  tl.to(strikeRef.value, { scaleX: 1, duration: 0.45, ease: 'power2.inOut' })
  tl.to(oldRef.value, { opacity: 0.35, duration: 0.4, ease: 'power2.out' }, '<0.15')
  tl.addLabel('step-1')
  tl.addPause()
  // step 2: seta + frase nova + rodapé
  tl.fromTo(arrowRef.value, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
  tl.fromTo(newRef.value, { opacity: 0, y: 26, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }, '<0.1')
  tl.fromTo(footRef.value, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '<0.35')
  tl.addLabel('step-2')
}, slideEl)
</script>

<style scoped>
.center { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 26px; }
.old { position: relative; font-size: 64px; font-weight: 500; color: var(--text2); opacity: 0; }
.strike { position: absolute; left: -2%; right: -2%; top: 52%; height: 5px; background: var(--red); border-radius: 3px; transform: scaleX(0); transform-origin: left center; }
.arrow { color: var(--text2); opacity: 0; }
.new { font-size: 76px; opacity: 0; }
.accent { color: var(--coral); text-shadow: 0 0 26px color-mix(in srgb, var(--coral) 35%, transparent); }
.foot { font-size: 20px; color: var(--text2); margin-top: 22px; opacity: 0; }
.anchor { position: absolute; width: 0; height: 0; overflow: hidden; }

/* ambient: glow respirante no coral aceso; seta com bob vertical sutil.
   O GSAP entrega a seta em y=0 (transform base coincide) — amb-float é seguro. */
.deck-root.ambient-on .slide.active .accent { animation: amb-glow 4.5s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .arrow { --amb-y: -3px; animation: amb-float 4s ease-in-out infinite; }
</style>
