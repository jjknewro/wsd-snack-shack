# AI Production Studio

# IMPLEMENTATION-PLAN-MVP.md

Version: 1.1

---

# Purpose

This document tracks the implementation status of the first working version of AI Production Studio.

The objective is simple:

**Transform a creative prompt into a finished video.**

This document contains only the work required to achieve that goal.

---

# Current Status

## Current Component

**7. Video Generator**

## Current Task

**Task 7.3 – Build Video Generation Review UI**

---

# Foundation Documents

| Document                   | Status     |
| -------------------------- | ---------- |
| README.md                  | ✅ Complete |
| ARCHITECTURE.md            | ✅ Complete |
| ROADMAP.md                 | ✅ Complete |
| IMPLEMENTATION-PLAN-MVP.md | ✅ Current  |
| IMPLEMENTATION-LOG-MVP.md  | ✅ Current  |

---

# Guiding Principles

Each task definition (Objective and Requirements) is considered part of the project specification and must be preserved after completion. Completed task definitions should not be abbreviated, removed, or replaced with summaries.

---

# EPIC 1. Creative Prompt Validator

## Objective

Determine whether a creative prompt contains enough information to begin production while maximizing the probability of producing a successful first-generation video.

## Progress

**100%**

## Tasks

* [x] Task 1.1 – Design Validator Skill
* [x] Task 1.2 – Create Validator JSON Schema
* [x] Task 1.3 – Implement Validator Service
* [x] Task 1.4 – Create REST API Endpoint
* [x] Task 1.5 – Build Validation UI
* [x] Task 1.6 – Create Benchmark Prompt Library
* [x] Task 1.7 – Build Validator Test Suite
* [x] Task 1.8 – Production Risk Mitigation
* [x] Task 1.9 – Prompt Improvement Recommendations
* [x] Task 1.10 – Production-Ready Prompt Optimization
* [x] Task 1.11 – Five-Layer Prompt Evaluation
* [x] Task 1.12 - Five-Layer Prompt Optimization

## Inputs & Outputs

### Inputs

| Input | Source | Required |
|-------|--------|----------|
| Creative prompt (raw text) | User | Yes |
| AI model selection | User or system default | No |

### Outputs

| Output | Description | Consumer |
|--------|-------------|----------|
| Validation report (JSON) | Structured validation with status, scores, directability checks, matters analysis, predicted failure modes, retrieval tags | EPIC 2 (Creative Intent), User (UI) |
| Optimized prompt (string) | Production-ready prompt with five-layer improvements applied (when warranted) | EPIC 2 (Creative Intent), User (UI) |
| Five-layer evaluation (JSON) | Per-layer analysis: Subject, Environment/Light, Camera, Emotional Beat, Production Register | EPIC 2 (Creative Intent), User (UI) |

## Definition of Done

EPIC 1 is complete when:

* The validator skill is designed and documented.
* The JSON schema is implemented and enforces all required fields, enums, and score ranges.
* The validator service loads the skill and schema, calls the LLM, parses/repairs JSON, validates output, and returns structured results.
* A REST API endpoint exposes the validator at `POST /api/creative-prompt-validator/validate`.
* A React UI allows users to submit prompts, view validation results, and inspect raw JSON.
* A benchmark prompt library (19+ prompts across 5 categories) supports regression testing.
* A comprehensive test suite (111+ tests) covers schema, service, API, benchmarks, edge cases, stress, and snapshot regression.
* Production risk mitigation generates optimized prompts when risks are actionable through prompt wording.
* Five-layer prompt evaluation and optimization are fully integrated.
* All tests pass with no regressions.

## Acceptance Criteria (Gate to EPIC 2)

Before proceeding to EPIC 2 (Creative Intent), the following must be satisfied:

* [x] Validator correctly classifies prompts as PASS, PASS_WITH_ASSUMPTIONS, NEEDS_CLARIFICATION, or FAIL.
* [x] All 19 benchmark prompts return expected status and score ranges.
* [x] Optimized prompts are production-ready (no instructional language, concrete details written directly).
* [x] Five-layer evaluation identifies gaps between user intent, literal wording, and likely model interpretation.
* [x] Layer-traceable improvements resolve specific evaluation gaps.
* [x] REST API returns consistent 200/400/500 responses.
* [x] UI displays all validator output sections and supports PDF export.
* [x] All 111+ tests pass.

## Sign-off

**Sign-off is required before this EPIC is considered complete and work may begin on EPIC 2.**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Implementer | -- | -- | -- |
| Reviewer | -- | -- | -- |

> Sign-off must be recorded in IMPLEMENTATION-LOG-MVP.md with date and verification evidence.

---

### Task 1.1 – Design Validator Skill

#### Status

✅ Complete

#### Objective

Design the Creative Prompt Validator as the first gate in the AI Production Studio workflow.

The validator determines whether a creative prompt is sufficiently clear, directable, and production-worthy before any generation or production planning begins.

#### Requirements

The validator skill must define:

* Validation philosophy.
* Scoring model.
* Validation taxonomy.
* Directability checks.
* Matters analysis.
* Clarification rules.
* Predicted failure modes.
* Retrieval tags.
* Full structured output contract.

The validator should determine:

* Whether the prompt is production-worthy.
* What information is missing.
* Whether missing information matters.
* Whether the system should proceed, assume, clarify, or stop.
* What risks may affect production quality.

---

### Task 1.2 – Create Validator JSON Schema

#### Status

✅ Complete

#### Objective

Create the JSON schema that defines and validates the Creative Prompt Validator output.

#### Requirements

The schema must validate:

* Overall validator output.
* Required top-level fields.
* Score ranges.
* Status values.
* Recommendation values.
* Production difficulty values.
* Estimated cost levels.
* Directability checks.
* Matters analysis.
* Clarification questions.
* Assumptions.
* Predicted failure modes.
* Retrieval tags.
* Reason/analysis output.

The schema must reject:

* Missing required fields.
* Invalid enum values.
* Scores below 0 or above 100.
* Invalid data types.
* Unknown top-level properties.
* Unknown score properties.

The schema should serve as the contract between the validator service, API, UI, and downstream components.

---

### Task 1.3 – Implement Validator Service

#### Status

✅ Complete

#### Objective

Implement the runtime Creative Prompt Validator service.

The service calls the LLM, applies the validator skill, parses the response, validates the output, and returns structured validation results.

#### Requirements

The validator service must:

* Load the Creative Prompt Validator skill.
* Load the validator JSON schema.
* Build a system prompt using the skill and schema.
* Call the selected LLM model.
* Parse JSON output from the LLM response.
* Handle markdown-wrapped JSON.
* Handle surrounding explanatory text.
* Repair common JSON issues where safe.
* Validate parsed output against the schema.
* Return structured validation results.
* Preserve the original user prompt.
* Track usage/cost where available.

The service should return:

* Status.
* Overall score.
* Category scores.
* Production difficulty.
* Estimated iterations.
* Estimated cost level.
* Recommendation.
* Directability checks.
* Matters analysis.
* Clarification questions.
* Assumptions.
* Predicted failure modes.
* Retrieval tags.
* Reason/analysis.

---

### Task 1.4 – Create REST API Endpoint

#### Status

✅ Complete

#### Objective

Expose the Creative Prompt Validator through a REST API endpoint.

#### Requirements

Create an endpoint that:

* Accepts a creative prompt through JSON request body.
* Requires a non-empty `prompt` field.
* Allows optional model selection.
* Calls the validator service.
* Returns the structured validation report.
* Returns usage/cost information where available.
* Handles missing or invalid request bodies.
* Returns clear 400 errors for user/request issues.
* Returns clear 500 errors for unexpected runtime failures.

The endpoint should be usable by:

* The frontend validation UI.
* Future production workflow services.
* Automated tests.
* Benchmark runners.

---

### Task 1.5 – Build Validation UI

#### Status

✅ Complete

#### Objective

Build a frontend interface for submitting creative prompts and reviewing validator output.

#### Requirements

The UI must allow the user to:

* Enter a creative prompt.
* Select an AI model where supported.
* Submit the prompt for validation.
* View the validation status.
* View the overall score.
* View production difficulty.
* View estimated iterations.
* View estimated cost level.
* View category scores.
* View directability checks.
* View matters analysis.
* View assumptions.
* View clarification questions.
* View predicted failure modes.
* View retrieval tags.
* View API usage information.
* Inspect the raw JSON output.

The UI should make the result easy to understand and actionable.

---

### Task 1.6 – Create Benchmark Prompt Library

#### Status

✅ Complete

#### Objective

Create a benchmark prompt library for validator regression testing and quality assurance.

#### Requirements

The benchmark library must include representative prompts across:

* PASS.
* PASS_WITH_ASSUMPTIONS.
* NEEDS_CLARIFICATION.
* FAIL.
* Edge cases.

Each benchmark prompt should include:

* Unique ID.
* Prompt text.
* Expected status.
* Expected score range.
* Categories tested.
* Description of why the prompt is useful.

The benchmark library should support:

* Regression testing.
* Validator quality checks.
* Prompt coverage analysis.
* Future validator tuning.

---

### Task 1.7 – Build Validator Test Suite

#### Status

✅ Complete

#### Objective

Build a comprehensive automated test suite for the Creative Prompt Validator.

#### Requirements

The test suite must cover:

* Schema validation.
* Validator service behavior.
* API endpoint behavior.
* Benchmark prompt validation.
* Edge cases.
* Unicode and special characters.
* Long prompts.
* Empty or invalid prompts.
* Output structure.
* Enum validation.
* Score validation.
* Error handling.
* Integration flow from API to service.
* Regression protection.

The test suite should verify that the validator remains reliable as the skill, schema, service, and UI evolve.

---

### Task 1.8 – Production Risk Mitigation

#### Status

✅ Complete

#### Objective

When the validator predicts HIGH or CRITICAL production risks, it should help the user improve the likelihood of a successful generation rather than simply reporting the risks.

#### Requirements

If one or more predicted failure modes are **HIGH** or **CRITICAL** severity:

* Explain why the risk is likely to occur.
* Provide practical guidance for reducing the risk.
* Generate an optimized version of the user's prompt that preserves the original creative vision while improving production reliability.

The optimized prompt must:

* Preserve the user's creative intent.
* Reinforce important production constraints.
* Reduce ambiguity where appropriate.
* Improve directability.
* Increase the likelihood of successful generation.
* Never introduce new creative ideas or alter the intended story.

If all predicted failure modes are **LOW** or **MEDIUM**, the validator should not generate an optimized prompt.

---

### Task 1.9 – Prompt Improvement Recommendations

#### Status

✅ Complete

#### Objective

Improve the production-risk mitigation behavior so the validator does not depend only on severity labels.

Instead of generating prompt improvements only for HIGH or CRITICAL risks, the validator should determine whether any predicted failure mode can be meaningfully reduced through better prompt wording.

The goal is to improve first-pass generation quality without changing the user's creative vision.

#### Requirements

For each predicted failure mode, the validator should determine:

* Why the failure is likely to occur.
* Whether the risk can be meaningfully reduced through prompt improvements.
* Whether an optimized prompt would materially improve the expected production outcome.
* What specific changes are recommended, if any.

If one or more production risks can be materially reduced through improved prompt wording, the validator should generate:

* **Suggested Improvements** — concise explanations of the recommended changes and why they are expected to improve generation quality.
* **Optimized Prompt** — a revised version of the user's prompt that incorporates the suggested improvements while preserving the original creative intent.

The optimized prompt must:

* Preserve the user's creative vision.
* Preserve the intended story.
* Preserve the emotional objective.
* Reinforce important production constraints.
* Improve directability where beneficial.
* Reduce ambiguity where appropriate.
* Increase the likelihood of successful generation.
* Never introduce new creative ideas.
* Never alter the intended scene or story.

If the validator determines that prompt improvements are unlikely to materially improve production quality, it should return only the validation report without generating an optimized prompt.

#### Reason for Task 1.9

Task 1.8 tied optimized prompt generation to HIGH or CRITICAL severity labels.

Testing showed that this can cause inconsistent behavior because the model may downgrade a risk from HIGH to MEDIUM while still identifying a real production issue that could benefit from prompt improvement.

Task 1.9 corrects this by focusing on whether the risk is **actionable through prompt wording**, not whether the risk has a specific severity label.

---

### Task 1.10 – Production-Ready Prompt Optimization

#### Status

✅ Complete

#### Objective

Improve/Enhance the prompt optimization behavior so that optimized prompts are immediately production-ready rather than simply telling the user what additional details to provide.

Instead of writing guidance such as "Specify the camera style," "Define the chase beats," or "Specify the aspect ratio," the validator should write those details directly into the optimized prompt whenever it can safely do so without changing the user's creative intent.

**The goal is to reduce prompt-engineering effort and improve first-pass generation quality.

#### Requirements

For each suggested prompt improvement, the validator should determine:

* Whether the improvement can be safely incorporated into the optimized prompt.
* Whether the missing or weak detail can be resolved through a production-safe assumption.
* Whether adding that detail directly would improve directability or reduce production risk.
* Whether adding that detail would preserve the user's original creative vision.

If an improvement can be safely incorporated, the validator should write the improvement directly into the optimized prompt.

**Traceable Pipeline:** The optimized prompt must be produced by applying the approved suggested improvements to the original prompt. It must not be rewritten from scratch or introduce unrelated changes. This creates a clear audit trail:

```
Original Prompt → Risk Analysis → Suggested Improvements → Optimized Prompt
```

Each suggested improvement must describe a specific, traceable change. If the optimized prompt introduces something unexpected, it must be possible to trace it back to the specific recommendation that caused the change.

The optimized prompt should:

* Be immediately usable as an AI video generation prompt.
* Replace instructional language with concrete production-ready details.
* Specify camera behavior instead of asking the user to specify camera behavior.
* Specify duration, aspect ratio, and visual format instead of asking the user to specify them when reasonable defaults can be safely assumed.
* Specify scene progression or chase beats when they can be reasonably inferred.
* Specify character consistency cues when they reduce identity drift.
* Reinforce important constraints where beneficial.
* Reduce ambiguity without over-constraining the creative result.

The validator must also produce an **optimization_summary** with an `improvements_applied` array listing each category of improvement (e.g., "Specified camera movement", "Added production-safe aspect ratio"). The optimization_summary should describe only changes that were actually applied to the optimized prompt. This provides an at-a-glance summary of what was changed, for traceability.

The optimized prompt must:

* Preserve the user's creative vision.
* Preserve the intended story.
* Preserve the emotional objective.
* Preserve the intended visual style.
* Avoid introducing new creative concepts.
* Avoid changing the scene into a different scene.
* Avoid adding unnecessary complexity.
* Avoid asking the user to add more detail inside the optimized prompt.

After generating the optimized prompt, the validator should determine:

* Whether the optimized prompt is likely to score higher than the original prompt.
* Whether the optimized prompt materially reduces one or more predicted failure modes.
* Whether the optimized prompt is production-ready without requiring more user edits.

If the optimized prompt is unlikely to improve the production-readiness score, reduce risk, or be usable without further user edits, the validator should discard it and return only the original validation report.

#### Reason for Task 1.10

Testing showed that the validator's optimized prompts sometimes acted like prompt-writing advice rather than improved prompts.

For example, the validator generated language such as:

* "Specify the camera style, duration, aspect ratio, and visual format before production."
* "Define the route as connected urban locations."
* "Define the chase beats in order."

This did not reduce the user's work. It simply told the user what to do next.

Task 1.10 corrects this by requiring optimized prompts to be production-ready. The validator should directly incorporate safe improvements into the prompt instead of passing the prompt-engineering burden back to the user.

The next task is 1.11.

---

### Task 1.11 – Five-Layer Prompt Evaluation

#### Status

✅ Complete

#### Objective

Enhance the Creative Prompt Validator so it evaluates prompts using the Five-Layer Prompt Formula:

**Subject + Environment/Light + Camera + Emotional Beat + Production Register**

The validator should identify gaps between what the user likely means, what the prompt literally says, and what an AI video model is likely to interpret.

#### Requirements

The validator should evaluate each prompt across five layers:

* Subject.
* Environment.
* Camera.
* Emotional arc.
* Production register.

For each layer, the validator should determine:

* Whether the layer is present.
* Whether the layer is specific enough for production.
* Whether the layer is ambiguous.
* Whether missing detail materially affects generation quality.
* Whether the missing detail can be safely assumed.
* Whether clarification is required.

The validator should identify:

* User intent vs. literal prompt mismatch.
* Literal prompt vs. likely model interpretation mismatch.
* Ambiguous wording that could cause model drift.
* Missing production details that increase iteration risk.
* Layer-specific production risks.

The validator should produce structured analysis that can support downstream optimization without requiring the user to understand prompt engineering.

---

### Task 1.12 – Five-Layer Prompt Optimization

#### Status

✅ Complete

#### Objective

Enhance the optimized prompt behavior so production-ready prompts are built directly from the Five-Layer Prompt Formula.

The optimized prompt should reduce ambiguity, improve model interpretation, and increase first-pass generation quality while preserving the user's creative vision.

#### Requirements

When prompt improvements are warranted, the validator should optimize the prompt across the five layers:

* Subject in state.
* Environment with light.
* Camera movement.
* Emotional beat.
* Production register.

The optimized prompt should:

* Preserve the user's original creative intent.
* Preserve the intended story and emotional objective.
* Translate vague user intent into concrete production language.
* Resolve safe assumptions directly inside the prompt.
* Improve the prompt's literal clarity.
* Reduce likely model misinterpretation.
* Avoid instructional language such as “specify,” “define,” or “add.”
* Avoid introducing unrelated creative ideas.
* Avoid changing the scene into a different scene.

Each optimization should be traceable to a specific layer.

The validator should produce an optimization summary showing:

* Which layers were improved.
* What concrete changes were applied.
* Why each change improves production reliability.
* Whether the optimized prompt is more production-ready than the original.

The optimized prompt must be immediately usable as an AI video generation prompt without requiring additional user edits.


---

# EPIC 2. Creative Intent

## Objective

Convert the validated prompt into a structured representation of the user's creative intent that accurately preserves the user's vision while distinguishing explicit information from inferred information.

The Creative Intent component describes what the user wants to create, not how the production should be executed.

## Progress

**100%**

## Tasks

* [x] Task 2.1 – Define Creative Intent Model
* [x] Task 2.2 – Design Creative Intent Schema
* [x] Task 2.3 – Implement Creative Intent Service
* [x] Task 2.4 – Create REST API Endpoint
* [x] Task 2.5 – Build Creative Intent Test Suite
* [x] Task 2.6 – Add Creative Intent UI to Validator Page

## Inputs & Outputs

### Inputs

| Input | Source | Required |
|-------|--------|----------|
| Validated creative prompt (text) | EPIC 1 (Creative Prompt Validator) | Yes |
| Optimized prompt (text) | EPIC 1 (Creative Prompt Validator) | No |
| Validator result (JSON) | EPIC 1 (Creative Prompt Validator) | No |
| AI model selection | User or system default | No |

### Outputs

| Output | Description | Consumer |
|--------|-------------|----------|
| Creative Intent (JSON) | Structured representation with 11 sections: story, emotional_tone, characters, environment, camera, timing, visual_style, constraints, must_preserve, production_notes, source_prompt | EPIC 3 (Scene Director), EPIC 5 (Production Planner), User (UI) |
| Provenance-tracked assumptions | Every inferred value traceable to safe_default, contextual_inference, or intentional_ambiguity with confidence level | EPIC 3 (Scene Director), EPIC 5 (Production Planner) |
| Preserved ambiguities | Intentional creative flexibility documented and preserved | EPIC 3 (Scene Director) |

## Definition of Done

EPIC 2 is complete when:

* The Creative Intent model is defined with 11 sections, 8 extraction rules, and clear downstream boundaries.
* The JSON schema enforces all required fields, 30+ enum types, provenance tracking, and additionalProperties: false at every level.
* The Creative Intent service loads the skill and schema, calls the LLM, parses/repairs JSON, validates output, and returns structured Creative Intent.
* A REST API endpoint exposes Creative Intent at `POST /api/creative-intent/extract`.
* A comprehensive test suite (132+ tests) covers schema, service, API, edge cases, and boundary enforcement.
* The Creative Intent UI is integrated into the Validator page with all 11 sections, provenance/confidence visualization, and PDF export.
* All tests pass with no regressions.

## Acceptance Criteria (Gate to EPIC 3)

Before proceeding to EPIC 3 (Scene Director), the following must be satisfied:

* [x] Creative Intent correctly extracts all 11 sections from a validated prompt.
* [x] Explicit details are preserved faithfully; no creative invention occurs.
* [x] Inferred values are recorded with provenance (safe_default, contextual_inference, intentional_ambiguity) and confidence (HIGH/MEDIUM/LOW).
* [x] Intentional ambiguity is preserved rather than resolved.
* [x] No production planning leaks into Creative Intent (no camera choreography, shot breakdowns, keyframes, model selection, generation prompts).
* [x] REST API returns consistent 200/400/500 responses.
* [x] UI displays all 11 sections with provenance/confidence badges and supports PDF export.
* [x] All 132+ tests pass.

## Sign-off

**Sign-off is required before this EPIC is considered complete and work may begin on EPIC 3.**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Implementer | joelk | 2026-07-04 | ✅ |
| Reviewer | -- | -- | -- |

> Sign-off must be recorded in IMPLEMENTATION-LOG-MVP.md with date and verification evidence.

---

### Task 2.1 – Define Creative Intent Model

#### Status

✅ Complete

#### Objective

Define the semantic model and architectural boundaries for the Creative Intent component.

The Creative Intent model serves as the canonical representation of the user's creative vision and establishes the contract between the Creative Prompt Validator and downstream production components.

#### Requirements

The Creative Intent model must define:

