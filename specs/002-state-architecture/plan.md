# Implementation Plan: Shared Client State Architecture for Financial Features

**Branch**: `002-state-architecture` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

## Summary

Implement a root-provided NgRx SignalStore as the single in-memory source of truth for
account entities. The store will expose validated synchronous account creation and reset
operations, normalized entities, and computed currency-specific summaries. Monetary values
will use exact integer minor units (`bigint`) rather than binary floating point. The store
will remain session-only and will not read or write browser storage, URLs, or remote APIs.

## Technical Context

**Language/Version**: TypeScript 6, Angular 22 strict mode

**Primary Dependencies**: `@ngrx/signals` 21.1, Angular Signals, Vitest through Angular CLI

**Storage**: In-memory SignalStore only; no persistence or backend

**Testing**: Angular CLI test runner with Vitest, plus Biome and production SSR build

**Target Platform**: Angular browser application with SSR/hydration support

**Project Type**: Single Angular web application

**Performance Goals**: Correct reactive updates for at least 10 session accounts; derived
summaries recompute from the normalized entity collection without consumer-side copies

**Constraints**: Exact monetary arithmetic, explicit currencies, atomic immutable updates,
session-only state, no asynchronous complexity for local creation, WCAG-compatible consumers

**Scale/Scope**: Account state foundation for the first session; future transactions,
transfers, card payments, and persistence are separate features

## Constitution Check

*GATE: PASS before and after design.*

- Financial Integrity: PASS. Money is represented as exact minor-unit `bigint` values, and
  account creation creates the opening-balance event in the same immutable transition.
- Domain and Currency Semantics: PASS. Account type and ISO currency are required and
  asset/liability meaning remains explicit.
- Financial History: PASS for this slice. Opening balance is retained as a traceable event;
  later posted movements remain out of scope.
- Local-First Privacy: PASS. The store is session-only and has no browser or network I/O.
- Small, Accessible, and Testable Delivery: PASS. Domain validation and derived values are
  unit tested independently from rendered components; UI accessibility is handled by the
  account and navigation features.

## Architecture

### State boundary

`AccountStore` is the only shared account collection. Consumers read its signals and invoke
its methods; they do not keep a second account array. State is composed in this order:

1. `withEntities<Account>()` for normalized `ids`, `entityMap`, and `entities`.
2. `withState()` for the deterministic account-id sequence.
3. `withComputed()` for account count and COP/USD asset and liability summaries.
4. `withMethods()` for validated creation and session reset using `patchState()`.

Validation is pure and happens before any state update. Rejected operations return a typed,
field-specific error and do not call `patchState()`. A successful operation patches the new
entity and sequence together, so no consumer can observe a partial account.

### Monetary representation

`Money` stores `{ currency, minorUnits }`. COP uses scale 0 and USD uses scale 2. Parsing
accepts decimal text, rejects negative/malformed/unsupported precision values, and uses
`bigint` for all arithmetic. Formatting is a separate pure concern for the UI feature.

### Source layout

```text
src/app/core/accounts/
├── account-model.ts       # Account, money, form input, operation result types
├── account-money.ts       # Exact parsing and currency scale rules
├── account-validation.ts  # Pure account input validation and normalization
├── account-store.ts       # Root SignalStore and derived summaries
└── account-store.spec.ts  # Store and domain behavior tests
```

## Design Decisions

- Use `withEntities` instead of an array so account identity and lookups have one normalized
  representation.
- Keep errors out of shared state. A rejected operation returns its actionable outcome; the
  consuming form owns transient presentation error state, while the financial state remains
  byte-for-byte equivalent in behavior.
- Use a monotonic session sequence for deterministic, SSR-safe IDs rather than depending on
  browser-only UUID APIs.
- Keep async call-state concerns out of the synchronous first slice. The boundary is left
  open for future `rxMethod()` integrations when a remote or persisted operation is approved.

## Complexity Tracking

No constitution violations or complexity exceptions are required.
