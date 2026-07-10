/** Chave própria do deck (padrão do `deck-theme`): preferência local, não do site. */
export const DECK_BACKGROUNDS_STORAGE_KEY = 'deck-backgrounds'

/**
 * Preferência do usuário por fundos animados decorativos (DeckSlideBackground).
 * Default ligado. O SSR/primeiro render é sempre `true`, mas a camada de fundo
 * só é montada pelo `DeckSlideBackground` após o mount (via `backgroundsOn` do
 * DeckStage) — o HTML prerenderizado nunca a contém, sem hydration mismatch.
 * Independente do "ambient": este toggle monta/desmonta a camada; o ambient
 * governa se ela se move (com ambient off o fundo fica estático, mas visível).
 */
export function useDeckBackgrounds() {
  const enabled = useState<boolean>('deck-backgrounds', () => true)

  onMounted(() => {
    try {
      enabled.value = localStorage.getItem(DECK_BACKGROUNDS_STORAGE_KEY) !== 'off'
    } catch {
      /* storage indisponível — a preferência vale só na sessão */
    }
  })

  function toggle() {
    enabled.value = !enabled.value
    try {
      localStorage.setItem(DECK_BACKGROUNDS_STORAGE_KEY, enabled.value ? 'on' : 'off')
    } catch {
      /* idem */
    }
  }

  return { enabled, toggle }
}