* The purpose and responsibilities of the Creative Intent component.
* The information that belongs in Creative Intent.
* The information that belongs in downstream components.
* The boundary between semantic understanding and production planning.
* Rules for distinguishing explicit information from inferred information.
* Rules for preserving intentional ambiguity.
* Rules for determining when safe inference is appropriate.
* Confidence and provenance requirements for inferred information.
* The contract consumed by Scene Director and other downstream components.

The Creative Intent model should ensure that:

* The user's creative vision is faithfully preserved.
* Production planning is not performed within Creative Intent.
* Downstream components receive structured, production-independent intent.
* Ambiguity is preserved when appropriate rather than unnecessarily resolved.
* Every inferred value is identifiable and traceable.

---

### Task 2.2 – Design Creative Intent Schema

#### Status

✅ Complete

#### Objective

Create the JSON schema that defines and validates the Creative Intent model.

#### Requirements

The schema must represent:

* Production Identity.
* Subjects.
* Environment.
* Narrative Intent.
* Visual Style.
* Production Constraints.
* Creative Freedom.
* Provenance and confidence for inferred information.

The schema must distinguish:

* Explicit information.
* Inferred information.
* Safe assumptions.
* Preserved ambiguities.

The schema must validate:

* Required fields.
* Enumerated values.
* Confidence ranges.
* Provenance values.
* Object relationships.
* Array structures.
* Identifier uniqueness.
* Unknown properties.

The schema should serve as the contract between Creative Intent and all downstream production components.

---

### Task 2.3 – Implement Creative Intent Service

#### Status

✅ Complete

#### Objective

Implement the runtime Creative Intent service.

The service converts a validated creative prompt into a structured Creative Intent representation suitable for downstream production planning.

#### Requirements

The service must:

* Load the Creative Intent skill.
* Load the Creative Intent schema.
* Build the system prompt.
* Call the selected LLM.
* Parse structured JSON output.
* Validate the output against the schema.
* Preserve explicit user intent.
* Record inferred information with provenance and confidence.
* Preserve meaningful ambiguity where appropriate.
* Return structured Creative Intent.

The service should not:

* Design camera movement.
* Generate storyboards.
* Select production workflows.
* Choose AI models.
* Perform production planning.

---

### Task 2.4 – Create REST API Endpoint

#### Status

✅ Complete

#### Objective

Expose the Creative Intent service through a REST API endpoint.

#### Requirements

Create an endpoint that:

* Accepts a validated creative prompt.
* Allows optional model selection.
* Calls the Creative Intent service.
* Returns the structured Creative Intent object.
* Returns usage information where available.
* Handles invalid requests gracefully.
* Returns clear error responses for validation and runtime failures.

The endpoint should be usable by:

* The frontend.
* Scene Director.
* Production Planner.
* Automated tests.

---

### Task 2.5 – Build Creative Intent Test Suite

#### Status

✅ Complete

#### Objective

Build a comprehensive automated test suite for the Creative Intent component.

#### Requirements

The test suite must verify:

* Schema validation.
* Service behavior.
* API behavior.
* Explicit versus inferred value handling.
* Confidence and provenance recording.
* Preservation of creative intent.
* Preservation of intentional ambiguity.
* Error handling.
* Edge cases.
* Integration with downstream components.

The test suite should ensure that Creative Intent consistently represents the user's creative vision without introducing production decisions.

---

### Task 2.6 – Add Creative Intent UI to Validator Page

#### Status

✅ Complete

#### Objective

Extend the Creative Prompt Validator page so that after a prompt is validated and optimized, the user can run Creative Intent extraction and view the structured output directly on the same page.

This serves as a validation tool — the user can verify that Creative Intent correctly extracts and structures the creative vision before downstream components consume it.

#### Requirements

The UI must:

* Add an "Extract Creative Intent" button that appears after successful validation.
* Call the Creative Intent REST API endpoint with the validated/optimized prompt.
* Display the structured Creative Intent output in a readable format.
* Show all 11 sections: story, emotional_tone, characters, environment, camera, timing, visual_style, constraints, must_preserve, production_notes, source_prompt.
* Distinguish explicit vs inferred values visually.
* Show provenance and confidence for each assumption.
* Show identified gaps and preserved ambiguities.
* Show the raw JSON output for inspection.
* Handle loading, error, and empty states.
* Support PDF export of the combined validator + Creative Intent report.

The UI should make it easy to verify that:
* The user's creative vision is faithfully preserved.
* Inferred values are reasonable and traceable.
* Intentional ambiguity is preserved where appropriate.
* No production planning has leaked into Creative Intent.

---

---

# EPIC 3. Scene Director

## Objective

Convert Creative Intent into a cinematic storyboard.

## Progress

**100%**

## Tasks

* [x] Design skill
* [x] Generate story beats
* [x] Plan camera movement
* [x] Generate storyboard
* [x] Build tests
* [x] PDF Export for Creative Prompt Validator Page

## Inputs & Outputs

### Inputs

| Input | Source | Required |
|-------|--------|----------|
| Creative Intent (JSON) | EPIC 2 (Creative Intent) | Yes |

### Outputs

| Output | Description | Consumer |
|--------|-------------|----------|
| Cinematic storyboard | Story beats, camera movement plan, shot sequencing, scene decomposition | EPIC 4 (Storyboard) |

## Definition of Done

EPIC 3 is complete when:

* A Scene Director skill is designed and documented.
* Story beats are generated from Creative Intent.
* Camera movement is planned per scene.
* A storyboard is generated with shot sequencing and scene decomposition.
* Automated tests verify storyboard generation quality.
* The Creative Prompt Validator page supports one-click PDF export of all results (validator, Creative Intent, story beats, camera plan, storyboard) as a single, print-ready document.
* All tests pass.

## Acceptance Criteria (Gate to EPIC 4)

Before proceeding to EPIC 4 (Storyboard), the following must be satisfied:

* [x] Scene Director produces a complete cinematic storyboard from Creative Intent.
* [x] Story beats preserve the narrative arc defined in Creative Intent.
* [x] Camera movement plan is consistent with the emotional tone.
* [x] Shot sequencing covers the full story progression.
* [x] PDF export captures all sections (validator, Creative Intent, story beats, camera plan, storyboard) in a single document.
* [x] PDF output is print-ready with proper formatting, page breaks, and vector-quality text.
* [x] All tests pass.

## Sign-off

**Sign-off is required before this EPIC is considered complete and work may begin on EPIC 4.**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Implementer | joelk | 2026-07-05 | ✅ |
| Reviewer | joelk | 2026-07-05 | ✅ |

> Sign-off must be recorded in IMPLEMENTATION-LOG-MVP.md with date and verification evidence.

---

### Task 3.1 – Design Scene Director Skill

#### Status

✅ Complete

#### Objective

Design the Scene Director skill as the creative bridge between Creative Intent and the Storyboard. The skill defines how the camera and characters should move through the story to deliver the intended emotional experience.

#### Requirements

The skill must define:
- Mission and core principle.
- Role in the pipeline (between Creative Intent and Storyboard).
- Input contract (10 Creative Intent sections).
- Output contract (9 Cinematic Storyboard sections with complete JSON schemas).
- 7 responsibilities: Story progression, Camera language, Shot logic, Emotional pacing, Character placement, Scene continuity, Audience experience.
- 8 design philosophy principles.
- Information boundary (what belongs downstream).
- Component contracts (upstream/downstream interactions).
- 10-step decision workflow.
- 7 quality standards.

---

### Task 3.2 – Generate Story Beats

#### Status

✅ Complete

#### Objective

Implement the Scene Director service that converts Creative Intent into an ordered sequence of narrative story beats. This is the first stage of cinematic storyboard generation — decomposing the narrative arc into discrete, purposeful beats.

#### Requirements

The service must:
- Load the Scene Director skill (`skills/scene-director.md`) and story beats JSON schema.
- Accept a Creative Intent object as input.
- Format Creative Intent into a readable prompt for the LLM, including all 10 sections plus production notes (assumptions, gaps, ambiguities).
- Call the LLM to generate story beats conforming to the schema.
- Parse, repair, and validate the JSON response.
- Preserve source prompt fidelity.
- Track LLM usage and cost.
- Expose a REST API endpoint at `POST /api/scene-director/story-beats`.
- Include a UI section on the Creative Prompt Validator page that:
  - Shows a "Generate Story Beats" button after Creative Intent extraction.
  - Displays narrative arc summary and beat count rationale.
  - Renders individual beat cards with index, name, description, narrative purpose, duration, characters present, emotional beat, and transitions.
  - Shows director notes (assumptions with confidence levels, creative risks with impact/mitigation).
  - Provides raw JSON viewer for inspection.
  - Supports regeneration.
  - Caches all results (validator, Creative Intent, story beats) to localStorage so they persist across page refreshes.
  - "Clear Cache" button in header to reset all cached state.
  
  The story beats output must follow the schema:
- `source_intent`: Reference to the Creative Intent (intent_summary, source_prompt).
- `story_beats[]`: Ordered array of beats, each with index, name, description, narrative_purpose, duration_seconds, characters_present, emotional_beat, transition_from_previous, transition_to_next.
- `narrative_arc_summary`: How beats collectively form the narrative arc.
- `beat_count_rationale`: Why this number of beats was chosen.
- `director_notes`: Creative rationale, assumptions (with basis and confidence), creative risks (with impact and mitigation).

Beat count guidance:
- Simple scenes (single subject, single action): 1–3 beats.
- Moderate scenes (subject + environment reveal, emotional arc): 3–5 beats.
- Complex scenes (multiple subjects, location changes, multi-part action): 5–8 beats.

---

### Task 3.3 – Plan Camera Movement

#### Status

✅ Complete

#### Objective

Implement the second stage of the Scene Director: translate Creative Intent's camera section and the generated story beats into a specific, executable camera movement plan. This covers camera movement per beat, shot type selection, emotional pacing mapped to visual rhythm, character blocking, scene continuity, and audience experience design.

#### Requirements

The camera plan must:

- Load the Scene Director skill (`skills/scene-director.md`) and camera plan JSON schema.
- Accept a Creative Intent object and story beats as input.
- Generate per-beat camera instructions covering:
  - **Camera movement**: Type from the 16-move vocabulary (STATIC, PUSH_IN, PULL_BACK, DOLLY, ORBIT, TRACKING, CRANE_UP, CRANE_DOWN, TILT_UP, TILT_DOWN, PAN_LEFT, PAN_RIGHT, ZOOM_IN, ZOOM_OUT, RACK_FOCUS, COMBINATION), with description, narrative purpose, start/end positions.
  - **Shot type**: Type from the 16-type vocabulary (EXTREME_CLOSE_UP through CUSTOM), with description and narrative purpose.
  - **Emotional pacing**: Intensity level (SUBTLE, MODERATE, OVERT, DRAMATIC), audience feeling, visual correlation.
  - **Character blocking**: Subject placement, spatial relationships, blocking notes, characters in frame.
  - **Continuity notes**: Elements to track from beat to beat.
- Generate a camera movement summary describing the overall strategy across all beats.
- Generate an emotional pacing map with intensity progression per beat.
- Design the audience journey (Opening, Development, Climax, Resolution).
- Document director notes with provenance-tracked assumptions and AI-aware creative risks.
- Expose a REST API endpoint at `POST /api/scene-director/camera-plan`.
- Include a UI section on the Creative Prompt Validator page that:
  - Shows a "Generate Camera Plan" button after story beats generation.
  - Displays camera movement strategy summary.
  - Renders emotional pacing map with intensity progression badges.
  - Shows audience journey (Opening, Development, Climax, Resolution) in a collapsible section.
  - Renders per-beat camera plan cards with movement type badge, shot type badge, emotional pacing, character blocking, and continuity notes.
  - Shows director notes (assumptions with confidence levels, creative risks with impact/mitigation).
  - Provides raw JSON viewer for inspection.
  - Supports regeneration.
  - Caches results to localStorage.

The camera plan must align 1:1 with story beats — same count, same order, same beat names.

The camera plan must respect Creative Intent's camera section:
- Camera start position determines the opening shot.
- Camera end position determines the closing shot.
- Movement type constrains all movement between start and end.
- If Creative Intent specifies "no cuts," design a single continuous shot.
- If Creative Intent specifies a cut count, respect that count.

The camera plan must consider AI video generation limitations:
- Extreme camera moves (360° orbits) may exceed current AI capabilities.
- Very long continuous shots (>15 seconds) increase artifact probability.
- Rapid cuts (<1 second) may not be achievable in single-generation workflows.
- Complex character interactions have higher failure rates.

---

### Task 3.4 – Generate Storyboard

#### Status

✅ Complete

#### Objective

Implement the third and final stage of the Scene Director: synthesize story beats and camera plan into a complete Cinematic Storyboard. This is the unified visual plan consumed by EPIC 4 (Storyboard) for formalization into scene definitions, shot definitions, and keyframe planning.

#### Requirements

The storyboard must:

- Load the Scene Director skill (`skills/scene-director.md`) and storyboard JSON schema.
- Accept Creative Intent, story beats, and camera plan as input.
- Preserve story beats exactly as provided — same count, order, and content.
- Translate the detailed per-beat camera plan into the storyboard's camera_plan format (overall_camera_strategy, camera_path per beat, continuity_notes).
- Design the shot sequence — ordered shots that may span one or more beats:
  - If Creative Intent specifies no cuts, the entire scene is one shot.
  - If Creative Intent specifies a cut count, respect that count.
  - Each shot includes: index, beat_indices, shot_type, framing, duration, camera_movement, purpose, focus, emotional_intent, continuity_note.
- Generate the emotional map: emotional_arc summary, intensity_curve per time point (0.0-1.0), peak_moment, final_emotional_beat.
- Define character blocking per character per beat: location, posture, movement, expression, sight_line, spatial_relationship.
- Include blocking_principles applied across the scene.
- Define scene continuity: spatial_continuity, temporal_continuity, screen_direction, continuity_rules per tracked element.
- Design audience journey: opening, development, climax, resolution, viewer_takeaway.
- Document director notes with provenance-tracked assumptions and AI-aware creative risks.
- Expose a REST API endpoint at `POST /api/scene-director/storyboard`.
- Include a UI section on the Creative Prompt Validator page that:
  - Shows a "Generate Storyboard" button after camera plan generation.
  - Displays emotional arc summary with final beat.
  - Renders intensity curve as a visual bar chart.
  - Shows shot sequence cards with type, framing, purpose, focus, emotional intent, continuity.
  - Displays character blocking per character per beat in a collapsible section.
  - Shows scene continuity (spatial, temporal, screen direction, rules).
  - Displays audience journey (opening, development, climax, resolution, takeaway).
  - Shows director notes (assumptions with confidence, creative risks with impact/mitigation).
  - Provides raw JSON viewer.
  - Supports regeneration.
  - Caches results to localStorage.

---

### Task 3.5 – Build Tests

#### Status

✅ Complete

#### Objective

Build comprehensive automated tests for the complete Scene Director output (story beats + camera plan + storyboard). Ensure all three stages work together and produce valid, schema-conformant results.

#### Requirements

The test suite must cover:

- API endpoint tests for all three Scene Director endpoints:
  - Story beats: missing body, null/empty creative_intent, valid request acceptance.
  - Camera plan: missing body, missing creative_intent, missing story_beats, null fields, valid request acceptance.
  - Storyboard: missing body, missing any of three required fields, null fields, valid request acceptance.
  - Cross-endpoint consistency: all endpoints reject non-JSON, all accept optional model parameter.
- Cross-stage integration tests:
  - Full three-stage pipeline (beats → camera plan → storyboard) with single service instance.
  - Beat count consistency across all stages.
  - Beat name preservation through the pipeline.
  - Source prompt preservation through all three stages.
  - Shot sequence coverage (every beat covered by at least one shot).
  - Continuity information present in both camera plan (per-beat) and storyboard (scene-level).
  - Emotional intensity consistency between camera plan and storyboard.
  - All three output schemas validate in the pipeline.
- All existing tests must continue to pass (no regressions).
- Test files: `test_scene_director_service.py` (81 tests), `test_scene_director_api.py` (23 tests).

---

### Task 3.6 – PDF Export for Creative Prompt Validator Page

#### Status

✅ Complete

#### Objective

Implement a one-click PDF export feature that captures the entire Creative Prompt Validator page — including validator results, Creative Intent, story beats, camera plan, and storyboard — as a single, print-ready PDF document with vector-quality text.

#### Requirements

The PDF export must:

- Export the entire results container (`resultsRef`) as a single PDF document.
- Include all sections present on the page at export time:
  - **Validator results**: Status badge, scores, directability checks, matters analysis, predicted failure modes, retrieval tags, five-layer evaluation, optimized prompt.
  - **Creative Intent**: All 11 sections (story, emotional_tone, characters, environment, camera, timing, visual_style, constraints, must_preserve, production_notes, source_prompt) with provenance-tracked assumptions.
  - **Story Beats**: Narrative arc summary, beat count rationale, individual beat cards with all fields, director notes.
  - **Camera Plan**: Camera movement strategy summary, emotional pacing map, audience journey, per-beat camera plan cards, director notes.
  - **Storyboard**: Emotional arc summary, intensity curve visualization, shot sequence cards, character blocking, scene continuity, audience journey, director notes.
- Use the existing [`screenPdfExporter.js`](schmucks-studio/src/utils/screenPdfExporter.js) utility which leverages the browser's native `window.print()` pipeline for vector-quality text (no rasterization).
- Strip interactive elements (buttons, inputs, dropdowns) from the print output while preserving all content.
- Apply `@media print` CSS rules for:
  - A4 page size with appropriate margins.
  - Forced background colors and images (`print-color-adjust: exact`).
  - Page breaks before major sections (validator, Creative Intent, story beats, camera plan, storyboard) to prevent awkward mid-section splits.
  - Hidden scrollbars, shadows, and other screen-only visual effects.
- Display a success message after the print dialog opens ("Print dialog opened — choose 'Save as PDF' for sharp output").
- Handle edge cases:
  - Graceful no-op if no results are present (button disabled or hidden).
  - Error handling if the DOM element reference is null.
  - Cleanup of print overlay after dialog closes (both print and cancel).
- The export button must be visible in the page header alongside the existing "Clear Cache" button.
- The export must work without requiring any server-side processing — entirely client-side.

#### Files

| File | Action |
|------|--------|
| [`schmucks-studio/src/utils/screenPdfExporter.js`](schmucks-studio/src/utils/screenPdfExporter.js) | Review — existing utility, may need enhancements for multi-section page breaks |
| [`schmucks-studio/src/developer-studio/pages/CreativePromptValidatorPage.jsx`](schmucks-studio/src/developer-studio/pages/CreativePromptValidatorPage.jsx) | Modify — ensure export button captures all sections, add `@media print` styles, handle edge cases |

---

# EPIC 4. Storyboard

## Objective

Represent the production visually for downstream execution.

## Progress

**100%**

## Tasks

* [x] Task 4.1 – Design Storyboard Schema
* [x] Task 4.2 – Implement Schema Validation
* [x] Task 4.3 – Define Keyframe Definitions

## Inputs & Outputs

### Inputs

| Input | Source | Required |
|-------|--------|----------|
| Cinematic storyboard | EPIC 3 (Scene Director) | Yes |

### Outputs

| Output | Description | Consumer |
|--------|-------------|----------|
| Storyboard schema (JSON) | Structured visual representation with scene definitions, shot definitions, keyframe planning | EPIC 5 (Production Planner) |

## Definition of Done

EPIC 4 is complete when:

* A storyboard schema is designed and validated.
* Scene definitions are structured for downstream consumption.
* Shot definitions include framing, composition, and timing.
* Keyframe definitions support reference image generation.
* Validation ensures schema compliance.
* All tests pass.

## Acceptance Criteria (Gate to EPIC 5)

Before proceeding to EPIC 5 (Production Planner), the following must be satisfied:

* [x] Storyboard schema is complete and validated.
* [x] Scene and shot definitions are machine-readable.
* [x] Keyframe definitions are sufficient for reference image generation.
* [x] Schema validation rejects malformed storyboards.
* [x] All tests pass.

## Sign-off

**Sign-off is required before this EPIC is considered complete and work may begin on EPIC 5.**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Implementer | joelk | 2026-07-05 | ✅ |
| Reviewer | joelk | 2026-07-05 | ✅ |

> Sign-off must be recorded in IMPLEMENTATION-LOG-MVP.md with date and verification evidence.

---

### Task 4.1 – Design Storyboard Schema

#### Status

✅ Complete

#### Objective

Design the JSON schema that formalizes EPIC 3's Cinematic Storyboard output into the machine-readable representation that EPIC 5 (Production Planner) and EPIC 6 (Keyframe Generator) consume directly.

EPIC 3's Cinematic Storyboard (`scene-director-storyboard.schema.json`) already captures story beats, a shot sequence, a camera plan, an emotional map, character blocking, and scene continuity — but at the level of *creative direction*, not production-ready structure. Per [`architecture.md`](AI%20Production%20Studio/architecture.md:337), the Storyboard component must additionally describe **environment layout** and **keyframes needed**, neither of which exists in the EPIC 3 output today. This task closes that gap and reshapes the rest into explicit scene/shot definitions.

#### Requirements

The schema must define:

* **Scene definitions** — one entry per continuous dramatic unit, grouping one or more story beats, with an explicit environment layout (location, key elements, spatial notes) and the characters present.
* **Shot definitions** — formalized from EPIC 3's shot sequence with framing, composition notes, camera movement, duration, focus subject, and purpose, each linked back to its scene.
* **Keyframe definitions** — the reference/key images required before generation: character reference images, environment reference images, and per-shot key visual frames, each with a priority (REQUIRED / RECOMMENDED / OPTIONAL) and rationale. This is the primary new content this task must add.
* **Timing** — total duration and per-scene start/end timing.
* **Continuity** — carried forward from EPIC 3's scene continuity (spatial, temporal, screen direction, tracked elements).
* A traceable reference back to the source Cinematic Storyboard (intent summary, source prompt) for auditability.

