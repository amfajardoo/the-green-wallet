# Data Model: Modern Colombian Spanish Visual Experience

This feature does not introduce financial entities or change ownership of domain state. The
following presentation-facing concepts describe the data that the existing UI must communicate.

## Visual Language

- **Purpose**: Shared visual contract for surfaces, borders, typography, status, focus, spacing,
  and responsive behavior.
- **Source**: Existing global theme and shell CSS custom properties.
- **Constraints**:
  - Semantic roles must be used instead of raw color values in feature styles.
  - Positive asset meaning and liability meaning must be available through text, structure, or
    iconography in addition to color.
  - Focus and reduced-motion behavior are global quality requirements.

## Colombian Spanish Copy Set

- **Purpose**: Visible labels, descriptions, validation errors, empty states, statuses, and
  footer/navigation text for the current account journey.
- **Source**: Shell, navigation, account page, account form, and account validation messages.
- **Constraints**:
  - Current visible copy is authored in natural Colombian Spanish.
  - Copy must not imply unsupported bank synchronization, credit limits, installments, or tax
    advice.
  - Currency codes remain explicit and product terms remain consistent.

## Account Presentation

- **Purpose**: A read-only presentation of the existing `Account` state.
- **Fields consumed**: `id`, `name`, `type`, `currency`, `balance`, and store-derived summaries.
- **Relationships**:
  - `type` determines whether the account is presented as an asset or credit-card liability.
  - `currency` determines the explicit COP/USD context.
  - The store remains the sole owner of account state.
- **Constraints**:
  - No field is mutated by styling or copy work.
  - Money remains exact and is rendered through the existing money boundary.

## Responsive View

- **Purpose**: The same account flow presented at mobile, tablet, and desktop widths.
- **Required states**: empty workspace, populated workspace, form validation error, successful
  creation, long labels, keyboard focus, and reduced motion.
- **Constraints**: 320px minimum, no feature-caused horizontal overflow, and logical reading and
  focus order at all required widths.
