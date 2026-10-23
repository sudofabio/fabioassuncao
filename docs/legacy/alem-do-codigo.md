# Além do código: Inteligência artificial e o novo desenvolvedor

Conteúdo textual da palestra, extraído do site antigo (`app/data/presentations/alem-do-codigo/*.ts`,
`app/components/slides/alem-do-codigo/*.vue`) e do material bruto em `_apresentacoes/`.
O motor de slides não foi migrado; a palestra fica preservada como PDF
(`public/presentations/alem-do-codigo/slides.pdf`, 33 páginas) e como este texto.

| Campo       | Valor                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| Título      | Além do código: Inteligência artificial e o novo desenvolvedor                                        |
| Evento      | 10º Talk — Vale do Pindaré Tech                                                                       |
| Local       | IFMA Campus Santa Inês, Santa Inês/MA                                                                 |
| Data        | 10 de julho de 2026                                                                                   |
| URL         | https://fabioassuncao.com/presentations/alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor |
| Idioma      | Português (pt-BR)                                                                                     |
| Palestrante | Fábio Assunção — desenvolvedor de software, Tech Lead e empreendedor                                  |

## Resumo

A evolução do mercado, a comoditização do código e o novo papel do desenvolvedor na era da IA.
A palestra percorre o que a IA está fazendo de verdade com a profissão, "sem hype, sem
terrorismo": por que escrever sintaxe deixou de ser o gargalo, o vocabulário básico da IA
(modelo, ferramenta, editor, agente, MCP, skills), o método que leva do vibe coding ao
Spec-Driven Development (SDD), uma demonstração do Issue Flow, os dados de mercado de 2021 a
2026 e uma visão crítica sobre demissões atribuídas à IA e o custo da tecnologia. Fecha com a
ideia de que a IA não elimina o desenvolvedor: promove de digitador de código a arquiteto de
soluções.

## Estrutura (33 slides, 9 blocos)

**A · Abertura**

1. Além do código — Inteligência artificial e o novo desenvolvedor (capa; "15+ anos em desenvolvimento de software")
2. 15+ anos construindo soluções (quem sou)
3. O que vem por aí (sumário)
4. Escrever sintaxe → Resolver problemas reais ("O código é apenas o meio. O fim é a solução.")

**B · Contexto**

5. No começo, você era só "desenvolvedor" (software em tudo + linha do tempo: o início, a especialização, as plataformas, a nova era)
6. "Dessa vez o dev acabou", de novo ("A tecnologia não elimina a profissão. Ela eleva o nível de abstração.")

**C · A virada**

7. Código virou commodity
8. A barreira de entrada despencou

**D · O mapa da IA**

9. Afinal, o que é essa "IA"? (um LLM é, no fundo, um autocompletar gigante)
10. Quem é quem (OpenAI, Anthropic, Google, Meta, Mistral)
11. Modelo × Ferramenta × Editor × Agente
12. O arsenal do desenvolvedor (prototipação, editores com IA, agentes de terminal)
13. 3 editores, 1 DNA (VS Code, Cursor, Antigravity)
14. MCP, Skills e agentes

**E · O método (SDD)**

15. Funcionar não é o mesmo que estar pronto (iceberg protótipo × produto)
16. A evolução do dev com IA (do Stack Overflow ao SDD)
17. Da vibe ao sistema (Vibe Coding → Prompt Engineering → Loop Engineering)
18. SDD — Spec-Driven Development
19. Da constituição à implementação (Constitution → Specify → Plan → Tasks → Implement)
20. Prompt cru vs. Especificação
21. Do problema ao PR em 9 etapas

**F · Na prática**

22. Issue Flow, rodando
23. Ferramentas mudam. Fundamentos permanecem.

**G · Mercado**

24. 2022: a decisão mais difícil (e mais óbvia)
25. Salários de devs: 2021 → 2026
26. Onde o novo desenvolvedor trabalha

