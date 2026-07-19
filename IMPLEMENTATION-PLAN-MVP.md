# IMPLEMENTATION-PLAN-MVP.md

# WSD Snack Shack MVP Implementation Plan

## Status

Active MVP Plan

## Primary Objective

Create the fastest, simplest, and most reliable way for a single Snack Shack operator to distribute snacks, manage special dietary requirements, record bunk pickups, and maintain accurate operational records with as little effort as possible.

The MVP will be delivered as a mobile-first Progressive Web Application that works on iPhone, iPad, Android, and desktop browsers.

---

# Approved MVP Architecture

```text
React + Vite + TypeScript PWA
            ↓
Google Apps Script API
            ↓
Google Sheets Workbook
```

## Technology Decisions

- Frontend: React, Vite, TypeScript
- Routing: React Router
- Data fetching and caching: TanStack Query
- Forms and validation: React Hook Form with shared validation utilities
- Backend: Google Apps Script deployed as a web application
- Source of truth: Google Sheets
- Testing: Vitest, React Testing Library, and Apps Script integration tests
- Deployment: Static web hosting for the PWA and Google Apps Script for the backend

## Explicitly Excluded from the MVP

- Expo
- React Native
- Supabase
- Native mobile builds
- App Store or Google Play deployment
- Multi-user account management
- Role-based permissions
- Real-time collaboration
- Offline synchronization
- Push notifications
- Inventory forecasting

---

# Global Implementation Rules

1. Google Sheets is the operational source of truth.
2. The frontend must never access or edit spreadsheet cells directly.
3. All spreadsheet operations must pass through the Google Apps Script API.
4. UI components must not contain spreadsheet-specific logic.
5. Business services must communicate through a repository interface.
6. Historical pickup records must be append-only.
7. Permanent IDs must never be reused.
8. The application must be optimized for a single operator using a phone or tablet.
9. Every task must include relevant tests before it is marked complete.
10. Completed work must not be rewritten unless validation proves that it is incompatible with the approved architecture.

---

# EPIC 1 — Project Foundation

## Status

⬜ Not Started

## Objective

Establish a stable React, Vite, and TypeScript foundation for the mobile-first Snack Shack PWA.

## Architecture Review Note

Expo and React Native were evaluated and rejected because they did not match the validated project software and development environment. The approved foundation is React, Vite, and TypeScript.

Any earlier EPIC 1 wording that referenced Expo, React Native, or Expo Router must be treated as documentation superseded by this plan.

**Correction (see `IMPLEMENTATION-LOG-MVP.md` for the full pivot record):** this EPIC was briefly marked complete by mistake — no React/Vite/React Router/Vitest work has actually been implemented. The prior EPIC 1 that *was* completed and verified (Tasks 1.1–1.8) built an Expo/React Native foundation under the now-superseded architecture; none of that code is reusable for this stack. EPIC 1 is being rebuilt from scratch under this plan, task by task.

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

**Status:** ⬜ Not Started

Create and maintain:

- `README-MVP.md`
- `ARCHITECTURE.md`
- `IMPLEMENTATION-PLAN-MVP.md`
- `IMPLEMENTATION-LOG-MVP.md`

Acceptance criteria:

- Documentation reflects React, Vite, Google Apps Script, and Google Sheets.
- Expo and Supabase are not presented as active MVP technologies.

---

# EPIC 2 — Workbook Schema and Data Contract

## Status

⬜ Not Started

## Objective

Formalize the existing workbook into a stable data source that can support the application without relying on fragile cell positions or spreadsheet formulas.

Existing worksheets:

- `Master Roster`
- `snack shack today`
- `Allergies`

Planned worksheets:

- `Pickup History`
- `Settings`

---

### Task 2.1 — Document the Existing Workbook Structure

**Status:** ⬜ Not Started

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

---

### Task 2.2 — Define Stable Application Data Models

**Status:** ⬜ Not Started

Define TypeScript data models independent of spreadsheet row layout.

Required models:

- `Bunk`
- `Counselor`
- `SpecialRequirement`
- `SnackDay`
- `PickupRecord`
- `PickupHistoryRecord`
- `AppSettings`
- `ApiResponse<T>`

Acceptance criteria:

- Models use permanent IDs rather than row numbers.
- Models define required and optional fields.
- Models are shared across frontend services and tests.

