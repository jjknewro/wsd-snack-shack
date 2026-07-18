# WSD Snack Shack Mobile Application — Architecture

## 1. Purpose

This document defines the approved technical architecture for the WSD Snack Shack Mobile Application MVP.

It establishes:

- The application structure
- Technology responsibilities
- Data ownership
- Security boundaries
- Database design
- Core workflows
- Error-handling expectations
- Testing strategy
- Deployment model
- Architectural constraints

All implementation work must conform to this document unless an architectural change is explicitly reviewed and approved.

---

# 2. Architectural Objective

The architecture must support the primary product objective:

> Create the fastest, simplest, and most reliable way for Snack Shack staff to distribute snacks, manage dietary restrictions, track inventory, and record bunk pickups with as little effort required as possible while maintaining accurate operational records.

The architecture should prioritize:

1. Operational simplicity
2. Fast mobile interaction
3. Accurate data
4. Secure access
5. Reliable synchronization
6. Easy maintenance
7. Future extensibility
8. Minimal technical complexity

The MVP should avoid unnecessary infrastructure, services, abstractions, and dependencies.

---

# 3. High-Level Architecture

The system will use a client-server architecture.


┌─────────────────────────────────────┐
│      WSD Snack Shack Mobile App     │
│                                     │
│ React Native + Expo                 │
│ iPhone / iPad / Android             │
│                                     │
│ - User interface                    │
│ - Navigation                        │
│ - Local form state                  │
│ - Validation                        │
│ - Data queries and mutations        │
└──────────────────┬──────────────────┘
                   │
                   │ Secure HTTPS
                   │
┌──────────────────▼──────────────────┐
│              Supabase               │
│                                     │
│ - PostgreSQL database               │
│ - Authentication                    │
│ - Row-level security                │
│ - Database functions                │
│ - Audit information                 │
│ - Realtime updates where useful     │
└─────────────────────────────────────┘

The mobile application will not communicate directly with an independently maintained custom backend during the MVP.

Supabase will provide the backend services required by the application.

4. Approved Technology Stack

4.1 Mobile Application

React Native
Expo
TypeScript
Expo Router
TanStack Query
React Hook Form
Schema-based validation
Expo SecureStore for authentication session storage

4.2 Backend

Supabase
PostgreSQL
Supabase Authentication
Supabase Row-Level Security
Supabase database functions where atomic operations are required
Supabase Realtime only where it provides clear operational value

4.3 Testing

Jest
React Native Testing Library
TypeScript compile checks
ESLint
Automated database and security-policy tests
Manual device testing on iPhone, iPad, and Android

4.4 Source Control and Delivery

GitHub repository
Environment-specific configuration
Expo Application Services for mobile builds
Supabase development and production environments

5. Architectural Decisions

5.1 One Shared Mobile Codebase

The application will use one React Native codebase for:

iPhone
iPad
Android

Platform-specific code should only be introduced when required for usability or operating-system behavior.

Business logic must not be duplicated by platform.

5.2 Supabase as the Backend

Supabase will provide:

User authentication
Relational data storage
Authorization enforcement
Database transactions
Historical records
Audit metadata
Optional realtime synchronization

A separate Flask, Node, or other custom API will not be introduced during the MVP unless a requirement cannot be safely implemented through Supabase.

Any proposal for a custom API must be treated as an architectural change.

5.3 Database as the Source of Truth

Supabase PostgreSQL is the authoritative source for:

Bunks
Camper counts
Counselor information
Special snack requirements
Snack days
Pickup records
Inventory records
User roles
Historical data

The mobile application must not maintain an independent permanent copy of operational data.

Local application state may temporarily hold:

Form values
Query results
Pending UI changes
Session information
Retry state

Local state must not replace the database as the system of record.

5.4 Historical Records Must Be Preserved

Daily pickup information must be stored as dated transaction records.

The system must not reset daily status by overwriting prior-day records.

For every snack day, the system will create a separate pickup record for each active bunk.

Example:

July 20 — K1 — Picked up
July 21 — K1 — Not yet picked up

These are two separate records.

5.5 Expected and Actual Quantities Are Separate

The application must store:

