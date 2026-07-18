# WSD Snack Shack Mobile Application — MVP Implementation Plan

## Document Status

**Version:** 1.0  
**Status:** Initial Draft  
**Project:** WSD Snack Shack Mobile Application  
**Primary Platforms:** iPhone, iPad, Android  
**Architecture Reference:** `ARCHITECTURE.md`  
**Product Reference:** `README-MVP.md`

---

# 1. Primary Objective

Create the fastest, simplest, and most reliable way for WSD Snack Shack staff to distribute snacks, manage dietary restrictions, track inventory, and record bunk pickups with as little effort as possible while maintaining accurate operational records.

Every task in this plan must support that objective.

---

# 2. Implementation Principles

All implementation work must:

- Conform to `ARCHITECTURE.md`.
- Preserve the mobile-first operational workflow.
- Minimize taps, typing, and training requirements.
- Keep Supabase PostgreSQL as the system of record.
- Enforce authorization in the backend, not only in the UI.
- Preserve historical snack-day and pickup records.
- Keep expected and actual snack quantities separate.
- Use one shared React Native codebase for iPhone, iPad, and Android.
- Include relevant automated tests.
- Reuse established project patterns rather than creating duplicate implementations.
- Stop for review after each task before beginning the next task.

---

# 3. Definition of Done for Every Task

A task is complete only when:

1. The implementation satisfies the task objective and requirements.
2. The implementation conforms to `ARCHITECTURE.md`.
3. Relevant automated tests have been created or updated.
4. Relevant tests pass.
5. TypeScript compile checks pass.
6. Linting passes.
7. The implemented behavior has been manually verified where applicable.
8. No unrelated task or Epic has been started.
9. The user has reviewed and approved the task.
10. `IMPLEMENTATION-LOG-MVP.md` and this plan are updated after approval.

---

# 4. MVP Epic Summary

- [ ] EPIC 1 — Project Foundation
- [ ] EPIC 2 — Supabase Foundation and Core Data Model
- [ ] EPIC 3 — Authentication and Role-Based Access
- [ ] EPIC 4 — Master Bunk Roster
- [ ] EPIC 5 — Special Snack Requirements
- [ ] EPIC 6 — Daily Snack Setup
- [ ] EPIC 7 — Snack Pickup Workflow
- [ ] EPIC 8 — Daily Dashboard and Remaining Bunks
- [ ] EPIC 9 — Inventory Management
- [ ] EPIC 10 — History, Day Closure, and Corrections
- [ ] EPIC 11 — Reliability, Accessibility, and Multi-Device Synchronization
- [ ] EPIC 12 — Production Readiness and Pilot Deployment

---

# EPIC 1 — Project Foundation

## Objective

Create a stable React Native and Expo project that follows the approved architecture and can run on iPhone, iPad, Android, and web-based development tooling where useful.

## Success Criteria

- The project runs successfully through Expo.
- TypeScript, linting, formatting, testing, routing, environment handling, and base styling are configured.
- The initial application shell is visible on supported device sizes.
- The repository contains all required project documentation.
- No business functionality is implemented prematurely.

---

## Task 1.1 — Create the React Native Expo Project

### Status

✅ Complete

### Objective

Create the initial Expo application using TypeScript and the approved project name and repository structure.

### Requirements

- Create the project as `wsd-snack-shack`.
- Use the current supported Expo project setup.
- Enable TypeScript.
- Confirm the project starts successfully.
- Confirm the default application renders in an Expo development environment.
- Do not add business screens beyond a minimal startup screen.

### Acceptance Criteria

- The application starts without runtime errors.
- The project uses TypeScript.
- The project package name and application name identify WSD Snack Shack.
- The initial source is committed to version control.

### Tests and Verification

- Run the Expo development server.
- Run a TypeScript compile check.
- Verify startup on at least one supported device or simulator.

---

## Task 1.2 — Add Required Project Documentation

### Status

✅ Complete

### Objective

Add and validate the project’s core documentation files.

### Requirements

Create or add:

- `README-MVP.md`
- `ARCHITECTURE.md`
- `IMPLEMENTATION-PLAN-MVP.md`
- `IMPLEMENTATION-LOG-MVP.md`
- `.env.example`

The implementation log must start with:

- Project name
- Date created
- Current Epic
- Current task
- Empty completed-task history

### Acceptance Criteria

- All required files exist at the project root.
- The files use consistent project naming.
- The implementation plan references the architecture.
- The implementation log is ready to track approved work.

### Tests and Verification

- Verify all files are present.
- Verify documentation links and filenames are correct.

---

## Task 1.3 — Configure Project Structure

### Status

✅ Complete

### Objective

Create the folder structure defined in `ARCHITECTURE.md`.

### Requirements

Create the initial structure for:

- `app/`
- `src/components/`
- `src/features/`
- `src/hooks/`
- `src/lib/`
- `src/services/`
- `src/theme/`
- `src/types/`
- `src/utils/`
- `supabase/migrations/`
- `supabase/tests/`
- `tests/`
- `assets/`

Create feature folders for:

- authentication
- dashboard
- bunks
- special-requirements
- snack-days
- pickups
- inventory
- history
- administration

Do not add placeholder files that provide no value. Add only the minimum files required to preserve directories and establish boundaries.

### Acceptance Criteria

- The folder structure conforms to `ARCHITECTURE.md`.
- Route files remain under `app/`.
- Reusable and business logic are organized under `src/`.
- No direct database logic is embedded in route files.

### Tests and Verification

- Verify the application still starts.
- Verify imports resolve correctly.

---

## Task 1.4 — Configure Code Quality and Test Tooling

### Objective

Create a consistent development and verification baseline.

### Requirements

Configure:

- ESLint
- Prettier or equivalent formatting
- TypeScript compile checking
- Jest
- React Native Testing Library
- Test setup files
- Package scripts for lint, typecheck, test, and combined verification

Suggested scripts:

```text
npm run lint
npm run typecheck
npm test
npm run verify
```

### Acceptance Criteria

- Linting runs successfully.
- Type checking runs successfully.
- At least one baseline test passes.
- The combined verification command fails when any check fails.

### Tests and Verification

- Run all configured quality commands.
- Intentionally verify that a failing test is detected, then restore it.

---

## Task 1.5 — Configure Expo Router and Navigation Shell

### Objective

Create the initial route structure without implementing final authentication behavior.

### Requirements

Create:

- Root layout
- Initial loading/index route
- Sign-in route
- Staff route group
- Administrator route group
- Placeholder Today screen
- Placeholder Administration screen

The app must have one clear startup route.

### UI Requirements

- Display the WSD Snack Shack name.
- Use large readable text.
- Provide safe-area support.
- Avoid dense navigation.
- Support phone and tablet widths.

### Acceptance Criteria

- Navigation works between approved placeholder routes.
- Route groups match the architecture.
- No unauthorized business data is loaded.
- The Today route is prepared to become the primary staff screen.

