# ARCHITECTURE.md

# WSD Snack Shack MVP Architecture

## Status

MVP Architecture

---

# Primary Objective

Create the fastest, simplest, and most reliable way for a Snack Shack operator to distribute snacks, manage special dietary requirements, record bunk pickups, and maintain operational records with as little effort as possible.

The MVP is intentionally designed for a **single operator** using a mobile device.

The application should require minimal setup while remaining easy to expand in the future.

---

# Guiding Principles

1. Simplicity over complexity.
2. Mobile-first design.
3. Google Sheets is the source of truth.
4. Existing workflow should change as little as possible.
5. Business logic belongs in the application—not in spreadsheet formulas.
6. Every data operation should go through a controlled API.
7. Design for future growth without overengineering the MVP.

---

# High Level Architecture

```
                React + Vite PWA
            (iPhone / Android / iPad)

                     │
               HTTPS Requests
                     │

             Google Apps Script API

                     │

             Existing Google Sheets
```

---

# Technology Stack

## Frontend

- React
- Vite
- TypeScript
- React Router
- TanStack Query
- React Hook Form

---

## Backend

Google Apps Script

Responsibilities:

- Read workbook data
- Validate requests
- Update Google Sheets
- Archive completed snack days
- Return JSON responses

---

## Data Store

Google Sheets

Current workbook:

- Master Roster
- snack shack today
- Allergies

Future tabs:

- Pickup History
- Settings

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

Google Sheets Repository

↓

Apps Script API

↓

Google Sheets
```

---

# Repository Pattern

The application must never communicate directly with Google Sheets.

Instead, every request flows through a repository.

Example:

```
SnackRepository

├── getRoster()

├── getToday()

├── getSpecialRequirements()

├── startSnackDay()

├── completePickup()

├── closeSnackDay()

├── getHistory()
```

If a database is introduced later, only the repository implementation changes.

---

# Google Apps Script API

The Apps Script project acts as the application's backend.

Example endpoints:

GET

- roster
- today
- requirements
- history

POST

- startSnackDay
- completePickup
- closeSnackDay
- updateRequirement

All requests return JSON.

---

# Spreadsheet Structure

## Master Roster

Source of truth for:

- divisions
- bunks
- camper counts
- counselors
- notes

Each row should receive a permanent ID.

---

## snack shack today

Generated each snack day.

Contains:

- pickup status
- timestamps
- expected counts
- actual counts

---

## Allergies

(Currently named Allergies.)

Stores:

- bunk
- requirement
- quantity

This may later be renamed:

Special Requirements

---

## Pickup History

Append-only.

Every completed pickup becomes one historical record.

No historical data should ever be deleted.

---

# Authentication

MVP

Single authorized operator.

The Apps Script deployment will be restricted to the authorized Google account or protected with a private application token.

No user management is required.

---

# Offline Behavior

Not required for MVP.

If connectivity is lost:

- display an error
- preserve unsaved form state
- allow retry

---

# Error Handling

Every API request should return:

Success

```
{
    success: true,
    data: ...
}
```

Failure

```
{
    success: false,
    message: "...",
    errorCode: "..."
}
```

---

# Logging

Apps Script logs all write operations.

The application displays user-friendly messages.

---

# Security

Only the Apps Script backend accesses Google Sheets.

The mobile application never communicates directly with the Sheets API.

Spreadsheet structure should not be exposed to UI components.

---

# Testing Strategy

Unit Tests

- business services
- repository
- validation

Integration Tests

- Apps Script endpoints

Manual Tests

- snack day workflow
- pickup workflow
- history
- special requirements

---

# Future Expansion

The architecture intentionally allows replacing Google Sheets without rewriting the application.

Possible future repositories:

- GoogleSheetsRepository
- SupabaseRepository
- PostgreSQLRepository

No UI changes should be required.

---

# Architecture Rules

✔ UI never edits spreadsheets directly.

✔ UI communicates only with business services.

✔ Business services communicate only with repositories.

✔ Repositories communicate only with Apps Script.

✔ Apps Script is the only component allowed to modify Google Sheets.

✔ Every historical record is append-only.

✔ Permanent IDs are never reused.

✔ MVP favors simplicity over scalability.

---

# Out of Scope (MVP)

- Multiple users
- Role-based permissions
- Offline synchronization
- Push notifications
- Inventory forecasting
- Realtime collaboration
- Native mobile applications
- App Store deployment
- Database backend

These may be introduced after the MVP is validated.