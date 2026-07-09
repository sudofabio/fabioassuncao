/** Chave própria do deck (padrão do `deck-theme`): preferência local, não do site. */
export const DECK_AMBIENT_STORAGE_KEY = 'deck-ambient'

/**
 * Preferência do usuário por animações contínuas ("ambient") nos slides.
 * Default ligado. O SSR/primeiro render é sempre `true`: a classe
 * `.ambient-on` só é aplicada pelo `DeckStage` após o mount, então o HTML
 * prerenderizado nunca a contém — sem hydration mismatch nem flash (o estado
 * "sem classe" é o estado seguro/estático).
 */
export function useDeckAmbient() {
  const enabled = useState<boolean>('deck-ambient', () => true)

  onMounted(() => {
    try {
      enabled.value = localStorage.getItem(DECK_AMBIENT_STORAGE_KEY) !== 'off'
    } catch {
      /* storage indisponível — a preferência vale só na sessão */
    }
  })

  function toggle() {
    enabled.value = !enabled.value
    try {
      localStorage.setItem(DECK_AMBIENT_STORAGE_KEY, enabled.value ? 'on' : 'off')
    } catch {
      /* idem */
    }
  }

  return { enabled, toggle }
}