### Tests and Verification

- Add route or screen rendering tests where practical.
- Verify navigation manually.

---

## Task 1.6 — Create the Base Theme and Shared UI Primitives

### Objective

Establish a consistent mobile design foundation.

### Requirements

Create theme definitions for:

- Typography
- Spacing
- Border radii
- Status colors
- Backgrounds
- Text colors
- Touch-target sizing

Create initial shared components:

- `AppButton`
- `ScreenHeader`
- `LoadingState`
- `ErrorState`
- `EmptyState`

Status information must never rely on color alone.

### UI Requirements

- Minimum practical touch target size of approximately 44 by 44 points.
- High contrast for operational information.
- Readable outdoors.
- Large default text.
- Accessible labels for interactive elements.

### Acceptance Criteria

- Shared components render consistently.
- Components support disabled, loading, and error states where applicable.
- Theme values are centralized.
- No screen duplicates styling that belongs in a shared primitive.

### Tests and Verification

- Add component rendering and interaction tests.
- Verify phone and tablet layouts.

---

## Task 1.7 — Configure Environment Management

### Objective

Create safe environment-specific configuration.

### Requirements

Support at minimum:

- Development environment
- Production environment

Add environment variables for:

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
```

Rules:

- Secrets must not be committed.
- `.env.example` must contain names only.
- Service-role keys must not be used in the app.
- Missing required environment variables must fail with a clear development error.

### Acceptance Criteria

- The app can read approved public environment variables.
- Missing configuration is handled clearly.
- No secret or production credential is committed.

### Tests and Verification

- Test valid configuration.
- Test missing configuration.
- Verify `.gitignore` excludes local environment files.

---

## Task 1.8 — Verify Architectural Compliance of the Foundation

### Objective

Review the completed project foundation against `ARCHITECTURE.md` before backend implementation begins.

### Requirements

Verify:

- One React Native Expo codebase
- TypeScript enabled
- Expo Router structure
- Feature-based organization
- No custom backend introduced
- No global state library introduced without need
- No service-role key exposure
- Test and quality tooling operational
- Documentation present

Document any approved variance in `IMPLEMENTATION-LOG-MVP.md`.

### Acceptance Criteria

- All foundation requirements conform to architecture.
- Any deviation is explicitly documented and approved.
- EPIC 1 verification commands pass.

### Tests and Verification

- Run the complete verification suite.
- Start the application.
- Verify at least one phone-sized and one tablet-sized layout.

---

# EPIC 2 — Supabase Foundation and Core Data Model

## Objective

Create the Supabase development backend, version-controlled schema, constraints, seed data, typed client access, and foundational security policies.

## Success Criteria

- Core data tables exist through migrations.
- Relationships and constraints protect data integrity.
- Development seed data is available.
- Supabase access is typed and centralized.
- Row-Level Security is enabled and tested.

---

## Task 2.1 — Create and Configure the Development Supabase Project

### Objective

Establish the development backend environment.

### Requirements

- Create a Supabase development project.
- Configure local environment variables.
- Install and configure the Supabase CLI where appropriate.
- Link the repository to the development project.
- Document setup instructions without storing secrets.

### Acceptance Criteria

- The app can establish a development Supabase connection.
- No production environment is used for development.
- Credentials are excluded from version control.

### Tests and Verification

- Run a simple safe connectivity check.
- Verify invalid configuration is handled clearly.

---

## Task 2.2 — Create Core Database Enums and Reference Types

### Objective

Define controlled values used across the database.

### Requirements

Create approved database types or equivalent constraints for:

- user role
- snack-day status
- pickup status
- special-requirement type
- requirement severity
- schedule status
- inventory adjustment type

Values must align with `ARCHITECTURE.md`.

### Acceptance Criteria

- Invalid values are rejected by the database.
- Types are represented in generated TypeScript definitions.
- Naming is consistent across database and application layers.

### Tests and Verification

- Add database tests for valid and invalid values.
- Regenerate TypeScript database types.

---

## Task 2.3 — Create Profiles, Bunks, and Counselor Tables

### Objective

Create the foundational identity and roster schema.

### Requirements

Create migrations for:

- `profiles`
- `bunks`
- `bunk_counselors`

Include:

- Primary keys
- Foreign keys
- Unique bunk code
- Nonnegative camper count
- Active flags
- Created and updated timestamps
- Historical preservation rules

### Acceptance Criteria

- A bunk can have multiple counselors.
- Duplicate bunk codes are rejected.
- Negative camper counts are rejected.
- Deactivating a bunk does not delete related history.

### Tests and Verification

- Add migration tests.
- Test constraints and relationships.

---

## Task 2.4 — Create Special Requirements Table

### Objective

Store structured dietary, allergy, medical, nurse, and schedule requirements.

### Requirements

Create `special_requirements` with:

- Bunk relationship
- Requirement type
- Quantity
- Camper reference
- Severity
- Preparation instructions
- Operational notes
- Active status
- Timestamps

### Acceptance Criteria

- A bunk can have multiple requirements.
- Invalid quantities are rejected.
- Requirements may be deactivated without deletion.
- Severity and type values are constrained.

### Tests and Verification

- Test multiple requirements per bunk.
- Test inactive requirements.
- Test validation constraints.

---

## Task 2.5 — Create Snack Day and Pickup Tables

### Objective

Create the core daily transaction model.

### Requirements

Create:

- `snack_days`
- `snack_day_staff`
- `pickup_records`

Enforce:

- One pickup record per snack day and bunk
- Expected and actual quantity separation
- Valid status transitions where feasible
- User and timestamp references
- Closed-day preservation
- Foreign keys to bunks and profiles

### Acceptance Criteria

- Duplicate snack-day/bunk pickup rows are rejected.
- Expected quantity is stored independently of current bunk count.
- Historical records remain linked when a bunk is deactivated.
- Actual quantity may remain null until completion.

### Tests and Verification

- Test unique constraints.
- Test foreign keys.
- Test historical independence from roster changes.

---

## Task 2.6 — Create Inventory and Audit Tables

### Objective

Create auditable inventory and operational history structures.

### Requirements

Create:

- `inventory_records`
- `inventory_adjustments`
- `audit_events`

Inventory must distinguish:

- Starting quantity
- Distributed quantity
- Adjustments
- Remaining quantity

Audit records must support:

- Entity
- Action
- Previous values
- New values
- User
- Timestamp

### Acceptance Criteria

- Inventory changes can be reconstructed.
- Manual adjustments require a reason and user.
- Important changes can be audited without deleting history.

### Tests and Verification

- Test inventory calculations and adjustment relationships.
- Test audit-event persistence.

---

## Task 2.7 — Add Updated-Timestamp and Audit Support

### Objective

Create reusable database behavior for timestamps and approved audit events.

### Requirements

- Add safe `updated_at` handling.
- Add audit triggers or controlled functions for approved sensitive actions.
- Avoid logging sensitive data unnecessarily.
- Ensure audit creation cannot be bypassed through normal app operations.

### Acceptance Criteria

- Updated timestamps change correctly.
- Audited changes create corresponding events.
- Sensitive values are minimized in logs.

### Tests and Verification

- Test update timestamps.
- Test audit creation.
- Test non-audited routine reads do not create noise.

---

## Task 2.8 — Enable Row-Level Security and Baseline Policies

### Objective

Make backend authorization the security boundary.

### Requirements

- Enable Row-Level Security on every application table.
- Deny anonymous operational access.
- Create baseline authenticated read policies where appropriate.
- Restrict administrative writes.
- Prohibit destructive deletion of operational history.
- Do not use client-side role checks as the sole protection.

### Acceptance Criteria

- Anonymous users cannot access operational tables.
- Staff cannot perform administrator-only writes.
- Administrators can perform approved management actions.
- Historical deletion is blocked.

### Tests and Verification

- Add policy tests for anonymous, staff, administrator, and deactivated users.
- Verify policies through Supabase test tooling.

---

## Task 2.9 — Create Development Seed Data

### Objective

Create realistic non-sensitive test data.

### Requirements

Include:

- Approximately 36 representative bunks
- Multiple divisions
- Multiple counselors
- Staff and administrator test profiles
- Common dietary substitutions
- Allergy and nurse examples
- Open, draft, and closed snack days
- Pending and completed pickup records
- Inventory adjustments

Do not use real camper names or medical information.

### Acceptance Criteria

- Seed data supports all planned MVP workflows.
- Development can be reset reproducibly.
- No sensitive production data is included.

### Tests and Verification

- Reset and reseed the development database.
- Verify representative scenarios.

---

## Task 2.10 — Generate Typed Database Definitions and Data Access Foundation

### Objective

Create the typed Supabase client and initial data-access conventions.

### Requirements

- Generate TypeScript database types.
- Create `src/lib/supabase.ts`.
- Configure secure session persistence.
- Create typed service boundaries.
- Do not place direct queries in route files.
- Normalize backend errors into application error categories.

### Acceptance Criteria

- Supabase access is typed.
- Screens do not create raw duplicated queries.
- Missing configuration is handled clearly.
- Database errors are not shown directly to users.

### Tests and Verification

- Add client initialization tests.
- Add error-normalization tests.
- Run type checking.

---

# EPIC 3 — Authentication and Role-Based Access

## Objective

Create secure sign-in, session handling, profile loading, role-aware navigation, and backend-enforced permissions.

## Success Criteria

- Only authorized active users can access the app.
- Staff and administrators receive the correct navigation and capabilities.
- Sessions are stored securely.
- Deactivated users are blocked.
- Backend policies enforce every permission.

---

## Task 3.1 — Implement Authentication Service and Session Provider

### Objective

Create the application authentication layer.

### Requirements

Support:

- Sign in
- Sign out
- Session restoration
- Session refresh
- Current user
- Profile loading
- Role loading
- Deactivated-user handling

Use secure device storage for sessions.

### Acceptance Criteria

- A valid user session survives app restart.
- Sign out removes access.
- Authentication state is separate from general server state.
- Deactivated users cannot continue into operational screens.

### Tests and Verification

- Test sign-in success and failure.
- Test session restoration.
- Test sign-out.
- Test deactivated profile behavior.

---

## Task 3.2 — Build the Sign-In Screen

### Objective

Create a simple, reliable mobile sign-in experience.

### UI Requirements

- WSD Snack Shack identity
- Email field
- Approved authentication action
- Clear loading state
- Clear error state
- Large touch targets
- Keyboard-safe layout
- No unnecessary links or options

### Acceptance Criteria

- Authorized users can sign in.
- Invalid credentials show a useful message.
- Repeated submission is prevented.
- The screen works on phone and tablet layouts.

### Tests and Verification

- Add form validation tests.
- Add loading and error-state tests.
- Verify on iOS and Android layouts.

---

## Task 3.3 — Implement Route Guards and Role-Aware Navigation

### Objective

Prevent unauthorized route access and simplify navigation by role.

### Requirements

- Signed-out users see only sign-in.
- Staff see staff routes.
- Administrators see staff and administrator routes.
- Loading state is shown while session/profile loads.
- Unauthorized route attempts redirect safely.

### Acceptance Criteria

- Staff cannot open administrator screens.
- Administrators can access approved management screens.
- Route guards do not replace backend policies.
- Today becomes the default authenticated route.

### Tests and Verification

- Test each authentication and role state.
- Test direct route access attempts.

---

## Task 3.4 — Build User Profile and Sign-Out UI

### Objective

Provide clear current-user identification and safe sign-out.

### Requirements

Show:

- Display name
- Role
- Email where appropriate
- Sign-out action

Avoid cluttering the primary Today screen.

### Acceptance Criteria

- Users can identify the active account.
- Sign-out requires a deliberate action.
- The app returns to sign-in after sign-out.

### Tests and Verification

- Add profile rendering tests.
- Add sign-out interaction tests.

---

## Task 3.5 — Verify Authentication and Authorization Security

### Objective

Complete a full role and security review before operational data features are built.

### Requirements

Verify:

- No anonymous operational access
- Staff restrictions
- Administrator permissions
- Deactivated-user denial
- Secure session storage
- No service-role credentials
- Route guards and RLS behavior agree

### Acceptance Criteria

- Security tests pass for all supported roles.
- No role depends solely on hidden UI controls.
- Any security exception is documented and approved.

---

# EPIC 4 — Master Bunk Roster

## Objective

Allow authorized users to view and manage bunk information while preserving historical records.

## Success Criteria

- Staff can view active bunk information.
- Administrators can add, edit, and deactivate bunks and counselors.
- Historical pickup data is never deleted by roster changes.
- The roster is optimized for mobile use.

---

## Task 4.1 — Implement Bunk Data Services and Query Hooks

### Requirements

Create typed functions and hooks for:

- Get active bunks
- Get bunk details
- Get bunks by division
- Create bunk
- Update bunk
- Deactivate/reactivate bunk
- Get counselor assignments

### Acceptance Criteria

- Queries are centralized and typed.
- Cache invalidation is correct.
- Errors use normalized messages.

### Tests and Verification

- Add service and hook tests.
- Test active/inactive filtering.

---

## Task 4.2 — Build the Staff Bunk Directory

### UI Requirements

Display:

- Bunk code/name
- Division
- Camper count
- Counselors
- Active schedule notes
- Special-requirement indicator

Support:

- Search
- Division filtering
- Clear empty and error states

### Acceptance Criteria

- Staff can find any active bunk quickly.
- Sensitive details are not overexposed.
- The screen works on phones and tablets.

### Tests and Verification

- Test search and filtering.
- Test empty, loading, and error states.

---

## Task 4.3 — Build Administrator Bunk Management

### Requirements

Administrators can:

- Add a bunk
- Edit bunk details
- Update camper count
- Change schedule status
- Add operational notes
- Activate/deactivate a bunk

Deactivation must require confirmation.

### Acceptance Criteria

- Staff cannot access management controls.
- Duplicate bunk codes are handled clearly.
- Deactivation preserves history.
- Forms minimize typing.

### Tests and Verification

- Add create, edit, validation, and permission tests.

---

## Task 4.4 — Build Counselor Assignment Management

### Requirements

Administrators can:

- Add counselors to a bunk
- Edit counselor names
- Deactivate assignments
- View current assignments

### Acceptance Criteria

- Multiple counselors are supported.
- Counselor information updates on staff-facing screens.
- Historical snack records are unaffected.

### Tests and Verification

- Add assignment tests.
- Test multiple counselors per bunk.

---

## Task 4.5 — Complete Roster Integration and Review

### Requirements

- Integrate bunk data into shared components.
- Confirm all screens use the same source and display rules.
- Remove duplicate roster formatting or query logic.
- Verify architectural compliance.

### Acceptance Criteria

- One consistent roster implementation is used throughout the app.
- Relevant tests pass.
- EPIC 4 can support later snack-day generation.

---

# EPIC 5 — Special Snack Requirements

## Objective

Provide a reliable, high-visibility workflow for dietary, allergy, medical, nurse, and schedule requirements.

## Success Criteria

- Staff can quickly see what must be prepared.
- Allergy and medical information is prominent but appropriately restricted.
- Administrators can maintain structured requirements.
- Special requirements automatically appear in daily workflows.

---

## Task 5.1 — Implement Special Requirement Services and Hooks

### Requirements

Create typed operations for:

- Get active requirements
- Get requirements by bunk
- Get requirements for active snack day
- Create requirement
- Update requirement
- Deactivate/reactivate requirement

### Acceptance Criteria

- Requirements are structured, not copied into free-text daily notes.
- Inactive requirements are excluded by default.
- Data access is typed and centralized.

### Tests and Verification

- Add service and hook tests.

---

## Task 5.2 — Create Special Requirement Presentation Components

### Requirements

Create reusable components such as:

- `SpecialRequirementAlert`
- `RequirementSeverityBadge`
- `RequirementSummary`

Status must include text/icon meaning, not color alone.

### Acceptance Criteria

- Allergy and medical items are visually distinguishable.
- Components support phone and tablet layouts.
- Sensitive information is shown only where operationally necessary.

### Tests and Verification

- Add severity and accessibility tests.

---

## Task 5.3 — Build the Special Snacks Preparation Screen

### UI Requirements

Support:

- Group by requirement type
- Group by bunk
- Quantity totals
- Severity indicators
- Preparation instructions
- Search/filter where useful
- Current snack-day context

### Acceptance Criteria

- Staff can prepare all special snacks from one screen.
- Totals are accurate.
- Bunks with multiple requirements are represented correctly.
- The screen does not require manual transcription.

### Tests and Verification

- Test grouping and totals.
- Test multiple requirements per bunk.

---

## Task 5.4 — Build Administrator Requirement Management

### Requirements

Administrators can:

- Add
- Edit
- Deactivate/reactivate
- Set quantity
- Set severity
- Add camper reference where necessary
- Add preparation instructions

Changes to allergy or medical requirements must be auditable.

### Acceptance Criteria

- Staff cannot modify requirements.
- Invalid quantities are blocked.
- Sensitive changes create audit events.

### Tests and Verification

- Add CRUD, validation, permission, and audit tests.

---

## Task 5.5 — Integrate Requirements into Bunk and Daily Views

### Requirements

- Show concise requirement warnings on bunk cards.
- Show detailed information only when opened or operationally needed.
- Include schedule-related notes such as swim/late status.
- Reuse the same requirement components and rules.

### Acceptance Criteria

- Daily cards immediately signal special handling.
- No duplicate requirement-display logic exists.
- Allergy/medical visibility is clear and accessible.

---

# EPIC 6 — Daily Snack Setup

## Objective

Allow an administrator to create and open a snack day safely, generating one daily pickup record for every active bunk through a single atomic backend operation.

## Success Criteria

- A snack day can be created as a draft.
- Opening the day automatically creates pickup records.
- Expected quantities are snapshots of current camper counts.
- Duplicate or partial daily setup is prevented.

---

## Task 6.1 — Implement Snack Day Services and Queries

### Requirements

Create typed functions for:

- Get current/open snack day
- Get snack day by date
- Create draft snack day
- Update draft
- Open snack day
- Get snack-day staff
- Assign staff

### Acceptance Criteria

- Services are typed and centralized.
- Only authorized users can create or open days.
- Errors distinguish conflict, validation, and authorization failures.

### Tests and Verification

- Add service tests.

---

## Task 6.2 — Create Atomic Open-Snack-Day Database Function

### Objective

Implement the most critical daily setup transaction.

### Requirements

The backend function must:

1. Verify authorization.
2. Validate draft status.
3. Prevent conflicting open days.
4. Read all active bunks.
5. Create exactly one pickup record per active bunk.
6. Copy camper count into expected quantity.
7. Record opening user and backend timestamp.
8. Change status to open.
9. Return the complete result.
10. Roll back all changes if any step fails.

### Acceptance Criteria

- No partial daily setup is possible.
- Duplicate pickup rows are prevented.
- Retrying safely returns a conflict or idempotent result.
- The mobile client does not perform sequential inserts.

### Tests and Verification

- Add database transaction tests.
- Test duplicate opening.
- Test rollback behavior.
- Test zero active bunks.
- Test unauthorized access.

---

## Task 6.3 — Build the Create Snack Day Screen

### UI Requirements

Capture:

- Date
- Snack name
- Starting inventory
- Staff on duty
- Notes

Use defaults where safe.

### Acceptance Criteria

- Administrators can create a draft quickly.
- Staff cannot access creation controls.
- Validation errors are clear.
- The form works on phones and tablets.

### Tests and Verification

- Add form, validation, and permission tests.

---

## Task 6.4 — Build the Open Day Confirmation Workflow

### Requirements

Before opening, show:

- Date
- Snack
- Active bunk count
- Expected standard snacks
- Special requirement count
- Starting inventory
- Staff

Require deliberate confirmation.

### Acceptance Criteria

- The user understands what will be generated.
- Repeated taps are prevented.
- Success routes to Today.
- Failure leaves the draft recoverable.

### Tests and Verification

- Test success, conflict, network failure, and retry states.

---

## Task 6.5 — Build No-Open-Day and Draft-Day States

### Requirements

The Today screen must clearly distinguish:

- No snack day
- Draft exists
- Open day
- Closed day

Administrators should receive the appropriate setup action. Staff should receive clear guidance without unauthorized controls.

### Acceptance Criteria

- No blank or confusing Today screen occurs.
- Role-appropriate actions are visible.
- State transitions refresh correctly.

---

# EPIC 7 — Snack Pickup Workflow

## Objective

Create the primary operational workflow used from 2:00–3:00 PM, allowing a bunk pickup to be completed accurately in only a few taps.

## Success Criteria

- Staff can identify a bunk, confirm quantity, and record pickup quickly.
- User and backend timestamp are recorded.
- Duplicate submissions are prevented.
- Special requirements remain visible.
- Failed requests never appear permanently successful.

---

## Task 7.1 — Implement Pickup Query and Mutation Services

### Requirements

Create typed operations for:

- Get pickups for current day
- Get pickup by bunk
- Complete pickup
- Reopen pickup
- Mark not collected
- Update permitted notes/quantity
- Refetch or subscribe to updates

### Acceptance Criteria

- Screens do not contain raw pickup queries.
- Errors are normalized.
- Cache updates are consistent.

### Tests and Verification

- Add service and mutation tests.

---

## Task 7.2 — Create Atomic Complete-Pickup Database Function

### Requirements

The backend function must:

- Verify authenticated active user
- Verify open snack day
- Verify pending/reopened pickup status
- Validate actual quantity
- Set completed status
- Set actual quantity
- Set `picked_up_by`
- Set backend `picked_up_at`
- Create audit event where required
- Prevent duplicate completion
- Return updated record

### Acceptance Criteria

- Repeated submissions do not create duplicate completion.
- Closed-day completion is blocked.
- Unauthorized users are blocked.
- Backend timestamp is authoritative.

### Tests and Verification

- Add database tests for normal, duplicate, invalid, closed-day, and unauthorized cases.

---

## Task 7.3 — Build the Bunk Pickup Card

### UI Requirements

Display:

- Bunk name/code
- Division
- Expected quantity
- Counselor names
- Special requirement warnings
- Schedule notes
- Pickup status
- Completion time when applicable
- Large primary action

### Acceptance Criteria

- A staff member can understand the bunk’s needs at a glance.
- The card does not rely on color alone.
- Completed and pending states are unmistakable.
- The card works on phone and tablet screens.

### Tests and Verification

- Add component tests for all statuses and warnings.

---

## Task 7.4 — Build the Pickup Confirmation and Quantity Workflow

### Requirements

When **Mark Picked Up** is selected:

- Default actual quantity to expected quantity.
- Allow quick adjustment.
- Show special requirement reminder.
- Prevent duplicate taps.
- Submit one atomic mutation.
- Show pending confirmation state.
- Confirm success or restore/flag failure.

### Acceptance Criteria

- Standard pickup can be completed in minimal taps.
- Different actual quantity can be recorded.
- Failure never leaves a false completed state.
- Unsent input is preserved for retry where practical.

### Tests and Verification

- Test default quantity.
- Test adjusted quantity.
- Test double tap.
- Test network failure and retry.
- Test conflict from another device.

---

## Task 7.5 — Implement Reopen Pickup Workflow

### Requirements

- Require confirmation.
- Restrict based on role/day status.
- Record user, timestamp, and prior values.
- Preserve previous completion details in audit history.
- Prevent reopen after close except administrator correction.

### Acceptance Criteria

- Accidental pickups can be corrected safely.
- Unauthorized users cannot reopen.
- Audit history is complete.

### Tests and Verification

- Add permission, status, and audit tests.

---

## Task 7.6 — Integrate Pickup Workflow into the Today Screen

### Requirements

- Load all current-day pickup cards.
- Prioritize pending bunks.
- Support refresh.
- Update counts after mutations.
- Reflect changes made by other devices.
- Avoid full-app reloads.

### Acceptance Criteria

- Today is fully usable as the main operational screen.
- Pickup changes appear promptly.
- Loading and failure states are clear.
- No duplicate pickup implementation exists elsewhere.

---

# EPIC 8 — Daily Dashboard and Remaining Bunks

## Objective

Provide immediate visibility into snack distribution progress and remaining work.

## Success Criteria

- Staff can instantly see totals and remaining bunks.
- Metrics update after every confirmed pickup.
- Remaining, completed, and special-requirement views are available.
- The UI follows the established successful data-loading and screen-display patterns from prior Epics.

---

## Task 8.1 — Build the Daily Dashboard UI and Data Contract

### Objective

Create the complete operational summary at the top of the Today screen.

### Requirements

Display:

- Total bunks
- Picked up
- Remaining
- Expected snacks
- Actual snacks distributed
- Special snacks required
- Estimated remaining inventory

The task includes both the calculation/data contract and the visible UI. It is not complete if metrics exist only in services or logs.

The implementation must reuse the data-loading, loading-state, error-state, refresh, and screen-rendering patterns already established in EPICs 4–7. The coder must not create a separate inconsistent mechanism.

### Acceptance Criteria

- Metrics are visible on the Today screen.
- Values update after confirmed pickup changes.
- Loading, empty, and error states render correctly.
- Phone and tablet layouts are usable.
- Calculations are tested.
- No duplicate data-fetching pattern is introduced.

### Tests and Verification

- Add calculation tests.
- Add dashboard rendering tests.
- Verify live updates after pickup.
- Verify zero-state and closed-day behavior.

---

## Task 8.2 — Build the Remaining Bunks Screen

### Requirements

Show only bunks whose current-day pickup status requires action.

Support:

- Division grouping or filtering
- Search
- Special requirement indicators
- Pull to refresh
- Clear zero-remaining state

### Acceptance Criteria

- Staff can quickly identify every outstanding bunk.
- Completed bunks disappear after confirmed mutation.
- A conflict or failed update does not incorrectly remove a bunk.

### Tests and Verification

- Test filtering, updates, and zero state.

---

## Task 8.3 — Build Completed and All-Bunks Views

### Requirements

Provide optional views for:

- All bunks
- Completed bunks
- Remaining bunks
- Special-requirement bunks

Use one shared data model and card implementation.

### Acceptance Criteria

- Status filtering is accurate.
- No duplicate card logic exists.
- Switching views is simple and mobile friendly.

### Tests and Verification

- Test each filter state.

---

## Task 8.4 — Add Division Progress Summaries

### Requirements

Show useful progress by division without cluttering the primary workflow.

Example:

```text
Kindergarten: 5 of 6 picked up
Grade 1 Girls: 3 of 4 picked up
```

### Acceptance Criteria

- Division totals are accurate.
- The summary is accessible.
- The feature does not make Today harder to use.

### Tests and Verification

- Add grouping and summary tests.

---

# EPIC 9 — Inventory Management

## Objective

Track starting inventory, actual distribution, adjustments, and remaining inventory without confusing planned and actual quantities.

## Success Criteria

- Inventory can be reconciled for each day.
- Actual distribution drives inventory consumption.
- Adjustments are auditable.
- Staff can see current remaining inventory.
- Administrators can correct counts safely.

---

## Task 9.1 — Implement Inventory Calculation Domain Logic

### Requirements

Implement and test:

```text
Starting Inventory
- Actual Distributed
+/- Adjustments
= Remaining Inventory
```

Support separate inventory types where needed.

### Acceptance Criteria

- Calculations are deterministic and tested.
- Expected quantities do not reduce actual inventory.
- Invalid negative results are handled according to approved rules.

### Tests and Verification

- Add unit tests for normal, adjustment, waste, additional stock, and variance cases.

---

## Task 9.2 — Implement Inventory Services and Hooks

### Requirements

Create typed operations for:

- Get current inventory
- Create initial inventory record
- Get adjustments
- Add adjustment
- Get daily reconciliation

### Acceptance Criteria

- Access is role appropriate.
- Mutations refresh dashboard inventory.
- Errors are normalized.

### Tests and Verification

- Add service and hook tests.

---

## Task 9.3 — Build Current Inventory Display

### UI Requirements

Show:

- Starting quantity
- Distributed quantity
- Adjustments
- Remaining quantity
- Warning when running low

### Acceptance Criteria

- Staff can see current inventory from the daily workflow.
- Values update after confirmed pickups.
- Warning meaning is not color only.

### Tests and Verification

- Add rendering and threshold tests.

---

## Task 9.4 — Build Administrator Inventory Adjustment Workflow

### Requirements

Administrators can record:

- Waste
- Damaged items
- Additional stock
- Count correction
- Other approved adjustment

Require:

- Quantity
- Reason
- Confirmation
- User identity
- Backend timestamp

### Acceptance Criteria

- Adjustments never silently overwrite totals.
- Staff cannot create restricted adjustments.
- Every adjustment is auditable.

### Tests and Verification

- Add validation, permission, calculation, and audit tests.

---

## Task 9.5 — Build Daily Inventory Reconciliation

### Requirements

At day closure, show:

- Starting inventory
- Actual distributed
- Adjustments
- Calculated remaining
- Counted remaining, if entered
- Variance

### Acceptance Criteria

- Administrators can identify discrepancies.
- Reconciliation is preserved in history.
- Corrections require audit history.

### Tests and Verification

- Add variance tests and closure integration tests.

---

# EPIC 10 — History, Day Closure, and Corrections

## Objective

Allow staff to review prior snack days while protecting closed records and permitting only auditable administrative corrections.

## Success Criteria

- Days can be closed safely.
- Pending bunks are handled explicitly.
- Historical days are easy to review.
- Regular staff cannot modify closed records.
- Administrator corrections are audited.

---

## Task 10.1 — Create Atomic Close-Snack-Day Database Function

### Requirements

The backend function must:

- Verify administrator authorization
- Verify day is open
- Identify pending bunks
- Require approved handling for pending records
- Mark applicable bunks not collected
- Calculate final totals
- Calculate inventory variance
- Set closed status
- Record closing user and backend timestamp
- Create audit event
- Prevent later staff edits

### Acceptance Criteria

- Closure is atomic.
- Pending bunks cannot be silently ignored.
- Repeated closure is safe.
- Staff mutations are blocked after closure.

### Tests and Verification

- Add normal, pending, duplicate, unauthorized, and rollback tests.

---

## Task 10.2 — Build Day Closure Review Screen

### UI Requirements

Display:

- Day summary
- Pending bunks
- Expected versus actual
- Special snacks
- Inventory reconciliation
- Confirmation action

### Acceptance Criteria

- The administrator understands all unresolved items before closing.
- Accidental closure is difficult.
- Errors leave the day open and recoverable.

### Tests and Verification

- Add review, confirmation, and failure-state tests.

---

## Task 10.3 — Build Snack Day History List

### Requirements

Show:

- Date
- Snack
- Status
- Bunks served
- Actual quantity distributed
- Inventory variance
- Closed by/time

Support date-based navigation or filtering.

### Acceptance Criteria

- Historical days are easy to locate.
- Closed days are clearly identified.
- Loading and empty states are complete.

### Tests and Verification

- Add list and filtering tests.

---

## Task 10.4 — Build Historical Day Detail Screen

### Requirements

Display:

- Summary metrics
- Every bunk pickup status
- Actual quantities
- Pickup times
- Staff users
- Special requirements applicable at the time where preserved
- Inventory details
- Audit history where authorized

### Acceptance Criteria

- History can be reviewed without modifying it.
- Staff and administrator detail visibility follows role rules.
- Historical pickup values are not replaced by current roster counts.

### Tests and Verification

- Add historical integrity tests.

---

## Task 10.5 — Build Administrator Correction Workflow

### Requirements

Administrators may correct approved fields after closure.

Every correction must:

- Require a reason
- Show prior value
- Show new value
- Record user
- Record backend timestamp
- Create audit event
- Recalculate dependent totals safely

### Acceptance Criteria

- Corrections are explicit and traceable.
- No historical record is deleted.
- Staff cannot perform corrections.
- Dependent inventory and summary values remain accurate.

### Tests and Verification

- Add permission, recalculation, and audit tests.

---

# EPIC 11 — Reliability, Accessibility, and Multi-Device Synchronization

## Objective

Ensure the app remains safe, understandable, and responsive during a busy snack period with multiple devices and imperfect connectivity.

## Success Criteria

- Multiple users see current information.
- Duplicate actions are prevented.
- Connectivity failures are visible and recoverable.
- Accessibility requirements are met.
- Performance is appropriate for approximately 36 bunks.

---

## Task 11.1 — Implement Active-Day Realtime Synchronization

### Requirements

Use Supabase Realtime only for operationally valuable current-day changes, such as:

- Pickup status
- Actual quantity
- Dashboard totals or data that drives them
- Inventory changes

Also refetch:

- On app foreground
- After successful mutations
- After reconnection
- On manual refresh

### Acceptance Criteria

- Two devices reflect confirmed changes promptly.
- Realtime is not the only sync mechanism.
- Subscriptions are cleaned up correctly.
- Excessive subscriptions are avoided.

### Tests and Verification

- Add subscription lifecycle tests where practical.
- Perform two-device manual verification.

---

## Task 11.2 — Implement Connectivity and Retry UX

### Requirements

- Detect and clearly present request failures.
- Preserve unsent input.
- Support safe retry.
- Do not permanently show unconfirmed success.
- Refetch after reconnection.
- Avoid an offline mutation queue in the MVP.

### Acceptance Criteria

- A failed pickup is visibly unconfirmed.
- Retry does not create duplicates.
- Brief connection loss does not destroy the session.

### Tests and Verification

- Test slow network, timeout, disconnect, reconnect, and conflict.

---

## Task 11.3 — Complete Accessibility Review and Remediation

### Requirements

Verify:

- Accessible labels
- Touch target sizes
- Contrast
- Text scaling
- Logical focus order
- Screen-reader descriptions
- Non-color status meaning
- Keyboard behavior for forms

### Acceptance Criteria

- Critical workflows are usable with screen reader support.
- No essential status depends only on color.
- Large text does not break the primary workflow.

### Tests and Verification

- Add automated checks where supported.
- Perform manual accessibility review.

---

## Task 11.4 — Complete Performance Review and Remediation

### Requirements

Review:

- Startup
- Today screen query count
- Card rendering
- Repeated data fetches
- Cache behavior
- Realtime subscriptions
- Mutation response
- Tablet rendering

### Acceptance Criteria

- Today becomes usable within a few seconds on normal Wi-Fi.
- Lists remain smooth for approximately 36 bunks.
- No per-card duplicate backend queries occur.
- Dashboard updates do not reload the entire application.

### Tests and Verification

- Measure and document representative performance.
- Verify on at least one older or moderate-performance device if available.

---

## Task 11.5 — Build End-to-End Operational Test Scenarios

### Requirements

Create repeatable scenarios for:

- Sign in
- Create draft day
- Open day
- Prepare special snacks
- Complete pickups
- Adjust actual quantity
- Handle duplicate attempt
- Reopen mistake
- Inventory adjustment
- Close day
- Review history
- Administrator correction

### Acceptance Criteria

- All critical MVP workflows are covered.
- Test data resets cleanly.
- Failures identify the broken workflow clearly.

---

# EPIC 12 — Production Readiness and Pilot Deployment

## Objective

Prepare a secure production environment, complete device testing, distribute the app privately, run a real-world pilot, and release the approved MVP.

## Success Criteria

- Production is separate from development.
- Security and backups are configured.
- Builds work on iPhone, iPad, and Android.
- Pilot users can install and use the app.
- Critical pilot issues are resolved.
- The MVP is approved for regular use.

---

## Task 12.1 — Create and Configure Production Supabase

### Requirements

- Create a separate production project.
- Apply version-controlled migrations.
- Configure RLS.
- Configure authentication.
- Configure backups appropriate to the service level.
- Do not load development seed data.
- Add only approved production users and operational data.

### Acceptance Criteria

- Development and production are isolated.
- Security tests pass against production configuration.
- No development credentials are used in production builds.

### Tests and Verification

- Run migration verification.
- Run production security smoke tests.

---

## Task 12.2 — Create Production Data Import and Setup Process

### Requirements

Create a controlled process to load:

- Final bunk roster
- Divisions
- Camper counts
- Counselors
- Special requirements
- Staff accounts
- Initial inventory configuration

Include validation and error reporting.

### Acceptance Criteria

- Duplicate bunk codes are prevented.
- Invalid counts or requirement values are reported.
- Sensitive data is handled only in approved production workflows.
- Import can be reviewed before final commit where practical.

### Tests and Verification

- Test with representative sample import.
- Verify final counts.

---

## Task 12.3 — Configure Expo Application Services and Internal Builds

### Requirements

Configure:

- Development build
- Preview/internal build
- Production build
- iOS identifier
- Android package identifier
- Environment-specific variables
- App name and icon
- Versioning

### Acceptance Criteria

- Installable iOS and Android builds are produced.
- Builds connect to the correct environment.
- No secret credentials are bundled.
- App identity is correct.

### Tests and Verification

- Install builds on supported devices.
- Verify environment connection.

---

## Task 12.4 — Complete Device and Real-World Workflow Testing

### Requirements

Test on:

- iPhone
- iPad or tablet layout
- Android phone

Test conditions:

- Normal Wi-Fi
- Slow Wi-Fi
- Brief disconnect
- Multiple simultaneous users
- Large text
- App background/resume
- Repeated taps
- Session expiration
- Full simulated snack hour

### Acceptance Criteria

- Critical workflows succeed on all required device types.
- No device-specific blocker remains.
- Results are documented in the implementation log.

---

## Task 12.5 — Create Staff and Administrator Operating Guides

### Requirements

Create concise guidance for:

- Installing the app
- Signing in
- Opening Today
- Preparing special snacks
- Recording a pickup
- Adjusting quantity
- Correcting a mistake
- Viewing remaining bunks
- Closing a day
- Managing bunks and requirements
- Responding to connection errors

### Acceptance Criteria

- A new staff member can use the app with minimal training.
- Administrator-only steps are clearly separated.
- Guidance reflects the actual final UI.

---

## Task 12.6 — Run Pilot Deployment

### Requirements

- Select a limited pilot group.
- Load approved real operational data.
- Run at least one complete snack-distribution session.
- Record usability, accuracy, synchronization, and reliability issues.
- Categorize issues as critical, high, medium, or low.

### Acceptance Criteria

- The pilot completes without relying on the old spreadsheet for normal operation, except as an approved backup.
- All critical and high-severity issues are documented.
- User feedback is captured.

---

## Task 12.7 — Resolve Pilot Issues and Complete Regression Testing

### Requirements

- Fix all release-blocking issues.
- Add regression tests for defects.
- Re-run affected workflows.
- Update documentation.
- Do not add unrelated post-MVP features.

### Acceptance Criteria

- No unresolved critical or high-severity defect remains.
- Regression suite passes.
- Device testing remains successful.

---

## Task 12.8 — Approve and Release MVP

### Requirements

Before release, verify:

- All MVP Epics complete
- All tests pass
- Architecture compliance confirmed
- Production RLS verified
- Backups configured
- Installation instructions complete
- Staff accounts active
- Pilot approved
- Rollback procedure documented

### Acceptance Criteria

- WSD approves regular operational use.
- Production application is distributed to authorized users.
- Release version is tagged in source control.
- `IMPLEMENTATION-LOG-MVP.md` records the release.
- Remaining enhancements are moved to a post-MVP roadmap.

---

# 5. Cross-Epic Test Requirements

The following tests must exist before MVP release:

## Application

- Authentication
- Session restoration
- Role-aware navigation
- Bunk search and filtering
- Special requirement display
- Snack-day creation
- Snack-day opening
- Pickup completion
- Duplicate pickup prevention
- Quantity adjustment
- Pickup reopening
- Dashboard calculations
- Remaining-bunk filtering
- Inventory calculations
- Inventory adjustments
- Snack-day closure
- History display
- Administrative corrections
- Error normalization
- Loading, empty, and failure states

## Database

- Schema constraints
- Foreign keys
- Unique snack-day/bunk pickup
- RLS for anonymous, staff, administrator, and deactivated users
- Atomic snack-day opening
- Atomic pickup completion
- Atomic day closure
- Closed-day protection
- Audit-event creation
- Inventory reconciliation

## Manual Device Testing

- iPhone
- iPad/tablet
- Android
- Multiple users
- Slow network
- Disconnect/reconnect
- Large text
- Screen reader review
- App background/resume
- Full snack-hour simulation

---

# 6. Initial MVP Assumptions

This first plan assumes:

- The project is a coded React Native Expo application, not an AppSheet application.
- One shared codebase supports iPhone, iPad, and Android.
- Supabase is the backend and system of record.
- Staff must authenticate.
- There are approximately 36 bunks.
- One pickup record exists per bunk per snack day.
- Expected and actual quantities are separate.
- Administrators maintain roster, requirement, and user data.
- Staff primarily use Today, Remaining, Special Snacks, and History.
- Internet access is normally available.
- Temporary connectivity failure must be handled safely.
- Full offline synchronization is outside the MVP.
- Historical records are preserved.
- Closed days are not editable by regular staff.
- Allergy and medical data is limited to operationally necessary information.
- The first release may use private internal distribution instead of public app stores.
- Attendance-system integration is outside the MVP.
- Counselor signatures, push notifications, barcode scanning, and AI forecasting are outside the MVP.

---

# 7. Implementation Status

## Current Epic

**EPIC 1 — Project Foundation**

## Next Task

**Task 1.4 — Configure Code Quality and Test Tooling**

---

# 8. Task Checklist

## EPIC 1 — Project Foundation

- [x] Task 1.1 — Create the React Native Expo Project
- [x] Task 1.2 — Add Required Project Documentation
- [x] Task 1.3 — Configure Project Structure
- [ ] Task 1.4 — Configure Code Quality and Test Tooling
- [ ] Task 1.5 — Configure Expo Router and Navigation Shell
- [ ] Task 1.6 — Create the Base Theme and Shared UI Primitives
- [ ] Task 1.7 — Configure Environment Management
- [ ] Task 1.8 — Verify Architectural Compliance of the Foundation

## EPIC 2 — Supabase Foundation and Core Data Model

- [ ] Task 2.1 — Create and Configure the Development Supabase Project
- [ ] Task 2.2 — Create Core Database Enums and Reference Types
- [ ] Task 2.3 — Create Profiles, Bunks, and Counselor Tables
- [ ] Task 2.4 — Create Special Requirements Table
- [ ] Task 2.5 — Create Snack Day and Pickup Tables
- [ ] Task 2.6 — Create Inventory and Audit Tables
- [ ] Task 2.7 — Add Updated-Timestamp and Audit Support
- [ ] Task 2.8 — Enable Row-Level Security and Baseline Policies
- [ ] Task 2.9 — Create Development Seed Data
- [ ] Task 2.10 — Generate Typed Database Definitions and Data Access Foundation

## EPIC 3 — Authentication and Role-Based Access

- [ ] Task 3.1 — Implement Authentication Service and Session Provider
- [ ] Task 3.2 — Build the Sign-In Screen
- [ ] Task 3.3 — Implement Route Guards and Role-Aware Navigation
- [ ] Task 3.4 — Build User Profile and Sign-Out UI
- [ ] Task 3.5 — Verify Authentication and Authorization Security

## EPIC 4 — Master Bunk Roster

- [ ] Task 4.1 — Implement Bunk Data Services and Query Hooks
- [ ] Task 4.2 — Build the Staff Bunk Directory
- [ ] Task 4.3 — Build Administrator Bunk Management
- [ ] Task 4.4 — Build Counselor Assignment Management
- [ ] Task 4.5 — Complete Roster Integration and Review

## EPIC 5 — Special Snack Requirements

- [ ] Task 5.1 — Implement Special Requirement Services and Hooks
- [ ] Task 5.2 — Create Special Requirement Presentation Components
- [ ] Task 5.3 — Build the Special Snacks Preparation Screen
- [ ] Task 5.4 — Build Administrator Requirement Management
- [ ] Task 5.5 — Integrate Requirements into Bunk and Daily Views

## EPIC 6 — Daily Snack Setup

- [ ] Task 6.1 — Implement Snack Day Services and Queries
- [ ] Task 6.2 — Create Atomic Open-Snack-Day Database Function
- [ ] Task 6.3 — Build the Create Snack Day Screen
- [ ] Task 6.4 — Build the Open Day Confirmation Workflow
- [ ] Task 6.5 — Build No-Open-Day and Draft-Day States

## EPIC 7 — Snack Pickup Workflow

- [ ] Task 7.1 — Implement Pickup Query and Mutation Services
- [ ] Task 7.2 — Create Atomic Complete-Pickup Database Function
- [ ] Task 7.3 — Build the Bunk Pickup Card
- [ ] Task 7.4 — Build the Pickup Confirmation and Quantity Workflow
- [ ] Task 7.5 — Implement Reopen Pickup Workflow
- [ ] Task 7.6 — Integrate Pickup Workflow into the Today Screen

## EPIC 8 — Daily Dashboard and Remaining Bunks

- [ ] Task 8.1 — Build the Daily Dashboard UI and Data Contract
- [ ] Task 8.2 — Build the Remaining Bunks Screen
- [ ] Task 8.3 — Build Completed and All-Bunks Views
- [ ] Task 8.4 — Add Division Progress Summaries

## EPIC 9 — Inventory Management

- [ ] Task 9.1 — Implement Inventory Calculation Domain Logic
- [ ] Task 9.2 — Implement Inventory Services and Hooks
- [ ] Task 9.3 — Build Current Inventory Display
- [ ] Task 9.4 — Build Administrator Inventory Adjustment Workflow
- [ ] Task 9.5 — Build Daily Inventory Reconciliation

## EPIC 10 — History, Day Closure, and Corrections

- [ ] Task 10.1 — Create Atomic Close-Snack-Day Database Function
- [ ] Task 10.2 — Build Day Closure Review Screen
- [ ] Task 10.3 — Build Snack Day History List
- [ ] Task 10.4 — Build Historical Day Detail Screen
- [ ] Task 10.5 — Build Administrator Correction Workflow

## EPIC 11 — Reliability, Accessibility, and Multi-Device Synchronization

- [ ] Task 11.1 — Implement Active-Day Realtime Synchronization
- [ ] Task 11.2 — Implement Connectivity and Retry UX
- [ ] Task 11.3 — Complete Accessibility Review and Remediation
- [ ] Task 11.4 — Complete Performance Review and Remediation
- [ ] Task 11.5 — Build End-to-End Operational Test Scenarios

## EPIC 12 — Production Readiness and Pilot Deployment

- [ ] Task 12.1 — Create and Configure Production Supabase
- [ ] Task 12.2 — Create Production Data Import and Setup Process
- [ ] Task 12.3 — Configure Expo Application Services and Internal Builds
- [ ] Task 12.4 — Complete Device and Real-World Workflow Testing
- [ ] Task 12.5 — Create Staff and Administrator Operating Guides
- [ ] Task 12.6 — Run Pilot Deployment
- [ ] Task 12.7 — Resolve Pilot Issues and Complete Regression Testing
- [ ] Task 12.8 — Approve and Release MVP