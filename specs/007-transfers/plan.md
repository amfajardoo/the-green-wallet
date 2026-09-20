# Implementation Plan: Same-Currency Account Transfers

**Branch**: `007-transfers` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-transfers/spec.md`

## Summary

Add internal transfers between two distinct asset accounts in the same currency. A
transfer is one immutable operation with a stable ID, source and destination legs, exact
amount, date, and description. The source balance decreases and the destination balance
increases in one atomic SignalStore update; rejected requests leave all state unchanged.

The existing account store remains the single financial aggregate. Transfers use their own
normalized entity collection and remain distinct from income, expenses, and future
credit-card payments. A Spanish Colombia transfer page and lazy `/transfers` route expose
the workflow; cross-currency conversion, card payments, and persistence remain out of scope.

## Technical Context

**Language/Version**: TypeScript 6.0, Angular 22.1

**Primary Dependencies**: Angular standalone components, Signal Forms, NgRx SignalStore 21, Vitest/jsdom, Biome 2.5

**Storage**: Session-only in-memory state; no browser persistence

**Testing**: Domain/store unit tests, transfer component tests, SSR production build, Biome, and quickstart checks

**Target Platform**: Browser with SSR and hydration

**Project Type**: Single Angular web application

**Performance Goals**: O(n) exact balance projection and at least 25 sequential paired transfers in one session

**Constraints**: `bigint` minor units, explicit COP/USD equality, asset-only endpoints, atomic paired effects, immutable history, WCAG 2.2 AA, keyboard support, and SSR-safe date handling

**Scale/Scope**: Transfer model, validation, store projection, form/history page, lazy route, navigation, and automated coverage

## Constitution Check

*GATE: PASS before implementation. Re-check after implementation.*

| Principle | Status | Evidence |
|---|---|---|
| Financial integrity | PASS | One transfer entity is added while both account balances are projected in one `patchState()` call. |
| Explicit domain and currency semantics | PASS | Only non-card asset accounts with equal COP/USD currency are accepted; no conversion is attempted. |
| Auditability | PASS | One stable operation ID retains source, destination, amount, currency, date, and description; no independent leg editing exists. |
| Local-first privacy | PASS | Transfer state is session-only and introduces no authentication, remote API, persistence, or storage access. |
| Small, accessible, testable changes | PASS | Focused validation/projection helpers, Signal Forms, lazy route, semantic errors, keyboard controls, and automated gates are planned. |

## Project Structure

### Documentation

```text
specs/007-transfers/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code

```text
src/app/
├── core/accounts/
│   ├── account-store.ts
│   ├── account-store.spec.ts
│   ├── transaction-balance.ts
│   ├── transaction-balance.spec.ts
│   ├── transfer-model.ts
│   ├── transfer-validation.ts
│   ├── transfer-balance.ts
│   ├── transfer-validation.spec.ts
│   └── transfer-balance.spec.ts
├── features/transfers/
│   ├── transfer-page.ts
│   ├── transfer-page.html
│   ├── transfer-page.css
│   └── transfer-page.spec.ts
├── navigation/
│   ├── navigation.config.ts
│   └── sidenav.component.spec.ts
├── app.routes.ts
└── app.spec.ts
```

**Structure Decision**: Keep transfers in `AccountStore` as a named entity collection and
derive balances from opening events, income/expense transactions, and transfer legs. A
separate store is rejected because cross-store updates could apply one leg without the
other.

## Complexity Tracking

No constitution violations. A dedicated transfer entity is intentionally separate from the
income/expense entity because its paired account effect and audit semantics are different.
