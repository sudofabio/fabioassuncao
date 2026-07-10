<template>
  <!-- Slide 11 — Protótipo ≠ Produto · ⭐⭐⭐ (âncora) · Steps: 3
       ① topo "FUNCIONA"  ② mergulho: itens submersos  ③ frase final -->
  <DeckSlide ref="slideEl" :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">protótipo ≠ produto</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Funcionar não é o mesmo que estar pronto</DeckReveal>

    <div ref="sceneRef" class="scene">
      <!-- oceano: camada de água abaixo da linha d'água (ondas + bolhas via ambient) -->
      <div class="ocean" aria-hidden="true">
        <svg class="waves" viewBox="0 0 1280 24" preserveAspectRatio="none">
          <path class="wave" d="M0,12 Q40,3 80,12 T160,12 T240,12 T320,12 T400,12 T480,12 T560,12 T640,12 T720,12 T800,12 T880,12 T960,12 T1040,12 T1120,12 T1200,12 T1280,12 V24 H0 Z" />
        </svg>
        <span v-for="b in 6" :key="b" class="bubble" :class="`b${b}`"></span>
      </div>

      <!-- iceberg SVG autoral -->
      <svg class="berg" viewBox="0 0 420 460" aria-hidden="true">
        <polygon ref="topRef" class="berg-top" points="210,10 300,150 120,150" opacity="0" />
        <polygon ref="bodyRef" class="berg-body" points="120,150 300,150 356,320 210,450 64,320" opacity="0" />
        <line class="berg-water" x1="0" y1="150" x2="420" y2="150" stroke-width="2" stroke-dasharray="8 8" opacity="0.6" />
      </svg>

      <div ref="funcionaRef" class="funciona">
        <b class="mono">FUNCIONA</b>
        <span>interface · features · demo</span>
      </div>

      <span class="waterline mono">linha d'água</span>

      <div class="submerso">
        <div
          v-for="(item, i) in pilares"
          :key="item.nome"
          :ref="el => (itemRefs[i] = el)"
          class="pilar deck-card"
          :style="{ left: item.x, top: item.y }"
        >
          <component :is="item.icon" :size="22" class="pilar-icon" />
          <span>{{ item.nome }}</span>
        </div>
      </div>
    </div>

    <p ref="footRef" class="foot">
      Empresas pagam por <b>produtos</b>, não por protótipos.
    </p>

    <DeckStep v-for="n in 3" :key="n" :at="n" class="anchor"><span aria-hidden="true"></span></DeckStep>
  </DeckSlide>
</template>

<script setup>
import { ShieldCheck, Scaling, Gauge, Wrench, Accessibility, RefreshCcw } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[10]

const slideEl = ref(null)

// máx. 6 itens submersos (GRAFICOS §7)
const pilares = [
  { icon: ShieldCheck, nome: 'Segurança', x: '2%', y: '14%' },
  { icon: Scaling, nome: 'Escalabilidade', x: '66%', y: '10%' },
  { icon: Gauge, nome: 'Performance', x: '0%', y: '48%' },
  { icon: Wrench, nome: 'Manutenção', x: '70%', y: '46%' },
  { icon: Accessibility, nome: 'Acessibilidade', x: '6%', y: '82%' },
  { icon: RefreshCcw, nome: 'Evolução', x: '64%', y: '82%' },
]

const sceneRef = ref(null)
const topRef = ref(null)
const bodyRef = ref(null)
const funcionaRef = ref(null)
const footRef = ref(null)
// refs dos itens submersos (array simples — usado só na timeline, pós-mount)
const itemRefs = []

useSlideTimeline((tl) => {
  // entrada: cena vazia (só o eixo/linha d'água via SVG estático)
  tl.addLabel('step-0')
  // pausa deslocada de t=0: GSAP pula addPause exatamente na origem do play
  tl.addPause(0.01)
  // step 1: a ponta visível — "FUNCIONA"
  tl.to(topRef.value, { opacity: 1, duration: 0.5, ease: 'power2.out' })
  tl.fromTo(funcionaRef.value, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '<0.2')
  tl.addLabel('step-1')
  tl.addPause()
  // step 2: mergulho — a câmera desce e a base submersa aparece
  tl.to(sceneRef.value, { y: -26, duration: 0.7, ease: 'power2.inOut' })
  tl.to(bodyRef.value, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '<0.2')
  tl.fromTo(
    itemRefs,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.12 },
    '<0.25'
  )
  tl.addLabel('step-2')
  tl.addPause()
  // step 3: frase que fecha o argumento
  tl.fromTo(footRef.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
  tl.addLabel('step-3')
}, slideEl)
</script>

