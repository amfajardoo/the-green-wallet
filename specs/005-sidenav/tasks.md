# Tasks: Responsive Side Navigation

**Input**: Design documents from `specs/005-sidenav/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and `quickstart.md`

**Tests**: Required. The feature plan calls for Vitest unit coverage, feature-owned
browser viewport and keyboard journeys, automated accessibility scans, Angular SSR build
validation, and scoped Biome validation.

**Organization**: Tasks are grouped by user story so the persistent layout, mobile drawer,
and accessibility behavior can be implemented and validated in dependency order.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the approved UI/testing dependencies and browser-test location without
creating application routes or financial behavior.

- [ ] T001 Add Angular Material/CDK dependencies aligned with the Angular 22 toolchain;
  keep the browser runner and accessibility-scanning dependency selection separate from
  this feature's implementation setup; do not modify `src/app/app.routes.ts`.
- [ ] T002 [P] Create the `browser/sidenav.spec.ts` feature-owned browser test scaffold
  with isolated test setup, viewport helper coverage locations, and accessibility scan
  integration points.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared destination catalog, Material sidenav boundary, shell
composition, and unit-test harness that all responsive presentations reuse.

**⚠️ CRITICAL**: Complete this phase before implementing user-story-specific behavior.

- [ ] T003 [P] Define the `NavigationDestination` and mobile menu state types in
  `src/app/navigation/navigation.types.ts` with stable identifiers, labels, targets,
  ordering, Material presentation modes, and transient state rules from `data-model.md`.
- [ ] T004 [P] Define an empty-by-default ordered destination catalog in
  `src/app/navigation/navigation.config.ts`; keep `src/app/app.routes.ts` unchanged and
  do not add a shell route or speculative account, transaction, transfer, or payment
  links.
- [ ] T005 Create the standalone `Sidenav` component and unit-test harness in
  `src/app/navigation/sidenav.component.ts`,
  `src/app/navigation/sidenav.component.html`,
  `src/app/navigation/sidenav.component.css`, and
  `src/app/navigation/sidenav.component.spec.ts`, importing Angular Material sidenav
  primitives, CDK `BreakpointObserver`, router primitives, and signal-based state.
- [ ] T006 Integrate the `Sidenav` component into `src/app/app.ts` and
  `src/app/app.html`, preserving the existing router outlet, SSR entry points, and
  application shell content while creating a dedicated content region beside the
  Material sidenav container.
- [ ] T007 Add the shared shell layout contract in `src/app/app.css` and
  `src/app/navigation/sidenav.component.css` so Material `side` mode can share space
  with content and Material `over` mode can overlay it without horizontal overflow.

**Checkpoint**: The application shell renders an empty-but-valid Material navigation
boundary and unit-test harness without adding routes, dead links, or financial state.

---

## Phase 3: User Story 1 - Navigate from Tablet and Desktop (Priority: P1) 🎯 MVP

**Goal**: Keep the Material sidenav persistently visible beside usable page content from
768 CSS pixels upward, with no speculative links while the catalog is empty.

**Independent Test**: Run the browser journey at 768, 1023, 1024, and 1280 CSS pixels and
confirm that the `side` sidenav is visible, the mobile trigger is not required, content is
not obstructed, and an empty catalog exposes no dead or false-active destination.

### Tests for User Story 1

- [ ] T008 [P] [US1] Add browser assertions in `browser/sidenav.spec.ts` for persistent
  Material sidenav visibility, `side` presentation, mobile-trigger absence, content
  usability, empty-catalog behavior, no horizontal scroll, and AXE scans at 768px,
  1023px, 1024px, and 1280px.
- [ ] T009 [P] [US1] Add unit coverage in
  `src/app/navigation/sidenav.component.spec.ts` for rendering an empty destination
  catalog with no actionable links or active destination, plus a test-local destination
  fixture that verifies active-state derivation without adding routes to
  `src/app/app.routes.ts`.

### Implementation for User Story 1

- [ ] T010 [US1] Implement the semantic Material navigation landmark, conditional
  destination links, empty-catalog structure, stable labels, and active-state markup in
  `src/app/navigation/sidenav.component.html` using the catalog from
  `src/app/navigation/navigation.config.ts`.
- [ ] T011 [US1] Implement route-aware active destination derivation and available
  destination rendering in `src/app/navigation/sidenav.component.ts` without storing
  active state separately from the current application location.
- [ ] T012 [US1] Configure the Material sidenav `side` mode for tablet and desktop in
  `src/app/navigation/sidenav.component.ts` and implement the `768–1023px` and `1024px+`
  shell/content layout in `src/app/app.css` and
  `src/app/navigation/sidenav.component.css`.

**Checkpoint**: At 768px and wider, the Material sidenav is persistent, content remains
usable, AXE scans pass, and an empty catalog produces no dead links or active state.

---

## Phase 4: User Story 2 - Open Navigation on Mobile (Priority: P1)

**Goal**: Keep the navigation closed and out of the mobile keyboard flow by default, then
open the same catalog through a left-side Material drawer with a backdrop.

**Independent Test**: Run the browser journey at 320px and 767px, open the left-side
drawer once, verify its `over` presentation and backdrop, then dismiss it through Escape,
backdrop, explicit close, and destination selection when a destination exists.

### Tests for User Story 2

- [ ] T013 [P] [US2] Add unit tests in
  `src/app/navigation/sidenav.component.spec.ts` for the initial closed state, Material
  drawer open state, explicit close, Escape/backdrop close events, empty-catalog open
  behavior, destination selection, and transient state reset at the mobile boundary.
- [ ] T014 [P] [US2] Extend `browser/sidenav.spec.ts` with 320px and 767px scenarios that
  assert the closed mobile drawer is hidden from visual and keyboard flow, the trigger
  opens a left-side `over` drawer with backdrop, the empty catalog has no dead links,
  and AXE scans pass.

### Implementation for User Story 2

- [ ] T015 [US2] Implement the mobile open/closed signal and `BreakpointObserver` mode
  reconciliation in `src/app/navigation/sidenav.component.ts`, mapping `320–767px` to
  Material `over` mode and closing the drawer when the viewport enters tablet or desktop
  mode.
- [ ] T016 [US2] Implement the mobile trigger, `mat-sidenav` drawer container,
  `position="start"`, `hasBackdrop`, expanded state attributes, explicit close action,
  and conditional navigation presentation in
  `src/app/navigation/sidenav.component.html`.
- [ ] T017 [US2] Implement the mobile drawer styles in
  `src/app/navigation/sidenav.component.css` for `320–767px`, including the closed
  default, left-side open presentation, backdrop-compatible spacing, narrow-width
  wrapping, and no navigation-induced horizontal scroll.

**Checkpoint**: At 320px and 767px, the Material drawer is closed by default, opens from
the left through one accessible action, exposes the empty-or-approved catalog, and closes
through every required dismissal path.

---

## Phase 5: User Story 3 - Operate the Navigation Accessibly (Priority: P1)

**Goal**: Make the persistent and mobile Material presentations operable with keyboard
and assistive technology, including focus movement, focus restoration, active semantics,
reduced-motion behavior, and AXE compliance.

**Independent Test**: Complete the mobile open, traversal, selection, Escape, backdrop,
and close journeys with keyboard-only input, then verify persistent navigation semantics
and AXE results at tablet and desktop widths.

### Tests for User Story 3

- [ ] T018 [P] [US3] Add keyboard and automated accessibility assertions in
  `browser/sidenav.spec.ts` using the selected browser-test accessibility integration for
  the named navigation landmark, trigger state, visible focus,
  focus movement into the Material drawer, Escape/backdrop focus restoration, active
  destination semantics, keyboard traversal, and zero serious or critical violations at
  all six required viewport widths.
- [ ] T019 [P] [US3] Add unit coverage in
  `src/app/navigation/sidenav.component.spec.ts` for focus restoration, Material drawer
  close events, close behavior after navigation, and state reconciliation when the
  viewport crosses into persistent navigation.

### Implementation for User Story 3

- [ ] T020 [US3] Implement focus references, focus movement after opening, Escape and
  backdrop close handling, focus restoration after closing, and responsive state
  reconciliation in `src/app/navigation/sidenav.component.ts` while preserving
  Material's built-in drawer behavior.
- [ ] T021 [US3] Add the required accessible names, `aria-expanded`, `aria-controls`,
  active-destination semantics, and keyboard-operable controls in
  `src/app/navigation/sidenav.component.html` without using application-menu semantics
  for ordinary site navigation.
- [ ] T022 [US3] Add visible focus, non-color active treatment, reduced-motion-safe
  transitions, and focus-order styles in `src/app/navigation/sidenav.component.css`.
- [ ] T023 [US3] Add a responsive resize journey in `browser/sidenav.spec.ts` that opens the
  mobile drawer, crosses from 767px to 768px, confirms the Material `side` sidenav is
  shown without the mobile drawer obstructing content, and runs the AXE scan after the
  transition.

**Checkpoint**: The sidenav meets the keyboard, focus, semantic, reduced-motion, and
AXE requirements at all supported presentations.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature, reconcile documentation, and keep all checks
within the repository's existing scope.

- [ ] T024 [P] Run `pnpm exec ng build` for the SSR application and confirm
  `src/app/app.ts`, `src/app/app.html`, and `src/app/navigation/` compile without errors.
- [ ] T025 [P] Run `pnpm exec ng test --no-watch` and confirm the existing app tests plus
  `src/app/navigation/sidenav.component.spec.ts` pass.
- [ ] T026 [P] Run `pnpm check` and resolve all Biome diagnostics only under `src/` for
  `src/app/app.ts`, `src/app/app.html`, `src/app/app.css`, and `src/app/navigation/`.
- [ ] T027 [P] Run the configured browser-validation command and confirm
  `browser/sidenav.spec.ts` passes all viewport, keyboard, and accessibility journeys
  without tracking generated artifacts.
- [ ] T028 Reconcile `specs/005-sidenav/spec.md`, `specs/005-sidenav/plan.md`,
  `specs/005-sidenav/research.md`, `specs/005-sidenav/data-model.md`, and
  `specs/005-sidenav/quickstart.md` with the delivered Material drawer behavior, then
  run `git diff --check` and `git status --short`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 and T002 add dependencies and browser-test scaffolding;
  T001 must complete before Material or AXE imports compile.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories because the
  stories share the catalog, Material component boundary, shell composition, and unit
  harness.
- **User Story 1 (Phase 3)**: Depends on the Foundational phase and establishes the
  persistent Material `side` presentation.
- **User Story 2 (Phase 4)**: Depends on User Story 1's shared component and adds the
  mobile Material `over` drawer and transient state.
- **User Story 3 (Phase 5)**: Depends on User Stories 1 and 2 because it hardens the
  semantics, focus behavior, resize reconciliation, and AXE coverage of both modes.
- **Polish (Phase 6)**: Depends on all three user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T003–T007; no route or financial-state dependency.
- **User Story 2 (P1)**: Depends on T003–T012 because it reuses the catalog, shell, and
  persistent Material sidenav component.
- **User Story 3 (P1)**: Depends on T013–T017 because focus, semantics, and AXE behavior
  apply to the completed mobile interaction and persistent navigation.

### Parallel Opportunities

- T002 can run independently after T001 is planned because it touches only
  `browser/sidenav.spec.ts`.
- T003 and T004 can run in parallel because they define separate shared navigation files.
- T008 and T009 can run in parallel after the foundational component boundary exists.
- T013 and T014 can run in parallel because they add unit and browser coverage in separate
  files.
- T018 and T019 can run in parallel because they add AXE/browser and unit coverage in
  separate files.
- T024–T027 can run in parallel after all implementation tasks are complete.

---

## Parallel Example: User Story 1

```text
Task: Add persistent Material viewport and accessibility assertions to browser/sidenav.spec.ts
Task: Add empty-catalog and test-local active-state coverage to src/app/navigation/sidenav.component.spec.ts
```

## Parallel Example: User Story 2

```text
Task: Add mobile Material drawer state tests to src/app/navigation/sidenav.component.spec.ts
Task: Add 320px and 767px Material drawer scenarios to browser/sidenav.spec.ts
```

## Parallel Example: Final Validation

```text
Task: Run pnpm exec ng build for src/app/app.ts and src/app/navigation/
Task: Run pnpm exec ng test --no-watch for src/app/navigation/sidenav.component.spec.ts
Task: Run pnpm check for src/
Task: Run the configured browser-validation command for browser/sidenav.spec.ts
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2 to establish Material/CDK dependencies, the empty
   catalog, component boundary, shell, and test harness.
2. Complete User Story 1 to deliver persistent tablet/desktop `side` navigation without
   adding routes.
3. Complete User Story 2 immediately after because mobile drawer behavior is a co-equal
   P1 requirement of the feature.
4. Stop and validate both Material presentations at all six boundary widths before the
   AXE and focus hardening from User Story 3.

### Incremental Delivery

1. Add approved dependencies and deliver the empty catalog plus Material shell boundary.
2. Deliver persistent tablet/desktop navigation and its independent browser/unit/AXE
   checks.
3. Deliver the left-side mobile `over` drawer and its independent browser/unit checks.
4. Deliver focus, semantic, keyboard, reduced-motion, resize, and AXE hardening.
5. Run all cross-cutting checks and reconcile the design artifacts.

## Notes

- `[P]` tasks can run in parallel only when they touch separate files or are read-only
  validations with no incomplete dependency.
- `[US#]` labels map each implementation or test task to a user story in `spec.md`.
- The initial catalog MUST remain empty while `src/app/app.routes.ts` has no approved
  destinations; no task in this feature may create a route.
- No task adds persistence, remote services, authentication, financial logic, or a new
  visual token system.
