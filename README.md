# fabioassuncao.com

Site pessoal de Fábio Assunção, **IA, código e segurança. Sem hype, com 15 anos
de estrada.** É o destino das redes sociais (Instagram, TikTok, YouTube, X,
LinkedIn): apresenta o Fábio, o que ele faz, palestras e artigos, e leva a uma
conversa pelo chat de `/contato/` ou pelo WhatsApp. Em português (pt-BR).

O posicionamento, o tom, a identidade visual, o funil e os fatos aprovados vêm
do projeto de social media (`/Users/fabioassuncao/Projects/socialmedia`): veja
as regras em [AGENTS.md](./AGENTS.md). A Codions (codions.com) aparece como a
empresa por trás dos projetos, não como a marca do site.

Construído sobre o template [mldangelo/personal-site](https://github.com/mldangelo/personal-site)
(MIT), no commit `9273f7c48e5f4e39693bdc586b6d567f2ab4deb4`. O site anterior
(Nuxt 4) foi substituído; o que foi aproveitado dele está em
[`docs/legacy-inventory.md`](./docs/legacy-inventory.md).

## O que tem aqui

- **[vinext](https://vinext.io)** (a API do Next.js App Router sobre o Vite 8)
  com `output: 'export'`: o build gera HTML estático em `dist/client/`.
- **Cloudflare Pages** (projeto `fabioassuncao`) serve `dist/client/` e a Pages
  Function `functions/api/lead.ts`, que recebe o chat de contato.
- Páginas: `/`, `/about/`, `/trabalhe-comigo/` (o que eu faço),
  `/contato/` (chat de qualificação), `/presentations/`, `/writing/`,
  `/projects/`, `/resume/` (+ `/resume.json`) e `/privacidade/`.
  `/contact/` e `/links/` redirecionam para `/contato/`.
- Autoridade para buscadores e IAs: JSON-LD com `Person` em
  `https://fabioassuncao.com/#person`, `sitemap.xml`, `feed.xml`, `llms.txt` e
  `.well-known/security.txt`.

## Rodando localmente

Use a versão de Node do `.nvmrc`:

```bash
nvm install
npm ci
npm run dev
```

Abra <http://localhost:3000>. Para testar o formulário, crie `.env.local` com a
site key de teste do Turnstile e `.dev.vars` a partir de `.dev.vars.example`:

```bash
echo "NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA" > .env.local
cp .dev.vars.example .dev.vars
npm run preview   # build + wrangler pages dev (estáticos, _headers e Function)
```

## Comandos

```bash
npm run dev             # Servidor de desenvolvimento
npm run format          # Prettier + Biome
npm run lint            # Biome
npm run type-check      # TypeScript
npm test                # Vitest
npm run build           # vinext build + finalize-export → dist/client/
npm run verify-export   # Inspeciona o HTML/XML gerado
npm run measure-export  # Compara o export com scripts/budget.json
npm run og              # Regenera os share cards
npm run og:check        # Confere ledger e render dos cards
npm run icons           # Regenera favicon, ícones e manifest
npm run preview         # Build + wrangler pages dev
npm run deploy          # Build + wrangler pages deploy (produção — só com autorização)
```

O CI (`.github/workflows/node.js.yml`) roda formatação, lint, tipos, share
cards, testes, build, `verify-export` e `measure-export` em todo pull request.

## Conteúdo

| O quê                         | Onde                                                  |
| ----------------------------- | ----------------------------------------------------- |
| Nome, cargo, e-mail           | `src/data/profile.json`                               |
| Redes, WhatsApp, Threads      | `src/data/contact.ts`                                 |
| Serviços (sem preço)          | `src/data/services.ts`                                |
| Pilares e posicionamento      | `src/data/pillars.ts`                                 |
| Perguntas e pontuação do chat | `functions/_lib/lead.ts`                              |
| Sobre                         | `src/data/about.ts`                                   |
| Trajetória e competências     | `src/data/resume/`                                    |
| Projetos                      | `src/data/projects.ts`                                |
| Palestras                     | `src/data/presentations.ts` + `public/presentations/` |
| Artigos                       | `content/writing/*.md`                                |

Pendências de conteúdo estão marcadas no código com `TODO(fabio)`:

```bash
rg -n "TODO\(fabio\)"
```

### Links de bio com UTM

Cada rede aponta para o chat em `/contato/`, com a origem na URL
(`03-estrategia/funil-e-utms.md`). As UTMs chegam junto com cada lead:

- `https://fabioassuncao.com/contato/?utm_source=instagram&utm_medium=bio&utm_campaign=autoridade-2026q4&utm_content=perfil`
- `https://fabioassuncao.com/contato/?utm_source=tiktok&utm_medium=bio&utm_campaign=autoridade-2026q4&utm_content=perfil`
- `https://fabioassuncao.com/contato/?utm_source=youtube&utm_medium=bio&utm_campaign=autoridade-2026q4&utm_content=perfil`
- `https://fabioassuncao.com/contato/?utm_source=linkedin&utm_medium=bio&utm_campaign=autoridade-2026q4&utm_content=perfil`
- `https://fabioassuncao.com/contato/?utm_source=x&utm_medium=bio&utm_campaign=autoridade-2026q4&utm_content=perfil`

Os @ das redes ficam em `SOCIAL_HANDLE` (`src/data/contact.ts`): hoje
`fabioassuncaohq`, a trocar quando o @ profissional for escolhido.

## Deploy na Cloudflare Pages

O projeto Pages `fabioassuncao` continua o mesmo, então a troca não exige
mudança de DNS. A saída é `dist/client/` e o diretório `functions/` na raiz é
detectado pelo Wrangler.

Não há `wrangler.jsonc`: com qualquer `wrangler.*` na raiz, o vinext trata o
projeto como Workers e se recusa a gerar o export estático. Por isso a
configuração do Pages está nas flags dos scripts `preview` e `deploy` (e no job
de deploy do CI): data de compatibilidade `2026-10-01` e `nodejs_compat`. No
painel do projeto, confira os mesmos valores para produção e, se quiser, ligue
a observabilidade (Workers Logs) das Functions.

Variáveis do projeto Pages (painel da Cloudflare → Settings → Variables):

| Variável                             | Tipo             | Uso                                               |
| ------------------------------------ | ---------------- | ------------------------------------------------- |
| `TURNSTILE_SECRET_KEY`               | secret           | Validação do Turnstile na Function                |
| `RESEND_API_KEY`                     | secret           | Envio do e-mail pelo Resend                       |
| `LEAD_FROM_EMAIL`                    | texto (opcional) | Remetente em domínio verificado no Resend         |
| `LEAD_WEBHOOK_URL`                   | texto (opcional) | Recebe cada lead em JSON (planilha, n8n, CRM)     |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`     | build            | Site key pública do Turnstile (embutida no build) |
| `NEXT_PUBLIC_GA_TRACKING_ID`         | build (opcional) | Google Analytics 4 (após consentimento)           |
| `NEXT_PUBLIC_META_PIXEL_ID`          | build (opcional) | Meta Pixel (após consentimento)                   |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`    | build (opcional) | LinkedIn Insight Tag (após consentimento)         |
| `NEXT_PUBLIC_LINKEDIN_CONVERSION_ID` | build (opcional) | Conversão do LinkedIn para o lead                 |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID`        | build (opcional) | TikTok Pixel (após consentimento)                 |

Se o projeto estiver ligado ao Git pelo painel, o comando de build deve ser
`npm run build` e o diretório de saída `dist/client`, com Node 22 ou mais novo. Para deploy pelo GitHub Actions,
crie os secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` e a variável de
repositório `CLOUDFLARE_DEPLOY=true`; o job `deploy` fica desligado até lá.

### Medição e consentimento

Tudo desligado por padrão. Cada ferramenta liga quando o seu ID
`NEXT_PUBLIC_*` existe no build, e só carrega depois que o visitante aceita o
aviso de cookies. Os eventos são `Lead` ao concluir o chat (com pontuação e
faixa de investimento) e `Contact` em todo clique de WhatsApp. O
`scripts/finalize-export.mjs` acrescenta à CSP do `_headers` só as origens das
ferramentas ligadas. O Cloudflare Web Analytics, se ligado pelo painel, já é
permitido pela CSP.

### Cabeçalhos de segurança

`public/_headers` aplica CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy` e `Permissions-Policy` a todas as rotas. O `script-src` mantém
`'unsafe-inline'` porque o export estático inclui scripts inline que mudam por
página (o bootstrap de tema e o payload RSC do Next), e não cabem como hashes no
`_headers`. Todo o resto fica restrito à própria origem, ao Turnstile e ao
Cloudflare Web Analytics.

## Licença

[MIT](./LICENSE). O aviso de copyright do template (Michael D'Angelo) é mantido.