**H · Visão crítica**

27. As empresas que demitiram estão recontratando (efeito bumerangue)
28. "A narrativa que vincula a IA à perda de empregos, para muitos CEOs, é simplesmente conveniente demais." — Jensen Huang
29. Quem está pagando essa conta?

**I · Fechamento**

30. O novo desenvolvedor não é quem digita mais rápido
31. Não lute contra a IA. Torne-se a mente que a governa.
32. Quatro provocações
33. Obrigado! Vamos conversar? (QR code para a URL da palestra; contatos; `npx issue-flow init`)

## Citações (literais, como projetadas)

- "A narrativa que vincula a IA à perda de empregos, para muitos CEOs, é simplesmente conveniente
  demais." — Jensen Huang, CEO da NVIDIA (Channel News Asia, mai/2026)
- "Eu acho que nenhuma empresa estará imune, incluindo a gente." — Sundar Pichai, CEO do Google
  (BBC, nov/2025)
- "Eu acho que há elementos racionais e irracionais em momentos como esse." — Sundar Pichai, CEO
  do Google (BBC, nov/2025)

## Dados apresentados

### Salários médios (Pesquisa Salarial Código Fonte TV 2021–2026)

Fonte: pesquisa.codigofonte.com.br. Em 2021, "Especialista" era agrupado como "Outro".

| Nível                  | 2021      | 2022      | 2023      | 2024      | 2025      | 2026      | Variação |
| ---------------------- | --------- | --------- | --------- | --------- | --------- | --------- | -------- |
| Júnior                 | 2.955,93  | 3.658,92  | 3.987,43  | 4.079,01  | 4.154,21  | 5.060,34  | +71%     |
| Pleno                  | 5.594,11  | 7.387,42  | 8.023,44  | 7.850,47  | 7.840,74  | 8.466,52  | +51%     |
| Sênior                 | 10.601,42 | 14.399,46 | 15.510,34 | 15.050,46 | 15.635,35 | 14.607,85 | +38%     |
| Especialista/Tech Lead | 8.745,12  | 13.012,34 | 16.339,29 | 18.202,92 | 19.290,08 | 20.601,64 | +136%    |

- Estágio (fora do gráfico): 1.323,68 → 2.586,84.
- Salário médio de dev no Maranhão: R$ 3.719 (2021) → R$ 10.047 (2026).
- Adoção de IA entre devs em 2026: 98,5%.

### Modelos de trabalho (Pesquisa Código Fonte TV 2026)

- 2026: Remoto 60,08% · Híbrido 22,44% · Presencial 17,48%.
- Remoto ao longo do tempo: 75,05% (2022) · 72,95% (2023) · 65,74% (2024) · 61,77% (2025) · 60,08% (2026).
- Sentem pressão para voltar ao escritório: 39,48%. Dizem ser mais produtivos em casa: 76,67%.
- Trabalham para empresas do exterior: 14%. Têm mais de um contrato: 22,5%.

### Efeito bumerangue

Fontes: Robert Half (2.000 gestores, EUA, via Fast Company Brasil, jun/2026) · Forrester · Gartner (fev/2026).

- 32% eliminaram cargos por causa da IA e recontrataram para a mesma função (Robert Half).
- 55% dos empregadores se arrependeram de demitir por causa da IA (Forrester).
- 50% das empresas que substituíram atendimento ou operações por IA recriarão as funções até 2027 (Gartner).
- Motivos da recontratação: a IA não tem contexto institucional (40%); exigiu mais supervisão e
  controle de qualidade (38%); ganhos de produtividade abaixo do esperado (35%).

### Custo da IA

- A IA consome 1,5% da eletricidade global (Agência Internacional de Energia, 2024).
- Fontes do slide: BBC News Brasil (18/11/2025) · Agência Internacional de Energia (2024).

### Linha do tempo "Como chegamos até aqui"

