# Research: Account Setup and Opening Balances

## Decision: Angular Signal Forms with a text amount model

**Rationale**: Angular 22 provides the stable Signal Forms API used by this project guidance.
Native inputs and `[formField]` keep labels, touched state, validation, and keyboard behavior
close to standard HTML. The opening amount stays text until domain parsing so decimal
precision is not lost.

**Alternatives considered**:

- Reactive Forms: valid but not preferred for new forms under the repository guidance.
- A numeric input model: rejected because browser numeric conversion can introduce binary
  floating point and hide unsupported precision.
- Custom input controls: deferred because native controls are sufficient and more accessible.

## Decision: Store is the final validation boundary

**Rationale**: Component validation improves immediate feedback, but duplicate detection and
financial invariants must also hold for every consumer. The store validates before calling
`patchState()` and returns a typed actionable error.

**Alternatives considered**:

- UI-only duplicate validation: rejected because another consumer could bypass it.
- A separate account service cache: rejected because it would compete with the SignalStore.

## Decision: Explicit balance meaning in markup

**Rationale**: Assets and card liabilities have different financial meanings. The list uses
text labels and icons/structure in addition to the themed colors, satisfying the financial
semantics and accessibility requirements.