---

### Task 2.3 — Add Permanent IDs to Master Data

**Status:** ⬜ Not Started

Add stable IDs to workbook records used by the application.

Requirements:

- Add a permanent `bunk_id` to each `Master Roster` row.
- Add permanent IDs to special requirement rows when individual records need independent updates.
- Existing spreadsheet display and formulas must continue to work.
- IDs must not change when rows are sorted or moved.

Acceptance criteria:

- Every bunk has a unique permanent ID.
- Duplicate or missing IDs are detected.
- The application never treats a row number as an ID.

---

### Task 2.4 — Create Pickup History Worksheet

**Status:** ⬜ Not Started

Create an append-only `Pickup History` worksheet.

Required columns:

- `history_id`
- `snack_date`
- `bunk_id`
- `division`
- `bunk_name`
- `expected_count`
- `actual_count`
- `special_requirement_summary`
- `notes`
- `pickup_time`
- `created_at`

Acceptance criteria:

- Completed pickups can be stored without overwriting prior days.
- Historical rows are append-only.
- Each historical record has a unique ID.

---

### Task 2.5 — Create Settings Worksheet

**Status:** ⬜ Not Started

Create a simple key/value `Settings` worksheet for configuration that should not be hard-coded.

Initial settings may include:

- current snack date
- workbook schema version
- application display name
- API token hash or access configuration, if used
- default expected-count behavior

Acceptance criteria:

- Settings can be read through the backend API.
- Missing required settings produce a controlled error.

---

### Task 2.6 — Define Workbook Validation Rules

**Status:** ⬜ Not Started

Create validation rules for workbook structure and data quality.

Validation must detect:

- missing worksheets
- missing required columns
- duplicate IDs
- invalid numeric values
- blank required fields
- duplicate active pickup rows
- malformed special requirement quantities

Acceptance criteria:

- Validation results identify the worksheet, row, and problem.
- Invalid workbook structure blocks unsafe writes.

---

### Task 2.7 — Build Workbook Schema Tests

**Status:** ⬜ Not Started

Create automated tests or repeatable validation scripts using a representative workbook fixture.

Acceptance criteria:

- Valid workbook fixtures pass.
- Missing-column and duplicate-ID fixtures fail predictably.
- Tests do not modify the production workbook.

---

# EPIC 3 — Google Apps Script Backend Foundation

## Status

⬜ Not Started

## Objective

Create a controlled backend API that is the only component permitted to read from or write to the Snack Shack workbook.

---

### Task 3.1 — Create Google Apps Script Project

**Status:** ⬜ Not Started

Create an Apps Script project linked to or configured for the Snack Shack workbook.

Requirements:

- Store workbook and worksheet names in configuration.
- Separate request routing, business logic, workbook access, validation, and response formatting.
- Do not place all logic in a single script function.

Acceptance criteria:

- The project can read workbook metadata.
- A test function confirms access to required worksheets.

---

### Task 3.2 — Define the API Execution Contract

**Status:** ⬜ Not Started

Define a stable request and response contract.

Successful response:

```json
{
  "success": true,
  "data": {}
}
```

Failure response:

```json
{
  "success": false,
  "message": "User-friendly message",
  "errorCode": "STABLE_ERROR_CODE",
  "details": {}
}
```

Requirements:

- Every endpoint returns JSON.
- Error codes remain stable for frontend handling.
- Internal stack traces are not returned to the browser.

Acceptance criteria:

- Shared response helpers are implemented.
- Invalid requests return controlled errors.

---

### Task 3.3 — Implement API Routing

**Status:** ⬜ Not Started

Implement `doGet` and `doPost` routing using explicit actions.

Required read actions:

- `health`
- `getWorkbookStatus`
- `getRoster`
- `getToday`
- `getSpecialRequirements`
- `getPickupHistory`
- `getSettings`

Required write actions:

- `initializeSnackDay`
- `completePickup`
- `updatePickup`
- `reopenPickup`
- `closeSnackDay`

Acceptance criteria:

- Unknown actions return `UNKNOWN_ACTION`.
- Read and write operations are routed to separate service functions.

---

### Task 3.4 — Implement Workbook Access Layer

**Status:** ⬜ Not Started

Build reusable helpers for locating worksheets, reading header-based rows, writing values, appending history, and validating headers.