Expected quantity
Actual quantity distributed

The expected quantity represents the planned number of snacks.

The actual quantity represents what staff physically distributed.

The application must never assume these values are permanently identical.

5.6 Security Must Be Enforced in the Backend

The mobile interface may hide controls based on user role, but the interface is not the security boundary.

Authorization must be enforced through:

Supabase Authentication
Database constraints
Row-Level Security policies
Restricted database functions
Server-generated audit fields

A user must not gain administrative access by modifying client-side state.

6. Application Layers

The mobile application will be organized into clearly separated layers.

Presentation Layer
       ↓
Application / Feature Layer
       ↓
Domain Rules and Validation
       ↓
Data Access Layer
       ↓
Supabase

6.1 Presentation Layer

Responsible for:

Screens
Buttons
Cards
Forms
Alerts
Navigation
Loading indicators
Error messages
Accessibility
Responsive layouts

The presentation layer must not contain direct SQL or complex database logic.

6.2 Feature Layer

Organized around user capabilities rather than generic technical categories.

Initial features:

features/
├── authentication/
├── dashboard/
├── bunks/
├── special-requirements/
├── snack-days/
├── pickups/
├── inventory/
├── history/
└── administration/

Each feature may contain:

feature/
├── components/
├── screens/
├── hooks/
├── services/
├── schemas/
├── types/
└── tests/

Feature-specific logic should remain inside the owning feature.

6.3 Shared Layer

Reusable application-wide functionality will be placed in shared directories.

src/
├── components/
├── constants/
├── hooks/
├── lib/
├── services/
├── theme/
├── types/
└── utils/

Shared code should only contain functionality used by more than one feature.

The project must avoid moving code into shared folders prematurely.

6.4 Data Access Layer

All Supabase access must pass through typed service or repository functions.

Screens should not repeatedly construct raw Supabase queries.

Example:

getTodaySnackDay()
getPickupRecordsForSnackDay(snackDayId)
markBunkPickedUp(input)
createSnackDay(input)
updateBunk(input)

Benefits:

Centralized error handling
Consistent query behavior
Easier testing
Reduced duplication
Stronger typing
Easier future backend changes

7. Proposed Project Structure

wsd-snack-shack/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── sign-in.tsx
│   ├── (staff)/
│   │   ├── _layout.tsx
│   │   ├── today.tsx
│   │   ├── remaining.tsx
│   │   ├── special-snacks.tsx
│   │   └── history.tsx
│   └── (admin)/
│       ├── _layout.tsx
│       ├── bunks.tsx
│       ├── requirements.tsx
│       ├── inventory.tsx
│       └── users.tsx
│
├── src/
│   ├── components/
│   ├── features/
│   │   ├── authentication/
│   │   ├── dashboard/
│   │   ├── bunks/
│   │   ├── special-requirements/
│   │   ├── snack-days/
│   │   ├── pickups/
│   │   ├── inventory/
│   │   ├── history/
│   │   └── administration/
│   ├── hooks/
│   ├── lib/
│   │   └── supabase.ts
│   ├── services/
│   ├── theme/
│   ├── types/
│   └── utils/
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── tests/
│
├── tests/
├── assets/
├── ARCHITECTURE.md
├── IMPLEMENTATION-PLAN-MVP.md
├── IMPLEMENTATION-LOG-MVP.md
├── README-MVP.md
├── .env.example
├── app.json
├── package.json
└── tsconfig.json

Expo Router requires route files within the app directory.

Reusable business functionality should be placed under src, not embedded entirely in route files.

8. Navigation Architecture

The app will use role-aware navigation.

8.1 Signed-Out Navigation

Available screen:

Sign In

Unauthenticated users must not access operational screens.

8.2 Staff Navigation

Primary staff screens:

Today
Remaining
Special Snacks
History

The Today screen should be the default screen after login.

8.3 Administrator Navigation

Administrators receive all staff screens plus:

Manage Bunks
Manage Requirements
Manage Snack Days
Manage Inventory
Manage Users
Correct Historical Records

Administrative functions should be visually separated from the daily operational workflow.

8.4 Navigation Guarding

Navigation access must be controlled by:

