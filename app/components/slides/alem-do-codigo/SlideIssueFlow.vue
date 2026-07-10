<template>
  <!-- Issue Flow na prática · Steps: 6 (§10)
       ① issue+generate ② prd ③ plan ④ execute ⑤ review FAIL→PASS (half-loop) ⑥ pr -->
  <DeckSlide :title="nota.title" :notes="nota.notes">
    <DeckReveal :delay="0.05" class="eyebrow">na prática · do problema ao PR</DeckReveal>
    <DeckReveal tag="h2" :delay="0.15" class="title s-title">Issue Flow, rodando</DeckReveal>

    <!-- camada 1: pipeline conceitual -->
    <div class="pipeline">
      <template v-for="(n, i) in PIPELINE" :key="n.id">
        <DeckStep v-if="i > 0" :at="n.at" class="pconn" aria-hidden="true"><span class="conn-line"></span></DeckStep>
        <DeckStep :at="n.at" variant="sc" class="pnode" :class="{ loop: n.loop, last: n.id === 'pr' }">
          <RotateCcw v-if="n.loop" :size="13" class="loop-ic" />
          <span class="mono">{{ n.rotulo }}</span>
        </DeckStep>
      </template>
    </div>

    <!-- camada 2: terminal + árvore -->
    <div class="grid">
      <div class="term">
        <div class="term-bar">
          <i class="dot" style="background:#E85D4C"></i><i class="dot" style="background:#E8B44C"></i><i class="dot" style="background:#3ECF8E"></i>
          <span class="term-title mono">issue-flow · modo auto</span>
        </div>
        <div class="term-body mono">
          <DeckStep v-for="(l, i) in LINHAS_TERMINAL" :key="i" :at="l.at" variant="lf" class="tl" :class="l.kind">
            <span v-if="l.kind === 'cmd'" class="prompt">~/fabioassuncao $ </span>{{ l.txt }}
          </DeckStep>
          <p class="tl-caret">&gt; <span class="caret" aria-hidden="true">▌</span></p>
        </div>
      </div>

      <div class="tree">
        <div class="tree-bar mono"><Folder :size="13" /> workspace</div>
        <div class="tree-body mono">
          <DeckStep
            v-for="(t, i) in ARVORE_ISSUE"
            :key="i"
            :at="t.at"
            variant="lf"
            class="tline"
            :class="[t.kind, { indent: t.dep === 1 }]"
          >
            <span class="mark">{{ t.mark }}</span>{{ t.txt }}
          </DeckStep>
        </div>
      </div>
    </div>

    <DeckStep :at="5" variant="dn" class="halfloop">
      <RotateCcw :size="16" class="hl-ic" />
      <span>O <b class="hl">half-loop</b>: o <b>review</b> sabe dizer <b class="no">não</b>, reprova, corrige e revalida (até 3 ciclos). É a metade que valida.</span>
    </DeckStep>
  </DeckSlide>
</template>

<script setup>
import { RotateCcw, Folder } from 'lucide-vue-next'
import { NOTAS } from '~/data/presentations/alem-do-codigo/notas'
import { PIPELINE, LINHAS_TERMINAL, ARVORE_ISSUE } from '~/data/presentations/alem-do-codigo/issueFlow'

const nota = NOTAS[33]
</script>

<style scoped>
.s-title { font-size: 40px; margin-top: 8px; }

