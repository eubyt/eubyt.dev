# Portfolio

Site pessoal / portfólio bilíngue (`en` / `pt`): perfil, skills, hobbies e contato.

Stack: **Next.js 16**, **React 19**, **Tailwind CSS 4**, **TypeScript**.

## Como rodar

Requisitos: Node.js 20+ e npm.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O locale vem da URL (`/en`, `/pt`).

| Comando             | Uso                           |
| ------------------- | ----------------------------- |
| `npm run dev`       | Servidor de desenvolvimento   |
| `npm run build`     | Build de produção             |
| `npm run start`     | Serve o build (`next start`)  |
| `npm run test`      | Testes (Vitest)               |
| `npm run format`    | Prettier + ESLint + typecheck |
| `npm run lint`      | Só ESLint                     |
| `npm run typecheck` | Typegen + `tsc --noEmit`      |

Antes de considerar uma mudança pronta: testes, depois `npm run format`. O Husky roda o format no commit.

## Como modificar os dados

Há dois lugares distintos. Não misture.

| Conteúdo                                                                     | Onde                                        |
| ---------------------------------------------------------------------------- | ------------------------------------------- |
| Conteúdo pessoal (nome, e-mails, bio, hobbies, SEO específico)               | `src/config/me.json`                        |
| Palavras genéricas da UI (labels, CTAs, a11y, nomes de categorias de skills) | `src/lang/en.json` **e** `src/lang/pt.json` |

Locales: sempre atualize **en** e **pt** quando o texto for localizado.

### `src/config/me.json`

| Campo                                                            | Uso                                                                   |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| `name`, `handle`, `role`, `githubUsername`, `emails`, `location` | Identidade / contato                                                  |
| `skills[]`                                                       | Grupos `{ "category": "<id>", "skills": ["…"] }`                      |
| `socials.portfolio` / `socials.hobby`                            | Listas `{ "network", "href" }`                                        |
| `meta.<locale>.home\|hobby.description`                          | Meta description das páginas                                          |
| `profile.<locale>`                                               | `jobTitle`, `tagline`, `about[]`                                      |
| `hobby.<locale>`                                                 | `teaser`, `topics[]` (`title` + `paragraphs[]`; Markdown em links ok) |

Helpers: `me`, `profileFor`, `hobbyFor`, `metaFor` em `@/lib/site`.

### `src/lang`

Mesma árvore de chaves em `en.json` e `pt.json`. Exemplos: `meta.*`, `profile.aboutLabel`, `skills.categories.<id>`, `hobbies.*`, `footer`, `language`, `theme`.

Interpolação: `{name}`, `{theme}`, etc., preenchida em runtime.

### Fluxos comuns

**Bio / tagline / cargo** — edite só `me.profile.en` e `me.profile.pt`.

**Hobby** — edite `me.hobby.en.topics` e `me.hobby.pt.topics`; ajuste `me.meta.*.hobby.description` se o resumo da página mudar.

**Skills** — adicione nomes em um grupo existente, ou crie um grupo com novo `category`. Novo id → adicione `skills.categories.<id>` nos dois arquivos de lang.

**Social / e-mail / identidade** — campos de topo ou `socials.*` em `me.json`. Redes suportadas: LinkedIn, GitHub, Instagram, Discord, Twitter/X, Twitch, YouTube, Steam (`@/lib/socials`). Rede nova pode exigir ícone/label nesse módulo.

**Copy genérica da UI** — mesma chave em `en.json` e `pt.json`; consuma com `t("path.to.key")` / `translate`, sem hardcode no JSX.

## Deploy

Qualquer host que rode Next.js (ex.: Vercel). Build: `npm run build`, depois `npm run start` (ou o adaptador do provedor).
