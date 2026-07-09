/** Chave própria do deck (padrão do `deck-theme`/`deck-ambient`): preferência local, não do site. */
export const DECK_PROGRESS_STORAGE_KEY = 'deck-progress'

/**
 * Preferência do usuário pela visibilidade da barra de progresso (`.topbar`).
 * Default visível e independente dos controles de navegação. O SSR/primeiro
 * render é sempre `true` (barra visível no HTML prerenderizado); a leitura do
 * localStorage só ocorre no mount — sem hydration mismatch. Quem ocultou vê a
 * barra sumir com o fade de 0.22s pós-mount (mesmo tradeoff do `useDeckAmbient`).
 */
export function useDeckProgress() {
  const visible = useState<boolean>('deck-progress', () => true)

  onMounted(() => {
    try {
      visible.value = localStorage.getItem(DECK_PROGRESS_STORAGE_KEY) !== 'off'
    } catch {
      /* storage indisponível — a preferência vale só na sessão */
    }
  })

  function toggle() {
    visible.value = !visible.value
    try {
      localStorage.setItem(DECK_PROGRESS_STORAGE_KEY, visible.value ? 'on' : 'off')
    } catch {
      /* idem */
    }
  }

  return { visible, toggle }
}
