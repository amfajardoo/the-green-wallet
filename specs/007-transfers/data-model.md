# Data Model: Same-Currency Account Transfers

## Transfer

| Field | Type | Rules |
|---|---|---|
| `id` | `string` | Stable session operation identifier. |
| `sourceAccountId` | `string` | Existing savings, checking, or cash account. |
| `destinationAccountId` | `string` | Existing asset account different from the source. |
| `amount` | `Money` | Positive exact amount in COP or USD. |
| `occurredAt` | ISO `string` | Valid normalized date; future dates are allowed. |
| `description` | `string` | Trimmed and nonblank audit explanation. |

## Transfer Input

The UI boundary accepts source, destination, amount, date, and description as strings. The
domain resolves both accounts, checks asset/currency rules, parses exact money, and only
then creates a posted transfer.

## Transfer Legs

```text
source leg      = -amount
destination leg = +amount
```

The legs are derived read-only effects, not independently stored or editable events. They
must share the transfer ID and currency.

## Balance Projection

```text
opening balance + income - asset expenses - outgoing transfers + incoming transfers
```

Credit-card balances are unchanged by this feature. A source expense cannot exceed the
current projected available balance.

## State Transitions

```text
invalid input -> validation error + unchanged accounts, summaries, and transfer history
valid input   -> one transfer entity + both projected account balances in one atomic update
session reset -> accounts, transactions, and transfers cleared together
```