Authenticated session state
User role loaded from the backend
Route guards
Backend authorization policies

Route guards improve user experience but do not replace backend security.

9. Database Architecture

9.1 Core Tables

The MVP will use the following core tables:

profiles
bunks
bunk_counselors
special_requirements
snack_days
snack_day_staff
pickup_records
inventory_records
inventory_adjustments
audit_events

The final schema may consolidate or extend these tables where justified, but the underlying responsibilities must remain clear.

10. Core Data Entities
10.1 Profiles

Stores application-specific user information linked to Supabase Authentication.

Suggested fields:

id
email
display_name
role
active
created_at
updated_at

Roles:

staff
administrator

The authenticated user ID should be the primary key or a direct foreign key to the authentication user record.

10.2 Bunks

Stores permanent bunk information.

Suggested fields:

id
bunk_code
division
display_name
camper_count
operational_notes
schedule_status
active
created_at
updated_at

Rules:

bunk_code must be unique.
Inactive bunks must remain in historical data.
Deactivating a bunk must not delete prior pickup records.
Camper count must not be negative.

10.3 Bunk Counselors

Stores counselor assignments.

Suggested fields:

id
bunk_id
counselor_name
active
created_at
updated_at

A separate counselor table is preferred over a comma-separated counselor field because it allows:

Multiple counselors
Individual updates
Future counselor accounts
Accurate display
Future reporting

The MVP does not require counselors to be application users.

10.4 Special Requirements

Stores dietary, allergy, medical, and operational requirements.

Suggested fields:

id
bunk_id
requirement_type
quantity
camper_reference
severity
preparation_instructions
operational_notes
active
created_at
updated_at

Possible requirement types:

gluten_free
dairy_free
soy_free
dye_free
corn_syrup_allergy
nurse
medical
schedule
other

Possible severity values:

information
substitution
allergy
medical

Rules:

Quantity must be greater than zero when applicable.
A bunk may have multiple special requirements.
Requirements should be deactivated rather than deleted when historical traceability is needed.
Medical and allergy requirements must receive high-visibility presentation.

10.5 Snack Days

Represents one operational snack distribution session.

Suggested fields:

id
service_date
snack_name
status
starting_inventory
opened_by
opened_at
closed_by
closed_at
notes
created_at
updated_at

Statuses:

draft
open
closed
cancelled

Rules:

Only one normal snack day may be open for a service date.
A closed day cannot be modified by regular staff.
Administrative corrections must be auditable.
Opening a day creates pickup records for all active bunks.

10.6 Snack Day Staff

Records staff assigned to a snack day.

Suggested fields:

id
snack_day_id
profile_id
created_at

This supports multiple staff members working during the same session.

10.7 Pickup Records

Stores the daily bunk pickup transaction.

Suggested fields:

id
snack_day_id
bunk_id
expected_quantity
actual_quantity
status
picked_up_at
picked_up_by
notes
created_at
updated_at

Possible statuses:

pending
completed
reopened
not_collected

Rules:

Each snack day and bunk combination must be unique.
Expected quantity is copied from the bunk count when the day opens.
Later roster changes must not retroactively alter the expected quantity.
Actual quantity remains null until completion unless intentionally entered.
Completion must record both user and time.
Duplicate completion submissions must not create duplicate records.

Unique database constraint:

UNIQUE(snack_day_id, bunk_id)

10.8 Inventory Records

Stores inventory totals associated with a snack day or snack type.

Suggested fields:

id
snack_day_id
inventory_type
starting_quantity
distributed_quantity
adjustment_quantity
remaining_quantity
created_at
updated_at

The application may calculate some values, but important operational totals should be reproducible from stored transactions.

10.9 Inventory Adjustments

Stores manual changes such as:

Damaged items
Waste
Additional inventory
Count corrections

Suggested fields:

id
inventory_record_id
adjustment_type
quantity
reason
created_by
created_at

Adjustments must never silently overwrite inventory totals.

10.10 Audit Events

Records sensitive or operationally important changes.

Suggested fields:

id
entity_type
entity_id
action
previous_values
new_values
performed_by
performed_at

