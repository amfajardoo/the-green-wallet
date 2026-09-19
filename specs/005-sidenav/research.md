# Research: Responsive Side Navigation

**Feature**: [Responsive Side Navigation](./spec.md)

**Date**: 2026-08-16

## Decision 1: Use 768px and 1024px as the only responsive boundaries

**Decision**: Define mobile as `320–767px`, tablet as `768–1023px`, and desktop as
`1024px+`, with boundary checks at 767/768 and 1023/1024.

**Rationale**: These boundaries match the project's existing responsive scale and make
the requested tablet/desktop visibility deterministic. CSS pixel width is stable for
layout decisions and avoids device-model assumptions.

**Alternatives considered**:

- Device or user-agent detection — rejected because it is unreliable for resized windows,
  orientation changes, accessibility zoom, and SSR.
- A single mobile/desktop breakpoint — rejected because the feature explicitly requires
  tablet and desktop to share the persistent navigation behavior while retaining separate
  validation widths.
- Additional custom breakpoints — rejected because they would create ambiguous behavior
  without user value in the current single-level shell.

## Decision 2: Use a focused native Angular drawer boundary

**Decision**: Use a focused standalone Angular component with semantic `<nav>` landmarks,
CSS media-query boundaries, a transient signal for the mobile drawer, and a native backdrop.
Use persistent layout from 768px upward and a left-side overlay from 320 through 767px.

**Rationale**: The repository does not use Angular Material and the required interaction is
small enough to keep within the existing standalone Angular shell. Native semantics avoid
introducing a large UI dependency while the component explicitly handles backdrop,
Escape, focus movement, focus restoration, and route selection. CSS determines presentation
from exact viewport boundaries, so SSR does not read browser viewport state.

**Alternatives considered**:

- Persisting the open state — rejected because menu visibility is a temporary interaction
  preference and persistence is out of scope.
- Angular Material/CDK drawer — deferred because it would add a new design-system dependency
for one small shell interaction not otherwise used by the application.
- A global store — rejected because the state belongs to one shell component and has no
  cross-feature business meaning.

## Decision 3: Use one shared destination catalog for both presentations

**Decision**: Define one ordered catalog of approved top-level destinations and render it in
both the persistent and mobile presentations. The account setup route is the first approved
destination; future route features extend the catalog when their destinations are approved.

**Rationale**: One source prevents drift in labels, order, active-state rules, and route
availability. Including only `/accounts` keeps every visible link backed by an implemented
flow while leaving later financial operations out of navigation.

**Alternatives considered**:

- Separate tablet/desktop and mobile lists — rejected because they can expose different
  destinations or accessibility labels.
- Discovering destinations from arbitrary route metadata — deferred because the current
  route list is empty and future route features should explicitly opt into the catalog.
- Adding speculative transaction, transfer, or payment links — rejected because those flows
remain outside the current scope and would create dead links.

## Decision 4: Treat the control as site navigation, not an application menu

**Decision**: Use a named navigation landmark, a real mobile trigger button, and ordinary
navigation links with route-aware active semantics. Do not model the destination list as a
WAI-ARIA application menu.

**Rationale**: These are page-level destinations, so native navigation semantics provide a
more predictable screen-reader and keyboard experience. The trigger still exposes its
expanded state and controls the mobile presentation.

**Alternatives considered**:

- `role="menu"` and `menuitem` semantics — rejected because they imply application-menu
  interaction rules that do not match ordinary site navigation.
- Pointer-only drawer behavior — rejected because keyboard and assistive-technology
  users must be able to complete the same journeys.
- Color-only active styling — rejected because active meaning must remain available to
  users with color-vision differences and non-visual access.

## Decision 5: Validate the responsive contract at six widths

**Decision**: Add automated browser coverage at 320, 767, 768, 1023, 1024, and 1280 CSS
pixels, plus unit coverage for mobile state transitions and focus-related behavior.

**Rationale**: The six widths cover the supported minimum, both sides of each breakpoint,
and a representative wide desktop layout. A future browser-test foundation should
provide isolated contexts and failure evidence.

**Alternatives considered**:

- Validate only 320, 768, and 1280 — rejected because it would not prove the exact
  boundary behavior required by the spec.
- Rely only on manual browser checks — rejected because responsive regressions and
  keyboard behavior need repeatable acceptance coverage.

## Resolved Unknowns

- The project uses Angular 22 standalone components. No feature-specific UI dependency is
  required; browser-runner selection remains a separate repository decision.
- The approved account route is lazy-loaded at `/accounts` and is the initial destination.
- Navigation state is UI-only and does not require storage, remote services, or domain
  entities.

## Decision 6: Keep the feature ready for automated accessibility scans

**Decision**: Keep the feature ready for automated accessibility scans and cover semantic
landmarks, keyboard behavior, focus movement, and active-state structure in component tests.
The repository currently has no browser runner after Playwright removal, so viewport scans
remain a documented follow-up integration rather than a hidden dependency.

**Rationale**: The project constitution requires applicable automated accessibility checks,
and the implementation is structured so a future browser runner can scan all six required
widths without changing the component contract. The current unit coverage still verifies
the high-risk keyboard and focus transitions.

**Alternatives considered**:

- Manual accessibility review only — rejected because it is not repeatable in the feature
  acceptance gate.
- AXE scan at one viewport only — rejected because the mobile drawer and persistent
  sidenav expose different rendered states.
