<template>
  <!-- As 9 etapas do SDD, do problema ao PR · Steps: 9 (a árvore cresce junto) -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">o método, passo a passo</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Do problema ao PR — em 9 etapas</DeckReveal>

    <div class="grid">
      <!-- esquerda: as 9 etapas, uma por clique -->
      <ol class="etapas">
        <DeckStep v-for="e in ETAPAS" :key="e.n" tag="li" :at="e.n" variant="lf" class="etapa">
          <span class="n mono">{{ String(e.n).padStart(2, '0') }}</span>
          <div class="et-txt">
            <b>{{ e.txt }}</b>
            <span class="sub">{{ e.sub }}</span>
          </div>
          <span class="fase" :class="e.fase">{{ e.fase }}</span>
        </DeckStep>
      </ol>

      <!-- direita: a árvore de arquivos que cresce -->
      <div class="tree deck-card">
        <div class="tree-bar mono"><Folder :size="13" /> workspace</div>
        <div class="tree-body mono">
          <DeckStep
            v-for="(t, i) in TREE"
            :key="i"
            :at="t.at"
            variant="lf"
            class="tline"
            :class="[t.kind, { indent: t.dep === 1 }]"
          >
            <span class="mark">{{ t.mark }}</span>{{ t.txt }}
          </DeckStep>
          <p class="tcaret mono">&gt; <span class="caret" aria-hidden="true">▌</span></p>
        </div>
      </div>
    </div>

    <DeckStep :at="9" :delay="0.3" class="foot">
      Problema/intenção → <b>generate</b> · spec/refino/validação → <b>prd</b> · tarefas → <b>plan</b> · implemento → <b>execute</b> · revisão → <b>review</b> · integração → <b>pr</b>.
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { Folder } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'

const nota = NOTAS[32]

const ETAPAS = [
  { n: 1, txt: 'Tenho um problema real', sub: 'uma frase vaga de usuário', fase: 'generate' },
  { n: 2, txt: 'Transformo em intenção clara', sub: 'o objetivo, em uma linha', fase: 'generate' },
  { n: 3, txt: 'Gero uma especificação', sub: 'o quê e por quê', fase: 'prd' },
  { n: 4, txt: 'Refino requisitos e restrições', sub: 'stack · regras · segurança', fase: 'prd' },
  { n: 5, txt: 'Valido o escopo', sub: 'critérios de aceite', fase: 'prd' },
  { n: 6, txt: 'Quebro em tarefas atômicas', sub: 'o backlog do agente', fase: 'plan' },
  { n: 7, txt: 'Implemento com apoio da IA', sub: 'o agente executa', fase: 'execute' },
  { n: 8, txt: 'Reviso, testo e ajusto', sub: 'o loop de correção', fase: 'review' },
  { n: 9, txt: 'Integro ao projeto', sub: 'Pull Request', fase: 'pr' },
]

// A árvore reflete os artefatos confirmados do Issue Flow (issues/N/…).
const TREE = [
  { at: 1, dep: 0, txt: 'issues/42/', kind: 'folder', mark: '▸' },
  { at: 3, dep: 1, txt: 'prd.md', kind: 'ok', mark: '✓' },
  { at: 5, dep: 1, txt: 'analysis.md', kind: 'ok', mark: '✓' },
  { at: 6, dep: 1, txt: 'tasks.json', kind: 'ok', mark: '✓' },
  { at: 7, dep: 1, txt: 'progress.txt', kind: 'run', mark: '⟳' },
  { at: 7, dep: 0, txt: 'app/pages/talks.vue', kind: 'new', mark: '＋' },
  { at: 8, dep: 1, txt: 'review-findings.md', kind: 'warn', mark: '⚠' },
  { at: 9, dep: 0, txt: 'PR #57 · aberto', kind: 'pr', mark: '✓' },
]
</script>

<style scoped>
.s-title { font-size: 36px; margin-top: 4px; }
.grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 28px; margin-top: 20px; align-items: start; }
.etapas { list-style: none; display: flex; flex-direction: column; gap: 5px; }
.etapa { display: flex; align-items: center; gap: 13px; padding: 5px 10px; border-radius: 8px; }
.n { font-size: 14px; color: var(--border); font-weight: 600; width: 22px; flex-shrink: 0; }
.et-txt { flex: 1; display: flex; flex-direction: column; }
.et-txt b { font-size: 14.5px; }
.sub { font-size: 11px; color: var(--text2); }
.fase { font-size: 10.5px; letter-spacing: 0.04em; padding: 2px 8px; border-radius: 5px; font-family: var(--mono, monospace); border: 1px solid var(--border); }
.fase.generate, .fase.prd, .fase.plan { color: var(--cyan); border-color: color-mix(in srgb, var(--cyan) 35%, transparent); }
.fase.execute { color: var(--coral); border-color: color-mix(in srgb, var(--coral) 35%, transparent); }
.fase.review { color: var(--amber, #E8B44C); border-color: color-mix(in srgb, var(--amber, #E8B44C) 40%, transparent); }
.fase.pr { color: var(--green); border-color: color-mix(in srgb, var(--green) 40%, transparent); }

/* Terminal escuro nos dois temas (mesmo padrão do Slide15). */
.tree { --bg2: #122036; --text: #F2F5F9; --text2: #8FA3BF; --border: #233650;
  --cyan: #37C6F4; --coral: #F2762E; --green: #3ECF8E; --red: #E85D4C; --amber: #E8B44C;
  padding: 0; overflow: hidden; background: var(--terminal-bg, #0A1220); }
.tree-bar { display: flex; align-items: center; gap: 7px; padding: 10px 14px; background: var(--bg2); border-bottom: 1px solid var(--border); font-size: 12px; color: var(--text2); letter-spacing: 0.06em; }
.tree-body { padding: 14px 16px; font-size: 13px; display: flex; flex-direction: column; gap: 6px; min-height: 250px; }
.tline { color: var(--text2); }
.tline.indent { padding-left: 20px; }
.tline .mark { display: inline-block; width: 18px; color: var(--text2); }
.tline.folder { color: var(--text); font-weight: 600; }
.tline.ok .mark { color: var(--green); }
.tline.run .mark { color: var(--cyan); }
.tline.new { color: var(--cyan); }
.tline.new .mark { color: var(--cyan); }
.tline.warn { color: var(--amber); }
.tline.warn .mark { color: var(--amber); }
.tline.pr { color: var(--green); font-weight: 600; }
.tline.pr .mark { color: var(--green); }
.tcaret { margin-top: 6px; color: var(--text); }
.caret { color: var(--cyan); }
.foot { margin-top: 14px; text-align: center; font-size: 13.5px; color: var(--text2); }
.foot b { color: var(--text); font-family: var(--mono, monospace); }

/* Ambient: caret piscando na árvore/terminal. */
.deck-root.ambient-on .slide.active .caret { animation: amb-blink 1.1s linear infinite; }
</style>