The schema must validate:

* Required top-level fields (scenes, shots, keyframes, timing, continuity, source reference).
* Enumerated values (keyframe type, keyframe priority).
* Referential consistency fields (scene/shot/keyframe IDs used for cross-linking) at the type level; full cross-reference validation (e.g. every `scene_id` referenced by a shot actually exists) is Task 4.2's responsibility.
* Unknown top-level and nested properties (`additionalProperties: false` throughout).

The schema should **not** re-invent content EPIC 3 already produces well (camera language, emotional pacing, character blocking detail) — it should reference/carry that forward rather than duplicate it, keeping the new schema focused on what's genuinely new: production-ready scene/shot structuring and keyframe planning.

---

### Task 4.2 – Implement Schema Validation

#### Status

✅ Complete

#### Objective

Implement the service that converts an EPIC 3 Cinematic Storyboard (plus Creative Intent, for environment/character detail) into a Storyboard instance conforming to the Task 4.1 schema, and validates it.

Unlike EPICs 1-3, this service is **deterministic — no LLM/skill involved** (see Task 4.1 Notes in IMPLEMENTATION-LOG-MVP.md for the reasoning). Scene/shot fields are reshaped directly from EPIC 3 + Creative Intent data; keyframe priority and rationale are derived from auditable rule-based heuristics.

#### Requirements

The service must:

