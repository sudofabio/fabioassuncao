---
title: 'Além do código: inteligência artificial e o novo desenvolvedor'
date: '2026-07-10'
description: 'Resumo da palestra no 10º Talk do Vale do Pindaré Tech (IFMA Santa Inês): código virou commodity, do vibe coding ao SDD e o que o mercado mostra.'
---

Em 10 de julho de 2026 eu apresentei a palestra "Além do código: inteligência artificial e o novo desenvolvedor" no 10º Talk do Vale do Pindaré Tech, no IFMA Campus Santa Inês. A proposta foi conversar sobre o que a IA está fazendo de verdade com a nossa profissão. Sem hype e sem terrorismo, a partir do que eu vivencio no mercado. Este texto resume o que eu disse no palco.

## Desenvolver nunca foi só digitar código

Software está em tudo: nos apps do celular, nos sistemas das empresas, nas automações, nas plataformas de governo. A forma de construir isso mudou muito. Quando eu comecei, não existia essa divisão entre front, back, DevOps, SRE e QA. Você era desenvolvedor, ponto. Depois vieram as especializações, os times maiores, o ágil. Agora estamos na era da IA e dos agentes.

Em cada uma dessas viradas, alguém decretou a morte do desenvolvedor. O low-code ia acabar com o dev, o no-code também, e os geradores de site, os CMS, os frameworks. Aqui estamos nós. O que cada onda fez foi subir o nível de abstração: menos digitação mecânica, mais pensamento sistêmico. Com a IA é o mesmo filme, só que muito mais rápido.

Também não é o paraíso que alguns gurus vendem. O que existe é fundamento, método e experiência.

## Código virou commodity

Hoje, com uma assinatura de mais ou menos vinte dólares por mês, qualquer pessoa gera código com Codex, Claude Code, Gemini CLI, Cursor ou Copilot. Escrever sintaxe deixou de ser o gargalo. Isso não quer dizer que todo código gerado presta, e é exatamente aí que mora a oportunidade para quem sabe garantir qualidade.

A barreira de entrada despencou. Um protótipo feito por uma empresa custava de vinte a cem mil reais, e com um freelancer, de dez a vinte mil. Hoje é uma assinatura e algumas horas descrevendo o que você quer. O profissional genérico, que fazia de tudo um pouco e de qualquer jeito, é o primeiro a perder espaço.

## O mapa da IA, sem jargão

Um LLM é, no fundo, um autocompletar gigante: ele prevê o próximo trecho de texto ou de código. Ele não entende como a gente entende, ele prevê. Por isso às vezes erra com toda a confiança do mundo, e é por isso que você continua no comando.

Pouquíssimas empresas treinam os modelos base: OpenAI, Anthropic, Google, Meta e Mistral. Todo o resto do ecossistema constrói em cima delas. Para separar os nomes, usei uma analogia:

- o **modelo** é o motor;
- a **ferramenta** são as mãos, que dão ações ao modelo;
- o **editor** é o carro onde você dirige dentro do seu código;
- o **agente** é o piloto automático, que planeja, executa, observa e corrige. Quem define o destino é você.

Completam o vocabulário o MCP, um padrão aberto que funciona como a porta USB-C da IA, as skills, que são pacotes de instruções para tarefas repetíveis, e os subagentes.

## Do vibe coding ao SDD

Protótipo não é produto. Os dois funcionam na demonstração. A diferença aparece quando chega tráfego real, uma tentativa de invasão, a necessidade de evoluir o sistema ou a LGPD batendo na porta. Para construir produto de verdade com IA, é preciso método.

Apresentei três níveis de maturidade:

1. **Vibe coding** é ótimo para explorar e perigoso para entregar.
2. **Prompt engineering** dá ao modelo papel, contexto, restrições e critérios de aceite.
3. **Loop engineering** desenha um agente que age, observa, corrige e repete, com limites e regras de parada.