/* pipeline */
.pipeline { display: flex; align-items: center; justify-content: center; margin-top: 26px; gap: 0; }
.pnode { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid var(--cyan); color: var(--cyan); border-radius: 999px; font-size: 14px; background: color-mix(in srgb, var(--cyan) 8%, transparent); }
.pnode.loop { border-color: var(--amber, #E8B44C); color: var(--amber, #E8B44C); background: color-mix(in srgb, var(--amber, #E8B44C) 10%, transparent); }
.pnode.last { border-color: var(--green); color: var(--green); background: color-mix(in srgb, var(--green) 10%, transparent); }
.loop-ic { flex-shrink: 0; }
.pconn { display: flex; align-items: center; padding: 0 6px; }
.conn-line { display: block; width: 26px; height: 2px; background: var(--cyan); opacity: 0.5; position: relative; }
.conn-line::after { content: ''; position: absolute; right: -1px; top: -3.5px; border-left: 7px solid var(--cyan); border-top: 4.5px solid transparent; border-bottom: 4.5px solid transparent; opacity: 0.8; }
.conn-line::before { content: ''; position: absolute; left: 0; top: 0; width: 8px; height: 100%; background: linear-gradient(90deg, transparent, var(--cyan), transparent); opacity: 0; will-change: transform; }

/* terminal + árvore (escuros nos dois temas) */
.grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; margin-top: 26px; }
.term, .tree { --bg2: #122036; --text: #F2F5F9; --text2: #8FA3BF; --border: #233650;
  --cyan: #37C6F4; --coral: #F2762E; --green: #3ECF8E; --red: #E85D4C; --amber: #E8B44C;
  border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--terminal-bg, #0A1220); }
.term-bar, .tree-bar { display: flex; align-items: center; gap: 7px; padding: 9px 14px; background: var(--bg2); border-bottom: 1px solid var(--border); }
.dot { width: 10px; height: 10px; border-radius: 50%; display: block; }
.term-title { margin-left: 8px; font-size: 12px; letter-spacing: 0.08em; color: var(--text2); }
.tree-bar { font-size: 12px; color: var(--text2); letter-spacing: 0.06em; }
.term-body { padding: 14px 16px; font-size: 12.5px; min-height: 250px; display: flex; flex-direction: column; gap: 6px; }
.tl { color: var(--text2); line-height: 1.4; word-break: break-word; }
.tl .prompt { color: var(--cyan); }
.tl.cmd { color: var(--text); }
.tl.ok { color: var(--green); }
.tl.run { color: var(--text2); }
.tl.fail { color: var(--red); }
.tl.pass { color: var(--green); }
.tl-caret { margin-top: 4px; color: var(--text); font-size: 12.5px; }
.caret { color: var(--cyan); }
.tree-body { padding: 14px 16px; font-size: 12.5px; display: flex; flex-direction: column; gap: 7px; min-height: 250px; }
.tline { color: var(--text2); }
.tline.indent { padding-left: 18px; }
.tline .mark { display: inline-block; width: 18px; }
.tline.folder { color: var(--text); font-weight: 600; }
.tline.ok .mark { color: var(--green); }
.tline.run .mark { color: var(--cyan); }
.tline.new, .tline.new .mark { color: var(--cyan); }
.tline.warn, .tline.warn .mark { color: var(--amber); }
.tline.pr, .tline.pr .mark { color: var(--green); font-weight: 600; }

.halfloop { margin-top: 22px; display: flex; align-items: center; gap: 11px; justify-content: center; font-size: 16px; color: var(--text2); }
.hl-ic { color: var(--amber, #E8B44C); flex-shrink: 0; }
.halfloop b { color: var(--text); }
.halfloop b.hl { color: var(--amber, #E8B44C); }
.halfloop b.no { color: var(--coral); }

/* Ambient: fluxo correndo pelo pipeline + glow no nó review + caret piscando. */
.deck-root.ambient-on .slide.active .conn-line::before { animation: conn-flow 2.5s linear infinite; }
.deck-root.ambient-on .slide.active .pnode.loop { --amb-bright: 1.35; animation: amb-glow 3s ease-in-out infinite; }
.deck-root.ambient-on .slide.active .caret { animation: amb-blink 1.1s linear infinite; }
@keyframes conn-flow {
  0% { transform: translateX(-8px); opacity: 0; }
  30% { opacity: 0.9; }
  70% { opacity: 0.9; }
  100% { transform: translateX(26px); opacity: 0; }
}
</style>
