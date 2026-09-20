# Tasks: Income and Expense Transactions

**Input**: Design documents from `/specs/006-transactions/`
**Prerequisites**: plan.md, research.md, data-model.md, quickstart.md, spec.md

## Phase 1: Setup

- [ ] T001 [P] Confirm the existing account model, money helpers, and route entry points in `src/app/core/accounts/account-model.ts`, `src/app/core/accounts/account-money.ts`, and `src/app/app.routes.ts` without expanding scope.
- [ ] T002 [P] Define the transaction type, stable ID shape, sequence input, and posted event model in `src/app/core/accounts/transaction-model.ts`.

## Phase 2: Foundation

- [ ] T003 [P] Implement transaction validation for positive exact amounts, account compatibility, currency matching, nonblank descriptions, and valid dates in `src/app/core/accounts/transaction-validation.ts`.
- [ ] T004 [P] Implement pure bigint balance folding, card-liability semantics, and COP/USD summaries in `src/app/core/accounts/transaction-balance.ts`.
- [ ] T005 Extend `src/app/core/accounts/account-store.ts` with a normalized transaction collection, transaction sequence, derived balances, and reset behavior.
- [ ] T006 Add an atomic `postTransaction` store method in `src/app/core/accounts/account-store.ts` using one `patchState()` call; invalid input must be a no-op.
- [ ] T007 [P] Cover validation and balance-folding rules in `src/app/core/accounts/transaction-validation.spec.ts` and `src/app/core/accounts/transaction-balance.spec.ts`.
- [ ] T008 [P] Cover store ordering, atomicity, rejected-state invariants, reset behavior, and COP/USD isolation in `src/app/core/accounts/account-store.spec.ts`.

## Phase 3: User Story 1 - Register income (Priority: P1)

**Goal**: A user can post an income to an eligible asset account and see its exact updated balance.

**Independent test**: With a COP asset account, post a valid income and verify the new balance, account context, and history entry.

- [ ] T009 [P] [US1] Add transaction-page tests for income fields, eligible account options, exact display, and validation errors in `src/app/features/transactions/transaction-page.spec.ts`.
- [ ] T010 [US1] Implement the standalone transaction form model with Signal Forms, account options, SSR-safe date default, and submit handling in `src/app/features/transactions/transaction-page.ts`.
- [ ] T011 [US1] Implement the Spanish Colombia income form markup and accessible errors in `src/app/features/transactions/transaction-page.html`.
- [ ] T012 [US1] Style the transaction form, summary, and feedback states responsively in `src/app/features/transactions/transaction-page.css`.

## Phase 4: User Story 2 - Register expense (Priority: P1)

**Goal**: A user can post an expense to an asset or credit-card account with correct balance and liability semantics.

**Independent test**: Verify asset expenses reduce available balance, card expenses increase owed liability, and invalid/insufficient/currency-mismatched posts do not mutate state.

- [ ] T013 [P] [US2] Add tests for asset/card semantics, insufficient balance, invalid amount, and currency mismatch in `src/app/features/transactions/transaction-page.spec.ts` and `src/app/core/accounts/account-store.spec.ts`.
- [ ] T014 [US2] Complete expense validation and signed-effect rules in `src/app/core/accounts/transaction-validation.ts` and `src/app/core/accounts/transaction-balance.ts`.
- [ ] T015 [US2] Add expense selection, account guidance, currency display, and rejection feedback in `src/app/features/transactions/transaction-page.ts` and `src/app/features/transactions/transaction-page.html`.
- [ ] T016 [US2] Add responsive visual states for expense validation and success feedback in `src/app/features/transactions/transaction-page.css`.

## Phase 5: User Story 3 - Review movement history (Priority: P1)

**Goal**: A user can review posted movements in newest-first order with enough metadata to understand each event.

**Independent test**: Post multiple movements, refresh the view within the session, and verify ordering, account context, amount, currency, date, and description.

- [ ] T017 [P] [US3] Add history tests for newest-first ordering, stable IDs, complete metadata, and exclusion of rejected submissions in `src/app/features/transactions/transaction-page.spec.ts`.
- [ ] T018 [US3] Expose newest-first transaction projections with account context from `src/app/core/accounts/account-store.ts` and `src/app/core/accounts/transaction-balance.ts`.
- [ ] T019 [US3] Render empty and populated session history states in `src/app/features/transactions/transaction-page.html`.
- [ ] T020 [US3] Style history rows, metadata wrapping, and narrow-screen behavior in `src/app/features/transactions/transaction-page.css`.

## Phase 6: Routing and navigation

- [ ] T021 [P] Add a lazy `/transactions` route and route coverage in `src/app/app.routes.ts` and `src/app/app.spec.ts`.
- [ ] T022 [P] Add the Spanish `Movimientos` navigation item and update navigation coverage in `src/app/navigation/navigation.config.ts` and `src/app/navigation/sidenav.component.spec.ts`.
- [ ] T023 Integrate the transaction page with the existing shell and responsive sidenav behavior in `src/app/features/transactions/transaction-page.spec.ts`, `src/app/navigation/sidenav.component.html`, and `src/app/navigation/sidenav.component.css`.

## Phase 7: Polish and verification

- [ ] T024 [P] Review all user-facing transaction copy for Colombian Spanish, explicit COP/USD labels, and asset/liability terminology in `src/app/features/transactions/transaction-page.ts`, `src/app/features/transactions/transaction-page.html`, and `src/app/core/accounts/transaction-validation.ts`.
- [ ] T025 [P] Run Biome and resolve formatting or lint issues in changed files.
- [ ] T026 Run the complete unit/component test suite with the direct Angular binary.
- [ ] T027 Run the production SSR/prerender build and verify both existing and `/transactions` routes.
- [ ] T028 Run `git diff --check` and review the final diff against the spec, confirming that transfers, card payments, persistence, remote APIs, search/filtering, and edit/delete remain out of scope.

## Dependencies and execution order

`Setup -> Foundation -> US1 -> US2 -> US3 -> Routing -> Polish`

The MVP is US1 after Foundation. T003, T004, T007, and T008 can proceed in parallel. UI tests can begin with the form work; T021 and T022 are independent routing/navigation tasks; T024 and T025 are independent polish tasks.

## Traceability

| Requirement | Tasks |
|---|---|
| FR-001 income | T003, T005-T012 |
| FR-002 expense | T004, T013-T016 |
| FR-003 and FR-009 history | T002, T017-T020 |
| FR-004 to FR-006 validation | T003, T004, T007, T008, T013-T016 |
| FR-007 and FR-008 state integrity | T005-T008, T013, T017-T018 |
| FR-010 integration | T001, T005, T021-T023, T028 |
