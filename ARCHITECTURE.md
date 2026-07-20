# ARCHITECTURE.md

# WSD Snack Shack MVP Architecture

## Status

MVP Architecture — revised 2026-07-19 (JSON files, no backend)

---

# Primary Objective

Create the fastest, simplest, and most reliable way for a Snack Shack operator to distribute snacks, manage special dietary requirements, record bunk pickups, and maintain operational records with as little effort as possible.

The MVP is intentionally designed for a **single operator** using a mobile device.

The application should require minimal setup while remaining easy to expand in the future.

---

# Architecture Revision Note

This is the **second** architecture revision. The original approved architecture used React Native + Expo + Supabase (retired — see `IMPLEMENTATION-LOG-MVP.md`). The first revision replaced that with a React + Vite PWA backed by Google Apps Script and the Snack Shack's existing Google Sheets workbook. **This revision removes the Google Sheets/Apps Script backend entirely** in favor of plain JSON files.

Any earlier wording referencing Apps Script, the Sheets API, or a live workbook connection is superseded by this document. `WORKBOOK-SCHEMA.md` remains valid as a historical record of the real spreadsheet's structure — it directly informed the JSON data shapes below — but the workbook itself is no longer read by the application.

This simplification was requested by the user after seeing a working mock-data prototype of the Master Roster screen (see `IMPLEMENTATION-LOG-MVP.md`).

---

# Guiding Principles

1. Simplicity over complexity.
2. Mobile-first design.
3. The bundled JSON files are the source of truth for roster and special-requirement data.
4. Business logic belongs in the application — not scattered across components.
5. Every read goes through a single repository layer, even though that layer is simple today.
6. Design for future growth without overengineering the MVP.

---

# High Level Architecture

```
                React + Vite PWA
       (iPhone / Android / iPad / desktop browser)

                      │
                reads directly
                      │

              Bundled JSON files
         (src/data/masterRoster.json,
        src/data/specialRequirements.json)
```

**No backend.** No network request is made to read operational data. The entire application runs client-side.

Today's per-bunk pickup status (pending vs. processed) is tracked as **in-memory application state only** — it is not written back to the JSON files and does not persist across a page reload. This is a deliberate, known simplification for the current stage, not an oversight — see "Persistence — Current State" below.

---

# Technology Stack

## Frontend

- React
- Vite
- TypeScript
- React Router
- React Hook Form (for the data-editing screens described under "Future: Editing Seed Data")

TanStack Query is **not** used — there is nothing to fetch over a network.

## Backend

None.

## Data Store

**Bundled JSON files**, read directly by the application:

- `src/data/masterRoster.json` — one record per bunk (`bunk`, `counselors`, optional `campers`)
- `src/data/specialRequirements.json` — zero-to-many records per bunk (`bunk`, `requirement`, `quantity`, optional `notes`)

These are the files used "on a daily basis" — they represent the current roster and requirements, and are expected to be kept up to date (manually today; via in-app editing screens later — see below). They are **not** a one-time seed that becomes irrelevant after first load: every time the app starts, it reads whatever is currently in these files.

---

# Application Layers

```
UI

↓

Pages

↓

Components

↓

Business Services

↓

Repository Interface

↓

JSON Data Repository
```

---

# Repository Pattern

The application must never import or reference the JSON data files directly from a component. Every read goes through a repository.

```
SnackRepository

├── getRoster()

├── getSpecialRequirementsForBunk(bunk)

├── getToday()          — in-memory pickup status (see below)

├── markPickedUp(bunk)  — in-memory only, for now

├── getHistory()         — not yet implemented
```

If the data source changes later (see "Future Expansion"), only the repository implementation changes — pages, components, and business services depend on the interface, not the storage mechanism.

---

# Data Model (confirmed so far)

Implemented in `src/types/roster.ts`; mock data in `src/data/*.json` (see `IMPLEMENTATION-LOG-MVP.md` for how the mock data was generated).

## Master Roster

One record per bunk.

| Field | Type | Required | Notes |
|---|---|---|---|
| `bunk` | string | Yes | Bunk code, e.g. `K3`. Acts as the natural key. |
| `counselors` | string | Yes | Free text; multiple counselors separated by `/`. |
| `campers` | number | No | Optional camper count. |

## Special Requirements

Zero to many records per bunk.

