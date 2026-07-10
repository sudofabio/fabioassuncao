# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Fabio Assuncao. Built with Nuxt 4 and deployed to Cloudflare Pages.

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3, Vue Router)
- **Deployment:** Cloudflare Pages via Wrangler
- **Server Engine:** Nitro with `cloudflare-pages` preset
- **Dev Module:** `nitro-cloudflare-dev` for local Cloudflare bindings access

## Commands

- `npm run dev` - Start dev server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Build + preview with Wrangler Pages dev server
- `npm run deploy` - Build + deploy to Cloudflare Pages
- `npm run cf-typegen` - Generate Cloudflare worker types

## Architecture

- `app/` - Nuxt app directory (components, pages, layouts, composables go here per Nuxt 4 convention)
- `nuxt.config.ts` - Nuxt configuration; Nitro preset set to `cloudflare-pages` with `nodeCompat` enabled
- `wrangler.jsonc` - Wrangler config; build output at `./dist`; `nodejs_compat` flag enabled
- `env.d.ts` - Type augmentation for Cloudflare bindings (`cf`, `cloudflare.env`, `cloudflare.context`) on H3 event context
- `worker-configuration.d.ts` - Auto-generated Cloudflare worker types (via `npm run cf-typegen`)

## Cloudflare Bindings

Access Cloudflare bindings in server routes via `event.context.cloudflare.env`. Types are defined in `env.d.ts` and `worker-configuration.d.ts`.

## Deck Engine (presentations)

Custom slide engine, content-agnostic, in `app/components/deck/` (planned for extraction as a Nuxt Layer):

- **Contract:** `app/components/deck/context.ts` — `DeckContext`, `DeckTheme`, injection keys.
- **Ambient convention:** `app/assets/css/deck.css` — every infinite CSS loop must live behind `.deck-root.ambient-on .slide.active …`; the base state must be static and deterministic (PDF export captures it).
- **Animated backgrounds:** `app/components/deck/backgrounds/registry.ts` — how to create/register background effects and presets is documented in its docblock. Slides opt in via the `effect` prop on `DeckSlide` (effect name, preset name, or config object). The "Fundos animados" toggle (⋮ menu, `useDeckBackgrounds`) mounts/unmounts the layer; "Animações contínuas" (`useDeckAmbient`) gates its motion.
- **Presentations:** a page in `app/pages/presentations/` renders `<DeckStage :theme>` with slide components as ordered children; per-presentation content lives in `app/components/slides/<name>/` and `app/data/presentations/<name>/`, theme in `app/themes/`.
