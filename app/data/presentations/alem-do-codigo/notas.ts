/**
 * Notas do apresentador — roteiro de fala transcrito do APRESENTACAO_BASE.md
 * (documento mestre), com contagem de steps por slide. Exibidas no presenter
 * mode (?presenter=1) e usáveis como plano B impresso.
 */

export interface NotaSlide {
  title: string
  notes: string
}

export const NOTAS: NotaSlide[] = [
  {
    title: '1 · Capa',
    notes: `[Steps: 0]
Boa noite. Agradecer o convite do Vale do Pindaré Tech e o IFMA. Anunciar o tema: "Nos próximos 30 minutos quero conversar sobre o que a IA está fazendo de verdade com a nossa profissão — sem hype, sem terrorismo, a partir do que eu vivi e vivo no mercado."
→ "Antes de falar de IA, deixa eu me apresentar — porque a visão que vou trazer aqui vem de onde eu estive."`,
  },
  {
    title: '2 · Quem sou eu',
    notes: `[Steps: 1 — pilares acendem juntos]
(Somente a minibio oficial.) "Sou desenvolvedor de software, Tech Lead e empreendedor, com mais de 15 anos de experiência em backend, arquitetura de sistemas, cloud computing e liderança técnica. Trabalho construindo soluções escaláveis, conectando engenharia, produto e negócio." Fechar: "Tudo o que vou falar aqui passou pelo filtro dessa vivência — o que eu chamo de repertório de trincheira." (máx. 90s)
→ "E nesses 15 anos, uma pergunta me acompanhou o tempo todo: o que é, de verdade, desenvolver software?"`,
  },
  {
    title: '3 · Desenvolver ≠ digitar código',
    notes: `[Steps: 2 — ① risco em "Escrever sintaxe" ② "Resolver problemas reais"]
"Se eu perguntar o que um desenvolvedor faz, muita gente responde: escreve código. Mas em 15 anos aprendi que programar é mapear o caos e projetar soluções. O código é o meio — o fim é o problema resolvido." PAUSA DRAMÁTICA após revelar a frase. Essa distinção explica tudo o que vem a seguir.
→ "Mas antes, vamos alinhar: o que estamos chamando de 'desenvolvimento'?"`,
  },
  {
    title: '4 · Software está em tudo',
    notes: `[Steps: 1 — grid em cascata] (~45s, slide de respiro)
Rápido: "Quando falo desenvolvimento, falo de apps no seu celular, sites, sistemas de empresas, automações, plataformas de governo, integrações — tudo que ajuda pessoas e organizações a resolver problemas reais."
→ "E essa atividade mudou muito desde que eu comecei. Deixa eu te mostrar."`,
  },
  {
    title: '5 · Linha do tempo',
    notes: `[Steps: 4 — uma era por clique]
"Quando comecei, não existia essa divisão de front, back, DevOps, SRE, QA. Você era desenvolvedor. Ou fazia web, ou desktop. Uma linguagem principal, talvez uma secundária. Depois o mercado se organizou: especializações, times maiores, cascata deu lugar ao ágil, Scrum, entrega contínua. E agora vivemos a era da IA e dos agentes." (cascata → ágil sem aprofundar)
→ "E reparem: em cada uma dessas viradas, alguém decretou a morte do desenvolvedor."`,
  },
  {
    title: '6 · "O dev já morreu" (de novo)',
    notes: `[Steps: 2 — ① carimbos R.I.P. ② frase-síntese] (humor leve)
"Low-code ia acabar com dev. No-code ia acabar com dev. Geradores de site, CMS, frameworks... e aqui estamos. O que cada onda fez de verdade foi subir o nível de abstração: menos digitação mecânica, mais pensamento sistêmico. Com IA, é o mesmo filme — só que em velocidade muito maior."
→ "Mas se não é o fim do mundo, também não é o paraíso que os gurus vendem."`,
  },
  {
    title: '7 · Anti-hype',
    notes: `[Steps: 3 — pares revelados juntos] (tom firme, bem-humorado; não citar influenciadores)
"Toda nova tendência atrai gente vendendo atalho: 'fature 50 mil com IA sem saber programar'. Essa palestra é o oposto disso. O que vou mostrar é o que funciona pra mim, o que vejo funcionando em empresas reais, no Brasil e fora." Posicionar-se: dev + gestor + empreendedor.
→ "Dito isso, existe uma mudança real acontecendo. E ela começa por uma constatação incômoda..."`,
  },
  {
    title: '8 · Código virou commodity',
    notes: `[Steps: 2 — ① frase de impacto ② US$ 20/mês (CountUp)] ⭐ momento wow
"Hoje, com uma assinatura de ~20 dólares, qualquer pessoa gera código com Codex, Claude Code, Gemini CLI, Cursor, Copilot. Existem planos de 100, 200 dólares — 500 a 1.100 reais — que geram volume absurdo de código. Escrever sintaxe deixou de ser o gargalo. Isso não significa que todo código gerado presta — e é exatamente aí que mora a oportunidade." (qualidade fica p/ slide 11)
→ "Commodity gerada por quais ferramentas? O ecossistema hoje é gigante."`,
  },
  {
    title: '9 · O arsenal do desenvolvedor',
    notes: `[Steps: 3 — ① prototipação ② editores com IA ③ agentes de terminal]
"Três famílias. ① Prototipação/navegador: Lovable, v0, Bolt, Replit — validar uma ideia, MVP descartável. ② Editores com IA: VS Code+Copilot, Cursor, Antigravity — o dia a dia dentro de uma base de código. ③ Agentes de terminal: Claude Code, Codex, Gemini CLI — automação profissional, tarefas de repo inteiro; é onde o Issue Flow vive." Não comparar feature a feature; o ponto é o uso. (Dado opcional: Claude Code é a ferramenta nº 1 entre devs BR em 2026.)
→ "Repara que três desses editores parecem concorrentes — mas têm o mesmo DNA."`,
  },
  {
    title: '10 · A barreira despencou',
    notes: `[Steps: 2 — ① ANTES (barras) ② HOJE (US$ 20)] ⭐ momento wow — números protagonistas
"Antes: para ter um protótipo, você contratava análise de requisitos + freelancer (R$ 10–20 mil) ou uma empresa (R$ 20–100 mil). Hoje: uma assinatura de ~US$ 20 e algumas horas descrevendo o que você quer. Isso muda o mercado profundamente — e o profissional genérico, que fazia tudo 'de qualquer jeito', é o primeiro a perder espaço." (fala com empreendedores da plateia)
→ "Mas atenção: protótipo não é produto. E essa diferença paga o seu salário."`,
  },
  {
    title: '11 · Protótipo ≠ Produto',
    notes: `[Steps: 3 — ① linha d'água/"FUNCIONA" ② itens submersos ③ frase final] (falar com calma)
"Os dois podem funcionar na demo. Mas o que acontece quando chega tráfego real? Tentativa de invasão? Necessidade de evoluir o sistema? LGPD? É aí que se separa o código de qualquer jeito do produto consistente. Empresas pagam dezenas ou centenas de milhares de reais por produtos — não por protótipos." (exemplos rápidos de falha sem citar empresas)
→ "E como um profissional atravessa esse abismo? Com método. Existem três níveis de maturidade no uso de IA."`,
  },
  {
    title: '12 · Vibe, Prompt, Loop',
    notes: `[Steps: 3 — um nível por clique; ciclo do loop gira no nível 3]
"Nível 1 — Vibe Coding: descrever a ideia e deixar a IA gerar; ótimo para explorar, perigoso para entregar (loop infinito de bugs). Nível 2 — Prompt Engineering: papel, contexto, restrições, critérios de aceite; código mais adaptado à sua stack. Nível 3 — Loop Engineering: você desenha o agente que age, observa, corrige e repete — com limites de custo, iteração e regras de parada. Você deixa de ser digitador e vira arquiteto do processo."
→ "E existe um quarto elemento, que virou a habilidade número 1 de 2026..."`,
  },
  {
    title: '13 · TDD → SDD ★ CLÍMAX',
    notes: `[Steps: 2 — ① morph TDD→SDD ② badge #1 skill 2026] ⭐⭐⭐ O SLIDE MAIS IMPORTANTE
"Quem está há mais tempo na área lembra do TDD: o teste guiava o código. Agora, a especificação guia a implementação — e a IA implementa. Se você não consegue descrever o problema com precisão, a IA te entrega uma solução tecnicamente correta e inútil para o negócio. A questão não é mais SE você vai usar IA. É COMO: profissionalmente, com segurança e eficiência."
PAUSA. Contato visual com a plateia.
→ "E SDD não é teoria — é um fluxo concreto de trabalho."`,
  },
  {
    title: '14 · O fluxo do SDD',
    notes: `[Steps: 5 — um nó por clique]
"① Constitution: princípios e regras de ouro do projeto. ② Specify: o quê e por quê — requisitos funcionais e não funcionais. ③ Plan: arquitetura e stack. ④ Tasks: decomposição em tarefas atômicas. ⑤ Implement: agentes executam com validação humana." Artefatos: PRD, regras de negócio, diretrizes de segurança, critérios de qualidade. (Se houver tempo: comandos /speckit.constitution, /speckit.specify — credibilidade técnica.)
→ "Quer ver a diferença que isso faz? Vamos comparar."`,
  },
  {
    title: '15 · Prompt cru vs Spec',
    notes: `[Steps: 4 — ① prompt cru digita ② resultado caótico ③ spec digita ④ resultado estruturado]
Lado A: "Faça um app de tarefas" → resultado genérico, sem autenticação decente, sem padrão, dívida técnica embutida. Lado B: spec com contexto, stack definida, regras de negócio, critérios de segurança → resultado aderente, testável, evoluível. "É assim que empresas sérias e times maduros trabalham hoje."
→ "Método explicado. Agora vamos falar do que todo mundo quer saber: mercado e salário."`,
  },
  {
    title: '16 · Pandemia: o ponto fora da curva',
    notes: `[Steps: 3 — stats em sequência] (energia alta!)
"A pandemia abalou todos os mercados — mas em tech, o efeito foi inverso: carência extrema de profissionais. Júnior, pleno, sênior — todo mundo recebia proposta. Dev com 3 anos de carreira passando de R$ 10 mil; sênior com 10+ anos acima de R$ 30 mil. Propostas dobravam salários da noite pro dia. 75% da força de trabalho remota em 2022."
→ "E eu vivi isso na pele. Deixa eu contar o que aconteceu com a minha empresa."`,
  },
  {
    title: '17 · Minha história ♥',
    notes: `[Steps: 4 — uma cena por clique] STORYTELLING — a fala carrega, slide minimalista
"Em 2022 a minha empresa sofria dos dois lados: clientes com contratos recorrentes quebrando com a pandemia, e nossos devs recebendo propostas que dobravam o salário — de 7 pra 14, 15 mil. Impossível competir. Eu recebia 20+ mensagens de recruiter por semana. Decidi pausar a operação e testar o mercado. Resultado: todos da equipe se recolocaram muito bem. Eu cheguei a trabalhar full-time para duas, às vezes três empresas ao mesmo tempo — Brasil e EUA. Para ter o mesmo líquido com a Codions, eu precisaria vender mais de R$ 1 milhão por mês. Era um ponto fora da curva — e pontos fora da curva não duram."
→ "E o que aconteceu depois? O mercado voltou pro chão. Os números mostram." (corte seco)`,
  },
  {
    title: '18 · Salários 2021–2026',
    notes: `[Steps: 5 — ① Júnior ② Pleno ③ Sênior ④ Especialista (crescendo dramático) ⑤ callouts]
"Júnior: R$ 2.956 (2021) → R$ 5.060 (2026), +71%. Pleno: R$ 5.594 → R$ 8.467, +51%. Sênior: R$ 10.601 → salto na pandemia (R$ 14.399 já em 2022) → pico de R$ 15.635 em 2025 → primeira queda nominal em 2026: R$ 14.608. Especialista/Tech Lead: R$ 8.745 → R$ 20.602, +136% — o único nível que cresceu TODOS os anos. Leitura: o mercado 'seniorizou' — paga cada vez mais por quem tem visão de negócio e fluência em IA, e aperta o meio e o topo genérico." Citar: 98,5% dos devs usam IA (2026); vagas de entrada mais escassas (Forbes). Bônus local: "O salário médio de dev no Maranhão saiu de R$ 3.719 em 2021 para R$ 10.047 em 2026 — quase triplicou."
→ "E além de quanto se ganha, mudou onde e como se trabalha."`,
  },
  {
    title: '19 · Onde o novo dev trabalha',
    notes: `[Steps: 3 — ① donut ② callouts ③ "De Santa Inês para o mundo"]
"Eu trabalho remoto desde 2015 — antes de virar moda. A pandemia universalizou: 75% dos devs estavam remotos em 2022. Desde então o presencial vem pressionando de volta — hoje são 60,1% remoto, 22,4% híbrido, 17,5% presencial. Quase 4 em 10 devs (39,5%) sentem pressão pra voltar ao escritório — mas 76,7% se dizem mais produtivos em casa. E o remoto não mudou só o 'onde': 14% dos devs brasileiros já trabalham para empresas do exterior, e 22,5% têm mais de um contrato. Você, em Santa Inês, pode trabalhar para o mundo." (conexão forte com a plateia local!)
→ "Agora, nem tudo são flores. Vamos falar do que as manchetes não contam."`,
  },
  {
    title: '20 · O efeito bumerangue',
    notes: `[Steps: 4 — ① 32% ② 55% ③ 50% ④ motivos] ⭐ bumerangue sai e VOLTA no timing de "estão recontratando"
"Fenômeno documentado: o bumerangue da IA. Pesquisa da Robert Half com 2 mil gestores nos EUA: 32% eliminaram cargos pelos ganhos de produtividade da IA — e precisaram recontratar para a mesma função. A Forrester apontou que 55% dos empregadores se arrependeram de demitir por causa da IA. E a Gartner prevê: metade das empresas que substituíram atendimento ou operações por IA vai recriar essas funções até 2027. Por quê? A IA não tem contexto institucional (40%), exigiu mais supervisão e controle de qualidade (38%) e os ganhos vieram menores que o esperado (35%)." (mencionar: dados do mercado americano. Q&A: NBER/Duke ~502 mil cortes em 2026 ≈ 0,4% dos empregos.)
→ "E tem gente grande dizendo isso com todas as letras."`,
  },
  {
    title: '21 · "Narrativa conveniente"',
    notes: `[Steps: 1 — quote em fade por linhas] (respiro visual — deixar a plateia LER antes de comentar)
Projetar apenas a citação 1. Ler em voz alta. Complementar verbalmente: "Como é possível que a IA tenha se tornado realmente útil há apenas seis meses e, ainda assim, empresas digam que demitem pessoas por causa dela há dois anos? Isso não faz sentido." e "Era apenas uma forma de parecerem espertos, e eu detesto isso profundamente. Estamos assustando as pessoas de forma irresponsável." Arrematar: "O perigo real não é a IA roubar seu emprego — é gestor usando o hype para justificar corte." (Contexto: até Sam Altman admite alertas 'exagerados ou oportunistas'.)
→ "E há mais um risco no horizonte, que quase ninguém quer encarar: a conta."`,
  },
  {
    title: '22 · Quem paga essa conta?',
    notes: `[Steps: 4 — ① Pichai ② 1,5% AIE ③ subsídio ④ frase-síntese] (tom "olhos abertos", não pânico)
"O CEO do Google, Sundar Pichai, reconhece que há 'elementos racionais e irracionais' no boom atual — como na bolha pontocom — e avisa: se ela estourar, 'nenhuma empresa estará imune, incluindo a gente'. A IA já consome 1,5% da eletricidade global, segundo a Agência Internacional de Energia. E o acesso a US$ 20/mês existe porque alguém está queimando bilhões para ganhar mercado. Médio prazo: ou você paga mais, ou a ferramenta muda, ou some. Sua proteção? Não é a ferramenta — são os fundamentos." (NÃO usar exemplos Uber/Microsoft.)
→ "Então, juntando tudo: quem é o novo desenvolvedor?"`,
  },
  {
    title: '23 · O novo desenvolvedor',
    notes: `[Steps: 2 — ① perfil "digitador" ② transformação em "arquiteto"] (tom de PROMOÇÃO, não humilhação)
"A IA não elimina o desenvolvedor — ela o promove. De digitador a arquiteto de soluções. O profissional genérico, que só faz o feijão com arroz, perde espaço mesmo. Mas quem entende produto, arquitetura, segurança, requisitos e negócio nunca foi tão valioso. A IA reduz a barreira de entrada e aumenta a exigência de maturidade — as duas coisas ao mesmo tempo."
→ "E o que sustenta esse profissional quando tudo muda?"`,
  },
  {
    title: '24 · Fundamentos concretos',
    notes: `[Steps: 5 — ① camada volátil (logos trocando) ②③④⑤ os 4 grupos + roadmap.sh] (falar DIRETAMENTE com os estudantes do IFMA)
"Cursor, Claude Code, v0 — os nomes vão mudar nos próximos meses (camada volátil). O que não muda são quatro grupos concretos, e cada um tem um 'por que a IA não dispensa'. ① Máquina e terminal: o agente roda comandos; se você não lê a saída, não sabe se ele acertou. ② Versionamento: o fluxo de IA é issue → branch → PR → review; sem git, você não participa. ③ Web e integração: a IA gera o endpoint, você confere status code, CORS, token. ④ Empacotamento e entrega: a IA escreve o app, mas não sabe por que o container não sobe nem lê o log das 2h por você." Fechar com o roadmap.sh: "Não sabe por onde começar? roadmap.sh é um mapa de estudos — recomendação, não conteúdo. Aprenda os fundamentos USANDO as ferramentas; não use as ferramentas para PULAR os fundamentos."
→ "Deixo vocês com uma última provocação."`,
  },
  {
    title: '25 · Mensagem final ★',
    notes: `[Steps: 1 — frase palavra a palavra, últimas 2 palavras com pausa maior] ⭐ encerramento emocional
"Se a IA pode escrever qualquer código que você pedir em segundos... você tem o repertório para saber se o que ela entregou é o que o seu negócio precisa? O novo desenvolvedor não compete com a máquina digitando. Ele escreve a partitura que a orquestra executa. Não lute contra a IA — torne-se indispensável para ela."
SILÊNCIO DE 2s após a frase. Depois agradecer.
→ (aplausos) → slide de contato.`,
  },
  {
    title: '26 · Obrigado! Vamos conversar?',
    notes: `[Steps: 0] (fica projetado durante o Q&A)
Agradecer o evento, o IFMA e a plateia. Apontar o QR: "A apresentação completa está disponível neste QR, junto com os links e referências do que citei aqui." Abrir para perguntas se houver tempo.`,
  },
  // ————————————————————————————————————————————————————————————
  // Bloco "O mapa da IA" (D1–D5) — inseridos após "A barreira despencou".
  // Índices anexados ao fim; a ordem visual é controlada pelo template.
  // ————————————————————————————————————————————————————————————
  {
    title: 'Mapa 1 · O que é essa IA?',
    notes: `[Steps: 3 — ① a analogia (autocompletar gigante) ② previsão do próximo token ③ ressalva "prevê, não entende"] (~60s, sem matemática)
"Sem mistério: um LLM é um autocompletar gigante. Foi treinado lendo bilhões de textos e códigos, e faz uma coisa só — prever a próxima palavra, o próximo pedacinho de código. Igual ao teclado do celular que sugere a próxima palavra, só que muito mais poderoso." Ressalva honesta: "Ele não 'entende' como a gente; ele prevê. Por isso às vezes erra com toda a confiança do mundo — e é por isso que você, humano, continua no comando."
→ "E quem constrói esses modelos? São poucas empresas."`,
  },
  {
    title: 'Mapa 2 · Quem é quem',
    notes: `[Steps: 2 — ① os provedores e seus modelos ② a mensagem-chave]
"Poucas empresas treinam os modelos-base. OpenAI, com o ChatGPT e o Codex. Anthropic, com o Claude — nos tamanhos Opus, Sonnet e Haiku. Google, com Gemini e o Antigravity. Meta, com o Llama, aberto. Mistral, europeia, também aberta." Mensagem: "Guardem isso: pouquíssimas empresas treinam os modelos; todo o resto do ecossistema constrói em cima delas."
→ "Modelo é uma coisa. Ferramenta, editor e agente são outra. Vamos separar."`,
  },
  {
    title: 'Mapa 3 · Modelo × Ferramenta × Agente × Editor',
    notes: `[Steps: 4 — ① Modelo/motor ② Ferramenta/mãos ③ Editor/carro ④ Agente/piloto automático]
"Uma analogia pra fixar. O MODELO é o motor — o cérebro que prevê tokens; sozinho não anda. A FERRAMENTA são as mãos — o que dá ações ao modelo: rodar comando, ler arquivo, buscar na web. O EDITOR é o carro — onde você senta e dirige, dentro do seu código: VS Code, Cursor, Antigravity. E o AGENTE é o piloto automático — o modelo agindo em loop: planeja, executa, observa e corrige."
→ "Com esse vocabulário, o arsenal de ferramentas faz muito mais sentido."`,
  },
  {
    title: 'Mapa 4 · 3 editores, 1 DNA',
    notes: `[Steps: 3 — ① os 3 editores ② revelação: todos são VS Code por baixo ③ a regra de ouro]
"Esses três editores parecem concorrentes: VS Code com Copilot, Cursor e o Antigravity, do Google. Mas tem um segredo: por baixo, os três são o mesmo VS Code. O Cursor é um fork do VS Code; o Antigravity também. O que muda é a camada de agente por cima." Regra de ouro: "Aprenda o VS Code de verdade e você transita entre todos eles. O Antigravity, inclusive, é gratuito para uso individual e roda vários agentes em paralelo."
→ "Falta uma última peça de vocabulário: MCP, Skills e agentes."`,
  },
  {
    title: 'Mapa 5 · MCP, Skills e agentes',
    notes: `[Steps: 3 — ① MCP ② Agent Skills ③ Agentes/automação → gancho Issue Flow] (~60s)
"Três palavras que você vai ouvir muito. MCP, Model Context Protocol: um padrão aberto que conecta o modelo a ferramentas e dados — pensa nele como a porta USB-C da IA. Agent Skills: pacotes de conhecimento, uma pasta com instruções que ensina o agente a fazer uma tarefa repetível. E agentes/automações: é juntar tudo num fluxo que roda sozinho, sob a sua supervisão."
→ "E o meu Issue Flow é exatamente isso: skills + agente + automação. Daqui a pouco eu mostro rodando."`,
  },
  // ————————————————————————————————————————————————————————————
  // Bloco SDD — narrativa de evolução e a sequência de 9 etapas.
  // ————————————————————————————————————————————————————————————
  {
    title: 'SDD · Como chegamos até aqui',
    notes: `[Steps: 7 — uma etapa por clique; caixa factual do Vibe Coding aparece no passo 4]
"Antes de eu te mostrar o método, uma linha do tempo rápida. ① Lá atrás: Google e Stack Overflow — a resposta estava num fórum, você copiava e adaptava. ② Fim de 2022: ChatGPT — a resposta virou conversa. ③ 2023: Copilot e Cursor colocam a IA dentro do editor, o 'ghost text'. ④ Fevereiro de 2025: Vibe Coding — descrever a ideia e deixar a IA gerar o app inteiro. (o termo foi cunhado pelo Andrej Karpathy num post no X; virou verbete e Palavra do Ano). ⑤ Em paralelo, uma onda de exageros e promessas oportunistas. ⑥ E o mercado amadureceu: boas práticas, revisão, engenharia de verdade. ⑦ Daí nasce o SDD." Tratar o hype com respeito profissional — sem citar influenciadores.
→ "De copiar resposta de fórum a copiar resposta de chat, o problema sempre foi o mesmo: contexto. O SDD é a resposta madura."`,
  },
  {
    title: 'SDD · As 9 etapas, do problema ao PR',
    notes: `[Steps: 9 — uma etapa por clique; a árvore de arquivos cresce junto]
"O SDD, na prática, é uma sequência. ① Tenho um problema real — uma frase vaga de usuário. ② Transformo em intenção clara. ③ Gero uma especificação. ④ Refino requisitos e restrições — stack, regras, segurança. ⑤ Valido o escopo com critérios de aceite. ⑥ Quebro em tarefas atômicas. ⑦ Implemento com apoio da IA. ⑧ Reviso, testo e ajusto — e aqui mora o loop de correção. ⑨ Integro ao projeto num Pull Request." Amarrar às fases: problema/intenção = generate, spec/refino/validação = prd, tarefas = plan, implemento = execute, revisão = review, integração = pr.
→ "E não é teoria: deixa eu te mostrar isso rodando de verdade, com o Issue Flow."`,
  },
  // ————————————————————————————————————————————————————————————
  // Bloco "Na prática" — Issue Flow rodando (só comandos confirmados).
  // ————————————————————————————————————————————————————————————
  {
    title: 'Prática · Issue Flow rodando',
    notes: `[Steps: 6 — ① issue+generate ② prd ③ plan ④ execute ⑤ review FAIL→PASS (half-loop) ⑥ pr]
"Isto é o Issue Flow, uma ferramenta que eu mantenho — skills + agente + automação. ① Descrevo o problema numa frase e ele cria a issue #42. ② prd: ele gera a especificação. ③ plan: quebra em tarefas (tasks.json). ④ execute: o agente implementa, story a story. ⑤ E aqui está o pulo do gato: review. Ele testa e REPROVA — FAIL. Aí entra o loop de autocorreção: corrige e revalida, até 3 ciclos, até dar PASS. ⑥ pr: abre o Pull Request pronto para revisão humana." Enfatizar o momento FAIL→PASS: "Isto é o que eu chamo de half-loop — o valor não está só em rodar o loop, mas em ter dentro dele algo capaz de dizer NÃO: um teste, um review, um erro real. Um review-issue com loop, até 3 ciclos." (screencast pré-gravado; não rodar ao vivo. Só comandos confirmados.)
→ "Isso tudo só funciona se você domina o que está por baixo. Os fundamentos."`,
  },
]
