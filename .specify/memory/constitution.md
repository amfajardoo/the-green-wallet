<!--
Sync Impact Report
- Version change: template → 1.0.0
- Modified principles: five placeholders replaced with Financial Integrity, Explicit
  Domain Semantics, Auditability, Local-First Privacy, and Testable Delivery.
- Added sections: Product, Privacy, and Technical Constraints; Development Workflow and
  Quality Gates.
- Removed sections: none.
- Follow-up TODOs: none. Deferred product capabilities belong in future feature specs.
-->

# TheGreenWallet Constitution

## Core Principles

### I. Financial Integrity Is Non-Negotiable

Every operation that changes money MUST be represented as a consistent ledger event.
Transfers MUST update the source and destination atomically, and an operation MUST NOT
leave one side applied while the other side fails. Balances MUST be derived from the
recorded financial events rather than maintained as an independent, silently mutable
value.

Income, expenses, transfers, and credit-card payments MUST have explicit operation types.
An expense paid with a credit card MUST increase the card liability; a payment from an
asset account to a credit card MUST reduce that liability. The implementation MUST use
exact monetary arithmetic and MUST NOT use binary floating-point calculations for money.

### II. Domain and Currency Semantics Must Be Explicit

Every account MUST have a declared type and currency. The initial account types are
savings account, checking account, cash, and credit card. Credit cards MUST be modeled
as liabilities, while savings, checking, and cash accounts MUST be modeled as assets.

The initial supported currencies are COP and USD. Every amount MUST carry its ISO currency
code. Same-currency transfers MUST preserve the amount exactly. Cross-currency movements
MUST use an explicit conversion operation with an exchange rate and any applicable fee;
the system MUST reject an unsupported implicit conversion rather than guessing.

### III. Financial History Must Be Auditable

Posted financial movements MUST NOT be physically deleted or silently rewritten. A
correction MUST be represented by a compensating or reversal movement that preserves the
original event and explains the correction. Accounts with history MUST be archived or
closed instead of deleted.

Each posted movement MUST retain enough information to explain its effect: a stable
identifier, operation type, amount, currency, date, affected account or accounts, and a
user-readable description. The interface MUST make the resulting history and balances
understandable to the person using the application.

### IV. Local-First Privacy and Safe Data Handling

Version one MUST operate locally on the user's device. It MUST NOT require authentication,
remote persistence, bank integrations, or cloud synchronization. Financial data MUST NOT
be sent to external services without a separately approved specification, explicit user
consent, and a security review.

Local persistence MUST be accessed through an isolated, testable boundary that is safe for
Angular server-side rendering and browser hydration. Errors MUST be handled without
partial financial writes, and diagnostic output MUST NOT expose sensitive financial data.

### V. Small, Accessible, and Testable Delivery

Every user-visible behavior MUST be defined by acceptance criteria before implementation.
Non-trivial changes MUST follow the Spec-Driven Development workflow and MUST maintain
traceability from specification to plan, tasks, tests, and implementation.

The application MUST follow the repository's Angular and TypeScript standards: strict
typing, standalone components, signal-based state, focused components and services,
lazy-loaded feature routes, and dependency injection through `inject()`. New interfaces
MUST meet WCAG 2.2 AA requirements and MUST pass the applicable automated accessibility
checks.

Domain rules and financial invariants MUST have automated tests. A change is complete only
when its acceptance tests pass, the production build passes, and the applicable Biome
checks pass without unexplained diagnostics.

## Product, Privacy, and Technical Constraints

The initial product boundary consists of:

- Creating and managing savings accounts, checking accounts, cash accounts, and credit
  cards.
- Recording income and expenses against the appropriate financial account or liability.
- Moving money between accounts through explicit transfers.
- Recording credit-card purchases and paying credit-card balances from asset accounts.
- Supporting COP and USD while keeping currencies explicit and conversions intentional.

Budgets, recurring operations, investments, bank synchronization, multi-user access,
authentication, cloud synchronization, and additional account types are deferred. Each
future capability MUST be introduced through its own specification and MUST NOT be
implicitly added to an existing domain rule.

Angular SSR and hydration remain supported. Browser-only persistence and APIs MUST be
isolated behind platform-safe abstractions so server rendering does not access browser
globals directly.

`AGENTS.md` provides the repository's operational engineering guidance. It complements
this constitution; when a conflict exists, this constitution governs product and quality
decisions, while `AGENTS.md` governs their day-to-day implementation details.

## Development Workflow and Quality Gates

For a non-trivial feature, the required sequence is:

1. `$speckit-specify` to define the user value, scope, and acceptance criteria.
2. `$speckit-clarify` to resolve meaningful ambiguity before technical planning.
3. `$speckit-plan` to define the architecture, domain model, and implementation approach.
4. `$speckit-checklist` to validate requirements quality.
5. `$speckit-tasks` to derive dependency-ordered implementation tasks.
6. `$speckit-analyze` to check consistency across specification, plan, and tasks.
7. `$speckit-implement` to execute the approved tasks.
8. `$speckit-converge` to compare the result with the artifacts and close remaining gaps.

Feature artifacts MUST be written in English and stored using the flow-forward model under
`specs/<feature-id>-<slug>/`. A change MUST update the highest-level artifact whose intent
has changed, then regenerate or reconcile all dependent artifacts before implementation
continues.

Every review MUST verify, as applicable:

- Financial invariants, currency handling, and auditability.
- Unit and integration tests for affected domain behavior.
- `pnpm build`, `pnpm test`, and the relevant Biome verification command.
- Keyboard access, focus behavior, semantic markup, color contrast, and automated
  accessibility checks for user-facing changes.
- No unexplained drift between the specification, plan, tasks, and implementation.

## Governance

This constitution is the governing contract for product integrity, privacy, architecture,
and quality. Every feature specification and implementation plan MUST identify any
principle it affects. Deviations require an explicit rationale in the relevant artifact
and review approval before implementation.

Amendments MUST be made through a reviewable change to this file and MUST include a Sync
Impact Report at the top of the document. The version follows semantic governance
versioning:

- MAJOR for removing or redefining an existing principle in a backward-incompatible way.
- MINOR for adding a principle or materially expanding the project's constraints.
- PATCH for clarifications, wording improvements, and non-semantic corrections.

The constitution MUST be reviewed whenever the product adds a new financial operation,
changes currency or persistence behavior, introduces remote services, or changes the
quality gates. New functionality MUST remain within the current constitution or amend it
before implementation begins.

**Version**: 1.0.0 | **Ratified**: 2026-08-15 | **Last Amended**: 2026-08-15
