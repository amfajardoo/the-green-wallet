# Implementation Plan: Account Setup and Opening Balances

**Branch**: `004-account-setup` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

## Summary

Build the session-only account setup experience on top of `AccountStore`. A standalone
account page will use Angular Signal Forms for typed form state and field-level validation,
submit one complete `CreateAccountInput` to the store, and render the store's reactive entity
collection. COP and USD input rules will be explicit, account balances will distinguish
available assets from outstanding card liabilities, and no browser persistence or backend
integration will be introduced.

## Technical Context

**Language/Version**: TypeScript 6, Angular 22 strict mode

**Primary Dependencies**: Angular Signal Forms (`@angular/forms/signals`), NgRx SignalStore,
Angular common directives, Vitest through Angular CLI

**Storage**: In-memory `AccountStore` for the active session only

**Testing**: Angular component tests and pure/store tests; Biome; production SSR build

**Target Platform**: Angular browser application with SSR/hydration support

**Project Type**: Single Angular web application

**Performance Goals**: Add and render at least 10 accounts in one session with immediate
reactive feedback

**Constraints**: No persistence, authentication, backend, edits, deletion, transactions,
transfers, card payments, or cross-currency conversion; exact amount parsing remains in the
account domain module

**Scale/Scope**: Account create/list flow only; routing and sidenav are the next ordered task

## Constitution Check

*GATE: PASS before and after design.*

- Financial Integrity: PASS. The UI submits to the store; it does not calculate or mutate
  balances, and each created account retains its opening event.
- Domain and Currency Semantics: PASS. Type, currency, precision, and asset/liability
  meaning are visible and validated.
- Financial History: PASS for this slice. The opening event is created atomically by the
  state layer and shown as the origin of the initial balance.
- Local-First Privacy: PASS. No storage, URL, network, or authentication code is added.
- Small, Accessible, and Testable Delivery: PASS. Signal Forms provide field semantics,
  visible errors, keyboard-native controls, and component tests cover the user flow.

## Architecture

### Component boundary

`AccountPage` owns transient form model and submission feedback. `AccountStore` owns all
created account entities and summaries. The page reads `entities`, `accountCount`, and
currency summaries from the store and calls `createAccount()`; it does not keep a second
account collection.

### Validation boundary

Signal Forms validates required name/type/currency fields and opening-balance syntax for
immediate feedback. The store remains the final validation boundary for duplicates and all
domain invariants, so programmatic consumers receive the same safe outcome. A rejected store
operation is rendered as a form-level actionable message and does not change the list.

### Source layout

```text
src/app/features/accounts/
├── account-page.ts       # Standalone page component and form model
├── account-page.html     # Accessible account create/list markup
├── account-page.css      # Global feature styling using the visual theme tokens
├── account-page.component.css # Component host styling kept below Angular's style budget
└── account-page.spec.ts  # Render and interaction coverage
```

## Design Decisions

- Use native text/select controls with Signal Forms instead of custom controls so keyboard,
  focus, labels, and browser semantics remain straightforward.
- Keep opening balance as text in the form model. Parsing is delegated to the exact domain
  parser, avoiding `number` conversion and preserving user-entered precision until submit.
- Render the balance meaning in text (`Available balance` vs `Outstanding liability`) in
  addition to color so financial meaning never depends on color alone.
- Include a session-only notice in the page so users understand why refresh clears accounts.

## Complexity Tracking

No constitution violations or complexity exceptions are required.
