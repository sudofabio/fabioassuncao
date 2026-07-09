<template>
  <!-- Slide 15 — Prompt cru vs Especificação · ⭐⭐⭐ · Steps: 4
       ① digita prompt cru ② saída caótica ③ digita spec ④ saída estruturada
       Fallback estático p/ PDF: export/reduced-motion saltam ao estado final. -->
  <DeckSlide ref="slideEl" :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">demo: o jeito errado e o jeito certo</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Prompt cru vs. Especificação</DeckReveal>

    <div class="terminals">
      <!-- lado A: prompt cru -->
      <DeckReveal :delay="0.3" class="term">
        <div class="term-bar">
          <i class="dot" style="background:#E85D4C"></i><i class="dot" style="background:#E8B44C"></i><i class="dot" style="background:#3ECF8E"></i>
          <span class="term-title mono">{{ PROMPT_CRU.titulo }}</span>
          <XCircle :size="15" class="term-mark bad" />
        </div>
        <div class="term-body mono">
          <p class="cmd-line">&gt; <span ref="typedCruRef"></span><span class="caret" :class="{ typing }" aria-hidden="true">▌</span></p>
          <div ref="outCruRef" class="out">
            <p v-for="r in PROMPT_CRU.resultado" :key="r" class="out-line bad-line">✗ {{ r }}</p>
            <p class="veredito bad-v">{{ PROMPT_CRU.veredito }}</p>
          </div>
        </div>
      </DeckReveal>

      <!-- lado B: especificação -->
      <DeckReveal :delay="0.4" class="term">
        <div class="term-bar">
          <i class="dot" style="background:#E85D4C"></i><i class="dot" style="background:#E8B44C"></i><i class="dot" style="background:#3ECF8E"></i>
          <span class="term-title mono">{{ SPEC_ESTRUTURADA.titulo }}</span>
          <CheckCircle2 :size="15" class="term-mark good" />
        </div>
        <div class="term-body mono">
          <div class="spec">
            <p v-for="(l, i) in SPEC_ESTRUTURADA.linhas" :key="l.chave" :ref="el => (specRefs[i] = el)" class="spec-line">
              <span class="spec-key">{{ l.chave }}:</span> {{ l.valor }}
            </p>
          </div>
          <div ref="outSpecRef" class="out">
            <p v-for="r in SPEC_ESTRUTURADA.resultado" :key="r" class="out-line good-line">✓ {{ r }}</p>
            <p class="veredito good-v">{{ SPEC_ESTRUTURADA.veredito }}</p>
            <p class="cmd-line">&gt; <span class="caret" aria-hidden="true">▌</span></p>
          </div>
        </div>
      </DeckReveal>
    </div>

    <DeckStep v-for="n in 4" :key="n" :at="n" class="anchor"><span aria-hidden="true"></span></DeckStep>
  </DeckSlide>
</template>

<script setup>
import { XCircle, CheckCircle2 } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { PROMPT_CRU, SPEC_ESTRUTURADA } from '~/data/presentations/alem-do-codigo/specDemo'

const nota = NOTAS[14]

const slideEl = ref(null)

const typedCruRef = ref(null)
const outCruRef = ref(null)
const outSpecRef = ref(null)
const specRefs = []

// Caret sólido enquanto o typewriter digita; volta a piscar (ambient) ao terminar.
const typing = ref(false)

useSlideTimeline((tl) => {
  tl.addLabel('step-0')
  // pausa deslocada de t=0: GSAP pula addPause exatamente na origem do play
  tl.addPause(0.01)
  // step 1: typewriter do prompt cru
  const texto = PROMPT_CRU.comando
  const typed = { n: 0 }
  tl.to(typed, {
    n: texto.length,
    duration: 1.1,
    ease: 'none',
    onStart() { typing.value = true },
    onUpdate() { if (typedCruRef.value) typedCruRef.value.textContent = texto.slice(0, Math.round(typed.n)) },
    onComplete() { typing.value = false },
  })
  tl.addLabel('step-1')
  tl.addPause()
  // step 2: saída caótica
  tl.fromTo(outCruRef.value.children, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.14, ease: 'power2.out' })
  tl.addLabel('step-2')
  tl.addPause()
  // step 3: a spec surge linha a linha (blocos organizados)
  tl.fromTo(specRefs, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.28, stagger: 0.12, ease: 'power2.out' })
  tl.addLabel('step-3')
  tl.addPause()
  // step 4: saída estruturada
  tl.fromTo(outSpecRef.value.children, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.14, ease: 'power2.out' })
  tl.addLabel('step-4')
}, slideEl)
</script>

<style scoped>
.s-title { font-size: 42px; margin-top: 8px; }
.terminals { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; margin-top: 34px; }
/* Terminais são escuros nos dois temas (decisão de design): as vars são
   re-pinadas aos valores dark neste escopo, valendo para todo o conteúdo. */
.term { --bg2: #122036; --text: #F2F5F9; --text2: #8FA3BF; --border: #233650;
  --cyan: #37C6F4; --coral: #F2762E; --green: #3ECF8E; --red: #E85D4C;
  border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--terminal-bg, #0A1220); }
.term-bar { display: flex; align-items: center; gap: 7px; padding: 10px 14px; background: var(--bg2); border-bottom: 1px solid var(--border); }
.dot { width: 11px; height: 11px; border-radius: 50%; display: block; }
.term-title { margin-left: 10px; font-size: 12.5px; letter-spacing: 0.12em; color: var(--text2); }
.term-mark { margin-left: auto; }
.term-mark.bad { color: var(--red); }
.term-mark.good { color: var(--green); }
.term-body { padding: 18px 20px; font-size: 14px; min-height: 330px; display: flex; flex-direction: column; gap: 14px; }
.cmd-line { color: var(--text); }
.caret { color: var(--cyan); }
.out { display: flex; flex-direction: column; gap: 8px; }
.out-line { opacity: 0; font-size: 13.5px; }
.bad-line { color: var(--red); }
.good-line { color: var(--green); }
.veredito { opacity: 0; margin-top: 10px; font-size: 14px; font-weight: 700; }
.bad-v { color: var(--red); }
.good-v { color: var(--green); }
.spec { display: flex; flex-direction: column; gap: 6px; }
.spec-line { opacity: 0; font-size: 13px; color: var(--text); }
.spec-key { color: var(--cyan); }
.anchor { position: absolute; width: 0; height: 0; overflow: hidden; }

/* Ambient: carets piscando nos dois terminais (estado base = sólido p/ export). */
.deck-root.ambient-on .slide.active .caret { animation: amb-blink 1.1s linear infinite; }
/* Enquanto o typewriter digita, o caret do prompt cru fica sólido (terminal real). */
.deck-root.ambient-on .slide.active .caret.typing { animation: none; }
</style>