~2008 Google + Stack Overflow → nov/2022 ChatGPT → 2023 Copilot & Cursor → fev/2025 Vibe Coding
(termo cunhado por Andrej Karpathy no X em 02/02/2025; Merriam-Webster mar/2025; Palavra do Ano
do Collins 2025) → 2025 a onda de exageros → 2025 o amadurecimento → 2026 SDD.

### Fundamentos concretos (a camada permanente)

| Grupo                   | O quê                               | Por que a IA não dispensa                                                                   |
| ----------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| Máquina & terminal      | Linux · shell · sistema operacional | O agente roda comandos. Se você não lê a saída do terminal, não sabe se ele acertou.        |
| Versionamento           | Git · GitHub · branch · PR          | O fluxo de IA é issue → branch → PR → review. Sem git, você não participa dele.             |
| Web & integração        | HTTP · APIs · REST · auth           | A IA gera o endpoint; você confere o status code, o CORS e o token.                         |
| Empacotamento & entrega | Docker · cloud · deploy · logs      | A IA escreve o app. Ela não sabe por que o container não sobe nem lê o log das 2h por você. |

Mapa de estudos recomendado: roadmap.sh ("uma recomendação, não conteúdo").

## Notas do palestrante (condensadas por bloco)

**Abertura.** Agradecimento ao convite (ao amigo Wesley) e à 10ª edição do Vale do Pindaré Tech.
Proposta: falar do que a IA está fazendo de verdade com a profissão, sem hype e sem terrorismo,
a partir do que ele vivencia no mercado. Apresentação: desenvolvedor de software, Tech Lead e
empreendedor, 15+ anos em backend, arquitetura, cloud e liderança técnica, conectando engenharia,
produto e negócio — "repertório de trincheira", não teoria de slide.

**Contexto.** Software está em tudo. Quando ele começou não havia divisão entre front, back,
DevOps, SRE e QA; depois vieram as especializações e o ágil; agora, a era da IA e dos agentes. A
cada virada alguém decretou a morte do dev (low-code, no-code, geradores de site, CMS,
frameworks). O que cada onda fez foi subir o nível de abstração. Também não é o paraíso dos
gurus: o que existe é fundamentos, método e experiência.

**A virada.** Com cerca de US$ 20 por mês qualquer pessoa gera código (Codex, Claude Code, Gemini
CLI, Cursor, Copilot); escrever sintaxe deixou de ser o gargalo, mas nem todo código gerado
presta — e aí mora a oportunidade para quem garante qualidade. Um protótipo custava R$ 20–100 mil
com uma empresa ou R$ 10–20 mil com um freelancer; hoje, uma assinatura e algumas horas. O
profissional genérico é o primeiro a perder espaço.

**O mapa da IA.** Um LLM é um autocompletar gigante: prevê o próximo trecho, não entende como a
gente; por isso erra com confiança e o humano continua no comando. Pouquíssimas empresas treinam
os modelos base (OpenAI, Anthropic, Google, Meta, Mistral). Analogia: modelo é o motor,
ferramenta são as mãos, editor é o carro, agente é o piloto automático — mas quem define o
destino é você. Três famílias de ferramentas: prototipação no navegador (Lovable, v0, Bolt,
Replit), editores com IA (VS Code + Copilot, Cursor, Antigravity) e agentes de terminal (Claude
Code, Codex, Gemini CLI). Os três editores têm o mesmo DNA (VS Code); aprenda o VS Code de verdade.
MCP é a "porta USB-C da IA"; skills são pacotes de conhecimento; agentes juntam tudo num fluxo
supervisionado; subagentes são especialistas acionados pelo agente principal.

