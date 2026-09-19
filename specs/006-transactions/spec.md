# Feature Specification: Income and Expense Transactions

**Feature Branch**: `006-transactions`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User request to define the next financial feature after account setup: recording
income and expenses against supported accounts while preserving exact balances and history.

## User Scenarios & Testing

### User Story 1 - Record Income (Priority: P1)

As a personal-finance user, I want to record income in an asset account so that the account
balance reflects money I received.

**Independent Test**: Create an asset account, record valid income in its currency, and
confirm the account balance and transaction history show the same exact amount.

**Acceptance Scenarios**:

1. **Given** an existing savings, checking, or cash account, **When** the user records a
   valid income amount, **Then** the asset balance increases by that amount and one posted
   income transaction is visible.
2. **Given** an income transaction is posted, **When** the user reviews its details, **Then**
   the account, currency, amount, date, and description explain its effect.
3. **Given** an income amount uses unsupported precision or a different currency, **When**
   the user submits it, **Then** the operation is rejected and the account is unchanged.

### User Story 2 - Record an Expense (Priority: P1)

As a personal-finance user, I want to record an expense against an account or credit card so
that my financial history explains where money went.

**Independent Test**: Record valid asset and credit-card expenses and verify the appropriate
available balance or outstanding liability changes without combining currencies.

**Acceptance Scenarios**:

1. **Given** an asset account with enough available balance, **When** the user records a
   valid expense, **Then** the available balance decreases and a posted expense is listed.
2. **Given** a credit-card account, **When** the user records a valid card expense, **Then**
   the outstanding liability increases and the transaction identifies the card account.
3. **Given** an asset account with insufficient available balance, **When** the user records
   an expense, **Then** the operation is rejected without a partial history or balance change.
4. **Given** an expense currency differs from the selected account currency, **When** the
   user submits it, **Then** the operation is rejected because implicit conversion is not
   allowed.

### User Story 3 - Review Transaction History (Priority: P1)

As a personal-finance user, I want to review posted income and expenses so that every balance
change has an understandable origin.

**Independent Test**: Post multiple transactions, review the account history, and verify
that each event has a stable identity and traceable financial effect.

**Acceptance Scenarios**:

1. **Given** multiple posted transactions, **When** the user views history, **Then** each
   item shows operation type, amount, currency, account, date, and description.
2. **Given** a posted transaction, **When** the user refreshes the list or changes screens,
   **Then** the transaction remains part of the active application state until persistence
   is introduced by its own feature.
3. **Given** a rejected transaction, **When** the user reviews history, **Then** no rejected
   or partial event is present.

## Edge Cases

- Amounts must be non-negative and greater than zero for a posted movement.
- COP accepts whole amounts; USD accepts at most two decimal places.
- Asset expenses must not create negative available balances in this first transaction slice.
- Credit-card expenses increase liabilities; they do not reduce asset balances.
- All transaction amounts must match the account currency exactly.
- A failed operation must leave all account balances, history, counts, and summaries unchanged.
- Dates must be captured with a deterministic user-visible date/time and remain explainable.
- Descriptions containing only whitespace must be rejected; display text is trimmed.

## Out of Scope

- Transfers between accounts, credit-card payments, interest, fees, statements, budgets, and
  recurring operations.
- Editing or deleting posted transactions; corrections require a future reversal feature.
- Cross-currency conversion, exchange rates, imports, bank connections, and remote sync.
- Persistence; this feature remains session-only until `009-persistence` is implemented.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST allow income transactions only against existing savings,
  checking, or cash accounts.
- **FR-002**: The system MUST allow expense transactions against asset accounts and credit
  cards, applying the correct available-balance or liability semantics.
- **FR-003**: Every posted transaction MUST have a stable ID, operation type, amount,
  currency, affected account, date, and trimmed description.
- **FR-004**: The system MUST use exact monetary arithmetic and MUST reject negative,
  zero, malformed, or unsupported-precision posted amounts.
- **FR-005**: The transaction currency MUST equal the affected account currency.
- **FR-006**: An asset expense MUST be rejected when it exceeds the account's available
  balance.
- **FR-007**: A valid operation MUST create its history event and balance effect atomically.
- **FR-008**: A rejected operation MUST NOT change accounts, balances, summaries, or history.
- **FR-009**: Posted history MUST be read-only in this feature and MUST remain explainable.
- **FR-010**: The feature MUST remain session-only and MUST NOT add browser persistence.

### Key Entities

- **Transaction**: A posted income or expense with stable identity and explanatory metadata.
- **Transaction Input**: User-provided account, amount, currency, type, date, and description.
- **Account Balance Effect**: The exact signed financial effect applied to an asset balance
  or credit-card liability.

## Success Criteria

- **SC-001**: Users can record a valid income or expense in under two minutes.
- **SC-002**: 100% of valid transactions display the exact submitted amount and currency.
- **SC-003**: 100% of rejected operations leave balances and history unchanged.
- **SC-004**: At least 50 posted transactions remain correctly ordered and traceable in one
  active session.
- **SC-005**: 100% of credit-card expenses increase outstanding liability rather than asset
  availability.
- **SC-006**: Keyboard users can complete the transaction flow and identify validation errors
  without relying on color.

## Assumptions

- Transaction dates default to the current user-local date/time but can be selected before
  posting; future dates are allowed, while invalid dates are rejected.
- The active account state from the account setup and SignalStore features is authoritative.
- A later persistence feature may retain this history, but this feature does not implement it.
