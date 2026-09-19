# Feature Specification: Currency-Safe Financial Dashboard

**Feature Branch**: `012-dashboard-overview`

**Created**: 2026-09-19

**Status**: Draft

**Input**: Product proposal to give users a useful overview of their financial position and
recent activity after account setup, without introducing exchange rates, forecasting, or
cross-currency totals.

## User Scenarios & Testing

### User Story 1 - Understand Available Money by Currency (Priority: P1)

As a personal-finance user, I want to see my available assets and card liabilities grouped
by currency so that I can understand my position without mistaking COP and USD for one total.

**Independent Test**: Seed asset and credit-card accounts in COP and USD, open the dashboard,
and verify that each summary is labelled by currency and reconciles with the authoritative
account state.

**Acceptance Scenarios**:

1. **Given** the user has COP assets, **When** they open the dashboard, **Then** the COP
   available summary is visible with an explicit `COP` label.
2. **Given** the user has USD assets or liabilities, **When** they open the dashboard, **Then**
   USD values appear in a separate currency context with the appropriate decimal precision.
3. **Given** the user has more than one currency, **When** the dashboard is rendered, **Then**
   it does not display a combined net worth, converted balance, or unlabeled grand total.

### User Story 2 - See Recent Financial Activity (Priority: P1)

As a user, I want a concise view of my latest account activity so that I can quickly confirm
what changed without opening every account.

**Independent Test**: Create representative income, expense, transfer, and card-payment
events, then verify that the dashboard shows the latest entries with their operation type,
accounts, amount, currency, and date.

**Acceptance Scenarios**:

1. **Given** financial activity exists, **When** the user opens the dashboard, **Then** the
   latest entries are ordered from newest to oldest and display enough context to identify
   each operation.
2. **Given** a transfer or card payment has two linked sides, **When** it appears in recent
   activity, **Then** the relationship is understandable and the operation is not presented
   as two unrelated user actions.
3. **Given** no activity exists, **When** the user opens the dashboard, **Then** an empty
   state explains that movements will appear after the first operation and offers the next
   supported action.

### User Story 3 - Continue to a Safe Next Action (Priority: P2)

As a user, I want the dashboard to guide me to supported next actions so that the overview is
useful without promising features that do not exist yet.

**Independent Test**: Exercise the empty, populated, and mixed-currency states and verify that
each primary action leads to an available product flow with no dead-end or speculative action.

**Acceptance Scenarios**:

1. **Given** no accounts exist, **When** the user visits the dashboard, **Then** the primary
   action takes them to account creation.
2. **Given** accounts exist but no movements exist, **When** the user views the dashboard,
   **Then** the guidance points to the next implemented movement flow.
3. **Given** a summary or recent item is selected, **When** the user activates it by keyboard
   or pointer, **Then** focus and navigation lead to the corresponding account or history
   context.

## Edge Cases

- A currency with no accounts must not appear as a zero-valued summary unless the product
  explicitly explains why it is shown.
- Very large COP amounts and USD amounts with cents must remain readable without truncation.
- A credit-card liability must not be described as available money or blended into asset
  availability.
- A transfer must not inflate activity counts or summaries by treating its two sides as two
  independent user operations.
- A dashboard with only archived accounts must explain the state and provide a supported
  route to review or restore them once account lifecycle exists.
- Session-only operation must work when persistence is unavailable or has not been built yet.

## Out of Scope

- Exchange rates, currency conversion, cross-currency net worth, or a combined total.
- Budgets, forecasts, savings goals, investment performance, financial advice, or AI insights.
- Editing, deleting, reversing, or exporting financial operations.
- Remote synchronization, bank connections, authentication, or multi-user dashboards.
- Replacing the authoritative account, transaction, transfer, or card-payment domain rules.

## Requirements

### Functional Requirements

- **FR-001**: The dashboard MUST present asset availability and card liabilities in separate,
  explicit currency contexts.
- **FR-002**: Every monetary value MUST include its currency code or an unambiguous adjacent
  currency label; COP and USD MUST retain their defined monetary precision.
- **FR-003**: The dashboard MUST NOT calculate or display a cross-currency combined total,
  exchange-rate conversion, or implied net worth.
- **FR-004**: Summary values MUST reconcile with the authoritative account and operation state
  and MUST update when supported operations change that state.
- **FR-005**: Recent activity MUST be ordered newest first and MUST expose operation type,
  involved account context, amount, currency, and date.
- **FR-006**: Linked transfer and card-payment sides MUST be represented as one coherent
  operation for overview purposes while retaining their account effects.
- **FR-007**: Empty, loading, unavailable, and error states MUST explain the current state in
  Colombian Spanish and provide only supported next actions.
- **FR-008**: The dashboard MUST remain usable at the responsive widths and accessibility
  standards established by `010-visual-refresh-esco`.
- **FR-009**: Keyboard users MUST be able to reach summaries, recent activity, and primary
  actions in a logical order with visible focus and meaningful names.
- **FR-010**: The dashboard MUST work with session-only state and MUST NOT require persistence
  or remote services to render a valid overview.

### Key Entities

- **Currency Summary**: A labelled, currency-specific view of available assets or card
  liabilities.
- **Recent Activity Item**: A user-facing representation of one posted financial operation
  with its linked account context.
- **Dashboard State**: The combination of summaries, recent activity, empty state, and
  supported next actions for the current session.

## Dependencies

- `006-transactions` supplies income and expense effects.
- `007-transfers` supplies linked asset-to-asset movements.
- `008-card-payments` supplies linked asset-to-card-liability payments.
- `010-visual-refresh-esco` supplies Colombian Spanish, responsive, and accessibility rules.
- `009-persistence` is optional for the first dashboard implementation; the dashboard MUST
  remain valid before persistence exists.

## Success Criteria

- **SC-001**: Users can identify available money by currency and distinguish card liability
  within five seconds in representative dashboard states.
- **SC-002**: 100% of dashboard monetary values in acceptance tests have an explicit currency
  context and no test displays a mixed-currency total.
- **SC-003**: Dashboard summaries match authoritative state for at least 50 representative
  operations, including transfers and card payments.
- **SC-004**: Users can identify the latest operation and its affected accounts without
  navigating to a second screen in at least 95% of usability checks.
- **SC-005**: Empty, mixed-currency, large-value, keyboard, and reduced-motion checks pass
  without loss of task completion or horizontal overflow.

## Assumptions

- COP is the primary Colombian context and USD remains explicitly supported, but no exchange
  relationship is assumed.
- The dashboard is an overview, not a new source of financial truth.
- History and account lifecycle may expose richer navigation after their respective features
  are implemented.
