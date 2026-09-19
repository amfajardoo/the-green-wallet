# Research: Modern Colombian Spanish Visual Experience

## Decision: Preserve the existing CSS-token architecture

**Rationale**: The repository already exposes semantic theme roles such as `--surface`,
`--content`, `--brand`, `--liability`, and `--focus`, plus shared shell styles. Refining those
tokens keeps the visual language consistent across the shell, sidenav, form, summaries, and
account list without introducing a second styling system.

**Alternatives considered**: Adding a new component library or moving the feature to a utility
framework was rejected because it would increase surface area, risk accessibility regressions,
and provide no product value for this focused refresh.

## Decision: Use an editorial-ledger visual direction

**Rationale**: A calm, editorial interface with a forest-and-paper palette, deliberate numeric
typography, strong hierarchy, and restrained texture matches a personal finance product better
than a generic dashboard. It gives users a memorable visual model while keeping numbers and
liability states legible.

**Alternatives considered**: A dense banking dashboard was rejected because the current product
has one focused account journey; a decorative maximalist treatment was rejected because it
could compete with financial meaning and small-screen readability.

## Decision: Author current copy directly in Colombian Spanish

**Rationale**: `010` explicitly precedes runtime internationalization. Directly authored `es-CO`
copy lets the product establish vocabulary such as “cuenta de ahorros”, “efectivo”, “tarjeta de
crédito”, “saldo disponible” and “saldo pendiente” before `011` extracts translation and locale
boundaries.

**Alternatives considered**: Adding translation catalogs now was rejected because it would mix
visual-language work with the separate i18n feature and make copy review less focused.

## Decision: Keep exact money formatting in the existing domain boundary

**Rationale**: `formatMoney()` already formats `bigint` minor units with explicit COP/USD
precision. The visual refresh may improve labels and layout, but it must not move money into
floating-point values or reinterpret a liability as an asset.

**Alternatives considered**: Replacing the formatter with browser locale formatting was rejected
for this feature because it could change precision or introduce a hidden numeric conversion;
locale-aware formatting belongs to `011-internationalization` after exact semantics are stable.

## Decision: Validate responsive and accessible behavior at the spec's five widths

**Rationale**: The current shell has mobile and desktop breakpoints, while the spec requires
explicit checks at 320, 767, 768, 1024, and 1280 CSS pixels. Tasks will treat the breakpoint
boundary, long Spanish labels, focus, reduced motion, and color-independent meaning as first-
class acceptance checks.

**Alternatives considered**: Testing only a desktop viewport was rejected because the product's
navigation and account form change materially on narrow screens.

## Unresolved Questions

None. The feature scope, visual direction, language boundary, money boundary, and validation
widths are defined by the specification and constitution.
