# Feature Specification: Account Setup and Opening Balances

**Feature Branch**: `004-account-setup`

**Created**: 2026-08-15

**Status**: Draft

**Input**: User description: "Create financial accounts and record their initial balances. Support COP and USD. Keep the feature session-only without localStorage or any other persistence."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create an Account (Priority: P1)

As a personal-finance user, I want to create a financial account with a name, type, and
currency so that I can organize the money I manage.

**Why this priority**: Account creation is the foundation for every later financial
operation and delivers value even when the account starts with a zero balance.

**Independent Test**: Create one valid account, confirm it appears in the account list with
the selected details, and confirm that no other feature is required for the result.

**Acceptance Scenarios**:

1. **Given** the account form is empty, **When** the user enters a valid name, selects
   savings, checking, cash, or credit card, selects COP or USD, and submits, **Then** the
   account appears in the current account list with a zero balance.
2. **Given** an account already exists with a name, **When** the user submits another
   account with the same name and currency, **Then** the submission is rejected and the
   existing account remains unchanged.
3. **Given** the user submits an unsupported or incomplete account type or currency,
   **When** the form is validated, **Then** the account is not created and the user sees
   an actionable validation message.

---

### User Story 2 - Set an Opening Balance (Priority: P1)

As a personal-finance user, I want to provide an opening balance when I create an account
so that the account starts with the amount I currently have or owe.

**Why this priority**: Without an opening balance, the account list cannot represent the
user's current financial position.

**Independent Test**: Create one valid account with a valid opening balance and verify that
the displayed balance matches the entered amount and currency immediately after submission.

**Acceptance Scenarios**:

1. **Given** the user creates a savings, checking, or cash account, **When** they enter a
   valid non-negative opening balance, **Then** the account is created with that balance
   in the selected currency.
2. **Given** the user creates a credit card, **When** they enter a valid non-negative
   opening balance, **Then** the account is created with that amount represented as the
   outstanding card balance.
3. **Given** the opening balance is omitted, **When** the user submits an otherwise valid
   form, **Then** the account is created with a zero balance.
4. **Given** the opening balance is negative, malformed, or has unsupported precision,
   **When** the user submits the form, **Then** the account is not created and the user
   sees a validation message explaining the accepted amount format.

---

### User Story 3 - Review Accounts in the Current Session (Priority: P2)

As a personal-finance user, I want to see the accounts I just created and their balances
so that I can confirm the setup before recording future income, expenses, transfers, or
card payments.

**Why this priority**: Immediate feedback makes account setup verifiable and provides the
starting point for the next financial features.

**Independent Test**: Create multiple accounts in one session and verify that each account
is shown with its name, type, currency, and current balance.

**Acceptance Scenarios**:

1. **Given** multiple accounts exist in the current session, **When** the user views the
   account list, **Then** every account is shown with its name, type, currency, and balance.
2. **Given** the user has created accounts, **When** the browser page is refreshed or the
   application is restarted, **Then** the accounts are no longer available because this
   feature does not persist data.

### Edge Cases

- Account names containing only whitespace MUST be rejected.
- Account names MUST be trimmed before duplicate checking and display.
- Duplicate names with the same currency MUST be rejected; names may be reused for a
  different currency only when the resulting account remains unambiguous to the user.
- The opening balance MUST be non-negative for every supported account type in this
  feature; overdrafts and negative opening positions are deferred.
- The accepted amount precision MUST be consistent with the selected currency and MUST be
  communicated in the validation feedback.
- The user MUST be able to distinguish a credit card's outstanding balance from an asset
  account's available balance.
- Failed validation MUST leave the account list and all previously created accounts
  unchanged.
- Refreshing or restarting the application MUST discard all accounts created by this
  feature.

## Out of Scope

- Persisting accounts or balances in localStorage, IndexedDB, cookies, URL state, a
  backend, or any other storage mechanism.
- Editing, archiving, or deleting accounts after creation.
- Recording later income, expenses, transfers, card purchases, or card payments.
- Credit limits, interest, fees, statement periods, payment due dates, or minimum card
  payments.
- Cross-currency transfers or exchange-rate calculations.
- Authentication, cloud synchronization, bank integrations, budgets, and reporting.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow the user to create an account with a non-empty name,
  one supported account type, and one supported currency.
- **FR-002**: The supported account types MUST be savings account, checking account, cash,
  and credit card.
- **FR-003**: The supported currencies MUST be COP and USD, and every account MUST display
  its selected currency.
- **FR-004**: The system MUST reject a duplicate account name and currency combination
  after trimming and applying case-insensitive comparison.
- **FR-005**: The system MUST allow the user to enter an optional opening balance and MUST
  default an omitted value to zero.
- **FR-006**: The system MUST reject negative, malformed, or unsupported-precision opening
  balances.
- **FR-007**: The system MUST display asset-account opening balances as available balances
  and credit-card opening balances as outstanding liabilities.
- **FR-008**: Creating an account with an opening balance MUST create a traceable opening
  balance event so that the displayed balance has an explainable origin.
- **FR-009**: The system MUST display all accounts created during the active session with
  their name, type, currency, and current balance.
- **FR-010**: A failed submission MUST NOT create a partial account or alter an existing
  account.
- **FR-011**: The system MUST NOT persist data beyond the active application session. It
  MUST NOT use localStorage, IndexedDB, cookies, URL state, a backend, or any other
  persistence mechanism for this feature.
- **FR-012**: The system MUST discard accounts and opening balances when the page is
  refreshed or the application is restarted.
- **FR-013**: The account setup experience MUST provide clear, actionable validation
  feedback for every rejected field or submission.

### Key Entities

- **Account**: A user-defined financial container with a name, account type, currency,
  current balance, and active-session status.
- **Opening Balance**: The initial financial event associated with an account, carrying a
  non-negative amount and the account's currency.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a valid account with or without an opening balance in under
  two minutes.
- **SC-002**: 100% of successfully created accounts appear immediately with the submitted
  name, type, currency, and correct balance.
- **SC-003**: 100% of invalid submissions are rejected without changing existing accounts
  and provide actionable feedback.
- **SC-004**: A user can create and review at least 10 accounts in one active session
  without losing any account or balance before refreshing the page.
- **SC-005**: After a refresh or application restart, 0 accounts from this feature remain
  available.
- **SC-006**: The account setup flow is usable with keyboard navigation and meets the
  project's applicable WCAG 2.2 AA acceptance checks.

## Assumptions

- Each account has exactly one currency; an account cannot hold both COP and USD.
- Account names are unique per currency among accounts created in the active session.
- Opening balances are non-negative in this first slice; overdrafts and negative card
  positions will be defined by a later specification if needed.
- The feature is intended for one user in one active browser session and does not require
  authentication.
- The user-facing language and number-formatting locale will follow the application's
  initial product decision; the financial meaning of COP and USD remains explicit.
- The first implementation will be evaluated through user-visible behavior and domain
  rules; the persistence mechanism is intentionally unspecified because persistence is
  out of scope.
