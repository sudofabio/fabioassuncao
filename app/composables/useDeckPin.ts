/** Chave própria do deck (padrão do `deck-ambient`/`deck-progress`): preferência local, não do site. */
export const DECK_PIN_STORAGE_KEY = 'deck-pin'

/**
 * Preferência do usuário por controles sempre visíveis. Diferente dos irmãos
 * (`useDeckAmbient`/`useDeckProgress`), o default vem da prop `controlsPinned`
 * do DeckStage: sem valor salvo, vale a prop. SSR/primeiro render usa a prop;
 * a leitura do localStorage só ocorre no mount — sem hydration mismatch.
 */
export function useDeckPin(defaultPinned: boolean) {
  const pinned = useState<boolean>('deck-pin', () => defaultPinned)

  onMounted(() => {
    try {
      const saved = localStorage.getItem(DECK_PIN_STORAGE_KEY)
      pinned.value = saved === null ? defaultPinned : saved !== 'off'
    } catch {
      /* storage indisponível — a preferência vale só na sessão */
    }
  })

  function toggle() {
    pinned.value = !pinned.value
    try {
      localStorage.setItem(DECK_PIN_STORAGE_KEY, pinned.value ? 'on' : 'off')
    } catch {
      /* idem */
    }
  }

  return { pinned, toggle }
}