Audit events are particularly important for:

Reopening pickups
Correcting completed snack days
Changing allergy or medical requirements
Inventory adjustments
Role changes

The MVP may implement audit recording through database triggers or controlled service functions.

11. Entity Relationships
profiles
   ├── opens snack_days
   ├── completes pickup_records
   ├── creates inventory_adjustments
   └── performs audit_events

bunks
   ├── has many bunk_counselors
   ├── has many special_requirements
   └── has many pickup_records

snack_days
   ├── has many pickup_records
   ├── has many snack_day_staff
   ├── has inventory_records
   └── has many inventory_adjustments

pickup_records
   ├── belongs to one snack_day
   ├── belongs to one bunk
   └── may reference one completing profile

12. Daily Snack-Day Workflow

12.1 Create Day

An administrator enters:

Date
Snack name
Starting inventory
Staff on duty
Notes

The day begins in draft status.

12.2 Open Day

Opening the day must be an atomic operation.

The backend should:

Verify there is no conflicting open day.
Change the snack day status to open.
Read all active bunks.
Create one pickup record per active bunk.
Copy each current camper count into expected_quantity.
Record who opened the day and when.
Return the complete open-day summary.

This operation should be implemented through a database function or equivalent transaction-safe mechanism.

It must not depend on the mobile client successfully completing dozens of separate inserts.

12.3 Operate Day

Staff use the Today screen to:

View bunks
View requirements
Enter actual quantity where needed
Complete pickups
Reopen recent mistakes where authorized
Monitor remaining bunks
Monitor inventory

Multiple devices may operate during the same snack day.

12.4 Close Day

Closing the day should:

Identify pending bunks.
Require confirmation.
Allow pending bunks to be marked not_collected.
Calculate final distribution totals.
Calculate inventory variance.
Record the closing user and time.
Prevent regular staff modifications.

Administrative corrections after closing must create audit records.

13. Pickup Workflow

13.1 Standard Pickup

When staff taps Mark Picked Up, the app should:

Display or confirm the bunk.
Default actual quantity to expected quantity.
Allow an adjustment if required.
Submit one completion command.
Record the authenticated user.
Record the backend timestamp.
Return the updated pickup record.
Update dashboard totals.

The backend timestamp is authoritative.

13.2 Atomic Pickup Mutation

Pickup completion must be performed as one logical backend operation.

It should prevent:

Duplicate completions
Missing user attribution
Missing timestamp
Invalid actual quantities
Completion of a closed day
Completion by an unauthorized user

13.3 Optimistic User Experience

The mobile interface may immediately reflect a completed pickup to feel responsive.

However:

The UI must display a pending state until confirmed.
Failure must restore or clearly flag the prior state.
A failed request must never appear permanently successful.
Repeated taps must be disabled while the operation is pending.

13.4 Reopening a Pickup

Reopening must:

Require confirmation
Record who reopened it
Record when it was reopened
Preserve or audit the previous values
Be unavailable to unauthorized users
Be unavailable after day closure except to administrators

14. Special Snack Workflow

The Special Snacks screen should be generated from active special requirements for bunks included in the current snack day.

The screen should support:

Grouping by requirement type
Grouping by bunk
Quantity totals
Severity indicators
Preparation instructions
Camper reference when authorized and operationally necessary
Completion or preparation tracking in a future version

For the MVP, the source of truth remains the special_requirements table.

Special requirements should not be manually copied into free-text daily notes.

15. Inventory Architecture

Inventory totals should be derived from:

Starting Inventory
- Actual Snacks Distributed
+/- Manual Adjustments
= Calculated Remaining Inventory

Special snack inventory may be stored separately from standard snack inventory when quantities must be tracked independently.

The application must distinguish:

Expected distribution
Actual distribution
Inventory adjustment
Remaining inventory

Inventory corrections must include a reason and user identity.

16. Authentication Architecture

16.1 Authentication Method

The MVP will use authenticated staff accounts through Supabase Authentication.

The initial method may use:

Email and password
Email one-time link
Another approved Supabase-supported method

The specific sign-in method may be finalized during implementation, but anonymous access is prohibited.

16.2 Session Storage

