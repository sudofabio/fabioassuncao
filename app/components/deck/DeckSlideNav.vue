<template>
  <div ref="rootEl" class="deck-slidenav">
    <button
      ref="btnEl"
      type="button"
      class="counter"
      :title="'Ir para um slide'"
      :aria-label="`Ir para um slide (atual: ${current + 1} de ${total})`"
      aria-haspopup="listbox"
      :aria-expanded="open"
      aria-live="polite"
      @click.stop="toggle"
    >{{ counterText }}</button>
    <Transition name="deck-menu">
      <div
        v-if="open"
        ref="panelEl"
        class="slidenav-panel"
        role="listbox"
        aria-label="Ir para o slide"
        @keydown="onPanelKeydown"
      >
        <button
          v-for="item in items"
          :key="item.index"
          type="button"
          class="slidenav-item"
          :class="{ current: item.index === current }"
          role="option"
          :aria-selected="item.index === current"
          @click.stop="onSelect(item.index)"
        >
          <span class="slidenav-num mono">{{ item.num }}</span>
          <span class="slidenav-label">{{ item.label }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
/**
 * Navegador de slides da toolbar — o próprio contador ("07 / 26") é o gatilho;
 * o popover lista número + título de cada slide (metas do registry) e pula
 * direto via select. Apresentacional, mesmo padrão do DeckMenu: teclas
 * contidas no painel (stopPropagation), Escape/click-fora fecham.
 */
const props = defineProps({
  /** Metas registradas pelos slides (registry do DeckStage): { title, ... } */
  metas: { type: Array, required: true },
  total: { type: Number, required: true },
  /** Slide ativo (0-based). */
  current: { type: Number, required: true },
})

const open = defineModel('open', { type: Boolean, default: false })
const emit = defineEmits(['select'])

const rootEl = ref(null)
const btnEl = ref(null)
const panelEl = ref(null)

const pad = n => String(n).padStart(2, '0')
const counterText = computed(() => `${pad(props.current + 1)} / ${pad(props.total)}`)

// Título das metas vem como "7 · Anti-hype" — o número sai (já há coluna própria).
const items = computed(() =>
  Array.from({ length: props.total }, (_, i) => ({
    index: i,
    num: pad(i + 1),
    label: props.metas[i]?.title?.replace(/^\d+\s*·\s*/, '') || `Slide ${i + 1}`,
  }))
)

function optionEls() {
  return Array.from(panelEl.value?.querySelectorAll('.slidenav-item') ?? [])
}

function focusOption(index) {
  const els = optionEls()
  if (!els.length) return
  const i = ((index % els.length) + els.length) % els.length
  els[i].focus()
  els[i].scrollIntoView({ block: 'nearest' })
}

function toggle() {
  open.value = !open.value
}

// Foco e scroll no item atual sempre que o painel abre — por qualquer caminho
// (clique no contador, atalho G do DeckStage via v-model). Não decidir dentro
// de toggle(): com defineModel, ler open.value logo após atribuir devolve o
// valor antigo até a prop voltar do pai.
watch(open, v => {
  if (!v) return
  nextTick(() => {
    const el = optionEls()[props.current]
    el?.scrollIntoView({ block: 'center' })
    el?.focus()
  })
})

function close({ refocus = true } = {}) {
  open.value = false
  if (refocus) btnEl.value?.focus()
}

function onSelect(index) {
  emit('select', index)
  close()
}

function onPanelKeydown(e) {
  const els = optionEls()
  const current = els.indexOf(document.activeElement)
  if (e.key === 'ArrowDown') focusOption(current + 1)
  else if (e.key === 'ArrowUp') focusOption(current - 1)
  else if (e.key === 'Home') focusOption(0)
  else if (e.key === 'End') focusOption(els.length - 1)
  else if (e.key === 'Escape') close()
  else if (e.key === 'Tab') { close({ refocus: false }); return }
  else return
  e.preventDefault()
  e.stopPropagation()
}

function onDocPointerDown(e) {
  if (open.value && rootEl.value && !rootEl.value.contains(e.target)) close({ refocus: false })
}

onMounted(() => document.addEventListener('pointerdown', onDocPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocPointerDown))
</script>
