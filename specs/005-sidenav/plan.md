# Implementation Plan: Responsive Side Navigation

**Branch**: `005-sidenav` | **Date**: 2026-08-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-sidenav/spec.md`

## Summary

Add a reusable application-shell side navigation with one shared catalog of available
top-level destinations. The navigation remains visible from 768 CSS pixels upward and
uses a closed-by-default mobile presentation from 320 through 767 CSS pixels. The
responsive presentation is determined by CSS media-query boundaries, while the mobile
open/closed state remains local, transient component state so server rendering and
hydration do not depend on browser viewport reads or persisted preferences.

The initial repository has no configured application routes, so this feature will not
invent business destinations or dead links. The shell will expose only destinations that
are already available, with the catalog designed for later approved routes to reuse.

## Technical Context

**Language/Version**: TypeScript 6.0.2, Angular 22.1.x, CSS

**Primary Dependencies**: Angular core and router, Angular Material/CDK aligned with the
Angular 22 toolchain, Tailwind CSS 4.1.12 with the existing PostCSS integration, Vitest
through the Angular test runner, and a future browser-test foundation with automated
accessibility scans.

**Storage**: N/A. Navigation state is transient UI state and is not persisted.

**Testing**: Vitest unit tests, feature-owned browser viewport and keyboard journeys,
automated accessibility scans, Angular SSR build validation, and `pnpm check` scoped to
`src/`.

**Target Platform**: Angular SSR web application with browser hydration, supporting
viewports from 320 CSS pixels through desktop widths.

**Project Type**: Standalone Angular web application with a shared application shell.

**Performance Goals**: Opening, closing, and selecting a navigation destination must be
immediate from the user's perspective and must not require a network request or block the
initial page render.

**Constraints**: WCAG 2.2 AA, keyboard and assistive-technology operation, visible focus,
reduced-motion compatibility, exact responsive boundaries at 767/768 and 1023/1024 CSS
pixels, SSR-safe initial rendering, no viewport-dependent user-agent detection, no
persistence, no remote service, no financial-domain mutation, and zero serious or critical
AXE violations in the feature journeys.

**Scale/Scope**: One primary, single-level navigation region in the application shell,
one shared destination catalog, one mobile menu state, and the current set of approved
top-level routes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I — Financial Integrity**: PASS. The feature changes navigation access only
  and does not create, update, or derive financial events or balances.
- **Principle II — Domain and Currency Semantics**: PASS. No account, currency, or
  financial operation is introduced.
- **Principle III — Financial History**: PASS. No posted movement or history is changed.
- **Principle IV — Local-First Privacy**: PASS. The mobile menu state is local and
  transient; no persistence, authentication, remote service, or sensitive data is added.
- **Principle V — Small, Accessible, and Testable Delivery**: PASS. The design uses a
  focused shell feature, semantic navigation, keyboard/focus requirements, standalone
  Angular structure, signals for local state, and build/test/Biome gates.

No constitution violations require a complexity exception.

## Project Structure

### Documentation (this feature)

```text
specs/005-sidenav/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── app.ts                 # Application shell composition
│   ├── app.html               # Shell layout and router outlet placement
│   ├── app.css                # Shell-level layout styles where needed
│   └── navigation/
│       ├── navigation.types.ts
│       ├── navigation.config.ts
│       ├── sidenav.component.ts
│       ├── sidenav.component.html
│       ├── sidenav.component.css
│       └── sidenav.component.spec.ts
├── app.spec.ts                # Existing shell regression coverage
└── styles.css                 # Existing global Tailwind entry point