Requirements:

- Column access must use header names, not fixed column indexes in business logic.
- Worksheet names must be centralized.
- Writes must be limited to intended columns.

Acceptance criteria:

- Reordering columns does not break business logic when headers remain unchanged.
- Missing headers produce controlled errors.

---

### Task 3.5 — Implement API Access Protection

**Status:** ⬜ Not Started

Protect the Apps Script API for the single authorized operator.

Allowed MVP approaches:

- restricted Google account execution, where compatible with the frontend flow
- a private application token validated by Apps Script
- another simple mechanism documented and approved before implementation

Requirements:

- Secrets must not be committed to GitHub.
- Unauthorized write requests must be rejected.
- The security approach must remain practical for one user.

Acceptance criteria:

- Authorized requests succeed.
- Unauthorized requests fail with a controlled error.
- Deployment instructions explain how access is configured.

---

### Task 3.6 — Add Write Locking and Idempotency

**Status:** ⬜ Not Started

Prevent accidental duplicate writes caused by double taps, retries, or concurrent requests.

Requirements:

- Use Apps Script locking for write operations.
- Accept an operation/request ID for pickup mutations.
- Detect repeated completion requests.
- Do not append duplicate history records.

Acceptance criteria:

- Repeating the same request does not create duplicate pickup history.
- Simultaneous write attempts are handled safely.

---

### Task 3.7 — Add Backend Logging

**Status:** ⬜ Not Started

Log meaningful backend operations and failures.

Log fields should include:

- timestamp
- action
- request ID
- bunk ID when relevant
- success or failure
- error code

Acceptance criteria:

- Write operations are traceable.
- Logs do not expose secrets.

---

### Task 3.8 — Build Apps Script Tests

**Status:** ⬜ Not Started

Create tests for routing, validation, workbook mapping, authorization, duplicate prevention, and error responses.

Acceptance criteria:

- Core read and write services are covered.
- Tests use a non-production workbook or controlled test fixtures.
- Production data is never modified by automated tests.

---

# EPIC 4 — Frontend API and Repository Integration

## Status

⬜ Not Started

## Objective

Connect the React application to the Apps Script backend through a repository abstraction while keeping UI code independent of the workbook.

---

### Task 4.1 — Create Environment Configuration

**Status:** ⬜ Not Started

Create validated environment configuration for the Apps Script URL and approved access credentials.

Requirements:

- Provide `.env.example`.
- Do not commit secrets.
- Fail clearly when required configuration is absent.

Acceptance criteria:

- Local development can connect to the test backend.
- Production builds receive configuration through deployment settings.

---

### Task 4.2 — Implement API Client

**Status:** ⬜ Not Started

Create a shared HTTP client for Apps Script requests.

Requirements:

- JSON request and response handling
- timeout behavior
- controlled retries for safe read requests
- error-code mapping
- request IDs for write operations

Acceptance criteria:

- Network errors are normalized.
- Backend errors are not displayed as raw technical messages.

---

### Task 4.3 — Define Snack Repository Interface

**Status:** ⬜ Not Started

Define a repository interface used by business services.

Required methods:

```text
getWorkbookStatus()
getRoster()
getToday()
getSpecialRequirements()
getPickupHistory()
getSettings()
initializeSnackDay()
completePickup()
updatePickup()
reopenPickup()
closeSnackDay()
```

Acceptance criteria:

- Services depend on the interface rather than Apps Script details.
- A mock repository can be used in tests.

---

### Task 4.4 — Implement Google Apps Script Repository

**Status:** ⬜ Not Started

Implement the repository using the shared API client.

Acceptance criteria:

- API payloads are mapped into application models.
- Spreadsheet row shapes are not exposed to components.
- Invalid payloads are rejected before reaching the UI.

---

### Task 4.5 — Configure TanStack Query

**Status:** ⬜ Not Started

Configure query keys, caching, invalidation, loading states, and mutation behavior.

Requirements:

- Read data may be cached briefly.
- Successful pickup writes invalidate Today and History queries.
- Write mutations must not be blindly retried.

Acceptance criteria:

- Screens receive consistent loading and error states.
- Stale data refreshes after writes.

---

### Task 4.6 — Build Connection Diagnostics Screen

**Status:** ⬜ Not Started

Create a simple diagnostics view accessible from Settings.

