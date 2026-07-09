<template>
  <!-- Slide 13 — TDD → SDD · ⭐⭐⭐ CLÍMAX DA PALESTRA (âncora) · Steps: 2
       ① morph tipográfico TDD→SDD  ② badge "#1 skill 2026" + frases -->
  <DeckSlide ref="slideEl" :title="nota.title" :notes="nota.notes" background="deep">
    <div class="center">
      <div class="morph title" aria-hidden="false">
        <span class="letter-box">
          <span ref="tRef" class="letter t-letter">T</span>
          <span ref="sRef" class="letter s-letter">S</span>
        </span><span class="letter">DD</span>
      </div>

      <p ref="nameRef" class="sdd-name">
        <b>Spec-Driven Development</b> — a habilidade <span class="hash mono">#1</span> para devs em 2026
      </p>

      <p ref="lineRef" class="line">
        No TDD, o teste guia o código.<br />
        No SDD, <span class="accent">a especificação é o motor da implementação</span>.
      </p>

      <div ref="badgeRef" class="badge mono">★ #1 skill de 2026</div>
    </div>

    <DeckStep :at="1" class="anchor"><span aria-hidden="true"></span></DeckStep>
    <DeckStep :at="2" class="anchor"><span aria-hidden="true"></span></DeckStep>
  </DeckSlide>
</template>

<script setup>
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[12]

const slideEl = ref(null)

const tRef = ref(null)
const sRef = ref(null)
const nameRef = ref(null)
const lineRef = ref(null)
const badgeRef = ref(null)

useSlideTimeline((tl) => {
  // entrada: "TDD" em cinza, quieto no centro
  tl.addLabel('step-0')
  // pausa deslocada de t=0: GSAP pula addPause exatamente na origem do play
  tl.addPause(0.01)
  // step 1: O MOMENTO — o T cede lugar ao S (morph), SDD acende em coral
  tl.to(tRef.value, { opacity: 0, y: -70, rotateX: 80, duration: 0.5, ease: 'power3.in' })
  tl.fromTo(
    sRef.value,
    { opacity: 0, y: 70, rotateX: -80 },
    { opacity: 1, y: 0, rotateX: 0, duration: 0.55, ease: 'power3.out' },
    '<0.32'
  )
  tl.to('.morph .letter', { color: '#F2762E', textShadow: '0 0 44px rgba(242,118,46,.45)', duration: 0.6, ease: 'power2.out' }, '<0.1')
  tl.addLabel('step-1')
  tl.addPause()
  // step 2: badge + frases de apoio
  tl.fromTo(badgeRef.value, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' })
  tl.fromTo(nameRef.value, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '<0.15')
  tl.fromTo(lineRef.value, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '<0.2')
  tl.addLabel('step-2')
}, slideEl)
</script>

<style scoped>
.center { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.morph { font-size: 150px; font-weight: 700; letter-spacing: 0.02em; color: var(--text2); display: flex; align-items: baseline; perspective: 700px; }
.letter { display: inline-block; }
.letter-box { position: relative; display: inline-block; }
.s-letter { position: absolute; left: 0; top: 0; opacity: 0; }
.sdd-name { margin-top: 26px; font-size: 24px; color: var(--text2); opacity: 0; }
.sdd-name b { color: var(--text); font-family: 'Space Grotesk', sans-serif; }
.hash { color: var(--coral); }
.line { margin-top: 22px; font-size: 20px; line-height: 1.55; color: var(--text2); opacity: 0; }
.accent { color: var(--coral); font-weight: 600; }
.badge { position: absolute; top: 90px; right: 130px; padding: 8px 18px; border: 1.5px solid var(--coral); color: var(--coral); border-radius: 40px; font-size: 14px; letter-spacing: 0.08em; transform: rotate(6deg); opacity: 0; background: rgba(242, 118, 46, 0.07); }
.anchor { position: absolute; width: 0; height: 0; overflow: hidden; }
</style>