Authentication sessions must be stored using secure device storage.

Sensitive tokens must not be stored in:

Plain text files
Unencrypted generic storage
Source code
Application logs
16.3 User Deactivation

A user profile may be deactivated without deleting historical actions.

A deactivated user:

Cannot access the application
Remains referenced in historical records
Must not lose prior audit attribution


17. Authorization Architecture

17.1 Staff Role

Staff may:

View the current snack day
View active bunk information
View operational special requirements
Complete pickups
Adjust actual pickup quantities
View remaining bunks
View permitted history
View current inventory

Staff may not:

Manage users
Change roles
Delete history
Modify closed days
Modify master bunk or requirement data unless explicitly granted

17.2 Administrator Role

Administrators may:

Perform all staff actions
Manage bunks
Manage counselor assignments
Manage special requirements
Create, open, close, and correct snack days
Manage inventory
Manage application users
View audit history
17.3 Row-Level Security

Every application table must have Row-Level Security enabled before production deployment.

Policies must be explicitly defined for:

Read access
Insert access
Update access
Delete access

No production table should depend on default open access.

Direct deletion should generally be prohibited for operational and historical records.

18. Sensitive Data Handling

The application may contain allergy, dietary, medical, or camper-reference information.

The architecture must therefore follow these rules:

Require authentication.
Limit data to operationally necessary information.
Restrict administrative changes.
Avoid displaying sensitive notes on screens where they are not required.
Do not include sensitive information in analytics or error logs.
Do not store sensitive information in device notifications.
Do not expose backend service credentials in the mobile application.
Preserve access and change history where appropriate.

The mobile application will only use the Supabase anonymous client key, protected by Row-Level Security.

Administrative service-role credentials must never be bundled in the app.

19. State Management

19.1 Server State

TanStack Query will manage backend-derived state, including:

Current snack day
Pickup records
Bunks
Special requirements
Inventory
History
User profile

It will provide:

Query caching
Refetching
Mutation state
Retry handling
Cache invalidation
Loading and error state
19.2 Local UI State

Local component state will manage:

Selected filters
Open dialogs
Form input before submission
Temporary search text
Confirmation state

A global state library should not be introduced unless a concrete requirement cannot be handled cleanly through:

TanStack Query
React context
Component state

19.3 Authentication State

Authentication state may use a dedicated provider responsible for:

Current session
Current user
Loaded profile
Role
Sign-in status
Sign-out
Session refresh

Authentication state must not be mixed with general application data.

20. Synchronization and Multiple Devices

Multiple staff members may use the app simultaneously.

The architecture must support:

Refreshing pickup status
Preventing duplicate completion
Seeing changes from other devices
Database-level uniqueness
Conflict-safe mutations

Supabase Realtime may be used for the active snack day to update:

Pickup completion status
Dashboard totals
Remaining-bunk lists

Realtime must not be relied upon as the only synchronization mechanism.

The app must also refetch:

When returning to the foreground
After successful mutations
When the user manually refreshes
When realtime connectivity is restored
21. Connectivity and Failure Handling

True offline synchronization is outside the initial MVP scope.

However, the application must handle temporary connectivity problems safely.

Required behavior:

Show a clear connection or request failure.
Preserve unsent form input.
Allow safe retry.
Never report a pickup as confirmed without backend confirmation.
Prevent duplicate submissions.
Refetch current state after reconnection.
Avoid losing authenticated sessions during brief network interruptions.

The application should not queue large sets of offline operational changes during the MVP because conflict resolution could create inaccurate pickup records.

A future version may add a formal offline mutation queue.

22. Validation Architecture

Validation must occur in multiple layers.

22.1 Client Validation

Used for immediate feedback:

Required fields
Number formats
Quantity limits
Valid dates
Form completeness

22.2 Service Validation

Used to enforce application rules consistently before submission.

22.3 Database Validation

Used as the final authority:

Foreign keys
Unique constraints
Check constraints
Not-null constraints
Authorization policies
Transaction rules

Client validation improves usability but cannot be trusted as the sole enforcement mechanism.

23. Error Architecture

Errors should be divided into consistent categories:

ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
NetworkError
ServerError
UnknownError