**O método.** Protótipo não é produto: tráfego real, tentativa de invasão, evolução do sistema e
LGPD separam o código de qualquer jeito do produto consistente. Três níveis de maturidade: Vibe
Coding (ótimo para explorar, perigoso para entregar), Prompt Engineering (papel, contexto,
restrições e critérios de aceite) e Loop Engineering (agente que age, observa, corrige e repete,
com limites e regras de parada). SDD: assim como o TDD fazia o teste guiar o código, a
especificação guia a implementação; sem descrever o problema com precisão, a IA entrega uma
solução tecnicamente correta e inútil para o negócio. Fluxo: Constitution, Specify, Plan, Tasks,
Implement — sempre com validação humana. "Faça um app de tarefas" gera algo genérico; a
especificação gera algo aderente, testável e evoluível. Nove etapas do problema ao Pull Request.

**Na prática.** Demonstração do Issue Flow, ferramenta que ele mantém (skills + agente +
automação): uma frase vira a issue 42; `prd`, `plan`, `execute`, `review` (reprova com FAIL e
autocorrige em até três ciclos até PASS) e `pr`. O "meio-loop": o valor está em ter dentro do loop
algo capaz de dizer "não". Os nomes das ferramentas mudam; os fundamentos ficam: "aprenda os
fundamentos usando as ferramentas, não use as ferramentas para pular os fundamentos".

**Mercado.** História pessoal: na pandemia faltou gente; em 2022 a empresa dele sofria com
clientes quebrando contrato e devs recebendo propostas que dobravam o salário; ele pausou a
operação (slide: "Pausa na Codions") e foi testar o mercado, chegando a trabalhar full-time para
duas ou três empresas ao mesmo tempo, Brasil e EUA — "ponto fora da curva não dura". Salários
2021–2026: o mercado se seniorizou; Especialista/Tech Lead foi o único nível que cresceu todos os
anos. Trabalha remoto desde 2015; hoje 60% remoto, e "você, aqui de Santa Inês, pode trabalhar
para o mundo inteiro".

**Visão crítica.** O efeito bumerangue (Robert Half, Forrester, Gartner). Jensen Huang: a
narrativa é "conveniente demais"; o perigo real não é a IA roubar o emprego, é gestor usando o
hype para justificar corte. Sundar Pichai admite elementos irracionais no boom; a IA já consome
1,5% da eletricidade global; o acesso de US$ 20 é subsídio — no médio prazo o preço sobe, a
ferramenta muda ou some. A proteção não é a ferramenta: são os fundamentos.

**Fechamento.** A IA não elimina o desenvolvedor, promove: de digitador de código a arquiteto de
soluções; reduz a barreira de entrada e aumenta a exigência de maturidade. Pergunta final: "você
tem o repertório para saber se o que ela entregou é o que o seu negócio precisa?" O novo
desenvolvedor escreve a partitura que a orquestra executa. Quatro provocações: se a IA escreve o
código, o que você está vendendo? Vibe coding é dívida técnica com marketing melhor? Quando a
conta da IA subir, seus fundamentos seguram? Seu fluxo de IA tem algo que sabe dizer "não"?
Agradecimentos ao Vale do Pindaré Tech, ao IFMA e ao público.

## Links de referência (de `_apresentacoes/.../LINKS.md`)

**Mercado e IA**

