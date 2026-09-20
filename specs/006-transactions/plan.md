# Implementation Plan: Income and Expense Transactions

**Branch**: `006-transactions` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-transactions/spec.md`

## Summary

Add the first posted financial movements: income for asset accounts and expenses for asset accounts or credit cards. Transactions are authoritative posted events; account balances are derived from the opening balance plus those events. A valid post adds the complete transaction and its balance effect atomically; a rejected post changes nothing.

The existing account SignalStore remains the single client-state aggregate. It will gain a normalized transaction entity collection, pure exact-money balance helpers, a Spanish Colombia transaction page, and a lazy `/transactions` route. Transfers, card payments, persistence, filtering, editing, and deletion remain outside this feature.

## Technical Context

**Language/Version**: TypeScript 6.0, Angular 22.1

**Primary Dependencies**: Angular standalone components, Signal Forms, NgRx SignalStore 21, Vitest/jsdom, Biome 2.5

**Storage**: Session-only in-memory state; no browser persistence

**Testing**: Domain/store unit tests, transaction component tests, SSR production build, Biome, and quickstart checks

**Target Platform**: Browser with SSR and hydration

**Project Type**: Single Angular web application

**Performance Goals**: Deterministic O(n) balance summaries and comfortable rendering for at least 50 posted events per account

**Constraints**: Exact `bigint` minor-unit arithmetic, explicit COP/USD semantics, atomic state transitions, no implicit conversion, WCAG 2.2 AA, keyboard support, and SSR-safe date handling

**Scale/Scope**: Core transaction model, store, form, history, lazy route, and automated coverage for the first income/expense workflow

## Constitution Check

*GATE: PASS before implementation. Re-check after implementation.*

| Principle | Status | Evidence |
|---|---|---|
| Financial integrity | PASS | Posted transaction events are the source of truth; one `patchState()` adds a valid event and derives its balance effect atomically. |
| Explicit domain and currency semantics | PASS | Income is limited to asset accounts; expenses support assets or credit cards; every amount uses the selected account currency. |
| Auditability | PASS | Events have stable IDs, type, amount, currency, account, date, and trimmed description; there is no edit/delete path. |
| Local-first privacy | PASS | State remains session-only; no authentication, remote API, persistence, or storage dependency is introduced. |
| Small, accessible, testable changes | PASS | Focused domain helpers, Signal Forms, a lazy page, keyboard-accessible controls, and unit/component/build gates are planned. |

## Project Structure

### Documentation (this feature)

```text
specs/006-transactions/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
src/app/
├── core/accounts/
│   ├── account-model.ts
│   ├── account-money.ts
│   ├── account-store.ts
│   ├── transaction-model.ts
│   ├── transaction-validation.ts
│   ├── transaction-balance.ts
│   ├── account-store.spec.ts
│   ├── transaction-validation.spec.ts
│   └── transaction-balance.spec.ts
├── features/transactions/
│   ├── transaction-page.ts
│   ├── transaction-page.html
│   ├── transaction-page.css
│   └── transaction-page.spec.ts
├── navigation/
│   ├── navigation.config.ts
│   └── sidenav.component.spec.ts
├── app.routes.ts
└── app.spec.ts
```

**Structure Decision**: Keep the account store as the single client-state aggregate so posting a transaction and projecting the account balance cannot partially succeed across stores. Transactions are normalized in that store; pure helpers own validation and balance folding; the feature page is lazy-loaded and session-only.

## Complexity Tracking

No constitution violations. A separate transaction store was considered and rejected because cross-store writes could leave the transaction event and derived account balance out of sync.
