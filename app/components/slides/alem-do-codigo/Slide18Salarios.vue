<template>
  <!-- Slide 18 — Salários 2021–2026 · ⭐⭐⭐ (âncora, único slide de dados pesados)
       Steps: 5 — ① Júnior ② Pleno ③ Sênior ④ Especialista (crescendo) ⑤ callouts -->
  <DeckSlide ref="slideEl" :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o termômetro do mercado</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Salários de devs: 2021 → 2026</DeckReveal>

    <div class="chart-row">
      <DeckReveal :delay="0.3">
        <DeckChart :option="chartOption" :width="860" :height="470" />
      </DeckReveal>

      <div class="callouts">
        <DeckStep :at="5" class="callout deck-card">
          <TrendingUp :size="17" class="c-cyan" />
          <span><b>Salto da pandemia</b> — Sênior a R$ 14,4k já em 2022</span>
        </DeckStep>
        <DeckStep :at="5" :delay="0.15" class="callout deck-card">
          <TrendingDown :size="17" class="c-red" />
          <span><b>1ª queda nominal do Sênior</b> — pico de R$ 15,6k (2025) → R$ 14,6k (2026)</span>
        </DeckStep>
        <DeckStep :at="5" :delay="0.3" class="callout deck-card destaque-callout">
          <Crown :size="17" class="c-coral" />
          <span><b>Especialista: +136%</b> — o único nível que cresceu todos os anos</span>
        </DeckStep>
        <DeckStep :at="5" :delay="0.45" class="callout deck-card">
          <BrainCircuit :size="17" class="c-cyan" />
          <span><b>{{ ADOCAO_IA_2026.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) }}%</b> dos devs já usam IA (2026)</span>
        </DeckStep>
        <DeckStep :at="5" :delay="0.6" class="callout deck-card ma">
          <MapPin :size="17" class="c-green" />
          <span><b>Maranhão:</b> R$ 3,7k (2021) → R$ 10k (2026) — quase 3×</span>
        </DeckStep>
      </div>
    </div>

    <p class="source">{{ FONTE_SALARIOS }}</p>
  </DeckSlide>
</template>

<script setup>
import { TrendingUp, TrendingDown, Crown, BrainCircuit, MapPin } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { ANOS, SERIES_SALARIAIS, ADOCAO_IA_2026, FONTE_SALARIOS } from '~/data/presentations/alem-do-codigo/salarios'
import { alemDoCodigoTheme } from '~/themes/alem-do-codigo'

const nota = NOTAS[17]

// ECharts (SVG) não resolve var() — paleta absoluta escolhida pelo modo ativo.
const { mode } = useDeckColorMode()
const pal = computed(() => alemDoCodigoTheme.charts[mode.value])

// Contexto do slide via template ref (este componente RENDERIZA o DeckSlide,
// então não pode usar inject — ver DeckSlide.defineExpose).
const slideEl = ref(null)

const fmtMil = (v) => `R$ ${(v / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`

// Séries reveladas por step (1=Júnior … 4=Especialista), com efeito draw.
const chartOption = computed(() => {
  const visiveis = Math.min(Math.max(slideEl.value?.ctx.currentStep.value ?? 0, 0), 4)
  return {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Inter, sans-serif' },
    grid: { left: 74, right: 240, top: 26, bottom: 44 },
    xAxis: {
      type: 'category',
      data: [...ANOS],
      boundaryGap: false,
      axisLabel: { color: pal.value.axisLabel, fontSize: 16 },
      axisLine: { lineStyle: { color: pal.value.axisLine } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 22000,
      axisLabel: { color: pal.value.axisLabel, fontSize: 13, formatter: (v) => `${v / 1000}k` },
      splitLine: { lineStyle: { color: pal.value.splitLine } },
    },
    series: SERIES_SALARIAIS.slice(0, visiveis).map((s, i) => ({
      name: s.nivel,
      type: 'line',
      data: s.valores,
      smooth: true,
      symbolSize: 7,
      lineStyle: { color: pal.value.accents[s.cor], width: s.nivel.startsWith('Especialista') ? 4 : 3 },
      itemStyle: { color: pal.value.accents[s.cor] },
      emphasis: { disabled: true },
      endLabel: {
        show: true,
        formatter: () => `${s.nivel.replace('/Tech Lead', '')}  ${fmtMil(s.valores[5])}  ${s.crescimento}`,
        color: pal.value.accents[s.cor],
        fontSize: 14,
        fontWeight: 600,
        distance: 10,
      },
      labelLayout: { moveOverlap: 'shiftY' },
      animationDuration: 1400,
      animationEasing: 'cubicOut',
    })),
  }
})
</script>

<style scoped>
.s-title { font-size: 42px; margin-top: 8px; }
.chart-row { display: grid; grid-template-columns: 860px 1fr; gap: 10px; margin-top: 6px; align-items: center; }
.callouts { display: flex; flex-direction: column; gap: 10px; }
.callout { display: flex; align-items: flex-start; gap: 9px; padding: 11px 13px; font-size: 12.5px; line-height: 1.4; color: var(--text2); }
.callout b { color: var(--text); }
.callout svg { flex: none; margin-top: 1px; }
.destaque-callout { border-color: color-mix(in srgb, var(--coral) 45%, transparent); }
.ma { border-color: color-mix(in srgb, var(--green) 35%, transparent); }
.c-cyan { color: var(--cyan); }
.c-red { color: var(--red); }
.c-coral { color: var(--coral); }
.c-green { color: var(--green); }
</style>
