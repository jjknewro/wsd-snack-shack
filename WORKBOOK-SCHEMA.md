# WSD Snack Shack — Existing Workbook Schema

## Status

Documented 2026-07-19, from a workbook export (`Snack Shack today.xlsx`) placed in the project root by the user.

## Purpose

This document is the ground truth for the Snack Shack's **existing** Google Sheets workbook, as it is actually structured today — not as the application will eventually want it. Per `IMPLEMENTATION-PLAN-MVP.md` Task 2.1, no application development may proceed based on undocumented cell positions; this document is what makes that possible.

## Source File Handling

- The workbook export lives at the project root as `Snack Shack today.xlsx`, for local reference only.
- **It is not committed to git** (`.gitignore` now excludes `*.xlsx`/`*.xls`) — it contains real counselor names (personal data) and is a snapshot of live operational data, not application source. If a fresh copy is ever needed for reference, re-export it from the live Google Sheet; don't assume the local copy is current.
- The live Google Sheet itself remains the actual source of truth once the Apps Script backend is built (EPIC 3) — this local export is a point-in-time reference for building that backend correctly, not a data source the app will ever read directly.

## Worksheets

Three worksheets exist: `Master Roster`, `snack shack today`, `Allergies` — matching what `ARCHITECTURE.md` and the plan already assumed by name. Their internal structure, documented below, differs from what was assumed in several important ways.

---

## Worksheet: `Master Roster`

Header row: row 1. Used columns: A–F. Columns G–Z are part of the sheet's formatted range but contain no headers or data in any row — not structurally meaningful, likely leftover formatting. 35 data rows (rows 2–36), one per bunk.

| Col | Header | Type as used | Authoritative | Notes |
|---|---|---|---|---|
| A | Division | Text | Yes | 6 distinct values, in the order bunks appear: `EC`, `K`, `1st`, `2nd`, `3rd`, `4th/Sr` |
| B | Bunk | Text | Yes | Unique per row. Camp's own bunk-code convention, e.g. `PN1`–`PN3`, `N1`–`N5`, `K1`–`K7`, `JB1A`–`JB1C`, `JG1A`–`JG1C`, `JB2A`–`JB2E`, `JG2A`–`JG2B`, `IB3A`–`IB3B`, `IG3A`–`IG3B`, `IB4`, `IG4/SG`, `SB` |
| C | Campers | — | **No — unused** | Header exists but the column is **entirely empty across all 35 rows**. No camper count or camper list is recorded anywhere in this workbook. Application logic must not assume this column ever has data. |
| D | Counselors | Text | Yes | Counselor first name(s); multiple counselors separated by `/` (e.g. `"Name1 / Name2"`). No further structure. |
| E | Special Snack | Text | Yes, but see data-quality note | Free text, inconsistently formatted. Appears to encode `"<quantity> <abbreviation>"` but the format varies row to row, and a single cell can combine multiple requirements with no consistent delimiter (e.g. `"1 DF & Soy free, 1GF"`). Distinct values observed: `Nurse`, `1 DF`, `1 corn syrup`, `1 red dye free`, `1 GF`, `2 Cholov Yisroel`, `1 DF & Soy free, 1GF`, `1 GF & DF`, `2 GF`. |
| F | Notes | Text | Yes | Free text, sparsely used (8 of 35 rows). |

**Data-quality issues:**
- `Special Snack`'s free text is not mechanically parseable into a stable requirement type + quantity without a normalization step (relevant to Task 2.6, workbook validation rules).
- `Campers` is a dead column — present but unused. Camper counts, if they exist at all, are not tracked in this workbook today.

---

## Worksheet: `snack shack today`

Header row: row 1. Same six-column shape as `Master Roster`, but column A is different, and the data itself is a separately-maintained (not programmatically synced) daily copy.

| Col | Header | Type as used | Authoritative | Notes |
|---|---|---|---|---|
| A | *(none)* | **Checkbox (boolean)** | Yes | Cell A1 itself is a checkbox showing `FALSE`, not a text label — this column has no header. All 34 rows currently `FALSE`. This is the "picked up?" tracking column `ARCHITECTURE.md`'s Spreadsheet Structure section refers to as pickup status. |
| B | Bunk | Text | Yes, but see gap below | Bunk code, same convention as `Master Roster`. |
| C | Campers | — | **No — unused** | Same dead-column situation as `Master Roster`. |
| D | Special Snack | Text | Yes, but see data-quality note | Free text. **Independently retyped from `Master Roster`, not copied** — wording differs for what is evidently the same underlying data (e.g. `"Corn Syrup"` here vs. `"1 corn syrup"` in `Master Roster`; `"No Dye"` here vs. `"1 red dye free"` there). Do not treat this column as authoritative for requirement content; treat `Allergies` as authoritative instead (see below). |
| E | Notes | Text | Yes | Free text. |
| F | Time | — | Yes (when populated) | Intended to record pickup completion time. **Entirely empty in every row** in this snapshot — consistent with "not yet picked up," but also means no example of its populated format was available to document. |

