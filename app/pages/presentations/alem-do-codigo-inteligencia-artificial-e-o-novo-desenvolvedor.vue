<template>
  <DeckStage
    ref="deckRef"
    :theme="theme"
    exit-to="/presentations"
    download-name="alem-do-codigo-ia-e-o-novo-desenvolvedor.pdf"
    aria-label="Além do código: Inteligência artificial e o novo desenvolvedor"
  >
    <!-- ~32 slides — estrutura v3 (ANALISE_MELHORIAS §3). Ordem controla a
         apresentação; cada slide lê NOTAS[i] por índice fixo. -->
    <!-- Bloco A — Abertura -->
    <Slide01Capa />
    <Slide02QuemSou />
    <SlideSumario />
    <Slide03Reflexao />
    <!-- Bloco B — Contexto rápido (04+05 e 06+07 fundidos) -->
    <Slide05LinhaDoTempo />
    <Slide06DevMorreu />
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
    <!-- Bloco E — O método / SDD -->
    <Slide11Iceberg />
    <SlideEvolucaoIA />
    <Slide12Niveis />
    <Slide13TddSdd />
    <Slide14FluxoSdd />
    <Slide15PromptVsSpec />
    <SlideSddSequencia />
    <!-- Bloco F — Na prática -->
    <SlideIssueFlow />
    <Slide24Fundamentos />
    <!-- Bloco G — Mercado & carreira (16+17 fundidos) -->
    <Slide17Historia />
    <Slide18Salarios />
    <Slide19Trabalho />
    <!-- Bloco H — Visão crítica -->
    <Slide20Bumerangue />
    <Slide21Citacao />
    <Slide22Bolha />
    <!-- Bloco I — Fechamento -->
    <Slide23NovoDev />
    <Slide25MensagemFinal />
    <SlideProvocacoes />
    <Slide26Encerramento />
  </DeckStage>
</template>

<script setup>
import { alemDoCodigoTheme } from '~/themes/alem-do-codigo'
import Slide01Capa from '~/components/slides/alem-do-codigo/Slide01Capa.vue'
import Slide02QuemSou from '~/components/slides/alem-do-codigo/Slide02QuemSou.vue'
import Slide03Reflexao from '~/components/slides/alem-do-codigo/Slide03Reflexao.vue'
import SlideSumario from '~/components/slides/alem-do-codigo/SlideSumario.vue'
import Slide05LinhaDoTempo from '~/components/slides/alem-do-codigo/Slide05LinhaDoTempo.vue'
import Slide06DevMorreu from '~/components/slides/alem-do-codigo/Slide06DevMorreu.vue'
import Slide08Commodity from '~/components/slides/alem-do-codigo/Slide08Commodity.vue'
import Slide09Ecossistema from '~/components/slides/alem-do-codigo/Slide09Ecossistema.vue'
import Slide10Barreira from '~/components/slides/alem-do-codigo/Slide10Barreira.vue'
import SlideMapaIaLlm from '~/components/slides/alem-do-codigo/SlideMapaIaLlm.vue'
import SlideMapaProvedores from '~/components/slides/alem-do-codigo/SlideMapaProvedores.vue'
import SlideMapaModeloAgente from '~/components/slides/alem-do-codigo/SlideMapaModeloAgente.vue'
import SlideEditoresDna from '~/components/slides/alem-do-codigo/SlideEditoresDna.vue'
import SlideMapaMcpSkills from '~/components/slides/alem-do-codigo/SlideMapaMcpSkills.vue'
import Slide11Iceberg from '~/components/slides/alem-do-codigo/Slide11Iceberg.vue'
import SlideEvolucaoIA from '~/components/slides/alem-do-codigo/SlideEvolucaoIA.vue'
import Slide12Niveis from '~/components/slides/alem-do-codigo/Slide12Niveis.vue'
import Slide13TddSdd from '~/components/slides/alem-do-codigo/Slide13TddSdd.vue'
import Slide14FluxoSdd from '~/components/slides/alem-do-codigo/Slide14FluxoSdd.vue'
import Slide15PromptVsSpec from '~/components/slides/alem-do-codigo/Slide15PromptVsSpec.vue'
import SlideSddSequencia from '~/components/slides/alem-do-codigo/SlideSddSequencia.vue'
import SlideIssueFlow from '~/components/slides/alem-do-codigo/SlideIssueFlow.vue'
import Slide17Historia from '~/components/slides/alem-do-codigo/Slide17Historia.vue'
import Slide18Salarios from '~/components/slides/alem-do-codigo/Slide18Salarios.vue'
import Slide19Trabalho from '~/components/slides/alem-do-codigo/Slide19Trabalho.vue'
import Slide20Bumerangue from '~/components/slides/alem-do-codigo/Slide20Bumerangue.vue'
import Slide21Citacao from '~/components/slides/alem-do-codigo/Slide21Citacao.vue'
import Slide22Bolha from '~/components/slides/alem-do-codigo/Slide22Bolha.vue'
import Slide23NovoDev from '~/components/slides/alem-do-codigo/Slide23NovoDev.vue'
import Slide24Fundamentos from '~/components/slides/alem-do-codigo/Slide24Fundamentos.vue'
import Slide25MensagemFinal from '~/components/slides/alem-do-codigo/Slide25MensagemFinal.vue'
import SlideProvocacoes from '~/components/slides/alem-do-codigo/SlideProvocacoes.vue'
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
