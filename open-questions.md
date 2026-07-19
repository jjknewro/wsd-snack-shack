# Open Questions

Running list of decisions or clarifications needed from the user, across all tasks — not just workbook schema ones. Kept separate from `IMPLEMENTATION-LOG-MVP.md` so outstanding items are easy to scan without digging through task history. When a question is answered, it moves to **Resolved** with the resolution noted (not deleted), so the reasoning behind later decisions stays traceable.

---

## Open

### From Task 2.1 — Workbook Schema (see `WORKBOOK-SCHEMA.md`)

1. **Bunk `SB` missing from `snack shack today`.** `Master Roster` has 35 bunks; `snack shack today` only has 34, missing `SB` entirely. Was `SB` intentionally not running the day this snapshot was taken, or is `snack shack today` out of sync with `Master Roster` and needs fixing before EPIC 5 builds snack-day initialization on top of it?
2. **Unresolved `"?"` bunk in `Allergies`.** One row has `Bunk = "?"` with a requirement of "3 Cholov Yisreol - Parve only" but no resolvable bunk. Which real bunk does this belong to?
3. **Stray `Quantity = "17"` row in `Allergies`.** One row has no `Bunk` or `Requirement`, only `Quantity = "17"`. Is this a manually-entered running total that should be excluded from the data range going forward, or does it mean something else?
4. **Unused `Campers` column.** Present (with a header) but entirely empty in both `Master Roster` and `snack shack today`. Was it ever used or intended to hold a camper count? If camper counts matter to the MVP (`README-MVP.md`'s "MVP Goals" lists viewing camper counts), where does that number currently live — paper, memory, elsewhere?

---

## Resolved

*(none yet)*
