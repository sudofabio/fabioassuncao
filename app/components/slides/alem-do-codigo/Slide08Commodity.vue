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
        <span class="price-label mono">o custo de gerar código, por mês</span>
        <div class="tiers">
          <div v-for="t in TIERS" :key="t.nome" class="tier" :class="{ hot: t.hot }">
            <span class="tier-nome mono">{{ t.nome }}</span>
            <span class="tier-brl">≈ R$ {{ t.brl }}</span>
            <span class="tier-usd mono">US$ {{ t.usd }}</span>
          </div>
        </div>
        <span class="price-note mono">valores aproximados · variam com câmbio, impostos e plano · US$ 1 ≈ R$ 5,14</span>
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

// Faixa de planos (genéricos). US$ reais → R$ à cotação ~5,14 (aproximado).
const TIERS = [
  { nome: 'básico', usd: '20', brl: '103' },
  { nome: 'profissional', usd: '100', brl: '514' },
  { nome: 'intensivo', usd: '200', brl: '1.028', hot: true },
]

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
.commodity { color: var(--cyan); text-shadow: 0 0 34px color-mix(in srgb, var(--cyan) 40%, transparent); }
.support { margin-top: 30px; font-size: 21px; opacity: 0; }
.support-b { color: var(--text); font-weight: 600; }
.price { margin-top: 34px; display: flex; flex-direction: column; align-items: center; gap: 12px; opacity: 0; }
.price-label { font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text2); }
.tiers { display: flex; align-items: stretch; gap: 14px; }
.tier { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 12px 22px; border-radius: 12px; border: 1px solid var(--border); background: color-mix(in srgb, var(--bg2) 60%, transparent); }
.tier.hot { border-color: color-mix(in srgb, var(--coral) 45%, var(--border)); background: color-mix(in srgb, var(--coral) 8%, transparent); }
.tier-nome { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text2); }
.tier-brl { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 26px; color: var(--coral); white-space: nowrap; }
.tier-usd { font-size: 12.5px; color: var(--text2); }
.price-note { font-size: 11px; color: var(--text2); opacity: 0.8; }
.anchor { position: absolute; width: 0; height: 0; overflow: hidden; }

/* ambient: chuva de código estilo Matrix — as linhas (rotacionadas 90deg)
   deslizam devagar em velocidades diferentes. Os keyframes MANTÊM o rotate(90deg)
   em todos os frames; `alternate` faz o deslocamento retornar sem salto.
   Glow respirante no "COMMODITY" (o GSAP entrega brightness(1); baseline coincide). */
@keyframes rain-drift { to { transform: rotate(90deg) translateX(-34px); } }
.deck-root.ambient-on .slide.active .rain-line { animation: rain-drift 22s ease-in-out infinite alternate; }
.deck-root.ambient-on .slide.active .rain-line:nth-child(2n) { animation-duration: 27s; }
.deck-root.ambient-on .slide.active .rain-line:nth-child(3n) { animation-duration: 31s; }
.deck-root.ambient-on .slide.active .commodity { --amb-bright: 1.4; animation: amb-glow 5s ease-in-out infinite; }
</style>