browser/
└── sidenav.spec.ts            # Responsive, keyboard, and navigation journeys
```

**Structure Decision**: Use the existing single Angular application and place the
navigation feature under `src/app/navigation/` as a focused standalone component plus an
empty-by-default destination catalog. The root application shell owns layout composition
and the router outlet; the navigation component owns Material drawer mode, transient
mobile state, and focus behavior. Angular Material/CDK supplies the drawer, backdrop,
Escape handling, and responsive media-query observation. No application routes, backend,
storage, contracts directory, or financial domain service is added by this feature.

## Design Decisions

### Responsive presentation

- **Mobile (`320–767px`)**: render the menu control and keep the navigation closed and
  out of the visual and keyboard flow by default. When open, show the same destination
  catalog in a left-side Angular Material drawer using `over` mode with a backdrop.
- **Tablet (`768–1023px`)**: render the navigation persistently beside the page content;
  use `side` mode and do not require or show the mobile menu control for the primary
  navigation.
- **Desktop (`1024px+`)**: render the same persistent navigation with the desktop shell
  spacing and content region using `side` mode. A compact or user-collapsible desktop
  mode is not part of this feature.

The breakpoint behavior uses the exact 768px and 1024px media-query boundaries. The
Angular CDK `BreakpointObserver` changes the Material drawer mode after the browser is
available, while the server-rendered shell starts from a deterministic non-persisted
state. The observer is responsible for closing the mobile drawer when the layout crosses
into tablet or desktop mode.

### Navigation catalog and routing

`navigation.config.ts` will define one ordered catalog of available destinations. The
initial catalog is empty because `src/app/app.routes.ts` has no defined routes; this
feature MUST NOT create a shell route or speculative financial links. Future approved
route features will add destinations to the catalog as part of their own implementation.
Each entry has a stable identifier, user-facing label, and target recognized by the
application. The persistent and mobile presentations consume that same catalog so labels,
order, availability, and active-state behavior cannot diverge.

When the catalog is empty, the navigation shell remains valid but renders no actionable
destination and no active destination.

### Interaction and accessibility

- Use Angular Material's sidenav/drawer primitives with a left/start position, `over`
  mode and backdrop on mobile, and `side` mode on tablet and desktop. Keep automatic
  backdrop and Escape closing enabled.
- Use a semantic navigation landmark with an accessible name and ordinary navigation
  links rather than application-menu semantics for the site-level destination list.
- Use a real button for the mobile trigger, expose `aria-expanded` and `aria-controls`,
  and keep the trigger's visible focus indicator available.
- Configure the Material drawer to move focus into the open mobile drawer; explicitly
  restore focus to the opening trigger after Escape, backdrop, or close-button dismissal
  when navigation has not changed the page.
- Mark the current destination with route-aware semantics and a non-color visual cue.
- Ensure closed mobile links are not reachable by keyboard or assistive technology.
- Respect reduced-motion preferences and avoid making successful navigation depend on an
  animation finishing.

### State and SSR boundary

The component keeps only the Material drawer mode, a boolean mobile-open signal, and a
reference to the opening trigger needed for focus restoration. `BreakpointObserver`
reconciles the mode and closes the mobile drawer when the viewport crosses 768px. The
state is not persisted, included in URL state, sent remotely, or mixed with account state.
The server-rendered shell starts deterministically and the observer updates the mode after
the browser can receive input.

## Implementation Sequence

1. Add Angular Material/CDK and an accessibility-scanning integration compatible with
   the selected browser-test runner, without adding application routes.
2. Define the navigation destination type and empty-by-default catalog.
3. Create the standalone Material sidenav component and compose it into the application
   shell, preserving the existing router outlet and SSR entry points.
4. Configure `BreakpointObserver` for 768px and 1024px, mapping mobile to Material
   `over` mode and tablet/desktop to `side` mode.
5. Add the mobile trigger, transient drawer state, Material backdrop/Escape behavior,
   focus movement, focus restoration, and responsive state reconciliation.
6. Add route-aware active-state semantics for future catalog entries and ensure both
   presentations consume the same catalog, including the empty-catalog behavior.
7. Add unit, browser, keyboard, and automated accessibility coverage at 320, 767, 768,
   1023, 1024, and 1280 CSS pixels.
8. Run the quickstart validation, Angular build, unit tests, scoped Biome check, automated
   accessibility checks, and browser journeys; reconcile the artifacts before implementation is
   considered complete.

## Validation Matrix

| Viewport | Expected presentation | Required checks |
|---|---|---|
| 320px | Closed mobile drawer | Trigger visible, drawer hidden, no horizontal scroll |
| 767px | Closed mobile drawer | Mobile boundary remains active |
| 768px | Persistent tablet sidenav | Material `side` mode, mobile trigger not required |
| 1023px | Persistent tablet sidenav | Long labels and content fit without obstruction |
| 1024px | Persistent desktop sidenav | Material `side` mode, desktop boundary active |
| 1280px | Persistent desktop sidenav | Navigation and content layout remain stable |

## Dependency and Scope Notes

- The visual treatment should consume the semantic roles defined by `001-ui-theming`
  when that feature is implemented; this feature does not create a second token system.
- A future browser-test foundation provides the runner; this feature adds its own
  feature-owned browser journeys and accessibility scans.
- Account setup and future financial routes remain owned by their own specifications.
- No contracts are generated because the feature has no external API, persistence
  boundary, or inter-process interface. `src/app/app.routes.ts` remains unchanged.

## Post-Design Constitution Re-check

| Principle | Post-design result |
|---|---|
| I. Financial Integrity | PASS — the design contains no financial writes, calculations, or balance changes. |
| II. Domain and Currency Semantics | PASS — navigation does not introduce account, currency, or operation semantics. |
| III. Financial History | PASS — no financial history is created, edited, or deleted. |
| IV. Local-First Privacy | PASS — menu state is transient and no remote or persistent data path is added. |
| V. Small, Accessible, and Testable Delivery | PASS — the design is focused, keyboard-accessible, SSR-safe, and covered by unit/browser/build/Biome validation. |

No new violations were introduced during research or design.

## Complexity Tracking

No constitution violations or additional architectural complexity are required.