- https://fastcompanybrasil.com/ia/empresas-recontratam-funcionarios-demitidos-por-ia/
- https://ibre.fgv.br/blog-da-conjuntura-economica/temas/impactos-do-avanco-da-inteligencia-artificial-no-mercado-de
- https://g1.globo.com/trabalho-e-carreira/noticia/2026/05/30/ceos-do-setor-de-ia-tentam-conter-temor-sobre-desemprego-em-massa-causado-pela-tecnologia.ghtml
- https://www.terra.com.br/byte/cada-vez-mais-empresas-recontratam-funcionarios-demitidos-por-conta-da-ia-substituicao-nao-gerou-lucros,89e7269e40863f50615ccbea3916c6d612pe4je5.html
- https://www.bbc.com/portuguese/articles/c620p53kny5o
- https://tecnoblog.net/noticias/duolingo-volta-atras-e-nao-vai-avaliar-adesao-de-funcionarios-a-ia/
- https://www.infomoney.com.br/business/global/cfos-dizem-que-demissoes-por-ia-serao-9x-maiores-neste-ano-mas-ainda-atingem-poucos/
- https://www.ihu.unisinos.br/666144-nada-e-mais-como-antes-veja-como-a-ia-esta-transformando-nossos-empregos-e-o-mercado-de-trabalho
- https://g1.globo.com/trabalho-e-carreira/noticia/2026/04/23/inteligencia-artificial-ja-reduz-emprego-entre-jovens-no-brasil-e-ameaca-formacao-profissional.ghtml
- https://forbes.com.br/forbes-tech/2026/06/ia-eleva-salarios-de-liderancas-de-ti-e-reduz-vagas-de-inicio-de-carreira/
- https://www.forbes.com/sites/eriksherman/2026/05/27/the-ai-giants-see-a-potential-meltdown/
- https://forbes.com.br/geral/2026/05/nao-lute-contra-a-ia-diz-presidente-do-hsbc/
- https://escoladepos.ufg.br/como-a-ia-generativa-esta-criando-novas-oportunidades-no-mercado-de-trabalho/

**Pesquisa Código Fonte TV**

- https://pesquisa.codigofonte.com.br/2026 · https://www.youtube.com/watch?v=MpeCQl_waEs
- https://pesquisa.codigofonte.com.br/2025 · https://www.youtube.com/watch?v=kJ6BMQCWCOg
- https://pesquisa.codigofonte.com.br/2024 · https://www.youtube.com/watch?v=83pcw_A_r8U
- https://pesquisa.codigofonte.com.br/2023 · https://www.youtube.com/watch?v=5YtgOlZnjo0
- https://pesquisa.codigofonte.com.br/2022 · https://www.youtube.com/watch?v=Fdw15cZ0j5E
- https://pesquisa.codigofonte.com.br/2021 · https://www.youtube.com/watch?v=Dd-SW__yMgI

**Método, SDD e ferramentas**

- https://addyosmani.com/blog/loop-engineering/
- https://imasters.com.br/desenvolvimento/vibe-coding-mas-pronto-para-producao-um-loop-de-feedback-orientado-por-especificacoes-para-desenvolvimento-com-ia
- https://imasters.com.br/inteligencia-artificial/harness-engineering-a-camada-que-faltava-no-desenvolvimento-de-ia-guiado-por-especificacoes
- https://blog.dsacademy.com.br/spec-driven-development-a-nova-arquitetura-de-engenharia-de-software-na-era-dos-agentes-de-ia-parte-3/
- https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
- https://www.tecmundo.com.br/mercado/408442-o-futuro-do-vibe-coding-quando-o-dev-vira-roteirista-da-ia.htm
- https://github.com/github/spec-kit/blob/main/spec-driven.md
- https://github.com/github/spec-kit
- https://heeki.medium.com/using-spec-driven-development-with-claude-code-4a1ebe5d9f29
- https://www.softdesign.com.br/blog/spec-driven-development/
- https://www.ibm.com/think/topics/spec-driven-development
- https://github.com/fabioassuncao/issue-flow
- https://github.com/fabioassuncao/Tutorial-Claude-Code
- https://skills.sh
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://modelcontextprotocol.io/docs/getting-started/intro

**Vídeos**

- https://www.youtube.com/watch?v=YFDp-smGYqQ
- https://www.youtube.com/watch?v=cAcGrs7RHBM
- https://www.youtube.com/watch?v=ytTJtfg9HCw
- https://www.youtube.com/watch?v=xfq9yfRAvsc
- https://www.youtube.com/watch?v=3O09r6xCrfU
- https://www.youtube.com/watch?v=16IYx0CekVc
- https://www.youtube.com/watch?v=puUDMsldZTU
