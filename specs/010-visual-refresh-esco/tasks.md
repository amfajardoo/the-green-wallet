# Tasks: Modern Colombian Spanish Visual Experience

**Input**: Design documents from `/specs/010-visual-refresh-esco/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and `quickstart.md`

**Tests**: Include component and shell tests because the constitution requires automated tests
for user-visible behavior and the spec defines independent acceptance scenarios.

**Organization**: Tasks are grouped by user story and ordered to preserve traceability from the
specification to implementation and verification.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the feature boundary and document the existing entry points before
changing presentation code.

- [ ] T001 [P] Validate the visual-refresh entry points and existing validation commands in `package.json`, `src/app/app.routes.ts`, and `src/app/features/accounts/account-page.ts` without changing financial-state files.
- [ ] T002 [P] Set the document language to `es-CO` and update the product title metadata in `src/index.html`.

---

## Phase 2: Foundational (Shared Visual Contract)

**Purpose**: Establish shared visual primitives and shell behavior required by all user stories.

- [ ] T003 [P] Refine semantic palette, typography, focus color, and missing token definitions in `src/styles/theme.css` while preserving explicit asset/liability roles.
- [ ] T004 [P] Harden global focus-visible, reduced-motion, text scaling, and base-control behavior in `src/styles.css`.
- [ ] T005 [P] Refine the editorial-ledger background, spacing rhythm, shell width, and responsive breakpoint scaffolding in `src/styles/shell.css`.
- [ ] T006 Align application landmarks and shell host sizing with the shared visual contract in `src/app/app.css` and `src/app/app.html` without finalizing user-facing copy.

**Checkpoint**: Shared tokens, global accessibility behavior, and shell scaffolding are ready;
user-story work can proceed without changing financial state ownership.

---

## Phase 3: User Story 1 - Understand the Wallet at a Glance (Priority: P1) 🎯 MVP

**Goal**: Make account hierarchy, summaries, account type, currency, and asset/liability meaning
immediately understandable in the current workspace.

**Independent Test**: Render empty and populated account states with a COP asset and USD card;
verify that headings, summaries, balances, currency codes, and liability meaning are clear
without relying on color alone.

### Tests for User Story 1

- [ ] T007 [P] [US1] Add account-page assertions for empty state, summary grouping, explicit COP/USD context, and non-color asset/liability labels in `src/app/features/accounts/account-page.spec.ts`.

### Implementation for User Story 1

- [ ] T008 [US1] Restructure account workspace landmarks, heading hierarchy, summary grouping, and account-row semantics in `src/app/features/accounts/account-page.html` without changing store interactions.
- [ ] T009 [US1] Refine account form, summary strip, empty state, account list, balance treatment, and liability indicators in `src/app/features/accounts/account-page.css` for the editorial-ledger hierarchy.

**Checkpoint**: The account workspace is visually understandable in both empty and populated
states while money values and store behavior remain unchanged.

---

## Phase 4: User Story 2 - Use the Product in Colombian Spanish (Priority: P1)

**Goal**: Replace all current visible English in the account journey and shell with consistent,
natural Colombian Spanish while keeping financial terminology explicit.

**Independent Test**: Inspect shell, navigation, account form, validation errors, empty state,
status labels, account types, currencies, and footer and find no accidental English or ambiguous
financial wording.

### Tests for User Story 2

- [ ] T010 [P] [US2] Add visible-copy assertions for Spanish headings, form labels, errors, account types, empty states, navigation, and shell status in `src/app/app.spec.ts`, `src/app/features/accounts/account-page.spec.ts`, and `src/app/navigation/sidenav.component.spec.ts`.

### Implementation for User Story 2

- [ ] T011 [P] [US2] Translate account type labels, descriptions, validation messages, balance labels, and submission errors into Colombian Spanish in `src/app/features/accounts/account-page.ts`.
- [ ] T012 [P] [US2] Translate account page headings, form labels, hints, placeholders, buttons, empty state, summaries, statuses, and session guidance in `src/app/features/accounts/account-page.html`.
- [ ] T013 [P] [US2] Translate navigation labels, descriptions, menu controls, close controls, and navigation ARIA labels in `src/app/navigation/navigation.config.ts` and `src/app/navigation/sidenav.component.html`.
- [ ] T014 [P] [US2] Translate brand status, workspace metadata, and footer copy in `src/app/app.html`, keeping “local-first” meaning accurate for the current session-only behavior.
- [ ] T015 [US2] Review all visible strings touched by the account journey against the vocabulary and scope rules in `specs/010-visual-refresh-esco/spec.md` and update the copy assertions in `src/app/app.spec.ts`, `src/app/features/accounts/account-page.spec.ts`, and `src/app/navigation/sidenav.component.spec.ts`.

**Checkpoint**: The current product surface is consistently Colombian Spanish and does not
promise persistence, synchronization, credit limits, installments, or other deferred features.

---

## Phase 5: User Story 3 - Complete Tasks Comfortably Everywhere (Priority: P1)

**Goal**: Preserve task completion across mobile, tablet, desktop, keyboard, reduced-motion,
long-label, and enlarged-text conditions.

**Independent Test**: Complete account creation and review at 320, 767, 768, 1024, and 1280 CSS
pixels with keyboard-only navigation and reduced motion enabled.

### Tests for User Story 3

- [ ] T016 [P] [US3] Add DOM-level assertions for labelled controls, invalid-field relationships, visible navigation controls, focus restoration, and keyboard-close behavior in `src/app/features/accounts/account-page.spec.ts` and `src/app/navigation/sidenav.component.spec.ts`.

### Implementation for User Story 3

- [ ] T017 [US3] Tune account form and list responsive layout, long-name wrapping, monetary readability, touch targets, and focus states for the five required widths in `src/app/features/accounts/account-page.css`.
- [ ] T018 [US3] Tune mobile drawer, persistent navigation, backdrop, close control, active state, and focus-visible presentation for the five required widths in `src/app/navigation/sidenav.component.css`.
- [ ] T019 [US3] Tune shell header, content grid, footer, decorative layers, and reduced-motion-safe transitions for the five required widths in `src/styles/shell.css`.
- [ ] T020 [US3] Verify semantic labels, status text, and icon treatments communicate meaning without color-only cues in `src/app/features/accounts/account-page.html`, `src/app/navigation/sidenav.component.html`, and `src/app/app.html`.

**Checkpoint**: All three P1 stories are independently reviewable; the account journey remains
usable and understandable on narrow screens and with assistive interaction patterns.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete feature against the SDD artifacts and repository quality gates.

- [ ] T021 [P] Run the relevant Biome checks and format only changed source files under `src/` using `package.json` scripts.
- [ ] T022 [P] Run account, app-shell, and navigation tests and reconcile failures with the acceptance scenarios in `src/app/app.spec.ts`, `src/app/features/accounts/account-page.spec.ts`, and `src/app/navigation/sidenav.component.spec.ts`.
- [ ] T023 Run the production/SSR build and inspect the rendered route behavior using `package.json` and `specs/010-visual-refresh-esco/quickstart.md`.
- [ ] T024 Run the complete manual acceptance matrix at 320, 767, 768, 1024, and 1280 CSS pixels and record any required spec reconciliation in `specs/010-visual-refresh-esco/quickstart.md`.
- [ ] T025 Run `git diff --check`, review the diff against `specs/010-visual-refresh-esco/spec.md`, and confirm no files under `src/app/core/accounts/` changed before committing.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; confirms the feature boundary and document locale.
- **Foundational (Phase 2)**: Depends on Setup; blocks user-story implementation.
- **User Story 1 (Phase 3)**: Depends on the shared visual contract and is the MVP increment.
- **User Story 2 (Phase 4)**: Depends on the shared visual contract; execute after US1 because both refine account-page presentation files.
- **User Story 3 (Phase 5)**: Depends on US1 and US2 so responsive and accessibility review uses final structure and Spanish copy.
- **Polish (Phase 6)**: Depends on all selected user stories.

### User Story Dependencies

```text
Phase 1 Setup
    ↓
