# Research: Income and Expense Transactions

## Decision 1: Keep account and transaction state in one SignalStore

The existing `AccountStore` will own accounts and normalized transaction entities. Posting a movement changes both the event collection and the derived account projection, so a single `patchState()` is the safest atomic boundary.

**Rejected alternative**: a separate transaction store would make the cross-store write sequence easier to split accidentally and would require coordination for every balance projection.

## Decision 2: Posted transaction events are the source of truth

The opening balance event plus income and expense events are folded into a read-only balance projection. Direct mutation of `Account.balance` without an event is not allowed.

**Rejected alternative**: updating the balance directly is shorter but violates financial integrity and makes the first history view incomplete.

## Decision 3: Reuse exact bigint money helpers

Amounts continue to use minor units and `bigint` through the existing money module. COP has scale 0 and USD has scale 2. Parsing and validation happen before state mutation.

**Rejected alternative**: JavaScript `number` arithmetic or browser locale parsing could introduce rounding and inconsistent precision.

## Decision 4: Store canonical ISO dates

The domain stores `occurredAt` as a canonical ISO string. The `datetime-local` form value is normalized on submit. A default date is assigned only after the browser boundary so SSR and hydration remain deterministic.

**Rejected alternative**: storing a localized label would make ordering and later persistence ambiguous.

## Decision 5: Keep the first history view read-only and unfiltered

The page shows newest-first posted movements with account context and metadata. Search and filtering belong to the later ledger-history work in `013`; editing and deletion are intentionally out of scope.

No unresolved design questions remain for this feature.
