# Inventário do site antigo (Nuxt 4)

Registro do que existia em `fabioassuncao.com` antes da reconstrução em Next.js.
Do site antigo foi aproveitada **apenas informação**: nenhum código, componente
ou estilo foi reaproveitado. Este arquivo também guarda os textos em inglês
para uma futura versão EN do site.

- **Fonte:** branch `main` do repositório `fabioassuncao/fabioassuncao`, commit
  `603fb64` ("Improvements"), lido a partir de uma cópia fora do repositório.
- **Base do site novo:** template `mldangelo/personal-site` (MIT), commit
  `9273f7c48e5f4e39693bdc586b6d567f2ab4deb4` (HEAD do `main` em 2026-10-12).
- **Pendências** estão marcadas com `TODO(fabio)`.

## 1. Identidade

| Campo                       | Valor                                                                              | Origem                |
| --------------------------- | ---------------------------------------------------------------------------------- | --------------------- |
| Nome                        | Fábio Assunção                                                                     | `app/data/profile.ts` |
| Localização                 | Brasil / Brazil                                                                    | `app/data/profile.ts` |
| Títulos (iguais em PT e EN) | Software Engineer · Backend Specialist · Cloud Architect · Open Source Contributor | `app/data/profile.ts` |
| Título padrão do site       | Fábio Assunção — Software Engineer                                                 | `app/app.vue`         |

### Intro

- **PT:** "Engenheiro de software com mais de 15 anos de experiência,
  especializado em backend, arquitetura de sistemas distribuídos e cloud
  computing."
- **EN:** "Software engineer with 15+ years of experience, specializing in
  backend development, distributed systems architecture, and cloud computing."

### About

- **PT:** "Ao longo da minha carreira, atuei em projetos de diferentes escalas —
  de startups a empresas consolidadas — sempre com foco em construir soluções
  robustas, escaláveis e bem estruturadas. Tenho experiência sólida com PHP, Go,
  Node.js/TypeScript, Python e Rust, além de forte atuação em DevOps,
  infraestrutura cloud (AWS, GCP, Cloudflare) e arquitetura de microsserviços.
  Sou entusiasta de open source e acredito que compartilhar conhecimento é a
  melhor forma de evoluir como profissional."
- **EN:** "Throughout my career, I've worked on projects of varying scales — from
  startups to established companies — always focused on building robust,
  scalable, and well-structured solutions. I have solid experience with PHP, Go,
  Node.js/TypeScript, Python, and Rust, along with strong expertise in DevOps,
  cloud infrastructure (AWS, GCP, Cloudflare), and microservices architecture.
  I'm an open-source enthusiast and believe that sharing knowledge is the best
  way to grow as a professional."

### Minibio de palestrante (só PT)

Fonte: `app/data/presentations/alem-do-codigo/contatos.ts` e
`_apresentacoes/.../PALESTRANTE/README.md`.

> Desenvolvedor de software, Tech Lead e empreendedor, com mais de 15 anos de
> experiência em backend, arquitetura de sistemas, cloud computing e liderança
> técnica. Atua na construção de soluções escaláveis, conectando engenharia,
> produto e negócio.

É o texto mais forte e serve de ponto de partida do hero.

### Fatos de carreira ditos pelo próprio Fábio na palestra

Fonte: notas do apresentador (`notas.ts`) e slide 17 (`Slide17Historia.vue`).

- "Eu trabalho remoto desde 2015."
- Em 2022 a empresa dele enfrentava clientes quebrando contrato e devs recebendo
  propostas que dobravam o salário. O slide diz "Pausa na Codions — testar o
  mercado". Ele pausou a operação, e toda a equipe se recolocou.
- Depois disso, trabalhou full-time para duas ou três empresas ao mesmo tempo,
  entre Brasil e Estados Unidos.