User-facing messages should explain:

What failed
Whether data was saved
What the user should do next

Examples:

Pickup was not recorded. Check your connection and try again.
This bunk was already marked as picked up by another staff member.
This snack day has been closed and can no longer be changed.

Raw database messages, stack traces, and internal identifiers must not be shown to users.

24. Logging and Audit Strategy

24.1 Application Logging

The application may log:

Screen-level failures
Query failures
Mutation failures
Unexpected application errors
Build and environment information

Logs must not include:

Passwords
Authentication tokens
Medical notes
Allergy details
Camper-identifying data
Full database records

24.2 Operational Audit History

The database should record important changes separately from technical logs.

Audited actions include:

Snack day opened
Snack day closed
Pickup completed
Pickup reopened
Historical record corrected
Inventory adjusted
Special requirement changed
User role changed


25. UI Architecture

25.1 Mobile First

The primary interface is designed for phones and tablets.

Screens must support:

Large touch targets
One-handed use where practical
Outdoor readability
Clear operational status
Minimal typing
Simple navigation
Fast return to the Today screen
25.2 Shared Components

Potential reusable components include:

AppButton
BunkCard
PickupStatusBadge
SpecialRequirementAlert
QuantityEditor
MetricCard
EmptyState
ErrorState
LoadingState
ConfirmationDialog
ScreenHeader

Components must remain presentational unless they clearly own reusable behavior.

25.3 Status Presentation

Status must not rely only on color.

For example:

Green plus “Picked Up”
Yellow plus “Special Snack”
Red plus “Allergy” or “Medical”
Blue plus “Late” or “Swim”
Gray plus “Inactive”

Icons, labels, and text must accompany color indicators.

26. Accessibility

The MVP must include:

Accessible button labels
Sufficient text contrast
Large touch areas
Screen-reader-friendly status descriptions
Logical focus order
Text alternatives for icons
No color-only meaning
Support for common mobile text scaling where practical

Accessibility should be part of component implementation rather than deferred until deployment.

27. Performance Requirements

The application should optimize for approximately 36 bunks, not massive enterprise-scale datasets.

Expected performance:

Fast startup after authentication
Today screen usable within a few seconds on normal camp Wi-Fi
Pickup update visible immediately in the UI
Confirmed backend response without unnecessary requests
Dashboard totals updated without reloading the whole app
Bunk lists rendered smoothly

The architecture should avoid premature optimization while preventing obvious problems such as:

Re-querying identical data per card
Excessive realtime subscriptions
Repeated full-table fetches
Sequential insertion of daily pickup records from the client

28. Testing Architecture

28.1 Unit Tests

Cover:

Quantity calculations
Inventory calculations
Status transformations
Validation schemas
Permission helpers
Error normalization
Date handling

28.2 Component Tests

Cover:

Bunk card rendering
Special requirement warnings
Pickup action states
Quantity editing
Loading states
Error states
Role-based control visibility

28.3 Integration Tests

Cover:

Sign-in flow
Snack day creation
Snack day opening
Pickup completion
Duplicate-pickup prevention
Remaining-bunk filtering
Snack day closing
Inventory adjustment
Role restrictions

28.4 Database Tests

Cover:

Row-Level Security
Unique constraints
Role permissions
Closed-day restrictions
Pickup mutation behavior
Snack-day opening transaction
Audit-event creation

28.5 Manual Device Testing

The MVP must be tested on:

At least one iPhone
At least one iPad or equivalent tablet layout
At least one Android phone

Testing should include:

Slow connection
Brief connection loss
Multiple simultaneous users
Accidental repeated taps
App background and resume
Session expiration
Large text settings
Real snack-distribution simulation
29. Environment Architecture

The project should support separate environments.

29.1 Development

Used by developers.

Contains:

Test users
Sample bunks
Sample requirements
Non-production snack days
29.2 Production

Used by WSD staff.

Contains:

Real operational data
Authorized users
Production security policies
Backup configuration

Development and production must not share the same database.

29.3 Environment Variables

Example:

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

Rules:

