# fabioassuncao.com

Site pessoal de Fábio Assunção: apresentação, currículo, projetos, artigos,
palestras e o caminho para pedir um orçamento. Em português (pt-BR).

Construído sobre o template [mldangelo/personal-site](https://github.com/mldangelo/personal-site)
(MIT), no commit `9273f7c48e5f4e39693bdc586b6d567f2ab4deb4`. A arquitetura,
os scripts de verificação e os testes vêm do template; o conteúdo, o idioma, as
páginas de conversão e o deploy na Cloudflare são deste repositório. O site
anterior (Nuxt 4) foi substituído por completo; o que foi aproveitado dele está
em [`docs/legacy-inventory.md`](./docs/legacy-inventory.md).

## O que tem aqui

- **Next.js 16** com `output: 'export'`: o build gera HTML estático em `out/`.
- **Cloudflare Pages** (projeto `fabioassuncao`) serve `out/` e a Pages Function
  em `functions/api/orcamento.ts`, que recebe o formulário de orçamento.
- Páginas: `/`, `/about/`, `/resume/` (+ `/resume.json`), `/projects/`,
  `/writing/`, `/presentations/`, `/trabalhe-comigo/`, `/contact/` e `/links/`
  (destino dos links de bio das redes sociais).
- Autoridade para buscadores e IAs: JSON-LD com `Person` em
  `https://fabioassuncao.com/#person`, `sitemap.xml`, `feed.xml`, `llms.txt` e
  `.well-known/security.txt`.

As regras de trabalho para agentes de código estão em [AGENTS.md](./AGENTS.md).

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
npm run build           # Export estático em out/
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

| O quê                     | Onde                                                  |
| ------------------------- | ----------------------------------------------------- |
| Nome, cargo, e-mail       | `src/data/profile.json`                               |
| Redes, WhatsApp, Threads  | `src/data/contact.ts`                                 |
| Botões da página de links | `src/data/links.ts`                                   |
| Sobre                     | `src/data/about.ts`                                   |
| Trajetória e competências | `src/data/resume/`                                    |
| Projetos                  | `src/data/projects.ts`                                |
| Palestras                 | `src/data/presentations.ts` + `public/presentations/` |
| Artigos                   | `content/writing/*.md`                                |

Pendências de conteúdo estão marcadas no código com `TODO(fabio)`:

```bash
rg -n "TODO\(fabio\)"
```

### Links de bio com UTM

Cada rede aponta para `/links/` com a origem na URL, sem script de analytics:

- `https://fabioassuncao.com/links/?utm_source=instagram&utm_medium=bio`
- `https://fabioassuncao.com/links/?utm_source=tiktok&utm_medium=bio`
- `https://fabioassuncao.com/links/?utm_source=youtube&utm_medium=bio`
- `https://fabioassuncao.com/links/?utm_source=threads&utm_medium=bio`
- `https://fabioassuncao.com/links/?utm_source=linkedin&utm_medium=bio`
- `https://fabioassuncao.com/links/?utm_source=x&utm_medium=bio`
- `https://fabioassuncao.com/links/?utm_source=github&utm_medium=bio`

## Deploy na Cloudflare Pages

O projeto Pages `fabioassuncao` continua o mesmo, então a troca não exige
mudança de DNS. Configuração em [`wrangler.jsonc`](./wrangler.jsonc): saída
`./out`, `nodejs_compat`, observabilidade ligada. O diretório `functions/` na
raiz é detectado pelo Wrangler.

Variáveis do projeto Pages (painel da Cloudflare → Settings → Variables):

| Variável                         | Tipo             | Uso                                               |
| -------------------------------- | ---------------- | ------------------------------------------------- |
| `TURNSTILE_SECRET_KEY`           | secret           | Validação do Turnstile na Function                |
| `RESEND_API_KEY`                 | secret           | Envio do e-mail pelo Resend                       |
| `QUOTE_FROM_EMAIL`               | texto (opcional) | Remetente em domínio verificado no Resend         |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | build            | Site key pública do Turnstile (embutida no build) |
| `NEXT_PUBLIC_GA_TRACKING_ID`     | build (opcional) | Liga o Google Analytics 4                         |

Se o projeto estiver ligado ao Git pelo painel, o comando de build deve ser
`npm run build` e o diretório de saída `out`. Para deploy pelo GitHub Actions,
crie os secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` e a variável de
repositório `CLOUDFLARE_DEPLOY=true`; o job `deploy` fica desligado até lá.

### Analytics

Desligado. O template já integra o GA4: defina `NEXT_PUBLIC_GA_TRACKING_ID` no
build (variável de repositório no CI ou de build no Pages) e acrescente
`https://www.googletagmanager.com` ao `script-src` e
`https://*.google-analytics.com` ao `connect-src` do `public/_headers`. O
Cloudflare Web Analytics, se ligado pelo painel, já é permitido pela CSP.

### Cabeçalhos de segurança

`public/_headers` aplica CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy` e `Permissions-Policy` a todas as rotas. O `script-src` mantém
`'unsafe-inline'` porque o export estático inclui scripts inline que mudam por
página (o bootstrap de tema e o payload RSC do Next), e não cabem como hashes no
`_headers`. Todo o resto fica restrito à própria origem, ao Turnstile e ao
Cloudflare Web Analytics.

## Licença

[MIT](./LICENSE). O aviso de copyright do template (Michael D'Angelo) é mantido.