O passo seguinte é o **Spec-Driven Development (SDD)**. Assim como no TDD o teste guiava o código, no SDD a especificação guia a implementação, e a IA implementa. Se você não consegue descrever o problema com precisão, a IA entrega uma solução tecnicamente correta e completamente inútil para o negócio. A pergunta deixou de ser se você vai usar IA. Agora é como usar: de forma profissional, com segurança e eficiência.

O fluxo tem cinco etapas, Constitution, Specify, Plan, Tasks e Implement, sempre com validação humana. Para mostrar na prática, comparei o prompt cru "faça um app de tarefas" com uma especificação que define contexto, stack, regras de negócio e critérios de segurança. O primeiro gera algo genérico, com dívida técnica embutida. O segundo gera algo aderente, testável e evoluível.

## Na prática: o Issue Flow

Fiz a demonstração com o [Issue Flow](https://github.com/codions-archive/issue-flow), uma ferramenta que eu desenvolvi. Eu descrevo o problema numa frase e ele cria a issue. Depois roda as etapas em sequência:

1. `prd` gera a especificação;
2. `plan` quebra o trabalho em tarefas;
3. `execute` implementa;
4. `review` testa e reprova quando precisa, autocorrigindo até passar;
5. `pr` abre o Pull Request para revisão humana.

O momento em que o FAIL vira PASS mostra o ponto principal. O valor não está só em rodar o loop: está em ter, dentro dele, algo capaz de dizer "não".

Tudo isso só funciona com fundamentos. Os nomes das ferramentas mudam a cada poucos meses, mas quatro grupos continuam: máquina e terminal, versionamento, web e integração, empacotamento e entrega. Aprenda os fundamentos usando as ferramentas, e não use as ferramentas para pular os fundamentos.

## O que os números mostram

Os dados da Pesquisa Salarial Código Fonte TV de 2021 a 2026 mostram um mercado que se seniorizou. Especialista/Tech Lead foi o único nível que cresceu todos os anos, com alta de 136% no período. O sênior teve a primeira queda nominal em 2026. Em 2026, 98,5% dos devs já usam IA. No Maranhão, o salário médio de dev saiu de R$ 3.719 em 2021 para R$ 10.047 em 2026.

O trabalho também mudou de lugar. Pela mesma pesquisa, em 2026 temos 60% remoto, 22% híbrido e 17% presencial. 14% dos devs brasileiros trabalham para empresas do exterior. Ou seja, quem está em Santa Inês pode trabalhar para o mundo inteiro.

## O que as manchetes não contam

Existe um efeito bumerangue. Uma pesquisa da Robert Half com dois mil gestores nos Estados Unidos mostrou que 32% eliminaram cargos por causa da IA e precisaram recontratar para a mesma função. A Forrester aponta que 55% dos empregadores se arrependeram de demitir por causa da IA. O Gartner prevê que metade das empresas que trocaram atendimento ou operações por IA vai recriar essas funções até 2027.

Jensen Huang, CEO da NVIDIA, resumiu assim: para muitos CEOs, a narrativa que liga a IA à perda de empregos é simplesmente conveniente demais. O perigo real não é a IA roubar o seu emprego. É gestor usando o hype para justificar corte.

Também existe a conta. A IA já consome 1,5% da eletricidade global, segundo a Agência Internacional de Energia. E o acesso de vinte dólares por mês é subsidiado. No médio prazo, ou o preço sobe, ou a ferramenta muda, ou ela some. A sua proteção contra isso não é a ferramenta. São os fundamentos.

## O novo desenvolvedor

A IA não elimina o desenvolvedor, ela o promove: de digitador de código a arquiteto de soluções. Ela reduz a barreira de entrada e, ao mesmo tempo, aumenta a exigência de maturidade.

Fechei com uma pergunta: se a IA pode escrever qualquer código que você pedir, em segundos, você tem o repertório para saber se o que ela entregou é o que o seu negócio precisa? Não lute contra a IA. Torne-se a mente que a governa.

Os slides completos estão na [página da palestra](/presentations/alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor/). Se quiser conversar sobre um projeto, [peça um orçamento](/trabalhe-comigo/#orcamento).