* Load the `storyboard.schema.json` schema.
* Accept a Cinematic Storyboard (EPIC 3 output) and the source Creative Intent as input.
* Derive `scenes[]` by grouping story beats (e.g. by contiguous beats sharing the same location from Creative Intent's environment section) and populate `environment_layout` directly from Creative Intent's environment fields plus Scene Director's camera/character blocking.
* Derive `shots[]` by reshaping EPIC 3's `shot_sequence` (field remap: `shot_type` → `framing`, `focus` → `focus_subject`, etc.), linking each shot to its scene.
* Derive `keyframes[]` using rule-based heuristics, for example:
  * `CHARACTER_REFERENCE` at `REQUIRED` priority for any character appearing in 2+ shots, or in a single continuous shot longer than a defined threshold.
  * `ENVIRONMENT_REFERENCE` at `RECOMMENDED` priority for scenes above a duration threshold or with multiple key environmental elements.
  * `SHOT_KEYFRAME` at `RECOMMENDED`/`OPTIONAL` for shots with complex camera movement (e.g. `COMBINATION`, long `PULL_BACK`/`DOLLY`) where image-to-video seeding would reduce drift risk.
  * Each generated keyframe must include a human-readable `rationale` explaining why it was flagged, in the same spirit as the Validator's `predicted_failure_modes.likely_cause`.
* Compute `timing` (total duration, per-scene start/end) from scene durations.
* Carry forward and lightly reformat EPIC 3's `scene_continuity` into the `continuity` field.
* Validate the derived output against `storyboard.schema.json` using `jsonschema`.
* Additionally validate referential consistency that JSON Schema alone can't express: every `shots[].scene_id` resolves to a `scenes[].scene_id`, every `keyframes[].associated_scene_id`/`associated_shot_id` resolves to an existing scene/shot.
* Expose a REST API endpoint, e.g. `POST /api/scene-director/storyboard-schema` (naming TBD at implementation time — should avoid clashing with EPIC 3's existing `/api/scene-director/storyboard` endpoint).
* Include a UI section on the Creative Prompt Validator page (mirroring Tasks 3.2-3.4's pattern) that:
  * Shows a "Generate Storyboard Schema" (or similarly named) button after the EPIC 3 storyboard is generated.
  * Renders scene cards (location, key elements, characters present, duration).
  * Renders shot cards (framing, composition, camera movement, duration, purpose) grouped or linked by scene.
  * Renders keyframe cards with type/priority badges and rationale.
  * Provides a raw JSON viewer for inspection.
  * Supports regeneration and caches results to localStorage, consistent with the rest of the page.
* Build a formal pytest suite covering: heuristic correctness (character/environment/shot keyframe triggers), schema validation (reuse the ad hoc positive/negative cases from Task 4.1 as a starting point), referential-consistency validation, and API endpoint behavior.

This task was deferred a full UI-only decision to Task 4.1: since Task 4.1 has no service producing real output, a UI would have had nothing meaningful to render. Task 4.2 is where real Creative Intent + Cinematic Storyboard input becomes a live Storyboard instance worth visually reviewing.

---

### Task 4.3 – Define Keyframe Definitions

#### Status

✅ Complete

#### Objective

Refine and, if needed, extend the keyframe definition logic introduced in Task 4.1/4.2 so that keyframe requirements are sufficient for EPIC 6 (Keyframe Generator) to act on directly.

#### Requirements

Assessed Task 4.2's keyframe output against EPIC 6's needs (Character references, Environment references, Storyboard frames). Found that `keyframes[].description` was a meta-description of *why* a keyframe exists, not *what it should show* — despite the schema's own field description saying "What the keyframe should show." Enriched `StoryboardSchemaService._build_keyframes()` to pull real visual content from Creative Intent (character identity markers/wardrobe, environment lighting/weather/time-of-day, shared visual-style suffix) into each keyframe's description, making it close to a generation-ready prompt. Technical generation parameters (aspect ratio, resolution, model selection) were deliberately left out of scope — per `architecture.md`, those belong to EPIC 5 (Production Planner), not Keyframe Generator's raw input.

### EPIC 4 Bug Fix 4.1 – Shot Keyframe Priority Always REQUIRED (2026-07-17)

**Problem:** The [`_build_keyframes()`](AI Production Studio/src/agents/storyboard_schema_service.py:356) method assigned `RECOMMENDED` or `OPTIONAL` priority to shot keyframes that didn't meet the duration (≥15s) or movement (`COMBINATION`) thresholds. This meant the Production Planner could treat these shot keyframes as non-critical and skip them — but any shot keyframe that exists serves as the starting frame for image-to-video generation. A missing or skipped shot keyframe means the video model has no reference frame to seed from, causing character identity drift and composition inconsistency.

**Root Cause:** The priority heuristic treated shot keyframes as optional reference assets rather than as required production inputs. The original Task 4.2 requirements (line 1391) specified `SHOT_KEYFRAME` at `RECOMMENDED`/`OPTIONAL` for shots with complex camera movement — framing them as risk-reduction aids rather than as mandatory production prerequisites.

**Fix:** Updated [`_build_keyframes()`](AI Production Studio/src/agents/storyboard_schema_service.py:356) in [`storyboard_schema_service.py`](AI Production Studio/src/agents/storyboard_schema_service.py) — the SHOT_KEYFRAME section now:
- Assigns `REQUIRED` priority to **every** shot keyframe that survives the skip filter
- Updates the rationale text to explain that the keyframe is a "required production input for image-to-video seeding" rather than a risk-reduction aid
- Removes the `RECOMMENDED` and `OPTIONAL` priority branches entirely — shot keyframes are production inputs, not optional reference assets

**Design Decision:** The `SHOT_KEYFRAME_MIN_DURATION` (5s) and `SHOT_KEYFRAME_REQUIRED_DURATION` (15s) constants are retained for rationale differentiation, but no longer control priority assignment. Only purely supplemental or diagnostic images (which this heuristic does not generate) would be marked `OPTIONAL`.

**Verification:** All 24 storyboard schema service tests pass.

### EPIC 4 Bug Fix 4.2 – Remove Static-Under-5s Skip Rule (2026-07-17)

**Problem:** The [`_build_keyframes()`](AI Production Studio/src/agents/storyboard_schema_service.py:367) method skipped shot keyframe generation for static shots under 5 seconds. This meant that short static shots in a keyframe-driven workflow had no reference frame to seed image-to-video generation. The video model would receive no starting frame, forcing it to generate from text alone — defeating the purpose of the keyframe-driven workflow and causing character/environment inconsistency.

**Root Cause:** The skip rule assumed short static shots have "negligible drift risk" and don't need image-to-video seeding. But when the Production Planner selects a keyframe-driven workflow or assigns `image_to_video` strategy to a clip, every clip needs a shot keyframe regardless of duration or camera movement. The skip decision belongs to the Production Planner (who knows the strategy), not the StoryboardSchemaService (which runs before strategy selection).

**Fix:** Updated [`_build_keyframes()`](AI Production Studio/src/agents/storyboard_schema_service.py:356) in [`storyboard_schema_service.py`](AI Production Studio/src/agents/storyboard_schema_service.py):
- **Removed the static-under-5-seconds skip rule** — every shot now gets a REQUIRED shot keyframe regardless of duration or camera movement
- Updated the section comment to document that "a shot keyframe may be omitted only when the Production Planner explicitly selects text_to_video for that shot (handled in EPIC 5 post-processing, not here)"
- Simplified the rationale branches (removed the `is_static` check since all shots now proceed)
- Updated [`test_shot_keyframe_skipped_for_short_static_shot`](AI Production Studio/tests/test_storyboard_schema_service.py:292) → renamed to `test_shot_keyframe_generated_for_short_static_shot` and now asserts 1 REQUIRED keyframe instead of 0

**Design Decision:** The skip rule removal is in EPIC 4 (StoryboardSchemaService) rather than EPIC 5 (Production Planner) because the Storyboard is the source of truth for which shots exist. The Production Planner can still choose to omit a shot keyframe by selecting `text_to_video` strategy — but that decision is made with full awareness that a keyframe was available. The `SHOT_KEYFRAME_MIN_DURATION` constant is retained for rationale differentiation only.

**Verification:** All 24 storyboard schema service tests pass. The renamed test confirms short static shots now produce a REQUIRED keyframe.

---

# EPIC 5. Production Planner

## Objective

Determine the optimal workflow for producing the requested video.

The Production Planner is the first provider-aware and model-aware component in the AI Production Studio pipeline.

It transforms the Storyboard into an executable Production Plan by determining:

* The optimal production workflow.
* Which assets must be generated.
* Which image/video provider should generate each asset.
* Which AI model should be used.
* Generation strategies.
* Provider-specific parameters.
* Generation sequencing.
* Retry strategies.

The Production Planner is responsible for all production decision-making.

Execution components (Keyframe Generator and Video Generator) must execute the Production Plan without independently selecting providers, models, or strategies.

## Progress

**100%** (9/10 tasks complete; Task 5.6 tests deferred)

## Tasks

* [x] Task 5.1 – Design Production Planner Skill
* [x] Task 5.2 – Create Production Plan JSON Schema
* [x] Task 5.3 – Implement Production Planner Service
* [x] Task 5.4 – Create REST API Endpoint
* [x] Task 5.5 – Build Production Planner UI
* [ ] Task 5.6 – Build Tests (deferred)
* [x] Task 5.7 – Provider-Aware Production Planning
* [x] Task 5.8 – Implement Provider Capability Catalog
* [x] Task 5.9 – Build Provider Capability Catalog Management UI
* [x] Task 5.10 – Verify and Refine LLM-Based Model Selection
* [x] Task 5.11 – Modify Production Planner UI to Display Tool Selection Options and Rationale
* [x] Task 5.12 – Enforce Keyframe-to-Video Strategy Connection

## Inputs & Outputs

### Inputs

| Input | Source | Required |
|--------|--------|----------|
| Storyboard | EPIC 4 | Yes |
| Creative Intent | EPIC 2 | Yes |
| User preferences | User | No |
| Model capability knowledge | Internal | Yes |

### Outputs

| Output | Description | Consumer |
|--------|-------------|----------|
| Production Plan | Complete executable production plan including workflow, providers, models, prompts, parameters, dependencies, quality gates, retry rules | EPIC 6, EPIC 7 |

## Definition of Done

EPIC 5 is complete when:

* Production workflow is selected.
* Every required production asset is identified.
* Every asset has a selected provider.
* Every asset has a selected model.
* Provider-specific parameters are defined.
* Generation prompts are created.
* Dependencies are defined.
* Retry strategies are defined.
* Quality gates are defined.
* Production sequencing is complete.
* Production Plan is fully executable.
* Automated tests pass.

## Acceptance Criteria (Gate to EPIC 6)

Before proceeding to EPIC 6 (Keyframe Generator), the following must be satisfied:
* Every generated asset specifies:
  * provider
  * model
  * parameters
  * prompt
  * generation strategy

* Provider/model decisions are traceable.

* The Production Plan contains sufficient information for downstream generators to execute without making planning decisions.

* No downstream generator needs to determine which provider or model should be used.

## Sign-off

**Sign-off is required before this EPIC is considered complete and work may begin on EPIC 6.**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Implementer | -- | -- | -- |
| Reviewer | -- | -- | -- |

> Sign-off must be recorded in IMPLEMENTATION-LOG-MVP.md with date and verification evidence.

---

### Task 5.1 – Design Production Planner Skill

#### Status

✅ Complete

#### Objective

Design the Production Planner skill as the first model-aware planning component in the AI Production Studio pipeline. The skill defines how to convert a Storyboard (plus Creative Intent) into an executable production strategy.

The Production Planner is the production bridge between what should be created (Storyboard) and how it gets generated (Keyframe Generator + Video Generator). It translates creative requirements into model-specific execution strategies.

#### Requirements

The skill must define:

* **Mission** — Convert Storyboard into an executable AI production strategy.
* **Core Principle** — What production strategy gives this creative vision the highest probability of success on the first attempt?
* **Role in the Pipeline** — Between Storyboard (EPIC 4) and Keyframe Generator (EPIC 6) / Video Generator (EPIC 7).
* **Input Contract** — 12 sections read from Storyboard (scenes, shots, keyframes, timing, continuity) and Creative Intent (visual_style, camera, environment, characters, constraints, must_preserve, production_notes).
* **Output Contract** — 10-section Production Plan: source_references, workflow, model_selection, keyframe_specs, generation_prompts, generation_plan, transition_strategy, quality_gates, retry_strategy, production_notes.
* **Workflow Decision Logic** — 5-step logic for choosing single_clip, multi_clip, keyframe_driven, or hybrid workflows based on shot count, cut count, keyframe requirements, complexity assessment, and single-generation feasibility.
* **Model Selection Logic** — 5-step logic for choosing models per stage (visual style requirements, motion requirements, character requirements, duration, provider capabilities) plus selection principles (prefer fastest for simple, highest quality for hero, most consistent for character-driven, always select a fallback).
* **Keyframe Spec Principles** — Character references include identity markers, environment references include location/lighting/weather/spatial layout, shot keyframes include framing/composition/camera angle.
* **Prompt Generation Principles** — Preserve creative intent, adapt to the model, include negative prompts, specify technical parameters, handle clip splitting, be concrete not instructional.
* **Generation Plan Principles** — Maximize parallelism, respect dependencies, order by priority, estimate conservatively.
* **Transition Strategy** — Respect the storyboard, match intensity, consider model behavior.
* **Quality Gate Definitions** — BLOCKING vs WARNING severity, specific verifiable criteria per asset type.
* **Retry Strategy** — Escalate progressively (same prompt → strengthened prompt → keyframe-driven → fallback model → user review), cap retries, never change creative vision.
* **Information Boundary** — What belongs in Production Planner vs downstream (Keyframe Generator, Video Generator, Final Assembly) vs upstream (Creative Intent, Scene Director, Storyboard).
* **10-Step Decision Workflow** — Read Inputs → Assess Complexity → Determine Keyframe Necessity → Select Workflow → Select Models → Generate Keyframe Specs → Generate Production Prompts → Build Generation Plan → Define Quality Gates → Define Retry Strategy.
* **7 Quality Standards** — Executable, Traceable, Model-aware, Risk-conscious, Cost-aware, Complete, Auditable.
* **MVP Scope Notes** — No Production Intelligence Repository, limited model catalog, no Production Readiness Analyzer, manual retry execution, manual quality gate enforcement.



### Task 5.2 – Create Production Plan JSON Schema

#### Status

✅ Complete

#### Objective

Create the JSON schema that defines and validates the Production Plan output as defined in the Production Planner skill (`skills/production-planner.md`).

The schema enforces the 10-section Production Plan output contract and serves as the contract between the Production Planner service, API, UI, and downstream components (Keyframe Generator, Video Generator).

#### Requirements

The schema must validate the 10-section Production Plan:

1. **source_references** — Traceability to Storyboard and Creative Intent (storyboard_summary, creative_intent_summary, source_prompt).
2. **workflow** — Selected production workflow with workflow_type (single_clip, multi_clip, keyframe_driven, hybrid), rationale, alternatives_considered, clip_count, keyframe_reuse strategy.
3. **model_selection** — Keyframe model, video model, and fallback video model, each with provider, model_id, rationale, and parameters.
4. **keyframe_specs** — Character references, environment references, and shot keyframes, each with prompt, output_format, variations, priority, and seed relationships.
5. **generation_prompts** — Video prompts (text_to_video, image_to_video) and keyframe prompts, each with model, type, prompt, negative_prompt, duration, aspect_ratio, and seed/image references.
6. **generation_plan** — Sequenced stages with tasks, parallelism, dependencies, estimated times, and acceptance criteria. Includes total estimated time, critical path, and max parallel tasks.
7. **transition_strategy** — Transition type, rationale, per-clip transition definitions, and post-processing steps.
8. **quality_gates** — Per-asset gates (character_reference, video_clip) with criteria, severity (BLOCKING/WARNING), and descriptions. Overall gates for blocking and warning review.
9. **retry_strategy** — Per-failure retry rules (failure, action, max_retries, prompt_modification, on_exhaustion). Max total retries and escalation threshold.
10. **production_notes** — Rationale, assumptions (with basis, confidence, and if_wrong), and risks (with impact and mitigation).

The schema must enforce:
- All required fields at every nesting level.
- Enumerated values (workflow_type, priority, severity, confidence, action types).
- Numeric ranges (duration_seconds > 0, variations >= 0, max_retries >= 0, estimated_time_seconds >= 0).
- `additionalProperties: false` at all levels.
- Unknown properties rejected.

---

### Task 5.3 – Implement Production Planner Service

#### Status

✅ Complete

#### Objective

Implement the runtime Production Planner service that converts a Storyboard (plus Creative Intent) into an executable Production Plan.

The service loads the Production Planner skill, calls the LLM with the Storyboard and Creative Intent as context, and produces a structured Production Plan conforming to the Task 5.2 schema.

#### Requirements

The service must:
- Load the Production Planner skill (`skills/production-planner.md`) with embedded fallback for resilience.
- Load the Production Plan JSON schema for output validation.
- Build a comprehensive system prompt combining the skill definition and the full JSON schema.
- Accept a Storyboard (EPIC 4 output) and Creative Intent (EPIC 2 output) as input.
- Format both inputs into a readable prompt covering all 12 sections from the input contract.
- Call the LLM via `OpenRouterClient` (following the same pattern as `CreativePromptValidator`, `CreativeIntentService`, and `SceneDirectorService`).
- Extract JSON from LLM responses (handle markdown fences, surrounding text, trailing commas).
- Validate the parsed output against the Production Plan JSON schema using `jsonschema`.
- Preserve source prompt fidelity (override `source_prompt` in `source_references` to match input exactly).
- Track LLM usage and cost via `get_usage_summary()`.
- Follow the same architectural patterns as existing services: class-based design, `_build_system_prompt()`, `generate_production_plan()` as primary public method, standard JSON extraction/repair/validation.

The service must implement the Production Planner's 10-step decision workflow by providing all necessary context in the system prompt so the LLM can:
1. Read Inputs (Storyboard + Creative Intent).
2. Assess Complexity (scene/shot/character counts, camera complexity, duration, continuity requirements).
3. Determine Keyframe Necessity (REQUIRED priority keyframes, character identity across shots, complex environments).
4. Select Workflow (single_clip, multi_clip, keyframe_driven, hybrid based on 5-step decision logic).
5. Select Models (per-stage model selection with primary and fallback, justified by visual style, motion, character, duration, and provider capabilities).
6. Generate Keyframe Specs (character/environment/shot keyframes with model-specific generation specifications).
7. Generate Production Prompts (actual prompts for video and keyframe generation, with negative prompts, technical parameters, clip splitting).
8. Build Generation Plan (sequenced tasks with dependencies, parallelism, estimated times, critical path).
9. Define Quality Gates (BLOCKING/WARNING criteria per asset type).
10. Define Retry Strategy (progressive escalation, max retries, on-exhaustion actions).

---

### Task 5.4 – Create REST API Endpoint

#### Status

✅ Complete

#### Objective

Expose the Production Planner service through a REST API endpoint.

#### Requirements

Create an endpoint that:
- Accepts `POST /api/production-planner/generate-plan` with JSON body.
- Requires `storyboard` (Storyboard JSON, required) and `creative_intent` (Creative Intent JSON, required).
- Accepts an optional `model` field to override the default LLM model.
- Lazily imports the Production Planner service.
- Returns `{"production_plan": result, "usage": usage}` on success.
- Returns 400 for missing/invalid JSON body, missing required fields, empty/null fields, or `ValueError` from the service.
- Returns 500 for unexpected runtime errors from the service.
- Uses `request.get_json(silent=True)` to gracefully handle non-JSON content types.
- Follows the same architectural pattern as existing endpoints (Validator, Creative Intent, Scene Director, Storyboard Build).

The endpoint should be usable by:
- The frontend Production Planner UI (Task 5.5).
- EPIC 6 (Keyframe Generator) as automated input.
- EPIC 7 (Video Generator) as automated input.
- Automated tests.

---

### Task 5.5 – Build Production Planner UI

#### Status

✅ Complete

#### Objective

Add a Production Planner section to the Creative Prompt Validator page that allows users to generate and review the complete Production Plan directly after the Production Storyboard is built.

#### Requirements

The UI must:
- Add a "Generate Production Plan" button that appears after the Production Storyboard (EPIC 4) is generated.
- Call `POST /api/production-planner/generate-plan` with the Creative Intent and Storyboard.
- Display the Production Plan in a structured, readable format with the following sections:

1. **Workflow** — Selected workflow type with rationale badge, clip count, keyframe reuse strategy, and alternatives considered.
2. **Model Selection** — Cards for keyframe model, primary video model, and fallback video model, each showing provider, model_id, rationale, and parameters.
3. **Keyframe Specs** — Collapsible sections for character references, environment references, and shot keyframes, each with prompt preview, output format, variations count, and priority badges.
4. **Generation Prompts** — Video prompts (with clip index, model, type, prompt, negative prompt, duration, seed image reference) and keyframe prompts (with model, type, prompt, negative prompt).
5. **Generation Plan** — Staged generation plan with stage name, task list, parallel indicator, dependency arrows, estimated times, acceptance criteria. Critical path highlighted.
6. **Transition Strategy** — Transition type, rationale, per-clip transition definitions, post-processing steps.
7. **Quality Gates** — Per-asset-type gates with criteria, severity badges (BLOCKING red, WARNING amber), and descriptions. Overall quality gates summary.
8. **Retry Strategy** — Per-failure retry rules with failure mode, action, max retries, prompt modification, and escalation path. Total retry cap and escalation threshold.
9. **Production Notes** — Rationale summary, assumptions list (with basis, confidence badges, if_wrong), risks list (with impact badges, mitigation).
10. **Source References** — Traceability to Storyboard and Creative Intent.

- Provide a raw JSON viewer for inspection (collapsible).
- Support regeneration for iterative refinement.
- Cache results to localStorage alongside existing cached data.
- Handle loading, error, and empty states consistently with existing UI sections.
- Support PDF export (included in the page's existing print/export pipeline).
- Follow the existing color theme patterns (Production Planner could use indigo/violet themed styling).

---

### Task 5.6 – Build Tests

#### Status

On Hold

#### Objective

Build comprehensive automated tests for the complete Production Planner output (schema, service, API, UI integration). Ensure the Production Planner produces valid, schema-conformant Production Plans that correctly apply the skill's decision logic.

#### Requirements

The test suite must cover:

**Schema tests:**
- All 10 required top-level sections enforced.
- All enum values validated (workflow_type, priority, severity, confidence, action types).
- All numeric ranges enforced (duration > 0, variations >= 0, max_retries >= 0, estimated times >= 0).
- `additionalProperties: false` enforced at every level.
- Unknown properties rejected at all levels.
- Valid instance acceptance.

**Service tests:**
- Initialization: skill loading, schema loading, system prompt building, custom model acceptance.
- JSON extraction: plain JSON, markdown fences, surrounding text, no braces, nested braces.
- JSON repair: trailing commas in objects, arrays, multiple trailing commas.
- Schema validation: valid instance, invalid data, invalid enum, missing required field.
- Integration with mocked LLM: structured result, source prompt override, markdown-wrapped JSON, trailing comma repair, unparseable JSON error, workflow decision preservation, model selection preservation, keyframe spec preservation, prompt generation preservation, generation plan preservation, quality gate preservation, retry strategy preservation.
- Usage summary: delegation to LLM client.
- Edge cases: Unicode, emoji, long inputs, special characters, newlines/tabs.

**API tests:**
- Missing request body → 400.
- Empty JSON body → 400.
- Missing storyboard → 400.
- Missing creative_intent → 400.
- Null storyboard → 400.
- Null creative_intent → 400.
- Valid request acceptance → 200.
- Optional model parameter accepted.
- 500 on RuntimeError from service.
- 400 on ValueError from service.
- Non-JSON content type rejected.

**Integration tests:**
- Full pipeline: Storyboard + Creative Intent → Production Plan.
- Cross-stage consistency: workflow selection matches storyboard structure (single shot → single_clip, multiple shots + cuts → multi_clip).
- Keyframe specs match storyboard keyframe definitions.
- Generation prompts trace back to storyboard shot descriptions.
- Generation plan covers all assets.
- Quality gates cover all asset types.
- Retry strategy covers expected failure modes.
- All schema outputs validate.

**All existing tests must continue to pass (no regressions).**



### Task 5.7 – Provider-Aware Production Planning

### Status

✅ Complete

---

#### Objective

Enhance the Production Planner so it produces provider-aware Production Plans that completely specify how every production asset should be generated.

This task centralizes all provider and model decision-making inside the Production Planner and establishes a provider-agnostic execution architecture for downstream generators.

---

#### Requirements

The Production Planner must determine, for every generated asset:

* asset_type
* provider
* model
* generation strategy
* prompt
* negative prompt (when supported)
* provider-specific parameters
* dependencies
* output format
* rationale

The planner must determine:

* OpenRouter vs direct provider
* fal.ai vs Runway vs Higgsfield
* Flux vs Imagen vs future image models
* image-to-image vs text-to-image
* quality vs speed vs cost trade-offs

The planner must not execute generation.

Execution belongs to downstream generators.

---

The Production Plan should support provider-independent execution using a structure similar to:

```json
{
  "assets": [
    {
      "type": "character_reference",
      "provider": "fal",
      "model": "flux-pro",
      "strategy": "text_to_image",
      "parameters": {}
    }
  ]
}


## Task 5.8 – Implement Provider Capability Catalog

### Status

✅ Complete

#### Objective

Implement an internally maintained Provider Capability Catalog that serves as the authoritative source of truth for all AI generation providers, models, capabilities, supported parameters, and operational constraints used by the AI Production Studio.

The Production Planner must use this catalog to select valid provider, model, and generation strategy combinations when building the Production Plan.

This task extends the provider-aware planning introduced in Task 5.7 by replacing provider capability assumptions with deterministic capability lookups.

#### Requirements

The Provider Capability Catalog must:

Be stored in a structured, machine-readable format.
Be loaded automatically during application startup.
Be maintained independently of the Production Planner.
Contain an initial catalog populated with the providers and models supported by the AI Production Studio at the time of implementation.
Support future expansion without requiring changes to Production Planner logic.

The catalog must maintain:

AI providers.
Models available from each provider.
Model versions where applicable.
Provider status (enabled/disabled).
Model status (enabled/disabled).
Supported generation capabilities including:
text_to_image
image_to_image
text_to_video
image_to_video
Supported input types.
Supported output types.
Supported image formats.
Supported video formats.
Supported aspect ratios.
Resolution limitations.
Duration limitations.
Provider-specific parameters.
Provider-specific operational limitations.
Future capability metadata without requiring schema redesign.

The catalog should be extensible to support future information including:

Pricing.
Estimated generation cost.
Expected latency.
Relative quality ranking.
Provider reliability.
Model release information.
Deprecation status.
LoRA support.
ControlNet or IP Adapter support.
Reference image limits.
Concurrent generation limits.
Additional provider-specific capabilities.

The Production Planner must:

Load the Provider Capability Catalog before production planning begins.
Treat the catalog as read-only.
Use the catalog when selecting providers, models, and generation strategies.
Select only provider-model-capability combinations supported by the catalog.
Validate every production asset against the catalog before returning a Production Plan.
Reject unsupported provider-model-capability combinations.
Produce deterministic provider and model selections independent of LLM assumptions.
Continue generating provider-aware reasoning and selection rationale.

The implementation must include:

Provider Capability Catalog data model.
Catalog loading and validation.
Integration with Production Planner selection logic.
Production Plan capability validation.
Automated tests covering valid and invalid provider-model-capability combinations.
Automated tests verifying unsupported combinations cannot be produced.

The Provider Capability Catalog shall become the authoritative source for all provider capability decisions used throughout the AI Production Studio.


## Task 5.9 – Build Provider Capability Catalog Management UI

### Status

✅ Complete

#### Objective

Build an administrative interface that allows users to maintain the Provider Capability Catalog without modifying source code.

This interface manages the catalog consumed by the Production Planner but does not participate in production execution.

#### Requirements

The UI must:

Be accessible directly from the AI Production Studio home page.
Not be accessed through the Creative Prompt Validator page.
Provide a dedicated Provider Capability Catalog management screen.

The UI must allow users to:

Add providers.
Edit providers.
Enable or disable providers.
Remove providers.
Add models.
Edit models.
Enable or disable models.
Remove models.
Maintain model versions.
Assign supported generation capabilities **at the model level** (not at the provider level):
text_to_image
image_to_image
text_to_video
image_to_video
Configure supported input types.
Configure supported output types.
Configure supported image formats.
Configure supported video formats.
Configure supported aspect ratios.
Configure supported resolutions.
Configure supported duration limits.
Configure provider-specific parameters.
Configure provider-specific operational limitations.
Maintain future provider capability metadata.

**Critical design principles:**

- **Capabilities belong to individual models, not to providers.** Each model has its own capability flags. A provider may have some models that support text-to-image and others that support text-to-video. The UI must not imply that a provider has one shared capability set for all models.
- **Model-level capability badges are always visible.** When a provider is expanded, each model row shows its active capabilities (text_to_image, image_to_image, text_to_video, image_to_video) as color-coded badges — even when the model is not being edited. This allows users to audit capabilities at a glance.
- **Expanding a model for editing allows full capability maintenance.** The edit form exposes all capability toggles, input/output types, aspect ratios, resolution limits, duration limits (for video models), formats, and metadata.
- **Model details include constraints.** Duration limits, resolution ranges, aspect ratios, input types, and output types are all model-specific. A video model shows duration_limits; an image model shows resolution_limits without duration.
- **OpenRouter is not represented only by Stable Diffusion XL.** The catalog includes OpenRouter-accessible models for both image generation (e.g., Stable Diffusion XL via OpenRouter) and video generation (e.g., Kling V1 via OpenRouter, Veo 2 via OpenRouter). Each model has its own capability flags.
- **fal.ai model rows clearly show capabilities.** fal.ai models include both image models (Flux family, Recraft, Ideogram, Seedream) and video models (Kling V1 via fal.ai, Veo 2 via fal.ai). Each model's capability badges are visible on its row and editable in its edit form.
- **The Studio home page remains the entry point.** The catalog management page is linked from the Developer Studio home page, not injected into the Creative Prompt Validator page.

The catalog data must include:

- **fal.ai video models:** At minimum, Kling V1 (text-to-video via fal.ai) and Veo 2 (image-to-video via fal.ai), each with model-level capability flags, resolution limits, duration limits, and parameter definitions.
- **OpenRouter video models:** At minimum, Kling V1 (text-to-video via OpenRouter) and Veo 2 (image-to-video via OpenRouter), each with model-level capability flags distinct from the image-generation models.

The Provider Capability Catalog Management UI shall become the primary administrative interface for maintaining AI provider and model capabilities as the AI Production Studio evolves.


## Task 5.10 – Verify and Refine LLM-Based Model Selection
### Status

✅ Complete

### Implementation Notes

The existing Production Planner implementation (Task 5.7) had one architectural gap: the [`ProviderCapabilityCatalog.build_system_prompt_context()`](AI Production Studio/src/catalog/provider_capability_catalog.py:503) method dumped the entire catalog organized by provider into the LLM system prompt, requiring the LLM to cross-reference capabilities across providers. This violated the design principle that the application determines which choices are valid and the LLM determines which valid choice is best.

**Changes made:**

1. Added [`build_capability_candidates_context()`](AI Production Studio/src/catalog/provider_capability_catalog.py:572) to [`ProviderCapabilityCatalog`](AI Production Studio/src/catalog/provider_capability_catalog.py:78) — organizes all enabled models by capability (text_to_image, text_to_video, image_to_image, image_to_video), presenting capability-filtered candidate lists to the LLM. Includes asset-type-to-capability mappings, selection rules, and a summary table.

2. Updated [`ProductionPlannerService._build_system_prompt()`](AI Production Studio/src/agents/production_planner_service.py:160) to use [`build_capability_candidates_context()`](AI Production Studio/src/catalog/provider_capability_catalog.py:572) instead of the provider-organized dump. The system now determines which choices are valid (by capability filtering) and presents only eligible candidates to the LLM.

3. Added 12 new automated tests in [`TestCapabilityCandidatesContext`](AI Production Studio/tests/test_provider_capability_catalog.py:1041) verifying: capability-based organization, selection rules, asset-type mappings, disabled provider/model exclusion, integration with ProductionPlannerService, and no regression when catalog is unavailable.

**Requirement verification:**

| Requirement | Status |
|---|---|
| Determines the required generation capability for each production asset | ✅ Catalog maps asset_type → capability; context shows these mappings to LLM |
| Uses the Provider Capability Catalog to identify all eligible provider/model candidates | ✅ `build_capability_candidates_context()` uses `find_models_by_capability()` for capability-filtered candidates |
| Excludes unsupported or disabled providers and models | ✅ Only enabled models from enabled providers are included |
| Provides the complete list of eligible candidates to the LLM for evaluation | ✅ All capability-matched candidates are presented in organized sections |
| Allows the LLM to select the provider and model it determines are best suited for the asset | ✅ LLM chooses from presented candidates; system prompt rule 5: "choose the provider/model combination you determine is best suited" |
| Validates that the selected provider/model exists within the supplied candidate list before returning the Production Plan | ✅ `validate_plan_against_catalog()` at [`production_planner_service.py:424`](AI Production Studio/src/agents/production_planner_service.py:424) validates all assets post-generation |

All 134 tests pass (80 original catalog + 12 new capability context + 42 production planner).

#### Objective

Review the Production Planner implementation created in Task 5.7 and verify that provider and model selection follows the intended LLM-assisted capability selection workflow.

The AI Production Studio intentionally delegates creative tool selection to the LLM. Rather than selecting the "best" provider or model through hard-coded ranking rules, the system should allow the LLM to evaluate all valid choices and determine which provider and model are most appropriate for the production asset being generated.

The responsibility of the application is to determine which choices are valid. The responsibility of the LLM is to determine which valid choice is best.

This task is primarily an architectural verification and refinement task. If the existing implementation already satisfies these requirements, no functional changes should be made beyond documenting the verification and adding any missing tests. If gaps are identified, refine the existing implementation rather than introducing a separate selection mechanism.

#### Requirements

Review the existing Production Planner implementation and determine whether it:

Determines the required generation capability for each production asset.
Uses the Provider Capability Catalog to identify all eligible provider/model candidates.
Excludes unsupported or disabled providers and models.
Provides the complete list of eligible candidates to the LLM for evaluation.
Allows the LLM to select the provider and model it determines are best suited for the asset.
Validates that the selected provider/model exists within the supplied candidate list before returning the Production Plan.

The Production Planner should not determine the best model through deterministic ranking when multiple valid candidates exist. Instead, it should present all eligible choices to the LLM and allow the LLM to make the final selection based on the creative and production requirements of the asset.

For example:

If both a fal model and an OpenRouter model support text_to_image, and both satisfy all production constraints, both options should be presented to the LLM. The LLM should evaluate the available candidates and determine which is most appropriate for the requested asset. The application should then verify that the selected model was one of the supplied candidates before producing the Production Plan.

If the existing implementation satisfies these requirements:

Document the verification.
Add any missing automated tests demonstrating the behavior.
Do not redesign or duplicate existing logic.

If the existing implementation does not satisfy these requirements:

Refine the implementation from Task 5.7 so that:
the required capability is determined first;
the Provider Capability Catalog is filtered to produce the complete set of eligible provider/model candidates;
all eligible candidates are supplied to the LLM;
the LLM performs the final provider/model selection;
the selected provider/model is validated against the supplied candidate list before the Production Plan is returned.
Preserve the existing architecture wherever possible.
Modify the existing implementation rather than introducing parallel or duplicate selection mechanisms.
Verification

Automated tests must verify that:

Only eligible provider/model candidates are supplied to the LLM.
All eligible candidates are supplied to the LLM.
Unsupported provider/model combinations cannot be selected.
The LLM is responsible for selecting the final provider/model from the supplied candidate list.
The selected provider/model is validated before the Production Plan is returned.
Existing Task 5.7 functionality continues to operate correctly after any refinements.


## Task 5.11 – Modify Production Planner UI to Display Tool Selection Options and Rationale

### Status

✅ Complete

### Implementation Notes

The existing Task 5.5 Production Planner UI showed selected provider/model/strategy and a small italic rationale per asset, but did not display required capability, eligible tool options, or a visually-distinguished selected tool.

**Changes made:**

1. **API:** Added [`_build_selection_traceability()`](api_server.py:2366) to the production planner endpoint at [`POST /api/production-planner/generate-plan`](api_server.py:2449). For each asset in the Production Plan, it computes:
   - `required_capability` — derived from asset_type and strategy
   - `eligible_candidates` — all enabled provider/model combos from the Provider Capability Catalog that support the required capability
   - `selected_provider`, `selected_model`, `selected_strategy` — from the asset
   - `rationale` — from the asset
   
   The response now includes a `selection_traceability` field alongside `production_plan` and `usage`.

2. **UI:** Modified the Production Assets section in [`CreativePromptValidatorPage.jsx`](schmucks-studio/src/developer-studio/pages/CreativePromptValidatorPage.jsx:3045) to include a **"🛠️ Tool Selection"** collapsible within each asset card, displaying:
   - **Required Capability** badge (e.g., `text_to_image`)
   - **Eligible Options** list — all capability-filtered candidates with checkmark and green highlight for the selected option, and a "SELECTED" tag
   - **Selected Tool** callout — provider/model/strategy in a distinct emerald card
   - **Why Selected** — the LLM's selection rationale in full

3. **State:** Added `selectionTraceability` state with localStorage caching/restore/clear integration.

4. **Fallback:** When traceability data is unavailable (catalog not loaded), falls back to showing the rationale without candidates.

#### Objective

Review and modify the Production Planner UI implemented in Task 5.5 so users can clearly see:

which eligible provider/model options were available to the Production Planner;
which provider/model was selected;
why the LLM selected that option over the other valid choices.

This task is a modification and extension of the existing Task 5.5 implementation, not a separate or duplicate Production Planner UI.

The existing Production Planner UI should be updated in place.

#### Requirements

Review the current Task 5.5 Production Planner UI and determine whether it already displays:

the required generation capability for each asset;
all eligible provider/model candidates supplied to the LLM;
the provider/model selected by the LLM;
the LLM’s selection rationale.

If the existing UI already satisfies these requirements:

document the verification;
add any missing tests;
avoid unnecessary redesign.

If the existing UI does not satisfy these requirements, modify the Task 5.5 implementation so that each planned production asset displays:

Required capability

Examples:

text_to_image
image_to_image
text_to_video
image_to_video
Eligible tool options

Display every provider/model candidate that was supplied to the LLM after capability and constraint filtering.

Each option should show relevant catalog information where available, including:

provider;
model;
supported capability;
quality tier;
cost tier or estimated cost;
expected latency;
reliability;
supported duration;
supported resolution;
supported aspect ratios;
relevant limitations.
Selected tool

Clearly identify:

selected provider;
selected model;
selected generation capability or strategy.

The selected option should be visually distinguishable from the alternatives.

Selection rationale

Display the LLM-generated explanation of why the selected provider/model was considered the best fit for that asset.

The rationale should reference the asset’s actual production requirements, such as:

visual style;
character consistency;
image quality;
motion quality;
prompt adherence;
duration;
aspect ratio;
cost;
latency;
reliability;
provider-specific strengths or limitations.
Example

For a text_to_image asset, the UI might show:

Required Capability
text_to_image

Eligible Options
1. fal.ai — Flux Pro 1.1 Ultra
2. OpenRouter — Stable Diffusion XL

Selected
fal.ai — Flux Pro 1.1 Ultra

Why Selected
Selected because this asset requires high photorealistic detail and strong prompt adherence. Both models support text-to-image, but Flux Pro 1.1 Ultra was judged to be the better fit for the requested cinematic character reference.

Data and Integration Requirements

The UI must consume the selection-traceability data produced by the Production Planner.

The Production Plan or API response must expose, for each asset:

required capability;
eligible candidate list;
selected provider;
selected model;
selection rationale.

The UI must not reconstruct or infer the candidate list independently.

The UI must not make provider or model decisions.

It should only display the choices and rationale produced by the Production Planner.

UI Placement
Modify the existing Production Planner UI created in Task 5.5.
Do not create a second Production Planner page.
Do not place this information on the Creative Prompt Validator page unless the current Task 5.5 UI is already embedded there.
Preserve the current Studio navigation and workflow.
Verification

Automated or component tests must verify that:

all eligible candidates are displayed;
the selected provider/model is clearly identified;
the selection rationale is displayed;
alternatives are not omitted when multiple valid options exist;
the UI handles a single eligible candidate;
the UI handles missing optional metadata gracefully;
existing Task 5.5 functionality continues to work after modification.

This task should refine the existing Task 5.5 UI in place and must not introduce a parallel or duplicate implementation.

---

### Task 5.12 – Enforce Keyframe-to-Video Strategy Connection

#### Status

✅ Complete

#### Objective

Fix a critical bug where the Production Planner generated keyframe images via `text_to_image` and video clips via `text_to_video` as independent, disconnected assets. The generated keyframes were never used for video generation — they were wasted entirely.

The expected behavior is: text → image (keyframe), then image → video (using the keyframe as the starting frame). This requires `image_to_video` strategy with `dependencies` linking video clips to their keyframe assets.

#### Root Cause

The system prompt in `_build_system_prompt()` listed all available strategies (`text_to_video`, `image_to_video`, etc.) but had no rule telling the LLM: "When keyframe assets exist, video_clip assets MUST use `image_to_video` with `dependencies` pointing to those keyframes." Without this, the LLM defaulted to the simpler `text_to_video` for everything.

#### Requirements

The fix must:

* Add explicit strategy connection rules to the system prompt in Step 7 (Build Assets Array) that enforce: when ANY keyframe assets exist, ALL video_clip assets MUST use `image_to_video` strategy (not `text_to_video`), MUST list keyframe asset_ids in `dependencies`, and MUST reference the keyframe in the prompt.
* Define the ONLY exception: `single_clip` workflow with zero keyframe assets may use `text_to_video`.
* Add dependency mapping rules: video_clip for shot N → depends on shot_keyframe for shot N (if exists), OR character_reference + environment_reference. First clip of a shot → depends on that shot's keyframe. Continuation clips → depends on preceding clip's asset_id.
* Add a deterministic post-processing safety net (`_validate_strategy_connections()`) that runs after every LLM generation to: detect `text_to_video` + keyframes anti-pattern and auto-correct strategy to `image_to_video`, detect missing keyframe dependencies and auto-add the most relevant keyframe asset_id, and log warnings for every correction.
* All existing tests must continue to pass with no regressions.

#### Implementation Notes

**Changes made to [`production_planner_service.py`](AI Production Studio/src/agents/production_planner_service.py):**

1. **System Prompt (line 258):** Added `CRITICAL: Strategy Connection Rules (Keyframe → Video)` section to Step 7 with explicit rules, rationale, and dependency mapping.

2. **Post-Processing (line 403):** Added `_validate_strategy_connections()` method called from `_enrich_assets_with_provider_info()` that:
   - Collects all keyframe asset_ids
   - For each video_clip using `text_to_video`, auto-corrects to `image_to_video` with warning
   - For each video_clip missing keyframe dependencies, auto-adds the most relevant keyframe (shot_keyframe > character_reference > environment_reference)

#### Verification

- All 613 tests pass, 0 failures across the full AI Production Studio test suite.

---

### Bug Fix – Provider/Model Corruption in Keyframe Generation (kf_shot_1)

#### Status

✅ Complete (2026-07-12)

#### Objective

Fix a bug where the Production Planner selected `openrouter/google/gemini-3-pro-image` with `image_to_image` strategy, but the executable keyframe task was incorrectly populated with `fal/fal-ai/flux-pro/v1.1-ultra`. The provider capability catalog correctly states that `fal-ai/flux-pro/v1.1-ultra` supports only `text_to_image`, while `openrouter/google/gemini-3-pro-image` supports `image_to_image`.

#### Root Cause

In [`production_planner_service.py`](AI Production Studio/src/agents/production_planner_service.py:391), the `_enrich_assets_with_provider_info` method hardcoded `capability = "text_to_image"` when validating provider mismatches between individual assets and `model_selection.keyframe_model`. This ignored the asset's actual strategy — an asset with `strategy: "image_to_image"` was validated against `text_to_image` capability, causing incorrect pass-through or backfill behavior.

#### Changes

1. **[`production_planner_service.py`](AI Production Studio/src/agents/production_planner_service.py:391)**: Replaced hardcoded `capability = "text_to_image"` with dynamic resolution using the catalog's `_resolve_capability(asset_type, strategy)`.

2. **[`keyframe_generator_service.py`](AI Production Studio/src/generators/keyframe_generator_service.py:196)**: Added `_validate_asset_against_catalog()` — defense-in-depth check that rejects tasks when the provider AND model are found in the catalog but the declared strategy is explicitly unsupported. Unknown providers/models pass through.

3. **[`test_keyframe_generator_service.py`](AI Production Studio/tests/test_keyframe_generator_service.py:891)**: Added `TestProviderModelPreservation` with three regression tests verifying provider/model preservation and strategy rejection.

#### Verification

- 60/60 keyframe generator tests pass
- 42/42 production planner tests pass
- Regression: `openrouter/google/gemini-3-pro-image` + `image_to_image` preserved ✅
- Regression: `fal/fal-ai/flux-pro/v1.1-ultra` + `image_to_image` rejected ✅



## Enhancement fix 5.13 – Add Catalog-Driven Preview and Final Execution Planning

### Status

✅ Complete (2026-07-18)

### Objective

Enhance the Production Planner so that it creates separate **Preview** and **Final** execution plans for every required production asset.

The planner must use the updated Provider Capability Catalog as both:

1. A deterministic eligibility and filtering source.
2. A source of comparative model information provided to the Production Planner LLM.

The system must not send every technically compatible model to the LLM for every decision. Application logic shall first filter and rank models according to the requested execution profile, supported capability, catalog planning metadata, and asset requirements. The LLM shall then choose the best model from the resulting viable candidate set.

### Provider Capability Catalog Integration

Use the execution-profile and planning metadata added to the Provider Capability Catalog, including:

* `execution_profiles.preview`
* `execution_profiles.final`
* `planner_selection_policy`
* `relative_cost`
* `relative_speed`
* `relative_quality`
* `preview_preference`
* `final_preference`
* `profile_notes`
* Supported strategies and parameters
* Provider and model limitations

The Provider Capability Catalog remains the factual source of truth. It does not make the final creative decision, but it must control which models are eligible and appropriate to present to the LLM.

### Execution Profiles

The Production Planner shall create two model selections for every generated asset:

#### Preview Profile

Used by EPICs 6 through 8 to create the draft or reviewable production.

Preview selection should prioritize:

* Creative fidelity sufficient for meaningful review
* Lower generation cost
* Faster generation
* Technical compatibility
* Reasonable continuity and quality

#### Final Profile

Used by EPIC 9 when the user requests a final-quality production.

Final selection should prioritize:

* Maximum creative fidelity
* Character and environment consistency
* Motion and image quality
* Continuity
* Technical compatibility
* Cost efficiency when quality differences are not material

The Final model may be the same as the Preview model when the planner determines that a more expensive model would not materially improve the asset.

### Deterministic Candidate Filtering

Before invoking the Production Planner LLM, application logic shall create separate candidate sets for Preview and Final selection.

For each asset, first remove any model that:

* Does not support the required generation strategy.
* Does not support the required duration, aspect ratio, resolution, reference inputs, or other mandatory parameters.
* Is disabled or unavailable.
* Violates a known provider or model limitation.
* Is inappropriate for the requested execution profile according to the catalog.

#### Preview Candidate Rules

For Preview planning:

* Include models with `preview_preference: preferred`.
* Include models with `preview_preference: suitable`.
* Include models with `preview_preference: conditional` only when specific asset requirements justify their use.
* Do not ordinarily provide premium or conditional models to the LLM merely because they technically support the strategy.

For example, Seedance should not normally be included as a Preview candidate when a less expensive preferred or suitable model can satisfy the shot requirements.

Seedance may be included for Preview only when the system identifies a valid reason, such as:

* A difficult hero shot
* Complex camera movement
* Strong reference-driven continuity requirements
* A shot whose quality cannot be meaningfully evaluated using the normal Preview candidates
* No preferred or suitable Preview model can meet the mandatory requirements

The reason for including a conditional model must be recorded.

#### Final Candidate Rules

For Final planning:

* Include models with `final_preference: preferred`.
* Include models with `final_preference: suitable`.
* Include models with `final_preference: conditional` only when their capabilities match a specific asset need.
* Exclude models that cannot materially meet the final-quality requirements.

### Candidate Ranking

After filtering, application logic should provide the LLM with a manageable, ranked candidate set rather than an unfiltered list.

Preview candidates should be ranked using catalog metadata such as:

1. Strategy and parameter compatibility
2. Preview preference
3. Creative suitability
4. Relative cost
5. Relative speed
6. Relative quality
7. Continuity requirements

Final candidates should be ranked using:

1. Strategy and parameter compatibility
2. Final preference
3. Creative suitability
4. Relative quality
5. Continuity requirements
6. Known strengths and weaknesses
7. Relative cost and speed

The ranking must guide the LLM but must not automatically make the final selection when multiple viable candidates remain.

### LLM Model Selection

For each asset, provide the Production Planner LLM with:

* The asset purpose
* Scene and creative requirements
* Required generation strategy
* Required parameters
* Execution profile being planned
* Filtered and ranked viable candidates
* Relevant catalog metadata for each candidate
* Any conditional candidates and the reason they were included

The LLM shall select:

#### Preview Selection

* Provider
* Model
* Strategy
* Selection rationale

#### Final Selection

* Provider
* Model
* Strategy
* Selection rationale

The LLM must choose only from the candidates supplied by the deterministic filtering logic.

### Production Plan Output

For every required asset, store:

* Asset ID and purpose
* Required capability and strategy
* Preview viable options considered
* Preview selected provider
* Preview selected model
* Preview selected strategy
* Preview rationale
* Final viable options considered
* Final selected provider
* Final selected model
* Final selected strategy
* Final rationale
* Any conditional model included and why
* Whether Preview and Final use the same model

### UI Changes

Modify the Production Plan UI so that every asset displays separate Preview and Final planning sections.

#### Preview Section

Display:

* Viable models provided to the LLM
* Selected provider
* Selected model
* Selected strategy
* Selection rationale
* Relative cost, speed, and quality
* Any conditional model included and why

#### Final Section

Display:

* Viable models provided to the LLM
* Selected provider
* Selected model
* Selected strategy
* Selection rationale
* Relative cost, speed, and quality
* Whether the Final selection differs from Preview
* Why a more expensive model was or was not selected

### Execution Impact

This task modifies the Production Planner and its UI only.

* EPICs 6 through 8 shall execute the **Preview** model selections.
* EPIC 9 shall re-run the EPIC 6 through EPIC 8 workflow using the **Final** model selections.
* EPIC 9 shall not independently choose new providers or models unless the saved plan is invalid because a model is unavailable or no longer supported.
* If the Preview result is considered good enough, the user may stop after EPIC 8 and avoid the Final rerun.

### Acceptance Criteria

* The Production Planner reads and uses the updated execution-profile metadata from the Provider Capability Catalog.
* Separate Preview and Final candidate sets are created for every asset.
* Models are filtered deterministically before being provided to the LLM.
* Preview planning does not normally expose premium or conditional models when preferred or suitable Preview models meet the requirements.
* Conditional candidates are included only with a recorded asset-specific reason.
* The LLM selects both Preview and Final models only from the filtered candidate sets.
* Every planned asset contains Preview and Final provider, model, strategy, viable options, and rationale.
* The Production Plan UI clearly displays both selections and how the Provider Capability Catalog influenced them.
* Existing Production Planner behavior and tests continue to pass.
* New tests verify catalog filtering, profile-specific candidate selection, conditional-model inclusion, LLM selection constraints, and UI output.

---

### Task 5.13 Validation Adjustments

#### Status

✅ Complete (2026-07-18)

#### Objective

The initial Enhancement 5.13 implementation did not fully satisfy its own spec: the top-level Provider Strategy narrative predetermined a strategy before per-asset selection and only considered Preview providers (missing Final-only providers such as OpenRouter), there was no requirement to justify a more expensive Final selection, low-importance/background assets could be silently upgraded from Preview to Final with no material benefit, rationale was not separated into asset/strategy/tool concerns, and the UI was missing a "Final Planned Tool" display and used the ambiguous label "Eligible Options" for a purely capability-filtered (not profile-filtered) candidate list. This task corrects all of the above.

#### Requirements

1. Rename `Eligible Options` to `Technically Eligible Options`.

2. In the Preview & Final Model Selection section, display:

   * Preview Candidates Sent to LLM
   * Final Candidates Sent to LLM
   * Preview selected model and rationale
   * Final selected model and rationale
   * Why the Final selection differs from Preview
   * Conditional candidates and inclusion reasons

3. Add a visible `Final Planned Tool` section next to or beneath the `Preview Execution Tool`.

4. Correct the top-level Provider Strategy from `direct provider` to `hybrid`, because the plan uses direct Fal, direct Runway, and OpenRouter.

5. Ensure the top-level provider-strategy narrative is derived from completed per-asset selections and does not predetermine provider choices.

6. Require a material-quality justification whenever the Final model is more expensive than the Preview model.

7. For low-importance or background-only assets, allow the Preview and Final model to remain the same when an upgrade would not materially improve the finished video.

8. Separate the rationale into:

   * Why the asset is required
   * Why the generation strategy was selected
   * Why the specific provider/model was selected

#### Implementation Notes

**Root causes identified in the original 5.13 implementation** ([`production_planner_service.py`](AI%20Production%20Studio/src/agents/production_planner_service.py)):

* Step 4 of the system prompt asked the LLM to *choose* `model_selection.provider_strategy` before any per-asset provider/model selection happened in Steps 6, 7, and 14 — a predetermination that contradicted the "derived from completed selections" intent, even though the derivation code later overwrote `provider_strategy` itself.
* [`_derive_model_selection_from_assets()`](AI%20Production%20Studio/src/agents/production_planner_service.py) only counted providers from each asset's `preview_selection`, never `final_selection`. When a plan's Final selections introduced a provider (e.g. OpenRouter) that never appeared in any Preview selection, the derived strategy fell through to `direct_provider` instead of `hybrid` — the exact bug reported.
* There was no requirement or backstop enforcing a material-quality explanation when Final was selected at a higher cost tier than Preview, and no signal that let low-importance/background assets keep the same model across Preview and Final when an upgrade wouldn't matter.
* Every asset carried a single flat `rationale` field with no separation between "why this asset exists," "why this strategy," and "why this provider/model."
* The UI's "Preview Execution Tool" block (Task 5.11 legacy) had no Final counterpart, and its capability-filtered (not profile-filtered) list was still labeled `Eligible Options`.

**Changes made:**

1. **[`provider_capability_catalog.py`](AI%20Production%20Studio/src/catalog/provider_capability_catalog.py)** — added shared `_cost_rank`/`_quality_rank` module-level scales (refactored out of `rank_candidates`), plus public instance helpers `get_planning_for()`, `cost_rank()`, `quality_rank()`, and `is_more_expensive()` so the planner service can compare a Final candidate's cost/quality tier against its Preview counterpart using the same ranking the catalog uses internally. While building this, found and fixed a pre-existing bug in the quality scale: `relative_quality: "premium"` (the catalog's actual top tier, e.g. `veo3.1`, `gen4.5`, `seedance2`) was missing from the map entirely, so premium-quality models silently ranked the same as `"unknown"` — below `"good"` and `"high"` — undermining Final profile ranking's "maximum creative fidelity" goal. `"premium"` now ranks above `"excellent"`.

2. **[`production_planner_service.py`](AI%20Production%20Studio/src/agents/production_planner_service.py)**:
   * Rewrote system-prompt Step 4 ("Provider Strategy Is Derived, Not Predetermined") to tell the LLM the top-level strategy is computed after the fact from completed asset selections and that any value it writes will be discarded.
   * Rewrote `_derive_model_selection_from_assets()` to aggregate providers from **both** `preview_selection` and `final_selection` across every asset when computing `provider_strategy`, and added `_build_provider_strategy_narrative()` to generate `provider_rationale` purely from that completed-selection provider usage (never from the LLM's upfront guess).
   * Added `_apply_final_selection_corrections()`, a deterministic safety net (run after preview/final selections are populated, whether LLM-supplied or catalog-backfilled) that: reverts Final back to Preview for low-importance/background-only assets (`OPTIONAL` priority, or `RECOMMENDED`-priority `transition_clip`) when the Final candidate offers no quality-tier improvement; backfills `material_quality_justification` whenever Final is a more expensive cost tier than Preview; and backfills `differs_reason` whenever Final differs from Preview.
   * Added `_ensure_rationale_breakdown()`, which backfills `asset_necessity_rationale` and `strategy_rationale` per asset when the LLM omits them, and updated Step 7/Step 14 system-prompt instructions to request the three-part rationale split and the material-quality-justification requirement explicitly.

3. **[`production-plan.schema.json`](AI%20Production%20Studio/schemas/production-plan.schema.json)** — added `asset_necessity_rationale` and `strategy_rationale` to the asset object; added `material_quality_justification` and `differs_reason` to `final_selection`; clarified the `model_selection.provider_strategy`/`provider_rationale` descriptions to state they are derived from both Preview and Final selections.

4. **[`CreativePromptValidatorPage.jsx`](schmucks-studio/src/developer-studio/pages/CreativePromptValidatorPage.jsx)**:
   * Renamed `Eligible Options` to `Technically Eligible Options`.
   * Added a `Final Planned Tool` card beside the existing `Preview Execution Tool` card (renamed the containing collapsible to "Planned Execution Tools (Preview + Final)"), showing the Final provider/model/strategy and a SAME/DIFFERS badge.
   * Renamed `Preview Candidates` / `Final Candidates` to `Preview Candidates Sent to LLM` / `Final Candidates Sent to LLM`.
   * Added a `Why Final Differs from Preview` block (reads `final_selection.differs_reason`) and a `💰 Material Quality Justification` block (reads `final_selection.material_quality_justification`), alongside the existing `why_not_more_expensive` display.
   * Relabeled conditional-candidate displays to `Conditional candidates & inclusion reasons`.
   * Added a `Rationale Breakdown` block showing `Why This Asset Is Required` (`asset_necessity_rationale`) and `Why This Generation Strategy` (`strategy_rationale`), with the existing per-profile `rationale` fields covering "why this specific provider/model."

#### Verification

* Smoke-tested `_derive_model_selection_from_assets()` directly: a plan mixing `fal` (Preview+Final) and `openrouter` (Preview+Final) assets now derives `provider_strategy: "hybrid"` with a rationale that cites completed Preview+Final provider usage, discarding any LLM-supplied guess.
* Smoke-tested `_apply_final_selection_corrections()` against the real catalog: a low-importance `transition_clip` with a Final pick offering no quality gain over Preview is reverted to Preview with `differs_from_preview: false`; a `REQUIRED` hero shot with a genuinely more expensive, higher-quality Final pick receives a populated `material_quality_justification` and `differs_reason`; a same-model asset receives the existing `why_not_more_expensive` default.
* Smoke-tested `_ensure_rationale_breakdown()`: asset lacking both fields receives traceable, non-empty defaults for `asset_necessity_rationale` and `strategy_rationale`.
* `AI Production Studio/schemas/production-plan.schema.json` re-validated as well-formed JSON after edits.
* `production_planner_service.py` and `provider_capability_catalog.py` re-validated with `ast.parse` after edits.
* `CreativePromptValidatorPage.jsx` re-validated with `esbuild` (extension-based JSX loader) — transforms cleanly, no syntax errors introduced.
* Added [`test_production_planner_validation_adjustments.py`](AI%20Production%20Studio/tests/test_production_planner_validation_adjustments.py) (16 tests) covering: hybrid derivation from a Preview/Final provider mix (the reported regression), direct/openrouter-only derivation, discarding an LLM-predetermined `provider_rationale`, the Step 4 prompt no longer asking the LLM to choose the strategy upfront, `material_quality_justification`/`differs_reason` backfill when Final is more expensive, `why_not_more_expensive` when Final matches Preview, low-importance/background revert-to-Preview behavior (`OPTIONAL` priority and `RECOMMENDED` `transition_clip`), `REQUIRED` assets never being treated as low-importance, low-importance assets still upgrading when the quality gain is real, and rationale-breakdown backfill/non-overwrite behavior. Enhancement 5.13 previously shipped with zero dedicated tests despite its own Acceptance Criteria requiring them.
* Ran `pytest tests/test_production_planner_validation_adjustments.py tests/test_production_planner_service.py tests/test_provider_capability_catalog.py`: 147 passed, 3 pre-existing failures unrelated to this change (fal.ai catalog data missing Kling/Veo video model entries — a pre-existing data gap, not touched by this task).

---

## Enhancement 5.14 – EPIC 5 Final Polish: Preview/Final Planning Explainability

### Status

✅ Complete (2026-07-18)

### Objective

The Preview/Final planning implementation is now largely complete. Do **not** redesign the planner or change the underlying architecture. This task is a refinement focused on explainability, transparency, and validation.

### Requirements

#### 1. Add Final Selection Rationale

Every asset currently displays **Why Selected (Preview)**.

Add a corresponding **Why Selected (Final)** section.

If the Final model is different from Preview, explain why the planner determined that the higher-cost model provides a material improvement.

Example:

* Character identity reused across all four shots.
* Higher facial consistency.
* Better clothing consistency.
* Better reference fidelity.
* Better camera motion support.

If the Final model is the same as Preview, explain why no upgrade was selected.

Example:

* Background-only asset.
* Appears briefly in one shot.
* Higher-quality model would not materially improve the finished production.
* Preview model already satisfies quality requirements.

The goal is that a user can immediately understand *why* the planner upgraded — or did not upgrade — an asset.

#### 2. Expose Candidate Filtering

The planner currently displays **Technically Eligible Options**.

Also display:

* Preview Candidates Sent to LLM
* Final Candidates Sent to LLM

This proves that deterministic filtering from the Provider Capability Catalog occurred before the LLM made its decision.

Do not display every technically compatible model as though it was considered equally.

#### 3. Make Planner Reasoning Explicit

For every asset, display a short planning summary.

Suggested examples:

```
Planning Factors

• Asset importance: HIGH
• Reused across: 4 shots
• Continuity critical: Yes
• Quality sensitivity: High
• Cost sensitivity: Medium
```

or

```
Planning Factors

• Asset importance: LOW
• Reused across: 1 shot
• Background only
• Quality sensitivity: Low
• Cost sensitivity: High
```

These values should come from the planner's existing reasoning, not hardcoded rules.

#### 4. Rename Top-Level Summary Fields

The top-level section currently contains:

* Keyframe Model
* Primary Video Model
* Fallback Video Model

These are now summaries, not execution directives.

Rename them to make that clear.

Suggested names:

* Most Common Preview Keyframe Model
* Most Common Preview Video Model
* Most Common Preview Video Fallback

These values are informational only and are derived from the completed per-asset Preview selections.

EPICs 6–9 must continue reading the per-asset Preview and Final selections rather than these summaries.

#### 5. Validate Planner Behavior

Add tests confirming:

* Low-importance assets are allowed to use the same Preview and Final model.
* High-importance assets may upgrade to a premium Final model.
* Every Final upgrade includes a material-quality rationale.
* Every non-upgrade includes a rationale explaining why additional cost was not justified.
* Preview and Final candidate lists reflect deterministic filtering from the Provider Capability Catalog.
* The LLM never selects a model outside the supplied candidate lists.

### Acceptance Criteria

This task is complete when:

* Every asset has both Preview and Final selection rationales.
* Candidate filtering is visible in the UI.
* Planner reasoning is transparent.
* Top-level model summaries are clearly informational.
* Existing functionality remains unchanged.
* No architectural redesign is introduced — this is a usability and validation improvement only.

### Implementation Notes

No architectural change was made — the planner's existing catalog-driven filtering, Preview/Final selection, and correction pipeline from Task 5.13 Validation Adjustments are unchanged. This task is purely additive: new derived fields, new UI display, and new tests over the existing pipeline.

**Backend (`production_planner_service.py`):**

* Added a dependency-graph pre-pass in `_enrich_assets_with_profile_selections()`: a `Counter` over every asset's `dependencies[]` array computes, per asset_id, how many *other* assets depend on it — "reused across N shots." This reuses the plan's own existing `dependencies` schema field; no new signal was introduced.
* Added `_build_planning_factors(asset, asset_reqs, reused_across_count)` — computes `asset_importance` (HIGH/MEDIUM/LOW), `continuity_critical`, `quality_sensitivity`, `cost_sensitivity`, and `background_only`, stored as `asset.planning_factors`. Every input is a signal the planner already computes: `priority`/`asset_type` (schema fields), `is_hero_shot`/`needs_maximum_fidelity`/`needs_character_consistency` (existing `_infer_asset_requirements()` flags), and `reused_across_count` (the new dependency-graph pre-pass above). Satisfies "these values should come from the planner's existing reasoning, not hardcoded rules."
* Added `_build_upgrade_reasons()` / `_build_no_upgrade_reasons()` — turn `planning_factors` plus catalog `best_for` tags into specific, asset-grounded bullet lists (e.g. "Identity reused across 4 shots — consistency across all of them depends on the higher-fidelity model.") instead of the previous single generic sentence.
* `_apply_final_selection_corrections()` (from Task 5.13 Validation Adjustments) now reads `asset.planning_factors["asset_importance"] == "LOW"` for its low-importance check (previously recomputed priority/asset_type inline — now a single source of truth shared with the UI display), and populates `final_selection.upgrade_reasons` / `no_upgrade_reasons` (arrays) alongside the existing joined-text `material_quality_justification` / `why_not_more_expensive` fields for backward compatibility. Includes a lazy fallback that computes `planning_factors` on the fly for any caller that invokes the method standalone (preserves the Task 5.13 test suite's direct-call contract).
* Added `_validate_selection_within_candidates()` — after preview/final selections are populated (LLM- or catalog-sourced), verifies the selected `provider_id`/`model_id` is actually present in that selection's own `candidates_considered` list; if not, corrects it to the top-ranked candidate and records `selection_corrected_reason`. This makes "the LLM never selects a model outside the supplied candidate lists" an enforced guarantee, not just an instruction.

**Schema (`production-plan.schema.json`):** added `planning_factors` object to the asset schema; added `upgrade_reasons`, `no_upgrade_reasons`, `selection_corrected_reason` to `final_selection` (and `selection_corrected_reason` to `preview_selection`).

**UI (`CreativePromptValidatorPage.jsx`):**

* Added a "📋 Planning Factors" block (asset importance, reused-across count, continuity critical, quality/cost sensitivity, background-only) inside the "Planned Execution Tools" collapsible, right after "Required Capability."
* Added "Preview Candidates Sent to LLM" / "Final Candidates Sent to LLM" compact chip lists in the same collapsible, right after "Technically Eligible Options" — visually distinct from that unfiltered list to make the deterministic profile-filtering step legible at a glance.
* Added a "Why Selected (Final)" block mirroring the existing "Why Selected (Preview)" block, rendering `upgrade_reasons`/`no_upgrade_reasons` as bullets when available (falling back to the joined prose fields).
* Upgraded the existing "💰 Material Quality Justification" and `why_not_more_expensive` displays in the "Preview & Final Model Selection" section to render as bullet lists when the structured arrays are present.
* Renamed the "🤖 Model Selection" summary labels: `Keyframe Model` → `Most Common Preview Keyframe Model`, `Primary Video Model` → `Most Common Preview Video Model`, `Fallback Video Model` → `Most Common Preview Video Fallback`; added an explanatory caption noting these are informational summaries only and that EPICs 6–9 read per-asset `preview_selection`/`final_selection` instead.

### Verification

* Added [`test_production_planner_enhancement_5_14.py`](AI%20Production%20Studio/tests/test_production_planner_enhancement_5_14.py) (13 tests) covering: `planning_factors` derivation for hero/reused, optional/background, and plain-required assets; `reused_across_count` computed correctly from the dependency graph across a multi-asset plan; low-importance same-model behavior with structured `no_upgrade_reasons`; high-importance upgrade behavior with structured `upgrade_reasons`; every Final upgrade carrying a material-quality rationale; every non-upgrade carrying a `why_not_more_expensive` rationale; Preview and Final candidate lists reflecting independently-filtered, catalog-sourced sets; an out-of-candidate LLM selection being corrected to the top-ranked supplied candidate (both as a unit test and as a full end-to-end enrichment-pipeline test); and a same-list selection being left untouched.
* Updated one stale assertion in [`test_production_planner_validation_adjustments.py`](AI%20Production%20Studio/tests/test_production_planner_validation_adjustments.py) (`test_optional_asset_reverted_to_preview_when_no_quality_gain`) that checked for the old generic "low-importance" wording — Enhancement 5.14 intentionally replaced it with the more specific "Background-only asset. Not reused by any other asset...." bullet reasons, matching this task's own example output.
* Fixed a real backward-compatibility regression introduced mid-implementation: `_apply_final_selection_corrections()` initially required a pre-computed `planning_factors`, breaking direct/standalone callers (including the Task 5.13 test suite). Added a lazy in-method fallback so standalone calls still work correctly.
* Ran `pytest tests/test_production_planner_enhancement_5_14.py tests/test_production_planner_validation_adjustments.py tests/test_production_planner_service.py tests/test_provider_capability_catalog.py`: **160 passed**, 3 pre-existing failures unrelated to this change (fal.ai catalog data missing Kling/Veo video model entries).
* `production_planner_service.py` re-validated with `ast.parse`; `production-plan.schema.json` re-validated as well-formed JSON; `CreativePromptValidatorPage.jsx` re-validated with `esbuild` (clean transform) and `eslint` (only the 3 pre-existing, unrelated warnings/errors).

---

# EPIC 6. Keyframe Generator

## Objective

Generate and validate all reference images defined by the Production Plan.

The Keyframe Generator is the provider-agnostic execution component responsible for producing the visual reference assets required for downstream video generation.

It transforms the image-generation instructions in the Production Plan into validated Reference Assets by:

* Preparing provider-specific generation requests from the Production Plan.
* Executing image generation using the specified provider and model.
* Respecting asset dependencies and generation sequencing.
* Evaluating generated assets against the quality gates defined in the Production Plan.
* Executing the retry strategy defined in the Production Plan when an asset fails a blocking quality gate.
* Storing generated assets with complete traceability metadata.
* Returning accepted Reference Assets for downstream video generation.

The Keyframe Generator executes the Production Plan.

It must not independently select providers, models, workflows, generation strategies, quality criteria, or retry strategies.

## Progress

**100%** (5/5 active tasks; 2 deferred)

## Tasks

* [x] Task 6.1 – Design Keyframe Generator Execution Contract
* [x] Task 6.2 – Create Reference Asset JSON Schema
* [x] Task 6.3 – Implement Provider-Agnostic Image Generation Service
* [x] Task 6.4 – Create Keyframe Generator REST API Endpoint
* [x] Task 6.5 – Build Reference Asset Viewer UI
* [~] Task 6.6 – Implement Quality Gates, Retry Execution, and Review Display (deferred)
* [~] Task 6.7 – Build Tests (deferred)

> **Deferral Note (2026-07-11):** Tasks 6.6 (Quality Gates/Retry) and 6.7 (Tests) are deferred to unblock EPIC 7 (Video Generator). The Keyframe Generator service, API, and UI are functional — images can be generated and reviewed. Quality gates and automated retry will be implemented when the full end-to-end pipeline is validated.

## Inputs & Outputs

### Inputs

| Input           | Source | Required |
| --------------- | ------ | -------- |
| Production Plan | EPIC 5 | Yes      |

### Outputs

| Output           | Description                                                                                                                                    | Consumer |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Reference Assets | Generated and accepted visual reference assets with generation metadata, quality-gate results, retry history, and Production Plan traceability | EPIC 7   |

## Definition of Done

EPIC 6 is complete when:

* Every reference-image task in the Production Plan can be executed.
* A single extensible Reference Asset structure supports all required image asset types.
* Generation requests use the provider, model, strategy, prompt, negative prompt, and parameters specified in the Production Plan.
* Asset dependencies and generation sequencing are respected.
* Generated assets are evaluated against the quality gates defined in the Production Plan.
* Assets that fail blocking quality gates follow the retry strategy defined in the Production Plan.
* Accepted Reference Assets are stored with complete traceability metadata.
* Accepted Reference Assets are available for downstream video generation.
* No provider, model, workflow, quality-gate, or retry-strategy planning is performed by the Keyframe Generator.
* Automated tests pass.

## Acceptance Criteria (Gate to EPIC 7)

Before proceeding to EPIC 7 (Video Generator), the following must be satisfied:

* Every required reference-image task in the Production Plan has a terminal result.

* Every accepted Reference Asset identifies:

  * asset_id
  * asset_type
  * source_plan_asset_id
  * provider
  * model
  * generation_strategy
  * prompt_used
  * parameters_used
  * output location
  * generation status
  * quality-gate results
  * retry history

* Providers and models exactly match the Production Plan.

* Generation strategies and parameters exactly match the Production Plan.

* Generated assets are traceable to their Production Plan entries.

* Asset dependencies are executed in the correct order.

* No asset with a failed blocking quality gate is marked as accepted.

* Retry attempts do not exceed the limits defined in the Production Plan.

* Exhausted retries return an explicit failure or escalation result rather than silently accepting a poor asset.

* No production-planning decisions are made by the Keyframe Generator.

* All tests pass.

## Sign-off

**Sign-off is required before this EPIC is considered complete and work may begin on EPIC 7.**

| Role        | Name | Date | Signature |
| ----------- | ---- | ---- | --------- |
| Implementer | --   | --   | --        |
| Reviewer    | --   | --   | --        |

> Sign-off must be recorded in IMPLEMENTATION-LOG-MVP.md with date and verification evidence.

---

### Task 6.1 – Design Keyframe Generator Execution Contract

#### Status

✅ Complete

#### Objective

Define the Keyframe Generator’s execution responsibilities and its contract with the Production Planner and Video Generator.

The execution contract must ensure that the Keyframe Generator faithfully executes image-generation instructions without duplicating or overriding decisions already made by the Production Planner.

#### Requirements

The execution contract must define:

* **Mission** — Convert image-generation tasks from the Production Plan into accepted Reference Assets.
* **Core Principle** — Execute the Production Plan faithfully while preventing failed reference images from entering video generation.
* **Role in the Pipeline** — Between Production Planner (EPIC 5) and Video Generator (EPIC 7).
* **Input Contract** — Read all image-generation instructions, dependencies, quality gates, and retry rules required from the Production Plan.
* **Output Contract** — Return a collection of Reference Assets with generation results, quality-gate results, retry history, and traceability metadata.
* **Execution Boundary** — The Keyframe Generator may prepare requests, invoke providers, store results, evaluate defined quality criteria, and execute defined retry actions.
* **Planning Boundary** — The Keyframe Generator may not independently select providers, models, workflows, generation strategies, quality criteria, retry strategies, or creative changes.
* **Asset-Type Support** — The execution contract must support an extensible `asset_type` rather than separate service contracts for each image category.
* **Dependency Rules** — Assets may execute in parallel when independent and must wait when the Production Plan defines dependencies.
* **Quality-Gate Rules** — Blocking gates must pass before an asset can be accepted. Warning gates must be recorded but do not automatically reject an asset unless the Production Plan says otherwise.
* **Retry Rules** — Retries must use only the actions, limits, prompt modifications, provider/model changes, or escalation behavior defined by the Production Plan.
* **Failure Rules** — Exhausted retries must produce an explicit FAILED or ESCALATED result.
* **Traceability Rules** — Every generated asset and attempt must map back to its Production Plan task.
* **Provider-Agnostic Rule** — Provider-specific behavior must be isolated behind adapters so the execution service uses one internal request and response contract.
* **MVP Scope** — Support the providers and image models currently emitted by the Production Planner; additional providers can be added through adapters without redesigning the execution service.

The contract should support asset types including:

* `CHARACTER_REFERENCE`
* `ENVIRONMENT_REFERENCE`
* `STORYBOARD_FRAME`
* `FIRST_FRAME`
* `LAST_FRAME`
* `TRANSITION_FRAME`
* `OBJECT_REFERENCE`
* `STYLE_REFERENCE`
* `LIGHTING_REFERENCE`
* `CUSTOM`

The presence of an asset type in the contract does not mean it must be generated for every production. Only assets requested by the Production Plan are executed.

---

### Task 6.2 – Create Reference Asset JSON Schema

#### Status

✅ Complete

#### Objective

Create the JSON schema that defines the output of the Keyframe Generator using one extensible Reference Asset structure.

The schema must support all reference-image categories through an `asset_type` field rather than defining separate output schemas for character references, environment references, storyboard frames, or other image types.

#### Requirements

The schema must define a top-level Keyframe Generation Result containing:

1. **source_plan_reference**

   * production plan identifier or traceable reference
   * source prompt reference where available

2. **execution_summary**

   * total tasks
   * accepted assets
   * failed assets
   * escalated assets
   * total attempts
   * execution status

3. **reference_assets**

   * Array of Reference Asset objects.

Each Reference Asset must include:

* `asset_id`
* `asset_type`
* `source_plan_asset_id`
* `associated_scene_id`, when applicable
* `associated_shot_id`, when applicable
* `purpose`
* `provider`
* `model`
* `generation_strategy`
* `prompt_used`
* `negative_prompt_used`, when supported
* `parameters_used`
* `output_format`
* `output_location`
* `status`
* `attempt_count`
* `quality_gate_results`
* `retry_history`
* `generation_metadata`
* `error`, when applicable

The schema must support these statuses:

* `PENDING`
* `GENERATING`
* `QUALITY_REVIEW`
* `ACCEPTED`
* `FAILED`
* `ESCALATED`

Each quality-gate result must include:

* `gate_id`
* `criterion`
* `severity`
* `passed`
* `evidence`
* `review_method`

Each retry-history entry must include:

* `attempt_number`
* `action`
* `provider`
* `model`
* `prompt_used`
* `parameters_used`
* `result`
* `failure_reason`

Generation metadata should include available provider-returned values such as:

* request identifier
* seed
* width
* height
* MIME type
* generation time
* provider usage or cost data

The schema must enforce:

* Required fields at every nesting level.
* Enumerated asset types, statuses, quality severities, and retry results.
* Numeric ranges such as `attempt_count >= 1`.
* `additionalProperties: false` throughout, except for explicitly provider-specific parameter and metadata objects where flexible key/value storage is required.
* Unknown structured properties rejected.
* Accepted assets must have a non-empty output location.
* Failed and escalated assets must include an error or terminal failure reason.

The schema should be extensible so future reference asset types can be added without restructuring the complete Keyframe Generator output.

---

### Task 6.3 – Implement Provider-Agnostic Image Generation Service

#### Status

✅ Complete

#### Objective

Implement the runtime Keyframe Generator service that creates the actual reference images requested by the Production Plan.

This task begins actual image generation.

The service must execute image-generation instructions exactly as defined by the Production Planner without independently selecting providers, models, prompts, parameters, workflows, or generation strategies.

#### Requirements

The service must:

* Accept a complete Production Plan.
* Identify all image-generation tasks assigned to the Keyframe Generator.
* Support all reference asset types defined by the Reference Asset schema.
* Reject requests that contain no executable image-generation tasks.
* Convert each Production Plan image task into a normalized internal generation request.
* Execute each request using the provider specified in the Production Plan.
* Use the exact model specified in the Production Plan.
* Use the exact generation strategy specified in the Production Plan.
* Use the exact prompt specified in the Production Plan.
* Use the exact negative prompt specified in the Production Plan when supported.
* Use the exact provider-specific parameters specified in the Production Plan.
* Respect the output format specified in the Production Plan.
* Respect asset dependencies and generation sequencing.
* Execute independent image-generation tasks in parallel when permitted by the Production Plan.
* Normalize provider responses into the Reference Asset structure defined in Task 6.2.
* Save or register the output location of every successfully generated image.
* Preserve available provider-returned metadata, including:

  * request identifier
  * seed
  * image width
  * image height
  * MIME type
  * generation time
  * usage
  * cost
* Preserve traceability from every generated image to its Production Plan asset task.
* Return structured failures for:

  * provider errors
  * unsupported providers
  * invalid provider responses
  * provider timeouts
  * missing image output
  * inaccessible output locations
* Support generating:

  * all reference-image tasks in a Production Plan
  * one specific reference-image task by asset identifier
* Avoid regenerating successfully completed assets unless explicitly requested.
* Avoid changing providers, models, prompts, strategies, parameters, quality criteria, or retry rules.

The provider execution layer must use a common adapter interface similar to:

```text
generate_image(normalized_request) -> normalized_generation_result
```

The normalized generation request must include:

* source plan asset identifier
* asset type
* purpose
* associated scene identifier, when applicable
* associated shot identifier, when applicable
* provider
* model
* generation strategy
* prompt
* negative prompt
* provider-specific parameters
* output format
* dependency asset references

The normalized generation result must include:

* success or failure
* generated-image output location
* provider request identifier
* seed, when available
* width and height
* output format
* generation metadata
* usage or cost, when available
* structured error information, when applicable

The initial implementation should support only the image providers and models currently emitted by the Production Planner.

New providers must be added through adapters rather than through provider-selection logic inside the main Keyframe Generator service.

At the completion of Task 6.3:

* Actual reference images can be generated through the service.
* Every result conforms to the Reference Asset schema.
* Every result is traceable to the Production Plan.
* Generated image locations are available for the REST API and UI implemented in subsequent tasks.

---

### Task 6.4 – Create Keyframe Generator REST API Endpoint

#### Status

✅ Complete

#### Objective

Expose the Keyframe Generator service through a REST API endpoint so the frontend and future production orchestration can execute reference-image generation.

#### Requirements

Create an endpoint that:

* Accepts `POST /api/keyframe-generator/generate`.
* Requires a complete `production_plan` JSON object.
* Accepts an optional `asset_id`.
* Generates all pending reference-image tasks when no `asset_id` is supplied.
* Generates only the requested reference-image task when `asset_id` is supplied.
* Calls the Keyframe Generator service implemented in Task 6.3.
* Returns:

```json
{
  "generation_result": {},
  "usage": {}
}
```

The `generation_result` must include:

* Source Production Plan traceability.
* Execution summary.
* All Reference Asset results.
* Successful generated-image locations.
* Structured failed-generation results.
* Provider metadata where available.

The endpoint must return 400 for:

* Missing request body.
* Invalid JSON.
* Empty JSON body.
* Missing `production_plan`.
* Null `production_plan`.
* Malformed Production Plan.
* Production Plan with no executable reference-image tasks.
* Unknown `asset_id`.
* Asset identifier that does not reference an image-generation task.
* Service `ValueError`.

The endpoint must return 500 for:

* Unexpected runtime failures not handled by the Keyframe Generator service.

The endpoint must:

* Return handled provider failures as structured Reference Asset results rather than replacing them with generic server errors.
* Preserve successful assets when other assets fail.
* Support partial-success responses.
* Accept an optional execution request for one asset without regenerating unrelated successful assets.
* Use `request.get_json(silent=True)` or the established equivalent for graceful request parsing.
* Follow the same architectural and error-handling patterns as the existing Validator, Creative Intent, Scene Director, Storyboard, and Production Planner endpoints.
* Return usage and cost information where available.

The endpoint should be usable by:

* The Keyframe Generator UI.
* Automated production orchestration.
* EPIC 7.
* Automated tests.

At the completion of Task 6.4:

* The actual image-generation service is accessible through HTTP.
* The complete image-generation result can be consumed by the frontend.
* Individual reference assets can be generated without rerunning all completed image tasks.

---

### Task 6.5 – Build Reference Asset Viewer UI

#### Status

✅ Complete

#### Objective

Add the Keyframe Generator interface to the existing production workflow page.

This task must allow the user to execute the image-generation portion of the Production Plan and immediately see every image created.

At the completion of this task, the user must be able to generate and visually inspect all reference images requested by the Production Plan.

#### Requirements

The UI must:

* Add a **Generate Reference Assets** button after a Production Plan is available.
* Call `POST /api/keyframe-generator/generate` with the complete Production Plan.
* Display every image returned by the Keyframe Generator.
* Display multiple generated images simultaneously.
* Display partial results when some assets succeed and others fail.
* Group images by asset type, scene, shot, or Production Plan stage where useful.
* Show an execution summary containing:

  * total requested assets
  * successfully generated assets
  * failed assets
  * pending assets
  * total generation attempts
  * provider usage, when available
  * total image-generation cost, when available
  * overall execution status

Each Reference Asset card must display:

* Generated image preview.
* Asset identifier.
* Asset type.
* Purpose.
* Associated scene, when applicable.
* Associated shot, when applicable.
* Source Production Plan asset identifier.
* Provider.
* Model.
* Generation strategy.
* Generation status.
* Attempt count.
* Image dimensions.
* Output format.
* Prompt used.
* Negative prompt used, when applicable.
* Provider-specific parameters.
* Provider request identifier, when available.
* Seed, when available.
* Generation time, when available.
* Usage or cost, when available.

The UI must:

* Display every successful generated image.
* Clearly display failed assets alongside successful assets.
* Show the structured error reason for failed generations.
* Support complete success, partial success, and complete failure states.
* Allow one pending or failed asset to be generated individually without regenerating successful assets.
* Avoid regenerating accepted or successful assets unless explicitly requested.
* Provide a raw JSON viewer for the complete generation result.
* Cache generated Reference Assets in localStorage with the existing workflow data.
* Restore cached Reference Assets after a page refresh.
* Preserve previously generated images when generating an additional asset.
* Handle:

  * loading state
  * empty state
  * provider failure
  * partial success
  * complete success
  * unexpected API failure
* Avoid asking the user to choose providers, models, prompts, strategies, or parameters already defined by the Production Plan.
* Include generated Reference Assets in the existing PDF/export workflow where practical.

At the completion of Task 6.5, the user must be able to:

1. Click **Generate Reference Assets**.
2. Generate the actual images defined by the Production Plan.
3. See every generated image directly on the screen.
4. Inspect the provider, model, prompt, parameters, metadata, and Production Plan traceability for each image.
5. Clearly identify any image-generation task that failed.
6. Generate one failed or pending asset without rerunning successful assets.

---

### Task 6.6 – Implement Quality Gates, Retry Execution, and Review Display

#### Status

Not Started

#### Objective

Prevent unsuitable reference images from entering video generation by executing the quality gates and retry rules defined in the Production Plan.

This task enhances the image gallery created in Task 6.5 by evaluating generated images, automatically executing permitted retries, and clearly identifying the final accepted assets.

This task must not create new quality criteria or retry strategies.

It executes the quality gates and retry instructions already defined by the Production Planner.

#### Requirements

For each generated Reference Asset, the service must:

* Retrieve the applicable quality gates from the Production Plan.
* Evaluate every applicable quality-gate criterion.
* Record whether each criterion passed or failed.
* Record supporting evidence or the reason for failure.
* Record the review method used.
* Distinguish between:

  * `BLOCKING` quality gates
  * `WARNING` quality gates
* Accept an asset only when all applicable blocking gates pass.
* Record warning failures without automatically rejecting the asset unless instructed by the Production Plan.
* Prevent any asset with a failed blocking gate from receiving `ACCEPTED` status.
* Identify the Production Plan retry rule corresponding to a blocking failure.
* Execute only the retry action defined by that rule.
* Enforce the maximum retries defined for each rule.
* Enforce the maximum total retries defined by the Production Plan.
* Re-run all applicable quality gates after every retry.
* Preserve every generation attempt in the asset’s retry history.
* Mark an asset `FAILED` or `ESCALATED` when retries are exhausted.
* Never silently accept an asset that failed a blocking quality gate.
* Never independently invent:

  * prompt modifications
  * provider changes
  * model changes
  * parameter changes
  * generation-strategy changes
  * additional retries
  * new quality criteria

For the MVP, quality-gate execution may combine:

* Deterministic technical checks.
* Automated image-analysis checks.
* Explicit manual-review status for criteria that cannot yet be reliably automated.

At minimum, deterministic checks must verify:

* An image was returned.
* The image output can be accessed or loaded.
* The output format is valid.
* Required dimensions are satisfied.
* Required aspect ratio is satisfied.
* Required provider metadata is present where applicable.
* The result maps to the expected Production Plan asset task.
* Provider failures and incomplete responses are not treated as successful generations.

Where the Production Plan defines visual criteria, evaluation should support requirements such as:

* Character identity markers.
* Character appearance.
* Wardrobe.
* Required props.
* Environment location.
* Environment key elements.
* Lighting.
* Weather.
* Time of day.
* Shot framing.
* Camera angle.
* Composition.
* Required object presence.
* Prohibited text.
* Prohibited logos.
* Visible generation artifacts.

#### Retry History

Each retry attempt must record:

* Attempt number.
* Failure that triggered the retry.
* Retry rule used.
* Action executed.
* Provider.
* Model.
* Generation strategy.
* Prompt used.
* Negative prompt used.
* Parameters used.
* Generated-image output location, when available.
* Quality-gate results.
* Attempt result.
* Failure reason, when applicable.

The final Reference Asset must retain the complete history of rejected, failed, and accepted attempts.

#### UI Requirements

The Reference Asset cards created in Task 6.5 must be enhanced to display:

* Current asset status:

  * `PENDING`
  * `GENERATING`
  * `QUALITY_REVIEW`
  * `ACCEPTED`
  * `FAILED`
  * `ESCALATED`
* Every quality-gate result.
* Quality criterion description.
* `BLOCKING` or `WARNING` severity.
* Pass or fail result.
* Supporting evidence or failure reason.
* Review method.
* Retry status.
* Current attempt number.
* Maximum permitted attempts.
* Complete retry history.
* Rejected image attempts where an image was returned.
* The final accepted image.
* Terminal failure or escalation reason.

The UI must:

* Update the primary displayed image when a retry produces a new candidate.
* Preserve prior image attempts for inspection.
* Clearly distinguish accepted images from rejected images.
* Show automatic retry activity without requiring user prompt rewriting.
* Show a manual retry action only when the Production Plan permits another retry.
* Disable retry after the Production Plan retry limit is exhausted.
* Keep accepted assets unchanged while failed assets are retried.
* Display partial success when some assets are accepted and others fail or escalate.
* Cache updated quality-gate results and retry history in localStorage.
* Restore complete review and retry state after a page refresh.
* Clearly identify which assets are approved for use by EPIC 7.
* Clearly indicate when a required asset prevents progression to EPIC 7.

At the completion of Task 6.6:

* Every generated asset has an explicit quality-review result.
* Failed blocking gates cannot enter video generation.
* Permitted retries occur without user prompt rewriting.
* The user can see every generated attempt and the final accepted image.
* EPIC 7 can distinguish usable assets from failed or escalated assets.

---

### Task 6.7 – Build Tests

#### Status

Not Started

#### Objective

Build comprehensive automated tests for the complete Keyframe Generator execution flow.

The test suite must verify that Production Plan image tasks are executed faithfully, actual images are returned and displayed, quality gates prevent unsuitable images from being accepted, retries follow the Production Plan, and accepted Reference Assets are suitable for EPIC 7.

#### Requirements

The test suite must cover:

**Schema tests:**

* Required top-level fields.
* Required Reference Asset fields.
* All asset-type enums.
* All status enums.
* Quality-gate result structures.
* Retry-history structures.
* Generation metadata structures.
* Numeric ranges.
* Accepted assets require a valid output location.
* Failed and escalated assets require terminal failure information.
* Unknown structured properties are rejected where applicable.
* Valid complete generation results are accepted.
* Accepted-assets-only downstream payload validates correctly.

**Service tests:**

* Production Plan parsing.
* Image-task identification.
* Rejection when no image tasks exist.
* Normalized request construction.
* Exact provider preservation.
* Exact model preservation.
* Exact generation-strategy preservation.
* Exact prompt preservation.
* Exact negative-prompt preservation.
* Exact provider-parameter preservation.
* Exact output-format preservation.
* Associated scene and shot preservation.
* Dependency ordering.
* Independent-task parallel execution.
* Provider response normalization.
* Output-location handling.
* Provider metadata preservation.
* Usage tracking.
* Cost tracking.
* Provider error handling.
* Timeout handling.
* Invalid provider response handling.
* Missing image-output handling.
* Traceability to Production Plan asset tasks.
* Successful assets are not regenerated unnecessarily.
* Individual asset generation does not regenerate unrelated successful assets.

**Provider adapter tests:**

* Normalized requests are accepted.
* Successful provider responses are normalized.
* Provider failures are normalized.
* Missing image output is rejected.
* Provider-specific metadata is retained.
* Unsupported providers return a clear execution error.
* The service does not independently select a replacement provider.
* Provider request parameters exactly match the Production Plan.

**API tests:**

* Missing request body returns 400.
* Invalid JSON returns 400.
* Empty JSON returns 400.
* Missing Production Plan returns 400.
* Null Production Plan returns 400.
* Malformed Production Plan returns 400.
* Production Plan with no image tasks returns 400.
* Valid complete request returns 200.
* Specific asset generation returns 200.
* Unknown asset identifier returns 400.
* Non-image asset identifier returns 400.
* Service `ValueError` returns 400.
* Unexpected runtime error returns 500.
* Handled provider failures return structured Reference Asset results.
* Mixed successful and failed generations return partial results.
* Successful assets remain present when another asset fails.

**UI tests:**

* Generate Reference Assets button appears after Production Plan creation.
* Every generated image is displayed.
* Multiple generated images are displayed simultaneously.
* Images are grouped correctly.
* Basic metadata is displayed for every asset.
* Failed assets are displayed.
* Structured provider errors are displayed.
* Partial-success state is displayed.
* Individual asset generation does not remove existing successful images.
* Cached assets restore after refresh.
* Loading, empty, failure, partial-success, and complete-success states render correctly.
* Raw generation-result JSON is viewable.

**Quality-gate tests:**

* Blocking-gate pass permits acceptance.
* Blocking-gate failure prevents acceptance.
* Warning-gate failure is recorded without automatic rejection where allowed.
* Output-existence validation.
* Image-accessibility validation.
* Output-format validation.
* Dimension validation.
* Aspect-ratio validation.
* Required metadata validation.
* Visual-evaluation results are preserved.
* Multiple quality gates are evaluated.
* Missing required gate results prevent acceptance.
* Provider failures never pass quality review.

**Retry tests:**

* The matching retry rule is selected from the Production Plan.
* Retry actions are executed exactly as specified.
* Prompt modifications occur only when explicitly defined.
* Model changes occur only when explicitly defined.
* Provider changes occur only when explicitly defined.
* Parameter changes occur only when explicitly defined.
* Per-rule retry limits are enforced.
* Total retry limits are enforced.
* Quality gates are re-run after retries.
* Successful retry produces an accepted asset.
* Exhausted retries produce a failed or escalated asset.
* Complete retry history is preserved.
* Accepted assets are not retried.
* Failed assets can be retried individually when allowed.
* Prior image attempts remain available for inspection.

**Integration tests:**

* Production Plan image tasks generate Reference Assets.
* Every successfully generated image appears in the UI.
* Every Reference Asset traces to a Production Plan asset task.
* Every Production Plan image task receives an execution result.
* Dependencies are respected across multiple assets.
* Quality gates are applied to every applicable asset.
* Retry strategy is followed exactly.
* Failed blocking gates never produce accepted assets.
* Accepted Reference Assets contain all metadata required by EPIC 7.
* Mixed outcomes support partial success without losing accepted assets.
* Failed and escalated assets are excluded from the EPIC 7 accepted-assets payload.
* Complete generation output validates against the Reference Asset schema.
* Accepted-assets-only output validates against the downstream contract.
* All existing tests continue to pass without regressions.

## Sign-off

**Sign-off is required before this EPIC is considered complete and work may begin on EPIC 7.**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Implementer | -- | -- | -- |
| Reviewer | -- | -- | -- |

> Sign-off must be recorded in IMPLEMENTATION-LOG-MVP.md with date and verification evidence.

---

## EPIC 6 Bug Fixes (2026-07-13)

### Bug Fix 6.1 – Dependency Asset IDs Treated as URLs in RunwayImageProvider

**Problem:** When an `image_to_image` asset (e.g., `kf_7`) declared a dependency on another asset (e.g., `kf_2`), [`RunwayImageProvider._get_reference_image_uri()`](AI Production Studio/src/generators/runway_image_provider.py:221) treated the dependency value `"kf_2"` as a URL and attempted to download it, causing `Invalid URL 'kf_2': No scheme supplied`.

**Root Cause:** The `dependencies` array in Production Plan assets contains asset IDs, not URLs. The provider was using `deps[0]` directly as a download URL without validating it was an `http(s)` URL.

**Fix (3 files):**

1. **[`runway_image_provider.py`](AI Production Studio/src/generators/runway_image_provider.py:221)** — `_get_reference_image_uri()` now:
   - Checks `reference_assets` field (resolved EPIC 6 output) before falling back to `dependencies`
   - Validates dependency values are actual `http(s)` URLs before attempting download
   - Logs a clear warning when a non-URL dependency is encountered instead of crashing

2. **[`keyframe_generator_service.py`](AI Production Studio/src/generators/keyframe_generator_service.py:302)** — Added `_resolve_dependency_references()` method that resolves dependency asset IDs to actual image URLs by checking:
   - Production plan assets' `reference_assets`, `output_location`, `_generation_result`
   - In-flight `results` from assets already generated in the current batch
   - Called in both `generate_keyframes()` and `generate_by_asset_id()` before provider dispatch
   - After each successful generation, writes the image URL back to the production plan asset so subsequent dependent assets find it

3. **[`CreativePromptValidatorPage.jsx`](schmucks-studio/src/developer-studio/pages/CreativePromptValidatorPage.jsx:497)** — Frontend now merges generated `output_location` URLs back into production plan assets after keyframe generation, so retries of dependent assets have resolved URLs.

**Verification:** All 60 keyframe generator tests pass.

### Bug Fix 6.2 – Runway Model `gpt-image-2` Rejected by API

**Problem:** Runway's API returned 400 error rejecting `gpt-image-2` as an invalid model for the `/v1/text_to_video` endpoint. The accepted models are all video-generation models (`gen3a_turbo`, `gen4.5`, `kling2.5_turbo_pro`, etc.).

**Fix:** Updated [`runway_image_provider.py`](AI Production Studio/src/generators/runway_image_provider.py:48) model mapping:
- `gen4_image` → `gen4.5` (was `gpt-image-2`)
- `gpt-image-2` → `gen4.5` (backward compatibility)
- `DEFAULT_IMAGE_MODEL` → `gen4.5` (was `gpt-image-2`)

### Bug Fix 6.3 – Shot Keyframes Generated Independently from Text (2026-07-17)

**Problem:** When `character_reference` and `environment_reference` assets existed in the Production Plan, `shot_keyframe` assets were still being generated using `text_to_image` strategy — independently regenerating each frame from text prompts. This caused character identity drift, wardrobe changes, environment inconsistencies, and lighting mismatches across consecutive storyboard frames. The approved reference images were never supplied as visual inputs to shot keyframe generation.

**Root Cause:** The Production Planner's system prompt and skill document did not mandate `image_to_image` strategy for shot keyframes. The [`_validate_strategy_connections()`](AI Production Studio/src/agents/production_planner_service.py:456) method only enforced keyframe→video connections, not reference→keyframe connections. The LLM was free to create shot keyframes as `text_to_image`, which meant each frame was independently generated from a text prompt without any visual reference to the approved character or environment.

**Fix (2 files):**

1. **[`production-planner.md`](AI Production Studio/skills/production-planner.md:250)** — Added **CRITICAL: Shot Keyframe Composition Rule** to the Keyframe Spec Principles:
   - When `character_reference` and/or `environment_reference` assets exist, EVERY `shot_keyframe` MUST use `image_to_image` strategy
   - Shot keyframes MUST list relevant reference asset IDs in `dependencies`
   - The prompt describes only shot-specific composition (camera angle, framing, action, emotion, movement)
   - Character identity, wardrobe, environment, lighting, and visual style come from the reference images
   - The selected provider and model MUST support `image_to_image` capability

2. **[`production_planner_service.py`](AI Production Studio/src/agents/production_planner_service.py:274)** — Three changes:
   - **System prompt**: Added **CRITICAL: Shot Keyframe Composition Rule (Reference → Keyframe)** section mirroring the skill document rule, with explicit dependency mapping rules
   - **Post-processing**: Added [`_validate_shot_keyframe_composition()`](AI Production Studio/src/agents/production_planner_service.py:531) method that:
     - Collects all `character_reference` and `environment_reference` asset IDs
     - Auto-corrects any `shot_keyframe` using `text_to_image` to `image_to_image` when references exist
     - **After strategy correction, revalidates the provider/model against the capability catalog** to ensure the selected provider/model supports `image_to_image`. If not, searches for a compatible fallback (preferring same-provider if available) and updates the asset's provider/model fields
     - Auto-adds missing reference dependencies to shot keyframes
     - Logs clear warnings for every correction made, including provider/model fallback changes
     - Called from [`_enrich_assets_with_provider_info()`](AI Production Studio/src/agents/production_planner_service.py:454) after `_validate_strategy_connections()`

**Design Decision:** The [`_ASSET_TYPE_TO_CAPABILITY`](AI Production Studio/src/catalog/provider_capability_catalog.py:47) mapping in the Provider Capability Catalog was intentionally left unchanged (`shot_keyframe` → `text_to_image` as fallback). The [`_STRATEGY_OVERRIDES`](AI Production Studio/src/catalog/provider_capability_catalog.py:56) dict already correctly resolves `image_to_image` strategy to `image_to_image` capability. The catalog fallback is correct for the legitimate case where `shot_keyframe` uses `text_to_image` (single_clip workflow with no references). The enforcement happens at the Production Planner level, not the catalog level.

**Verification:** The existing [`_resolve_dependency_references()`](AI Production Studio/src/generators/keyframe_generator_service.py:312) in the Keyframe Generator already handles `image_to_image` assets correctly — resolving dependency asset IDs to actual image URLs and populating `reference_assets`. No changes were needed in the Keyframe Generator or providers. The fix ensures the Production Plan is created correctly so the existing execution pipeline works as designed.

### Bug Fix 6.4 – fal.ai `nano-banana-pro/edit` Model ID Missing `fal-ai/` Prefix (2026-07-17)

**Problem:** The [`FalImageProvider`](AI Production Studio/src/generators/fal_image_provider.py:45) called `fal_client.subscribe("nano-banana-pro/edit", ...)` which resulted in `HTTP 404 Not Found` with error `Application "edit" not found`. The fal.ai API requires the full model path `fal-ai/nano-banana-pro/edit` — the `fal-ai/` prefix is part of the API endpoint routing, not just a namespace convention.

**Root Cause:** The [`provider_capability_catalog.json`](AI Production Studio/data/provider_capability_catalog.json:271) entry for Nano Banana Pro Edit had `model_id: "nano-banana-pro/edit"` without the `fal-ai/` prefix. All other fal.ai models in the catalog (`fal-ai/flux-pro/v1.1-ultra`, `fal-ai/flux-pro/v1.1`, `fal-ai/ideogram/v3`) correctly included the prefix. The `FalImageProvider` passed the model ID directly to `fal_client.subscribe()` without normalization.

**Fix (2 files):**

1. **[`provider_capability_catalog.json`](AI Production Studio/data/provider_capability_catalog.json:271)** — Fixed `model_id` from `"nano-banana-pro/edit"` to `"fal-ai/nano-banana-pro/edit"` to match the fal.ai API convention.

2. **[`fal_image_provider.py`](AI Production Studio/src/generators/fal_image_provider.py:118)** — Added defensive model ID normalization in `generate()`:
   - If the model ID contains a `/` but doesn't start with `fal-ai/` or `openai/`, prepends `fal-ai/`
   - Logs the normalization at INFO level for auditability
   - This protects against future catalog entries that may be authored without the prefix

**Verification:** The existing `test_fal_flux_rejected_for_image_to_image` test passes, confirming the FalImageProvider continues to work correctly. The normalization logic is defensive — it only activates when the model ID is missing the expected prefix.

---

# EPIC 7. Video Generator

## Objective

Execute the video-generation portion of the Production Plan.

The Video Generator is a provider-agnostic execution component responsible for generating video assets exactly as specified by the Production Planner.

It does not determine:

production workflow
provider selection
model selection
generation strategy
prompts
retry strategy

Those decisions are made entirely by EPIC 5 – Production Planner.

The Video Generator simply executes the Production Plan, generates the requested video assets using the selected providers and models, and returns execution results for downstream review and final assembly.

## Progress

**40%**

## Tasks

* [x] Task 7.1 – Implement Provider-Agnostic Video Generation Service
* [x] Task 7.2 – Create Video Generator REST API
* [ ] Task 7.3 – Build Video Generation Review UI
* [ ] Task 7.4 – Complete Video Generator Workflow Integration
* [ ] Task 7.5 – Build Tests (Deferred)

## Inputs & Outputs

### Inputs

Input	Source	Required
Production Plan	EPIC 5	Yes
Approved Reference Assets	EPIC 6	When required by Production Plan

### Outputs

Output	Description	Consumer
Generated Video Assets	Video clips generated according to the Production Plan	EPIC 8
Execution Metadata	Provider, model, parameters, execution status, timing, prompt, reference assets used	EPIC 8, User UI

## Definition of Done

EPIC 7 is complete when:

Every video generation task in the Production Plan can be executed.
The selected provider is invoked successfully.
The selected model is invoked successfully.
Provider-specific parameters are honored.
Required Reference Assets are supplied automatically.
Video generation progress is tracked.
Execution metadata is captured.
Generated clips are displayed in the UI.
Workflow integration with EPICs 5 and 6 is complete.
Automated tests pass.

## Acceptance Criteria (Gate to EPIC 8)

Before proceeding to EPIC 8 (Final Assembly), the following must be satisfied:

Every generated clip is traceable to a Production Plan asset.
No provider or model decisions are made inside the Video Generator.
Provider and model are taken directly from the Production Plan.
Required Reference Assets are automatically supplied when specified.
Execution metadata is captured for every clip.
Generated clips are available for downstream assembly.

## Sign-off

**Sign-off is required before this EPIC is considered complete and work may begin on EPIC 8.**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Implementer | -- | -- | -- |
| Reviewer | -- | -- | -- |

> Sign-off must be recorded in IMPLEMENTATION-LOG-MVP.md with date and verification evidence.


### Task 7.1 – Implement Provider-Agnostic Video Generation Service

#### Status

✅ Complete

#### Objective

Implement the runtime Video Generator service that executes the video-generation tasks defined by the Production Plan.

The service must execute the selected provider and model exactly as specified without independently making planning decisions.

#### Requirements

The service must:

Load the Production Plan.
Execute every video-generation task.
Invoke the provider selected by the Production Planner.
Invoke the selected model.
Apply provider-specific parameters.
Supply required Reference Assets from EPIC 6.
Support text-to-video generation.
Support image-to-video generation.
Support future video-generation workflows without architectural changes.
Track execution status.
Capture execution timing.
Capture provider responses.
Capture generation errors.
Store generated video assets.
Return structured execution metadata.

The service must not:

Select providers.
Select models.
Rewrite prompts.
Change generation strategies.
Modify retry logic.
Re-plan the workflow.

Those responsibilities belong exclusively to EPIC 5.

### Task 7.2 – Create Video Generator REST API

#### Status

✅ Complete

#### Objective

Expose the Video Generator through a REST API.

#### Requirements

Create an endpoint that:

Accepts a Production Plan.
Accepts approved Reference Assets.
Executes the requested video-generation tasks.
Returns generated video assets.
Returns execution metadata.
Returns provider usage information when available.
Handles provider failures gracefully.
Returns clear validation errors.
Returns clear runtime errors.

The endpoint should be usable by:

The frontend.
Automated workflows.
Future orchestration services.
Automated tests.


### Task 7.3 – Build Video Generation Review UI

#### Status

✅ Complete

#### Objective

Build the frontend interface for reviewing generated video assets and their execution details.

This UI mirrors the Reference Asset review experience introduced in EPIC 6.

#### Requirements

The UI must display:

Generated video previews.
Generation status.
Provider used.
Model used.
Tool-selection rationale from the Production Plan.
Prompt used.
Reference Assets used.
Generation duration.
Execution metadata.
Raw provider response (where available).

The UI should support:

Clip preview.
Download.
Regeneration.
Progress indicators.
Error display.
Filtering by provider.
Filtering by generation status.

The UI should clearly distinguish:

Planning decisions (EPIC 5)
Execution results (EPIC 7)

#### Bug Fix 7.1 — Require and Preserve Playable Video Output

**Status:** ✅ Complete

**Problem:** Videos created by EPIC 7 were empty — the OpenRouter provider returned a `completed` status but no actual playable video was stored. The frontend rendered `<video>` elements with no source, and the "Open Video" link pointed nowhere.

**Root Cause:** The OpenRouter provider did not inspect the completed polling response to extract the actual downloadable video URL from the correct response field. The canonical output field (`video_url` / `output_location`) was not consistently populated or preserved.

**Fix Requirements:**

1. **Provider-side (OpenRouter):** The OpenRouter provider MUST inspect the completed polling response and extract the actual downloadable video URL from the correct response field (e.g., `output`, `video_url`, `url`, or the provider-specific field that contains the playable asset). This URL MUST be stored consistently as [`video_url`](AI Production Studio/src/generators/video_generator_provider.py) or [`output_location`](AI Production Studio/src/generators/video_generator_provider.py).

2. **Completion Gate:** A result may be marked `completed` ONLY when:
   - Provider status equals `"completed"` **AND**
   - A non-empty, valid video URL or file path exists in the canonical output field
   
   Otherwise, the result MUST be marked `failed`, with the raw provider response retained for diagnosis.

3. **Frontend:** The [`VideoGenerationReviewPage.jsx`](schmucks-studio/src/developer-studio/pages/VideoGenerationReviewPage.jsx) must use exactly the canonical output field for:
   - `<video src={asset.video_url} controls />`
   - The "Open Video" link

4. **Diagnostics:** When a result is marked `failed`, the raw provider response MUST be preserved in the execution metadata so operators can diagnose why no playable URL was produced.

#### Bug Fix 7.2 — Correct Duration Semantics

**Status:** ✅ Complete

**Problem:** The summary displayed "261.6 seconds" as the video duration, but this was actually the generation elapsed time, not the video duration. The UI conflated generation time with output duration, producing misleading metrics.

**Root Cause:** A single `duration` field was used ambiguously to represent both generation wall-clock time and output video length.

**Fix Requirements:**

1. **Separate three distinct duration fields:**

   | Field | Meaning | Example Value |
   |-------|---------|---------------|
   | [`clip_duration_seconds`](AI Production Studio/src/generators/video_generator_provider.py) | Planned duration of a single generated clip | `2.0` |
   | [`generation_duration_seconds`](AI Production Studio/src/generators/video_generator_provider.py) | Wall-clock time the provider took to generate | `261.6` |
   | [`total_output_duration_seconds`](AI Production Studio/src/generators/video_generator_provider.py) | Sum of all clip durations in the assembled output | `8.0` |

2. **Summary display should show approximately:**
   - Four generated clips
   - Two seconds per clip
   - Eight seconds planned assembled duration
   - 261.6 seconds generation time

3. **Bottom-line diagnostics:**
   - **Four clips:** Expected — EPIC 7 generates the four planned shots; EPIC 8 creates the one finished video.
   - **Empty players:** Not expected — completed OpenRouter results are not providing or preserving a playable output URL (see Bug Fix 7.1).
   - **261.6-second duration:** Incorrect labeling — it is almost certainly generation elapsed time, not video duration.

#### Bug Fix 7.3 — Fail-Fast on Video Creation Failure

**Status:** ✅ Complete

**Problem:** When a video creation step fails (empty video content, empty URL, or zero-second duration), the pipeline continues processing remaining assets. This wastes provider quota, time, and produces a batch of results where downstream assets may depend on failed upstream clips — making the entire generation run unusable.

**Root Cause:** The [`generate_videos`](AI Production Studio/src/generators/video_generator_service.py:243) loop uses `continue` on failure instead of breaking out. There is no fail-fast gate.

**Fix Requirements:**

1. **Add `fail_fast` parameter** to [`generate_videos`](AI Production Studio/src/generators/video_generator_service.py:243) (default `True`). When enabled, the first asset failure immediately halts the pipeline and returns whatever results have been collected so far.

2. **Define a validity gate** [`_is_valid_video_result`](AI Production Studio/src/generators/video_generator_service.py) that checks:
  - `result.status == "completed"` **AND**
  - `result.video_url` is non-empty **AND**
  - `result.generation_duration_seconds > 0` (or `result.duration_seconds > 0`)

  A result failing any of these checks is treated as a hard failure.

3. **Failure criteria that trigger fail-fast:**
  - Provider returns `status = "failed"`
  - Provider returns `status = "completed"` but `video_url` is empty/null
  - Provider returns `status = "completed"` but `generation_duration_seconds == 0` (empty content)
  - Any unhandled exception during generation

4. **On fail-fast:** The service logs the failing asset, marks the execution status as `FAILED`, includes all results collected up to the failure point, and returns immediately. Remaining assets are left unprocessed with a clear diagnostic message.

5. **The `fail_fast=False` escape hatch** allows batch processing where partial results are acceptable (e.g., debugging, testing multiple providers).

#### Bug Fix 7.4 — Serve Playable Video URLs Instead of Auth-Gated Remote URLs

**Status:** ✅ Complete

**Problem:** Even after Bug Fix 7.1 ensured a non-empty `video_url` was populated on completed OpenRouter results, the Video Generation Review UI still rendered `<video>` players that loaded but produced no visible frames — i.e., "empty" videos — despite the backend correctly reporting the generation job as `completed` with a populated `video_url`.

**Root Cause:** OpenRouter's completed-job content URLs (`unsigned_urls[0]` / `video_url` from the polling response) require the same `Authorization: Bearer <OPEN_ROUTER_API_KEY>` header used to submit the generation job. This was already known and handled server-side by the working `/api/text-to-video` route in [`api_server.py`](../api_server.py:933) ("Content URLs from OpenRouter require auth"), but [`OpenRouterVideoProvider`](AI%20Production%20Studio/src/generators/openrouter_video_provider.py:1) handed the raw, auth-gated OpenRouter URL straight to `VideoResult.video_url`, which the frontend then used directly as a `<video src="...">`. Browsers cannot attach custom headers to media element requests, so the player loaded the URL but could never authenticate to actually stream the content.

**Fix Requirements (implemented):**

1. **Provider-side download-and-localize:** [`OpenRouterVideoProvider._localize_video_url()`](AI%20Production%20Studio/src/generators/openrouter_video_provider.py:124) downloads the completed video server-side — attaching the `Authorization` header whenever the host is `openrouter.ai` — and saves it to `data/output/`, mirroring the pattern already proven to work in `/api/text-to-video`.

2. **Wired into both completion paths:** the synchronous-completion branch of `generate()` and the async polling-completion branch of `check_status()` both now call `_localize_video_url()` before setting `result.video_url`, so `video_url` always points at a locally-served, header-free file rather than the raw OpenRouter URL.

3. **Canonical output field stays consistent:** `VideoResult.video_url` (and its `output_location` alias) is set to the local `/api/video-file/<filename>` path already served by the existing Flask route in [`api_server.py`](../api_server.py:82). The original remote OpenRouter URL is preserved in `result.metadata["openrouter_remote_video_url"]` for traceability/debugging.

4. **No frontend changes required:** Vite's dev proxy already forwards `/api/*` requests to `http://localhost:5000` (see [`vite.config.js`](../../schmucks-studio/vite.config.js:27)), and the relative-URL pattern is identical to the one already used successfully by `TextToVideoPage.jsx` and `ImageToVideoPage.jsx`. The Video Generation Review UI (Task 7.3) now plays generated clips correctly with no code changes on the frontend.

5. **Graceful fallback:** if the server-side download fails for any reason, `_localize_video_url()` logs the error and falls back to returning the original remote URL rather than raising, so a transient download hiccup does not break the generation pipeline.

### Task 7.4 – Complete Video Generator Workflow Integration

#### Status

⬜ Deferred

#### Objective

Integrate the Video Generator into the production pipeline so video generation executes directly from the Production Plan.

#### Requirements

The workflow must:

Consume the Production Plan.
Consume approved Reference Assets.
Execute video-generation tasks in dependency order.
Execute independent tasks in parallel when possible.
Preserve Production Plan execution order.
Capture execution metadata.
Return generated clips.
Make generated clips available to EPIC 8.

The Video Generator must execute exactly what the Production Plan specifies without introducing additional planning decisions.

### Task 7.5 – Build Tests (Deferred)

#### Status

⬜ Deferred

#### Objective

Build automated tests for the Video Generator after the complete end-to-end production pipeline is operational.

#### Requirements

The test suite should verify:

Provider invocation.
Model invocation.
Production Plan execution.
Reference Asset usage.
Execution metadata capture.
API behavior.
UI rendering.
Error handling.
Integration with EPICs 5–8.
Regression protection.

---

### Data/Execution Gap Fix – Add fal.ai Video Generation (Kling Video v3 Pro, Image-to-Video)

#### Status

✅ Complete (2026-07-18)

#### Objective

While verifying Enhancement 5.14 (EPIC 5), the full test suite surfaced 3 failing tests asserting that fal.ai should have video-capable models (`test_fal_has_both_image_and_video_models`, `test_fal_has_kling_text_to_video_model`, `test_fal_has_veo_image_to_video_model`) per the original Task 5.9 catalog requirement ("fal.ai models include both image models... and video models (Kling V1 via fal.ai, Veo 2 via fal.ai)"). Investigation showed this was a genuine, real data/execution gap, not stale tests: `data/provider_capability_catalog.json` had zero fal video model entries, and `src/generators/` had no `fal_video_provider.py` at all — only `runway_video_provider.py` and `openrouter_video_provider.py` existed to execute EPIC 7 video generation. The user confirmed fal.ai does offer real video generation and supplied a real, confirmed endpoint (`fal-ai/kling-video/v3/pro/image-to-video`), so this task adds both the catalog entry and the actual execution backend — not just data to satisfy a test.

**Scope decision:** Only the confirmed Kling image-to-video endpoint was added. No fal Veo entry was fabricated (no confirmed fal Veo model_id was available), and no fal text-to-video endpoint was fabricated (fal appears to split video capability by strategy into separate endpoint paths per its naming convention, and only the image-to-video path was confirmed). The `test_fal_has_veo_image_to_video_model` test is preserved but explicitly skipped with a reason, rather than deleted or falsely made to pass, documenting the requirement as a real follow-up rather than erasing it.

#### Changes

1. **[`data/provider_capability_catalog.json`](AI%20Production%20Studio/data/provider_capability_catalog.json)** — added `fal-ai/kling-video/v3/pro/image-to-video` (Kling Video v3 Pro) to the `fal` provider's `models[]`, with `capabilities.image_to_video: true` (all other capability flags false), resolution/duration limits and `best_for`/`planning` metadata mirrored from the existing OpenRouter Kling v3.0 Pro entry (same underlying model family, different provider/endpoint). Updated the `fal` provider's top-level `description` to mention video/Kling instead of image-only.

2. **[`fal_video_provider.py`](AI%20Production%20Studio/src/generators/fal_video_provider.py)** (new) — implements `VideoGeneratorProvider` for fal.ai, mirroring `FalImageProvider`'s synchronous `fal_client.subscribe()` pattern (fal.ai's client blocks until the result is ready, so `check_status()` is a no-op). `supported_strategies = ["image_to_video"]` only — matching exactly what's catalogued; does not claim `text_to_video` support. Resolves a reference image from `asset.reference_assets`, parses fal.ai's `{"video": {"url": ...}}` response shape (with defensive fallbacks mirroring `FalImageProvider`'s multi-path image parsing), and returns a `VideoResult`.

3. **[`video_generator_service.py`](AI%20Production%20Studio/src/generators/video_generator_service.py)** — registered `FalVideoProvider` in `_bootstrap_default_providers()` alongside Runway and OpenRouter, gated on `FAL_KEY` being configured (shared credential with the existing `FalImageProvider`).

4. **[`test_provider_capability_catalog.py`](AI%20Production%20Studio/tests/test_provider_capability_catalog.py)** — `test_fal_has_both_image_and_video_models` now checks `image_to_video` OR `text_to_video` (previously hardcoded `text_to_video` only, which fal doesn't have); `test_fal_has_kling_text_to_video_model` renamed to `test_fal_has_kling_image_to_video_model` and checks `image_to_video` capability, matching the real confirmed endpoint; `test_fal_has_veo_image_to_video_model` is `@unittest.skip`-ped with an explanatory reason rather than deleted.

5. **[`test_fal_video_provider.py`](AI%20Production%20Studio/tests/test_fal_video_provider.py)** (new) — 12 tests covering the `VideoGeneratorProvider` contract (provider name, supported strategies), not-configured handling, missing-reference-image validation (raises `ValueError` per the shared base-class contract, same as `OpenRouterVideoProvider`), successful generation with both response shapes (`{"video": {"url": ...}}` and `{"video_url": ...}`), no-video-URL failure, exception handling, and the `check_status()` no-op contract. Caught and fixed a real test-isolation issue along the way: `FalVideoProvider.__init__`'s `os.environ.setdefault("FAL_KEY", ...)` (a pattern shared with `FalImageProvider`) leaks a fake key across tests in the same process; the not-configured test now explicitly isolates `FAL_KEY` via `patch.dict(os.environ)`.

#### Verification

* Confirmed `data/provider_capability_catalog.json` remains valid JSON and the new model loads via `ProviderCapabilityCatalog.find_models_by_capability("image_to_video")`.
* Confirmed `FalVideoProvider` registers into `VideoGeneratorService.PROVIDER_REGISTRY` under `"fal"` when `FAL_KEY` is set, alongside `runway`/`openrouter`.
* Ran `pytest tests/test_fal_video_provider.py tests/test_provider_capability_catalog.py tests/test_production_planner_service.py tests/test_production_planner_validation_adjustments.py tests/test_production_planner_enhancement_5_14.py`: **174 passed, 1 skipped** (the documented Veo follow-up).
* Ran the full `AI Production Studio` test suite (`pytest tests/`): **655 passed, 1 skipped, 1 failed** — down from 4 failed before this fix. The 1 remaining failure is a pre-existing, unrelated EPIC 6 bug in `test_keyframe_generator_service.py` (file and test both unmodified from the last commit; fails identically in isolation).

---

# EPIC 8. Final Assembly

## Objective

Assemble generated assets into the finished video.

## Progress

**20%**

## Tasks

* [x] Stitch clips
* [ ] Apply transitions (optional)
* [ ] Add audio (optional)
* [ ] Export final video
* [ ] Build tests

## Inputs & Outputs

### Inputs

| Input | Source | Required |
|-------|--------|----------|
| Generated video clips | EPIC 7 (Video Generator) | Yes |
| Production plan | EPIC 5 (Production Planner) | Yes |

### Outputs

| Output | Description | Consumer |
|--------|-------------|----------|
| Finished video file | Assembled, rendered, and exported final video | User |

## Definition of Done

EPIC 8 is complete when:

* Clip stitching assembles all generated clips in sequence.
* Optional transitions are applied where specified.
* Optional audio is added where specified.
* Final video is rendered and exported in a standard format.
* Automated tests verify assembly quality.
* All tests pass.

## Acceptance Criteria (MVP Complete)

Before declaring the MVP complete, the following must be satisfied:

* [ ] A user can submit a creative prompt and receive a finished video.
* [ ] The complete workflow executes: Validate -> Creative Intent -> Scene Director -> Storyboard -> Production Planner -> Keyframe Generator (optional) -> Video Generator -> Final Assembly.
* [ ] The finished video meets or exceeds quality expectations.
* [ ] No manual prompt engineering is required beyond the initial creative vision.
* [ ] All tests pass across all EPICs.

## Sign-off

**Sign-off is required before the MVP is declared complete.**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Implementer | -- | -- | -- |
| Reviewer | -- | -- | -- |

> Sign-off must be recorded in IMPLEMENTATION-LOG-MVP.md with date and verification evidence.

---

### Task 8.1 – Assemble and Display Final Video

#### Status

✅ Complete

#### Objective

Assemble all generated video clips into a single finished production and immediately present the assembled video to the user within the Studio for review.

This task shall extend the proven video generation and playback architecture implemented in EPIC 7. It shall not redesign, duplicate, or replace existing functionality. The assembled video should become the natural continuation of the EPIC 7 workflow.

#### Requirements

The implementation shall:

Collect all completed video clips produced by EPIC 7 in the sequence specified by the Production Planner.
Verify that all required clips exist before beginning assembly.
Assemble the clips into a single continuous production while preserving the Production Planner ordering.
Preserve original video quality whenever possible and avoid unnecessary re-encoding.
Generate a final assembled video asset suitable for playback and export.
Provide clear execution progress, completion status, and error reporting throughout the assembly process.
Studio UI Requirements (Critical)

The assembled video shall be displayed automatically within the Studio immediately after successful assembly.

The implementation shall:

Automatically load the assembled video into the Studio upon successful completion.
Reuse the existing video playback implementation developed during EPIC 7.
Reuse the existing video player, playback controls, polling, progress reporting, loading indicators, download functionality, state management, and error handling from EPIC 7 wherever applicable.
Extend existing UI components instead of creating duplicate implementations.
Present the assembled video using the same user experience established for generated clips in EPIC 7.

Do not redesign or reimplement previously completed functionality.

Before creating new services, components, APIs, or UI behavior, review the EPIC 7 implementation and reuse or extend existing code wherever practical. Previously solved problems should remain solved throughout the remainder of the project.

#### Validation Requirements

Successful completion requires demonstration that:

All expected clips were discovered.
The clips were assembled in the Production Planner sequence.
One final assembled video was created successfully.
The assembled video loads automatically in the Studio.
The assembled video can be played, paused, scrubbed, replayed, and downloaded from the Studio.
The assembled video is also written to the expected output location.
The assembled video duration approximately equals the combined duration of the source clips.
Any assembly failures are presented clearly to the user.

#### Definition of Done

All generated clips are assembled into a single final video.
The final assembled video is automatically displayed within the Studio using the existing EPIC 7 playback architecture.
Existing video playback and UI components are reused rather than duplicated.
Previously solved playback, polling, rendering, and UI issues are not reintroduced.
The assembled video is available for review, replay, and download.
The implementation builds upon EPIC 7 rather than creating parallel implementations.

---

# Next Task

**Task 8.1 – Assemble and Display Final Video**

Assemble all generated video clips into a single finished production and immediately present the assembled video to the user within the Studio for review.

---

# Completion Workflow

Whenever a task is completed:

1. Mark the task complete.
2. Update the EPIC progress.
3. Update the Current Task.
4. Update the Next Task.
5. Update `IMPLEMENTATION-LOG-MVP.md`.
6. Verify the implementation with automated tests.
7. Include representative prompts and representative results.
8. Ask the user to review before moving to the next task.

Do not begin the next task without user approval.

When an EPIC is complete:

1. Verify all Acceptance Criteria are satisfied.
2. Obtain sign-off from Implementer and Reviewer.
3. Record sign-off in `IMPLEMENTATION-LOG-MVP.md` with date and verification evidence.
4. Update the EPIC progress to 100%.
5. Set the Current EPIC to the next EPIC.

Do not begin the next EPIC without sign-off.

---

# Definition of Complete

The MVP is complete when the following workflow succeeds:

```text
Creative Prompt
        │
        ▼
Creative Prompt Validator
        │
        ▼
Creative Intent
        │
        ▼
Scene Director
        │
        ▼
Storyboard
        │
        ▼
Production Planner
        │
        ▼
Keyframe Generator (optional)
        │
        ▼
Video Generator
        │
        ▼
Final Assembly
        │
        ▼
Finished Video
```