Display:

- frontend version
- backend connectivity
- workbook availability
- schema validation result
- last successful refresh

Acceptance criteria:

- The operator can distinguish a browser problem, backend problem, and workbook problem.
- No secrets are displayed.

---

### Task 4.7 — Build Repository and API Client Tests

**Status:** ⬜ Not Started

Acceptance criteria:

- Success, failure, malformed-response, timeout, and unauthorized cases are tested.
- Component tests can use a mock repository without calling Apps Script.

---

# EPIC 5 — Today Screen and Snack Day Initialization

## Status

⬜ Not Started

## Objective

Create the primary mobile screen that replaces the `snack shack today` paper or spreadsheet workflow.

---

### Task 5.1 — Define Today Screen UX

**Status:** ⬜ Not Started

Design the screen for fast one-handed or tablet use.

Each bunk row or card must show:

- division
- bunk name
- expected camper count
- pickup status
- special requirement indicator
- notes indicator
- pickup time when completed

Acceptance criteria:

- The most important information is visible without opening each record.
- Completed and pending bunks are easy to distinguish without relying only on color.

---

### Task 5.2 — Implement Snack Day Initialization Service

**Status:** ⬜ Not Started

Initialize the active snack day from the Master Roster.

Requirements:

- Create one active pickup record per eligible bunk.
- Copy expected counts and relevant notes as a daily snapshot.
- Prevent duplicate initialization for the same date.
- Preserve completed historical days.

Acceptance criteria:

- A new day can be initialized from current roster data.
- Repeating initialization does not duplicate rows.

---

### Task 5.3 — Build Today Screen Data Loading

**Status:** ⬜ Not Started

Load and display the active snack day.

Required states:

- loading
- empty or not initialized
- active day
- closed day
- API error
- workbook validation error

Acceptance criteria:

- Each state provides a clear next action.
- The screen never remains blank after an error.

---

### Task 5.4 — Add Search and Filtering

**Status:** ⬜ Not Started

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

---

### Task 5.5 — Add Daily Summary

**Status:** ⬜ Not Started

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

---

### Task 5.6 — Add Manual Refresh and Last-Updated State

**Status:** ⬜ Not Started

Acceptance criteria:

- Operator can manually refresh.
- Last successful refresh time is visible.
- Refresh errors do not erase previously displayed data.

---

### Task 5.7 — Build Today Screen Tests

**Status:** ⬜ Not Started

Test initialization, loading, filters, summaries, error states, and responsive rendering.

Acceptance criteria:

- Today screen behavior is tested with mock repository data.
- Tests include zero bunks, pending bunks, completed bunks, and special requirements.

---

# EPIC 6 — Pickup Workflow

## Status

⬜ Not Started

## Objective

Allow the operator to complete, correct, and review each bunk pickup quickly and safely.

---

### Task 6.1 — Design Pickup Interaction

**Status:** ⬜ Not Started

The default workflow should require as few actions as possible.

Normal flow:

1. Select a bunk.
2. Confirm or adjust actual count.
3. Review special requirements and notes.
4. Complete pickup.

Acceptance criteria:

- Standard pickup can be completed quickly.
- Destructive or corrective actions require explicit confirmation.

---

### Task 6.2 — Implement Complete Pickup Backend Operation

**Status:** ⬜ Not Started

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

---

### Task 6.3 — Build Pickup Confirmation UI

**Status:** ⬜ Not Started

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

### Task 7.5 — Add Requirement Maintenance Workflow

**Status:** ⬜ Not Started

For the MVP, choose one of the following and document the decision:

- read-only in the application, maintained directly in Google Sheets
- editable through a controlled Settings or Requirements form

Recommended MVP approach:

- begin read-only unless daily operations require app-based editing

Acceptance criteria:

- The chosen behavior is explicit.
- The UI does not suggest editing when editing is not supported.

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

Use local browser storage only for:

- unsaved pickup count and notes
- operator preferences
- last selected filters

Google Sheets remains the source of truth.

Acceptance criteria:

- Reloading during an unfinished pickup can restore the draft.
- Draft data is removed after successful completion.

---

### Task 9.6 — Define Backup and Restore Procedure

**Status:** ⬜ Not Started

Document:

- Google Sheets version history usage
- periodic workbook copy procedure
- Apps Script version/deployment rollback
- frontend deployment rollback
- recovery after accidental workbook structure changes

