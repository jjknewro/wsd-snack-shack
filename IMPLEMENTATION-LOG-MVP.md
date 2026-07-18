# WSD Snack Shack Mobile Application — Implementation Log (MVP)

## Project

wsd-snack-shack

## Date Created

2026-07-18

## Current Epic

EPIC 1 — Project Foundation

## Current Task

Task 1.7 — Configure Environment Management

---

## Completed Task History

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
