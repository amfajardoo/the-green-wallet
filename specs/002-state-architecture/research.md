# Research: Shared Client State Architecture

## Decision: NgRx SignalStore with normalized account entities

**Rationale**: The project already depends on `@ngrx/signals`, and the feature explicitly
approves SignalStore. `withEntities()` gives the account collection a stable normalized
shape while `withComputed()` keeps derived values in the state boundary. `patchState()`
provides the required immutable transitions without traditional actions/reducers.

**Alternatives considered**:

- Component-local signals: rejected because multiple screens would need duplicated state.
- A shared service with an array: rejected because it bypasses the approved entity-oriented
  boundary and makes identity/update rules less explicit.
- Traditional NgRx Store: rejected because it adds actions, reducers, and effects that are
  unnecessary for synchronous session-only creation.

## Decision: Exact minor-unit `bigint` money

**Rationale**: The constitution forbids binary floating-point arithmetic for money. Storing
COP as whole minor units and USD as cents preserves exact addition and comparison while
keeping currency explicit. The parser accepts user text and rejects unsupported precision
before any state transition.

**Alternatives considered**:

- JavaScript `number`: rejected because decimal fractions can lose precision.
- A decimal library: deferred because this slice needs no external arithmetic dependency;
  the small parser and integer representation are sufficient and SSR-safe.
- Formatted strings in state: rejected because derived summaries need exact arithmetic.

## Decision: Session-safe deterministic identifiers

**Rationale**: A store-local monotonic sequence avoids browser globals during SSR and makes
tests deterministic. IDs are stable for the lifetime of the session and are reset with the
session state.

**Alternatives considered**:

- `crypto.randomUUID()`: deferred because direct browser global access is unnecessary in
  this session-only foundation and complicates deterministic tests.
- Array indexes: rejected because indexes are not stable entity identities.
