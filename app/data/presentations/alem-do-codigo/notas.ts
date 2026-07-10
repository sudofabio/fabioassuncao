/**
 * Notas do apresentador — roteiro de fala revisado (10/07/2026), alinhado à
 * ordem visual atual dos slides (v3) e às pesquisas de referência. Cada nota
 * é somente a fala real do slide, em texto plano: cada linha é um parágrafo
 * do teleprompter (presenter mode, ?presenter=1), sem marcações de produção.
 * A linha iniciada por "→" é a frase de transição para o próximo slide
 * (exibida esmaecida no fim do prompter, sem a seta). O ritmo dos passos de
 * animação fica no contador ao vivo do presenter (passo x/y).
 */

export interface NotaSlide {
  title: string
  notes: string
}

export const NOTAS: NotaSlide[] = [
  {
    title: '1 · Capa',
    notes: `Boa noite! Quero agradecer imensamente pelo convite, em especial ao meu amigo Wesley, por me dar a oportunidade de participar da décima edição do Vale do Pindaré Tech. É uma grande honra estar aqui nesta noite, compartilhando esse momento com todos vocês. Nos próximos minutos, eu quero conversar com vocês sobre o que a inteligência artificial está fazendo de verdade com a nossa profissão. Sem hype, sem terrorismo, mas a partir daquilo que eu vivencio no mercado todos os dias.
→ Antes de falar de IA, deixa eu me apresentar rapidinho, porque a visão que eu trago aqui vem de onde eu estive.`,
  },
  {
    title: '2 · Quem sou eu',
    notes: `Eu sou desenvolvedor de software, Tech Lead e empreendedor, com mais de quinze anos de experiência em backend, arquitetura de sistemas, cloud e liderança técnica. Passei esse tempo construindo soluções escaláveis e conectando três mundos que quase nunca conversam: engenharia, produto e negócio.
Tudo o que eu vou falar aqui passou pelo filtro dessa vivência, o que eu gosto de chamar de repertório de trincheira. Não é teoria de slide, é o que eu vi funcionar e falhar na prática.
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
    notes: `Quando eu falo em desenvolvimento, eu falo de tudo: os apps do seu celular, sites, sistemas de empresas, automações, plataformas de governo, integrações. Software está em tudo.
E a forma de construir isso mudou muito. Quando eu comecei, não existia essa divisão de front, back, DevOps, SRE, QA. Você era desenvolvedor, ponto. Ou fazia web, ou fazia desktop, ou mobile. Depois o mercado se organizou: vieram as especializações, os times maiores, e a cascata deu lugar ao ágil. E agora a gente vive a era da IA e dos agentes.
→ E repara numa coisa: em cada uma dessas viradas, alguém apareceu pra decretar a morte do desenvolvedor.`,
  },
  {
    title: '6 · "O dev já morreu" + anti-hype',
    notes: `O low-code ia acabar com o dev. O no-code ia acabar com o dev. Os geradores de site, os CMS, os frameworks... e olha, aqui estamos nós.
O que cada uma dessas ondas fez de verdade foi subir o nível de abstração: menos digitação mecânica, mais pensamento sistêmico. Com a IA é o mesmo filme, só que muito mais rápido.
Mas se não é o apocalipse, também não é o paraíso que alguns gurus vendem por aí. Não existe "fature cinquenta mil sem programar". O que existe é fundamentos, mais método, mais experiência. Essa palestra é o oposto do hype.
→ Dito isso, tem uma mudança real e um pouco incômoda acontecendo: o código virou commodity.`,
  },
  {
    title: '— · Anti-hype (slide fundido — não exibido)',
    notes: `[Slide não exibido na versão atual. O anti-hype foi incorporado ao slide "O dev já morreu".]`,
  },
  {
    title: '7 · Código virou commodity',
    notes: `Hoje, com uma assinatura de mais ou menos vinte dólares por mês, qualquer pessoa gera código com Codex, Claude Code, Gemini CLI, Cursor, Copilot.
E tem planos de cem, duzentos dólares, algo como quinhentos a mil reais, que geram um volume absurdo de código. Ou seja: escrever sintaxe deixou de ser o gargalo. Só que atenção, isso não quer dizer que todo código gerado presta. E é exatamente aí que mora a oportunidade pra quem sabe garantir qualidade.
→ E o efeito disso no mercado é direto: a barreira de entrada pra criar software despencou.`,
  },
  {
    title: '12 · O arsenal do desenvolvedor',
    notes: `São três famílias de ferramentas.
A primeira, de prototipação no navegador: Lovable, v0, Bolt, Replit. Servem pra validar uma ideia, um MVP descartável.
A segunda, os editores com IA: VS Code com Copilot, Cursor, Antigravity. É o dia a dia dentro de uma base de código real.
E a terceira, os agentes de terminal: Claude Code, Codex, Gemini CLI. É automação profissional, tarefa de repositório inteiro, e é onde o meu Issue Flow vive. Não interessa comparar recurso a recurso; o que importa é o uso de cada uma.
→ E repara que três desses editores parecem concorrentes, mas têm exatamente o mesmo DNA.`,
  },
  {
    title: '8 · A barreira despencou',
    notes: `Pensa em como era ter um protótipo antes. Você contratava uma empresa, e isso custava de vinte a cem mil reais. Ou um freelancer, de dez a vinte mil.
E hoje? Uma assinatura de vinte dólares e algumas horas descrevendo o que você quer. Isso muda o mercado profundamente. E o profissional genérico, aquele que fazia de tudo um pouco e de qualquer jeito, é o primeiro a perder espaço.
→ Mas antes de avançar no método, a gente precisa entender uma coisa: afinal, o que é essa tal de IA?`,
  },
  {
    title: '15 · Protótipo ≠ Produto',
    notes: `Protótipo não é produto.
Os dois podem funcionar na demonstração, tudo bonitinho. Mas o que acontece quando chega tráfego real? Uma tentativa de invasão? A necessidade de evoluir o sistema? A LGPD batendo na porta?
É bem aí, embaixo da linha d'água, que se separa o código de qualquer jeito do produto consistente.
E é por isso que empresas pagam dezenas, às vezes centenas de milhares de reais por um produto, e não por um protótipo.
→ E pra construir produto de verdade com IA, a gente precisa de método. Deixa eu te mostrar rapidinho como o dev chegou até aqui.`,
  },
  {
    title: '17 · Vibe, Prompt, Loop',
    notes: `Nível um, o Vibe Coding: você descreve a ideia e deixa a IA gerar. É ótimo pra explorar, mas perigoso pra entregar, porque vira um loop infinito de bugs.
Nível dois, o Prompt Engineering: você dá papel, contexto, restrições e critérios de aceite. O código já sai bem mais adaptado à sua stack.
E o nível três, o Loop Engineering: aqui você desenha um agente que age, observa, corrige e repete, com limites de custo, de iteração e regras de parada. Nesse nível você deixa de ser digitador e vira arquiteto do processo.
→ E existe um quarto elemento, que virou a habilidade número um de 2026.`,
  },
  {
    title: '18 · TDD → SDD',
    notes: `Quem está há mais tempo na área lembra do TDD: o teste guiava o código.
Agora a lógica virou: a especificação guia a implementação, e a IA implementa. É o Spec-Driven Development. E o ponto é esse: se você não consegue descrever o problema com precisão, a IA te entrega uma solução tecnicamente correta e completamente inútil pro negócio.
Ou seja, a pergunta não é mais SE você vai usar IA. É COMO: de forma profissional, com segurança e eficiência.
→ E o SDD não é teoria. É um fluxo de trabalho concreto.`,
  },
  {
    title: '19 · O fluxo do SDD',
    notes: `São cinco etapas.
Constitution: os princípios e as regras de ouro do projeto.
Specify: o quê e por quê, os requisitos funcionais e não funcionais.
Plan: a arquitetura e a stack.
Tasks: a decomposição em tarefas atômicas.
E Implement: os agentes executam, sempre com validação humana. No fim, tudo isso vira artefato: PRD, regras de negócio, diretrizes de segurança, critérios de qualidade.
→ Quer ver na prática a diferença que isso faz? Vamos comparar os dois jeitos.`,
  },
  {
    title: '20 · Prompt cru vs Spec',
    notes: `De um lado, o prompt cru. "Faça um app de tarefas."
O resultado é genérico: sem autenticação decente, sem padrão, com dívida técnica já embutida.
Do outro lado, a especificação: com contexto, stack definida, regras de negócio e critérios de segurança.
O resultado é aderente, testável e evoluível. É exatamente assim que empresas sérias e times maduros trabalham hoje.
→ E esse método, na prática, é uma sequência bem concreta de etapas.`,
  },
  {
    title: '— · Pandemia (slide fundido — não exibido)',
    notes: `[Slide não exibido na versão atual. O contexto da pandemia foi incorporado ao slide "Pandemia + minha história".]`,
  },
  {
    title: '24 · Pandemia + minha história ♥',
    notes: `Na pandemia, o mercado de tech ferveu ao contrário de todo mundo: em vez de crise, faltou gente. As propostas dobravam salário da noite pro dia, e 75% da galera estava remota. E eu vivi isso na pele.
Em 2022, a minha empresa sofria dos dois lados: clientes quebrando contrato, e os nossos próprios devs recebendo propostas que dobravam o salário, de sete pra quatorze, quinze mil. Impossível competir.
Eu recebia mais de vinte mensagens de recrutador por semana. Aí eu tomei uma decisão difícil: pausei a operação e fui testar o mercado. Todo mundo da equipe se recolocou muito bem.
E eu cheguei a trabalhar full-time pra duas, às vezes três empresas ao mesmo tempo, Brasil e Estados Unidos. Pra ter o mesmo líquido com a minha empresa, eu precisaria vender mais de um milhão de reais por mês.
Era um ponto fora da curva. E ponto fora da curva não dura.
→ E o que aconteceu depois? O mercado voltou pro chão. Os números mostram isso muito bem.`,
  },
  {
    title: '25 · Salários 2021–2026',
    notes: `Olha a evolução de 2021 a 2026.
Júnior: de dois mil e novecentos pra cinco mil, mais 71%.
Pleno: de cinco mil e seiscentos pra oito mil e quinhentos, mais 51%.
Sênior: começou em dez mil e seiscentos, deu um salto na pandemia, chegou ao pico de quinze mil e seiscentos em 2025, e teve a primeira queda nominal agora em 2026, pra quatorze mil e seiscentos.
E o Especialista, o Tech Lead: de oito mil e setecentos pra vinte mil e seiscentos, mais 136%. O único nível que cresceu todos os anos, sem exceção.
A leitura é essa: o mercado se seniorizou. Ele paga cada vez mais por quem tem visão de negócio e fluência em IA, e aperta o meio e o topo genérico. Só pra ter ideia, hoje 98,5% dos devs já usam IA.
E um dado nosso: o salário médio de dev no Maranhão saiu de três mil e setecentos em 2021 pra dez mil em 2026. Quase triplicou.
→ E além de quanto se ganha, mudou também onde e como a gente trabalha.`,
  },
  {
    title: '26 · Onde o novo dev trabalha',
    notes: `Eu trabalho remoto desde 2015, antes de virar moda.
A pandemia universalizou isso: 75% dos devs estavam remotos em 2022. De lá pra cá o presencial vem pressionando de volta, e hoje a gente tem 60% remoto, 22% híbrido e 17% presencial.
Quase quatro em cada dez devs sentem pressão pra voltar ao escritório, mas 77% dizem que são mais produtivos em casa.
E o remoto não mudou só o "onde". 14% dos devs brasileiros já trabalham pra empresas do exterior, e 22% têm mais de um contrato. Ou seja: você, aqui de Santa Inês, pode trabalhar pro mundo inteiro.
→ Agora, nem tudo são flores. Vamos falar do que as manchetes não contam.`,
  },
  {
    title: '27 · O efeito bumerangue',
    notes: `Tem um fenômeno já documentado, que eu chamo de bumerangue da IA.
Uma pesquisa da Robert Half com dois mil gestores nos Estados Unidos: 32% eliminaram cargos por ganho de produtividade com IA, e precisaram recontratar pra mesma função.
A Forrester apontou que 55% dos empregadores se arrependeram de ter demitido por causa da IA.
E a Gartner prevê: metade das empresas que trocaram atendimento ou operações por IA vão recriar essas funções até 2027.
Por quê? A IA não tem contexto institucional, isso pesou pra 40%. Exigiu mais supervisão e controle de qualidade, 38%. E os ganhos vieram menores que o esperado, 35%.
→ E tem gente muito grande dizendo isso com todas as letras.`,
  },
  {
    title: '28 · "Narrativa conveniente"',
    notes: `Jensen Huang, o CEO da NVIDIA, foi direto: pra muitos CEOs, a narrativa que liga a IA à perda de emprego é simplesmente conveniente demais.
Ele ainda provocou: como é possível a IA ter se tornado realmente útil há só seis meses e, mesmo assim, empresas dizerem que demitem por causa dela há dois anos? Não faz sentido. E completou que isso era só uma forma de parecerem espertos, e que estamos assustando as pessoas de forma irresponsável.
O recado que eu tiro daqui é esse: o perigo real não é a IA roubar o seu emprego. É gestor usando o hype pra justificar corte.
→ E tem mais um risco no horizonte, que quase ninguém quer encarar: a conta.`,
  },
  {
    title: '29 · Quem paga essa conta?',
    notes: `O próprio CEO do Google, Sundar Pichai, reconhece que há elementos racionais e irracionais no boom atual, como teve na bolha ponto-com. E avisa: se ela estourar, nenhuma empresa fica imune, incluindo a gente.
Segundo dado: a IA já consome 1,5% da eletricidade global, segundo a Agência Internacional de Energia.
E o terceiro: aquele acesso de vinte dólares por mês existe porque tem empresa queimando bilhões pra ganhar mercado. É subsídio. No médio prazo, ou você paga mais, ou a ferramenta muda, ou ela some.
E a sua proteção contra tudo isso não é a ferramenta. São os fundamentos.
→ Então, juntando tudo: afinal, quem é o novo desenvolvedor?`,
  },
  {
    title: '30 · O novo desenvolvedor',
    notes: `A IA não elimina o desenvolvedor. Ela promove o desenvolvedor.
De digitador de código a arquiteto de soluções. O profissional genérico, que só faz o feijão com arroz, esse perde espaço mesmo, sem dó. Mas quem entende produto, arquitetura, segurança, requisitos e negócio nunca foi tão valioso. Porque a IA faz as duas coisas ao mesmo tempo: reduz a barreira de entrada e aumenta a exigência de maturidade.
→ E eu quero fechar com uma única pergunta, pra vocês levarem pra casa.`,
  },
  {
    title: '23 · Fundamentos concretos',
    notes: `Cursor, Claude Code, v0: esses nomes vão mudar nos próximos meses. É a camada volátil.
O que não muda são quatro grupos concretos, e cada um tem um motivo claro de por que a IA não te dispensa.
Máquina e terminal: o agente roda comandos; se você não lê a saída, não sabe se ele acertou.
Versionamento: o fluxo de IA é issue, branch, PR, review; sem git, você não participa.
Web e integração: a IA gera o endpoint, mas é você que confere status code, CORS, token.
Empacotamento e entrega: a IA escreve o app, mas não sabe por que o container não sobe, nem lê o log das duas da manhã por você.
E se você não sabe por onde começar, o roadmap.sh é um ótimo mapa de estudos. É uma recomendação, não conteúdo pronto. O recado é: aprenda os fundamentos usando as ferramentas, não use as ferramentas pra pular os fundamentos.
→ Bom, falei bastante de técnica. Agora vamos pro que todo mundo quer saber: mercado, salário e carreira. E eu vou começar por uma história pessoal.`,
  },
  {
    title: '31 · Mensagem final ★',
    notes: `Se a IA pode escrever qualquer código que você pedir, em segundos... você tem o repertório pra saber se o que ela entregou é o que o seu negócio precisa?
O novo desenvolvedor não compete com a máquina digitando. Ele escreve a partitura que a orquestra executa.
Então não lute contra a IA. Torne-se indispensável pra ela.
→ E antes de a gente abrir pra conversa, quero deixar quatro provocações pra vocês.`,
  },
  {
    title: '33 · Obrigado! Vamos conversar?',
    notes: `Muito obrigado! Obrigado ao Vale do Pindaré Tech, ao IFMA e a vocês, que ficaram até aqui.
A apresentação completa está nesse QR, com todos os links e as referências do que eu citei.
Se der tempo, agora vem a melhor parte: eu quero ouvir vocês. Vamos conversar.`,
  },
  // ————————————————————————————————————————————————————————————
  // Bloco "O mapa da IA" (D1–D5) — inseridos após "A barreira despencou".
  // Índices anexados ao fim; a ordem visual é controlada pelo template.
  // ————————————————————————————————————————————————————————————
  {
    title: '9 · O que é essa IA?',
    notes: `Sem mistério: um LLM é, no fundo, um autocompletar gigante. Ele foi treinado lendo bilhões de textos e códigos, e faz uma coisa só: prever o próximo pedacinho, a próxima palavra, o próximo trecho de código.
É igual ao teclado do seu celular que sugere a próxima palavra, só que muitíssimo mais poderoso.
E aqui vai uma ressalva honesta: ele não entende como a gente entende, ele prevê. Por isso às vezes erra com toda a confiança do mundo. E é por isso que você, humano, continua no comando.
→ E quem constrói esses modelos? São pouquíssimas empresas.`,
  },
  {
    title: '10 · Quem é quem',
    notes: `Pouquíssimas empresas treinam os modelos base. A OpenAI, com o ChatGPT e o Codex. A Anthropic, com o Claude, nos tamanhos Opus, Sonnet e Haiku. O Google, com o Gemini e o Antigravity. A Meta, com o Llama, que é aberto. E a Mistral, europeia, também aberta.
Guardem essa ideia: pouquíssimas empresas treinam os modelos. Todo o resto do ecossistema constrói em cima delas.
→ Agora, modelo é uma coisa. Ferramenta, editor e agente são outra. Vamos separar esses nomes.`,
  },
  {
    title: '11 · Modelo × Ferramenta × Editor × Agente',
    notes: `Uma analogia pra fixar de vez.
O modelo é o motor: o cérebro que prevê os tokens, mas sozinho não anda.
A ferramenta são as mãos, o que dá ações ao modelo: rodar um comando, ler um arquivo, buscar na web.
O editor é o carro: onde você senta e dirige, dentro do seu código. VS Code, Cursor, Antigravity.
E o agente é o piloto automático: o modelo agindo em loop, que planeja, executa, observa o resultado e corrige. Mas quem define o destino é você.
→ Com esse vocabulário na mão, o arsenal de ferramentas faz muito mais sentido.`,
  },
  {
    title: '13 · 3 editores, 1 DNA',
    notes: `Esses três editores parecem rivais: VS Code com Copilot, Cursor, e o Antigravity, do Google.
Só que tem um segredo: por baixo, os três são o mesmo VS Code. O Cursor é um fork do VS Code, o Antigravity também. O que muda é a camada de agente que cada um coloca por cima.
Então fica a regra de ouro: aprenda o VS Code de verdade e você transita entre todos eles sem esforço. O Antigravity, inclusive, é gratuito pra uso individual e roda vários agentes em paralelo.
→ Falta só uma última peça de vocabulário: MCP, skills e agentes.`,
  },
  {
    title: '14 · MCP, Skills, agentes e subagentes',
    notes: `Três palavras, quatro na verdade, que vocês vão ouvir muito.
MCP, de Model Context Protocol: um padrão aberto que conecta o modelo a ferramentas e dados. Pensem nele como a porta USB-C da IA.
Agent Skills: pacotes de conhecimento, uma pasta com instruções que ensina o agente a fazer uma tarefa repetível.
Agentes: é juntar tudo isso num fluxo que roda sozinho, sob a sua supervisão.
E os subagentes: especialistas que o agente principal aciona pra uma tarefa específica, pesquisar, testar, revisar, cada um no seu contexto.
→ Agora que a gente tem o vocabulário, vamos pro método. E o método começa com uma distinção que separa amador de profissional.`,
  },
  // ————————————————————————————————————————————————————————————
  // Bloco SDD — narrativa de evolução e a sequência de 9 etapas.
  // ————————————————————————————————————————————————————————————
  {
    title: '16 · Como chegamos até aqui',
    notes: `Uma linha do tempo bem rápida.
Lá atrás, Google e Stack Overflow: a resposta estava num fórum, você copiava e adaptava.
Fim de 2022, o ChatGPT: a resposta virou conversa.
Em 2023, Copilot e Cursor colocam a IA dentro do editor, o famoso ghost text.
Fevereiro de 2025, o Vibe Coding: descrever a ideia e deixar a IA gerar o app inteiro. O termo foi cunhado pelo Andrej Karpathy num post, e virou até palavra do ano.
Em paralelo, veio uma onda de exageros e promessas oportunistas.
E aí o mercado amadureceu: boas práticas, revisão, engenharia de verdade. E é daí que nasce o SDD.
→ Porque de copiar resposta de fórum a copiar resposta de chat, o problema sempre foi o mesmo: contexto. E dá pra lidar com isso em três níveis de maturidade.`,
  },
  {
    title: '21 · As 9 etapas, do problema ao PR',
    notes: `O SDD, do começo ao fim, é uma sequência.
Um: eu tenho um problema real, uma frase vaga de usuário. Dois: transformo isso numa intenção clara. Três: gero uma especificação.
Quatro: refino requisitos e restrições, stack, regras, segurança. Cinco: valido o escopo com critérios de aceite. Seis: quebro tudo em tarefas atômicas.
Sete: implemento com apoio da IA. Oito: reviso, testo e ajusto, e é aqui que mora o loop de correção. Nove: integro ao projeto num Pull Request.
→ E não é teoria. Deixa eu te mostrar isso rodando de verdade, com o Issue Flow.`,
  },
  // ————————————————————————————————————————————————————————————
  // Bloco "Na prática" — Issue Flow rodando (só comandos confirmados).
  // ————————————————————————————————————————————————————————————
  {
    title: '22 · Issue Flow rodando',
    notes: `Isto aqui é o Issue Flow, uma ferramenta que eu mantenho: skills, mais agente, mais automação.
Eu descrevo o problema numa frase e ele cria a issue quarenta e dois.
prd: ele gera a especificação. plan: quebra em tarefas. execute: o agente implementa, story por story.
E aqui está o pulo do gato: review. Ele testa e reprova, dá FAIL. Aí entra o loop de autocorreção: ele corrige e revalida, até três ciclos, até dar PASS.
E por fim o pr: abre o Pull Request pronto pra revisão humana.
Esse momento do FAIL virando PASS é o que eu chamo de meio-loop: o valor não está só em rodar o loop, está em ter dentro dele algo capaz de dizer "não". Um teste, um review, um erro real.
→ Mas tudo isso só funciona se você domina o que está por baixo. Os fundamentos.`,
  },
  // ————————————————————————————————————————————————————————————
  // Fechamento — provocações / Q&A (antes do slide de contato).
  // ————————————————————————————————————————————————————————————
  {
    title: '32 · Provocações para o debate',
    notes: `Quatro perguntas pra levar pra casa.
Um: se a IA escreve o código, o que exatamente você está vendendo?
Dois: vibe coding é dívida técnica com um marketing melhor?
Três: quando a conta da IA subir, os seus fundamentos seguram?
E quatro: o seu fluxo de IA tem algo que sabe dizer "não"? Um teste, um review, um erro real?
Deixo essas perguntas no ar, elas são o nosso trampolim pro debate.
→ Agora sim: vamos conversar.`,
  },
  // ————————————————————————————————————————————————————————————
  // Sumário — panorama da palestra (logo após "Quem sou").
  // ————————————————————————————————————————————————————————————
  {
    title: '3 · O que vem por aí',
    notes: `Primeiro, o mercado e a IA: o que mudou de verdade. Depois, o papel do desenvolvedor e por que escrever código virou commodity.
Em seguida, o ferramental novo: modelos, agentes, MCP e skills, tudo explicado sem jargão. Aí o método, do vibe coding ao SDD e ao loop engineering.
Uma demonstração prática, do problema até o Pull Request. E, por fim, onde tudo isso deixa o novo desenvolvedor. Passo rápido, é só pra criar expectativa.
→ E tudo começa com uma pergunta que me acompanha há quinze anos: o que é, de verdade, desenvolver software?`,
  },
]
