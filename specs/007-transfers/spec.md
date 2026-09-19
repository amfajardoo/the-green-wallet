# Feature Specification: Same-Currency Account Transfers

**Feature Branch**: `007-transfers`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User request to define the next financial feature after transactions: moving
money atomically between supported accounts without implicit currency conversion.

## Dependencies

This feature depends on `006-transactions` for the shared posted-movement history model and
on `004-account-setup` for account types, currencies, and session identity. Credit-card
payments are specified separately in `008-card-payments`.

## User Scenarios & Testing

### User Story 1 - Move Money Between Accounts (Priority: P1)

As a personal-finance user, I want to move money from one asset account to another so that
my account balances stay accurate when I reorganize funds.

**Independent Test**: Create two same-currency asset accounts, transfer a valid amount, and
verify the source decreases, destination increases, and one traceable transfer is recorded.

**Acceptance Scenarios**:

1. **Given** two different asset accounts in the same currency and a funded source, **When**
   the user submits a valid transfer, **Then** the source decreases and destination
   increases by exactly the same amount.
2. **Given** a successful transfer, **When** the user reviews history, **Then** the transfer
   identifies both accounts, amount, currency, date, and description.
3. **Given** the source and destination are the same account, **When** the user submits the
   transfer, **Then** it is rejected with an actionable message and no state changes.

### User Story 2 - Preserve Atomicity and Currency Boundaries (Priority: P1)

As a personal-finance user, I want transfers to succeed completely or not at all so that my
ledger never loses or duplicates money.

**Independent Test**: Submit insufficient-funds, mismatched-currency, malformed, and
duplicate-account requests, then compare every affected balance and history snapshot.

**Acceptance Scenarios**:

1. **Given** insufficient source funds, **When** the user submits a transfer, **Then** both
   accounts remain unchanged and no transfer history is posted.
2. **Given** COP and USD accounts, **When** the user attempts a cross-currency transfer,
   **Then** it is rejected because no implicit exchange rate exists.
3. **Given** any validation or state failure, **When** the user reviews the ledger, **Then**
   neither side has a partial effect.

### User Story 3 - Review Transfer History (Priority: P2)

As a personal-finance user, I want transfers to remain visible as paired movements so that
I can explain changes in both account balances.

**Independent Test**: Post several transfers and verify the history retains a stable
operation identity and both account effects.

**Acceptance Scenarios**:

1. **Given** a posted transfer, **When** the user reviews either account, **Then** the
   transfer is identifiable as an internal movement rather than income or expense.
2. **Given** several posted transfers, **When** the user reviews history, **Then** each
   operation remains paired and no side can be edited independently.

## Edge Cases

- Source and destination must be different existing asset accounts.
- Both accounts must use the same currency; each amount must use the currency's supported
  precision.
- Amounts must be positive, non-negative balances cannot be overdrawn, and whitespace-only
  descriptions are rejected.
- A transfer must not change income/expense totals or create a credit-card payment event.
- A failed transfer must leave both balances, summaries, and history exactly unchanged.
- Session reset removes transfer state along with the account session.

## Out of Scope

- Cross-currency transfers, exchange rates, fees, rounding policies, and conversion events.
- Transfers involving credit cards; those are handled by `008-card-payments`.
- Scheduled, recurring, imported, remote, or bank-initiated transfers.
- Editing, deleting, reversing, or reconciling posted transfers.
- Browser persistence; retained history belongs to `009-persistence`.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST allow transfers only between two distinct existing asset
  accounts.
- **FR-002**: The source and destination MUST have the same currency.
- **FR-003**: A transfer MUST have one stable operation ID and paired source/destination
  effects with the same exact amount and currency.
- **FR-004**: The system MUST reject zero, negative, malformed, or unsupported-precision
  amounts.
- **FR-005**: The system MUST reject transfers greater than the source available balance.
- **FR-006**: A valid transfer MUST apply both balance effects atomically.
- **FR-007**: A rejected transfer MUST NOT change either account, derived summaries, or
  history.
- **FR-008**: Users MUST be able to identify source, destination, amount, currency, date,
  and description from transfer history.
- **FR-009**: Transfer effects MUST remain distinct from income, expenses, and card payments.
- **FR-010**: The feature MUST remain session-only until the persistence feature is delivered.

### Key Entities

- **Transfer**: One user-visible operation linking a source and destination account.
- **Transfer Leg**: A signed effect belonging to one side of a transfer.
- **Transfer Input**: User-provided source, destination, amount, date, and description.

## Success Criteria

- **SC-001**: Users can complete a valid same-currency transfer in under two minutes.
- **SC-002**: 100% of successful transfers conserve the exact amount across both accounts.
- **SC-003**: 100% of failed transfers leave both sides and history unchanged.
- **SC-004**: At least 25 sequential transfers preserve paired traceability and correct
  balances in one session.
- **SC-005**: 100% of cross-currency attempts are rejected without guessed conversion.
- **SC-006**: Keyboard users receive actionable errors for every rejected transfer path.

## Assumptions

- A transfer is an internal movement and therefore does not count as income or expense.
- Asset-account availability is the source of truth for sufficient-funds validation.
- The account and transaction features provide exact amount parsing and user-visible history
  conventions that this feature extends.