- Mantém o **Issue Flow** ("uma ferramenta que eu mantenho: skills, mais agente,
  mais automação").
- `TODO(fabio)`: confirmar se esses fatos podem aparecer no site (nome da
  Codions, trabalho simultâneo para empresas dos EUA).

## 2. Linha do tempo

Fonte: `app/data/timeline.ts`. O campo `period` é o mesmo em PT e EN. A entrada
atual dizia "Present" até no modo PT. Nenhuma entrada tem empresa, cidade ou
link.

| Período      | Cargo PT / EN                                                                                | Descrição PT / EN                                                                                                                                                                                                                            | Empresa                 |
| ------------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 2022 — atual | Engenheiro de Software Sênior / Arquiteto Cloud · Senior Software Engineer / Cloud Architect | "Arquitetura de sistemas distribuídos, microsserviços e infraestrutura cloud com foco em escalabilidade e resiliência." / "Distributed systems architecture, microservices, and cloud infrastructure focused on scalability and resilience." | `TODO(fabio): empresa?` |
| 2019 — 2022  | Engenheiro de Software Backend · Backend Software Engineer                                   | "Desenvolvimento de APIs de alta performance, integração de sistemas e automação de pipelines CI/CD." / "High-performance API development, systems integration, and CI/CD pipeline automation."                                              | `TODO(fabio): empresa?` |
| 2016 — 2019  | Desenvolvedor Full Stack · Full Stack Developer                                              | "Aplicações web completas com PHP, JavaScript e frameworks modernos. Primeiras experiências com containers e cloud." / "Full web applications with PHP, JavaScript, and modern frameworks. First experiences with containers and cloud."     | `TODO(fabio): empresa?` |
| 2014 — 2016  | Desenvolvedor Web · Web Developer                                                            | "Desenvolvimento de sistemas web, e-commerce e integração com APIs de pagamento e logística." / "Web systems development, e-commerce, and integration with payment and logistics APIs."                                                      | `TODO(fabio): empresa?` |
| 2012 — 2014  | Desenvolvedor PHP · PHP Developer                                                            | "Construção de aplicações web com PHP e MySQL. Introdução a boas práticas e padrões de projeto." / "Building web applications with PHP and MySQL. Introduction to best practices and design patterns."                                       | `TODO(fabio): empresa?` |
| 2010 — 2012  | Desenvolvedor Júnior · Junior Developer                                                      | "Manutenção de sistemas legados e desenvolvimento de pequenas aplicações web." / "Legacy system maintenance and development of small web applications."                                                                                      | `TODO(fabio): empresa?` |
| 2008 — 2010  | Estagiário de Desenvolvimento · Development Intern                                           | "Primeiros passos em programação, suporte técnico e desenvolvimento de scripts de automação." / "First steps in programming, technical support, and automation script development."                                                          | `TODO(fabio): empresa?` |

`TODO(fabio)`: dizer se a linha do tempo pode citar empregadores e órgãos
públicos atendidos, e informar meses de início e fim (o site antigo só tinha
anos).

## 3. Skills

Fonte: `app/data/skills.ts`.

| Grupo PT / EN                   | Itens                                                                   |
| ------------------------------- | ----------------------------------------------------------------------- |
| Backend / Backend               | PHP, Go, Node.js, TypeScript, Python, Rust, SQL                         |
| Arquitetura / Architecture      | Microservices, Event-Driven, REST / GraphQL, Domain-Driven Design, CQRS |
| Cloud & DevOps / Cloud & DevOps | AWS, GCP, Cloudflare, Docker, Kubernetes, Terraform, CI/CD              |
| Engenharia / Engineering        | Git, Linux, Testing, Observability, Performance, Security               |

O site antigo não tinha nível de proficiência.
`TODO(fabio)`: nível de 1 a 5 por skill, se quiser usar as barras do template.

O README antigo (perfil do GitHub) tinha uma linha "Ask me about" com Docker,
K8S, AWS, PHP, Laravel, Python, Node.js e Go.

## 4. Links e contato

| Canal          | URL                                             | Origem                                                                       |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| GitHub         | https://github.com/fabioassuncao                | `profile.ts`, README, Fábio (out/2026)                                       |
| LinkedIn       | https://www.linkedin.com/in/fabioassuncao       | `profile.ts`, `PALESTRANTE/README.md`                                        |
| X              | https://x.com/fabioassuncaohq                   | `profile.ts`, Fábio (out/2026). O README usava `twitter.com/fabioassuncaohq` |
| Instagram      | https://instagram.com/fabioassuncaohq           | README, Fábio (out/2026)                                                     |
| YouTube        | https://www.youtube.com/@fabioassuncaohq        | README                                                                       |
| TikTok         | https://www.tiktok.com/@fabioassuncaohq         | Fábio (out/2026)                                                             |
| WhatsApp       | https://wa.me/5598985643922 (+55 98 98564-3922) | Fábio (out/2026)                                                             |
| Threads        | `TODO(fabio): @ do Threads`                     | não consta                                                                   |
| E-mail público | contato@fabioassuncao.com                       | `contatos.ts`, `PALESTRANTE/README.md`                                       |

- O **e-mail pessoal do README antigo** não deve ser publicado. O único e-mail
  público é `contato@fabioassuncao.com`.
- Os ícones sociais do README vinham de `raw.githubusercontent.com`
  (rahuldkjain) e foram descartados.
- O hero antigo mostrava só GitHub e LinkedIn. O rodapé mostrava também o X.

## 5. SEO e metadados

Fontes: `app/app.vue`, `app/composables/usePageSeo.ts`, `nuxt.config.ts`,
`public/robots.txt`.

- **Títulos:** template `"<página> · Fábio Assunção"`. Padrão: "Fábio Assunção —
  Software Engineer".
- **Description global:** "Software engineer with 15+ years of experience
  specializing in backend, distributed systems, and cloud computing."
- **Open Graph:** `og:type` website, `og:url` https://fabioassuncao.com,
  `og:locale` en_US, `og:locale:alternate` pt_BR, `og:site_name` "Fábio
  Assunção". Não havia `og:image`.
- **Twitter:** `twitter:card` summary, `twitter:site` e `twitter:creator`
  @fabioassuncaohq.
- **theme-color:** `#0f0d0b`.
- **Favicon:** `/favicon.ico` (32×32). Não havia apple-touch-icon nem manifest.
- **Canonical:** por página. Era `${base}/` na home e `${base}${path}` sem barra
  final nas demais.
- **Locale:** o padrão era `en`, sem detecção nem persistência. A página da
  palestra forçava `lang="pt-BR"` e `og:locale` pt_BR.
- **Sitemap:** `@nuxtjs/sitemap` sem configuração própria, gerado em
  `/sitemap.xml` a partir das rotas.
- **robots.txt:**

  ```
  User-Agent: *
  Disallow:

  Sitemap: https://fabioassuncao.com/sitemap.xml
  ```

- **JSON-LD `Person`:**

  ```json
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Fábio Assunção",
    "url": "https://fabioassuncao.com",
    "jobTitle": "Software Engineer",
    "description": "Software engineer with 15+ years of experience specializing in backend, distributed systems, and cloud computing.",
    "knowsAbout": [
      "Backend Development",
      "Cloud Architecture",
      "Distributed Systems",
      "PHP",
      "Go",
      "Node.js",
      "TypeScript",
      "Python",
      "Rust",
      "AWS",
      "GCP",
      "Cloudflare",
      "Docker",
      "Kubernetes"
    ],
    "sameAs": [
      "https://github.com/fabioassuncao",
      "https://linkedin.com/in/fabioassuncao",
      "https://x.com/fabioassuncaohq"
    ],
    "address": { "@type": "PostalAddress", "addressCountry": "BR" }
  }
  ```

- **Página da palestra:** JSON-LD `PresentationDigitalDocument` com `name`,
  `description` (PT), `inLanguage` pt-BR e `author` Person.

### SEO por página

| Rota             | Título                                                | Descrição                                                                                                                                                                                                                  |
| ---------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`              | padrão                                                | global                                                                                                                                                                                                                     |
| `/presentations` | "Talks & Presentations" / "Palestras & Apresentações" | EN: "Talks and technical presentations by Fábio Assunção on software engineering, AI, and cloud computing." PT: "Palestras e apresentações técnicas de Fábio Assunção sobre engenharia de software, IA e cloud computing." |
| palestra         | título da palestra                                    | "Palestra no {evento}. {descrição PT}"                                                                                                                                                                                     |

## 6. Rotas antigas

| URL                                                                            | Situação no site novo                                   |
| ------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `/`                                                                            | mantida (nova home)                                     |
| `/presentations`                                                               | mantida como `/presentations/` (lista)                  |
| `/presentations/alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor` | **mantida exatamente**: está no QR code do último slide |

O site antigo não tinha redirects, `_redirects`, `_headers` nem configuração de
barra final. O deck aceitava os parâmetros `?export=pdf`, `?presenter=1`,
`?manual=1` e o hash `#N/S`, que deixam de existir.

## 7. Palestra publicada

| Campo                 | Valor                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| Título                | Além do código: Inteligência artificial e o novo desenvolvedor                                        |
| Evento                | 10º Talk — Vale do Pindaré Tech                                                                       |
| Local                 | IFMA Campus Santa Inês/MA                                                                             |
| Data                  | 10 de julho de 2026                                                                                   |
| URL pública (QR code) | https://fabioassuncao.com/presentations/alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor |
| Descrição PT          | "A evolução do mercado, a comoditização do código e o novo papel do desenvolvedor na era da IA."      |
| Descrição EN          | "Market evolution, code commoditization, and the developer's new role in the AI era."                 |
| Slides                | 33 renderizados (36 componentes; 3 fora da ordem final)                                               |

- **PDF:** gerado em `public/presentations/alem-do-codigo/slides.pdf`.
  - Usou a exportação do próprio deck (`?export=pdf`: snapdom + jsPDF, 2560×1440
    por slide), rodando o site antigo localmente e capturando o download com
    Chrome headless (Playwright).
  - Depois foi recomprimido para 1920×1080, JPEG qualidade 78, ficando com cerca
    de 3,1 MB e 33 páginas.
- **Conteúdo textual:** extraído para [`docs/legacy/alem-do-codigo.md`](legacy/alem-do-codigo.md).
- **Resumo publicado:** em `content/writing/alem-do-codigo-ia-e-o-novo-desenvolvedor.md`.
- **Foto:** `public/presentations/alem-do-codigo/photo.jpeg`, 460×460, 21 KB.
  Virou `public/images/me.jpg` no site novo. `TODO(fabio): foto em alta resolução
(mínimo 1024×1024)`.
- **Logos de terceiros:** os 37 SVGs em `public/presentations/alem-do-codigo/logos/`
  pertencem aos slides e **não** foram levados.
- **Material bruto:** fica fora do controle de versão, em `_apresentacoes/`
  (pasta ignorada). Inclui roteiro, PDFs de notícias, relatórios NotebookLM e QR
  codes.

## 8. Projetos citados

Os links de referência da palestra (`_apresentacoes/.../LINKS.md`) citam dois
repositórios do Fábio:

- https://github.com/fabioassuncao/issue-flow (Issue Flow, demonstrado na palestra)
- https://github.com/fabioassuncao/Tutorial-Claude-Code

O site antigo não tinha página de projetos. Brasil Data Hub e Base Empresarial
(produtos sob a Codions) não aparecem em nenhum arquivo.
`TODO(fabio): descrição e link de Brasil Data Hub e Base Empresarial`.

## 9. Integrações e analytics

- **Busca nos arquivos rastreados** (sem diferenciar maiúsculas, fora o
  package-lock) por `gtag`, `G-`, `GTM-`, `analytics`, `beacon`, `pixel`,
  `plausible` e `umami`:
  - Só apareceram tipos gerados em `worker-configuration.d.ts`: `sendBeacon`,
    `AnalyticsEngineDataset`, `AnalyticsEngineDataPoint` e comentários "in
    pixels".
  - O padrão `\bG-[A-Z0-9]{6,}` não teve nenhum resultado.
  - **Conclusão: não há analytics, pixel nem formulário no código.**
- **Cloudflare Web Analytics** pode estar ligado pelo painel, com injeção
  automática que não aparece no código. `TODO(fabio)`: confirmar no painel.
- O `observability.enabled: true` do wrangler é Workers Observability (logs), não
  analytics de visitantes.

## 10. Deploy antigo

- **Comando:** `wrangler pages deploy` no projeto Cloudflare Pages
  `fabioassuncao`.
- **wrangler.jsonc:** `pages_build_output_dir: ./dist`,
  `compatibility_date: 2026-03-01`, `compatibility_flags: ["nodejs_compat"]`,
  `observability.enabled: true`. Sem bindings nem vars.
- **Nitro:** preset `cloudflare-pages`, `nodeCompat`, prerender de
  `/presentations/**`.
- **Node:** `.node-version` = 22.
- **CI:** sem GitHub Actions, sem `functions/` e sem `server/`.
  `TODO(fabio)`: confirmar no painel se o projeto Pages está ligado ao Git.

## 11. Visual antigo (referência, não reaproveitado)

**Site**

- **Fontes:** Syne (display), IBM Plex Sans (texto), IBM Plex Mono (rótulos), via
  Google Fonts. O site **não** usava JetBrains Mono.
- **Cores:**
  - fundo escuro `#0f0d0b` com texto `#e0dbd2`
  - fundo claro `#faf9f7` com texto `#1c1917`
  - accent dourado `#d4a54a` (light `#e8c67a`, dim `#a17c32`)
- **Títulos de seção:** em mono, uppercase, com prefixo `//` na cor de destaque.
  O hero usava `>` antes do nome.

**Deck da palestra (tema "Blueprint")**

- **Fontes:** Space Grotesk, Inter e JetBrains Mono (self-hosted).
- **Cores:**
  - fundo `#0B1526`
  - ciano `#37C6F4` (máquina)
  - coral `#F2762E` (humano)
  - verde `#3ECF8E`
  - âmbar `#E8B44C`

## 12. Descartado

- Todo o código Nuxt/Vue:
  - componentes, composables, layouts e páginas
  - `nuxt.config.ts`, `tailwind.config.ts`, `env.d.ts`
  - `worker-configuration.d.ts`, `.node-version`, `docs.md`
  - o `CLAUDE.md` antigo
- O motor de slides (`app/components/deck/`), os fundos animados, os 36
  componentes de slide, o tema `alem-do-codigo.ts` e as dependências gsap,
  echarts, snapdom, jspdf e qrcode.vue. A palestra fica preservada como PDF mais
  texto.
- Os logos de terceiros dos slides.
- O seletor de idioma PT/EN. O site novo é só PT-BR, e os textos EN estão
  guardados acima.
- O README antigo, que era o perfil do GitHub.
