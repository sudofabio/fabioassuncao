<template>
  <!-- Slide 26 — Obrigado! Vamos conversar? · ⭐⭐⭐ · Steps: 0
       Espelha a capa. QR ÚNICO protagonista (≥240px), gerado dinamicamente
       (qrcode.vue) a partir da URL da apresentação. Contatos exatos do
       PALESTRANTE/README.md. Fica projetado durante o Q&A. -->
  <DeckSlide :title="nota.title" :notes="nota.notes" background="deep" flush>
    <svg class="mesh" viewBox="0 0 1280 720" aria-hidden="true">
      <g class="mesh-lines" stroke-width="1" fill="none">
        <path d="M80 640 h180 v-120 h220 v-80 h160" />
        <path d="M1200 90 h-160 v100 h-200 v90 h-140" />
        <path d="M120 120 h140 v90 h180" />
      </g>
      <g class="mesh-dots">
        <circle cx="260" cy="640" r="4" /><circle cx="480" cy="520" r="4" />
        <circle cx="1040" cy="90" r="4" /><circle cx="840" cy="190" r="4" />
        <circle cx="260" cy="120" r="4" /><circle cx="440" cy="210" r="4" />
      </g>
    </svg>

    <div class="wrap">
      <div class="left">
        <DeckReveal :delay="0.1" class="lockup">
          <img :src="LOGO_IFMA" alt="IFMA" class="ifma" />
          <span class="mono lockup-text">{{ EVENTO.lockup }}</span>
        </DeckReveal>

        <DeckReveal tag="h1" :delay="0.3" class="title obrigado">Obrigado!</DeckReveal>
        <DeckReveal tag="p" :delay="0.45" class="lead convite">Vamos conversar?</DeckReveal>

        <div class="contatos">
          <DeckReveal
            v-for="(c, i) in CONTATOS"
            :key="c.rotulo"
            :delay="0.6 + i * 0.1"
            variant="lf"
            class="contato"
          >
            <component :is="iconeDe(c.tipo)" :size="20" class="contato-icon" />
            <span class="mono">{{ c.rotulo }}</span>
          </DeckReveal>
        </div>
      </div>

      <DeckReveal variant="sc" :delay="0.5" class="qr-col">
        <div class="qr-card">
          <ClientOnly>
            <QrcodeVue :value="URL_APRESENTACAO" :size="252" level="M" render-as="svg" background="#F2F5F9" foreground="#0B1526" />
          </ClientOnly>
        </div>
        <span class="qr-label">Material da palestra</span>
        <span class="qr-sub mono">slides · links · referências</span>
      </DeckReveal>
    </div>
  </DeckSlide>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue'
import { Globe, Github, Linkedin, Mail } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { CONTATOS, URL_APRESENTACAO, EVENTO } from '~/data/presentations/alem-do-codigo/contatos'
import { LOGO_IFMA } from '~/data/presentations/alem-do-codigo/ferramentas'

const nota = NOTAS[25]

function iconeDe(tipo) {
  return { site: Globe, github: Github, linkedin: Linkedin, email: Mail }[tipo] || Globe
}
</script>

<style scoped>
.mesh { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.07; }
.mesh-lines { stroke: var(--cyan); }
.mesh-dots { fill: var(--cyan); }
.wrap { position: relative; height: 100%; display: grid; grid-template-columns: 1fr auto; gap: 60px; align-items: center; padding: 0 120px; }
.lockup { display: flex; align-items: center; gap: 14px; margin-bottom: 34px; }
.ifma { height: 40px; filter: brightness(0) invert(0.95); }
html.deck-light .ifma { filter: brightness(0) opacity(0.8); }
.lockup-text { font-size: 13px; letter-spacing: 0.22em; color: var(--text2); }
.obrigado { font-size: 84px; }
.convite { font-size: 26px; margin-top: 8px; }
.contatos { margin-top: 40px; display: flex; flex-direction: column; gap: 14px; }
.contato { display: flex; align-items: center; gap: 14px; font-size: 18px; }
.contato-icon { color: var(--cyan); }
.qr-col { display: flex; flex-direction: column; align-items: center; gap: 10px; }
/* Fundo/foreground do QR são fixos (contraste de leitura inegociável nos dois temas). */
.qr-card { background: #F2F5F9; padding: 18px; border-radius: 16px; box-shadow: 0 0 60px -12px color-mix(in srgb, var(--cyan) 45%, transparent); }
html.deck-light .qr-card { border: 1px solid var(--border); }
.qr-label { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; margin-top: 6px; }
.qr-sub { font-size: 12px; color: var(--text2); letter-spacing: 0.1em; }
</style>
