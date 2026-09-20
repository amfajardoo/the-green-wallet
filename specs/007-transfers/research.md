# Research: Same-Currency Account Transfers

## Decision 1: Store one transfer operation with two derived legs

The domain stores one `Transfer` entity containing source account, destination account,
amount, currency, date, and description. Its signed effects are derived: negative on the
source and positive on the destination.

**Rejected alternative**: two independent transaction entities could be posted separately
and would make pairing or atomic rollback fragile.

## Decision 2: Keep transfers in the existing AccountStore

Accounts, income/expense transactions, and transfers share the same balance projection and
session reset. The store validates the complete request, adds the transfer entity, and
reprojects both accounts inside one `patchState()` call.

**Rejected alternative**: a second store would create a cross-store partial-write risk.

## Decision 3: Reuse exact money parsing and explicit currency equality

The transfer form uses the selected source currency and the domain requires the destination
currency to match exactly. COP and USD precision rules remain owned by the existing money
helper; no exchange-rate or rounding path is added.

## Decision 4: Present a paired transfer history

The transfer page shows each operation once with source and destination names, amount,
currency, date, and description. It is read-only and keeps the operation visually distinct
from income and expenses.

**Rejected alternative**: displaying two editable rows would obscure the single operation
identity and contradict auditability.

## Decision 5: Keep endpoint selection explicit

Only savings, checking, and cash accounts are selectable. The source and destination must
be different existing accounts; credit cards are not transfer endpoints in this feature.

No unresolved design questions remain.
