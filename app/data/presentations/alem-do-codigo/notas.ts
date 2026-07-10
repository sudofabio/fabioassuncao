/**
 * Notas do apresentador — roteiro de fala revisado (10/07/2026), alinhado à
 * ordem visual atual dos slides (v3) e às pesquisas de referência. Cada nota é
 * a fala real do slide, com passos de animação marcados entre colchetes.
 * Exibidas no presenter mode (?presenter=1) e usáveis como plano B impresso.
 * A linha iniciada por "→" é a frase de transição para o próximo slide.
 */

export interface NotaSlide {
  title: string
  notes: string
}

export const NOTAS: NotaSlide[] = [
  {
    title: '1 · Capa',
    notes: `[Passos: 0]
Boa noite! Muito obrigado pelo convite do Vale do Pindaré Tech, meu amigo Wesley, é um prazer estar aqui. Nos próximos trinta minutos eu quero conversar com vocês sobre o que a inteligência artificial está fazendo de verdade com a nossa profissão. Sem hype e sem terrorismo, a partir do que eu vivo no mercado todos os dias.
→ Antes de falar de IA, deixa eu me apresentar rapidinho, porque a visão que eu trago aqui vem de onde eu estive.`,
  },
  {
    title: '2 · Quem sou eu',
    notes: `[Passos: 1] (os pilares acendem juntos)
Eu sou desenvolvedor de software, Tech Lead e empreendedor, com mais de quinze anos de experiência em backend, arquitetura de sistemas, cloud e liderança técnica. Passei esse tempo construindo soluções escaláveis e conectando três mundos que quase nunca conversam: engenharia, produto e negócio. [Avançar] Tudo o que eu vou falar aqui passou pelo filtro dessa vivência, o que eu gosto de chamar de repertório de trincheira. Não é teoria de slide, é o que eu vi funcionar e falhar na prática.
→ Antes de entrar no assunto, deixa eu te mostrar rapidinho o mapa de hoje.`,
  },
  {
    title: '4 · Desenvolver ≠ digitar código (slide fundido — não exibido)',
    notes: `[Slide não exibido na versão atual. O conteúdo foi incorporado ao slide "Desenvolver ≠ digitar código" (Reflexão) e à "Linha do tempo".]`,
  },
  {
    title: '— · Software está em tudo (slide fundido — não exibido)',
    notes: `[Slide não exibido na versão atual. O conteúdo foi incorporado ao slide "Software em tudo + linha do tempo".]`,
  },
  {
    title: '5 · Software em tudo + linha do tempo',
    notes: `[Passos: 4] (uma era por clique; a era atual acende com glow)
Quando eu falo em desenvolvimento, eu falo de tudo: os apps do seu celular, sites, sistemas de empresas, automações, plataformas de governo, integrações. Software está em tudo. [Avançar] E a forma de construir isso mudou muito. Quando eu comecei, não existia essa divisão de front, back, DevOps, SRE, QA. Você era desenvolvedor, ponto. Ou fazia web, ou fazia desktop. Depois o mercado se organizou: vieram as especializações, os times maiores, e a cascata deu lugar ao ágil. E agora a gente vive a era da IA e dos agentes.
→ E repara numa coisa: em cada uma dessas viradas, alguém apareceu pra decretar a morte do desenvolvedor.`,
  },
  {
    title: '6 · "O dev já morreu" + anti-hype',
    notes: `[Passos: 3] (① carimbos R.I.P. ② frase-síntese ③ anti-hype "nem apocalipse, nem paraíso") (humor leve, tom firme)
O low-code ia acabar com o dev. O no-code ia acabar com o dev. Os geradores de site, os CMS, os frameworks... e olha, aqui estamos nós. [Avançar] O que cada uma dessas ondas fez de verdade foi subir o nível de abstração: menos digitação mecânica, mais pensamento sistêmico. Com a IA é o mesmo filme, só que muito mais rápido. [Avançar] Mas se não é o apocalipse, também não é o paraíso que alguns gurus vendem por aí. Não existe "fature cinquenta mil sem programar". O que existe é fundamentos, mais método, mais experiência. Essa palestra é o oposto do hype.
→ Dito isso, tem uma mudança real e um pouco incômoda acontecendo: o código virou commodity.`,
  },
  {
    title: '— · Anti-hype (slide fundido — não exibido)',
    notes: `[Slide não exibido na versão atual. O anti-hype foi incorporado ao slide "O dev já morreu".]`,
  },
  {
    title: '7 · Código virou commodity',
    notes: `[Passos: 2] (① a frase de impacto ② os preços por mês) ⭐ momento wow
Hoje, com uma assinatura de mais ou menos vinte dólares por mês, qualquer pessoa gera código com Codex, Claude Code, Gemini CLI, Cursor, Copilot. [Avançar] E tem planos de cem, duzentos dólares, algo como quinhentos a mil reais, que geram um volume absurdo de código. Ou seja: escrever sintaxe deixou de ser o gargalo. Só que atenção, isso não quer dizer que todo código gerado presta. E é exatamente aí que mora a oportunidade pra quem sabe garantir qualidade.
→ E o efeito disso no mercado é direto: a barreira de entrada pra criar software despencou.`,
  },
  {
    title: '12 · O arsenal do desenvolvedor',
    notes: `[Passos: 3] (uma família por clique)
São três famílias de ferramentas. [Avançar] A primeira, de prototipação no navegador: Lovable, v0, Bolt, Replit. Servem pra validar uma ideia, um MVP descartável. [Avançar] A segunda, os editores com IA: VS Code com Copilot, Cursor, Antigravity. É o dia a dia dentro de uma base de código real. [Avançar] E a terceira, os agentes de terminal: Claude Code, Codex, Gemini CLI. É automação profissional, tarefa de repositório inteiro, e é onde o meu Issue Flow vive. Não interessa comparar recurso a recurso; o que importa é o uso de cada uma.
→ E repara que três desses editores parecem concorrentes, mas têm exatamente o mesmo DNA.`,
  },
  {
    title: '8 · A barreira despencou',
    notes: `[Passos: 2] (① os dois cenários de antes ② o cenário com IA + a punchline) ⭐ números protagonistas
Pensa em como era ter um protótipo antes. Você contratava uma empresa, e isso custava de vinte a cem mil reais. Ou um freelancer, de dez a vinte mil. [Avançar] E hoje? Uma assinatura de vinte dólares e algumas horas descrevendo o que você quer. Isso muda o mercado profundamente. E o profissional genérico, aquele que fazia de tudo um pouco e de qualquer jeito, é o primeiro a perder espaço. [Falar com os empreendedores da plateia]
→ Mas antes de avançar no método, a gente precisa entender uma coisa: afinal, o que é essa tal de IA?`,
  },
  {
    title: '15 · Protótipo ≠ Produto',
    notes: `[Passos: 3] (① o topo "FUNCIONA" ② os itens submersos ③ a frase final) (falar com calma)
Protótipo não é produto. [Avançar] Os dois podem funcionar na demonstração, tudo bonitinho. Mas o que acontece quando chega tráfego real? Uma tentativa de invasão? A necessidade de evoluir o sistema? A LGPD batendo na porta? [Avançar] É bem aí, embaixo da linha d'água, que se separa o código de qualquer jeito do produto consistente. [Avançar] E é por isso que empresas pagam dezenas, às vezes centenas de milhares de reais por um produto, e não por um protótipo.
→ E pra construir produto de verdade com IA, a gente precisa de método. Deixa eu te mostrar rapidinho como o dev chegou até aqui.`,
  },
  {
    title: '17 · Vibe, Prompt, Loop',
    notes: `[Passos: 3] (um nível por clique; o ciclo gira no nível 3)
[Avançar] Nível um, o Vibe Coding: você descreve a ideia e deixa a IA gerar. É ótimo pra explorar, mas perigoso pra entregar, porque vira um loop infinito de bugs. [Avançar] Nível dois, o Prompt Engineering: você dá papel, contexto, restrições e critérios de aceite. O código já sai bem mais adaptado à sua stack. [Avançar] E o nível três, o Loop Engineering: aqui você desenha um agente que age, observa, corrige e repete, com limites de custo, de iteração e regras de parada. Nesse nível você deixa de ser digitador e vira arquiteto do processo.
→ E existe um quarto elemento, que virou a habilidade número um de 2026.`,
  },
  {
    title: '18 · TDD → SDD ★ CLÍMAX',
    notes: `[Passos: 2] (① morph TDD→SDD ② selo "#1 skill 2026") ⭐⭐⭐ o slide mais importante
Quem está há mais tempo na área lembra do TDD: o teste guiava o código. [Avançar] Agora a lógica virou: a especificação guia a implementação, e a IA implementa. É o Spec-Driven Development. E o ponto é esse: se você não consegue descrever o problema com precisão, a IA te entrega uma solução tecnicamente correta e completamente inútil pro negócio. Ou seja, a pergunta não é mais SE você vai usar IA. É COMO: de forma profissional, com segurança e eficiência. [Pausa, contato visual com a plateia]
→ E o SDD não é teoria. É um fluxo de trabalho concreto.`,
  },
  {
    title: '19 · O fluxo do SDD',
    notes: `[Passos: 5] (um nó por clique)
São cinco etapas. [Avançar] Constitution: os princípios e as regras de ouro do projeto. [Avançar] Specify: o quê e por quê, os requisitos funcionais e não funcionais. [Avançar] Plan: a arquitetura e a stack. [Avançar] Tasks: a decomposição em tarefas atômicas. [Avançar] E Implement: os agentes executam, sempre com validação humana. No fim, tudo isso vira artefato: PRD, regras de negócio, diretrizes de segurança, critérios de qualidade.
→ Quer ver na prática a diferença que isso faz? Vamos comparar os dois jeitos.`,
  },
  {
    title: '20 · Prompt cru vs Spec',
    notes: `[Passos: 4] (① prompt cru ② resultado caótico ③ spec ④ resultado estruturado)
De um lado, o prompt cru. [Avançar] "Faça um app de tarefas." [Avançar] O resultado é genérico: sem autenticação decente, sem padrão, com dívida técnica já embutida. [Avançar] Do outro lado, a especificação: com contexto, stack definida, regras de negócio e critérios de segurança. [Avançar] O resultado é aderente, testável e evoluível. É exatamente assim que empresas sérias e times maduros trabalham hoje.
→ E esse método, na prática, é uma sequência bem concreta de etapas.`,
  },
  {
    title: '— · Pandemia (slide fundido — não exibido)',
    notes: `[Slide não exibido na versão atual. O contexto da pandemia foi incorporado ao slide "Pandemia + minha história".]`,
  },
  {
    title: '24 · Pandemia + minha história ♥',
    notes: `[Passos: 4] (uma cena por clique) (storytelling: a fala carrega, o slide é minimalista)
Na pandemia, o mercado de tech ferveu ao contrário de todo mundo: em vez de crise, faltou gente. As propostas dobravam salário da noite pro dia, e 75% da galera estava remota. E eu vivi isso na pele. [Avançar] Em 2022, a minha empresa sofria dos dois lados: clientes quebrando contrato, e os nossos próprios devs recebendo propostas que dobravam o salário, de sete pra quatorze, quinze mil. Impossível competir. [Avançar] Eu recebia mais de vinte mensagens de recrutador por semana. Aí eu tomei uma decisão difícil: pausei a operação e fui testar o mercado. Todo mundo da equipe se recolocou muito bem. [Avançar] E eu cheguei a trabalhar full-time pra duas, às vezes três empresas ao mesmo tempo, Brasil e Estados Unidos. Pra ter o mesmo líquido com a minha empresa, eu precisaria vender mais de um milhão de reais por mês. [Avançar] Era um ponto fora da curva. E ponto fora da curva não dura.
→ E o que aconteceu depois? O mercado voltou pro chão. Os números mostram isso muito bem.`,
  },
  {
    title: '25 · Salários 2021–2026',
    notes: `[Passos: 5] (① Júnior ② Pleno ③ Sênior ④ Especialista ⑤ callouts) [apontar para o gráfico]
Olha a evolução de 2021 a 2026. [Avançar] Júnior: de dois mil e novecentos pra cinco mil, mais 71%. [Avançar] Pleno: de cinco mil e seiscentos pra oito mil e quinhentos, mais 51%. [Avançar] Sênior: começou em dez mil e seiscentos, deu um salto na pandemia, chegou ao pico de quinze mil e seiscentos em 2025, e teve a primeira queda nominal agora em 2026, pra quatorze mil e seiscentos. [Avançar] E o Especialista, o Tech Lead: de oito mil e setecentos pra vinte mil e seiscentos, mais 136%. O único nível que cresceu todos os anos, sem exceção. [Avançar] A leitura é essa: o mercado se seniorizou. Ele paga cada vez mais por quem tem visão de negócio e fluência em IA, e aperta o meio e o topo genérico. Só pra ter ideia, hoje 98,5% dos devs já usam IA. E um dado nosso: o salário médio de dev no Maranhão saiu de três mil e setecentos em 2021 pra dez mil em 2026. Quase triplicou.
→ E além de quanto se ganha, mudou também onde e como a gente trabalha.`,
  },
  {
    title: '26 · Onde o novo dev trabalha',
    notes: `[Passos: 3] (① o donut ② os callouts ③ "de Santa Inês para o mundo")
Eu trabalho remoto desde 2015, antes de virar moda. [Avançar] A pandemia universalizou isso: 75% dos devs estavam remotos em 2022. De lá pra cá o presencial vem pressionando de volta, e hoje a gente tem 60% remoto, 22% híbrido e 17% presencial. [Avançar] Quase quatro em cada dez devs sentem pressão pra voltar ao escritório, mas 77% dizem que são mais produtivos em casa. [Avançar] E o remoto não mudou só o "onde". 14% dos devs brasileiros já trabalham pra empresas do exterior, e 22% têm mais de um contrato. Ou seja: você, aqui de Santa Inês, pode trabalhar pro mundo inteiro.
→ Agora, nem tudo são flores. Vamos falar do que as manchetes não contam.`,
  },
  {
    title: '27 · O efeito bumerangue',
    notes: `[Passos: 4] (① 32% ② 55% ③ 50% ④ motivos) (são dados do mercado americano)
Tem um fenômeno já documentado, que eu chamo de bumerangue da IA. [Avançar] Uma pesquisa da Robert Half com dois mil gestores nos Estados Unidos: 32% eliminaram cargos por ganho de produtividade com IA, e precisaram recontratar pra mesma função. [Avançar] A Forrester apontou que 55% dos empregadores se arrependeram de ter demitido por causa da IA. [Avançar] E a Gartner prevê: metade das empresas que trocaram atendimento ou operações por IA vão recriar essas funções até 2027. [Avançar] Por quê? A IA não tem contexto institucional, isso pesou pra 40%. Exigiu mais supervisão e controle de qualidade, 38%. E os ganhos vieram menores que o esperado, 35%.
→ E tem gente muito grande dizendo isso com todas as letras.`,
  },
  {
    title: '28 · "Narrativa conveniente"',
    notes: `[Passos: 1] (a citação surge por linhas) (deixe a plateia LER antes de comentar)
[Ler a citação em voz alta] Jensen Huang, o CEO da NVIDIA, foi direto: pra muitos CEOs, a narrativa que liga a IA à perda de emprego é simplesmente conveniente demais. Ele ainda provocou: como é possível a IA ter se tornado realmente útil há só seis meses e, mesmo assim, empresas dizerem que demitem por causa dela há dois anos? Não faz sentido. E completou que isso era só uma forma de parecerem espertos, e que estamos assustando as pessoas de forma irresponsável. O recado que eu tiro daqui é esse: o perigo real não é a IA roubar o seu emprego. É gestor usando o hype pra justificar corte.
→ E tem mais um risco no horizonte, que quase ninguém quer encarar: a conta.`,
  },
  {
    title: '29 · Quem paga essa conta?',
    notes: `[Passos: 4] (① Pichai ② 1,5% ③ subsídio ④ frase-síntese) (tom de olhos abertos, não de pânico)
O próprio CEO do Google, Sundar Pichai, reconhece que há elementos racionais e irracionais no boom atual, como teve na bolha ponto-com. E avisa: se ela estourar, nenhuma empresa fica imune, incluindo a gente. [Avançar] Segundo dado: a IA já consome 1,5% da eletricidade global, segundo a Agência Internacional de Energia. [Avançar] E o terceiro: aquele acesso de vinte dólares por mês existe porque tem empresa queimando bilhões pra ganhar mercado. É subsídio. No médio prazo, ou você paga mais, ou a ferramenta muda, ou ela some. [Avançar] E a sua proteção contra tudo isso não é a ferramenta. São os fundamentos.
→ Então, juntando tudo: afinal, quem é o novo desenvolvedor?`,
  },
  {
    title: '30 · O novo desenvolvedor',
    notes: `[Passos: 2] (① o "digitador" ② a transformação em "arquiteto") (tom de promoção, não de humilhação)
A IA não elimina o desenvolvedor. Ela promove o desenvolvedor. [Avançar] De digitador de código a arquiteto de soluções. O profissional genérico, que só faz o feijão com arroz, esse perde espaço mesmo, sem dó. Mas quem entende produto, arquitetura, segurança, requisitos e negócio nunca foi tão valioso. Porque a IA faz as duas coisas ao mesmo tempo: reduz a barreira de entrada e aumenta a exigência de maturidade.
→ E eu quero fechar com uma única pergunta, pra vocês levarem pra casa.`,
  },
  {
    title: '23 · Fundamentos concretos',
    notes: `[Passos: 5] (① a camada volátil ②③④⑤ os quatro grupos + roadmap.sh) (falar direto com os estudantes do IFMA)
Cursor, Claude Code, v0: esses nomes vão mudar nos próximos meses. É a camada volátil. [Avançar] O que não muda são quatro grupos concretos, e cada um tem um motivo claro de por que a IA não te dispensa. [Avançar] Máquina e terminal: o agente roda comandos; se você não lê a saída, não sabe se ele acertou. [Avançar] Versionamento: o fluxo de IA é issue, branch, PR, review; sem git, você não participa. [Avançar] Web e integração: a IA gera o endpoint, mas é você que confere status code, CORS, token. [Avançar] Empacotamento e entrega: a IA escreve o app, mas não sabe por que o container não sobe, nem lê o log das duas da manhã por você. [Avançar] E se você não sabe por onde começar, o roadmap.sh é um ótimo mapa de estudos. É uma recomendação, não conteúdo pronto. O recado é: aprenda os fundamentos usando as ferramentas, não use as ferramentas pra pular os fundamentos.
→ Bom, falei bastante de técnica. Agora vamos pro que todo mundo quer saber: mercado, salário e carreira. E eu vou começar por uma história pessoal.`,
  },
  {
    title: '31 · Mensagem final ★',
    notes: `[Passos: 1] (a frase surge palavra a palavra; as duas últimas com pausa maior) ⭐ encerramento emocional
Se a IA pode escrever qualquer código que você pedir, em segundos... você tem o repertório pra saber se o que ela entregou é o que o seu negócio precisa? O novo desenvolvedor não compete com a máquina digitando. Ele escreve a partitura que a orquestra executa. Então não lute contra a IA. Torne-se indispensável pra ela. [Silêncio de 2 segundos]
→ E antes de a gente abrir pra conversa, quero deixar quatro provocações pra vocês.`,
  },
  {
    title: '33 · Obrigado! Vamos conversar?',
    notes: `[Passos: 0] (fica projetado durante o Q&A)
Muito obrigado! Obrigado ao Vale do Pindaré Tech, ao IFMA e a vocês, que ficaram até aqui. [Apontar o QR] A apresentação completa está nesse QR, com todos os links e as referências do que eu citei. Se der tempo, agora vem a melhor parte: eu quero ouvir vocês. Vamos conversar.`,
  },
  // ————————————————————————————————————————————————————————————
  // Bloco "O mapa da IA" (D1–D5) — inseridos após "A barreira despencou".
  // Índices anexados ao fim; a ordem visual é controlada pelo template.
  // ————————————————————————————————————————————————————————————
  {
    title: '9 · O que é essa IA?',
    notes: `[Passos: 3] (① a analogia ② previsão do próximo token ③ a ressalva) (~60s, sem matemática)
Sem mistério: um LLM é, no fundo, um autocompletar gigante. Ele foi treinado lendo bilhões de textos e códigos, e faz uma coisa só: prever o próximo pedacinho, a próxima palavra, o próximo trecho de código. [Avançar] É igual ao teclado do seu celular que sugere a próxima palavra, só que muitíssimo mais poderoso. [Avançar] E aqui vai uma ressalva honesta: ele não entende como a gente entende, ele prevê. Por isso às vezes erra com toda a confiança do mundo. E é por isso que você, humano, continua no comando.
→ E quem constrói esses modelos? São pouquíssimas empresas.`,
  },
  {
    title: '10 · Quem é quem',
    notes: `[Passos: 2] (① os provedores ② a mensagem-chave)
Pouquíssimas empresas treinam os modelos base. A OpenAI, com o ChatGPT e o Codex. A Anthropic, com o Claude, nos tamanhos Opus, Sonnet e Haiku. O Google, com o Gemini e o Antigravity. A Meta, com o Llama, que é aberto. E a Mistral, europeia, também aberta. [Avançar] Guardem essa ideia: pouquíssimas empresas treinam os modelos. Todo o resto do ecossistema constrói em cima delas.
→ Agora, modelo é uma coisa. Ferramenta, editor e agente são outra. Vamos separar esses nomes.`,
  },
  {
    title: '11 · Modelo × Ferramenta × Editor × Agente',
    notes: `[Passos: 4] (① Modelo/motor ② Ferramenta/mãos ③ Editor/carro ④ Agente/piloto)
Uma analogia pra fixar de vez. [Avançar] O modelo é o motor: o cérebro que prevê os tokens, mas sozinho não anda. [Avançar] A ferramenta são as mãos, o que dá ações ao modelo: rodar um comando, ler um arquivo, buscar na web. [Avançar] O editor é o carro: onde você senta e dirige, dentro do seu código. VS Code, Cursor, Antigravity. [Avançar] E o agente é o piloto automático: o modelo agindo em loop, que planeja, executa, observa o resultado e corrige. Mas quem define o destino é você.
→ Com esse vocabulário na mão, o arsenal de ferramentas faz muito mais sentido.`,
  },
  {
    title: '13 · 3 editores, 1 DNA',
    notes: `[Passos: 3] (① os 3 editores ② a revelação ③ a regra de ouro)
Esses três editores parecem rivais: VS Code com Copilot, Cursor, e o Antigravity, do Google. [Avançar] Só que tem um segredo: por baixo, os três são o mesmo VS Code. O Cursor é um fork do VS Code, o Antigravity também. O que muda é a camada de agente que cada um coloca por cima. [Avançar] Então fica a regra de ouro: aprenda o VS Code de verdade e você transita entre todos eles sem esforço. O Antigravity, inclusive, é gratuito pra uso individual e roda vários agentes em paralelo.
→ Falta só uma última peça de vocabulário: MCP, skills e agentes.`,
  },
  {
    title: '14 · MCP, Skills, agentes e subagentes',
    notes: `[Passos: 4] (① MCP ② Agent Skills ③ Agentes ④ Subagentes) (~60s)
Três palavras, quatro na verdade, que vocês vão ouvir muito. [Avançar] MCP, de Model Context Protocol: um padrão aberto que conecta o modelo a ferramentas e dados. Pensem nele como a porta USB-C da IA. [Avançar] Agent Skills: pacotes de conhecimento, uma pasta com instruções que ensina o agente a fazer uma tarefa repetível. [Avançar] Agentes: é juntar tudo isso num fluxo que roda sozinho, sob a sua supervisão. [Avançar] E os subagentes: especialistas que o agente principal aciona pra uma tarefa específica, pesquisar, testar, revisar, cada um no seu contexto.
→ Agora que a gente tem o vocabulário, vamos pro método. E o método começa com uma distinção que separa amador de profissional.`,
  },
  // ————————————————————————————————————————————————————————————
  // Bloco SDD — narrativa de evolução e a sequência de 9 etapas.
  // ————————————————————————————————————————————————————————————
  {
    title: '16 · Como chegamos até aqui',
    notes: `[Passos: 7] (uma etapa por clique; a caixa do Vibe Coding aparece no passo 4)
Uma linha do tempo bem rápida. [Avançar] Lá atrás, Google e Stack Overflow: a resposta estava num fórum, você copiava e adaptava. [Avançar] Fim de 2022, o ChatGPT: a resposta virou conversa. [Avançar] Em 2023, Copilot e Cursor colocam a IA dentro do editor, o famoso ghost text. [Avançar] Fevereiro de 2025, o Vibe Coding: descrever a ideia e deixar a IA gerar o app inteiro. O termo foi cunhado pelo Andrej Karpathy num post, e virou até palavra do ano. [Avançar] Em paralelo, veio uma onda de exageros e promessas oportunistas. [Avançar] E aí o mercado amadureceu: boas práticas, revisão, engenharia de verdade. [Avançar] E é daí que nasce o SDD.
→ Porque de copiar resposta de fórum a copiar resposta de chat, o problema sempre foi o mesmo: contexto. E dá pra lidar com isso em três níveis de maturidade.`,
  },
  {
    title: '21 · As 9 etapas, do problema ao PR',
    notes: `[Passos: 9] (uma etapa por clique; a árvore de arquivos cresce junto)
O SDD, do começo ao fim, é uma sequência. [Avançar] Um: eu tenho um problema real, uma frase vaga de usuário. Dois: transformo isso numa intenção clara. Três: gero uma especificação. Quatro: refino requisitos e restrições, stack, regras, segurança. Cinco: valido o escopo com critérios de aceite. Seis: quebro tudo em tarefas atômicas. Sete: implemento com apoio da IA. Oito: reviso, testo e ajusto, e é aqui que mora o loop de correção. Nove: integro ao projeto num Pull Request.
→ E não é teoria. Deixa eu te mostrar isso rodando de verdade, com o Issue Flow.`,
  },
  // ————————————————————————————————————————————————————————————
  // Bloco "Na prática" — Issue Flow rodando (só comandos confirmados).
  // ————————————————————————————————————————————————————————————
  {
    title: '22 · Issue Flow rodando',
    notes: `[Passos: 6] (① issue+generate ② prd ③ plan ④ execute ⑤ review FAIL→PASS ⑥ pr) (screencast pré-gravado, não rodar ao vivo)
Isto aqui é o Issue Flow, uma ferramenta que eu mantenho: skills, mais agente, mais automação. [Avançar] Eu descrevo o problema numa frase e ele cria a issue quarenta e dois. [Avançar] prd: ele gera a especificação. [Avançar] plan: quebra em tarefas. [Avançar] execute: o agente implementa, story por story. [Avançar] E aqui está o pulo do gato: review. Ele testa e reprova, dá FAIL. Aí entra o loop de autocorreção: ele corrige e revalida, até três ciclos, até dar PASS. [Avançar] E por fim o pr: abre o Pull Request pronto pra revisão humana. Esse momento do FAIL virando PASS é o que eu chamo de meio-loop: o valor não está só em rodar o loop, está em ter dentro dele algo capaz de dizer "não". Um teste, um review, um erro real.
→ Mas tudo isso só funciona se você domina o que está por baixo. Os fundamentos.`,
  },
  // ————————————————————————————————————————————————————————————
  // Fechamento — provocações / Q&A (antes do slide de contato).
  // ————————————————————————————————————————————————————————————
  {
    title: '32 · Provocações para o debate',
    notes: `[Passos: 4] (uma provocação por clique) (tom de convite ao debate)
Quatro perguntas pra levar pra casa. [Avançar] Um: se a IA escreve o código, o que exatamente você está vendendo? [Avançar] Dois: vibe coding é dívida técnica com um marketing melhor? [Avançar] Três: quando a conta da IA subir, os seus fundamentos seguram? [Avançar] E quatro: o seu fluxo de IA tem algo que sabe dizer "não"? Um teste, um review, um erro real? Deixo essas perguntas no ar, elas são o nosso trampolim pro debate.
→ Agora sim: vamos conversar.`,
  },
  // ————————————————————————————————————————————————————————————
  // Sumário — panorama da palestra (logo após "Quem sou").
  // ————————————————————————————————————————————————————————————
  {
    title: '3 · O que vem por aí',
    notes: `[Passos: 6] (um bloco por clique, em cascata)
Em poucos segundos, o roteiro de hoje. [Avançar] Primeiro, o mercado e a IA: o que mudou de verdade. Depois, o papel do desenvolvedor e por que escrever código virou commodity. Em seguida, o ferramental novo: modelos, agentes, MCP e skills, tudo explicado sem jargão. Aí o método, do vibe coding ao SDD e ao loop engineering. Uma demonstração prática, do problema até o Pull Request. E, por fim, onde tudo isso deixa o novo desenvolvedor. Passo rápido, é só pra criar expectativa.
→ E tudo começa com uma pergunta que me acompanha há quinze anos: o que é, de verdade, desenvolver software?`,
  },
]
