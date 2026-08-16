# Tasks: Project Visual Theme and Design Tokens

**Input**: Design documents from `specs/001-ui-theming/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and `quickstart.md`

**Tests**: No feature-specific contrast, axe, keyboard, or browser test tasks are included. Those validations are deferred to `003-playwright`. Existing build, unit-test, and Biome commands remain required validation.

**Organization**: Tasks are grouped by user story so each requirement slice can be implemented and reviewed independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the theme source without changing dependencies or application behavior.

- [ ] T001 Create the theme stylesheet entry structure in `src/styles/theme.css` according to the project plan, including sections for primitives, semantic roles, typography, and interaction tokens.
- [ ] T002 [P] Document the existing Tailwind/PostCSS integration points in `package.json`, `.postcssrc.json`, and `src/styles.css` before changing them, confirming that no new runtime dependency is required.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the shared token vocabulary that all themed surfaces consume.

**⚠️ CRITICAL**: Complete this phase before user-story-specific styling.

- [ ] T003 Define the primitive neutral, brand, positive, negative, warning, information, liability, and focus values in `src/styles/theme.css` using the selected design-model values.
- [ ] T004 Define the semantic surface, content, border, brand, focus, financial-state, and supporting-surface tokens in `src/styles/theme.css`, keeping component usage independent from raw hue names.
- [ ] T005 Define typography roles, spacing, sizing, radius, elevation, and base interaction conventions in `src/styles/theme.css` without adding component-specific selectors.
- [ ] T006 Import `src/styles/theme.css` from `src/styles.css` while preserving the existing Tailwind CSS import and Angular global-style entry point.

**Checkpoint**: The application can build with the theme source loaded and no application component needs to define the shared token vocabulary itself.

---

## Phase 3: User Story 1 - Recognize a Consistent Interface (Priority: P1) 🎯 MVP

**Goal**: Replace the Angular starter visual language with the shared semantic theme at the application shell.

**Independent Test**: The application shell uses the same semantic surface, content, border, brand, spacing, and typography roles throughout its visible areas without starter-specific colors or gradients.

### Implementation for User Story 1

- [ ] T007 [US1] Replace Angular starter color variables, gradients, and font declarations in `src/app/app.html` with the shared semantic theme roles from `src/styles/theme.css`.
- [ ] T008 [US1] Apply the shared surface, content, typography, spacing, and component-pattern utilities to the application shell in `src/app/app.html` while preserving the existing router outlet and current app title behavior.
- [ ] T009 [US1] Remove obsolete starter-only style declarations from `src/app/app.html` and keep `src/app/app.css` free of duplicated global theme tokens.

**Checkpoint**: User Story 1 is complete when the application shell is visibly consistent and no longer depends on Angular starter palette values.

---

## Phase 4: User Story 2 - Understand Financial Meaning (Priority: P1)

**Goal**: Make financial meaning available through explicit semantic roles without requiring color-only interpretation.

**Independent Test**: The theme source exposes distinct positive, negative, warning, neutral, and liability roles that can be applied to future financial values without introducing new raw colors.

### Implementation for User Story 2

- [ ] T010 [US2] Add the positive, negative, warning, information, and credit-liability semantic role mappings and their supporting surfaces to `src/styles/theme.css` according to `data-model.md`.
- [ ] T011 [US2] Add concise usage comments for financial-state roles in `src/styles/theme.css`, documenting that components must pair state color with text, structure, or icon meaning.

**Checkpoint**: User Story 2 is complete when future account and transaction surfaces can express financial meaning through named roles rather than raw color choices.

---

## Phase 5: User Story 3 - Use the Interface Across Devices and Input Methods (Priority: P1)

**Goal**: Apply mobile-first layout and interaction conventions without adding browser-only runtime behavior.

**Independent Test**: The application shell remains usable at the planned narrow and wide viewport widths using the defined responsive and reduced-motion conventions.

### Implementation for User Story 3

- [ ] T012 [US3] Apply mobile-first responsive utility composition and safe wrapping rules to the shell layout in `src/app/app.html` for 320, 768, and 1280 CSS pixel widths.
- [ ] T013 [US3] Add static focus-visible, disabled, loading, invalid, and reduced-motion-safe conventions to `src/styles/theme.css` without introducing a runtime theme service or browser global.

**Checkpoint**: User Story 3 is complete when the shell uses the responsive and interaction conventions and remains compatible with Angular SSR and hydration.

---

## Phase 6: User Story 4 - Extend the Interface Safely (Priority: P2)

**Goal**: Make the theme vocabulary understandable and reusable for future feature work.

**Independent Test**: A maintainer can identify the appropriate token role for a representative card, form field, alert, and empty state without inventing a common-purpose visual value.

### Implementation for User Story 4

- [ ] T014 [US4] Organize and document the token sections in `src/styles/theme.css` so future contributors can distinguish primitives, semantic roles, typography roles, and interaction conventions.
- [ ] T015 [US4] Reconcile the implemented theme vocabulary with `specs/001-ui-theming/data-model.md` and `specs/001-ui-theming/quickstart.md`, updating only documentation that describes the delivered token contract.

**Checkpoint**: User Story 4 is complete when the theme is a reusable project convention rather than a collection of unexplained values.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the theme integration within the current scope and record deferred browser validation.

- [ ] T016 [P] Run `pnpm exec ng build` against `src/styles.css`, `src/styles/theme.css`, and the updated application shell to confirm Angular SSR compilation.
- [ ] T017 [P] Run `pnpm exec ng test --no-watch` against the existing Angular test suite, including `src/app/app.spec.ts`.
- [ ] T018 [P] Run `pnpm check` against the application source under `src/` and resolve any diagnostics caused by the implementation.
- [ ] T019 Run the non-browser steps in `specs/001-ui-theming/quickstart.md` and record that contrast, axe, keyboard, and browser validation are deferred to `003-playwright`.
- [ ] T020 Confirm that `src/styles/theme.css`, `src/styles.css`, and `src/app/app.html` contain no persistence, network-font, browser-global, or financial-domain logic.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; establishes the theme source structure.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user-story implementation.
- **User Stories (Phases 3–6)**: Depend on the foundational token vocabulary. US1, US2, and US3 share the theme source and should be executed sequentially to avoid conflicts; US4 follows the completed vocabulary.
- **Polish (Phase 7)**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T003–T006; delivers the MVP shell integration.
- **User Story 2 (P1)**: Depends on T003–T006; can be developed after the semantic token layer exists.
- **User Story 3 (P1)**: Depends on T003–T006 and the shell integration from US1.
- **User Story 4 (P2)**: Depends on US1–US3 so the documented vocabulary reflects the complete foundation.

### Parallel Opportunities

- T002 can run in parallel with T001 because it only records existing integration points.
- T016, T017, and T018 can run in parallel after implementation tasks complete.
- T010 and T012 could be prepared in parallel conceptually, but should be applied sequentially because both affect shared theme consumption and review clarity.

---

## Parallel Example: Final Validation

```text
Task: Run pnpm exec ng build against src/styles.css and src/styles/theme.css
Task: Run pnpm exec ng test --no-watch against src/app/app.spec.ts
Task: Run pnpm check against src/
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational token vocabulary.
3. Complete Phase 3: User Story 1 application-shell integration.
4. Run the existing build, unit-test, and Biome validations.
5. Stop and review the resulting theme before adding financial-state and responsive refinements.

### Incremental Delivery

1. Deliver the shared token layer and themed application shell.
2. Add financial semantic roles for future account and transaction surfaces.
3. Add responsive and static interaction conventions.
4. Document the reusable vocabulary and complete current-scope validation.
5. Add automated contrast, axe, keyboard, and browser checks through `003-playwright` later.

## Notes

- `[P]` tasks can run in parallel when they touch different files or are read-only validations.
- `[US#]` labels map implementation tasks to the user stories in `spec.md`.
- No feature-specific browser or accessibility test files are created by this feature.
- The `003-playwright` feature owns the deferred browser validation infrastructure.
