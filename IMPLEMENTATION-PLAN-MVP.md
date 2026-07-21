# IMPLEMENTATION-PLAN-MVP.md

# WSD Snack Shack MVP Implementation Plan

## Status

Active MVP Plan

## Primary Objective

Create the fastest, simplest, and most reliable way for a single Snack Shack operator to distribute snacks, manage special dietary requirements, record bunk pickups, and maintain accurate operational records with as little effort as possible.

The MVP will be delivered as a mobile-first Progressive Web Application that works on iPhone, iPad, Android, and desktop browsers.

---

# Approved MVP Architecture

**Revised 2026-07-19 — see `ARCHITECTURE.md`'s "Architecture Revision Note" for the full history.** This is the second revision: React Native/Expo/Supabase → React/Vite/Google Sheets+Apps Script → this (React/Vite/JSON files, no backend).

```text
React + Vite + TypeScript PWA
            ↓
   Bundled JSON files
(src/data/masterRoster.json,
 src/data/specialRequirements.json)
```

No backend. No network request is made to read operational data.

## Technology Decisions

- Frontend: React, Vite, TypeScript
- Routing: React Router
- Forms and validation: React Hook Form with shared validation utilities
- Backend: none
- Source of truth: bundled JSON files (today's pickup status is in-memory only — see `ARCHITECTURE.md`, "Persistence — Current State")
- Testing: Vitest, React Testing Library
- Deployment: static web hosting only (no backend to deploy)

## Explicitly Excluded from the MVP

- Expo
- React Native
- Supabase
- **Google Sheets / Google Apps Script** (excluded as of this revision — see above)
- **TanStack Query** (nothing to fetch over a network)
- Native mobile builds
- App Store or Google Play deployment
- Multi-user account management
- Role-based permissions
- Real-time collaboration
- **Multi-device / multi-browser sync** (a direct consequence of local, file/in-memory-only persistence)
- Offline synchronization (moot — the app has no online dependency)
- Push notifications
- Inventory forecasting

---

# Global Implementation Rules

1. The bundled JSON files (`src/data/*.json`) are the operational source of truth for roster and special-requirement data.
2. UI components must never import `src/data/*.json` directly — only the repository layer does (see `ARCHITECTURE.md`'s Repository Pattern; tracked as a known gap for `MasterRoster.tsx` until EPIC 4, Task 4.4).
3. UI components must not contain data-file-specific logic.
4. Business services must communicate through a repository interface.
5. Historical pickup records (once they exist) must be append-only.
6. The application must be optimized for a single operator using a phone or tablet.
7. Every task must include relevant tests before it is marked complete.
8. Completed work must not be rewritten unless validation proves that it is incompatible with the approved architecture.

---

# EPIC 1 — Project Foundation

## Status

✅ Complete

## Objective

Establish a stable React, Vite, and TypeScript foundation for the mobile-first Snack Shack PWA.

## Architecture Review Note

Expo and React Native were evaluated and rejected because they did not match the validated project software and development environment. The approved foundation is React, Vite, and TypeScript.

Any earlier EPIC 1 wording that referenced Expo, React Native, or Expo Router must be treated as documentation superseded by this plan.

**Correction (see `IMPLEMENTATION-LOG-MVP.md` for the full pivot record):** this EPIC was briefly marked complete by mistake before any of Tasks 1.1–1.7 had actually been implemented. That has since been resolved — all seven tasks were rebuilt from scratch and genuinely completed and verified (React + Vite + TypeScript project, `src/` structure, oxlint + Prettier, Vitest + React Testing Library, React Router with an application shell, mobile-first design tokens and shared components, and this documentation baseline). The prior EPIC 1 that was completed under the now-retired Expo/React Native/Supabase architecture (also Tasks 1.1–1.8) remains in git history but none of that code was reused.

---

### Task 1.1 — Create React, Vite, and TypeScript Project

**Status:** ✅ Complete

Create the frontend project using React, Vite, and TypeScript.

Requirements:

- Application starts locally without errors.
- TypeScript strict mode is enabled.
- Development and production builds succeed.
- Expo and React Native dependencies are not used.

Acceptance criteria:

- `npm run dev` starts the application.
- `npm run build` completes successfully.
- No Expo-specific configuration exists.

---

### Task 1.2 — Establish Project Structure

**Status:** ✅ Complete

Create a maintainable project structure.

Recommended structure:

```text
src/
├── api/
├── components/
├── features/
├── hooks/
├── pages/
├── repositories/
├── services/
├── types/
├── utils/
└── tests/
```

Acceptance criteria:

- UI, services, repositories, and shared types are separated.
- No direct Google Sheets logic exists in UI components.

---

### Task 1.3 — Configure Code Quality Tooling

**Status:** ✅ Complete

Configure TypeScript, linting, formatting, and consistent scripts.

Acceptance criteria:

- Type checking passes.
- Linting passes.
- Formatting rules are documented.

---

### Task 1.4 — Configure Test Framework

**Status:** ✅ Complete

Configure Vitest and React Testing Library.

Acceptance criteria:

- Unit tests can run locally.
- Component tests can render React components.
- A sample test passes.

---

### Task 1.5 — Configure Routing and Application Shell

**Status:** ✅ Complete

Implement the application shell using React Router.

Initial routes:

- `/` — Today
- `/roster` — Master Roster
- `/requirements` — Special Requirements
- `/history` — Pickup History
- `/settings` — Settings

**Amendment (2026-07-19):** `/roster` (Master Roster) was added after this task's initial approval, at the user's request — a read-only view of bunks/campers/counselors. Consistent with the already-planned `roster` GET action in `ARCHITECTURE.md`'s API section; this route just wasn't included in the original four. See `IMPLEMENTATION-LOG-MVP.md` for the follow-up entry.

Acceptance criteria:

- Navigation works on desktop and mobile widths.
- Unknown routes display a controlled not-found state.
- Expo Router is not used.

---

### Task 1.6 — Establish Mobile-First Design Foundation

**Status:** ✅ Complete

Create the initial responsive layout, spacing rules, form controls, buttons, and status styles.

Acceptance criteria:

- The application is usable at widths down to 320 pixels.
- Primary actions are easy to tap on a phone.
- The layout works on iPhone, iPad, Android, and desktop browser sizes.

---

### Task 1.7 — Create Project Documentation Baseline

**Status:** ✅ Complete

Create and maintain:

- `README-MVP.md`
- `ARCHITECTURE.md`
- `IMPLEMENTATION-PLAN-MVP.md`
- `IMPLEMENTATION-LOG-MVP.md`

Acceptance criteria:

- Documentation reflects React, Vite, Google Apps Script, and Google Sheets.
- Expo and Supabase are not presented as active MVP technologies.

---

# EPIC 2 — Data Schema and Contract

## Status

⬜ Not Started

## Objective

Establish stable, well-documented JSON data shapes that support the application without relying on the original spreadsheet's fragile cell positions or a live workbook connection.

## Revision Note (2026-07-19)

This epic originally formalized the Google Sheets workbook as the live data source (Task 2.1), with the rest of the epic building toward an Apps Script-backed schema. The architecture has since dropped Google Sheets/Apps Script entirely (see `ARCHITECTURE.md`) in favor of bundled JSON files. Task 2.1's documentation remains valid and valuable — it directly informed the JSON shapes below — but is now historical context, not a live data contract. Tasks 2.3–2.7 below have been reframed for JSON files; Task 2.3 in particular is no longer needed at all.

Current data files:

- `src/data/masterRoster.json`
- `src/data/specialRequirements.json`

Planned (not yet defined — see Task 2.2):

- Pickup history data shape
- Settings data shape

---

### Task 2.1 — Document the Existing Workbook Structure

**Status:** ✅ Complete

Document every worksheet, column, data type, and business meaning currently used by the workbook.

Requirements:

- Record the current column names and expected values.
- Identify blank rows, merged cells, formulas, checkboxes, and formatting dependencies.
- Identify data that is authoritative versus derived.
- Identify any columns whose meaning is unclear.

Deliverable:

- A workbook schema section in `ARCHITECTURE.md` or a dedicated `WORKBOOK-SCHEMA.md`.

Acceptance criteria:

- Every current worksheet and column is documented.
- No application development proceeds based on undocumented cell positions.

**Historical note:** this task's deliverable (`WORKBOOK-SCHEMA.md`) documents the real Google Sheets workbook, which the application no longer reads. It remains in the repository because it directly informed the JSON data shapes in `src/types/roster.ts` and is useful context for understanding real-world data quality issues (see its "Data-quality issues" notes and `open-questions.md`).

---

### Task 2.2 — Define Stable Application Data Models

**Status:** ⬜ Not Started (partially prototyped — see note)

Define TypeScript data models for the application's JSON data.

Required models (confirmed so far):

- `MasterRosterEntry` (`bunk`, `counselors`, optional `campers`)
- `SpecialRequirementEntry` (`bunk`, `requirement`, `quantity`, optional `notes`)

Models not yet needed / not yet defined:

- Pickup status / pickup record (currently in-memory only — see `ARCHITECTURE.md` "Persistence — Current State")
- Pickup history record
- App settings

Acceptance criteria:

- Models define required and optional fields accurately (no more, no less than the real data needs).
- Models are shared across pages, services, and tests via a single source (`src/types/`).
- No model assumes a spreadsheet row number or permanent ID that the JSON files don't actually have.

**Note:** `MasterRosterEntry` and `SpecialRequirementEntry` already exist in `src/types/roster.ts`, built ahead of this formal task as part of an ad hoc mock-data prototype (see `IMPLEMENTATION-LOG-MVP.md`). This task is not being marked complete yet since the remaining models (pickup status/history, settings) haven't been defined — those will happen when their owning epics (6, 8, 10) are reached, following the same "confirm the shape before building on it" discipline, not speculatively now.

---

### Task 2.3 — Add Permanent IDs to Master Data

**Status:** Not Applicable — superseded by the architecture revision

This task existed to solve a Google Sheets-specific problem: spreadsheet row numbers are not stable identifiers (rows can be sorted or moved), so a separate permanent ID was needed. JSON files don't have this problem — `bunk` is already a stable, natural key that doesn't shift when the file is edited. No separate ID is needed under the current architecture.

Kept here (rather than deleted) for historical traceability, per this plan's own rule that completed/superseded work should be recorded, not erased.

---

### Task 2.4 — Define Pickup History Data Shape

**Status:** ⬜ Not Started

Define the JSON shape for completed pickups, once EPIC 6/8 (Pickup Workflow, History and Daily Close) are reached. Not started now — speculating on this shape before the pickup workflow itself is designed risks getting it wrong.

Likely fields (subject to change when this task is actually picked up): `bunk`, `snackDate`, `expectedCount`, `actualCount`, `specialRequirementSummary`, `notes`, `pickupTime`.

Acceptance criteria (unchanged in spirit from the original task):

- Completed pickups can be stored without overwriting prior days.
- Historical records are append-only.
- Each historical record is identifiable (by `bunk` + `snackDate`, or another key decided when this task is picked up).

---

### Task 2.5 — Define Settings Data Shape

**Status:** ⬜ Not Started

Define a simple key/value settings shape for configuration that shouldn't be hard-coded, once a real need for configurable settings appears (see EPIC 10). No API token or backend-access setting is needed under the current architecture — that entire category from the original task no longer applies.

Acceptance criteria:

- Settings can be read by the application.
- Missing required settings produce a controlled error, not a silent default that masks a real problem.

---

### Task 2.6 — Define Data Validation Rules

**Status:** ✅ Complete

Create validation rules for the JSON data files' structure and data quality.

Validation must detect:

- Missing required fields
- Invalid `requirement` values (outside the seven defined types)
- Invalid numeric values (e.g. negative `quantity` or `campers`)
- A `specialRequirements.json` entry whose `bunk` doesn't exist in `masterRoster.json`
- Duplicate bunks in `masterRoster.json`

Acceptance criteria:

- Validation results identify the file, record, and problem clearly.
- Invalid data is caught at load time with a clear error, not a silent partial render.

**Note:** implemented as pure functions (`src/services/dataValidation.ts`) that return a list of structured errors rather than throwing — this is what makes them usable both for a fail-fast load-time check and for a future diagnostics display (EPIC 10, Task 10.3) without duplicating logic. **Not yet wired into any live data-loading path** — `MasterRoster.tsx` still imports the JSON files directly and doesn't call this validator. Wiring validation into the actual load path belongs to EPIC 4, Task 4.4 (the repository layer), once that layer exists — matching this plan's existing pattern of not building ahead of the epic that owns an integration point (see Task 2.2's note, and EPIC 4's "known gap").

---

### Task 2.7 — Build Data Schema Tests

**Status:** ✅ Complete

Create automated tests using representative JSON fixtures (valid and deliberately invalid).

Acceptance criteria:

- Valid fixtures pass validation.
- Fixtures with missing fields, invalid `requirement` values, or orphaned `bunk` references fail predictably, with a clear message identifying what's wrong.
- Tests use fixture data, never the real mock data files, so fixture edits for edge-case testing don't disturb the app's actual mock data.

**Note:** implemented together with Task 2.6 in `src/tests/dataValidation.test.ts`, since the fixture-based tests needed to prove the validation rules work are the same tests this task requires — see that task's entry and `IMPLEMENTATION-LOG-MVP.md` for the combined implementation record.

---

### Task 2.8 — Add Derived Special-Requirements Count to Master Roster

**Status:** ✅ Complete

Added at the user's request after reviewing the Master Roster mock-data prototype (see EPIC 2's revision note and `IMPLEMENTATION-LOG-MVP.md`). The Master Roster screen must show, per bunk, how many special-requirement **records** exist for that bunk — a value derived by joining `masterRoster.json` and `specialRequirements.json` on `bunk`, not stored in either file directly.

Requirements:

- The count is the number of matching entries in `specialRequirements.json` for that bunk (record count), **not** the sum of their `quantity` values — e.g. bunk `K3`'s 3 entries (`No Dairy` × 2, `Cholov Yisroel` × 1, `Gluten Free` × 1) count as **3**, not 4.
- Bunks with no special-requirement entries show `0`, not a blank cell — this is a real, meaningful count, not an optional field.
- Displayed as a new column on the Master Roster table, alongside the existing click-to-popup interaction from the prior ad hoc work.

Acceptance criteria:

- The displayed count exactly matches the number of `specialRequirements.json` entries for that bunk.
- Recomputes correctly if the underlying data changes (verified via test, not just visual inspection).

---

# EPIC 3 — Google Apps Script Backend Foundation

## Status

**Not Applicable — removed by the architecture revision (2026-07-19)**

## Objective (original, no longer pursued)

Create a controlled backend API that is the only component permitted to read from or write to the Snack Shack workbook.

## Why this epic no longer applies

`ARCHITECTURE.md` was revised to remove the Google Sheets/Apps Script backend entirely — the application now reads bundled JSON files directly, with no server of any kind (see `ARCHITECTURE.md`'s "Architecture Revision Note"). All eight of this epic's original tasks (Apps Script project setup, API execution contract, routing, workbook access layer, access protection, write locking, backend logging, Apps Script tests) depended on a backend that no longer exists.

This epic is kept in the plan, marked Not Applicable, rather than deleted — per this plan's own principle that completed or superseded work should be recorded, not erased (see Task 2.3 for the same treatment applied to a single task). Nothing here was ever built; no work is lost by this change. Full original task text remains available in git history (see the commit that introduced this revision) if ever needed for reference.

---

# EPIC 4 — Data Repository Integration

## Status

✅ Complete

## Objective

Route all JSON data access through a repository abstraction, so pages and components never read `src/data/*.json` directly. Originally scoped as "connect the React app to the Apps Script backend" — rewritten since there's no backend to connect to (see `ARCHITECTURE.md`'s "Architecture Revision Note").

## Known gap (as of this revision) — Closed by Task 4.4

`MasterRoster.tsx` used to import `src/data/masterRoster.json` and `specialRequirements.json` **directly**, bypassing the repository pattern entirely — a real, acknowledged violation of `ARCHITECTURE.md`'s "UI never imports the JSON data files directly" rule. This happened because that page was built as an ad hoc mock-data prototype (see `IMPLEMENTATION-LOG-MVP.md`) before this epic — and therefore the repository layer — existed. **Task 4.4 (2026-07-20) closed this gap**: `MasterRoster.tsx` now reads exclusively through `src/repositories/jsonSnackRepository.ts`.

---

### Task 4.1 — Create Environment Configuration

**Status:** Not Applicable — superseded by the architecture revision

Existed to configure the Apps Script URL and access credentials. No backend, no URL, no credentials exist under the current architecture. Kept here, marked Not Applicable, per this plan's own practice of recording superseded work rather than deleting it.

---

### Task 4.2 — Implement API Client

**Status:** Not Applicable — superseded by the architecture revision

Existed to provide a shared HTTP client for Apps Script requests. There are no network requests to make.

---

### Task 4.3 — Define Snack Repository Interface

**Status:** ✅ Complete

Define a repository interface used by business services and pages, matching `ARCHITECTURE.md`'s Repository Pattern section.

Required methods (revised from the original Apps Script-oriented list):

```text
getRoster()
getSpecialRequirementsForBunk(bunk)
```

Not yet included (deferred until their owning epics define the underlying data shape — see EPIC 2, Task 2.2's note): `getToday()`/pickup-status methods, `getHistory()`, settings methods. Adding them speculatively now, ahead of the workflows that need them, risks guessing the interface wrong.

Acceptance criteria:

- Services and pages depend on the interface, not on `src/data/*.json` file paths.
- A mock/fixture-backed repository can be used in tests without touching the real mock data files.

**Note:** `src/repositories/snackRepository.ts` defines the `SnackRepository` type with exactly the two methods above. This task is the interface only — **no page depends on it yet**; `MasterRoster.tsx` still imports `src/data/*.json` directly, so the first acceptance criterion above is not yet true in practice. Closing that gap (making pages actually depend on this interface instead of the file paths) is Task 4.4's explicit job, not this one's — matching the plan's established practice of defining a contract in one task and wiring it up in the next (see Task 2.2 vs. its consumers, Task 2.6 vs. Task 4.4). The second acceptance criterion (fixture-backed repository usable in tests) is demonstrated now, in this task's own tests.

---

### Task 4.4 — Implement JSON Data Repository

**Status:** ✅ Complete

Implement the repository interface from Task 4.3, reading from `src/data/masterRoster.json` and `src/data/specialRequirements.json`.

Requirements:

- **Update `MasterRoster.tsx` to use the repository instead of importing the JSON files directly** — this task is what actually closes the "known gap" noted above.
- Malformed or missing data produces a controlled error (see `ARCHITECTURE.md`'s Error Handling section), not a silent empty render or an uncaught exception.

Acceptance criteria:

- No page or component imports `src/data/*.json` directly — only the repository does.
- Invalid data is rejected before reaching the UI, with a clear error.

**Note:** `src/repositories/jsonSnackRepository.ts` implements `SnackRepository` (Task 4.3) via two layers: `buildSnackRepository(masterRoster, specialRequirements)` — a pure function taking `unknown[]` for both arguments, running Task 2.6's `validateData` and throwing a `DataValidationError` (carrying the full structured error list plus a readable `.message`) if invalid — and `createJsonSnackRepository()`, a thin wrapper that calls it with the real bundled JSON imports. `MasterRoster.tsx` now calls `createJsonSnackRepository()` once (memoized) and renders the existing `ErrorState` component if it throws, instead of the table — the "known gap" from EPIC 4's objective is closed; confirmed via `grep` that no `src/pages/*` or `src/components/*` file imports `src/data/*.json`. `ARCHITECTURE.md`'s `{success, data}` / `{success: false, message, errorCode}` shape was not used verbatim here: that shape fits per-call, potentially-async business operations (e.g. completing a pickup in EPIC 6); this repository is a synchronous, load-once, all-or-nothing validity gate over static bundled data, so a thrown, typed error caught once at the page boundary is the more natural fit while still meeting the same underlying goal (clear error, no raw stack trace, no silent empty render).

---

### Task 4.5 — Configure TanStack Query

**Status:** Not Applicable — superseded by the architecture revision

Existed to manage caching/invalidation for network-fetched data. JSON file reads are synchronous and local; there is nothing to cache or invalidate over a network.

---

### Task 4.6 — Build Data Diagnostics Screen

**Status:** ✅ Complete

Create a simple diagnostics view accessible from Settings, reframed from "connection diagnostics" (there's no connection) to data-load diagnostics.

Display:

- Frontend version
- Whether the roster/special-requirements data loaded and parsed successfully
- Schema validation result (once Task 2.6/2.7 exist)
- Record counts (bunks loaded, special requirement entries loaded)

Acceptance criteria:

- The operator can tell whether the app's data loaded correctly, distinct from any other kind of problem.
- No secrets are displayed (moot today, but keeping the principle for whenever settings/config exist).

**Note:** built as a presentational `src/components/DataDiagnostics.tsx`, rendered directly on the existing `Settings` page (Task 10.1 will build out the rest of that screen later — this is the diagnostics piece it's already expected to reuse, per that task's own text). Diagnostics data comes from a new `getDataLoadDiagnostics()` in `jsonSnackRepository.ts` — deliberately **not** the throw-based `createJsonSnackRepository()`/`buildSnackRepository()` used elsewhere: a diagnostics screen's whole purpose is to show a failure calmly, not propagate an exception, so it returns a `{ loaded: true, rosterCount, specialRequirementCount } | { loaded: false, error: DataValidationError }` discriminated union instead. Frontend version is read directly from `package.json`'s `version` field (currently `0.0.0`, the untouched Vite scaffold default — real, not fabricated). No secrets are displayed or exist to display.

---

### Task 4.7 — Build Repository Tests

**Status:** ✅ Complete — **EPIC 4 (Data Repository Integration) is complete.**

Reframed from "Repository and API Client Tests" — there is no API client to test.

Acceptance criteria:

- Success, malformed-data, and missing-data cases are tested against the repository.
- Component tests use a mock/fixture-backed repository, never the real `src/data/*.json` mock data, so tests don't silently depend on — or accidentally validate against — data that's meant for local development display.

**Note:** the repository-layer half of this (success / malformed / missing-data cases against `buildSnackRepository`, `createJsonSnackRepository`, `getDataLoadDiagnostics`) was already covered by Tasks 4.4 and 4.6's own tests. What this task actually added: `MasterRoster.tsx` gained an optional `createRepository` prop (defaulting to `createJsonSnackRepository`), and `MasterRoster.test.tsx`/`MasterRoster.errorState.test.tsx` were rewritten to inject a fixture-backed repository instead of exercising the real `src/data/*.json` files — closing the gap this acceptance criterion specifically calls out (those tests previously asserted real-data values like `K3` having exactly 3 requirements, which is real-data coupling, not fixture testing). `Settings.tsx` was deliberately left as-is: its own test doesn't assert any real-data-specific values (no hardcoded counts), and `getDataLoadDiagnostics()` already accepts injectable data at the function level for its own dedicated tests — adding component-level DI there too was judged unnecessary duplication of the same fix rather than a genuine gap.

---

# EPIC 5 — Today Screen and Snack Day Initialization

## Status

✅ Complete

## Objective

Create the primary mobile screen that replaces the `snack shack today` paper or spreadsheet workflow.

---

### Task 5.1 — Define Today Screen UX

**Status:** ✅ Complete

Design the screen for fast one-handed or tablet use.

Each bunk row or card must show (revised to match the confirmed data model in `ARCHITECTURE.md` — no `division` field exists in the current roster data):

- bunk code
- camper count (optional — may be blank)
- pickup status
- special requirement indicator
- pickup time when completed (once pickup persistence beyond in-memory state is decided — see `ARCHITECTURE.md`, "Persistence — Current State")

Acceptance criteria:

- The most important information is visible without opening each record.
- Completed and pending bunks are easy to distinguish without relying only on color.

**Note:** implemented as a presentational `src/components/TodayBunkRow.tsx` (one table row per bunk — Status, Bunk, # of Campers, Special Requirements, Pickup Time, all visible with no click needed) rendered by a rewritten `src/pages/Today.tsx`, which now reads through the repository (same `createRepository`-injection pattern as `MasterRoster.tsx`, Task 4.7) instead of the old `useWorkbookSnapshot` real-workbook-snapshot hook — that hook and its temporary viewer role are retired from this route (its own code comment already called it temporary, superseded by EPIC 4's repository; it remains in place for `Requirements.tsx` until EPIC 7 replaces that page too, so nothing there was touched). **Deliberately read-only and honest about current state**: every bunk shows `Pending` because no completion interaction exists yet — that's EPIC 6's job (Task 6.1 onward), out of scope for a UX-definition task. The pending/completed visual distinction itself (StatusBadge, always paired with a real text label, never color alone) is proven directly via component tests passing both states as props, not by fabricating a completed bunk in the live app. Pickup time is only ever rendered for a `completed` row — for `pending`, it's always a dash, matching that this data doesn't exist yet under the current in-memory-only persistence model.

---

### Task 5.2 — Implement Snack Day Initialization Service

**Status:** ✅ Complete

Initialize the active snack day from the Master Roster.

Requirements:

- Create one active pickup record per eligible bunk.
- Copy expected counts and relevant notes as a daily snapshot.
- Prevent duplicate initialization for the same date.
- Preserve completed historical days.

Acceptance criteria:

- A new day can be initialized from current roster data.
- Repeating initialization does not duplicate rows.

**Note:** implemented as a pure function, `initializeSnackDay(repository, date, existingDays)` in `src/services/snackDayInitialization.ts`, plus new minimal types (`SnackDay`, `SnackDayBunkRecord`, `PickupStatus`) in `src/types/snackDay.ts` — kept separate from `src/types/roster.ts` since these are in-memory, session-scoped concepts, not data-file-backed models. "Eligible bunk" = every bunk currently in the roster (there's no eligibility flag in the data model to filter on). "Relevant notes" is implemented as a snapshotted `specialRequirementCount` per bunk (not the roster's own notes field, which doesn't exist) — read via the repository at initialization time, not recomputed later, specifically so a future seed-data edit (removing a special requirement, already flagged by the user as a planned future screen — see `ARCHITECTURE.md`'s "Future: Editing Seed Data") can't retroactively change an already-active day's snapshot. Duplicate-prevention and historical-day preservation are both handled by the same idempotent, non-mutating design: initializing an already-present date returns the input array by reference, unchanged; initializing a new date always appends rather than replacing. **Deliberately not wired into `Today.tsx` yet** — introducing "not initialized"/"active day" state into the actual screen is explicitly Task 5.3's job ("Build Today Screen Data Loading"), matching this plan's established define-then-wire task boundary (see Task 4.3 vs. 4.4, Task 2.6 vs. its wiring).

---

### Task 5.3 — Build Today Screen Data Loading

**Status:** ✅ Complete

Load and display the active snack day.

Required states:

- loading
- empty or not initialized
- active day
- closed day
- data load error (malformed or missing JSON — see `ARCHITECTURE.md`'s Error Handling section)

Acceptance criteria:

- Each state provides a clear next action.
- The screen never remains blank after an error.

**Note:** `Today.tsx` now renders four of the five states: **error** (`ErrorState`, same as `MasterRoster.tsx`), **not-initialized** (`EmptyState` + a "Start Today" button — the clear next action), **active** (the bunk table via `initializeSnackDay`, Task 5.2), and **closed** (read-only, a "Day Closed" `StatusBadge` instead of the button, same table). **"Loading" is deliberately not implemented as a rendered branch** — repository creation reads bundled JSON synchronously (no network boundary), so there is no real intermediate frame to show a spinner for; adding one would be dead code for a state nothing can ever produce, which the project's own guidance says to avoid. This is documented in code and here rather than silently skipped.

**Real correctness fix surfaced by this task**: `ARCHITECTURE.md`'s "Persistence — Current State" says pickup status resets "every time the page is reloaded" (not on mere navigation) — but a plain `useState` local to `Today.tsx` would have been cleared by React Router unmounting the page on every navigation away, which is stricter than the architecture promises. Fixed by lifting the state into a new `SnackDayProvider` (`src/components/SnackDayProvider.tsx` + `src/hooks/useSnackDays.ts`, split across two files to satisfy the `react/only-export-components` lint rule, same as Task 2.8's precedent) mounted once in `AppShell.tsx` around `<Outlet />` — `AppShell` itself never unmounts across in-app navigation, only on an actual page reload, exactly matching the documented behavior. Verified live with Playwright: initialized Today, navigated to Master Roster, navigated back — the day was still active, no re-initialization needed.

`SnackDay` (Task 5.2) gained a `dayStatus: 'active' | 'closed'` field to support this task's required "closed" state — a minimal, additive extension, not a rewrite, since Task 5.2 didn't yet have any consumer needing to distinguish them.

---

### Task 5.4 — Add Search and Filtering

**Status:** ✅ Complete

Allow the operator to find bunks quickly.

Filters:

- all
- pending
- completed
- special requirements
- division

Search:

- bunk name
- division
- counselor name where available

Acceptance criteria:

- Filters work on phone-sized screens.
- Clearing filters restores the full active list.

**Note:** implemented against what the data model actually has — `division` is dropped from both filters and search, consistent with the correction already made in Task 5.1 (no `division` field exists in the current roster data; user confirmed this scope before implementation started). Status filters are **All / Pending / Completed / Special Requirements** (as toggle buttons — `aria-pressed`, plus each already has a distinct text label, so the active filter is never conveyed by color alone); search matches bunk name or counselor name, case-insensitively, trimmed. Pure filtering logic lives in `src/services/todayFilters.ts` (`filterTodayBunks`), independently tested; the controls are a presentational `src/components/TodayFilters.tsx`. `SnackDayBunkRecord` (Task 5.2) gained a `counselors: string` field, snapshotted at initialization the same way `expectedCount` and `specialRequirementCount` already were — search needed it, and it wasn't captured before this task. "Clearing filters restores the full active list" is a dedicated "Clear filters" button, shown only while a filter or search term is active, resetting both at once.

---

### Task 5.5 — Add Daily Summary

**Status:** ✅ Complete

Display:

- total bunks
- completed bunks
- pending bunks
- expected total campers
- actual total served when available
- special requirement count

Acceptance criteria:

- Summary updates after each pickup mutation.
- Counts match active records.

**Note:** `src/services/todaySummary.ts` (`summarizeToday`) is a pure function computing all six figures from `activeDay.bunks` (the full active day, not the current search/filter view — the summary is what's really true for the day, independent of what the operator happens to be looking for right now). `actualTotalServed` is always `null` and rendered as "Not tracked yet" — there is no per-bunk "actual count" field yet (that's EPIC 6, Task 6.2's job to define and capture); showing a fabricated number instead of an honest "not available" would be worse than showing nothing. "Summary updates after each pickup mutation" is satisfied by construction, not by any explicit update logic: `summarizeToday` is called fresh on every render from `activeDay.bunks`, so once EPIC 6 adds a real mutation (e.g. marking a bunk picked up via `setSnackDays`), the summary recomputes automatically with no changes needed here — verified now via the closed-day fixture (a `completed` bunk correctly increments `completedBunks`) standing in for that future mutation.

---

### Task 5.6 — Add Manual Refresh and Last-Updated State

**Status:** ✅ Complete

Acceptance criteria:

- Operator can manually refresh.
- Last successful refresh time is visible.
- Refresh errors do not erase previously displayed data.

**Note:** "refresh" here means re-running the repository load/validation against the bundled JSON — there's no backend to refetch from, but re-validating is still meaningful (and, once "Future: Editing Seed Data" exists, will genuinely matter). A shared `loadRepositorySafely()` helper was extracted from `MasterRoster.tsx`/`Today.tsx`'s previously-duplicated try/catch (now in `src/repositories/jsonSnackRepository.ts`), since Today needed to run it more than once (initial load + every refresh) — `MasterRoster.tsx` was updated to use the same helper, removing its own copy of the same logic. `TodayRefreshControls` shows "Last refreshed: [time]" and a Refresh button; the top-level `ErrorState`'s `onRetry` (present since Task 4.4 but never wired up until now) is wired to the same refresh handler, so retrying from a load failure and manually refreshing are the same action. A failed refresh does **not** replace already-loaded data — it's kept in place, with a separate inline error message reporting the refresh failure, tested directly (a repository stub that succeeds once then fails on the next call, exercising a path the real bundled JSON can't currently produce but the design must still handle correctly).

---

### Task 5.7 — Build Today Screen Tests

**Status:** ✅ Complete — **EPIC 5 (Today Screen and Snack Day Initialization) is complete.**

Test initialization, loading, filters, summaries, error states, and responsive rendering.

Acceptance criteria:

- Today screen behavior is tested with mock repository data.
- Tests include zero bunks, pending bunks, completed bunks, and special requirements.

**Note:** reviewed existing coverage against this task's criteria before writing anything new (same approach as Task 4.7), rather than assuming a gap exists. Result: initialization, filters, summaries, and error states (including the refresh-failure-preserves-data case) were already thoroughly covered across `Today.test.tsx` and the dedicated component/service test files built incrementally in Tasks 5.1–5.6 — all fixture-backed, per the DI pattern established in Task 4.7, never `src/data/*.json`. Zero/pending/completed/special-requirement bunks were all already exercised too. **"Responsive rendering" has no automated test and cannot get one under this project's own standing decision**: Playwright is deliberately never added as a project dependency (see Task 1.8's log entry), and jsdom (the vitest environment actually in use) doesn't perform real layout, so there is no way to assert on-screen overflow from within the committed test suite. Responsive rendering has instead been verified via ad hoc Playwright checks at 390–420px, repeated at every task that changed `Today.tsx`'s layout (5.1, 5.4, 5.5, 5.6) — the same verification approach used for every other page in this project, not a gap specific to this task.
- **One real gap found and fixed**: no test confirmed `TodaySummary` renders correctly (all zeros, no crash) when wired into the actual `Today` page for a zero-bunk day — `summarizeToday([])` and `<TodaySummary>`'s own rendering of a zero-value object were each unit-tested in isolation, but not their integration inside `Today.tsx` for this specific case. Extended the existing "shows an empty state... if an active day has no bunks" test in `Today.test.tsx` rather than adding a near-duplicate.

---

# EPIC 6 — Pickup Workflow

## Status

In Progress — Tasks 6.1–6.3 complete (combined; see their notes), 6.4–6.7 remaining.

## Objective

Allow the operator to complete, correct, and review each bunk pickup quickly and safely.

---

### Task 6.1 — Design Pickup Interaction

**Status:** ✅ Complete — implemented together with Tasks 6.2 and 6.3 (see note)

The default workflow should require as few actions as possible.

Normal flow:

1. Select a bunk.
2. Confirm or adjust actual count.
3. Review special requirements and notes.
4. Complete pickup.

Acceptance criteria:

- Standard pickup can be completed quickly.
- Destructive or corrective actions require explicit confirmation.

**Note:** Tasks 6.1, 6.2, and 6.3 were combined into one implementation cycle rather than staged across three, because — unlike this plan's earlier "define then wire" splits (e.g. Task 4.3 vs. 4.4) — a pickup dialog with an inert "Complete Pickup" button isn't a coherent, useful stopping point on its own; the interaction design, the completion logic, and the confirmation UI are one piece of user-facing behavior. See Task 6.3's note for the full implementation summary. "Destructive or corrective actions require explicit confirmation" doesn't yet apply to anything built in this cycle — completing a pending bunk for the first time isn't destructive or corrective, it's the normal happy path. That acceptance criterion belongs to Tasks 6.4 (correction) and 6.5 (reopen), which explicitly require confirmation, and will be honored when those are built.

---

### Task 6.2 — Implement Complete Pickup Backend Operation

**Status:** ✅ Complete — implemented together with Tasks 6.1 and 6.3 (see note)

Required inputs:

- request ID
- snack date
- bunk ID
- actual count
- optional notes

Required behavior:

- validate active snack day
- validate bunk and count
- record completion time
- update active pickup state
- append exactly one history record
- return the updated pickup

Acceptance criteria:

- Completion updates Today and History data.
- Duplicate submissions do not create duplicate history rows.

**Note:** "Backend operation" is reframed as a pure in-memory function, `completePickup(snackDays, date, bunk, input, now)` in `src/services/completePickup.ts` — there is no backend, and "request ID" doesn't apply (no network call to deduplicate against; the already-completed guard below is what actually protects against duplicates). Returns the `{ success: true, data } | { success: false, message, errorCode }` shape from `ARCHITECTURE.md`'s Error Handling section — the first genuine fit for it in this codebase (Task 4.4's note explains why the repository didn't use it; this per-call, validate-then-mutate operation is exactly what the shape was written for). Validates: day exists (`day-not-found`), day is active not closed (`day-closed`), bunk exists on the day (`bunk-not-found`), bunk isn't already completed (`already-completed` — this is the duplicate-submission guard), and a provided actual count is a non-negative finite number (`invalid-count`). "History" (a separate persisted record distinct from the day itself) doesn't exist yet — that's EPIC 8 territory, already flagged as deferred in Task 2.4's note; today, the bunk's own record in `SnackDay.bunks` **is** the record, updated immutably (new array, new objects — verified by test that the input isn't mutated).

---

### Task 6.3 — Build Pickup Confirmation UI

**Status:** ✅ Complete — **EPIC 6 is in progress; this closes out its first three tasks together.**

Display:

- bunk information
- expected count
- editable actual count
- special requirements
- relevant notes
- complete button

Acceptance criteria:

- Count input is optimized for mobile numeric entry.
- The operator sees a clear success confirmation.
- The UI blocks accidental repeated submission while a mutation is active.

**Note:** `src/components/PickupModal.tsx`, opened by clicking a bunk's name in `Today.tsx`'s table (`TodayBunkRow` gained an optional `onSelect` prop for this — reusing the same `Modal` component and `link-button` interaction pattern `MasterRoster.tsx` already established). Shows counselors, expected count, and the **full** special-requirement detail (type, quantity, and notes) — not just the count `TodayBunkRow` shows in its table cell. This required a real type change: `SnackDayBunkRecord.specialRequirementCount: number` (Task 5.2) became `specialRequirements: SpecialRequirementEntry[]` (the full snapshot), since a count alone can't render "No Dairy × 2, Nurse × 1 — Daily medication," which is exactly what an operator needs to see before completing a pickup. Every consumer of the old field (`todayFilters.ts`, `todaySummary.ts`, `snackDayInitialization.ts`, and their tests) was updated to derive the count via `.length` instead of storing it redundantly.
- **Count input**: `type="number"`/`inputMode="numeric"`, pre-filled with the expected count (confirm-by-default, adjust-if-needed — directly serving "standard pickup can be completed quickly").
- **Success confirmation**: the modal closes and the row immediately shows a distinct green "Picked Up" badge with a real timestamp — judged sufficient for this MVP without adding separate toast/notification infrastructure not otherwise used anywhere in this app.
- **Blocks accidental repeated submission**: satisfied structurally, not through added UI state. Every mutation in this app runs synchronously on the main thread — there is no async window between a click and its effect where a second click could race the first, and `completePickup`'s `already-completed` guard makes even a hypothetical double-call safe. Full "in-flight" UI behavior (spinners, disabling during a pending write) is Task 6.6's job, for whenever a real write boundary actually exists to be "in flight" against.
- **`TodaySummary`'s `actualTotalServed`** (Task 5.5) changed from always-`null` ("Not tracked yet") to a real computed sum over completed bunks' `actualCount` — justified now that this task gives that field real data to sum, not a speculative change.
- Attempting to complete a bunk that's still pending on an already-closed day (a real edge case: EPIC 8's future close-day flow could leave stragglers) is correctly rejected by `completePickup`'s `day-closed` guard, surfaced as an inline error inside the still-open modal — tested directly.

---

### Task 6.4 — Implement Pickup Correction

**Status:** ⬜ Not Started

Allow the operator to correct a completed pickup.

Requirements:

- update actual count or notes
- preserve original and updated timestamps where practical
- update the related history record safely
- record that a correction occurred

Acceptance criteria:

- Corrections do not create duplicate history records.
- Updated data appears consistently on Today and History screens.

---

### Task 6.5 — Implement Reopen Pickup

**Status:** ⬜ Not Started

Allow a completed pickup to return to pending when entered in error.

Requirements:

- require confirmation
- preserve an audit note
- define whether the historical row is marked void, corrected, or removed according to the approved data policy

Recommended MVP policy:

- retain the history record and mark it voided rather than deleting it

Acceptance criteria:

- Reopened pickup returns to pending.
- The historical trail remains understandable.

---

### Task 6.6 — Add Optimistic and Failure-Safe UI Behavior

**Status:** ⬜ Not Started

Requirements:

- show clear progress during writes
- prevent double taps
- restore the prior UI state when a write fails
- preserve entered count and notes for retry

Acceptance criteria:

- Network failure does not silently lose operator input.
- Failed writes are never displayed as completed.

---

### Task 6.7 — Build Pickup Workflow Tests

**Status:** ⬜ Not Started

Test normal completion, adjusted counts, duplicate submission, failure recovery, correction, and reopen behavior.

Acceptance criteria:

- Critical pickup mutations are covered by frontend and backend tests.

---

# EPIC 7 — Special Requirements

## Status

⬜ Not Started

## Objective

Make dietary restrictions and other special snack requirements highly visible during distribution.

---

### Task 7.1 — Normalize Special Requirement Data

**Status:** ⬜ Not Started

Map the current `Allergies` worksheet into a general `SpecialRequirement` model.

Fields:

- requirement ID
- bunk ID or destination
- requirement type
- quantity
- notes
- active status

Acceptance criteria:

- Existing Allergy worksheet records can be read without manual re-entry.
- The model supports dairy-free, gluten-free, nurse, and future requirement types.

---

### Task 7.2 — Implement Special Requirements API

**Status:** ⬜ Not Started

Provide read access to active special requirements.

Acceptance criteria:

- Requirements can be retrieved by bunk and as a full list.
- Invalid quantities and unmapped bunks are reported clearly.

---

### Task 7.3 — Build Special Requirements Screen

**Status:** ⬜ Not Started

Display requirements grouped by:

- bunk or destination
- requirement type

Acceptance criteria:

- Operator can scan all special items before snack distribution.
- Quantity is always visible.
- Unmapped or incomplete requirements are highlighted.

---

### Task 7.4 — Integrate Requirements into Today and Pickup Screens

**Status:** ⬜ Not Started

Acceptance criteria:

- Bunks with requirements are visibly marked on Today.
- Full requirement details are shown before pickup completion.
- Requirement indicators do not rely only on color.

---

### Task 7.5 — Add Roster and Special Requirements Maintenance Workflow

**Status:** ⬜ Not Started

**Decision confirmed by the user, twice, ahead of this task formally starting:** first generally on 2026-07-19 (in-app editing screens will eventually be needed for the roster and special-requirements seed data), then explicitly on 2026-07-20 — the operator needs to **add, delete, and modify** entries in **both** data sets, not just remove a special requirement as the earlier example implied. See `ARCHITECTURE.md`'s "Future: Editing Seed Data."

Requirements:

- Operator can add, edit, and delete roster entries (`bunk`, `counselors`, optional `campers`).
- Operator can add, edit, and delete special-requirement entries (`bunk`, `requirement`, `quantity`, optional `notes`).
- Edits are validated with the existing rules (Task 2.6 — `src/services/dataValidation.ts`) before being applied; an invalid edit (out-of-range `requirement` value, negative `quantity`/`campers`, a special-requirement entry referencing a bunk that doesn't exist, a duplicate bunk) is rejected with a clear message, never silently saved or silently corrupting the data.
- Edits must actually persist across a page reload — this is a different persistence category from pickup status (see `ARCHITECTURE.md`, "Persistence — Current State," which explicitly must **not** persist across a reload). Editing seed data that resets on reload would defeat the purpose.
- **The write-back mechanism itself is still undecided** (a small local dev-only server that writes to `src/data/*.json` on disk, vs. a manual export/import step, since a static production build cannot write to its own source files) — to be chosen when this task actually starts, informed by how the app is being used by then, not speculated on now. This will likely mean the real implementation differs meaningfully between local development and any deployed build; that split isn't designed yet either.

Original MVP choice this task posed (superseded by the above, kept for context):

- read-only in the application, maintained directly in the JSON files by hand
- editable through a controlled Settings or Requirements form

Acceptance criteria:

- Operator can add, modify, and delete both roster entries and special-requirement entries from within the app.
- Invalid edits are rejected before being saved, with a clear, specific message.
- Saved edits persist across a page reload.
- The UI does not suggest editing is possible before this task actually ships it.

---

### Task 7.6 — Build Special Requirements Tests

**Status:** ⬜ Not Started

Test grouping, quantities, unmapped records, Today indicators, and pickup detail display.

---

# EPIC 8 — History and Daily Close

## Status

⬜ Not Started

## Objective

Provide a reliable record of completed pickups and a controlled way to close each snack day.

---

### Task 8.1 — Implement Pickup History API

**Status:** ⬜ Not Started

Support history retrieval by:

- date range
- bunk
- division
- completion status

Acceptance criteria:

- Results are sorted consistently.
- Large histories are limited or paginated.
- Active-day records and historical records are not confused.

---

### Task 8.2 — Build History Screen

**Status:** ⬜ Not Started

Display:

- snack date
- bunk
- expected count
- actual count
- pickup time
- special requirement summary
- correction or void status

Acceptance criteria:

- Operator can review a selected date.
- History is readable on mobile.
- Empty states and errors are clear.

---

### Task 8.3 — Add History Filters and Search

**Status:** ⬜ Not Started

Acceptance criteria:

- Filter by date, bunk, division, and corrected or voided status.
- Filters can be cleared easily.

---

### Task 8.4 — Implement Close Snack Day

**Status:** ⬜ Not Started

Closing a snack day must:

- confirm the date
- identify pending bunks
- require confirmation when pending bunks remain
- mark the day closed
- prevent ordinary pickup writes after close
- preserve all active and historical records

Acceptance criteria:

- Closed days cannot be accidentally modified through the normal workflow.
- Reopening a closed day is not supported unless explicitly added later.

---

### Task 8.5 — Build Daily Close Summary

**Status:** ⬜ Not Started

Display before closing:

- completed bunks
- pending bunks
- expected total
- actual total
- differences
- special requirement summary

Acceptance criteria:

- Operator can identify incomplete or unusual records before closing.

---

### Task 8.6 — Build History and Daily Close Tests

**Status:** ⬜ Not Started

Test history retrieval, filters, closed-day write prevention, pending-bunk warnings, and summary calculations.

---

# EPIC 9 — PWA, Reliability, and Recovery

## Status

⬜ Not Started

## Objective

Make the browser application reliable enough for daily operational use on mobile devices.

---

### Task 9.1 — Configure Progressive Web Application Support

**Status:** ⬜ Not Started

Add:

- web app manifest
- installable icons
- application name and theme metadata
- basic service worker support where appropriate

Requirements:

- Do not imply full offline data synchronization.
- The app may cache static application assets.

Acceptance criteria:

- Application can be added to the home screen on supported devices.
- Installed application opens in a standalone-like experience where supported.

---

### Task 9.2 — Implement Network Status Handling

**Status:** ⬜ Not Started

Requirements:

- detect likely offline state
- display a persistent but unobtrusive warning
- disable or clearly warn before writes when offline
- preserve unsaved form input

Acceptance criteria:

- Operator understands when data cannot be saved.
- The UI does not falsely report success during a network failure.

---

### Task 9.3 — Implement Safe Retry Behavior

**Status:** ⬜ Not Started

Requirements:

- read requests may be retried safely
- write retries must reuse the same request ID
- duplicate prevention must remain active

Acceptance criteria:

- A timed-out completion request can be retried without duplicate history.

---

### Task 9.4 — Add Global Error Boundary and User-Friendly Error States

**Status:** ⬜ Not Started

Acceptance criteria:

- Unexpected rendering failures display a recovery screen.
- User can reload or return to Today.
- Technical details are logged but not shown as raw stack traces.

---

### Task 9.5 — Add Local Draft Preservation

**Status:** ⬜ Not Started

Use local browser storage for:

- unsaved pickup count and notes (in progress, not yet completed)
- operator preferences
- last selected filters

**Note (2026-07-19):** under the current architecture, committed pickup status itself is *also* only in-memory application state, not persisted anywhere yet (see `ARCHITECTURE.md`, "Persistence — Current State") — so this task's original framing ("drafts in local storage, Google Sheets is the source of truth for the real thing") no longer quite applies. This task may need to be reconsidered alongside whatever task ends up giving pickup status real persistence, rather than executed exactly as originally written.

Acceptance criteria:

- Reloading during an unfinished pickup can restore the draft.
- Draft data is removed after successful completion.

---

### Task 9.6 — Define Backup and Restore Procedure

**Status:** ⬜ Not Started

Document, for the JSON-file architecture:

- Git history as the primary backup/version-history mechanism for `src/data/*.json` (replaces Google Sheets version history)
- Recovery after accidental data-file corruption (revert via git, or restore from a manual backup copy)
- Frontend deployment rollback (unchanged in spirit — still just a static-site redeploy)

No Apps Script or backend rollback procedure is needed — there is nothing deployed server-side.

Acceptance criteria:

- A non-developer can follow the basic data-file recovery steps.
- Production deployment versions are traceable.

---

### Task 9.7 — Build Reliability Tests

**Status:** ⬜ Not Started

Test offline warnings, timeout recovery, duplicate-safe retry, error boundaries, and draft restoration.

---

# EPIC 10 — Settings and Operational Administration

## Status

⬜ Not Started

## Objective

Provide the single operator with basic configuration and diagnostic tools without introducing a full administration system.

---

### Task 10.1 — Build Settings Screen

**Status:** ⬜ Not Started

Display:

- application version
- data load status (see EPIC 4, Task 4.6 — no "backend environment" or "connection status" applies without a backend)
- current snack date
- last refresh time
- PWA installation guidance

Acceptance criteria:

- Settings are readable on phone and tablet.
- Secrets and full access tokens are never displayed (moot today with no backend, kept as a standing principle).

---

### Task 10.2 — Add Safe Operator Preferences

**Status:** ⬜ Not Started

Optional preferences:

- default Today filter
- compact or expanded bunk display
- confirmation behavior for normal pickup

Acceptance criteria:

- Preferences affect only the local device unless explicitly stored in Settings.
- Reset-to-default is available.

---

### Task 10.3 — Add Data Validation Display

**Status:** ⬜ Not Started

Reframed from "Workbook Validation Display." Show current data health, per the validation rules defined in EPIC 2, Task 2.6:

- required data files loaded
- schema version
- missing required fields
- duplicate bunks
- invalid records (e.g. orphaned `bunk` references, invalid `requirement` values)

Acceptance criteria:

- Operator receives a clear instruction when the data needs correction.
- The screen does not expose unnecessary technical internals.

---

### Task 10.4 — Add Controlled Data Refresh Actions

**Status:** ⬜ Not Started

Actions may include:

- refresh all data
- revalidate data
- reload active snack day

Acceptance criteria:

- Refresh actions do not create or modify pickup records.
- Destructive reset actions are not included in the MVP.

---

### Task 10.5 — Build Settings Tests

**Status:** ⬜ Not Started

Test preferences, diagnostics, validation display, and safe refresh actions.

---

# EPIC 11 — End-to-End Validation and User Acceptance

## Status

⬜ Not Started

## Objective

Validate the complete daily workflow with realistic Snack Shack data before production use.

---

### Task 11.1 — Create Representative Test Data Files

**Status:** ⬜ Not Started

Reframed from "Test Workbook" — JSON fixture files, not a spreadsheet.

Include:

- multiple bunks (no `division` field — not part of the current data model)
- special requirements covering all seven requirement types
- blank optional values (`campers`, `notes`)
- at least one invalid record for validation testing
- completed and pending pickup examples

Acceptance criteria:

- Testing never depends on the real mock data files (`src/data/*.json`) used for local development display.
- Test data represents realistic workflow conditions.

---

### Task 11.2 — Execute Full Daily Workflow Test

**Status:** ⬜ Not Started

Test:

1. Load data files.
2. Validate schema.
3. Initialize snack day.
4. Review special requirements.
5. Complete normal pickup.
6. Complete pickup with adjusted count.
7. Correct a pickup.
8. Reopen a pickup.
9. Review history.
10. Close the snack day.

Acceptance criteria:

- No manual data-file editing is required during the normal workflow.
- Data remains consistent across Today, History, and data views.

---

### Task 11.3 — Validate Mobile Devices

**Status:** ⬜ Not Started

Test on at least:

- one iPhone
- one iPad or tablet-sized browser
- one Android phone

Acceptance criteria:

- Primary actions are easy to tap.
- No horizontal scrolling is required for normal operation.
- Numeric entry and browser navigation behave correctly.

---

### Task 11.4 — Conduct Operator User Acceptance Test

**Status:** ⬜ Not Started

Have the intended operator complete realistic snack distribution scenarios.

Capture:

- confusing steps
- unnecessary taps
- missing information
- slow interactions
- error recovery issues

Acceptance criteria:

- Critical usability issues are resolved before deployment.
- Operator confirms the workflow is simpler than the spreadsheet-only process.

---

### Task 11.5 — Complete Security and Data Integrity Review

**Status:** ⬜ Not Started

Verify:

- no secrets are committed (moot today with no backend, kept as a standing check)
- duplicate pickup writes are prevented
- bunk codes are stable and unique
- history is preserved
- production data files are backed up (git history — see EPIC 9, Task 9.6)

Acceptance criteria:

- No unresolved critical security or data-loss risk remains.

---

### Task 11.6 — Complete MVP Acceptance Checklist

**Status:** ⬜ Not Started

The MVP is acceptable when:

- operator can initialize a snack day
- operator can see all bunks and counts
- special requirements are visible
- pickups can be completed and corrected
- history is accurate
- day can be closed safely
- app works on supported mobile browsers
- failures provide clear recovery instructions
- the JSON data files remain the source of truth

---

# EPIC 12 — Production Deployment and Handoff

## Status

⬜ Not Started

## Objective

Deploy the PWA safely and provide enough documentation for ongoing use and recovery. Originally "Deploy the PWA and Apps Script backend" — there is no backend to deploy under the current architecture.

---

### Task 12.1 — Prepare Production Google Sheets Workbook

**Status:** Not Applicable — superseded by the architecture revision

No Google Sheets workbook exists under the current architecture. Kept here, marked Not Applicable, per this plan's practice of recording superseded work rather than deleting it. The equivalent concern — getting real, correct data into `src/data/*.json` for production use — is not yet a scoped task; it depends on decisions still open in `open-questions.md` and the "Future: Editing Seed Data" section of `ARCHITECTURE.md`.

---

### Task 12.2 — Deploy Production Apps Script API

**Status:** Not Applicable — superseded by the architecture revision

No Apps Script, no backend, nothing to deploy server-side.

---

### Task 12.3 — Deploy Production PWA

**Status:** ⬜ Not Started

Deploy the built frontend to the approved static hosting service.

Requirements:

- HTTPS
- stable URL
- mobile manifest and icons
- rollback capability

Acceptance criteria:

- Production application loads on supported devices.

---

### Task 12.4 — Complete Production Smoke Test

**Status:** ⬜ Not Started

Verify:

- application opens
- data loads and validates
- Today screen loads
- one controlled test pickup can be completed and removed or clearly marked as test data according to the approved procedure

Acceptance criteria:

- Production workflow succeeds without developer tools.

---

### Task 12.5 — Create Operator Guide

**Status:** ⬜ Not Started

Document:

- opening and installing the PWA
- starting a snack day
- completing and correcting pickups
- reviewing requirements
- reviewing history
- closing a day
- refreshing after an error
- reporting a problem

Acceptance criteria:

- Guide is understandable without programming knowledge.

---

### Task 12.6 — Create Technical Runbook

**Status:** ⬜ Not Started

Document:

- repository and branch
- local setup
- frontend deployment process
- data schema (`src/types/roster.ts`, `WORKBOOK-SCHEMA.md` for historical context)
- backup and restore (git history for `src/data/*.json` — see EPIC 9, Task 9.6)
- rollback
- common error codes

No environment variables or Apps Script deployment process exist to document.

Acceptance criteria:

- Another developer can maintain and redeploy the application.

---

### Task 12.7 — Finalize Implementation Logs and MVP Release

**Status:** ⬜ Not Started

Requirements:

- update `IMPLEMENTATION-LOG-MVP.md`
- verify all completed tasks and tests
- record production URLs and versions securely
- document known limitations
- tag the MVP release in version control

Acceptance criteria:

- Plan and log statuses match actual implementation.
- MVP release is reproducible and documented.

---

# MVP Completion Definition

The WSD Snack Shack MVP is complete when one authorized operator can use a mobile browser or installed PWA to:

1. Load the approved roster and special-requirements data.
2. Validate the data structure.
3. Initialize the current snack day from the Master Roster.
4. See all bunks, camper counts, and special requirements.
5. Complete pickups with actual counts and timestamps.
6. Correct or reopen a pickup without losing the historical trail.
7. Review current progress and prior pickup history.
8. Close a snack day safely.
9. Recover clearly from common data-loading errors.
10. Operate the workflow without directly editing the data files during normal use.

---

# Recommended Execution Order

Proceed one task at a time in this order:

1. Complete EPIC 1.
2. Complete EPIC 2.
3. ~~Complete EPIC 3.~~ Skip — Not Applicable as of the 2026-07-19 architecture revision (no backend).
4. Complete EPIC 4.
5. Build the Today and Pickup workflows in EPIC 5 and EPIC 6.
6. Add Special Requirements and History in EPIC 7 and EPIC 8.
7. Add reliability and settings in EPIC 9 and EPIC 10.
8. Complete user acceptance, deployment, and handoff in EPIC 11 and EPIC 12 (Tasks 12.1 and 12.2 are also Not Applicable — skip to 12.3).

Do not begin a later Epic when a required dependency in an earlier Epic remains incomplete unless the exception is documented and approved.