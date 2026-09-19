# Tasks: Account Setup and Opening Balances

## Phase 1: Setup

- [X] T001 Create the account setup plan and design artifacts in `specs/004-account-setup/plan.md`, `research.md`, `data-model.md`, and `quickstart.md`.

## Phase 2: User Story 1 — Create an Account

**Independent test**: submit one valid account and verify it appears with the submitted
details while the store remains the only shared collection.

- [X] T002 [P] [US1] Create the standalone account page form model and Signal Forms schema in `src/app/features/accounts/account-page.ts`.
- [X] T003 [P] [US1] Add accessible account creation markup with labels, field feedback, and actionable form-level errors in `src/app/features/accounts/account-page.html`.
- [X] T004 [US1] Implement successful submission/reset and store error handling in `src/app/features/accounts/account-page.ts`.
- [X] T005 [P] [US1] Add themed account form styles in `src/app/features/accounts/account-page.css`.

## Phase 3: User Story 2 — Set an Opening Balance

**Independent test**: create asset and credit-card accounts with zero, COP, and USD
opening values and verify exact, semantically labeled balances.

- [X] T006 [US2] Render account summaries and balance semantics from `AccountStore` in `src/app/features/accounts/account-page.html`.
- [X] T007 [US2] Add exact balance formatting and credit-card liability presentation coverage in `src/app/features/accounts/account-page.spec.ts`.

## Phase 4: User Story 3 — Review Accounts in the Current Session

**Independent test**: create multiple accounts, verify every detail is listed, reject an
invalid submission without list changes, and verify a fresh page starts empty.

- [X] T008 [US3] Add account page rendering and invalid-submission tests in `src/app/features/accounts/account-page.spec.ts`.
- [X] T009 [US3] Run Angular tests, production build, Biome, and `git diff --check`; reconcile account-flow artifact drift.

## Dependencies

`T002` and `T003` can proceed in parallel; `T004` depends on the form and markup; `T006` and
`T007` depend on the store contract; `T008` and `T009` follow the complete page. Routing and
sidenav belong to the next feature and are intentionally not included here.

## Implementation strategy

Deliver the account page as a self-contained session feature first. Keep the root shell and
navigation integration separate so the next task can move this page behind lazy routes and a
sidenav without changing the domain or store contract.
