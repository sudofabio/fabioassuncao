<template>
  <!-- Slide 14 — O fluxo do SDD · ⭐⭐⭐ (âncora) · Steps: 5 (um nó por clique) -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o fluxo profissional</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Da constituição à implementação</DeckReveal>

    <div class="pipeline">
      <template v-for="(etapa, i) in etapas" :key="etapa.nome">
        <DeckStep v-if="i > 0" :at="i + 1" class="connector" aria-hidden="true">
          <span class="conn-line"></span>
        </DeckStep>
        <DeckStep :at="i + 1" variant="sc" class="node-step">
          <div class="node deck-card">
            <span class="num mono">{{ String(i + 1).padStart(2, '0') }}</span>
            <component :is="etapa.icon" :size="30" class="node-icon" />
            <b class="node-name">{{ etapa.nome }}</b>
            <p class="node-desc">{{ etapa.desc }}</p>
            <span class="artefato"><FileOutput :size="13" /> {{ etapa.artefato }}</span>
            <span class="cmd mono">{{ etapa.cmd }}</span>
          </div>
        </DeckStep>
      </template>
    </div>

    <DeckStep :at="5" :delay="0.5" class="foot">
      A IA executa. <b>Você escreve a partitura.</b>
    </DeckStep>

    <p class="source">Base: Spec-Kit (GitHub) — fluxo de Spec-Driven Development</p>
  </DeckSlide>
</template>

<script setup>
import { ScrollText, FileText, DraftingCompass, ListChecks, Rocket, FileOutput } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[13]

const etapas = [
  { icon: ScrollText, nome: 'Constitution', desc: 'Princípios e regras de ouro do projeto.', artefato: 'princípios', cmd: '/speckit.constitution' },
  { icon: FileText, nome: 'Specify', desc: 'O quê e por quê: requisitos funcionais e não funcionais.', artefato: 'PRD · requisitos', cmd: '/speckit.specify' },
  { icon: DraftingCompass, nome: 'Plan', desc: 'Arquitetura, stack e decisões técnicas.', artefato: 'arquitetura', cmd: '/speckit.plan' },
  { icon: ListChecks, nome: 'Tasks', desc: 'Decomposição em tarefas atômicas.', artefato: 'backlog', cmd: '/speckit.tasks' },
  { icon: Rocket, nome: 'Implement', desc: 'Agentes executam com validação humana.', artefato: 'código validado', cmd: '/speckit.implement' },
]
</script>

<style scoped>
.s-title { font-size: 42px; margin-top: 10px; }
.pipeline { display: flex; align-items: stretch; gap: 0; margin-top: 52px; }
.node-step { flex: 1; display: flex; }
.node { position: relative; display: flex; flex-direction: column; gap: 7px; padding: 20px 16px 16px; flex: 1; border-style: dashed; }
.num { position: absolute; top: 12px; right: 12px; font-size: 26px; color: var(--border); }
.node-icon { color: var(--cyan); }
.node-name { font-family: 'Space Grotesk', sans-serif; font-size: 18.5px; margin-top: 2px; }
.node-desc { font-size: 12.5px; line-height: 1.4; color: var(--text2); flex: 1; }
.artefato { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--coral); }
.cmd { font-size: 10.5px; color: var(--text2); opacity: 0.75; }
.connector { display: flex; align-items: center; padding: 0 4px; }
.conn-line { display: block; width: 22px; height: 2px; background: var(--cyan); opacity: 0.55; position: relative; }
.conn-line::after { content: ''; position: absolute; right: -1px; top: -3.5px; border-left: 7px solid var(--cyan); border-top: 4.5px solid transparent; border-bottom: 4.5px solid transparent; opacity: 0.8; }
.foot { margin-top: 42px; text-align: center; font-size: 20px; color: var(--text2); }
.foot b { color: var(--coral); }
</style>
