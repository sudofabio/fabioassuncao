import { nextTick } from 'vue'

/**
 * Exporta um deck de apresentação para PDF fiel, um slide por página.
 * (Deck Engine v2 — portado do lms-landing-page e adaptado para steps,
 * timelines GSAP e gráficos ECharts, ARQUITETURA §6.3.)
 *
 * Estratégia (100% no navegador — compatível com deploy estático): cada slide
 * é ativado com todos os steps revelados, o hook `finalizeSlide` leva timelines
 * GSAP ao estado final e desliga a animação dos gráficos ECharts (aguardando o
 * `finished`), o export então **aguarda o carregamento completo do slide**
 * (imagens, fontes e animações CSS de entrada concluídas) e rasteriza com
 * `@zumer/snapdom` (foreignObject — preserva blur, gradientes, glow, SVG e
 * fontes). As imagens são montadas em um PDF landscape 1280×720 com `jsPDF`.
 *
 * As libs são importadas dinamicamente para não quebrar o prerender SSR
 * (`nuxt generate`), que não tem `window`.
 */

/** Aguarda dois frames de animação (deixa o layout/estilos assentarem). */
function nextFrames() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

const CAPTURE_STYLE_ID = 'deck-capture-mode'

/**
 * Neutraliza o `transform: translate(-50%,-50%)` do palco durante a captura,
 * para o snapdom rasterizar a partir da origem (sem offset). O palco fica
 * deslocado na tela, mas o overlay opaco de "Gerando PDF" cobre o deck.
 */
function enableCaptureMode() {
  if (document.getElementById(CAPTURE_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = CAPTURE_STYLE_ID
  style.textContent = `.deck-root .stage { transform: none !important; }`
  document.head.appendChild(style)
}

function disableCaptureMode() {
  document.getElementById(CAPTURE_STYLE_ID)?.remove()
}

/** Aguarda todas as imagens de um elemento carregarem/decodificarem. */
async function waitForImages(el: Element) {
  const imgs = Array.from(el.querySelectorAll('img'))
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) {
        return img.decode?.().catch(() => {}) ?? Promise.resolve()
      }
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true })
        img.addEventListener('error', () => resolve(), { once: true })
      })
    }),
  )
}

/**
 * Aguarda o slide ficar completamente "carregado" antes da captura:
 * imagens + fontes + conclusão das transições/animações de entrada finitas.
 * As animações ambientes (loops infinitos) são ignoradas.
 */
async function waitForSlideReady(slideEl: Element, timeout = 4000) {
  await waitForImages(slideEl)
  if (document.fonts?.ready) {
    try { await document.fonts.ready } catch { /* ignore */ }
  }
  await nextFrames()

  const getAnims = (slideEl as Element & {
    getAnimations?: (opts?: { subtree?: boolean }) => Animation[]
  }).getAnimations

  if (typeof getAnims === 'function') {
    const finite = getAnims.call(slideEl, { subtree: true }).filter((a) => {
      try {
        return a.effect?.getComputedTiming?.().iterations !== Infinity
      } catch {
        return false
      }
    })
    if (finite.length) {
      await Promise.race([
        Promise.allSettled(finite.map((a) => a.finished)),
        wait(timeout),
      ])
    }
  } else {
    await wait(1800)
  }

  await nextFrames()
}

export interface ExportDeckOptions {
  /** Elemento `.stage` (1280×720) que contém os slides. */
  stageEl: HTMLElement
  /** Ativa o slide de índice `i` com todos os steps revelados. */
  setActive: (i: number) => void
  /** Leva o slide `i` ao estado final (timelines GSAP + ECharts sem animação). */
  finalizeSlide?: (i: number) => Promise<void>
  /** Número total de slides. */
  total: number
  /** Nome do arquivo gerado. */
  filename: string
  /** Cor de fundo das páginas (fundo do tema). */
  backgroundColor?: string
  /** Callback de progresso (slides concluídos / total). */
  onProgress?: (done: number, total: number) => void
  /** Multiplicador de resolução (2 = 2560×1440). Default 2. */
  scale?: number
  /** Qualidade JPEG das páginas (0..1). Default 0.95. */
  quality?: number
}

export async function exportDeckToPdf(options: ExportDeckOptions): Promise<void> {
  const {
    stageEl, setActive, finalizeSlide, total, filename, onProgress,
    backgroundColor = '#0B1526', scale = 2, quality = 0.95,
  } = options
  if (!stageEl || total <= 0) return

  const [snapMod, jspdf] = await Promise.all([
    import('@zumer/snapdom'),
    import('jspdf'),
  ])
  const { snapdom, preCache } = snapMod
  const JsPDF = jspdf.jsPDF

  // Aquece o cache de recursos (fontes/imagens) para evitar capturas parciais.
  try { await preCache(stageEl, { embedFonts: true }) } catch { /* ignore */ }
  if (document.fonts?.ready) {
    try { await document.fonts.ready } catch { /* ignore */ }
  }

  const pdf = new JsPDF({ orientation: 'landscape', unit: 'px', format: [1280, 720], compress: true })

  enableCaptureMode()
  try {
    for (let i = 0; i < total; i++) {
      setActive(i)
      await nextTick()
      await finalizeSlide?.(i)

      const slide = stageEl.querySelector('.slide.active') ?? stageEl
      await waitForSlideReady(slide)

      const canvas = await snapdom.toCanvas(stageEl, {
        scale,
        dpr: 1,
        embedFonts: true,
        backgroundColor,
      })

      // JPEG de alta qualidade: fidelidade mantida com arquivo ~10x menor que PNG.
      const dataUrl = canvas.toDataURL('image/jpeg', quality)

      if (i > 0) pdf.addPage([1280, 720], 'landscape')
      pdf.addImage(dataUrl, 'JPEG', 0, 0, 1280, 720)
      onProgress?.(i + 1, total)
    }

    pdf.save(filename)
  } finally {
    disableCaptureMode()
  }
}
