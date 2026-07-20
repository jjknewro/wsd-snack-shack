# WSD Snack Shack Web Application (MVP)

## Project Overview

The WSD Snack Shack Web Application is a mobile-first Progressive Web App (PWA) designed to simplify and improve the daily snack distribution process at Westchester Summer Day (WSD).

The application is a static web app with no backend: bundled JSON files (mirroring the Snack Shack's real bunk roster and special-requirements data) are the source of truth for the day's roster, and the app provides a fast, guided interface on top of them during the live snack-distribution window. See `ARCHITECTURE.md`'s "Architecture Revision Note" for the two prior architecture directions this superseded.

The application is intended to run in a mobile browser (iPhone, iPad, Android) or as an installed PWA, for use by a single authorized operator.

---

# Primary Objective

**Create the fastest, simplest, and most reliable way for a single Snack Shack operator to distribute snacks, manage special dietary requirements, record bunk pickups, and maintain accurate operational records with as little effort as possible.**

Every design decision should be evaluated against this objective.

---

# MVP Goals

The MVP focuses on replacing manual spreadsheet editing during snack distribution, using bundled JSON files as the system of record for roster and special-requirement data.

The MVP will allow the operator to:

- View today's snack distribution schedule, generated from the Master Roster
- View all active bunks, camper counts, and notes
- View dietary and medical special requirements
- Initialize a snack day from current roster data
- Record bunk pickups with actual counts and timestamps
- Correct or reopen a pickup without losing the historical trail
- View remaining and completed bunks at a glance
- Review pickup history
- Close a snack day safely
- Recover clearly from data-loading errors

---

# Guiding Principles

The application should always prioritize:

1. Simplicity
2. Speed
3. Reliability
4. Accuracy
5. Ease of learning
6. Minimal user interaction
7. Mobile-first usability
8. Operational efficiency

Whenever multiple implementation approaches exist, the solution that best supports these principles should be preferred.

---

# Product Vision

The application should eventually become the operational hub for the WSD Snack Shack.

Future versions may include:

- Multi-user accounts and role-based permissions
- Inventory management
- Barcode scanning
- Counselor signatures
- Attendance integration
- Push notifications
- Reporting dashboards
- Historical analytics
- Supply forecasting
- Multi-location support
- Administrative reporting

The MVP should establish an architecture that supports these future capabilities without requiring major redesign. In particular, the repository pattern in `ARCHITECTURE.md` allows the JSON-file data store to be replaced later (for example, with browser storage, a small local server, or a real backend) without rewriting the application's UI or business logic.

---

# Intended User

## Snack Shack Operator

The MVP has a single authorized user, responsible for the full daily workflow:

- Preparing snacks
- Viewing dietary and medical requirements
- Initializing and closing snack days
- Recording, correcting, and reopening bunk pickups
- Reviewing pickup history
- Keeping the roster and special-requirements data (`src/data/*.json`) up to date — manually today; in-app editing screens are planned but not yet built (see `ARCHITECTURE.md`, "Future: Editing Seed Data")

Multi-user accounts and role-based permissions (e.g. separate staff/administrator roles) are explicitly out of scope for the MVP — see `ARCHITECTURE.md`.

---

# Success Criteria

The MVP will be considered successful when the operator can complete an entire snack distribution session using only the application, without directly editing the data files during normal use.

Success includes:

- Fast application startup
- Simple navigation
- Reliable data loading
- Accurate snack counts
- Accurate pickup records
- Easy visibility into dietary substitutions
- Minimal training required

---

# Technical Objectives

The application should:

- Run in mobile browsers on iPhone, iPad, and Android, and as an installed PWA
- Use a single shared React, Vite, and TypeScript codebase
- Keep the bundled JSON files as the authoritative data store for roster/special-requirement data
- Run entirely client-side, with no backend to protect or deploy
- Preserve historical records (append-only, once pickup history exists)
- Scale for future enhancements without requiring a rewrite

---

# Design Philosophy

The application should feel like an operational tool rather than a traditional business application.

Every screen should answer one question:

> "What does the operator need to do right now?"

Information that is not immediately useful during snack distribution should be minimized or moved to a settings/administration area.

---

# MVP Scope

Included:

- JSON data schema documentation and validation
- Snack day initialization from the Master Roster
- Pickup recording, correction, and reopening
- Special requirements visibility
- Pickup history
- Daily close workflow
- Data-load diagnostics visibility

Not included:

- Multi-user accounts and role-based permissions
- Attendance integration
- Parent notifications
- Barcode scanning
- Push notifications
- Full offline synchronization
- AI-assisted forecasting
- Multi-camp support
- Native mobile app or app store release
- Inventory forecasting

---

# Development Process

Development will follow an incremental MVP process.

Each task must:

- Be completed independently
- Be fully tested
- Be reviewed before proceeding
- Update the implementation log
- Update the implementation plan

No subsequent task may begin until the current task has been reviewed and approved.

---

# Project Documentation

The project consists of:

- README-MVP.md
- ARCHITECTURE.md
- IMPLEMENTATION-PLAN-MVP.md
- IMPLEMENTATION-LOG-MVP.md
- WORKBOOK-SCHEMA.md
- open-questions.md

These documents together define the vision, architecture, implementation roadmap, development history, existing-workbook structure, and outstanding decisions needed from the operator.

---

# Long-Term Vision

The WSD Snack Shack Web Application should evolve into a comprehensive operational platform that enables the Snack Shack to manage distribution quickly, accurately, and confidently while minimizing administrative effort — with room to grow into multi-user accounts and a database-backed system of record if the operational needs of Westchester Summer Day expand beyond a single operator and local JSON files.
