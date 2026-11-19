# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Playwright + TypeScript test automation suite for **OrangeHRM** (default target: the public demo at
`https://opensource-demo.orangehrmlive.com`). There is no application source here. Every locator,
endpoint and payload is established against the live app ("Mode B" in the rules).

## Commands

```bash
npm test                                   # all specs, all browser projects
npx playwright test tests/login.spec.ts --project=chromium   # one file, one browser
npx playwright test -g "QA-01"             # one case by its id in the title
npm run headed | npm run debug | npm run ui
npm run codegen                            # record against $BASE_URL
npm run report                             # open the last HTML report
npm run typecheck                          # tsc --noEmit, the only static check (no linter)
```

Run `npm run typecheck` and the affected spec before you hand work off. A test that has never
passed against the live app is still a draft.

## Environment

- `playwright.config.ts` reads `BASE_URL`, and `tests/login.spec.ts` reads `APP_USERNAME` and
  `APP_PASSWORD`. Each one falls back to the demo defaults.
- **`dotenv` is not installed and nothing loads `.env`.** The `.env` file at the root does
  nothing unless its variables are exported in the shell. The rules describe a `.env/.env.<env>`
  directory selected by `TEST_ENV`. That setup does not exist yet.
- The `@pages/*` path alias (in `tsconfig.json`) maps to `./pages/*`.

## Rules and skills: the target architecture vs. what exists today

The authoritative conventions are in `.claude/rules/`. They load automatically for matching paths:

- `playwright-architecture.md`: page objects, fixtures, auth `storageState`, directory layout,
  per-environment test data, named timeouts
- `playwright-scripting.md`: DOM discovery, locator priority, assertions, waiting, test structure
- `playwright-api-framework.md`: the API half (`RequestHandler` transport → clients → specs)

Project skills (`.claude/skills/`): `pw-new-test-cli` (new UI test from live-DOM inspection),
`pw-new-api-test` (new API test), `pw-test-audit` (review recent test changes). Use them for those
tasks, and never skip their `AskUserQuestion` steps.

**The rules describe a layout that the repo has not grown into yet.** The rules and skills were
adapted from another project, so their examples name ResMan/buildings/properties. Treat those
examples as patterns, not as OrangeHRM facts. What the repo actually holds today:

| Rules expect | Currently |
|---|---|
| `tests/UI/<area>/*.spec.ts`, `tests/API/<area>/*.api.spec.ts` | `tests/login.spec.ts` (flat) |
| `playwright-utils/UI/pages/<area>/<name>-page.ts` | `pages/login.page.ts` |
| `api` project (`testMatch: /API\/.*\.spec\.ts/`), browser projects matching `/UI\/.*\.spec\.ts/` | chromium/firefox/webkit run everything under `tests/` |
| No `expect()` in page objects | `LoginPage.expectLoaded()` asserts |
| `<CASE-ID> \| <behavior>` titles, per-env test data keyed by case id | Titles have no case ids, and credentials are inline fallbacks |
| `playwright-utils/API/**` (RequestHandler, fixtures, Ajv, faker v9) | Not present (no ajv/faker/dotenv deps) |

When you add new work, follow the rules, which means migrating to the `UI/`/`API/` split. Scaffold
the missing pieces (directories, config projects, dependencies) in the same change that first
needs them. Do not extend the legacy flat layout.

## Key cross-cutting points (details in the rules files)

- The UI and API halves share no code. Only `playwright.config.ts` and the env are common to both.
- Page objects and API clients act and return. All assertions live in specs.
- API specs import `test` from `playwright-utils/API/fixtures/api-fixtures` and `expect` from
  `playwright-utils/API/core/custom-expect`, never from `@playwright/test`. The expected status
  code is passed as the argument to the terminal request method. Specs never assert it with
  `expect`.
- The repo is CommonJS (`"type": "commonjs"`). This matters when you pick dependencies (for
  example, faker v9 rather than the ESM-only v10).
