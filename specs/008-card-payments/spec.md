# Feature Specification: Credit-Card Payments

**Feature Branch**: `008-card-payments`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User request to define the next financial feature after transactions and
transfers: paying credit-card liabilities from asset accounts with exact, auditable effects.

## Dependencies

This feature depends on `004-account-setup` for asset and credit-card accounts, `006-transactions`
for posted movement history, and `007-transfers` for same-currency atomic movement rules.

## User Scenarios & Testing

### User Story 1 - Pay a Credit Card (Priority: P1)

As a personal-finance user, I want to pay a credit-card balance from an asset account so
that both my available money and what I owe remain accurate.

**Independent Test**: Create a funded asset account and a credit card with an outstanding
balance, post a valid payment, and verify both balances change by the same exact amount.

**Acceptance Scenarios**:

1. **Given** a funded COP asset account and a COP credit card with an outstanding balance,
   **When** the user submits a valid payment, **Then** the asset available balance decreases,
   the card liability decreases, and one payment event is recorded.
2. **Given** a USD asset and USD credit card, **When** the user pays a valid USD amount,
   **Then** both balances change in USD with supported precision and no COP summary changes.
3. **Given** a successful payment, **When** the user reviews history, **Then** the payment
   identifies its funding account, card account, amount, currency, date, and description.

### User Story 2 - Prevent Invalid or Ambiguous Payments (Priority: P1)

As a personal-finance user, I want invalid card payments rejected before any balance changes
so that the ledger remains trustworthy.

**Independent Test**: Attempt payments with wrong account types, mismatched currencies,
insufficient funds, excessive amounts, and malformed amounts, then compare full state before
and after each attempt.

**Acceptance Scenarios**:

1. **Given** an asset source with insufficient funds, **When** the user submits a payment,
   **Then** it is rejected and neither account changes.
2. **Given** a payment greater than the card outstanding balance, **When** the user submits
   it, **Then** it is rejected rather than creating a negative liability or silent credit.
3. **Given** a card and asset account in different currencies, **When** the user submits a
   payment, **Then** it is rejected because conversion is not implicit.
4. **Given** a savings account selected as the card or a credit card selected as the source,
   **When** the user submits a payment, **Then** it is rejected with an actionable message.

### User Story 3 - Understand Payment History (Priority: P2)

As a personal-finance user, I want card payments distinguished from card purchases and other
transfers so that my liability history remains understandable.

**Independent Test**: Review a card with purchases and payments and verify each operation is
identified by its own type and paired account effects.

**Acceptance Scenarios**:

1. **Given** a card expense and a later payment, **When** the user reviews history, **Then**
   the expense increases liability and the payment reduces it as separate events.
2. **Given** a posted payment, **When** the user reviews either affected account, **Then**
   both sides reference the same payment operation and neither side can be edited alone.

## Edge Cases

- Payment source must be an existing savings, checking, or cash account.
- Payment target must be an existing credit-card account.
- Source and target must be distinct and use the same currency.
- Payment amounts must be positive and use the currency's supported precision.
- A payment cannot exceed source available funds or current card outstanding liability.
- A rejected payment must leave balances, summaries, and history unchanged.
- Payment descriptions containing only whitespace must be rejected and displayed descriptions
  must be trimmed.
- Payments do not include interest, fees, minimum-payment logic, statement periods, or due
  dates in this first slice.

## Out of Scope

- Credit limits, interest, fees, refunds, chargebacks, statement periods, due dates, and
  minimum payments.
- Cross-currency payments, exchange rates, and conversion fees.
- Card purchases themselves beyond consuming the transaction feature's card-expense events.
- Scheduled, recurring, imported, remote, or bank-integrated payments.
- Editing, deleting, reversing, or reconciling posted payments.
- Browser persistence; retained data belongs to `009-persistence`.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST allow payments from asset accounts to credit-card accounts.
- **FR-002**: The source and target MUST be distinct and have the same currency.
- **FR-003**: A payment MUST have one stable operation ID and paired exact effects: source
  availability decreases and card liability decreases.
- **FR-004**: The system MUST reject zero, negative, malformed, or unsupported-precision
  payment amounts.
- **FR-005**: The system MUST reject amounts greater than either source availability or card
  outstanding liability.
- **FR-006**: A valid payment MUST apply both effects atomically.
- **FR-007**: A rejected payment MUST NOT change accounts, summaries, or history.
- **FR-008**: Payment history MUST identify source, card, amount, currency, date, and
  description and distinguish the event from expenses and ordinary transfers.
- **FR-009**: Payment effects MUST preserve the currency separation of all derived summaries.
- **FR-010**: The feature MUST remain session-only until the persistence feature is delivered.

### Key Entities

- **Card Payment**: One posted liability-reduction operation linking an asset source and card.
- **Payment Leg**: A signed effect on the source availability or card liability.
- **Payment Input**: User-provided source, target, amount, date, and description.

## Success Criteria

- **SC-001**: Users can complete a valid card payment in under two minutes.
- **SC-002**: 100% of successful payments reduce source availability and card liability by
  exactly the same amount.
- **SC-003**: 100% of invalid payments leave all state and history unchanged.
- **SC-004**: At least 25 payment events remain correctly paired and traceable in one session.
- **SC-005**: 100% of overpayments and cross-currency attempts are rejected without partial
  financial effects.
- **SC-006**: Keyboard users can identify the source, target, currency, and validation
  feedback without relying on color.

## Assumptions

- The first version rejects overpayments instead of modeling positive card credit.
- A card payment is a distinct operation, not a generic transfer or expense.
- Exact arithmetic and session-state ownership follow the account, transaction, and transfer
  specifications.
