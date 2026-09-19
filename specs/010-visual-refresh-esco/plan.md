# Implementation Plan: Modern Colombian Spanish Visual Experience

**Branch**: `010-visual-refresh-esco` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-visual-refresh-esco/spec.md`

## Summary

Refresh the current account workspace and application shell into a polished editorial-ledger
experience for Colombian users. The implementation will preserve the existing account store,
exact money model, routes, and session-only behavior while replacing remaining English copy,
strengthening visual hierarchy, and validating responsive and accessible states at the five
required viewport widths.

The technical approach is a focused refinement of the current Angular standalone application:
shared CSS custom properties remain the visual contract, shell and account-page styles own
layout, and the account component owns only presentation copy and state labels. No new UI
framework, persistence layer, financial calculation, or runtime translation system is needed
for this feature.

## Technical Context

**Language/Version**: TypeScript 6.0, Angular 22.1

**Primary Dependencies**: Angular standalone components, Signal Forms, NgRx SignalStore,
CSS custom properties, Biome 2.5

**Storage**: None for this feature; session-only in-memory store remains unchanged

**Testing**: Angular test runner with Vitest and jsdom; build/SSR smoke check; Biome checks

**Target Platform**: Responsive browser UI with Angular SSR and hydration support

**Project Type**: Single Angular web application

**Performance Goals**: No new runtime work on financial state; preserve fast first render and
avoid layout shift while visual states load

**Constraints**: WCAG 2.2 AA, keyboard access, visible focus, reduced motion, 320px minimum
viewport, no horizontal overflow, explicit COP/USD context, no browser-only APIs

**Scale/Scope**: Current shell, sidenav, account creation form, account summary, account list,
empty/error/success states, and their existing unit/component tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Result | Evidence / plan constraint |
|---|---|---|
| Financial integrity | PASS | Presentation-only change; no account store or money transformation changes. |
| Explicit domain semantics | PASS | Keep account type, COP/USD labels, liability wording, and exact formatting intact. |
| Auditability | PASS | No posted movement or account history exists in this scope; no destructive action added. |
| Local-first privacy | PASS | No persistence, network, authentication, or external service introduced. |
| Small, accessible, testable delivery | PASS | Reuse standalone Angular components, add copy/responsive/accessibility coverage, and run tests, build, and Biome. |

## Project Structure

### Documentation (this feature)

```text
specs/010-visual-refresh-esco/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── app.html                # Application shell copy and landmarks
│   ├── app.css                 # Shell host styles
│   ├── core/accounts/          # Existing financial state; unchanged by this feature
│   ├── features/accounts/
│   │   ├── account-page.ts     # Spanish labels and presentation helpers
│   │   ├── account-page.html   # Semantic account flow markup and copy
│   │   ├── account-page.css    # Account layout and responsive states
│   │   └── account-page.spec.ts
│   └── navigation/
│       ├── navigation.config.ts
│       ├── sidenav.component.html
│       ├── sidenav.component.css
│       └── sidenav.component.spec.ts
├── styles.css                  # Global reset, focus, motion, and base typography
└── styles/
    ├── theme.css               # Semantic palette, typography, and shared tokens
    └── shell.css               # Shared shell layout and responsive presentation
```

**Structure Decision**: Keep the existing single Angular application structure. Shared theme
and shell concerns stay in `src/styles` and app-level files; account-flow copy and layout stay
in `src/app/features/accounts`; navigation labels stay in `src/app/navigation`. Financial state
files under `src/app/core/accounts` are dependencies, not targets for visual refactoring.

## Complexity Tracking

No constitution violations are expected. The feature deliberately avoids a new component
library, runtime i18n dependency, persistence adapter, or financial-state abstraction.
