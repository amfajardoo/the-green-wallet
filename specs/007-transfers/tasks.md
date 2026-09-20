# Tasks: Same-Currency Account Transfers

**Input**: Design documents from `/specs/007-transfers/`
**Prerequisites**: plan.md, research.md, data-model.md, quickstart.md, spec.md

## Phase 1: Setup

- [ ] T001 [P] Confirm the existing account, money, transaction, store, route, and navigation entry points before extending transfer scope in `src/app/core/accounts/account-store.ts`, `src/app/core/accounts/account-money.ts`, `src/app/core/accounts/transaction-balance.ts`, `src/app/app.routes.ts`, and `src/app/navigation/navigation.config.ts`.
- [ ] T002 [P] Define the stable transfer operation, input, validation fields/codes, and operation result in `src/app/core/accounts/transfer-model.ts`.

## Phase 2: Foundation

- [ ] T003 [P] Implement same-currency asset endpoint, positive exact amount, date, description, distinct-account, and sufficient-source validation in `src/app/core/accounts/transfer-validation.ts`.
- [ ] T004 [P] Implement pure transfer leg effects, balance projection, and paired history helpers in `src/app/core/accounts/transfer-balance.ts`.
- [ ] T005 Extend `src/app/core/accounts/account-store.ts` with a normalized transfer collection, sequence, transfer projection, and reset behavior without changing transaction semantics.
- [ ] T006 Add an atomic `postTransfer` method that adds one transfer entity and reprojects both accounts in one `patchState()` call.
- [ ] T007 [P] Cover transfer validation and paired leg projection in `src/app/core/accounts/transfer-validation.spec.ts` and `src/app/core/accounts/transfer-balance.spec.ts`.
- [ ] T008 [P] Extend `src/app/core/accounts/account-store.spec.ts` with conservation, atomic rejection, currency isolation, stable IDs, and reset tests.

## Phase 3: User Story 1 - Move money between accounts (Priority: P1)

**Goal**: A user can transfer exact money from one funded asset account to another same-currency asset account.

**Independent test**: Create two COP asset accounts, post a transfer, and verify source decrease, destination increase, and one paired history entry.

- [ ] T009 [P] [US1] Add transfer-page tests for eligible source/destination options, exact amount, success feedback, and account balance context in `src/app/features/transfers/transfer-page.spec.ts`.
- [ ] T010 [US1] Implement the standalone Signal Forms transfer page model, account selectors, SSR-safe date default, and submit handling in `src/app/features/transfers/transfer-page.ts`.
- [ ] T011 [US1] Implement Spanish Colombia transfer form markup, explicit currency preview, and accessible errors in `src/app/features/transfers/transfer-page.html`.
- [ ] T012 [US1] Style the transfer form, endpoint cards, and success/error states responsively in `src/app/features/transfers/transfer-page.css`.

## Phase 4: User Story 2 - Preserve atomicity and currency boundaries (Priority: P1)

**Goal**: Invalid, insufficient, same-account, and cross-currency transfers make no partial changes.

**Independent test**: Submit each rejection path and compare both account balances, summaries, and transfer history before and after.

- [ ] T013 [P] [US2] Add UI/store tests for same-account, credit-card endpoint, currency mismatch, malformed amount, unsupported precision, insufficient funds, and blank description in `src/app/features/transfers/transfer-page.spec.ts` and `src/app/core/accounts/account-store.spec.ts`.
- [ ] T014 [US2] Integrate validation errors and source-available guidance into `src/app/features/transfers/transfer-page.ts` and `src/app/features/transfers/transfer-page.html`.
- [ ] T015 [US2] Add rejected-state visual feedback and non-color error affordances in `src/app/features/transfers/transfer-page.css`.

## Phase 5: User Story 3 - Review transfer history (Priority: P2)

**Goal**: Posted transfers remain visible as read-only paired operations with stable identity.

**Independent test**: Post several transfers, revisit the screen during the same session, and verify source, destination, amount, currency, date, description, and operation ID context.

- [ ] T016 [P] [US3] Add history tests for newest-first ordering, paired account names, stable IDs, and exclusion of rejected operations in `src/app/features/transfers/transfer-page.spec.ts`.
- [ ] T017 [US3] Expose newest-first transfer summaries and source/destination account context in `src/app/core/accounts/account-store.ts` and `src/app/core/accounts/transfer-balance.ts`.
- [ ] T018 [US3] Render empty and populated read-only transfer history in `src/app/features/transfers/transfer-page.html`.
- [ ] T019 [US3] Style paired history rows and narrow-screen metadata wrapping in `src/app/features/transfers/transfer-page.css`.

## Phase 6: Routing and navigation

- [ ] T020 [P] Add a lazy `/transfers` route and route coverage in `src/app/app.routes.ts` and `src/app/app.spec.ts`.
- [ ] T021 [P] Add the Spanish `Transferencias` navigation item and coverage in `src/app/navigation/navigation.config.ts` and `src/app/navigation/sidenav.component.spec.ts`.
- [ ] T022 Integrate the transfer page with the existing shell and responsive navigation in `src/app/features/transfers/transfer-page.spec.ts`.

## Phase 7: Polish and verification

- [ ] T023 [P] Review Colombian Spanish, explicit currency, source/destination, liability, and read-only copy in transfer page and validation files.
- [ ] T024 [P] Run Biome and resolve formatting/lint issues in changed files.
- [ ] T025 Run the complete unit/component suite with the direct Angular binary.
- [ ] T026 Run the production SSR/prerender build and verify existing, transactions, and transfers routes.
- [ ] T027 Run `git diff --check` and review final scope against the spec, confirming no cross-currency conversion, card payments, persistence, remote integrations, or edit/delete paths.

## Dependencies and execution order

`Setup -> Foundation -> US1 -> US2 -> US3 -> Routing -> Polish`

The MVP is US1 after Foundation. T003, T004, and T007 can proceed in parallel. UI tests can proceed with the form implementation; T020 and T021 are independent routing/navigation tasks; T023 and T024 are independent polish tasks.

## Traceability

| Requirement | Tasks |
|---|---|
| FR-001 and FR-002 endpoints/currency | T003-T006, T009-T015 |
| FR-003 and FR-008 paired audit history | T002, T004, T016-T019 |
| FR-004 and FR-005 amount rules | T003, T007, T013-T015 |
| FR-006 to FR-007 atomicity | T005-T008, T013-T015 |
| FR-009 operation distinction | T002, T004, T006, T017-T019 |
| FR-010 session boundary | T005, T008, T017, T027 |
