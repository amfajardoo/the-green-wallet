# Tasks: Playwright End-to-End Testing Foundation

**Input**: Design documents from `specs/003-playwright/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and `quickstart.md`

**Tests**: Browser tests are explicitly required by the feature. Existing Angular unit,
build, and Biome validations remain required cross-cutting gates.

**Organization**: Tasks are grouped by user story so the runner foundation and each
maintenance concern can be implemented and reviewed independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the package-level Playwright foundation and repository output boundaries.

- [X] T001 Verify the installed `@playwright/test@1.62.1` and `playwright-ng-schematics@22.0.3` entries in `package.json` and `pnpm-lock.yaml`.
- [X] T002 [P] Add `e2e`, `e2e:headed`, `e2e:report`, and `e2e:install` scripts to `package.json`.
- [X] T003 [P] Add `playwright-report/`, `test-results/`, and `blob-report/` generated-output rules to `.gitignore`.
- [X] T004 [P] Install the supported Chromium browser with `pnpm exec playwright install chromium` using the setup documented in `package.json`, and confirm binaries are stored outside the repository source tree.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Configure the shared runner guarantees that all future browser journeys will reuse.

**⚠️ CRITICAL**: Complete this phase before adding feature-specific browser journeys.

- [X] T005 Create `playwright.config.ts` with `e2e/` as the test directory, a single Chromium project, and the repository's TypeScript module conventions.
- [X] T006 Configure the Angular `webServer` command, readiness URL, startup timeout, and local server reuse behavior in `playwright.config.ts`.
- [X] T007 Configure `PLAYWRIGHT_BASE_URL` handling in `playwright.config.ts` so an explicit existing endpoint bypasses automatic server startup.
- [X] T008 Configure fresh built-in browser contexts, no persistent `storageState`, deterministic worker/retry settings, semantic locator defaults, and ignored output paths in `playwright.config.ts`.

**Checkpoint**: The shared runner can start or connect to the local application and provides isolated Chromium contexts before any feature journey is added.

---

## Phase 3: User Story 1 - Run Browser Validation Locally (Priority: P1) 🎯 MVP

**Goal**: Give maintainers one documented command that starts or reuses the application and runs a smoke journey.

**Independent Test**: From a fresh dependency installation, run `pnpm e2e` and observe one Chromium smoke journey complete without manually starting the server.

### Implementation for User Story 1

- [X] T009 [US1] Add the initial application-availability smoke journey in `e2e/smoke.spec.ts` using the current document title, visible main landmark, and visible application heading as readiness signals.
- [X] T010 [US1] Document dependency setup, Chromium installation, `pnpm e2e`, headed execution, and automatic server startup in `README.md`.
- [X] T011 [US1] Document the already-running-server workflow with `PLAYWRIGHT_BASE_URL` in `README.md` and `specs/003-playwright/quickstart.md`.

**Checkpoint**: User Story 1 is complete when a maintainer can run the documented smoke command from a clean checkout and receive a deterministic pass or actionable startup failure.

---

## Phase 4: User Story 2 - Diagnose Failed Browser Tests (Priority: P1)

**Goal**: Preserve enough failure context to identify failed scenarios and diagnose navigation, rendering, interaction, or assertion failures.

**Independent Test**: Introduce a temporary controlled assertion failure in the smoke journey, run the suite, and inspect the named failure, screenshot, trace, and HTML report; remove the temporary mutation afterward.

### Implementation for User Story 2

- [X] T012 [US2] Configure list and HTML reporters, failure-only screenshots, retained failure traces, and non-opening report behavior in `playwright.config.ts`.
- [X] T013 [US2] Document failure artifact locations, report opening, and trace inspection commands in `README.md` and `specs/003-playwright/quickstart.md`.
- [X] T014 [US2] Add failure-evidence and generated-artifact expectations to `specs/003-playwright/data-model.md` and reconcile them with `specs/003-playwright/spec.md` if implementation details change the documented contract.

**Checkpoint**: User Story 2 is complete when a controlled failure identifies its scenario and assertion and leaves inspectable local evidence without adding tracked artifacts.

---

## Phase 5: User Story 3 - Keep Browser Tests Deterministic (Priority: P1)

**Goal**: Make repeated and reordered browser runs independent of personal browser data and prior test state.

**Independent Test**: Run the smoke suite with default workers and with `--workers=1` twice from the same checkout; the initial application state and result remain equivalent.

### Implementation for User Story 3

- [X] T015 [US3] Keep the smoke journey free of persistent storage, saved authentication state, shared mutable fixtures, and external service setup in `e2e/smoke.spec.ts`.
- [X] T016 [US3] Document clean-context, repeated-run, and worker-variation validation commands in `specs/003-playwright/quickstart.md`.
- [X] T017 [US3] Add deterministic-run and no-personal-profile rules to the browser test authoring guidance in `README.md`.

**Checkpoint**: User Story 3 is complete when the smoke journey passes repeatedly without relying on execution order, persistent browser data, or a developer profile.

---

## Phase 6: User Story 4 - Add Future User Journeys Safely (Priority: P2)

**Goal**: Establish contribution guidance so account setup, transfers, and card-payment journeys can reuse the foundation without changing shared guarantees.

**Independent Test**: Add a temporary representative feature journey under `e2e/`, run it with the existing configuration, and confirm it owns its setup and reports its own scenario without changing `playwright.config.ts`.

### Implementation for User Story 4

- [X] T018 [US4] Document the feature-owned e2e file convention, semantic locator preference, self-contained setup, and scenario naming rules in `README.md`.
- [X] T019 [US4] Reconcile the reusable runner guarantees and future-journey guidance in `specs/003-playwright/plan.md`, `specs/003-playwright/data-model.md`, and `specs/003-playwright/quickstart.md`.

**Checkpoint**: User Story 4 is complete when a future feature can add an isolated browser scenario under `e2e/` without modifying the shared runner guarantees.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete foundation and keep repository artifacts clean.

- [X] T020 [P] Run `pnpm e2e` from a clean local state and record the smoke result against `specs/003-playwright/quickstart.md`.
- [X] T021 [P] Run `pnpm exec ng build` for `angular.json` and `src/` and confirm the Angular SSR build remains unchanged by the browser foundation.
- [X] T022 [P] Run `pnpm exec ng test --no-watch` for `src/**/*.spec.ts` and confirm the existing unit suite remains green.
- [ ] T023 [P] Run `pnpm exec biome check .` for `package.json`, `playwright.config.ts`, `e2e/`, and changed documentation files, resolving any diagnostics.
- [X] T024 Run `git diff --check` and `git status --short` for `.gitignore`, `playwright-report/`, and `test-results/` after browser execution, confirming generated reports, traces, screenshots, videos, profiles, and binaries are not tracked.
- [X] T025 Reconcile delivered paths and commands with `specs/003-playwright/spec.md`, `specs/003-playwright/plan.md`, and `specs/003-playwright/quickstart.md` without changing the out-of-scope boundaries.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; adds the package dependency, scripts, browser install command, and ignore boundaries.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories because every journey uses the shared runner.
- **User Story 1 (Phase 3)**: Depends on the Foundational phase and is the MVP.
- **User Story 2 (Phase 4)**: Depends on the shared runner; can follow User Story 1 because its evidence is exercised through the smoke journey.
- **User Story 3 (Phase 5)**: Depends on the shared runner and smoke journey; validates isolation and repeatability.
- **User Story 4 (Phase 6)**: Depends on the shared runner and the documented conventions from User Stories 1–3.
- **Polish (Phase 7)**: Depends on all desired user stories and reconciles the complete feature.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T005–T008; delivers the MVP smoke command.
- **User Story 2 (P1)**: Depends on T005–T008 and T009 so failure evidence is exercised by a real journey.
- **User Story 3 (P1)**: Depends on T009 and T015; no business state dependency.
- **User Story 4 (P2)**: Depends on the shared runner and the conventions documented by the earlier stories.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001 because they touch separate setup concerns.
- T010 and T011 can be prepared in parallel after T009 because both are documentation-only changes to different sections/files.
- T020, T021, T022, and T023 can run in parallel after implementation is complete.

## Parallel Example: Final Validation

```text
Task: Run pnpm e2e
Task: Run pnpm exec ng build
Task: Run pnpm exec ng test --no-watch
Task: Run pnpm exec biome check .
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational runner configuration.
3. Complete Phase 3: User Story 1 smoke journey and commands.
4. Run `pnpm e2e` and the existing build/unit/Biome checks.
5. Stop for review before adding failure-evidence and future-journey guidance.

### Incremental Delivery

1. Deliver the runnable Chromium smoke foundation.
2. Add failure evidence and deterministic-run guidance.
3. Document future feature-journey conventions.
4. Run all cross-cutting validation and reconcile the artifacts.

## Notes

- `[P]` tasks can run in parallel when they touch different files or are read-only validations.
- `[US#]` labels map implementation tasks to the user stories in `spec.md`.
- The smoke journey does not create accounts or financial movements; those belong to `004-account-setup` and future feature specifications.
- Browser binaries and generated evidence remain local and ignored.