Acceptance criteria:

- A non-developer can follow the basic workbook recovery steps.
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
- active backend environment
- workbook connection status
- current snack date
- last refresh time
- PWA installation guidance

Acceptance criteria:

- Settings are readable on phone and tablet.
- Secrets and full access tokens are never displayed.

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

### Task 10.3 — Add Workbook Validation Display

**Status:** ⬜ Not Started

Show current workbook health:

- required worksheets present
- schema version
- missing columns
- duplicate IDs
- invalid records

Acceptance criteria:

- Operator receives a clear instruction when the workbook needs correction.
- The screen does not expose unnecessary technical internals.

---

### Task 10.4 — Add Controlled Data Refresh Actions

**Status:** ⬜ Not Started

Actions may include:

- refresh all data
- revalidate workbook
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

### Task 11.1 — Create Representative Test Workbook

**Status:** ⬜ Not Started

Include:

- multiple divisions
- multiple bunks
- special requirements
- blank optional values
- at least one invalid record for validation testing
- completed and pending pickup examples

Acceptance criteria:

- Testing never depends on the production workbook.
- Test data represents realistic workflow conditions.

---

### Task 11.2 — Execute Full Daily Workflow Test

**Status:** ⬜ Not Started

Test:

1. Connect to workbook.
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

- No manual spreadsheet editing is required during the normal workflow.
- Data remains consistent across Today, History, and workbook views.

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

- no secrets are committed
- unauthorized writes are rejected
- duplicate pickup writes are prevented
- IDs are stable
- history is preserved
- production workbook is backed up

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
- workbook remains the source of truth

---

# EPIC 12 — Production Deployment and Handoff

## Status

⬜ Not Started

## Objective

Deploy the PWA and Apps Script backend safely and provide enough documentation for ongoing use and recovery.

---

### Task 12.1 — Prepare Production Google Sheets Workbook

**Status:** ⬜ Not Started

Requirements:

- back up the original workbook
- apply approved IDs and worksheets
- validate schema
- confirm sharing and ownership settings
- remove test data

Acceptance criteria:

- Production workbook passes all validation rules.
- A recoverable pre-deployment copy exists.

---

### Task 12.2 — Deploy Production Apps Script API

**Status:** ⬜ Not Started

Requirements:

- create versioned production deployment
- configure approved access protection
- confirm production workbook connection
- record deployment URL securely

Acceptance criteria:

- Production health and workbook-status calls succeed.
- Unauthorized access tests fail.

---

### Task 12.3 — Deploy Production PWA

**Status:** ⬜ Not Started

Deploy the built frontend to the approved static hosting service.

Requirements:

- HTTPS
- production environment configuration
- stable URL
- mobile manifest and icons
- rollback capability

Acceptance criteria:

- Production application loads on supported devices.
- Application connects only to the production backend.

---

### Task 12.4 — Complete Production Smoke Test

**Status:** ⬜ Not Started

Verify:

- application opens
- backend health succeeds
- workbook validates
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
- environment variables
- Apps Script deployment process
- frontend deployment process
- workbook schema
- backup and restore
- rollback
- common error codes

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

1. Connect to the approved Google Sheets workbook.
2. Validate the workbook structure.
3. Initialize the current snack day from the Master Roster.
4. See all bunks, expected counts, notes, and special requirements.
5. Complete pickups with actual counts and timestamps.
6. Correct or reopen a pickup without losing the historical trail.
7. Review current progress and prior pickup history.
8. Close a snack day safely.
9. Recover clearly from common connection and workbook errors.
10. Operate the workflow without directly editing the spreadsheet during normal use.

---

# Recommended Execution Order

Proceed one task at a time in this order:

1. Complete EPIC 1.
2. Complete EPIC 2.
3. Complete EPIC 3.
4. Complete EPIC 4.
5. Build the Today and Pickup workflows in EPIC 5 and EPIC 6.
6. Add Special Requirements and History in EPIC 7 and EPIC 8.
7. Add reliability and settings in EPIC 9 and EPIC 10.
8. Complete user acceptance, deployment, and handoff in EPIC 11 and EPIC 12.

Do not begin a later Epic when a required dependency in an earlier Epic remains incomplete unless the exception is documented and approved.