Phase 2 Shared visual contract
    ↓
US1 Visual hierarchy and financial meaning
    ↓
US2 Colombian Spanish copy
    ↓
US3 Responsive and accessible completion
    ↓
Polish and verification
```

### Parallel Opportunities

- T003 and T004 can run in parallel because they modify separate global style files.
- T007 can be prepared while T005 and T006 are completed, provided tests target current public behavior.
- T011, T013, and T014 can run in parallel after the copy vocabulary is agreed because they touch separate source areas.
- T021 and T022 can run in parallel after implementation; T023 and T024 follow the resulting fixes.

## Implementation Strategy

### MVP First

1. Complete Setup and the shared visual contract.
2. Complete US1 and validate empty/populated account states.
3. Stop for a visual and accessibility review before adding the remaining copy and responsive polish.

### Incremental Delivery

1. Deliver US1 as a clearer account workspace without financial-domain changes.
2. Deliver US2 as a Spanish Colombia copy pass across the existing flow.
3. Deliver US3 as the responsive and accessibility hardening pass.
4. Run the full quality gates and reconcile the implementation against this plan and spec.

## Traceability Notes

- FR-001, FR-009 → T011–T015.
- FR-002, FR-003, FR-008 → T007–T009 and T020.
- FR-004, FR-005, FR-006, FR-007 → T003–T006 and T016–T019.
- FR-010 → T001, T005, T025; no persistence or financial-state files are in scope.