| Field | Type | Required | Notes |
|---|---|---|---|
| `bunk` | string | Yes | Joins to a Master Roster record. |
| `requirement` | enum | Yes | One of: `No Dairy`, `Gluten Free`, `No Red Dye`, `Nurse`, `No Corn Syrup`, `No Soy/Dairy`, `Cholov Yisroel`. |
| `quantity` | number | Yes | How many campers in the bunk need this specific requirement. |
| `notes` | string | No | Free text. |

Additional entities (pickup history, settings) are **not yet defined** — they'll be specified in `IMPLEMENTATION-PLAN-MVP.md` Task 2.2 once the pickup workflow epics are reached.

---

# Persistence — Current State

**Roster and special-requirements data**: read from the bundled JSON files at load time. Read-only from the application's perspective today.

**Pickup status** (which bunks are pending vs. processed today): held in **React application state only**. It is:
- Reset every time the page is reloaded.
- Not written to the JSON files.
- Not persisted anywhere else (no `localStorage`, no server).

This is intentional for the current stage of the MVP — explicitly called out by the user as something that "might change later," not a final decision. When real day-to-day use requires pickup status to survive a page reload, that's a scoped follow-up task, not something to solve speculatively now.

---

# Future: Editing Seed Data

Not yet architected in detail — a later task, once reached. The user has confirmed the intent: eventually there will be in-app screens to edit the roster and special-requirements data itself (e.g., removing a special requirement, adding a bunk). Whatever write-back mechanism that needs (writing to the actual files requires either a small local server or a manual export/import step, since a static site cannot write to its own source files) will be decided **when that task is reached**, informed by how the app is actually being used by then — not speculated on now.

---

# Authentication

**None.** There is no backend to authenticate against, and no shared/multi-device access to protect. If the operator's device itself needs to be protected from unauthorized use, that is the device's own lock screen — an OS-level concern, not an application concern.

---

# Offline Behavior

The application works fully offline after the initial page load — there is no network dependency for data at all.

---

# Error Handling

Business services should return a consistent success/failure shape, even without a network boundary:

```
Success
{ success: true, data: ... }

Failure
{ success: false, message: "...", errorCode: "..." }
```

Realistic failure modes at this stage: malformed or missing JSON data (validated at load time — Task 2.6 territory). Raw parsing errors or stack traces must not be shown to the operator directly.

---

# Security

- No credentials, API keys, or service-role secrets exist anywhere in this architecture — there's no backend to hold them.
- Real people's names (counselors) and potentially sensitive dietary/medical notes live in the bundled JSON files and, transiently, in application memory. Mock/development data must stay fictional (see `IMPLEMENTATION-LOG-MVP.md`); real operational data introduces real privacy handling questions (e.g., should real data files be committed to git at all?) to be resolved before this app is used with real campers' information — flagged in `open-questions.md` if not already resolved by the time that matters.

---

# Testing Strategy

## Unit Tests

- Business services
- Repository
- Validation

## Component Tests

- Full repository → UI flow (already the pattern used for `MasterRoster` + `Modal` — see `IMPLEMENTATION-LOG-MVP.md`)

## Manual Tests

- Snack day workflow
- Pickup workflow
- History
- Special requirements

---

# Future Expansion

The repository pattern allows replacing the JSON-file data source later without rewriting the UI or business logic — for example:

- `localStorage`-backed persistence (if pickup status needs to survive reloads)
- A small local server that reads/writes the actual files on disk (if in-app editing needs real file write-back)
- A real backend (if multi-device sync becomes an actual requirement)

No UI changes should be required for such a swap, provided the repository interface is respected. Which of these gets built, and when, is decided task by task as real needs arise — not architected speculatively today.

---

# Architecture Rules

✔ UI never imports the JSON data files directly — only through the repository.

✔ UI communicates only with business services.

✔ Business services communicate only with the repository interface.

✔ Every historical record (once history exists) is append-only.

✔ MVP favors simplicity over scalability.

---

# Out of Scope (MVP)

- Multiple users
- Role-based permissions
- Multi-device / multi-browser sync
- Offline synchronization (moot — the app has no online dependency to begin with)
- Push notifications
- Inventory forecasting
- Realtime collaboration
- Native mobile applications
- App Store deployment
- Any server or database backend

These may be introduced after the MVP is validated.

---

# Deployment

Since there is no backend, deployment is static file hosting — `npm run build` produces `dist/`, servable from any static host. There is no server process to run and no backend deployment step. Covered in detail when `IMPLEMENTATION-PLAN-MVP.md`'s deployment epic is reached.
