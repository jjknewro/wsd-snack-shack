# WSD Snack Shack Mobile Application — Implementation Log (MVP)

## Project

wsd-snack-shack

## Date Created

2026-07-18

## Current Epic

EPIC 2 — Data Schema and Contract

## Current Task

Task 5.4 — Add Search and Filtering (EPIC 5 — Today Screen and Snack Day Initialization). Tasks 5.1, 5.2, and 5.3 are complete — see entries below. Task 2.2 remains partially prototyped, unaffected by this.

---

## Architecture Pivot — 2026-07-18

**Decision:** The project pivoted from a native mobile app (React Native + Expo + Supabase, multi-user with staff/administrator roles) to a mobile-first web PWA (React + Vite + TypeScript, backed by Google Apps Script and the Snack Shack's existing Google Sheets workbook, single-operator only). This was a deliberate decision by the user, confirmed explicitly after review, not an accident.

**What this means for the record below:**

- Everything logged under "Completed Task History" prior to this entry (Tasks 1.1–1.8, the original EPIC 1) is **accurate history of real, verified work** — an Expo/React Native/Supabase foundation was genuinely built, tested, and committed. It is being **retired, not deleted**: it remains in git history (commits up to and including `e25e27b`) but is no longer the active direction. None of that code is reusable for the new stack.
- `ARCHITECTURE.md` and `IMPLEMENTATION-PLAN-MVP.md` were replaced by the user with a new architecture and a new 12-EPIC plan describing the PWA/Google-Sheets approach. `README-MVP.md` was updated by the assistant in this same session to match, since it still described the old multi-user native-app vision and directly contradicted the new architecture.
- The new plan's EPIC 1 was found marked "✅ Complete" (React + Vite + TypeScript project, Vitest, React Router, etc.) despite none of that work actually existing in the repository — confirmed by inspection (the repo was 100% Expo/React Native at the time). After explicit user confirmation, this was corrected: EPIC 1's status (and every one of its 7 tasks) was reset to "⬜ Not Started" in `IMPLEMENTATION-PLAN-MVP.md`, and the plan's "Recommended Execution Order" section (which started at EPIC 2, assuming EPIC 1 was done) was corrected to start at EPIC 1.
- The in-progress Task 2.1 work under the old plan (deploying a self-hosted Supabase instance on the user's Railway account) is abandoned — the new architecture does not use Supabase. Nothing had been deployed yet beyond planning/discussion, so there is nothing to tear down.
- Going forward, "Task 1.1", "Task 2.1", etc. in this log refer to the **new** plan's numbering (React/Vite/Google-Sheets track). The retired Expo/Supabase track below reused the same numbering under the old plan — the two are distinguished by section heading, not by date, since both include entries from 2026-07-18.

---

## Completed Task History — Active Track (React + Vite + Google Sheets)

### Task 1.1 — Create React, Vite, and TypeScript Project

**Date:** 2026-07-18
**Status:** ✅ Complete

**Summary**

Scaffolded `wsd-snack-shack-web` using `npm create vite@latest` with the `react-ts` template, then stripped the tutorial/demo content per the same "no business functionality, no demo content" discipline used throughout this project:

- Removed the default counter demo (`App.tsx`'s hero section, framework logos, docs/social links) and its assets (`react.svg`, `vite.svg`, `hero.png`, `public/icons.svg`) — replaced with a minimal `App.tsx` rendering just the "WSD Snack Shack" heading.
- Replaced the generated `App.css`/`index.css` (all tutorial-specific styling — hero positioning, docs/social grid, ticks decorations) with a minimal baseline (centered flex layout, system font stack).
- Removed the template's generic `README.md` (this project uses `README-MVP.md` at the root; a second, contradictory README would be confusing).
- Set the page `<title>` to "WSD Snack Shack" (was the generic project-name default).
- **Added `"strict": true`** to both `tsconfig.app.json` and `tsconfig.node.json` — neither was set by the Vite template despite `noUnusedLocals`/`noUnusedParameters` etc. being on; this task's own requirement ("TypeScript strict mode is enabled") would not otherwise have been met.
- Rewrote the root `.gitignore` for a Vite/Node project (removed all Expo/native-specific entries — `.expo/`, `expo-env.d.ts`, `.kotlin/`, `*.jks`/`*.p8`/`*.p12`/`*.mobileprovision`, `.metro-health-check*`, `/ios`, `/android`; added `dist-ssr/`, `*.local`, standard editor-directory entries); kept the `.env*` / `!.env.example` protection from the retired track's Task 1.7 since it's still correct for any framework.
- Left linting as the Vite template's default (`oxlint`, a zero-config Rust-based linter) rather than introducing ESLint immediately — deciding the actual lint tool/rule set belongs to Task 1.3 ("Configure Code Quality Tooling"), not this task.

**Verification**

- `npx tsc -b` — passes with no errors (confirms strict mode is genuinely active, not just declared).
- `npm run lint` (`oxlint`) — clean.
- `npm run build` — succeeds; inspected `dist/index.html` and confirmed the "WSD Snack Shack" title is present in the production build.
- `npm run dev` — started successfully; confirmed via `curl` that the dev server serves the correct title.
- All of the above were first verified in a scratchpad copy, then re-verified identically after copying the finalized scaffold into the actual project directory and running `npm install` there — same pattern used for the original (now-retired) Expo Task 1.1.

**Notes / Deviations**

- **Dev-server port confusion, resolved, not a real issue**: starting the dev server on port 5173 and curling `http://localhost:5173/` returned an unrelated project's page ("schmucks-studio"). Investigated via `Get-NetTCPConnection`: `localhost` resolved to `::1` (IPv6), where an unrelated, already-running Node process (a different, pre-existing project of the user's) happened to also be listening on port 5173. Our Vite server had bound cleanly to `0.0.0.0` (IPv4) on the same port number — IPv4 and IPv6 sockets are independent, so no actual `EADDRINUSE` conflict occurred. Confirmed our server directly via `http://127.0.0.1:5173/`. Worth remembering: prefer `127.0.0.1` over `localhost` when verifying a dev server on this machine, since `localhost` may resolve to an unrelated already-running IPv6 service.

**Follow-up (2026-07-18):** the user explicitly asked not to use 5173 at all, regardless of the lack of a real technical conflict — they run other projects' dev servers concurrently on this machine and don't want ambiguity over which project a given port belongs to. Pinned this project's dev server to port **5180** in `vite.config.ts` (`server.port = 5180`, `strictPort: true` so any future collision fails loudly instead of silently landing elsewhere). Saved as a standing memory for future sessions.

---

### Task 1.2 — Establish Project Structure

**Date:** 2026-07-18
**Status:** ✅ Complete

**Summary**

Created the `src/` structure exactly as specified in `IMPLEMENTATION-PLAN-MVP.md` Task 1.2: `api/`, `components/`, `features/`, `hooks/`, `pages/`, `repositories/`, `services/`, `types/`, `utils/`, `tests/` — all nested under `src/`, per the new plan's tree (a deliberate difference from the retired Expo track, which kept `tests/` at the project root). `src/App.tsx`, `src/App.css`, `src/index.css`, and `src/main.tsx` remain at `src/`'s top level, unaffected — those are Vite's required entry-point files, not part of the organizational structure this task adds.

Every folder is currently empty except for a `.gitkeep` marker, since none of the epics that populate them (data models in EPIC 2, the API client/repository in EPIC 4, pages in EPIC 5+, etc.) have started yet. This mirrors the same reasoning used for the retired track's Task 1.3: git doesn't track empty directories, and a `.gitkeep` is a minimal, real marker for "this boundary is established, content arrives later" rather than a fake placeholder file.

**Verification**

- `npx tsc -b` — clean.
- `npm run lint` (`oxlint`) — clean.
- `npm run build` — succeeds, same output as before (structure-only change, nothing added to the bundle).
- Confirmed the running dev server (port 5180) still serves the app correctly after the change.

**Notes / Deviations**

- The acceptance criterion "No direct Google Sheets logic exists in UI components" isn't yet meaningfully verifiable — no UI components exist yet. This becomes an actively-enforced constraint starting with EPIC 4 (frontend/repository integration) and EPIC 5+ (actual pages).

---

### Task 1.3 — Configure Code Quality Tooling

**Date:** 2026-07-18
**Status:** ✅ Complete

**Summary**

- **TypeScript**: already configured in Task 1.1 (`strict: true` plus the Vite template's `noUnusedLocals`/`noUnusedParameters`/`noFallthroughCasesInSwitch`); nothing further needed here.
- **Linting**: kept `oxlint` (the Vite template's default) rather than introducing ESLint on top of it — it already covers React and TypeScript rules and adding a second linter would be duplicate, unnecessary tooling. Installed `oxlint-tsgolint` and set `"options": { "typeAware": true }` in `.oxlintrc.json`, enabling type-aware lint rules (e.g. `no-floating-promises`) per Vite's own template guidance for production applications ("If you are developing a production application, we recommend enabling type-aware lint rules").
- **Formatting**: added Prettier (`.prettierrc.json`: single quotes, no semicolons — matching the Vite template's existing no-semicolon style so the first format pass wouldn't rewrite files unnecessarily; trailing commas; 100-char width) and `.prettierignore` (scoped away from `*.md` for the same reason as the retired track — reformatting hand-written planning docs creates noisy diffs with no benefit).
- **Scripts**: added `format`, `format:check`, `typecheck` (`tsc -b`, standalone from `build`), and `verify` (`lint && typecheck` — `test` isn't part of it yet since Vitest doesn't exist until Task 1.4; will extend then).

**Verification**

- **Confirmed type-aware linting is genuinely active, not just declared**: wrote a throwaway probe file with a classic type-aware-only issue (a fire-and-forget async call — `caller()` invoking an async function without awaiting, catching, or `void`-ing it) that plain syntactic linting or `tsc` alone would not flag. `oxlint` correctly reported `typescript(no-floating-promises)` on it. Deleted the probe file afterward (never committed).
- `npm run format:check` found two files needing reformatting (`src/index.css`, `tsconfig.json`) — ran `npm run format` and reviewed the diff by hand: both were purely cosmetic (CSS `font` shorthand line-wrapping; a JSON `references` array reformatted to one line). Nothing unexpected.
- `npm run verify` (lint + typecheck) — clean.
- `npm run build` — succeeds; confirmed `dist/index.html`'s title is still correct.
- Confirmed the running dev server (port 5180) still serves the app correctly.

**Notes / Deviations**

- This task's own acceptance criteria don't require demonstrating that `verify` fails on a real failure (unlike the retired track's equivalent task) — skipped that extra check since it isn't asked for here and the `&&`-chained script mechanics are already proven correct from the retired track's identical pattern.

---

### Task 1.4 — Configure Test Framework

**Date:** 2026-07-19
**Status:** ✅ Complete

**Summary**

- Installed `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`.
- Configured Vitest via the `test` block in `vite.config.ts` (switched `defineConfig` import from `'vite'` to `'vitest/config'`, which re-exports Vite's config typed with the `test` extension — avoids a separate `vitest.config.ts`). `environment: 'jsdom'`, `setupFiles: ['./src/tests/setup.ts']`.
- `src/tests/setup.ts` imports `@testing-library/jest-dom/vitest` (the Vitest-specific entry point, which augments Vitest's `Assertion` type automatically — no manual `.d.ts` type declaration needed, unlike the plain `@testing-library/jest-dom` import).
- Used explicit imports (`describe`/`it`/`expect` from `'vitest'`) rather than `globals: true` — keeps `tsconfig` simpler, no ambient global types to wire up, and is the currently-recommended pattern.
- `src/tests/App.test.tsx`: a real sample test rendering the actual `App` component and asserting the "WSD Snack Shack" heading is visible — not a placeholder/dummy test.
- Scripts: `test` (`vitest run`, single-shot for CI/verify), `test:watch` (`vitest`, interactive). `verify` now chains `lint && typecheck && test`.

**Verification**

- `npm run test` — `1 passed (1)`.
- `npx tsc -b` — clean (confirms the test files and Vitest/jest-dom type augmentations all type-check correctly within the same `tsconfig.app.json` project as the app code).
- `npm run lint`, `npm run format:check` — clean.
- `npm run verify` — full chain (lint + typecheck + test) passes end-to-end.
- `npm run build` — still succeeds; confirmed the dev server (port 5180) still serves correctly.

**Notes / Deviations**

- Test files live under `src/tests/` per Task 1.2's structure decision, not co-located next to source (e.g. `src/App.test.tsx`) — consistent with the plan's explicit tree.
- Corrected a mistake from the previous log entry: an earlier edit accidentally deleted the "## Completed Task History — Retired Track" section header when inserting Task 1.3's entry, leaving the retired track's Task 1.1 entry without its section heading. Restored it in this same editing session, before writing this entry.

---

### Task 1.5 — Configure Routing and Application Shell

**Date:** 2026-07-19
**Status:** ✅ Complete

**Summary**

- Installed `react-router` (v8 — the current unified package; `react-router-dom` has stopped receiving new majors past v7 and all development has moved into `react-router` itself).
- `src/router.tsx` exports both `routes` (a plain `RouteObject[]`) and `router` (`createBrowserRouter(routes)`) — routes are exported separately from the browser-specific router instance specifically so tests can build a `createMemoryRouter` from the same route definitions with a controlled initial URL, rather than depending on the real browser location.
- Route tree: `/` renders `AppShell` (layout) with `Today` as its index child, plus `requirements`, `history`, `settings`, and a `*` catch-all rendering `NotFound` — matching the plan's four required routes plus the controlled not-found state.
- `src/components/AppShell.tsx`: the application shell — "WSD Snack Shack" branding, a `<nav aria-label="Primary">` of `NavLink`s to all four routes (active route highlighted via `NavLink`'s `isActive` render prop), and an `<Outlet />` for the active page.
- Four placeholder pages (`src/pages/{Today,Requirements,History,Settings}.tsx`) plus `NotFound.tsx` (with a "Return to Today" link) — all minimal, no business logic, consistent with every other placeholder-screen task so far.
- `src/App.tsx` now just renders `<RouterProvider router={router} />` (replaced the static placeholder from Task 1.1). `src/App.css` removed — it only ever styled the removed static placeholder and had no remaining users once `AppShell.css` took over layout.

**Verification**

- **Real bug found and fixed**: `@testing-library/react`'s automatic cleanup between tests relies on detecting a *global* `afterEach` — which this project doesn't have, since `test.globals` was deliberately left off in Task 1.4 (explicit imports instead). Without it, `render()` calls from earlier tests were never unmounted, so later tests in the same file saw accumulated DOM from every prior render and `getByRole('link', { name: 'Today' })` failed with "multiple elements found." Fixed by explicitly registering `afterEach(() => cleanup())` in `src/tests/setup.ts`. This will matter for every test file going forward, not just this task's.
- **Real bug found and fixed**: visually verified navigation at phone (390×844), tablet (820×1180), and desktop (1280×800) widths using Playwright (ad hoc from the OS temp dir, not added as a project dependency — same approach as the retired track's Task 1.8). Phone width showed `scrollWidth > clientWidth` (horizontal overflow) even though the screenshot looked visually fine — root cause: `.app-shell__link`'s mobile-only `width: 100%` plus its `padding: 8px 12px` with no `box-sizing: border-box` pushed the rendered box past 100% of its container. Fixed by adding a standard global `box-sizing: border-box` reset to `src/index.css` (applies to `*`/`::before`/`::after`) rather than patching the one component — this class of bug will recur constantly without a global reset, and every other Vite/CSS project convention includes one by default; this scaffold's Task 1.1 baseline simply never added it. Re-ran the same check after the fix: zero overflow at all three widths.
- `src/tests/router.test.tsx`: 6 tests covering the index route showing Today + all four nav links, clicking to each of the three other routes, navigating back to Today from a non-index page, and the not-found state for an unknown path (`createMemoryRouter` with a bogus `initialEntries` path) — directly covers this task's "navigation works" and "controlled not-found state" acceptance criteria with real, interactive tests, not just static rendering.
- `src/tests/App.test.tsx` updated to also assert the default Today page renders (previously only checked the static placeholder heading).
- `npm run verify` — 7/7 tests, lint and typecheck clean.
- `npm run build` — succeeds.
- Playwright screenshots also confirmed the not-found page's "Return to Today" link is present and the active nav link is visually distinguished (background highlight, not color alone in the sense that the active `<a>` also gets `aria-current="page"` — checked in the rendered DOM output during the cleanup-bug investigation).

**Notes / Deviations**

- None beyond the two bugs above, both found via real verification (not assumed) and both fixed at the root cause rather than patched around.

**Follow-up (2026-07-19): added the Master Roster tab.** The user asked, after reviewing Task 1.5, whether there should be a tab for viewing the Master Roster (bunks/campers/counselors) — the original four routes didn't include one, since `README-MVP.md` states roster maintenance happens directly in Google Sheets, not through the app. Clarified that "view" was wanted (not editing), and that `ARCHITECTURE.md`'s API section already lists a `roster` GET action, so this fits the existing design rather than being a new architectural direction.

Added:
- `src/pages/MasterRoster.tsx` — placeholder, same pattern as the other four pages (no data yet; real roster data arrives with EPIC 2's workbook schema and EPIC 4's repository/API client).
- Route `/roster` in `src/router.tsx`, positioned right after Today in both the route list and the nav order.
- Nav link and test coverage (`src/tests/router.test.tsx`): asserts the link appears alongside the other four at the index route, and that clicking it navigates to the Master Roster heading.

Re-verified after the addition: 8/8 tests pass, and re-ran the Playwright phone/tablet overflow check specifically (this is exactly where the box-sizing bug bit earlier, and a 5th nav item is the kind of change that could plausibly reintroduce overflow) — zero overflow at both sizes, confirmed via screenshot.

Amended `IMPLEMENTATION-PLAN-MVP.md`'s Task 1.5 route list to include `/roster` with a note explaining it was a post-approval addition, rather than silently editing the original list as if it had always been there.

---

### Task 1.6 — Establish Mobile-First Design Foundation

**Date:** 2026-07-19
**Status:** ✅ Complete

**Summary**

- **Design tokens**: added as CSS custom properties in `src/index.css`'s `:root` — spacing scale (`--space-xs` through `--space-xl`), border radii, `--touch-target-min: 44px`, typography sizes, text/surface colors, and status colors (`pending`/`completed`/`warning`/`critical`, with a comment pointing at Task 5.1's "never rely on color alone" requirement). Centralizing these avoids the alternative of every component hardcoding its own spacing/color values.
- Refactored `AppShell.css` (from Task 1.5) to consume the new tokens instead of its original hardcoded values (`#ddd`, `16px`, `44px`, etc.) — same "don't leave duplicate styling lying around once a shared primitive exists" principle used throughout this project.
- **`Button`**: primary/secondary variants, disabled and loading states (loading swaps the label for "Loading…" and sets `aria-busy` + blocks clicks), `--touch-target-min`-sized hit area.
- **`TextField`**: labeled text input using `useId()` for automatic label/input association (no manual `id` wiring required by callers), optional `errorMessage` that sets `aria-invalid` and `aria-describedby` together so screen readers announce the error.
- **`StatusBadge`**: pairs a colored dot with a required text `label` prop — there's no way to render just a color, by construction, directly enforcing the "never color alone" rule rather than just documenting it as a convention.
- None of the three new components are wired into any page yet — same reasoning as every prior "build the primitive, don't force premature usage" decision in this project (retired track's `LoadingState`/`ErrorState`, this track's `MasterRoster` placeholder, etc.). Real usage starts once EPIC 5+ builds actual data-driven pages.

**Verification**

- `npm run test` — 19/19 passing across 5 suites (12 new: 3 for `Button`, 3 for `TextField`, 5 for `StatusBadge` incl. a parameterized `it.each` over all four variants).
- `npx tsc -b`, `npm run lint`, `npm run format:check` — all clean.
- `npm run build` — succeeds.
- **Explicitly verified the 320px acceptance criterion** (narrower than anything checked in Task 1.5, which only went down to 390px) using Playwright: zero horizontal overflow at 320×568, and confirmed via `getBoundingClientRect()` that every nav link in the shell measures exactly 44px tall (the touch-target minimum, not just "close enough").
- Reconfirmed the same instance-per-worker Playwright approach as before (ad hoc from the OS temp dir, not a project dependency).

**Notes / Deviations**

- None. No new issues found this task — likely because the box-sizing reset and token-based approach from Task 1.5's bug fix already eliminated the class of layout bug that would otherwise show up here.

---

### Task 1.7 — Create Project Documentation Baseline

**Date:** 2026-07-19
**Status:** ✅ Complete — **EPIC 1 (Project Foundation) is complete under the new architecture.**

**Summary**

Audited all four required docs against this task's two acceptance criteria, rather than assuming the pivot work from earlier tasks already fully satisfied them:

- Grepped `README-MVP.md`, `ARCHITECTURE.md`, and `IMPLEMENTATION-PLAN-MVP.md` for every "Expo" and "Supabase" mention and reviewed each one in context. Every hit falls into one of three categories: explicitly listed as excluded from the MVP, historical/explanatory (the pivot record, rejected-technology note), or framed as a possible *future* option (e.g. `ARCHITECTURE.md`'s "Future Expansion" section listing `SupabaseRepository` as one hypothetical future repository implementation). Nothing presents either as an active MVP technology.
- **Found and fixed a real gap**: `README-MVP.md` never mentioned "Vite" anywhere, despite this task's own acceptance criterion requiring documentation to reflect React, Vite, Google Apps Script, *and* Google Sheets. Its "Technical Objectives" section said "Use a single shared React + TypeScript codebase" — corrected to "React, Vite, and TypeScript." `ARCHITECTURE.md` and `IMPLEMENTATION-PLAN-MVP.md` both already had multiple Vite mentions; only the README had the gap.
- Confirmed the doc cross-references are consistent: `README-MVP.md`'s "Project Documentation" section lists all four files by name, and they all exist at the project root.
- Updated EPIC 1's own status from "Not Started" (set during the pivot correction) to "Complete," and closed the loop on the earlier false-completion incident with a note confirming all seven tasks are now genuinely done and verified — not just re-asserting the same claim that turned out to be wrong before.

**Verification**

- `npm run verify` — 19/19 tests, lint and typecheck clean (sanity check only; this task's change was documentation-only).

**Notes / Deviations**

- None.

**Sign-off**

EPIC 1 — Project Foundation is complete under the pivoted React + Vite + Google Sheets architecture. All seven tasks (1.1–1.7) are done, reviewed, and approved. Proceeding to **EPIC 2 — Workbook Schema and Data Contract**, starting with **Task 2.1 — Document the Existing Workbook Structure**. Note that Task 2.1 requires access to the actual Google Sheets workbook (worksheet names, columns, data types, business meaning) — this will need the user to provide that access/information, similar to how Task 2.1 under the retired Supabase track needed real account setup before it could proceed.

---

# EPIC 2 — Workbook Schema and Data Contract

### Task 2.1 — Document the Existing Workbook Structure

**Date:** 2026-07-19
**Status:** ✅ Complete

**Summary**

The user placed a real workbook export (`Snack Shack today.xlsx`) at the project root. Inspected it with a throwaway Node script (the `xlsx`/SheetJS package, installed ad hoc in the OS temp scratchpad — **not** added to this project's dependencies, since it's a one-time documentation aid, not something the shipped app needs; Google Apps Script handles the real Sheets API in production) and documented the actual structure in a new **`WORKBOOK-SCHEMA.md`**.

Key findings — the real workbook is messier than `ARCHITECTURE.md`'s assumptions in several concrete ways:

- **`Master Roster`**: 35 bunks across 6 divisions. Its `Campers` column exists (has a header) but is **entirely empty** — no camper count or camper list is tracked anywhere in this workbook today, contradicting `README-MVP.md`'s "MVP Goals" listing camper counts as something the operator can view.
- **`snack shack today`**: header row's column A is an actual **checkbox cell**, not a text label. More importantly, it has only **34 bunks vs. `Master Roster`'s 35** — bunk `SB` is missing entirely. This sheet was not regenerated from the current roster; it's drifted. Flagged as an open question for the operator rather than assumed either way.
- **`Allergies`**: not a flat table from row 1 — real headers are on row 3, preceded by a blank row and a decorative banner row. Contains 11 real per-bunk records plus two anomalous rows: one with `Bunk = "?"` (an orphaned/unassigned special order) and one with only a `Quantity` value and no bunk or requirement (almost certainly a stray running total that ended up inside the data range).
- Special/dietary requirement information is **redundantly encoded in three different free-text formats** across `Master Roster.Special Snack`, `snack shack today.Special Snack` (independently retyped, already inconsistent with `Master Roster`'s wording for the same data), and `Allergies.Requirement`/`Quantity`. Recommended `Allergies` as the eventual single source of truth in the document, since it's the most structured of the three.
- No stable bunk ID separate from the bunk-code string exists anywhere — directly relevant to Task 2.3.

Four open questions were written directly into `WORKBOOK-SCHEMA.md` for the operator to answer before EPIC 3+ builds logic on top of this data (the `SB` gap, the orphaned `"?"` bunk, the stray `Quantity=17` row, and what the unused `Campers` column was ever meant to hold).

**Security/privacy handling**: the workbook export contains real counselor first names (personal data). Added `*.xlsx`/`*.xls` to `.gitignore` and confirmed via `git check-ignore` that the file is excluded — it stays on disk for local reference but is never committed. `WORKBOOK-SCHEMA.md` itself avoids quoting any real counselor names verbatim (describes the `Counselors` column's format generically instead); no camper names exist anywhere in the workbook to begin with.

Added `WORKBOOK-SCHEMA.md` to `README-MVP.md`'s "Project Documentation" list for consistency with the other four docs.

**Verification**

- Confirmed the `.xlsx` file does not appear in `git status` and `git check-ignore -v` reports it matched.
- `npm run verify` — 19/19 tests, lint and typecheck clean (sanity check only; this task's changes were documentation and `.gitignore`, no application code touched).
- Cross-checked the `Master Roster` vs. `snack shack today` bunk lists programmatically (not by eye) to find the `SB` gap with certainty rather than approximating from a sample.

**Notes / Deviations**

- This task's deliverable choice was a dedicated `WORKBOOK-SCHEMA.md` rather than a section inside `ARCHITECTURE.md` — the task's own text explicitly offers both as valid options, and the amount of detail here (three worksheets, several real data-quality findings, open questions) would have made `ARCHITECTURE.md` unwieldy if inlined.
- The ~36-bunk count assumption referenced elsewhere in the docs holds up: 35 real bunks in `Master Roster`, consistent with prior references to "approximately 36 bunks."

---

### Ad hoc: Visualize the real workbook data in the app (before Task 2.2)

**Date:** 2026-07-19
**Status:** Done — **not a numbered plan task**, done at the user's request so they could see the real data while thinking through Task 2.1's open questions, before committing to Task 2.2's data models.

**Summary**

Generated `public/data/workbook-snapshot.json` from the workbook export (same throwaway `xlsx` parsing script as Task 2.1, re-run to also emit the row data itself this time, not just structural metadata) and wired the three existing placeholder pages to render it:

- `MasterRoster` → `Master Roster` sheet (Division, Bunk, Counselors, Special Snack, Notes).
- `Today` → `snack shack today` sheet, using the new `StatusBadge` (Pending/Picked Up) for the previously-unlabeled checkbox column.
- `Requirements` → `Allergies` sheet, including both anomalous rows (the `"?"` bunk and the stray total) exactly as documented, rather than filtering them out.

**This is explicitly temporary, throwaway visualization tooling, not the real data pipeline** — it will be fully replaced when EPIC 4 builds the actual Apps Script repository/API client. Labeled as such directly in each page's UI copy ("Temporary local snapshot... not live data").

**New permanent additions** (these ARE real, kept regardless of the throwaway wiring around them):
- `LoadingState`, `ErrorState`, `EmptyState` components — Task 1.6 under this plan never actually built these (unlike the retired track, which had them as an explicit requirement); needed them now for real, so built them properly with tests rather than as one-off inline JSX.
- The **`@/*` → `./src/*` path alias** — hadn't been configured anywhere in this Vite project until now (the retired Expo track had it; this one didn't). Added to both `tsconfig.app.json`'s `paths` and `vite.config.ts`'s `resolve.alias` (Vite doesn't read `tsconfig.json` paths on its own without a plugin — both need to agree independently). Hit and fixed a real deprecation warning along the way: this TypeScript version rejects/warns on `baseUrl`, which isn't actually required for `paths` to work under `moduleResolution: "bundler"` — removed it rather than suppressing the warning.
- `useWorkbookSnapshot` hook and `src/types/workbookSnapshot.ts` — will be deleted, not evolved, once EPIC 4 exists; not designed as a foundation to build on.

**Privacy handling** — same standard as the `.xlsx` file itself: `public/data/workbook-snapshot.json` (contains real counselor names) added to `.gitignore` immediately after generating it, before touching anything else. Confirmed via `git status`/`git check-ignore` that it's excluded.

**Verification**

- Confirmed the production build succeeds **identically with the snapshot file present and absent** (temporarily moved it out and rebuilt) — this is the whole point of fetching from `public/` at runtime rather than statically importing the JSON: a fresh clone without the (gitignored, real-data) file must still build successfully, just show an empty/error state at runtime instead of failing to compile.
- `npm run verify` — 25/25 tests (6 new: `LoadingState` ×2, `ErrorState` ×3, `EmptyState` ×1), lint and typecheck clean.
- Visually verified all three pages with Playwright screenshots against the real data: `Master Roster` renders all 35 bunks; `Today` shows all "Pending" status badges and **visibly ends at `IG4/SG` with no `SB` row**, confirming the documented gap by direct observation, not just the earlier programmatic diff; `Requirements` renders both anomalous rows (`"?"` bunk, stray total) exactly as `WORKBOOK-SCHEMA.md` describes them.
- Did not write automated tests for the three page components' data-rendering logic itself (`MasterRoster`/`Today`/`Requirements`), since this is explicitly throwaway code being discarded at EPIC 4 — testing code that's about to be deleted isn't a good use of effort. The three *shared components* it depends on (`LoadingState`/`ErrorState`/`EmptyState`) are properly tested since those are permanent.

**Notes / Deviations**

- Real people's names (counselors) are visible in the live app now, in this development environment, sourced from a gitignored local file. This is fine for local development review — the same handling as opening the spreadsheet directly — but worth remembering this isn't something to screenshot/share externally without the same care as the source spreadsheet itself.

---

### Ad hoc: Add `open-questions.md` as a central decision tracker

**Date:** 2026-07-19
**Status:** Done — not a numbered plan task.

**Summary**

Created `open-questions.md` consolidating the four open questions from `WORKBOOK-SCHEMA.md`'s "Open Questions for the Operator" section into one project-wide, non-workbook-specific tracker (Open/Resolved sections, so answered questions stay traceable rather than being deleted). `WORKBOOK-SCHEMA.md` now points to it instead of duplicating the list. Added to `README-MVP.md`'s Project Documentation list.

*(Retroactively logged — this was committed at the time but the log entry was missed; added now while reconstructing the record before the architecture pivot below.)*

---

### Ad hoc: Mock data (JSON) and Master Roster screen with requirements popup

**Date:** 2026-07-19
**Status:** Done — not a numbered plan task, done at the user's direct request.

**Summary**

The user gave an exact data spec for two entities — Master Roster (`Bunk`, `Counselors`, optional `# of Campers`) and Special Requirements (`Bunk`, `Requirement`, `Quantity`, `Notes`, zero-to-many per bunk, seven possible `Requirement` values) — and asked for mock data plus a screen showing bunks where clicking one pops up its special requirements.

Built:
- `src/types/roster.ts` — `MasterRosterEntry`, `SpecialRequirementEntry`, `RequirementType` (the first two are the models referenced by EPIC 2 Task 2.2, below).
- `src/data/masterRoster.json`, `src/data/specialRequirements.json` — real bunk codes from `WORKBOOK-SCHEMA.md` (structural, not personal data) with **entirely fictional** counselor names, generated fresh rather than reusing real ones — safe to commit normally, unlike the gitignored real workbook snapshot from the prior ad hoc entry.
- `src/components/Modal.tsx` — accessible (`role="dialog"`, `aria-modal`, Escape/backdrop/close-button dismissal, focus management), light notepad visual treatment.
- Rebuilt `MasterRoster.tsx` to render the roster as a table with clickable bunk buttons opening the modal.
- Added `resolveJsonModule` to `tsconfig.app.json` for typed JSON imports (wasn't needed before this).
- 10 new tests (`Modal` ×4, `MasterRoster` ×4, existing suite unaffected — 33 total passing).
- Verified via Playwright screenshots: bunk `K3` shows all 3 requirements (matching the user's own worked example — 2× No Dairy, 1× Cholov Yisroel, 1× Gluten Free), bunk `PN3` shows the correct empty state.

**Note:** this directly overlapped with and superseded the *previous* ad hoc entry's `MasterRoster` page content (the real-Google-Sheets-snapshot visualization) — both are logged in full since both were genuinely built and verified in sequence, not because the later one was known to replace the earlier one at the time.

*(Retroactively logged — committed at the time but the log entry was missed; added now while reconstructing the record before the architecture pivot below.)*

---

## Architecture Pivot #2 — 2026-07-19: JSON files, no backend

**Decision:** Immediately after seeing the mock-data Master Roster prototype above working, the user requested a second architecture simplification: remove Google Sheets and Google Apps Script entirely. The application now reads bundled JSON files directly, with **no backend of any kind**.

**How this was reached** (worth recording — it took real back-and-forth to land correctly, not a single clean instruction):

1. User: "instead of google sheets, we are going to just use json... files," with an exact spec for the two entities and a request to prototype a Master Roster screen with a click-to-popup requirements view. Built as the ad hoc entry immediately above.
2. User asked to update `ARCHITECTURE.md`/`IMPLEMENTATION-PLAN-MVP.md` to match. Before doing the full rewrite, asked a clarifying question about how day-to-day changes (e.g. marking a pickup complete) would actually be *saved* — "just use JSON files" doesn't answer that on its own. User chose "browser storage only" (no server).
3. Began drafting `ARCHITECTURE.md` around a `localStorage`-backed repository — then the user stopped this mid-draft: **"wait - there srill needs to be files (json?)."** The browser-storage design would have meant the actual `.json` files stopped mattering after the very first load, which wasn't what they meant by "files."
4. Asked a follow-up multiple-choice question about this; the user rejected it as overcomplicating something simple, and explained directly instead: **the JSON files are read fresh on an ongoing basis (not a one-time seed)**; the *only* thing that changes day-to-day right now is per-bunk pickup status (pending/processed), and that can live in plain React application memory for now, explicitly described as something that "might change later"; and there will eventually be in-app screens to edit the seed data itself (e.g. removing a special requirement) — but that's future work, not to be architected in detail now.

This sequence is recorded in this much detail because steps 2–3 represent a real overcorrection on the assistant's part (jumping to a `localStorage`-repository design) that the user had to explicitly interrupt and redirect — worth remembering: when "just use files" is said, don't assume a persistence mechanism that makes the files stop being the files.

**What changed:**

- `ARCHITECTURE.md`: fully rewritten. No backend section (removed entirely). Data store is the bundled JSON files, read directly (not through `localStorage`). New "Persistence — Current State" section explicitly documents that pickup status is in-memory-only today. New "Future: Editing Seed Data" section explicitly declines to architect the write-back mechanism speculatively. New "Architecture Revision Note" recording this as the *second* revision (after Expo/RN/Supabase → Sheets/Apps-Script → this).
- `IMPLEMENTATION-PLAN-MVP.md`: extensive rework, epic by epic:
  - Header ("Approved MVP Architecture", "Technology Decisions", "Global Implementation Rules") rewritten for the new stack.
  - **EPIC 2** renamed "Data Schema and Contract" (from "Workbook Schema and Data Contract"). Task 2.1 kept complete with a historical-context note. Task 2.2 explicitly *not* marked complete despite `MasterRosterEntry`/`SpecialRequirementEntry` already existing — the remaining models (pickup status/history, settings) haven't been defined, and won't be until their owning epics are reached. **Task 2.3 (permanent IDs) marked Not Applicable** — `bunk` is already a stable natural key in JSON; the row-position problem it solved was Google-Sheets-specific. Tasks 2.4–2.7 reframed from "worksheet" to "JSON data shape" language.
  - **EPIC 3 (Google Apps Script Backend Foundation) marked Not Applicable in its entirety** — all eight original tasks depended on a backend that no longer exists. Full original task text was replaced with a short explanation rather than kept verbatim (unlike the lighter-touch treatment given to individual Not-Applicable tasks elsewhere) since none of it could possibly still apply; the original text remains in git history if ever needed.
  - **EPIC 4** renamed "Data Repository Integration" (from "Frontend API and Repository Integration"). Explicitly documents a **known, real architecture-rule violation**: `MasterRoster.tsx` currently imports the JSON files directly, bypassing the repository pattern the rest of the document requires — because it was built as an ad hoc prototype before this epic (and therefore the repository layer) existed. Fixing it is scoped as part of Task 4.4, not a separate cleanup task. Tasks 4.1 (env config), 4.2 (API client), and 4.5 (TanStack Query) marked Not Applicable. Task 4.3's interface trimmed to only the two methods actually backed by a defined data shape today (`getRoster()`, `getSpecialRequirementsForBunk()`) rather than speculatively including pickup/history/settings methods.
  - **EPICs 5–12**: lighter-touch pass — fixed specific Apps-Script/Sheets/workbook/API references in not-yet-started tasks (these will actually be executed under this architecture, so needed to be accurate) without re-deriving every task from scratch. Notable fixes: Task 5.1's required Today-card fields corrected to drop `division` (not part of the actual data model) and generally match the real roster shape; Task 7.5 (special-requirement editing) updated to record that the user already confirmed intent for in-app editing screens, ahead of that task formally starting; Tasks 9.5/9.6 (draft preservation, backup/restore) reframed around git history instead of Google Sheets version history; Tasks 10.1/10.3/10.4 (Settings screen, data validation display) reframed from "workbook"/"backend connectivity" to "data load status"; Tasks 11.1/11.2 (test workbook, full workflow test) reframed around JSON fixture files; **EPIC 12 Tasks 12.1 and 12.2 (prepare production Sheets workbook, deploy production Apps Script) marked Not Applicable**, matching the EPIC 3 treatment; Task 12.6 (technical runbook) no longer references environment variables or an Apps Script deployment process, since neither exists. "MVP Completion Definition" and "Recommended Execution Order" sections updated to match (the latter now explicitly notes EPIC 3 and part of EPIC 12 are skipped).
  - Tasks that were already **✅ Complete** under the previous (Sheets/Apps-Script) revision — Task 1.7 in particular, whose acceptance criteria literally says "Documentation reflects... Google Apps Script, and Google Sheets" — were **deliberately left unedited**. That criterion was true when the task was completed under the architecture active at the time; rewriting completed task text to match a later architecture revision would be rewriting history, not correcting an error. This mirrors how the *first* architecture pivot handled the retired Expo/React Native track's already-completed task log entries.
- `README-MVP.md`: every Google Sheets/Apps Script mention updated to describe the JSON-file, no-backend architecture (Project Overview, MVP Goals, Product Vision, Intended User, Success Criteria, Technical Objectives, MVP Scope, Long-Term Vision). "Single-operator access protection" removed from MVP Scope's "Included" list, since there is genuinely no access-protection layer without a backend to protect (`ARCHITECTURE.md`'s Authentication section is now simply "None").

**Verification**

- `npm run verify` — 33/33 tests, lint and typecheck clean (sanity check; this pivot's changes were documentation-only, no application code touched).
- Grepped `README-MVP.md`, `ARCHITECTURE.md`, and `IMPLEMENTATION-PLAN-MVP.md` for every remaining "Apps Script" / "Google Sheets" / "workbook" / "spreadsheet" / "TanStack" mention after the rewrite and reviewed each one in context — confirmed the ones left in place are either describing what the app *replaces* (the camp's old manual process, which doesn't change with our tech stack), explicitly historical/retired-track content, or `WORKBOOK-SCHEMA.md`'s own still-valid documentation of the real spreadsheet.

**Notes / Deviations**

- This document (`IMPLEMENTATION-LOG-MVP.md`) is not being restructured into a third "track" section (mirroring "Active Track" / "Retired Track" from the first pivot) — the JSON-file architecture is a *revision* of the same active track, not a parallel retired one, since (unlike the Expo/RN/Supabase work) nothing built under the Sheets/Apps-Script revision was ever actually implemented as real, working code — it was still all just planning documents. There is no retired *code* to segregate this time, only retired *plan text*, which is handled inline (Not Applicable markers) rather than with a whole new section.
- Two log entries (`open-questions.md`, mock data/Modal) were found missing and retroactively added in this same session, immediately above this entry, before writing this one — see their entries for the note explaining why.

---

### Task 2.8 — Add Derived Special-Requirements Count to Master Roster

**Date:** 2026-07-19
**Status:** ✅ Complete

**Summary**

User request after reviewing the Master Roster screen: show, per bunk, how many special-requirement *records* exist for it — a derived value joining `masterRoster.json` and `specialRequirements.json` on `bunk`, not stored anywhere. Formalized as EPIC 2 Task 2.8 before implementing, per the user's explicit "add to the plan, implement, and log" request.

- Added a "Special Requirements" column to the `MasterRoster` table showing the count.
- **Explicitly a record count, not a sum of quantities** — bunk `K3`'s 3 entries (`No Dairy` × 2, `Cholov Yisroel` × 1, `Gluten Free` × 1) show **3**, not 4. Bunks with none show `0`, not a blank cell.
- **Real refactor during implementation, not just the new feature**: the first version put the counting function directly in `MasterRoster.tsx` and exported it (to make it testable) — `oxlint`'s `react/only-export-components` rule correctly flagged this as breaking Fast Refresh's assumption that component files only export components. Moved the logic to a new `src/services/specialRequirements.ts` (matching `ARCHITECTURE.md`'s Application Layers — business logic belongs in services, not components), and changed it from reading the module-level imported JSON to a pure function taking `requirements` as a parameter. This is strictly more testable than the original, not just a lint-satisfying workaround.

**Verification**

- New `tests/specialRequirements.test.ts`: unit tests against **fixture data** (not the real mock data) — record-count-not-sum, zero case, and an explicit "recomputes correctly as the underlying data changes" test that mutates a fixture array between assertions, directly satisfying this task's acceptance criterion of that exact name.
- `tests/MasterRoster.test.tsx`: kept one integration-style test confirming the count actually reaches the correct table cell when rendered (`within(row).getByRole('cell', ...)`) — removed the redundant direct-function-call assertions now that the service has its own thorough unit tests.
- `npm run verify` — 38/38 tests, lint (including the `react/only-export-components` fix) and typecheck clean.
- `npm run build` — succeeds.
- Visually verified via Playwright screenshot against the real mock data: every row's count matches what's in `specialRequirements.json` by hand-check (`K3`=3, `PN3`=0, `IB4`=1 [a single quantity-2 record, correctly not double-counted], etc.).

**Notes / Deviations**

- None.

---

### Ad hoc: Fix invisible modal text in dark-mode browsers; remove invented note text

**Date:** 2026-07-19
**Status:** ✅ Complete

**Summary**

User reported the Master Roster special-requirements popup appeared **blank** after clicking a bunk (e.g. `PN2`), and separately flagged that "medication" wasn't one of the seven `Requirement` values they'd specified.

- **"Medication" concern**: not a bug — `"Daily medication at 2pm"` was always in the `notes` field, not `requirement`. The `requirement` field for that record correctly read `"Nurse"` (one of the seven values). Since I had invented that note text as mock flavor and it was reading as confusing, removed it from `specialRequirements.json` (PN2 now has no `notes` field).
- **Blank popup — root cause found**: `src/index.css` declared `color-scheme: light dark` on `:root`, but no rule in the app sets an explicit `color` on `body`/`:root`, and `.modal`'s background (`#fffdf5`) is a hardcoded light value that never changes. In a light-mode browser, the UA's default text color (black) happens to match the design tokens, so this was invisible in normal review. In a dark-mode browser/OS, the UA flips its default text color to white (per `color-scheme: light dark`), producing white text on the modal's still-light background — text technically present in the DOM but visually invisible. This is not a React/data bug; the popup was never actually blank, just unreadable.
- Fixed by changing `color-scheme: light dark` to `color-scheme: light` — correct because no dark-mode-aware colors exist anywhere in this app's design tokens or components; the app does not support a dark theme today, so it shouldn't advertise one to the browser.

**Verification**

- Playwright, default (light) browser context: clicked every bunk with ≥1 special requirement (11 bunks) using exact button-name matching; every popup showed correct, matching content — confirmed the original bug report was not reproducible under normal conditions.
- Playwright, `colorScheme: 'dark'` browser context (reproducing the user's actual environment): before the fix, this would need to be captured to confirm the failure mode; after the fix, screenshotted the `PN2` popup and confirmed fully legible black-on-cream text, matching the light-mode rendering exactly.
- `npm test -- --run` — 38/38 tests pass after both changes.

**Notes / Deviations**

- An earlier debugging pass used a Playwright script with `button:has-text("N2")`, which matched `PN2`'s button too (substring match) and produced a misleading "stale content" result. Corrected to exact-name matching before drawing conclusions — worth remembering for any future ad hoc Playwright scripts in this project: always use exact/role-based matching for bunk codes, since many are substrings of others (`N2`/`PN2`, `K1`/`K1B`, etc.).

---

### Task 2.6 — Define Data Validation Rules / Task 2.7 — Build Data Schema Tests

**Date:** 2026-07-19
**Status:** ✅ Complete (both tasks, implemented together)

**Summary**

Next task per the plan's "Recommended Execution Order" (Task 2.4 and 2.5 remain explicitly deferred to their owning epics). Implemented structural and data-quality validation for the two JSON data files.

- `src/types/roster.ts`: added `REQUIREMENT_TYPES` as a `const` array (`as const`), with `RequirementType` now derived from it (`(typeof REQUIREMENT_TYPES)[number]`) instead of being a hand-written union. Single source of truth — a runtime array is required to validate an unknown value against the seven allowed requirement types, and deriving the compile-time type from it means the two can't drift apart.
- `src/services/dataValidation.ts`: three pure functions, `validateMasterRoster`, `validateSpecialRequirements`, and `validateData` (which combines both and cross-checks `specialRequirements` bunks against the roster). Each takes `unknown[]` rather than the typed entry arrays — this is deliberate: the whole point is to check data that hasn't been proven to match the type yet (unlike the existing `as MasterRosterEntry[]` casts elsewhere, which assume correctness rather than verify it). Returns a flat list of `ValidationError` objects (`{ file, index, bunk?, message }`) rather than throwing, so a caller gets every problem at once with enough detail to locate and fix each one.
- Detects: missing/invalid `bunk`, missing/invalid `counselors`, non-negative `campers`, duplicate `bunk` values within `masterRoster.json` (reporting both the duplicate's index and the first occurrence's index), invalid `requirement` values outside the seven defined types, non-positive `quantity`, non-string `notes`, and `specialRequirements` entries whose `bunk` doesn't exist in `masterRoster.json`.
- **Not wired into any live data-loading path yet** — deliberately. `MasterRoster.tsx` still imports the JSON files directly with a blind cast, unchanged by this task. Actually validating data as part of loading it belongs to the repository layer (EPIC 4, Task 4.4), which doesn't exist yet; wiring it in now would mean building ahead of the epic that owns that integration point, contrary to this plan's established pattern (see Task 2.2's note and EPIC 4's documented "known gap").

**Verification**

- New `src/tests/dataValidation.test.ts`: fixture-based (not the real mock data files), covering both tasks' acceptance criteria directly — valid fixtures produce zero errors; a missing `bunk`, a missing `counselors`, a negative `campers`, a duplicate `bunk` (asserting the earlier index is named), an invalid `requirement` value, a non-positive `quantity`, and an orphaned cross-file `bunk` reference each produce exactly the expected error with a clear, specific message.
- `npm run verify` (lint + typecheck + test) — clean; 49/49 tests (11 new).
- `npm run build` — succeeds.

**Notes / Deviations**

- None.

---

### Task 4.3 — Define Snack Repository Interface

**Date:** 2026-07-19
**Status:** ✅ Complete

**Summary**

First task of EPIC 4 — Data Repository Integration, per the plan's Recommended Execution Order (EPIC 3 skipped as Not Applicable).

- `src/repositories/snackRepository.ts`: defines `SnackRepository`, a `type` with exactly two methods, `getRoster(): MasterRosterEntry[]` and `getSpecialRequirementsForBunk(bunk: string): SpecialRequirementEntry[]` — matching the plan's revised (non-Apps-Script) method list. Removed the directory's placeholder `.gitkeep` now that it holds a real file, same as `src/services/` earlier.
- Deliberately interface-only, no implementation and no wiring: `MasterRoster.tsx` is untouched by this task and still imports `src/data/*.json` directly. Implementing the interface against the real JSON files, and switching `MasterRoster.tsx` over to it (closing the "known gap" EPIC 4's objective section documents), is Task 4.4 — kept separate on purpose, same reasoning already applied to Task 2.2 (define the model) vs. its consumers, and Task 2.6 (define validation) vs. wiring it in.

**Verification**

- New `src/tests/snackRepository.test.ts`: a small fixture-backed object literal typed as `SnackRepository`, exercised directly — confirms the interface is genuinely usable by a mock implementation in tests, without importing or touching `src/data/*.json`, satisfying this task's second acceptance criterion. (The first acceptance criterion — pages depending on the interface — is intentionally not yet true; see the Notes above and the plan entry.)
- `npm run verify` (lint + typecheck + test) — clean; 51/51 tests (2 new).
- `npm run build` — succeeds.

**Notes / Deviations**

- None.

---

### Task 4.4 — Implement JSON Data Repository

**Date:** 2026-07-20
**Status:** ✅ Complete — **closes EPIC 4's documented "known gap."**

**Summary**

- `src/repositories/jsonSnackRepository.ts`: two-layer implementation.
  - `buildSnackRepository(masterRoster: unknown[], specialRequirements: unknown[]): SnackRepository` — pure function; runs Task 2.6's `validateData` and throws a new `DataValidationError` (extends `Error`; carries both the full `ValidationError[]` as `.errors` for programmatic use and a formatted, readable `.message`) if any errors are found, otherwise returns a working `SnackRepository`.
  - `createJsonSnackRepository(): SnackRepository` — thin wrapper calling the above with the real bundled JSON imports (`@/data/masterRoster.json`, `@/data/specialRequirements.json`). This is the only place in the codebase that imports those two files.
- `src/pages/MasterRoster.tsx`: rewritten to call `createJsonSnackRepository()` (memoized via `useMemo` so validation runs once, not on every click/state change) instead of importing the JSON files directly. On success, renders as before. On a thrown `DataValidationError` (or any other error), renders the existing `ErrorState` component with the error's message instead of the table — no uncaught exception, no silent empty render.
- Also simplified the per-row special-requirements count: previously called the `getRequirementCountForBunk` service function (Task 2.8) against a page-level `requirements` array; now calls `repository.getSpecialRequirementsForBunk(row.bunk).length` directly, since the repository's per-bunk method already does the exact filtering that service function did. `getRequirementCountForBunk` itself is left in place (still correct, still tested, no longer called from this page) rather than deleted — it's a legitimate general-purpose utility, not dead code created by this task, and Global Implementation Rule #8 (don't rewrite completed work without a validated incompatibility) argues against pruning it opportunistically.
- **Deliberate deviation from `ARCHITECTURE.md`'s literal `{ success, data }` / `{ success: false, message, errorCode }` Error Handling shape**: that shape is written for business services with per-call, potentially-async success/failure semantics (e.g. completing a pickup, EPIC 6). This repository is a synchronous, load-once, all-or-nothing validity gate over static bundled data — there's exactly one thing that can fail (the data didn't validate), and it fails the same way for every method. A thrown, typed `DataValidationError`, caught once at the page boundary and translated into `ErrorState`, meets the same underlying goals (clear message, no raw stack trace shown, no silent empty render) without forcing every `SnackRepository` call site to unwrap a result object for an error condition that, in practice, can only ever occur once, at load time.

**Verification**

- New `src/tests/jsonSnackRepository.test.ts`: `createJsonSnackRepository()` against the real bundled mock data (loads successfully, `K3` has 3 requirement records, `PN3` has 0); `buildSnackRepository()` against fixtures — valid data builds a working repository, invalid data throws `DataValidationError`, and the thrown error's `.message` and `.errors` are asserted directly.
- New `src/tests/MasterRoster.errorState.test.tsx`: `vi.mock`s both JSON data modules with deliberately invalid fixture content (a roster entry missing `bunk`) for this file only, renders `<MasterRoster />`, and confirms an `alert`-role element appears with a message naming `masterRoster.json`, and that no `table` is rendered — proving the wiring from repository failure through to the UI, not just that the repository itself throws correctly in isolation.
- Existing `src/tests/MasterRoster.test.tsx` (bunk list, popup content, no-requirements message, close behavior, count column) required no changes and still passes — confirms the refactor is behavior-preserving for the success path.
- `grep -rn "data/masterRoster.json\|data/specialRequirements.json" src/pages src/components` — zero matches, confirming the acceptance criterion directly ("No page or component imports `src/data/*.json` directly — only the repository does").
- `npm run verify` (lint + typecheck + test) — clean; 56/56 tests (5 new).
- `npm run build` — succeeds.
- Playwright smoke test against the running dev server (`http://127.0.0.1:5180/roster`): clicked `K3`, confirmed the popup still shows the correct three requirements end-to-end through the new repository layer, matching pre-refactor behavior.

**Notes / Deviations**

- See the Error Handling deviation noted above (intentional, reasoned, not a gap).

---

### Task 4.6 — Build Data Diagnostics Screen

**Date:** 2026-07-20
**Status:** ✅ Complete

**Summary**

- `src/repositories/jsonSnackRepository.ts`: added `getDataLoadDiagnostics(masterRoster = masterRosterJson, specialRequirements = specialRequirementsJson)`, returning a `DataLoadDiagnostics` discriminated union — `{ loaded: true, rosterCount, specialRequirementCount }` on success, `{ loaded: false, error: DataValidationError }` on failure — rather than throwing. This is a deliberately different shape from `createJsonSnackRepository()`'s throw-based approach in the same file: a diagnostics screen exists specifically to *display* a failure clearly, not propagate an exception past it. Optional parameters (defaulting to the real bundled JSON) keep it directly testable against fixtures, matching `buildSnackRepository`'s existing pattern.
- `src/components/DataDiagnostics.tsx` (+ `.css`): new presentational component. Takes `frontendVersion: string` and `diagnostics: DataLoadDiagnostics` as props — no data loading of its own, matching the codebase's existing split between pages (data) and components (presentation). Shows frontend version, a `StatusBadge` for load status (real text label, not color alone, per the standing principle from Task 5.1's note), and either the two record counts or the validation error message, depending on outcome.
- `src/pages/Settings.tsx`: replaced its placeholder paragraph with `<DataDiagnostics frontendVersion={packageJson.version} diagnostics={getDataLoadDiagnostics()} />`. `packageJson` is imported directly from the repo-root `package.json` (`resolveJsonModule` already enabled since Task 1.x) — its `version` field is `0.0.0`, the real, un-bumped Vite scaffold default, not a fabricated value.

**Verification**

- New tests in `src/tests/jsonSnackRepository.test.ts`: `getDataLoadDiagnostics()` against the real bundled data (positive counts); against valid fixtures (exact counts asserted); against invalid fixtures (`loaded: false` with the `DataValidationError`, not a thrown exception).
- New `src/tests/DataDiagnostics.test.tsx`: component test with both a success-shaped and a failure-shaped `diagnostics` prop passed directly — confirms record counts show on success, the error message shows (and record-count labels do *not* appear) on failure.
- New `src/tests/Settings.test.tsx`: renders the real `Settings` page (no mocking) and confirms the diagnostics section, version, status, and both count labels are present — proving the wiring, not just the component in isolation.
- `npm run verify` (lint + typecheck + test) — clean; 62/62 tests (6 new).
- `npm run build` — succeeds.
- Playwright screenshot of `/settings` at a phone-sized viewport (420×700): confirms visually correct, legible rendering — frontend version `0.0.0`, a green "Loaded and validated successfully" badge, "Bunks loaded: 35", "Special requirement entries loaded: 15" (matching `src/data/*.json`'s real current contents by hand-check).

**Notes / Deviations**

- None.

---

### Task 4.7 — Build Repository Tests

**Date:** 2026-07-20
**Status:** ✅ Complete — **EPIC 4 (Data Repository Integration) is complete.**

**Summary**

Reviewed existing coverage against this task's two acceptance criteria before writing anything new, to avoid duplicating Task 4.4/4.6's tests:

- "Success, malformed-data, and missing-data cases are tested against the repository" — already true: `tests/jsonSnackRepository.test.ts` covers `buildSnackRepository` (valid fixture, missing-`bunk` fixture throwing `DataValidationError`) and `getDataLoadDiagnostics` (real data, valid fixture, invalid fixture returning `loaded: false`), plus `createJsonSnackRepository` against the real data. Nothing to add here.
- "Component tests use a mock/fixture-backed repository, never the real `src/data/*.json` mock data" — **not yet true.** `MasterRoster.test.tsx` rendered the real `<MasterRoster />`, which internally called `createJsonSnackRepository()` with no way to substitute it — so those tests asserted specific real-data values (`K3` has exactly 3 requirements, `PN3` has exactly 0), a genuine case of tests silently depending on the mock data meant for local display, exactly as this criterion warns against.

Fixed by making the dependency explicit and injectable:

- `src/pages/MasterRoster.tsx`: added an optional `createRepository?: () => SnackRepository` prop, defaulting to `createJsonSnackRepository` — normal usage (via the router, no props passed) is completely unchanged.
- `src/tests/MasterRoster.test.tsx`: rewritten to build a small fixture repository (`A1`/`B2` bunks, not real bunk codes) and inject it via the new prop. No longer touches `src/data/*.json` at all.
- `src/tests/MasterRoster.errorState.test.tsx`: rewritten to inject a `createRepository` that throws directly, replacing the previous `vi.mock('../data/masterRoster.json', ...)` approach — simpler, and no longer relies on mocking a module boundary. Also added a second case not previously covered: the component's fallback "Failed to load Snack Shack data." message when the repository throws something other than `DataValidationError`.
- `src/pages/Settings.tsx` was deliberately **not** given the same prop-injection treatment. `src/tests/Settings.test.tsx` only asserts label text (`"Bunks loaded"`, `"Special requirement entries loaded"`, etc.), never specific counts — so it isn't coupled to real-data values the way the old `MasterRoster.test.tsx` was. `getDataLoadDiagnostics()` already accepts injectable data as parameters (used directly by its own tests in `jsonSnackRepository.test.ts`). Adding a second injection mechanism at the component level would duplicate that without fixing a real gap.

**Verification**

- `npm run verify` (lint + typecheck + test) — clean; 63/63 tests (net +1: one old test file's approach was replaced, one new case added).
- `npm run build` — succeeds.
- Playwright smoke test against the running dev server: clicked `K3` on the real `/roster` page (default `createRepository`, real data, no props) — confirmed still shows the correct three requirements, proving the default injection path is unbroken.

**Sign-off**

EPIC 4 — Data Repository Integration is complete. Tasks 4.1, 4.2, and 4.5 are Not Applicable (no backend/API client to configure); Tasks 4.3, 4.4, 4.6, and 4.7 are done, reviewed, and verified. The "known gap" documented at this epic's start (`MasterRoster.tsx` importing JSON directly) is fully closed. Proceeding to **EPIC 5 — Today Screen and Snack Day Initialization**, starting with **Task 5.1 — Define Today Screen UX**.

---

### Task 5.1 — Define Today Screen UX

**Date:** 2026-07-20
**Status:** ✅ Complete

**Summary**

First task of EPIC 5. Scoped deliberately narrowly to what "Define ___ UX" means here — the visual design and what each row shows — not the interactive pickup workflow (EPIC 6) or snack-day initialization (Task 5.2), which come later.

- `src/components/TodayBunkRow.tsx`: new presentational component, one `<tr>` per bunk, showing everything this task's requirements list asks for — bunk code, camper count (dash when absent), pickup status (`StatusBadge`, always paired with a real text label — "Pending" / "Picked Up" — never color alone), a special-requirement indicator ("None" or "N special requirement(s)"), and pickup time (only rendered for a `completed` row; always a dash for `pending`, since that data doesn't exist under the current in-memory-only persistence model).
- `src/pages/Today.tsx`: fully rewritten. Previously rendered the temporary `useWorkbookSnapshot` real-workbook-snapshot view (its own code comment already flagged it as temporary, "EPIC 4 replaces it entirely" — that comment undersold it slightly, since EPIC 4 only touched `MasterRoster.tsx`; this task is what actually retires it from the `/` route). Now reads through the repository via the same `createRepository`-injection pattern established for `MasterRoster.tsx` in Task 4.7, rendering an `EmptyState` for zero bunks and an `ErrorState` for load failure, matching the established pattern from EPIC 4.
- `useWorkbookSnapshot.ts` and `types/workbookSnapshot.ts` were **not** deleted — `Requirements.tsx` still uses them, and that page belongs to EPIC 7, not this task. Only `Today.tsx`'s use of them was removed.
- **Every bunk currently shows "Pending"** — this is the honest current state, not a placeholder bug: no pickup-completion interaction exists yet (that's EPIC 6, starting at Task 6.1). Fabricating a "completed" bunk in the live app to make the row look more finished was deliberately avoided, matching this plan's established practice of showing real state rather than invented data (see Task 2.8's `0`-not-blank precedent, `MasterRoster.tsx`'s real record counts).

**Verification**

- New `src/tests/TodayBunkRow.test.tsx`: proves the acceptance criterion "completed and pending bunks are easy to distinguish without relying only on color" directly — renders both `status` values via props and asserts the specific, distinct text labels ("Pending" vs. "Picked Up") each appear, the other does not, pickup time only appears for `completed`, and special-requirement wording (`None` / singular / plural) is correct.
- New `src/tests/Today.test.tsx`: fixture-backed repository injection (not `src/data/*.json`, per the Task 4.7 pattern) — confirms roster bunks render with status, campers, and requirement indicator all visible in the row (no click needed, the other acceptance criterion); confirms the empty-roster and load-failure states render `EmptyState`/`ErrorState` instead of the table.
- `npm run verify` (lint + typecheck + test) — clean; 73/73 tests (10 new).
- `npm run build` — succeeds.
- Playwright: screenshot of `/` at 420px width — full bunk list renders correctly, all "Pending," special-requirement counts match `src/data/specialRequirements.json` by hand-check (e.g. `K3` shows "3 special requirements"). Separately confirmed, via `document.documentElement.scrollWidth` vs. `clientWidth` at a 390px viewport (the same check used in Task 1.8), that the page itself does not overflow horizontally — the table's own `overflow-x: auto` wrapper (pre-existing `SnapshotTable.css`, already used by `MasterRoster`) absorbs any internal scroll, not the page.

**Notes / Deviations**

- None.

---

### Task 5.2 — Implement Snack Day Initialization Service

**Date:** 2026-07-20
**Status:** ✅ Complete

**Summary**

- `src/types/snackDay.ts`: new, minimal types — `PickupStatus` (`'pending' | 'completed'`), `SnackDayBunkRecord` (`bunk`, `expectedCount?`, `specialRequirementCount`, `status`), `SnackDay` (`date`, `bunks`). Kept separate from `src/types/roster.ts` deliberately: these describe in-memory, session-scoped state, not data read from `src/data/*.json`.
- `src/services/snackDayInitialization.ts`: `initializeSnackDay(repository: SnackRepository, date: string, existingDays: SnackDay[] = []): SnackDay[]` — a pure function, not a class or stateful service, consistent with the rest of this codebase's services/repository. Reads the roster and each bunk's special-requirement count from the given repository **once**, at call time, snapshotting both onto the new day's records — deliberately not a live-recomputed view, so a later seed-data edit can't silently alter an already-initialized day (directly serves the user's own previously-stated future intent to edit seed data, e.g. removing a special requirement).
- Idempotency and history preservation share one mechanism: the function checks `existingDays` for a matching `date` first — if found, returns the array **by reference, unchanged** (no new day, no duplicate bunks); if not found, returns a **new** array with the new day appended, never mutating or dropping any existing entry (satisfies "preserve completed historical days" structurally, even though there's no real multi-day persistence to exercise this against yet — that's EPIC 8).
- "Eligible bunk" was interpreted as "every bunk currently in the roster" — the data model has no eligibility/active flag to filter on, and inventing one wasn't asked for.
- Not wired into `Today.tsx` — that's Task 5.3.

**Verification**

- New `src/tests/snackDayInitialization.test.ts`: creates one pending record per fixture roster bunk with the correct snapshotted `expectedCount`/`specialRequirementCount`; confirms calling twice with the same date returns the exact same array reference (true idempotency, not just equal-looking output) with no duplicate bunks; confirms a historical day (with a `completed` status) passed in as `existingDays` survives untouched, by reference, alongside the newly appended day; confirms mutating the underlying roster array *after* initialization does not retroactively change the already-created snapshot.
- `npm run verify` (lint + typecheck + test) — clean; 77/77 tests (4 new).
- `npm run build` — succeeds.

**Notes / Deviations**

- None.

---

### Task 5.3 — Build Today Screen Data Loading

**Date:** 2026-07-20
**Status:** ✅ Complete

**Summary**

- `src/types/snackDay.ts`: `SnackDay` gained `dayStatus: 'active' | 'closed'` (set to `'active'` in `initializeSnackDay`, Task 5.2) — a minimal, additive extension needed to represent this task's required "closed" state, which Task 5.2 had no reason to include yet.
- `src/pages/Today.tsx`: rewritten around the required states. Load failure → `ErrorState`. No day for today → `EmptyState` ("Today hasn't been started yet.") plus a "Start Today" button calling `initializeSnackDay`. An active, non-closed day → the bunk table (via `TodayBunkRow`, Task 5.1), reading each row from the day's own snapshot (`expectedCount`, `specialRequirementCount`, `status`) rather than live repository calls, since the whole point of Task 5.2's snapshot was to stop tracking live data once a day starts. A closed day → the same table, read-only in spirit, with a "Day Closed" `StatusBadge` replacing the button. **"Loading" has no rendered branch** — repository creation is synchronous (bundled JSON import, no `fetch`), so there is no real frame during which a spinner would ever paint; writing one would be unreachable code for a state that structurally cannot occur under this architecture, which the project's standing guidance says not to add. Documented in a code comment and here rather than silently dropped, so it reads as a deliberate decision if the architecture ever becomes async.
- **Real bug caught and fixed while implementing this, not just executing the task as originally scoped**: a plain `useState` inside `Today.tsx` would be destroyed every time React Router unmounted the page (i.e. every navigation to another tab, not just a reload) — stricter than `ARCHITECTURE.md`'s explicit "reset every time the page is reloaded" (not "navigated away from"). Fixed by introducing `SnackDayProvider` (`src/components/SnackDayProvider.tsx`) holding the `snackDays` state, mounted once around `<Outlet />` in `AppShell.tsx` — `AppShell` persists across all in-app navigation, only remounting on an actual page reload, which is exactly the boundary the architecture describes. The context/hook plumbing (`SnackDayContext`, `useSnackDays()`) lives in a separate `src/hooks/useSnackDays.ts` from the `SnackDayProvider` component itself, split for the same `react/only-export-components` lint reason as Task 2.8's `getRequirementCountForBunk` move.
- `SnackDayProvider` accepts an optional `initialSnackDays` prop (default `[]`) purely for test seeding (e.g. constructing a closed-day scenario without a real close-day feature to produce one) — real usage via `AppShell` never passes it.

**Verification**

- New `src/tests/useSnackDays.test.tsx`: `useSnackDays()` throws a clear error outside a provider; starts empty and updates via `setSnackDays` inside one; accepts seeded `initialSnackDays`.
- Rewrote `src/tests/Today.test.tsx` around the new state machine (fixture-injected repository + a fixed `today()` date, same DI pattern as Task 4.7): not-initialized state and its button; clicking through to the active day with all data visible per-row; a seeded closed day rendering read-only; a seeded active day with zero bunks showing `EmptyState`; the error path unchanged from before. **Added a test proving the actual architectural fix**: mounts `Today` inside a `SnackDayProvider`-wrapped test harness, initializes the day, unmounts `Today` (simulating navigating away) while keeping the same provider instance mounted, remounts `Today` (simulating navigating back), and confirms the day is still active with no "Start Today" button — this is the test that would have failed against the original component-local `useState` implementation.
- `npm run verify` (lint + typecheck + test) — clean; 83/83 tests (13 new).
- `npm run build` — succeeds.
- Playwright against the running dev server: screenshotted the not-initialized state and the active state (all 34 bunks, correct special-requirement counts matching `src/data/specialRequirements.json`); then, in the same session, clicked Start Today, navigated to Master Roster, navigated back to Today, and confirmed via a `Start Today` button-count check (0, as expected) that the active day survived real in-app navigation — the live-app confirmation of the fix, not just the unit test.

**Notes / Deviations**

- None.

---

## Completed Task History — Retired Track (Expo / React Native / Supabase)

### Task 1.1 — Create the React Native Expo Project

**Date:** 2026-07-18
**Status:** ✅ Complete

**Summary**

Scaffolded the `wsd-snack-shack` Expo project with TypeScript and Expo Router, using the official `create-expo-app` default template as a starting point, then stripped it down to a minimal shell per the task requirement to avoid business/demo screens:

- Removed the template's tutorial content (tabs demo, animated splash icon, hint rows, web badge, themed text/view components, `global.css`/CSS-module references) and their now-unused dependencies (`@expo/ui`, `expo-device`, `expo-glass-effect`, `expo-image`, `expo-symbols`, `expo-web-browser`, `react-native-reanimated`, `react-native-worklets`).
- Moved the router root from the template's `src/app/` to a root-level `app/` directory to match `ARCHITECTURE.md` (route files at the project root; reusable/business logic under `src/`, added in a later task).
- Replaced the demo home screen with a minimal `app/index.tsx` (displays "WSD Snack Shack") and a minimal `app/_layout.tsx` (Expo Router `Stack` wrapped in `SafeAreaProvider`).
- Removed template-only meta files not part of this project's conventions (`AGENTS.md`, `CLAUDE.md`, `.claude/`, `.vscode/`, `LICENSE`, generic `README.md`, tutorial `reset-project` script) and unused demo image assets.
- Initialized a local git repository and created the initial commit (no remote configured yet).

**Verification**

- `npx tsc --noEmit` — passes with no errors.
- `npx expo-doctor` — 20/20 checks passed.
- `npx expo export --platform web` — bundles successfully; exported static HTML confirmed to render the "WSD Snack Shack" title text.
- Device/simulator startup was not verified on physical iPhone/iPad/Android hardware — this development environment has no simulators or physical devices attached. Web export was used as the available substitute per EPIC 1's objective ("web-based development tooling where useful"). Physical/simulator device verification remains required before EPIC 12 pilot deployment (Task 12.4) and should be spot-checked opportunistically as early as practical.

**Notes / Deviations**

- Pre-existing empty root-level `components/`, `constants/`, `services/`, `types/` directories from before this task were left untouched. They predate `ARCHITECTURE.md`'s `src/`-based layout and will be reconciled with the approved structure in Task 1.3 (Configure Project Structure) rather than modified here, to keep this task scoped to project scaffolding only.
- `react-native-gesture-handler` was kept (unlike the other stripped animation/demo libraries) since Expo Router's native-stack navigation commonly depends on it for gesture handling; `expo-doctor` raised no issue with this dependency set.

**Follow-up (2026-07-18): manual verification**

The user manually verified the running app after this task was marked complete:

- Attempted to load the app in Expo Go on an Android device via LAN (`exp://192.168.86.94:8081`). Failed with "Project is incompatible with this version of Expo Go" — the project's Expo SDK (57) is newer than what the Play Store build of Expo Go currently supports. Confirmed as a known, ongoing industry issue (Expo Go's app-store review/rollout lags behind npm SDK releases by design, not something specific to this project — see [Expo's own changelog](https://expo.dev/changelog/expo-go-and-app-store-may-2026)).
- Briefly downgraded the project to SDK 56 to test whether an older line would match the installed Expo Go build; still incompatible, so reverted back to SDK 57 (latest) rather than continue guessing at the Play Store's exact version. Net effect on `package.json`: none (back to original SDK 57 dependency set); `expo-status-bar` was added to `app.json`'s plugin list by `expo install --fix` during the round-trip, which is expected/harmless for this SDK line.
- Sideloading the official SDK-57 Expo Go build (via `expo.dev/go`) was offered but the user reasonably paused on Android's "install from unknown sources" prompt. Rather than push past that, the user verified the running app via a plain browser instead: `http://192.168.86.94:8081` in a LAN browser renders "WSD Snack Shack" correctly.
- Decision: native device/simulator verification via Expo Go remains deferred (as already noted above) — chasing Play Store's SDK lag during early development isn't worth the friction. Real device testing will happen against actual **EAS-built standalone binaries** starting at Task 12.3 (Configure Expo Application Services and Internal Builds), which do not depend on the Expo Go client or its SDK-matching constraints at all.

---

### Task 1.2 — Add Required Project Documentation

**Date:** 2026-07-18
**Status:** ✅ Complete

**Summary**

Validated and normalized the project's core documentation set. All five required files already existed with correct content from prior setup, but three had inconsistent (lowercase) filenames that didn't match the naming convention used throughout `ARCHITECTURE.md` and `IMPLEMENTATION-PLAN-MVP.md`'s own self-references (e.g. the plan's "Architecture Reference: `ARCHITECTURE.md`" header):

- Renamed `architecture.md` → `ARCHITECTURE.md`, `implementation-plan-mvp.md` → `IMPLEMENTATION-PLAN-MVP.md`, `implementation-log-mvp.md` → `IMPLEMENTATION-LOG-MVP.md` via a two-step `git mv` (case-only renames need this on Windows/git to register as tracked renames rather than being silently ignored by the case-insensitive filesystem).
- `README-MVP.md` already used the correct casing; left as-is.
- Created `.env.example` with the two public Supabase variable names (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`), no values — full runtime environment handling (validation, missing-config errors) is Task 1.7's scope, not this task's.

**Verification**

- Confirmed all five required files exist at the project root with matching casing.
- Grepped the project's own `.md` files for lingering references to the old lowercase filenames — none found outside of `sample-plan-mvp.md`, which is user-supplied reference material from a different project, not part of this project's required doc set.
- `IMPLEMENTATION-PLAN-MVP.md` already references `ARCHITECTURE.md` in its Document Status header.

**Notes / Deviations**

- The task's requirement that "the implementation log must start with... empty completed-task history" describes the log's state when first scaffolded. In practice this log was already populated with Task 1.1's entry before this task ran (Task 1.1 was completed and logged first, per actual project execution order). Re-emptying it to match the literal instruction would discard real history for no benefit, so the log was left populated — the intent (a working, ready-to-use log) is already satisfied.

---

### Task 1.3 — Configure Project Structure

**Date:** 2026-07-18
**Status:** ✅ Complete

**Summary**

Built out the folder structure from `ARCHITECTURE.md` §7 exactly as Task 1.3 enumerates it:

- `src/components/`, `src/hooks/`, `src/lib/`, `src/services/`, `src/theme/`, `src/types/`, `src/utils/`
- `src/features/` with the nine required feature folders: `authentication`, `dashboard`, `bunks`, `special-requirements`, `snack-days`, `pickups`, `inventory`, `history`, `administration`
- `supabase/migrations/`, `supabase/tests/`
- `tests/` (already existed at root, empty; preserved)
- `app/` and `assets/` already existed with real content from Task 1.1; untouched.

Removed the four stray root-level `components/`, `constants/`, `services/`, `types/` directories left over from before `ARCHITECTURE.md` was written (flagged as a known deviation in Task 1.1's log entry) — they predated the `src/`-based layout and don't appear anywhere in it; confirmed empty before deleting.

Every newly created directory that has no real content yet contains a single `.gitkeep` file. This is a deliberate reading of the task's instruction — "do not add placeholder files that provide no value" rules out fake/stub component or service files, while the very next sentence ("add only the minimum files required to preserve directories and establish boundaries") is describing exactly this kind of minimal directory-preservation marker, since git does not track empty directories on its own. Real content will replace these `.gitkeep` files directory-by-directory as later epics land (e.g. `src/lib/supabase.ts` in Task 2.10, `src/theme/*` in Task 1.6, each `src/features/*` subtree in its owning epic).

**Verification**

- `npx tsc --noEmit` — passes with no errors.
- `npx expo-doctor` — 20/20 checks passed.
- `npx expo export --platform web` — still bundles and renders "WSD Snack Shack" correctly; the restructuring is additive and doesn't touch anything the running app depends on.
- Confirmed the `@/*` → `./src/*` path alias actually resolves through the new structure: added a throwaway `src/utils/_verify.ts` exporting a const and a throwaway root file importing it via `@/utils/_verify`, ran `tsc --noEmit` clean, then deleted both temporary files (not committed).
- Full project tree reviewed by hand against `ARCHITECTURE.md` §7's proposed structure — matches.

**Notes / Deviations**

- None beyond the stray-directory cleanup noted above, which was anticipated and flagged in Task 1.1's log entry.

---

### Task 1.4 — Configure Code Quality and Test Tooling

**Date:** 2026-07-18
**Status:** ✅ Complete

**Summary**

Established the full quality/verification baseline:

- **ESLint**: `expo lint`'s auto-setup (`eslint@^9`, `eslint-config-expo`) via flat config in `eslint.config.js`. Switched the `lint` script from `expo lint` to plain `eslint .` — `expo lint` explicitly targets `src/` as a positional argument and errors ("all matching files are ignored") because `src/` currently holds only `.gitkeep` placeholders from Task 1.3; running the underlying `eslint` binary against the whole project doesn't have this problem and behaves identically once real files land in `src/`.
- **Prettier**: added `.prettierrc.json` (single quotes, trailing commas, 100-char width), plus `eslint-config-prettier` appended last in the ESLint flat config to disable stylistic rules that would otherwise conflict with Prettier.
- **`.prettierignore`**: scoped Prettier to actual source — excluded all `*.md` docs (reformatting the hand-crafted planning docs would create noisy, low-value diffs) and the Expo-generated `assets/expo.icon/icon.json`.
- **Jest**: `jest.config.js` using the `jest-expo` preset (SDK-57-matched version), plus `jest`, `@testing-library/react-native`, `react-test-renderer` (pinned to `19.2.3` to exactly match the project's `react` version — `react-test-renderer@latest` requires a newer `react` peer and fails to resolve otherwise), and `@types/jest` (pinned to `29.5.14`, matching `jest@29`; `expo-doctor` caught `@types/jest@30` as a version mismatch on the first pass and it was corrected).
- **Baseline test**: `tests/app-index.test.tsx`, a real smoke test rendering `app/index.tsx` and asserting the "WSD Snack Shack" text is visible — not a placeholder. Removed `tests/.gitkeep` since the directory now has real content.
- **Scripts**: `lint`, `typecheck` (`tsc --noEmit`), `test` (`jest`), `format` / `format:check` (`prettier --write/--check .`), and `verify` (`lint && typecheck && test`).
- **tsconfig.json**: added `"types": ["jest"]` so `describe`/`it`/`expect` globals type-check in test files.

**Verification**

- `npm run lint`, `npm run typecheck`, `npm run test` — all pass individually.
- `npm run verify` — passes end-to-end.
- **Confirmed `verify` actually fails on a real failure** (the acceptance criterion, not just passing on the happy path): temporarily changed the test's expected text to a wrong string, ran `npm run verify` with output redirected to a file so the real exit code could be checked directly (piping through `tail` otherwise reports `tail`'s exit code, not `npm`'s) — got exit code `1` with a clear Jest failure report. Reverted the test text and reran — exit code `0`, all green.
- `npx expo-doctor` — 20/20 checks passed after the `@types/jest` version correction.
- `npx expo export --platform web` — still bundles and renders "WSD Snack Shack" correctly; none of the added tooling affects the running app.

**Notes / Deviations**

- `render()` from `@testing-library/react-native@14` returns a **Promise**, not a synchronous result — a change from older RNTL versions, presumably to support React 19's concurrent rendering. The baseline test (and any future component tests) must `await render(...)`; forgetting this produces a confusing `getByText is not a function` (destructuring off a Promise) or, if using the `screen` global without awaiting, a `` `render` function has not been called `` error, since `screen`'s internal state hasn't been set yet at that point. Worth remembering for every test written from EPIC 4 onward.

  **Update (Task 1.5, 2026-07-18): this was reverted.** See Task 1.5's entry below — `@testing-library/react-native@14`'s async `render()` turned out to be incompatible with `expo-router`'s bundled `renderRouter` test helper, so the package was downgraded to `13.3.3` (synchronous `render()`, matching what `expo-router@57` itself was tested against). The note above remains accurate as a historical record of what was true when Task 1.4 landed, but it no longer describes the currently installed version.

---

### Task 1.5 — Configure Expo Router and Navigation Shell

**Date:** 2026-07-18
**Status:** ✅ Complete

**Summary**

Built the initial navigation shell from `ARCHITECTURE.md` §7/§8, intentionally without any real authentication logic (that's EPIC 3):

- `app/index.tsx` — repurposed from Task 1.1's static "WSD Snack Shack" placeholder into the "initial loading/index route": now a bare `<Redirect href="/sign-in" />`, matching architecture §8.1 ("unauthenticated users must not access operational screens").
- `app/sign-in.tsx` — placeholder Sign In screen. Real sign-in UI/logic is explicitly Task 3.2's scope, so this only shows the WSD Snack Shack name, a "Sign In" heading, and two clearly-labeled **temporary** links ("Continue as Staff (temporary)" / "Continue as Administrator (temporary)") that exist solely so navigation is real and testable before authentication exists. Not business functionality — explicitly called out in-UI and in code as scaffolding to be replaced.
- `app/(staff)/_layout.tsx` + `app/(staff)/today.tsx` — the staff route group with the required placeholder Today screen, plus a temporary "Sign Out" link back to `/sign-in`.
- `app/(admin)/_layout.tsx` + `app/(admin)/index.tsx` — the administrator route group with the required placeholder Administration screen (singular, per this task's own requirement list — the full breakdown into bunks/requirements/inventory/users screens shown in `ARCHITECTURE.md`'s structure diagram belongs to their owning epics: 4, 5, 9, and 3/12 respectively), plus the same temporary "Sign Out" link.
- Root `app/_layout.tsx` unchanged (still just `SafeAreaProvider` + a headerless `Stack`); each group has its own headerless `Stack` layout, and screens render their own in-content heading text rather than relying on native header chrome — deliberately avoiding building header/title conventions here since that's `ScreenHeader`'s job in Task 1.6.

**Verification**

- `npm run lint`, `npm run typecheck` — pass.
- **Real navigation integration test** (`tests/navigation.test.tsx`), using `expo-router/testing-library`'s `renderRouter` against the actual `app/` directory (not a mock): confirms `/` redirects to sign-in, tapping the staff link from sign-in reaches Today, tapping the admin link reaches Administration, and tapping Today's sign-out link returns to sign-in. This is stronger evidence than isolated per-screen render tests would have been, since it exercises the real `<Link>`/`<Redirect>` components through actual route transitions rather than mocking them — decided not to also add separate isolated screen-render tests, since they'd just duplicate what these four tests already cover.
- `npx expo-doctor` — 20/20 checks passed.
- `npx expo export --platform web` — all 7 expected static routes exported (`/`, `/sign-in`, `/today` + `/(staff)/today`, `/(admin)`, `/_sitemap`, `/+not-found`); spot-checked the exported HTML for `/sign-in`, `/today`, and `/(admin)/index` and confirmed each contains its expected heading text.
- Dev server restarted and confirmed reachable again for manual click-through.

**Notes / Deviations**

- **Downgraded `@testing-library/react-native` from `14.0.1` to `13.3.3`.** `expo-router@57.0.7`'s bundled `renderRouter` test helper calls RNTL's `render()` synchronously and reads results immediately after — but v14's `render()` is `async` (see Task 1.4's note above), so `renderRouter` under v14 always hit `` `render` function has not been called ``, even though `expo-router`'s own `peerDependencies` claims `>=13.2.0` is supported. `expo-router`'s own `devDependencies` pins `@testing-library/react-native@^13.3.0` — i.e., 14.x is what it's declared compatible with but not actually what it was built/tested against. Downgrading to `13.3.3` (the latest 13.x, synchronous `render()`) fixed this cleanly; `react-test-renderer` stayed pinned to `19.2.3` to match `react`. This is a real upstream version-skew issue, not a mistake in how the helper was used — worth revisiting if a future `expo-router` patch updates its bundled testing-library to handle async `render()`.
- `app/(staff)/today.tsx` and `app/(admin)/index.tsx`'s "Sign Out" links are placeholders with no actual session to clear — there's no auth state yet. They exist purely to make the navigation shell round-trip testable; EPIC 3 replaces them with real sign-out behavior.

---

### Task 1.6 — Create the Base Theme and Shared UI Primitives

**Date:** 2026-07-18
**Status:** ✅ Complete

**Summary**

Established the design foundation in `src/theme/` and `src/components/`:

- **Theme** (`src/theme/`): `colors.ts` (background/border/text/primary/disabled plus a `status` sub-object — `pickedUp`, `specialSnack`, `allergy`, `medical`, `late`, `swim`, `inactive` — matching the status categories `ARCHITECTURE.md` §25.3 names, with a code comment flagging that consumers must always pair these with a label/icon, never color alone), `spacing.ts` (xs/sm/md/lg/xl scale), `radii.ts`, `typography.ts` (appName/title/body/caption, typed as `Record<string, TextStyle>` so `fontWeight` type-checks correctly against React Native's stricter `TextStyle` type), and `layout.ts` (`minTouchTarget: 44`, per §25.1/§26). Barrel-exported via `src/theme/index.ts`.
- **Shared components** (`src/components/`), all five required by the task:
  - `AppButton` — `primary`/`secondary` variants, `disabled` and `loading` states (loading swaps the label for an `ActivityIndicator` and blocks `onPress`), `minTouchTarget`-sized hit area, `accessibilityRole="button"` with a label defaulting to the visible text.
  - `ScreenHeader` — title + optional subtitle, `accessibilityRole="header"`.
  - `LoadingState` — centered spinner + label (defaults to "Loading…").
  - `ErrorState` — message text (never just a color) + optional `onRetry`-driven "Try Again" `AppButton`.
  - `EmptyState` — centered message text.
  - Barrel-exported via `src/components/index.ts`.
- **Refactored the three placeholder screens** (`sign-in.tsx`, `(staff)/today.tsx`, `(admin)/index.tsx`) from Task 1.5 to actually consume these primitives instead of their original ad-hoc inline styles — required by this task's own acceptance criterion ("no screen duplicates styling that belongs in a shared primitive"), not optional polish:
  - Headings now use `ScreenHeader`.
  - The "Continue as Staff/Administrator" and "Sign Out" temporary navigation actions switched from bare `<Link>` text to `AppButton` (`onPress={() => router.push(...)}` via `useRouter()`, rather than `Link`'s `asChild` pattern — simpler and avoids prop-forwarding ambiguity between `Link`'s injected navigation handler and `AppButton`'s own `onPress`).
  - Remaining inline styles (colors, spacing, font sizes) replaced with `theme` values.
- `LoadingState` and `ErrorState` are **not** wired into any current screen — there's no real async data-fetching yet (that starts in EPIC 2+), so forcing them in now would be speculative/fake usage. They're built and tested standalone, ready for EPIC 4 onward.

**Verification**

- `npm run verify` — lint, typecheck, and all tests pass.
- **17 tests total**, all real (no snapshot-only or placeholder tests): `AppButton` (renders + fires `onPress`; blocks `onPress` and reflects `accessibilityState.disabled` when disabled; shows busy state and blocks `onPress` while loading; accessible name resolution), `ScreenHeader` (title; optional subtitle present/absent), `LoadingState` (default and custom label), `ErrorState` (message; retry button absent without `onRetry`; retry button present and fires `onRetry` when provided), plus the existing `navigation.test.tsx` suite re-verified passing against the refactored screens (confirms swapping `Link` for `AppButton` didn't break the click-through flow).
- `npx expo-doctor` — 20/20 (one run hit a transient `fetch failed` against Expo's API for the config-schema check — unrelated to the project, retried clean).
- `npx expo export --platform web` — all 7 routes still export; spot-checked `sign-in.html`, `today.html`, and `(admin)/index.html` for their expected heading text.
- Dev server (already running from Task 1.5) picked up the changes via Metro fast refresh; confirmed still reachable.

**Notes / Deviations**

- **Phone vs. tablet layout verification was not done on real devices.** As with prior tasks, this environment has no simulators/physical devices attached. All layouts use flexible/percentage-based sizing (no hardcoded fixed widths beyond padding/gap values), which is the practical substitute available now; real responsive verification is deferred to manual device testing (Task 12.4) same as noted in Task 1.1's entry.
- Dark mode / theming beyond a single light palette was intentionally not built — nothing in `ARCHITECTURE.md` or the README requires it for the MVP, and adding it now would be unrequested scope.

---

### Task 1.7 — Configure Environment Management

**Date:** 2026-07-18
**Status:** ✅ Complete

**Summary**

- **Fixed a real gap in `.gitignore`**: it only excluded `.env*.local`, not a plain `.env` — meaning a developer's real local Supabase credentials in `.env` (the file Expo actually loads for local dev) would have been committable. Changed to `.env*` with a `!.env.example` negation, so every real env file is ignored except the tracked example.
- Added a one-line comment to `.env.example` (still names-only, no values, per this task's own rule) pointing at where to get real values and warning not to commit real values into it.
- **`src/lib/env.ts`**: `getEnv()` reads `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`, throwing a single clear error listing every missing variable by name plus a fix-it instruction ("copy .env.example to .env...") if any are absent. Not wired into any screen yet — nothing consumes it until `src/lib/supabase.ts` exists (Task 2.10); built and tested standalone, same pattern as `LoadingState`/`ErrorState` in Task 1.6.
- Development vs. production environment support (this task's other requirement) is **not custom-built** — Expo CLI already loads `.env`, `.env.local`, `.env.development`, `.env.production`, etc. automatically based on build profile for any `EXPO_PUBLIC_*`-prefixed variable. `getEnv()` just validates whatever Expo already loaded; there was nothing to build here beyond the validator + the `.gitignore` fix.

**Verification**

- `npm run verify` — 21 tests total now (4 new for `getEnv`): valid config returns both values; missing URL / missing anon key / missing both each throw an error naming the specific missing variable(s).
- **Hit and fixed a real, non-obvious bug while writing the "valid configuration" test**: `babel-preset-expo` ships an `inline-env-vars` Babel plugin (`node_modules/babel-preset-expo/build/plugins/inline-env-vars.js`) that statically rewrites any literal `process.env.EXPO_PUBLIC_*` member expression — in production it's inlined to a build-time literal, in development it's rewritten to reference a virtual `expo/virtual/env` module — in **both** cases decoupling the read from whatever `process.env` actually holds at runtime. My first draft used bracket access (`process.env[name]`) for the missing-variable check (which works, since a *variable* key isn't statically analyzable and the plugin skips it) but literal dot access (`process.env.EXPO_PUBLIC_SUPABASE_URL`) for the actual returned values — so the "both set" test got back `undefined` for both fields even though `process.env` genuinely had the values, while the "missing" tests happened to pass because they only exercised the (correctly dynamic) bracket-access check. Fixed by reading everything through the same bracket-access pattern into a local object first, then returning from that local object (plain property access on a non-`process.env` object isn't touched by the plugin at all). Worth remembering for any future code that reads `EXPO_PUBLIC_*` vars dynamically rather than as one-time static config.
- Manually confirmed the `.gitignore` fix: created a throwaway `.env` with fake values, confirmed `git status`/`git check-ignore` treats it as ignored, confirmed `git check-ignore` reports `.env.example` as *not* ignored, then deleted the throwaway file (never committed).
- `npx expo-doctor` — 20/20.
- `npx expo export --platform web` — still builds; nothing consumes `env.ts` yet so this was just a regression check.

**Notes / Deviations**

- No `.env` file was created for this machine's actual Supabase credentials — there's no real Supabase project yet (that's Task 2.1). `.env.example` plus the now-correct `.gitignore` is the complete, correct state until then.

---

### Task 1.8 — Verify Architectural Compliance of the Foundation

**Date:** 2026-07-18
**Status:** ✅ Complete — **EPIC 1 (Project Foundation) is complete.**

**Summary**

Audit of the completed EPIC 1 foundation against `ARCHITECTURE.md`, item by item from this task's own requirements list:

| Requirement | Finding |
|---|---|
| One React Native Expo codebase | ✅ Single `wsd-snack-shack` Expo + Expo Router project targeting iPhone/iPad/Android from one codebase; no platform-forked business logic anywhere. |
| TypeScript enabled | ✅ `tsconfig.json` has `"strict": true`; every source file is `.ts`/`.tsx`; `npm run typecheck` passes clean. |
| Expo Router structure | ✅ Route files live under root `app/` (not `src/app/`, matching §7 exactly): `_layout.tsx`, `index.tsx` (redirect), `sign-in.tsx`, `(staff)/` and `(admin)/` route groups each with their own layout. |
| Feature-based organization | ✅ `src/features/` has all nine required folders (`authentication`, `dashboard`, `bunks`, `special-requirements`, `snack-days`, `pickups`, `inventory`, `history`, `administration`) ready for their owning epics; currently empty (`.gitkeep` only) because no feature work has started yet — expected, not a gap. |
| No custom backend introduced | ✅ No server/API code anywhere in the repo. `supabase/{migrations,tests}/` exist only as version-controlled config placeholders for Supabase itself (Task 2.x), not a custom backend. |
| No global state library introduced without need | ✅ `package.json` dependencies checked directly — no Redux/Zustand/MobX/Recoil/Jotai/etc. Only React built-ins so far; TanStack Query arrives with real server state in EPIC 2+, per architecture. |
| No service-role key exposure | ✅ `.env.example` lists only the two public `EXPO_PUBLIC_*` vars; `src/lib/env.ts` reads only those two. Grepped the whole repo for `service_role`, `SERVICE_ROLE`, `SUPABASE_SERVICE`, and JWT-shaped strings (`eyJhbGciOi...`) — no matches. Confirmed via `git ls-files` that no `.env` file is tracked, only `.env.example`. |
| Test and quality tooling operational | ✅ `npm run verify` (lint + typecheck + test) passes clean: 21 tests across 7 suites. `npx expo-doctor` reports 20/20. |
| Documentation present | ✅ `README-MVP.md`, `ARCHITECTURE.md`, `IMPLEMENTATION-PLAN-MVP.md`, `IMPLEMENTATION-LOG-MVP.md` all present at root with consistent naming (Task 1.2). |

**Approved variances carried forward from earlier EPIC 1 tasks** (none are architecture violations — all previously documented in their originating task's log entry, consolidated here for the EPIC sign-off):

- Physical iPhone/iPad/Android device and simulator testing has not been possible in this development environment (no devices/simulators attached) — substituted with `expo export --platform web` throughout (Task 1.1 onward). Real device testing remains required no later than Task 12.4.
- The pre-existing stray root-level `components/`/`constants/`/`services/`/`types/` directories (present before `ARCHITECTURE.md` existed) were removed in Task 1.3 once the real `src/`-based structure landed; `src/constants/` itself was intentionally never created, since Task 1.3's own folder list omits it (matching §7's structure diagram, even though §6.3's prose list includes it — a minor internal inconsistency in the architecture doc resolved by following the more specific, authoritative structure diagram).
- `@testing-library/react-native` is pinned to `13.3.3` rather than the newest `14.x`, because `expo-router@57`'s bundled test helper (`renderRouter`) isn't compatible with v14's async `render()` (Task 1.5's log entry has the full root-cause analysis). This is a test-tooling version pin, not an application dependency or architecture decision.
- `lint` runs `eslint .` directly rather than `expo lint`, because `expo lint` errors on `src/`'s still-partially-empty directories (Task 1.4). Cosmetic script difference; same underlying ESLint config either way.

**Verification**

- `npm run verify` — 21/21 tests pass, lint and typecheck clean.
- `npx expo-doctor` — 20/20.
- Dev server started (`npx expo start`) and confirmed reachable.
- **Phone- and tablet-sized layout verification — upgraded from prior tasks' code-review-only approach to actual rendered evidence**: used Playwright (installed ad hoc via `npx`, run from the OS temp scratchpad directory — deliberately *not* added to this project's `package.json`/`package-lock.json`, confirmed via `git status` and grepping both files for "playwright" with zero matches, so as not to violate this very task's "no unnecessary dependency introduced" check) to load all three real screens (`/sign-in`, `/(staff)/today`, `/(admin)`) against the running dev server at an iPhone-ish viewport (390×844) and an iPad-ish viewport (820×1180). Confirmed programmatically that `document.documentElement.scrollWidth` never exceeds `clientWidth` at either size on any screen (no horizontal overflow), and visually confirmed via screenshots that all three screens render correctly, legibly, and with properly sized buttons at both sizes.

**Sign-off**

EPIC 1 — Project Foundation is complete. All eight tasks (1.1–1.8) are done, reviewed, and approved. The foundation conforms to `ARCHITECTURE.md` with no unapproved deviations. Proceeding to **EPIC 2 — Supabase Foundation and Core Data Model**, starting with **Task 2.1 — Create and Configure the Development Supabase Project**.
