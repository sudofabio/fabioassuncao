<template>
  <!-- Slide 24 — Fundamentos permanecem · ⭐⭐⭐ · Steps: 2
       ① topo volátil (logos alternando — ciclo FINITO, req. 9) ② base sólida iluminada
       A base NUNCA anima (estabilidade é a mensagem). -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o alicerce do novo desenvolvedor</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Ferramentas mudam. Fundamentos permanecem.</DeckReveal>

    <div class="piramide">
      <DeckStep :at="1" class="topo">
        <div class="topo-shape">
          <div class="logo-cycle">
            <img
              v-for="(f, i) in LOGOS_FERRAMENTAS_PIRAMIDE"
              :key="f.nome"
              :src="f.logo"
              :alt="f.nome"
              class="cycle-logo"
              :class="{ last: i === LOGOS_FERRAMENTAS_PIRAMIDE.length - 1 }"
              :style="{ animationDelay: `${i * 1.4}s` }"
            />
          </div>
        </div>
        <span class="topo-label"><b>Ferramentas</b> — trocam a cada ciclo</span>
      </DeckStep>

      <DeckStep :at="2" class="base">
        <div class="base-shape">
          <div v-for="f in fundamentos" :key="f.nome" class="fund">
            <component :is="f.icon" :size="26" class="fund-icon" />
            <span>{{ f.nome }}</span>
          </div>
        </div>
        <span class="base-label"><b>Fundamentos</b> — sustentam qualquer onda</span>
      </DeckStep>
    </div>

    <DeckStep :at="2" :delay="0.5" class="foot">
      Aprenda os fundamentos <b>usando</b> as ferramentas — não use as ferramentas para <b>pular</b> os fundamentos.
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { Cpu, Landmark, Shield, Handshake } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { LOGOS_FERRAMENTAS_PIRAMIDE } from '~/data/presentations/alem-do-codigo/ferramentas'

const nota = NOTAS[23]

const fundamentos = [
  { icon: Cpu, nome: 'Lógica' },
  { icon: Landmark, nome: 'Arquitetura' },
  { icon: Shield, nome: 'Segurança' },
  { icon: Handshake, nome: 'Negócio' },
]
</script>

<style scoped>
.s-title { font-size: 42px; margin-top: 10px; }
.piramide { display: flex; flex-direction: column; align-items: center; margin-top: 36px; gap: 6px; }
.topo { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.topo-shape { width: 300px; height: 110px; clip-path: polygon(50% 0, 100% 100%, 0 100%); background: var(--bg2); border: 1px dashed var(--border); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 12px; }
.logo-cycle { position: relative; width: 46px; height: 46px; }
/* ciclo FINITO de logos: cada um aparece 1,4s e cede lugar; o último permanece.
   A animação só dispara quando o step revela o topo (.dstep.on). */
.cycle-logo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; }
.dstep.on .cycle-logo { animation: cameo 1.4s ease forwards; /* delay via style inline */ }
.dstep.on .cycle-logo.last { animation-name: cameo-final; }
@keyframes cameo { 0% { opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
@keyframes cameo-final { 0% { opacity: 0; } 15% { opacity: 1; } 100% { opacity: 1; } }
.topo-label { font-size: 14px; color: var(--text2); }
.topo-label b { color: var(--text); }
.base { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.base-shape { width: 640px; padding: 26px 40px; clip-path: polygon(7% 0, 93% 0, 100% 100%, 0 100%); background: linear-gradient(180deg, var(--bg2), #17304f); border: 1px solid var(--border); display: flex; justify-content: center; gap: 46px; box-shadow: 0 0 60px -18px rgba(55, 198, 244, 0.35); }
.fund { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }
.fund-icon { color: var(--cyan); }
.base-label { font-size: 14px; color: var(--text2); }
.base-label b { color: var(--cyan); }
.foot { margin-top: 30px; text-align: center; font-size: 18px; color: var(--text2); max-width: 860px; margin-left: auto; margin-right: auto; }
.foot b { color: var(--text); }
@media (prefers-reduced-motion: reduce) { .cycle-logo { animation: none; opacity: 0; } .cycle-logo.last { opacity: 1; } }
</style>
