<template>
  <div ref="rootEl" class="deck-menu">
    <button
      ref="btnEl"
      type="button"
      class="menu-btn"
      :title="ariaLabel"
      :aria-label="ariaLabel"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click.stop="toggle"
    >
      <MoreVertical :size="20" />
    </button>
    <Transition name="deck-menu">
      <div
        v-if="open"
        ref="panelEl"
        class="menu-panel"
        role="menu"
        :aria-label="ariaLabel"
        @keydown="onPanelKeydown"
      >
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="menu-item"
          :role="item.checked === undefined ? 'menuitem' : 'menuitemcheckbox'"
          :aria-checked="item.checked === undefined ? undefined : item.checked"
          :disabled="item.disabled"
          @click.stop="onSelect(item)"
        >
          <component :is="item.icon" :size="18" aria-hidden="true" />
          <span class="menu-item-label">{{ item.label }}</span>
          <Check v-if="item.checked" :size="16" class="menu-item-check" aria-hidden="true" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { MoreVertical, Check } from 'lucide-vue-next'

/**
 * Menu overflow (⋮) da toolbar do deck — apresentacional e genérico: recebe
 * itens e emite a seleção; todo o estado (pin, fullscreen…) vive no DeckStage.
 * Abre para cima (a barra fica no rodapé). Teclas são contidas aqui
 * (stopPropagation) para não vazarem para a navegação de slides.
 */
defineProps({
  /** Itens: { id, label, icon (componente lucide), checked?, disabled? } */
  items: { type: Array, required: true },
  ariaLabel: { type: String, default: 'Mais opções' },
})

const open = defineModel('open', { type: Boolean, default: false })
const emit = defineEmits(['select'])

const rootEl = ref(null)
const btnEl = ref(null)
const panelEl = ref(null)

function focusableItems() {
  return Array.from(panelEl.value?.querySelectorAll('.menu-item:not(:disabled)') ?? [])
}

function focusItem(index) {
  const els = focusableItems()
  if (!els.length) return
  const i = ((index % els.length) + els.length) % els.length
  els[i].focus()
}

function toggle() {
  open.value = !open.value
}

// Foco no primeiro item sempre que o menu abre — por qualquer caminho (clique
// no ⋮, atalho M do DeckStage via v-model). Não decidir dentro de toggle():
// com defineModel, ler open.value logo após atribuir devolve o valor antigo
// até a prop voltar do pai.
watch(open, v => {
  if (v) nextTick(() => focusItem(0))
})

function close({ refocus = true } = {}) {
  open.value = false
  if (refocus) btnEl.value?.focus()
}

function onSelect(item) {
  emit('select', item.id)
  close()
}

function onPanelKeydown(e) {
  const els = focusableItems()
  const current = els.indexOf(document.activeElement)
  if (e.key === 'ArrowDown') focusItem(current + 1)
  else if (e.key === 'ArrowUp') focusItem(current - 1)
  else if (e.key === 'Home') focusItem(0)
  else if (e.key === 'End') focusItem(els.length - 1)
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