**Data-quality issue — real integrity gap, not just messiness:** `Master Roster` has 35 bunks; `snack shack today` has only **34**. Diffed directly: bunk **`SB`** exists in `Master Roster` but is **missing entirely** from `snack shack today`. This means `snack shack today` was not regenerated from the current roster — it's drifted. Any snack-day-initialization logic (EPIC 5, Task 5.2) that naively trusts this sheet's bunk list rather than deriving fresh from `Master Roster` would silently drop a bunk. **Needs operator confirmation**: was `SB` intentionally not running the day this snapshot was taken, or is this a sync gap that should be fixed before building on top of it?

---

## Worksheet: `Allergies`

**Not a simple flat table starting at row 1** — this is the most structurally irregular of the three sheets:

| Row | Content |
|---|---|
| 1 | Entirely blank (all of A–C). |
| 2 | A banner/title string in column A only: `"🚨 WSD Snack Shack Special Orders"`. Columns B and C blank. Purely decorative — not data. |
| 3 | **The real header row**: `Bunk`, `Requirement`, `Quantity`. |
| 4–14 | Real per-bunk requirement records (11 rows, bunks `PN2` through `IB4`). |
| 15 | **Anomalous**: `Bunk` = `"?"` (a literal question mark), with a requirement description (`"3 Cholov Yisreol - Parve only"`) but no resolvable bunk. An orphaned/unassigned special order. |
| 16 | **Anomalous**: no `Bunk` or `Requirement` at all — only `Quantity` = `"17"`. Almost certainly a manually-entered running total that ended up inside the data range, not a real record. |

| Col | Header | Type as used | Authoritative | Notes |
|---|---|---|---|---|
| A | Bunk | Text | Yes (rows 4–14) | Bunk code, same convention as the other sheets. |
| B | Requirement | Text, free-form | Yes, but not a controlled vocabulary | Distinct values: `Nurse`, `Dairy Free`, `No red dye`, `Gluten Free`, `Gluten Free + No Soy/Dairy`, `Gluten Free + Dairy Free`, `2 Gluten Free`, `3 Cholov Yisreol - Parve only`. Note the same underlying requirement ("kosher dairy") is spelled two different ways across the workbook: `Cholov Yisroel` (`Master Roster`) vs. `Cholov Yisreol` (here). |
| C | Quantity | **Text**, not a real number type | Yes (rows 4–14) | Stored as strings (`"1"`, `"2"`, `"17"`), not numeric cells. |

Of the three sheets, `Allergies` is the closest thing to a structured source of truth for special dietary/medical requirements — but it still needs real cleanup (controlled vocabulary, numeric quantity, resolving the orphaned/total rows) before an application can safely read it.

---

## Cross-Sheet Observations

- **Bunk code is the join key** across all three sheets, but is **not guaranteed consistent** — see the `SB` gap above.
- **No stable Bunk ID separate from the bunk-code string exists anywhere.** Task 2.3 (Add Permanent IDs to Master Data) will need to add this without disrupting the existing bunk-code-based workflow the operator already knows.
- **No camper-level data exists anywhere in this workbook.** Only aggregate special-requirement quantities per bunk are tracked. The application's data model must not assume individual camper records are readable from the sheet as currently maintained — `README-MVP.md`'s "MVP Goals" (camper counts) may need revisiting against this reality, or camper counts need a new place to live.
- **Special/dietary requirement information is redundantly encoded in three different places** with three different free-text formats: `Master Roster.Special Snack`, `snack shack today.Special Snack` (independently retyped, already diverged from `Master Roster`'s wording), and `Allergies.Requirement`/`Quantity`. Recommend `Allergies` as the eventual single source of truth once Task 2.6 validation exists; treat the other two `Special Snack` columns as legacy/display-only during any transition, since they're already inconsistent with each other today.

## Open Questions for the Operator

Tracked centrally in `open-questions.md` (alongside any non-workbook questions from other tasks), not duplicated here. As of this writing: the `SB` gap, the unresolved `"?"` bunk, the stray `Quantity = "17"` row, and what the unused `Campers` column was ever meant to hold.
