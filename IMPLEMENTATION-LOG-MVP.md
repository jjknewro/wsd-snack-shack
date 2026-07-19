# WSD Snack Shack Mobile Application — Implementation Log (MVP)

## Project

wsd-snack-shack

## Date Created

2026-07-18

## Current Epic

EPIC 1 — Project Foundation (React + Vite + TypeScript, restarted under the pivoted architecture — see "Architecture Pivot" below)

## Current Task

Task 1.5 — Configure Routing and Application Shell

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
