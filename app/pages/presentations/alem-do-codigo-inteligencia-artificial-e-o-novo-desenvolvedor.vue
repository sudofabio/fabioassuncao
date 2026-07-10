<template>
  <DeckStage
    ref="deckRef"
    :theme="theme"
    exit-to="/presentations"
    download-name="alem-do-codigo-ia-e-o-novo-desenvolvedor.pdf"
    aria-label="Além do código: Inteligência artificial e o novo desenvolvedor"
  >
    <!-- 26 slides — ordem exata do APRESENTACAO_BASE.md (blocos A–G) -->
    <!-- Bloco A — Abertura -->
    <Slide01Capa />
    <Slide02QuemSou />
    <Slide03Reflexao />
    <!-- Bloco B — Contextualização -->
    <Slide04Desenvolvimento />
    <Slide05LinhaDoTempo />
    <Slide06DevMorreu />
    <Slide07AntiHype />
    <!-- Bloco C — A virada -->
    <Slide08Commodity />
    <Slide10Barreira />
    <!-- Bloco D — O mapa da IA (contextualização acessível) -->
    <SlideMapaIaLlm />
    <SlideMapaProvedores />
    <SlideMapaModeloAgente />
    <Slide09Ecossistema />
    <SlideEditoresDna />
    <SlideMapaMcpSkills />
    <Slide11Iceberg />
    <!-- Bloco D — O método -->
    <Slide12Niveis />
    <Slide13TddSdd />
    <Slide14FluxoSdd />
    <Slide15PromptVsSpec />
    <!-- Bloco E — Mercado em números -->
    <Slide16Pandemia />
    <Slide17Historia />
    <Slide18Salarios />
    <Slide19Trabalho />
    <!-- Bloco F — Visão crítica -->
    <Slide20Bumerangue />
    <Slide21Citacao />
    <Slide22Bolha />
    <!-- Bloco G — Fechamento -->
    <Slide23NovoDev />
    <Slide24Fundamentos />
    <Slide25MensagemFinal />
    <Slide26Encerramento />
  </DeckStage>
</template>

<script setup>
import { alemDoCodigoTheme } from '~/themes/alem-do-codigo'
import Slide01Capa from '~/components/slides/alem-do-codigo/Slide01Capa.vue'
import Slide02QuemSou from '~/components/slides/alem-do-codigo/Slide02QuemSou.vue'
import Slide03Reflexao from '~/components/slides/alem-do-codigo/Slide03Reflexao.vue'
import Slide04Desenvolvimento from '~/components/slides/alem-do-codigo/Slide04Desenvolvimento.vue'
import Slide05LinhaDoTempo from '~/components/slides/alem-do-codigo/Slide05LinhaDoTempo.vue'
import Slide06DevMorreu from '~/components/slides/alem-do-codigo/Slide06DevMorreu.vue'
import Slide07AntiHype from '~/components/slides/alem-do-codigo/Slide07AntiHype.vue'
import Slide08Commodity from '~/components/slides/alem-do-codigo/Slide08Commodity.vue'
import Slide09Ecossistema from '~/components/slides/alem-do-codigo/Slide09Ecossistema.vue'
import Slide10Barreira from '~/components/slides/alem-do-codigo/Slide10Barreira.vue'
import SlideMapaIaLlm from '~/components/slides/alem-do-codigo/SlideMapaIaLlm.vue'
import SlideMapaProvedores from '~/components/slides/alem-do-codigo/SlideMapaProvedores.vue'
import SlideMapaModeloAgente from '~/components/slides/alem-do-codigo/SlideMapaModeloAgente.vue'
import SlideEditoresDna from '~/components/slides/alem-do-codigo/SlideEditoresDna.vue'
import SlideMapaMcpSkills from '~/components/slides/alem-do-codigo/SlideMapaMcpSkills.vue'
import Slide11Iceberg from '~/components/slides/alem-do-codigo/Slide11Iceberg.vue'
import Slide12Niveis from '~/components/slides/alem-do-codigo/Slide12Niveis.vue'
import Slide13TddSdd from '~/components/slides/alem-do-codigo/Slide13TddSdd.vue'
import Slide14FluxoSdd from '~/components/slides/alem-do-codigo/Slide14FluxoSdd.vue'
import Slide15PromptVsSpec from '~/components/slides/alem-do-codigo/Slide15PromptVsSpec.vue'
import Slide16Pandemia from '~/components/slides/alem-do-codigo/Slide16Pandemia.vue'
import Slide17Historia from '~/components/slides/alem-do-codigo/Slide17Historia.vue'
import Slide18Salarios from '~/components/slides/alem-do-codigo/Slide18Salarios.vue'
import Slide19Trabalho from '~/components/slides/alem-do-codigo/Slide19Trabalho.vue'
import Slide20Bumerangue from '~/components/slides/alem-do-codigo/Slide20Bumerangue.vue'
import Slide21Citacao from '~/components/slides/alem-do-codigo/Slide21Citacao.vue'
import Slide22Bolha from '~/components/slides/alem-do-codigo/Slide22Bolha.vue'
import Slide23NovoDev from '~/components/slides/alem-do-codigo/Slide23NovoDev.vue'
import Slide24Fundamentos from '~/components/slides/alem-do-codigo/Slide24Fundamentos.vue'
import Slide25MensagemFinal from '~/components/slides/alem-do-codigo/Slide25MensagemFinal.vue'
import Slide26Encerramento from '~/components/slides/alem-do-codigo/Slide26Encerramento.vue'

definePageMeta({ layout: 'presentation' })

const theme = alemDoCodigoTheme

// Auto-exportação quando aberto via `?export=pdf`.
const deckRef = ref(null)
const route = useRoute()
onMounted(async () => {
  if (route.query.export !== 'pdf') return
  if (document.fonts?.ready) { try { await document.fonts.ready } catch { /* ignore */ } }
  deckRef.value?.onDownload()
})

useHead({
  title: 'Além do código — IA e o novo desenvolvedor · Apresentação',
  meta: [
    {
      name: 'description',
      content:
        'Apresentação do 10º Talk — Vale do Pindaré Tech (IFMA Santa Inês/MA): a evolução do mercado, a comoditização do código e o novo papel do desenvolvedor.',
    },
  ],
})
</script>
