<template>
  <!-- Slide 8 — Código virou commodity · ⭐⭐⭐ (âncora, momento wow) · Steps: 2
       ① frase de impacto (reveal tipográfico)  ② US$ 20/mês (CountUp) -->
  <DeckSlide ref="slideEl" :title="nota.title" :notes="nota.notes" background="deep">
    <!-- chuva de código estática, perdendo opacidade (sem loop) -->
    <div class="coderain mono" aria-hidden="true">
      <span v-for="(l, i) in rain" :key="i" class="rain-line" :style="{ left: `${6 + i * 12}%`, top: `${(i % 3) * 26 + 4}%`, opacity: 0.05 + (i % 3) * 0.015 }">{{ l }}</span>
    </div>

    <div class="center">
      <p ref="phraseRef" class="title phrase">
        CÓDIGO VIROU<br /><span ref="kwRef" class="commodity">COMMODITY</span>
      </p>

      <p ref="supportRef" class="lead support">
        Gerar código deixou de ser a parte difícil.<br />
        <b class="support-b">Garantir qualidade, nunca foi tão importante.</b>
      </p>

      <div ref="priceRef" class="price">
        <span class="price-label mono">assinatura a partir de</span>
        <span class="price-value mono">US$ <DeckCounter :to="20" :at="2" :duration="1200" /><span class="price-per">/mês</span></span>
      </div>
    </div>

    <DeckStep :at="1" class="anchor"><span aria-hidden="true"></span></DeckStep>
    <DeckStep :at="2" class="anchor"><span aria-hidden="true"></span></DeckStep>
  </DeckSlide>
</template>

<script setup>
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[7]

const slideEl = ref(null)

const rain = [
  'const app = await ai.generate()',
  'function deploy() { /* ... */ }',
  'SELECT * FROM users;',
  'npm install anything',
  'git commit -m "feat"',
  'export default defineApp()',
  'if (bug) retry()',
]

const phraseRef = ref(null)
const kwRef = ref(null)
const supportRef = ref(null)
const priceRef = ref(null)

useSlideTimeline((tl) => {
  tl.addLabel('step-0')
  // pausa deslocada de t=0: GSAP pula addPause exatamente na origem do play
  tl.addPause(0.01)
  // step 1: frase gigante com reveal tipográfico forte
  tl.fromTo(phraseRef.value, { opacity: 0, y: 40, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power4.out' })
  tl.fromTo(kwRef.value, { filter: 'brightness(0.4)' }, { filter: 'brightness(1)', duration: 0.5, ease: 'power2.out' }, '<0.25')
  tl.fromTo(supportRef.value, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '<0.3')
  tl.addLabel('step-1')
  tl.addPause()
  // step 2: preço simbólico (o CountUp dispara pelo próprio step)
  tl.fromTo(priceRef.value, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)' })
  tl.addLabel('step-2')
}, slideEl)
</script>

<style scoped>
.coderain { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.rain-line { position: absolute; font-size: 13px; color: var(--cyan); white-space: nowrap; transform: rotate(90deg); transform-origin: left top; }
.center { position: relative; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.phrase { font-size: 88px; line-height: 1.04; letter-spacing: -0.01em; opacity: 0; }
.commodity { color: var(--cyan); text-shadow: 0 0 34px rgba(55, 198, 244, 0.4); }
.support { margin-top: 30px; font-size: 21px; opacity: 0; }
.support-b { color: var(--text); font-weight: 600; }
.price { margin-top: 40px; display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: 0; }
.price-label { font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text2); }
.price-value { font-size: 54px; font-weight: 500; color: var(--coral); white-space: nowrap; }
.price-per { font-size: 22px; color: var(--text2); }
.anchor { position: absolute; width: 0; height: 0; overflow: hidden; }
</style>