<style scoped>
.s-title { font-size: 42px; margin-top: 8px; }
.scene { position: relative; width: 640px; height: 400px; margin: 42px auto 0; }
.ocean { position: absolute; left: 50%; top: 130px; transform: translateX(-50%); width: 640px; height: 270px; overflow: hidden; z-index: 0; border-radius: 0 0 10px 10px; background: linear-gradient(180deg, color-mix(in srgb, var(--cyan) 9%, transparent) 0%, color-mix(in srgb, var(--navy-soft) 20%, transparent) 55%, color-mix(in srgb, var(--navy-soft) 32%, transparent) 100%); }
.waves { position: absolute; top: -7px; left: 0; width: 200%; height: 20px; }
.wave { fill: color-mix(in srgb, var(--cyan) 14%, transparent); stroke: color-mix(in srgb, var(--cyan) 38%, transparent); stroke-width: 1.5; }
.bubble { position: absolute; border-radius: 50%; background: color-mix(in srgb, var(--cyan) 30%, transparent); border: 1px solid color-mix(in srgb, var(--cyan) 45%, transparent); opacity: 0; width: 6px; height: 6px; }
.b1 { left: 16%; bottom: 8%; } .b2 { left: 38%; bottom: 3%; width: 4px; height: 4px; } .b3 { left: 72%; bottom: 12%; } .b4 { left: 86%; bottom: 5%; width: 5px; height: 5px; } .b5 { left: 56%; bottom: 18%; width: 4px; height: 4px; } .b6 { left: 28%; bottom: 22%; width: 5px; height: 5px; }
.berg { position: absolute; left: 50%; top: 0; transform: translateX(-50%); height: 100%; z-index: 1; }
.berg-top { fill: var(--text); }
.berg-body { fill: var(--navy-soft); }
.berg-water { stroke: var(--cyan); }
.funciona { position: absolute; left: 50%; top: 30px; transform: translateX(-50%); text-align: center; display: flex; flex-direction: column; gap: 4px; opacity: 0; z-index: 2; }
.funciona b { font-size: 20px; letter-spacing: 0.2em; color: var(--bg); background: var(--text); padding: 4px 14px; border-radius: 6px; }
.funciona span { font-size: 13.5px; color: var(--text2); }
.waterline { position: absolute; right: -20px; top: 128px; font-size: 11.5px; color: var(--cyan); opacity: 0.7; z-index: 2; }
.submerso { position: absolute; left: 50%; top: 150px; transform: translateX(-50%); width: 640px; height: 260px; z-index: 2; }
.pilar { position: absolute; display: flex; align-items: center; gap: 10px; padding: 10px 16px; font-size: 15px; font-weight: 600; opacity: 0; }
.pilar-icon { color: var(--cyan); }
.foot { text-align: center; font-size: 20px; color: var(--text2); margin-top: 18px; opacity: 0; }
.foot b { color: var(--coral); }
.anchor { position: absolute; width: 0; height: 0; overflow: hidden; }

/* ambient: o iceberg flutua suavemente. O GSAP move a .scene (pai), nunca o
   .berg — mas o .berg tem transform próprio (translateX(-50%)); por isso os
   keyframes o preservam em todos os frames (amb-float sobrescreveria o centro).
   A linha d'água (tracejado 8 8, período 16) corre com amb-dash: -64 é múltiplo
   do período → loop perfeito. */
@keyframes berg-float { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-4px); } }
.deck-root.ambient-on .slide.active .berg { animation: berg-float 7s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .berg-water { animation: amb-dash 6s linear infinite; }
/* ondas na superfície escorrem; bolhas sobem na zona submersa (loop só no gate). */
@keyframes wave-drift { to { transform: translateX(-50%); } }
.deck-root.ambient-on .slide.active .waves { animation: wave-drift 8s linear infinite; }
@keyframes bubble-rise { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 0.7; } 90% { opacity: 0.2; } 100% { transform: translateY(-190px); opacity: 0; } }
.deck-root.ambient-on .slide.active .bubble { animation: bubble-rise 7s ease-in infinite; }
.deck-root.ambient-on .slide.active .b2 { animation-delay: 1.2s; }
.deck-root.ambient-on .slide.active .b3 { animation-delay: 2.4s; }
.deck-root.ambient-on .slide.active .b4 { animation-delay: 3.6s; }
.deck-root.ambient-on .slide.active .b5 { animation-delay: 4.8s; }
.deck-root.ambient-on .slide.active .b6 { animation-delay: 5.6s; }
</style>
