import type { DeckColorMode } from '~/components/deck/context'

/**
 * Chave própria do deck (separada do `theme` do site): o default da
 * apresentação é dark (contexto de projeção) e alternar o tema durante uma
 * palestra não deve mudar o tema do site — nem o contrário.
 */
export const DECK_THEME_STORAGE_KEY = 'deck-theme'

/**
 * Modo de cor do deck. A classe `deck-light` no `<html>` é a fonte de verdade
 * visual — aplicada antes do primeiro paint pelo script anti-flash do layout
 * `presentation` (o Vue não renderiza atributos do `<html>`, então não há
 * hydration mismatch). Este estado existe para a UI reativa (ícone do toggle,
 * paleta dos gráficos): inicia sempre `dark` no SSR/primeiro render e
 * sincroniza com a classe real no mount.
 */
export function useDeckColorMode() {
  const mode = useState<DeckColorMode>('deck-color-mode', () => 'dark')

  function apply(m: DeckColorMode) {
    document.documentElement.classList.toggle('deck-light', m === 'light')
  }

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    apply(mode.value)
    try {
      localStorage.setItem(DECK_THEME_STORAGE_KEY, mode.value)
    } catch {
      /* storage indisponível (modo privado etc.) — o tema vale só na sessão */
    }
  }

  onMounted(() => {
    mode.value = document.documentElement.classList.contains('deck-light') ? 'light' : 'dark'
  })

  return {
    mode,
    isLight: computed(() => mode.value === 'light'),
    toggle,
  }
}
