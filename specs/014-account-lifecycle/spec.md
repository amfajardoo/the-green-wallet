# Feature Specification: Safe Account Lifecycle and Archival

**Feature Branch**: `014-account-lifecycle`

**Created**: 2026-09-19

**Status**: Draft

**Input**: Product proposal to let users maintain account metadata and stop using obsolete
accounts without deleting financial history or corrupting balances.

## User Scenarios & Testing

### User Story 1 - Maintain Account Information (Priority: P1)

As a user, I want to correct an account's display information so that my workspace remains
understandable as my real accounts change names.

**Independent Test**: Create an account, update only supported display information, and verify
that the account remains the same financial entity with unchanged currency and balance effects.

**Acceptance Scenarios**:

1. **Given** an account exists, **When** the user edits its supported display information,
   **Then** the updated value appears everywhere the account is labelled.
2. **Given** an account has posted operations, **When** its display name changes, **Then**
   historical entries remain linked to the same stable account identity.
3. **Given** the user attempts to change a financial property that would reinterpret existing
   operations, **When** they submit the edit, **Then** the product rejects it with a clear
   explanation and offers a safe alternative.

### User Story 2 - Stop Using an Account Safely (Priority: P1)

As a user, I want to archive an account instead of deleting it so that it no longer appears as
an option for new movements while its history remains trustworthy.

**Independent Test**: Archive an account with history, verify it is excluded from new-operation
choices, and verify its balance effects and historical entries remain available for review.

**Acceptance Scenarios**:

1. **Given** an asset account is no longer used and has no blocking liability, **When** the
   user archives it, **Then** it leaves the active account list without changing any balance
   or posted operation.
2. **Given** an archived account exists, **When** the user reviews history, **Then** entries
   identify the archived account and remain readable.
3. **Given** an archived account is selected for a new transaction, transfer, or card payment,
   **When** the operation is submitted, **Then** the product rejects the archived account and
   explains how to restore it if appropriate.
4. **Given** a credit-card account has an outstanding liability, **When** the user tries to
   archive it, **Then** the product blocks the action and explains that the liability must be
   resolved first.

### User Story 3 - Restore an Archived Account Deliberately (Priority: P2)

As a user, I want to restore an archived account when I need it again so that I can resume
supported operations without creating a duplicate by mistake.

**Independent Test**: Archive and restore an account, then verify that it returns with the same
identity, currency, balance effects, and history.

**Acceptance Scenarios**:

1. **Given** an archived account has no active naming conflict, **When** the user restores it,
   **Then** it returns to the active list and becomes eligible for supported new operations.
2. **Given** restoring an account would create an ambiguous active duplicate, **When** the user
   attempts restoration, **Then** the product blocks it and explains the conflict without
   changing either account.
3. **Given** an archived account has history, **When** it is restored, **Then** its history and
   stable identity remain continuous.

## Edge Cases

- An account with a non-zero credit-card liability must not be archived and hidden from the
  user's financial context.
- A zero-balance account with history must remain reviewable after archival.
- Archiving must not reduce available assets, reduce liabilities, or create a compensating
  operation.
- A long edited name must remain readable in navigation, summaries, forms, and history.
- An archived account must not be silently selected as a default for a new operation.
- A restored account must not silently overwrite or merge with another account.
- Session-only lifecycle changes must remain coherent before persistence is available.

## Out of Scope

- Permanent deletion of accounts or their operations.
- Editing currency, account kind, balance, or historical effects after operations exist.
- Account reconciliation, bank synchronization, authentication, sharing, or multi-user access.
- Merging accounts, changing account identity, or moving history between accounts.
- Interest, credit limits, installments, fees, or debt advice.
- Remote persistence; local persistence integration remains part of `009-persistence`.

## Requirements

### Functional Requirements

- **FR-001**: The product MUST distinguish active and archived account lifecycle states.
- **FR-002**: Users MUST be able to edit only supported display information without changing
  account identity, currency, kind, balance, or historical effects.
- **FR-003**: Account identity MUST remain stable across display-name edits, archival, and
  restoration.
- **FR-004**: Archival MUST NOT delete history, mutate balances, create compensating operations,
  or remove an account's currency context.
- **FR-005**: Archived accounts MUST be excluded from new transaction, transfer, and card-payment
  selection until explicitly restored.
- **FR-006**: A credit-card account with a non-zero outstanding liability MUST NOT be archivable.
- **FR-007**: Asset accounts with history MAY be archived when no product rule blocks them, and
  their historical entries MUST remain reviewable.
- **FR-008**: Users MUST be able to review archived accounts separately from active accounts.
- **FR-009**: Users MUST be able to restore an archived account when doing so does not create an
  ambiguous active account conflict.
- **FR-010**: Restoration MUST preserve the account's stable identity, currency, kind, balance
  effects, and historical relationships.
- **FR-011**: Lifecycle errors and confirmations MUST use clear Colombian Spanish and MUST not
  imply that archival is deletion.
- **FR-012**: Lifecycle controls MUST meet the responsive, keyboard, focus, and WCAG AA rules
  established by `010-visual-refresh-esco`.
- **FR-013**: Lifecycle behavior MUST work in session state and MUST be compatible with the
  versioned local persistence rules defined by `009-persistence`.

### Key Entities

- **Account Lifecycle State**: The active or archived availability state of an account.
- **Account Display Information**: User-facing account labels that may change without changing
  financial identity.
- **Stable Account Identity**: The enduring relationship used by operations and history.
- **Archive Constraint**: A financial or naming rule that prevents an unsafe lifecycle action.

## Dependencies

- `004-account-setup` defines account identity, kind, currency, and initial creation rules.
- `006-transactions` defines operation effects that archival MUST preserve.
- `007-transfers` and `008-card-payments` define account-selection constraints.
- `010-visual-refresh-esco` defines Colombian Spanish, responsive, and accessibility rules.
- `013-ledger-history` consumes archived-account relationships for review.
- `009-persistence` defines how lifecycle changes are restored and versioned later.

## Success Criteria

- **SC-001**: 100% of tested archival and restoration flows preserve account identity, currency,
  balance effects, and historical relationships.
- **SC-002**: No archived account is offered as a valid new-operation selection in the full
  acceptance suite.
- **SC-003**: Every attempted unsafe archive or ambiguous restore is blocked with an actionable
  Colombian Spanish explanation and no state mutation.
- **SC-004**: Users can distinguish active, archived, and blocked states without relying on
  color alone in accessibility review.
- **SC-005**: Lifecycle changes remain correct after a persistence round trip once `009`
  exists, with zero historical operations lost or duplicated.
- **SC-006**: Keyboard, focus, responsive, long-name, and empty-archived-list checks pass
  without loss of functionality or horizontal overflow.

## Assumptions

- “Archive” is the only supported way to stop using an account; deletion is intentionally not
  part of the product model.
- A credit-card liability is considered blocking while its outstanding amount is non-zero.
- Display-name edits are safe because operation relationships use stable account identity.
- Product copy uses Colombian terms such as “archivar”, “restaurar”, “saldo disponible”, and
  “saldo pendiente” rather than implying deletion or bank synchronization.
