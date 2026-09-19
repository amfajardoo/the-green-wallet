# Tasks: Responsive Side Navigation

## Phase 1: Setup

- [X] T001 Confirm the approved account destination and reconcile the navigation design artifacts in `specs/005-sidenav/`.

## Phase 2: Foundational shell

- [X] T002 [P] Define the shared navigation destination contract in `src/app/navigation/navigation.types.ts`.
- [X] T003 [P] Define the approved `/accounts` destination catalog in `src/app/navigation/navigation.config.ts`.
- [X] T004 Integrate the standalone `Sidenav` into `src/app/app.ts` and `src/app/app.html` while preserving SSR and the router outlet.
- [X] T005 Add the lazy `/accounts` route and root/fallback redirects in `src/app/app.routes.ts`.

## Phase 3: User Story 1 — Navigate from Tablet and Desktop

**Independent test**: At 768px and above, the sidenav is visible beside the account page;
the account destination is the only actionable link and its active semantics come from the
current route.

- [X] T006 [US1] Render the semantic persistent navigation and route-aware active links in `src/app/navigation/sidenav.component.html`.
- [X] T007 [US1] Implement the responsive shell grid and persistent navigation styling in `src/styles/shell.css` and `src/app/navigation/sidenav.component.css`.

## Phase 4: User Story 2 — Open Navigation on Mobile

**Independent test**: At mobile widths, the menu starts closed, one button opens the left
drawer and backdrop, and the same approved destination is available.

- [X] T008 [US2] Implement transient mobile open/close state and CSS mobile presentation in `src/app/navigation/sidenav.component.ts` and `sidenav.component.css`.
- [X] T009 [US2] Add the accessible trigger, drawer, backdrop, close action, and destination-selection behavior in `src/app/navigation/sidenav.component.html`.

## Phase 5: User Story 3 — Operate the Navigation Accessibly

**Independent test**: Keyboard interaction opens the drawer, moves focus inside, closes on
Escape or close action, restores focus to the trigger, and preserves visible active meaning.

- [X] T010 [US3] Implement focus movement/restoration and Escape handling in `src/app/navigation/sidenav.component.ts`.
- [X] T011 [US3] Add Sidenav interaction tests in `src/app/navigation/sidenav.component.spec.ts`.
- [X] T012 [US3] Verify semantic attributes, visible focus treatment, reduced-motion compatibility, and no persistence in the shell implementation.

## Phase 6: Polish

- [X] T013 Run Angular tests, SSR production build, Biome, and `git diff --check`.
- [X] T014 Reconcile `spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, and this task list with the delivered `/accounts` route and native drawer implementation.

## Dependencies

`T002` and `T003` are independent. `T004` and `T005` establish the shell and route before
the user-story phases. The persistent presentation precedes mobile behavior; accessibility
hardening follows both. All tasks are complete for this ordered slice.

## Scope boundary

This feature adds only the accounts route to navigation. Transactions, transfers, payments,
and persistence remain outside the current product flow and must not be added as links.