.env files must not be committed.
.env.example should contain variable names without secrets.
Service-role keys must never be exposed to the mobile application.
Environment selection must be explicit during builds.
30. Database Migration Strategy

All database changes must be represented through version-controlled migrations.

Migrations should cover:

Tables
Columns
Constraints
Indexes
Functions
Triggers
Row-Level Security policies
Seed-compatible reference data

Manual production schema changes should be avoided.

Every migration must be tested in development before production use.

31. Seed Data Strategy

Development seed data should include:

Approximately 36 representative bunks
Multiple divisions
Staff and administrator test users
Common dietary requirements
Medical and nurse examples
Open and closed snack-day examples
Completed and pending pickups
Inventory adjustments

Real camper or medical information must not be used in development seed data.

32. Deployment Architecture
32.1 Mobile Builds

Expo Application Services will produce:

iOS builds
Android builds
Internal test distributions

The initial MVP may use private or internal distribution rather than public application-store listing.

32.2 Backend Deployment

Supabase production deployment includes:

Database migrations
Row-Level Security policies
Authentication configuration
Production users
Backups
Environment variables
32.3 Release Process

A release should include:

All required tasks approved.
Automated tests passing.
Database migrations tested.
Security policies verified.
Manual device testing completed.
Production build created.
Pilot users assigned.
Pilot completed.
Critical issues corrected.
MVP approved for regular use.
33. Backup and Recovery

The production database must use available Supabase backup capabilities appropriate to the selected service level.

Recovery planning should cover:

Accidental record changes
Database migration failure
Application release failure
Deleted or deactivated users
Incorrect snack-day closure

Historical records should generally be corrected through auditable updates rather than deletion.

34. Architecture Constraints

The following constraints apply to the MVP:

One shared React Native codebase
TypeScript required
Supabase is the system of record
Authentication required
Row-Level Security required
No service-role credentials in the app
No permanent operational data stored only on the device
No custom backend without approval
No destructive deletion of historical snack records
No separate iOS and Android business logic
No spreadsheet as a production database
No untyped direct database access spread throughout screens
No task may contradict this architecture without review
35. Explicit MVP Exclusions

The following are outside the MVP architecture:

Public parent access
Parent or counselor notifications
Attendance-system integration
Barcode or QR scanning
Full offline synchronization
AI forecasting
Multi-camp tenancy
Public app-store release
Payment processing
General camp-management functionality
Automated purchasing
Native Apple- and Android-specific codebases

These may be considered in later phases.

36. Future Architectural Extensions

The architecture should permit later addition of:

Attendance integration
Counselor pickup confirmation
Push notifications
Preparation checklists
Offline mutation queue
Barcode scanning
Supply forecasting
Multi-location inventory
Advanced analytics
Camp-wide operational modules
Web-based administrative portal

These future capabilities should not be implemented prematurely during the MVP.

37. Architectural Compliance

Each implementation task must:

Follow this architecture
Use approved data boundaries
Preserve typed interfaces
Enforce backend security
Include appropriate tests
Avoid introducing duplicate architectural patterns
Reuse existing successful implementations where applicable

Before completing a task, the coding agent must verify:

The implementation conforms to ARCHITECTURE.md.
No unnecessary dependency or service was introduced.
Security rules remain enforced.
Historical data remains protected.
Relevant tests pass.
Any architectural deviation is documented and approved.
38. Architectural Change Process

An architectural change includes:

Adding a custom backend
Replacing Supabase
Replacing React Native or Expo
Introducing a new global state framework
Changing the authentication model
Altering role definitions
Changing historical-data handling
Adding offline mutation synchronization
Exposing new categories of sensitive information
Restructuring core database ownership

Architectural changes must not be made silently within an implementation task.

The proposed change must document:

The current approach
The proposed approach
Reason for the change
Benefits
Risks
Migration impact
Testing impact
Security impact

The change must be approved before implementation.

39. Final Architecture Principle

The WSD Snack Shack application is an operational tool used during a short, busy daily workflow.

The architecture must support that reality.

Technical sophistication is only valuable when it improves:

Speed
Reliability
Accuracy
Security
Maintainability
Ease of use

The simplest architecture that safely meets those needs should always be preferred.