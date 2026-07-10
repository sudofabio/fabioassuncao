<template>
  <!-- Slide 19 — Onde o novo desenvolvedor trabalha · ⭐⭐ · Steps: 3
       ① donut ② callouts + sparkline ③ "De Santa Inês para o mundo" -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">panorama nacional · presencial, híbrido e remoto</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Onde o novo desenvolvedor trabalha</DeckReveal>

    <div class="row">
      <div class="donut-col">
        <DeckReveal :delay="0.28" class="scope mono"><MapPin :size="13" /> Brasil · 17.046 devs</DeckReveal>
        <DeckChart :option="donutOption" :width="430" :height="330" :at="1" />
        <!-- sparkline discreto: tendência de queda do remoto 75% → 60% -->
        <DeckStep :at="2" class="spark-wrap">
          <TrendingDown :size="16" class="spark-icon" />
          <svg viewBox="0 0 200 44" class="spark" aria-hidden="true">
            <polyline
              :points="sparkPoints"
              fill="none"
              stroke="var(--cyan)"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
          <span class="spark-label">remoto em queda: 75% (2022) → 60% (2026)</span>
        </DeckStep>
      </div>

      <div class="side">
        <div class="modelos">
          <DeckStep v-for="(m, i) in MODELOS_2026" :key="m.nome" :at="1" :delay="0.4 + 0.12 * i" class="modelo">
            <component :is="[Home, Shuffle, Building][i]" :size="20" :style="{ color: corDe(m.cor) }" />
            <span class="modelo-nome">{{ m.nome }}</span>
            <b class="modelo-valor mono" :style="{ color: corDe(m.cor) }"><DeckCounter :to="m.valor" :decimals="1" suffix="%" :at="1" :delay="400 + 120 * i" :duration="1100" /></b>
          </DeckStep>
        </div>

        <DeckStep :at="2" class="callout deck-card">
          <DoorOpen :size="18" class="c-red" />
          <span><b><DeckCounter :to="CALLOUTS_TRABALHO.pressaoRetorno" :decimals="1" suffix="%" :at="2" /></b> sentem pressão para voltar ao escritório</span>
        </DeckStep>
        <DeckStep :at="2" :delay="0.15" class="callout deck-card">
          <Rocket :size="18" class="c-green" />
          <span><b><DeckCounter :to="CALLOUTS_TRABALHO.produtividadeRemoto" :decimals="1" suffix="%" :at="2" /></b> se dizem mais produtivos no remoto</span>
        </DeckStep>

        <DeckStep :at="3" class="mundo">
          <span class="mundo-kicker mono">o remoto derrubou a fronteira geográfica</span>
          <p class="mundo-frase title"><Globe :size="26" class="mundo-globe" /> De <span class="kw kw-coral kw-live" style="--kd: .3s">Santa Inês</span> para o mundo</p>
          <p class="mundo-apoio">No Brasil, <b><DeckCounter :to="CALLOUTS_TRABALHO.atuamExterior" :decimals="0" suffix="%" :at="3" /></b> dos devs já trabalham para o exterior e <b><DeckCounter :to="CALLOUTS_TRABALHO.maisDeUmContrato" :decimals="1" suffix="%" :at="3" /></b> têm mais de um contrato. Do interior, você também pode.</p>
        </DeckStep>
      </div>
    </div>

    <p class="source">{{ FONTE_TRABALHO }}</p>
  </DeckSlide>
</template>

<script setup>
import { Home, Shuffle, Building, DoorOpen, Rocket, MapPin, TrendingDown, Globe } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { MODELOS_2026, TENDENCIA_REMOTO, CALLOUTS_TRABALHO, FONTE_TRABALHO } from '~/data/presentations/alem-do-codigo/trabalho'
import { alemDoCodigoTheme } from '~/themes/alem-do-codigo'

const nota = NOTAS[18]

// ECharts (SVG) não resolve var() — paleta absoluta escolhida pelo modo ativo.
const { mode } = useDeckColorMode()
const pal = computed(() => alemDoCodigoTheme.charts[mode.value])
const corDe = (token) => pal.value.accents[token]

const sparkPoints = TENDENCIA_REMOTO
  .map((p, i) => `${8 + i * 46},${40 - ((p.valor - 58) / 20) * 36}`)
  .join(' ')

const donutOption = computed(() => ({
  backgroundColor: 'transparent',
  textStyle: { fontFamily: 'Inter, sans-serif' },
  series: [
    {
      type: 'pie',
      radius: ['52%', '78%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      // Borda e label internos na cor do fundo do slide ("vão" entre as fatias).
      itemStyle: { borderColor: pal.value.slideBg, borderWidth: 4 },
      label: {
        show: true,
        position: 'inside',
        formatter: (p) => `${p.value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`,
        color: pal.value.slideBg,
        fontSize: 16,
        fontWeight: 700,
        fontFamily: 'Space Grotesk, sans-serif',
      },
      labelLine: { show: false },
      data: MODELOS_2026.map((m) => ({
        name: m.nome,
        value: m.valor,
        itemStyle: { color: corDe(m.cor) },
      })),
      animationType: 'scale',
      animationDuration: 1100,
    },
  ],
}))
</script>

<style scoped>
.s-title { font-size: 42px; margin-top: 8px; }
.row { display: grid; grid-template-columns: 440px 1fr; gap: 44px; margin-top: 16px; align-items: center; }
.donut-col { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.scope { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; letter-spacing: 0.06em; color: var(--text2); text-transform: uppercase; }
.scope svg { color: var(--cyan); }
.spark-wrap { display: flex; align-items: center; gap: 10px; }
.spark-icon { color: var(--cyan); flex-shrink: 0; }
.spark { width: 150px; height: 40px; }
.spark-label { font-size: 12.5px; color: var(--text2); }
.side { display: flex; flex-direction: column; gap: 12px; }
.modelos { display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
.modelo { display: flex; align-items: center; gap: 12px; font-size: 17px; }
.modelo-nome { width: 110px; }
.modelo-valor { font-size: 19px; }
.callout { display: flex; align-items: center; gap: 10px; padding: 12px 16px; font-size: 15px; color: var(--text2); }
.callout b { color: var(--text); }
.c-red { color: var(--red); }
.c-green { color: var(--green); }
.mundo { margin-top: 12px; }
.mundo-kicker { font-size: 11.5px; letter-spacing: 0.06em; color: var(--text2); text-transform: uppercase; }
.mundo-frase { display: flex; align-items: center; gap: 12px; font-size: 32px; margin-top: 4px; }
.mundo-globe { color: var(--coral); flex-shrink: 0; }
.mundo-apoio { margin-top: 8px; font-size: 14px; line-height: 1.5; color: var(--text2); max-width: 520px; }
.mundo-apoio b { color: var(--text); }

/* Ambient: a tendência "escorre" pela sparkline (dasharray só na regra gated —
   estado base fica sem tracejado, preservando a linha sólida atual). */
.deck-root.ambient-on .slide.active .spark polyline {
  stroke-dasharray: 6 6;
  --amb-dash-to: -24;
  animation: amb-dash 3s linear infinite;
}
/* alcance global: o globo respira suavemente. */
.deck-root.ambient-on .slide.active .mundo-globe { --amb-bright: 1.5; animation: amb-glow 4.5s ease-in-out infinite; }
</style>
