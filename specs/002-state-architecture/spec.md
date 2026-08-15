# Feature Specification: Shared Client State Architecture for Financial Features

**Feature Branch**: `002-state-architecture`

**Created**: 2026-08-15

**Status**: Draft

**Input**: User description: "Define the shared client state architecture for financial accounts and future personal finance features using NgRx SignalStore."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Keep Account Information Consistent (Priority: P1)

As a personal-finance user, I want every screen that displays my accounts to use the same current information so that I can trust the balances and account details I see.

**Why this priority**: Inconsistent account data would undermine the reliability of every future financial feature.

**Independent Test**: Create representative accounts, display them in more than one consumer, and verify that both consumers reflect the same current session state after each valid change.

**Acceptance Scenarios**:

1. **Given** an empty application session, **When** a valid account is created, **Then** every active account consumer can observe the same account and its opening balance.
2. **Given** multiple accounts in the session, **When** a valid account operation completes, **Then** all consumers reflect the resulting state without requiring duplicated manual synchronization.

---

### User Story 2 - See Reliable Derived Information (Priority: P1)

As a personal-finance user, I want account counts and currency-specific balance summaries to update when account data changes so that I can understand my current financial position.

**Why this priority**: Derived information is the basis for dashboards and later transfers, expenses, income, and credit-card payments.

**Independent Test**: Add and reject representative accounts in COP and USD, then verify account counts and each currency's summary after every operation.

**Acceptance Scenarios**:

1. **Given** accounts in COP and USD, **When** a valid account is added, **Then** the count and summary for its currency update while the other currency's summary remains unchanged.
2. **Given** accounts in more than one currency, **When** a summary is displayed, **Then** currencies are not combined into a misleading total without an explicit conversion rule.

---

### User Story 3 - Preserve Valid State After Errors (Priority: P1)

As a personal-finance user, I want invalid account operations to provide actionable feedback without partially changing my session so that my financial information remains trustworthy.

**Why this priority**: Partial or silent state changes are especially risky for financial data.

**Independent Test**: Submit invalid account operations for each supported validation rule and compare the complete state before and after each rejection.

**Acceptance Scenarios**:

1. **Given** a valid current session, **When** an account operation fails validation, **Then** the session state remains unchanged and the user can identify the reason for rejection.
2. **Given** a state transition that is interrupted or fails, **When** the user reviews the account list and summaries, **Then** no partial entity or partial balance is visible.

---

### User Story 4 - Extend Financial Features Predictably (Priority: P2)

As a maintainer, I want a clear shared-state boundary and consistent transition rules so that future financial features can extend the application without creating competing sources of truth.

**Why this priority**: The product roadmap includes transactions, transfers, and credit-card payments that will depend on consistent state ownership.

**Independent Test**: Review the account state contract and add a representative read-only consumer and a representative valid state operation without duplicating the account collection in either consumer.

**Acceptance Scenarios**:

1. **Given** a new consumer of account data, **When** it reads the public state contract, **Then** it does not need to maintain a second shared copy of accounts.
2. **Given** a future financial domain needs to add shared state, **When** its boundaries are reviewed, **Then** its state ownership, derived values, errors, and transition rules can be identified independently.

### Edge Cases

- The initial state must be empty and usable before any account is created.
- Duplicate account names must be evaluated using the account specification's normalization and currency rules.
- COP and USD summaries must remain separate; no exchange-rate assumption is allowed in this foundation.
- A rejected operation must not change entity count, account details, or any derived summary.
- Refreshing or restarting the application must discard the session because persistence is out of scope.
- A consumer must not observe a half-applied operation while a valid transition is being processed.
- Future asynchronous boundaries must expose loading and error outcomes without making current in-memory account creation dependent on a remote service.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST maintain one authoritative shared client state for accounts used by multiple consumers during the current session.
- **FR-002**: Each account MUST have a stable identity and its account details MUST be represented only once in the shared account collection.
- **FR-003**: Shared account changes MUST occur through explicit validated operations that apply complete immutable state transitions.
- **FR-004**: The state model MUST expose derived account counts and balance summaries separately for COP and USD.
- **FR-005**: Derived values MUST update whenever their source account state changes and MUST NOT require consumers to recalculate them independently.
- **FR-006**: Invalid operations MUST return an actionable error outcome and MUST leave the complete prior state unchanged.
- **FR-007**: The state model MUST provide a deterministic empty initial state and a way for tests or session boundaries to start from that state.
- **FR-008**: Application consumers MUST use the shared state contract for account data and MUST NOT maintain competing shared copies of the account collection.
- **FR-009**: The state boundary MUST distinguish current-session client state from future persistence, server, URL, or authentication state.
- **FR-010**: The architecture MUST support explicit loading and error outcomes for future asynchronous financial operations without requiring them for current in-memory account creation.
- **FR-011**: Account state transitions and derived values MUST be testable independently from rendered interface components.
- **FR-012**: The architecture MUST preserve the account specification's distinction between asset accounts and credit-card liabilities.
- **FR-013**: The architecture MUST not combine balances from different currencies unless a future feature explicitly defines conversion rules.

### Architectural Boundaries

- Shared cross-component state will use NgRx SignalStore as the project's approved state-management mechanism.
- The account collection will use the SignalStore entity-oriented approach rather than an unstructured shared array.
- State updates will be performed through immutable store methods; direct mutation by consumers is not allowed.
- Derived values belong in the state layer, while transient presentation-only state remains local to the consuming component.
- RxJS-based asynchronous work will be introduced only at an explicit asynchronous boundary and will not be used to add artificial complexity to synchronous in-memory operations.
- Low-level store composition, file layout, and exact public method names will be defined during planning.

### Key Entities *(include if feature involves data)*

- **Account State**: The current-session collection of financial accounts and its validation or operation outcomes.
- **Account Entity**: A uniquely identified savings, checking, cash, or credit-card account with currency and opening-balance information.
- **Derived Account Summary**: A read-only value calculated from current account state, kept separate by currency and account meaning.
- **State Operation Outcome**: The success or actionable failure result of a requested state transition.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of representative account consumers display the same account details and opening balances after each valid operation in the session.
- **SC-002**: 100% of tested invalid operations leave entity count, account details, and derived summaries unchanged.
- **SC-003**: COP and USD summaries remain separated in 100% of representative multi-currency scenarios.
- **SC-004**: A new read-only account consumer can be added without introducing a second shared account collection or manual synchronization path.
- **SC-005**: The account state foundation supports at least 10 simultaneous accounts in a session while keeping all tested derived summaries correct.
- **SC-006**: State-transition and derived-value tests can run independently from browser rendering and cover the initial, valid, and invalid operation paths.

## Assumptions

- The application remains local-first and session-only for this phase; no persistence, backend, authentication, or cross-device synchronization is included.
- The account domain is the first consumer of the shared state architecture; transactions, transfers, income, expenses, and credit-card payments will be added in later specs.
- The existing account setup specification is the source of truth for account types, currencies, opening balances, and validation behavior.
- NgRx SignalStore is already an approved project dependency and its detailed composition will be finalized in the plan.
- The first version does not need server caching, optimistic synchronization, or conflict resolution.
