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

## Decision 2: Use Angular Material/CDK for drawer behavior and responsive mode

**Decision**: Use Angular Material's `mat-sidenav`/drawer primitives for the navigation
container. Use `side` mode from 768px upward and `over` mode with a left/start drawer and
backdrop from 320 through 767px. Use CDK `BreakpointObserver` to switch modes and close
the mobile drawer when the viewport enters the persistent range.

**Rationale**: The existing Angular Material drawer implementation provides the behavior
needed for this feature: over/side modes, backdrop handling, Escape closing, open/close
events, and focus behavior. CDK layout provides a standard media-query observer so the
component can reconcile mode changes without device or user-agent detection. The menu
state remains local and transient, and no application route or persistence is introduced.

**Primary references**: [Angular Material Sidenav](https://material.angular.dev/components/sidenav/overview)
and [Angular CDK Layout](https://material.angular.dev/cdk/layout/overview).

**Alternatives considered**:

- Persisting the open state — rejected because menu visibility is a temporary interaction
  preference and persistence is out of scope.
- A custom drawer with hand-written backdrop, Escape, and focus management — rejected
  because it duplicates mature accessibility and interaction behavior already provided by
  the project's Angular ecosystem.
- A global store — rejected because the state belongs to one shell component and has no
  cross-feature business meaning.

## Decision 3: Use one shared destination catalog for both presentations

**Decision**: Define an empty-by-default ordered catalog of available top-level
destinations and render it in both the persistent and mobile presentations. Future route
features extend the catalog when their destinations are approved.

**Rationale**: One source prevents drift in labels, order, active-state rules, and route
availability. Keeping it empty initially honors the current route boundary and prevents
dead links while still establishing the reusable shell contract.

**Alternatives considered**:

- Separate tablet/desktop and mobile lists — rejected because they can expose different
  destinations or accessibility labels.
- Discovering destinations from arbitrary route metadata — deferred because the current
  route list is empty and future route features should explicitly opt into the catalog.
- Adding speculative account and transaction links — rejected because those flows belong
  to their own specifications and would create dead links.

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

- The project uses Angular 22 standalone components. Angular Material/CDK and an
  accessibility-scanning integration are the only feature-specific dependencies required;
  browser-runner selection remains a separate repository decision.
- There are currently no configured application routes, so the destination catalog starts
  empty and `src/app/app.routes.ts` remains unchanged.
- Navigation state is UI-only and does not require storage, remote services, or domain
  entities.

## Decision 6: Add automated AXE coverage to the feature browser journeys

**Decision**: Add automated accessibility scans to the feature-owned browser journey and
scan the rendered sidenav at all six required viewport widths. The feature passes only
when no serious or critical violations remain; the concrete integration will follow the
repository's selected browser-test runner.

**Rationale**: The project constitution requires applicable automated accessibility
checks, and the sidenav changes a global navigation landmark, drawer, focus order, and
backdrop behavior. Keyboard assertions alone are not sufficient to detect all structural
or ARIA issues.

**Alternatives considered**:

- Manual accessibility review only — rejected because it is not repeatable in the feature
  acceptance gate.
- AXE scan at one viewport only — rejected because the mobile drawer and persistent
  sidenav expose different rendered states.
