<template>
  <!-- Slide 11 — Protótipo ≠ Produto · ⭐⭐⭐ (âncora) · Steps: 3
       ① topo "FUNCIONA"  ② mergulho: itens submersos  ③ frase final -->
  <DeckSlide ref="slideEl" :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">protótipo ≠ produto</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Funcionar não é o mesmo que estar pronto</DeckReveal>

    <div ref="sceneRef" class="scene">
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
      Empresas pagam por <b>produtos</b> — não por protótipos.
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
.berg { position: absolute; left: 50%; top: 0; transform: translateX(-50%); height: 100%; }
.berg-top { fill: var(--text); }
.berg-body { fill: var(--navy-soft); }
.berg-water { stroke: var(--cyan); }
.funciona { position: absolute; left: 50%; top: 30px; transform: translateX(-50%); text-align: center; display: flex; flex-direction: column; gap: 4px; opacity: 0; }
.funciona b { font-size: 20px; letter-spacing: 0.2em; color: var(--bg); background: var(--text); padding: 4px 14px; border-radius: 6px; }
.funciona span { font-size: 13.5px; color: var(--text2); }
.waterline { position: absolute; right: -20px; top: 128px; font-size: 11.5px; color: var(--cyan); opacity: 0.7; }
.submerso { position: absolute; left: 50%; top: 150px; transform: translateX(-50%); width: 640px; height: 260px; }
.pilar { position: absolute; display: flex; align-items: center; gap: 10px; padding: 10px 16px; font-size: 15px; font-weight: 600; opacity: 0; }
.pilar-icon { color: var(--cyan); }
.foot { text-align: center; font-size: 20px; color: var(--text2); margin-top: 18px; opacity: 0; }
.foot b { color: var(--coral); }
.anchor { position: absolute; width: 0; height: 0; overflow: hidden; }
</style>
