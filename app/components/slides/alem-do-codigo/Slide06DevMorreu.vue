<template>
  <!-- Slide 6 — "O desenvolvimento morreu" (de novo) · ⭐⭐ · Steps: 2
       ① lápides/carimbos com stagger  ② frase-síntese -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">já decretaram a nossa morte várias vezes</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">"Dessa vez o dev acabou" — de novo</DeckReveal>

    <div class="graves">
      <DeckStep
        v-for="(g, i) in lapides"
        :key="g"
        :at="1"
        :delay="0.12 * i"
        variant="sc"
      >
        <div class="grave" :style="{ transform: `rotate(${[-6, 4, -3, 5, -5][i]}deg)` }">
          <span class="rip mono">R.I.P.</span>
          <b class="grave-name">{{ g }}</b>
          <span class="stamp mono">MORTO?</span>
        </div>
      </DeckStep>
    </div>

    <DeckStep :at="2" class="synth">
      <p class="title synth-text">
        A tecnologia não elimina a profissão.<br />
        Ela <span class="kw kw-cyan kw-live" style="--kd: .3s">eleva o nível de abstração</span>.
      </p>
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[5]

const lapides = ['Low-code', 'No-code', 'CMS', 'Website builders', 'Frameworks']
</script>

<style scoped>
.s-title { font-size: 44px; margin-top: 10px; }
.graves { display: flex; gap: 22px; justify-content: center; margin-top: 56px; }
.grave { position: relative; width: 190px; padding: 30px 18px 22px; text-align: center; background: var(--bg2); border: 1px solid var(--border); border-radius: 60px 60px 10px 10px; }
.rip { display: block; font-size: 13px; letter-spacing: 0.3em; color: var(--text2); }
.grave-name { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 19px; margin-top: 10px; }
.stamp { position: absolute; top: 8px; right: -14px; padding: 3px 10px; border: 2px solid var(--red); color: var(--red); font-size: 11px; letter-spacing: 0.12em; border-radius: 4px; transform: rotate(12deg); background: color-mix(in srgb, var(--red) 8%, transparent); }
.synth { margin-top: 64px; text-align: center; }
.synth-text { font-size: 36px; line-height: 1.3; font-weight: 500; }
</style>
