# Tasks: Shared Client State Architecture

## Phase 1: Setup

- [X] T001 Create the state architecture plan and research artifacts in `specs/002-state-architecture/plan.md`, `research.md`, `data-model.md`, and `quickstart.md`.

## Phase 2: Foundational domain model

- [X] T002 [P] Define account, currency, money, opening-event, summary, and operation-result types in `src/app/core/accounts/account-model.ts`.
- [X] T003 [P] Implement exact currency-scale parsing and minor-unit arithmetic helpers in `src/app/core/accounts/account-money.ts`.
- [X] T004 [P] Implement pure account input normalization and validation rules in `src/app/core/accounts/account-validation.ts`.

## Phase 3: User Story 1 — Keep Account Information Consistent

**Independent test**: create valid accounts through the store and read the same entity signal
from multiple consumers without maintaining a second collection.

- [X] T005 [US1] Add the root-provided normalized `AccountStore` with `withEntities`, immutable creation, and deterministic session reset in `src/app/core/accounts/account-store.ts`.
- [X] T006 [US1] Add store tests for shared entity identity, successful creation, and reset behavior in `src/app/core/accounts/account-store.spec.ts`.

## Phase 4: User Story 2 — See Reliable Derived Information

**Independent test**: create COP and USD asset/liability accounts and verify counts and
currency-separated summaries after each operation.

- [X] T007 [US2] Add computed account count and independent COP/USD available and outstanding summaries to `src/app/core/accounts/account-store.ts`.
- [X] T008 [US2] Add derived-value tests covering mixed currencies, account types, and at least 10 accounts in `src/app/core/accounts/account-store.spec.ts`.

## Phase 5: User Story 3 — Preserve Valid State After Errors

**Independent test**: snapshot all public entity and derived signals, reject each invalid
operation, and verify every snapshot remains unchanged with an actionable result.

- [X] T009 [US3] Wire validation outcomes into the store creation method without patching rejected operations in `src/app/core/accounts/account-store.ts`.
- [X] T010 [US3] Add rejection and unchanged-state tests for required fields, duplicates, unsupported precision, and negative/malformed amounts in `src/app/core/accounts/account-store.spec.ts`.

## Phase 6: User Story 4 — Extend Financial Features Predictably

**Independent test**: review the public store contract and consume account signals without
duplicating the account collection or introducing persistence.

- [X] T011 [US4] Document the state boundary, session-only lifecycle, and future async extension point in `specs/002-state-architecture/plan.md` and `quickstart.md`.
- [X] T012 [US4] Run Biome, Angular tests, production build, and `git diff --check`; reconcile any state architecture drift in the feature artifacts.

## Dependencies

`T002`–`T004` precede `T005`; `T005` precedes `T006`–`T010`; `T007` precedes `T008`; all
state work precedes the account UI feature. `T002`–`T004` can proceed in parallel because
they touch separate pure domain files.

## Implementation strategy

Deliver the state foundation first, then consume it from the account creation/list UI. Keep
the session-only MVP small: no persistence, remote calls, edits, deletes, or later financial
operations. Re-run the full quality gates before committing the completed state slice.
