---
name: portfolio-personal-data
description: Adds or updates personal portfolio content (about, profile, hobbies, skills, socials, meta descriptions) in src/config/me.json and UI/generic copy in src/lang. Use when editing personal data, about bio, hobby topics, skill groups, contact info, social links, or when the user mentions me.json, /lang, portfolio copy, or life/personal information.
---

# Portfolio personal data

## Split (always)

| Content | Where |
| --- | --- |
| Facts and person-specific copy (name, emails, about paragraphs, hobby stories, localized job title/tagline, SEO descriptions that mention the person) | `src/config/me.json` |
| Generic UI words (labels, CTAs, a11y strings, theme/language chrome, skill *category* display names, placeholders) | `src/lang/en.json` **and** `src/lang/pt.json` |

Never put personal biography, handle origin stories, or person-named SEO into `/lang`. Never hardcode user-facing Portuguese/English UI chrome in components when it belongs in `src/lang`.

Locales in this repo: `en` and `pt`. Update **both** whenever copy is localized.

## `src/config/me.json` map

| Field | Role |
| --- | --- |
| `name`, `handle`, `role`, `githubUsername`, `emails`, `location` | Identity / contact (locale-agnostic) |
| `skills[]` | Groups: `{ "category": "<id>", "skills": ["…"] }` — skill names stay English/tech as written |
| `socials.portfolio` / `socials.hobby` | `{ "network", "href" }` lists |
| `meta.<locale>.home\|hobby.description` | Page meta descriptions (person-specific) |
| `profile.<locale>` | `jobTitle`, `tagline`, `about[]` (paragraphs) |
| `hobby.<locale>` | `teaser`, `topics[]` with `title` + `paragraphs[]` (Markdown links OK) |

Helpers: `@/lib/site` (`profileFor`, `hobbyFor`, `metaFor`, `me`).

## `src/lang` map

Files: `src/lang/en.json`, `src/lang/pt.json` (same key tree).

Typical keys: `meta.*` titles/templates, `profile.*` labels (`aboutLabel`, `avatarAlt`), `skills.label`, `skills.categories.<id>`, `hobbies.*`, `hobby.*` chrome, `footer`, `language`, `theme`, `email`, `draw`, `github`, `toast`.

Interpolation: `{name}`, `{theme}`, etc. — filled at runtime via `translate` / `useTranslations`.

## Workflows

### Edit about / tagline / job title

1. Change `me.profile.en` and `me.profile.pt` only.
2. Do not touch `src/lang` unless adding a new UI label.

### Add or edit a hobby topic

1. Append/edit under `me.hobby.en.topics` and `me.hobby.pt.topics`.
2. Keep `title` + `paragraphs` in sync across locales.
3. Update `me.meta.*.hobby.description` if the page summary should reflect the change.

### Add skills

1. Add names under an existing `me.skills[].category`, **or** add a new group with a new `category` id.
2. New category id → add `skills.categories.<id>` in **both** lang files (UI label only).

### Add social / email / identity

1. Update the relevant top-level or `socials.*` fields in `me.json`.
2. Prefer networks already supported in `@/lib/socials`; new networks may need icon/label code there (not lang/me alone).

### Add generic UI copy

1. Add the same key path to `en.json` and `pt.json`.
2. Consume via `t("path.to.key")` / `translate(messages, …)` — never inline strings in JSX for chrome.

## Checklist

- [ ] Person-specific text only in `src/config/me.json`
- [ ] Generic UI only in `src/lang/{en,pt}.json`
- [ ] Both locales updated for localized fields
- [ ] New skill `category` has matching `skills.categories.<id>` in both lang files
- [ ] JSON still valid; no unrelated refactors
