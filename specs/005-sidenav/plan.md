# Implementation Plan: Responsive Side Navigation

**Branch**: `005-sidenav` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

## Summary

Integrate the approved lazy-loaded `/accounts` route into the application shell and expose
it through one shared destination catalog. The sidenav is persistently visible beside the
content at 768px and above, while mobile uses a closed-by-default left drawer with a
backdrop, Escape handling, and focus restoration. The implementation uses native Angular
and CSS media queries, keeps mobile state local, and adds no speculative financial links.

## Technical Context

**Language/Version**: TypeScript 6, Angular 22 strict mode

**Primary Dependencies**: Angular Router, standalone Angular components, signals, CSS
media queries, Vitest through the Angular CLI

**Storage**: None; menu state is transient and account state remains in `AccountStore`

**Testing**: Angular component tests, Biome, SSR production build, and `git diff --check`

**Target Platform**: Angular SSR/hydrated web application at 320px and wider

**Project Type**: Single Angular web application

**Performance Goals**: Navigation opens and closes synchronously without a network request;
the account feature remains lazy-loaded

**Constraints**: Exact 320–767 mobile, 768–1023 tablet, and 1024+ desktop ranges; WCAG
semantics and visible focus; no persisted menu state; no transaction, transfer, card-payment,
or persistence routes

## Constitution Check

*GATE: PASS before and after design.*

- Financial integrity and domain semantics: PASS; navigation does not mutate financial data.
- Local-first privacy: PASS; no storage, network, or authentication is introduced.
- Accessible and testable delivery: PASS; native landmarks, buttons, links, focus behavior,
  SSR-safe initial state, component tests, build, and Biome checks are included.

## Architecture

- `navigation.config.ts` is the single ordered catalog. It currently contains only the
  implemented `/accounts` route.
- `Sidenav` owns only the transient `mobileOpen` signal and focus references. Desktop/tablet
  visibility is CSS-driven, so SSR does not need to inspect `window` or user agents.
- `App` owns the shell layout and router outlet. `/accounts` is lazy-loaded through the
  Angular Router and consumes `AccountStore` through `AccountPage`.
- The persistent and mobile presentations render the same destination objects and derive
  active state through `RouterLinkActive`/`aria-current`.

## Source Layout

```text
src/app/
├── app.html, app.ts, app.routes.ts
├── navigation/
│   ├── navigation.types.ts
│   ├── navigation.config.ts
│   ├── sidenav.component.ts/html/css
│   └── sidenav.component.spec.ts
└── features/accounts/
    └── account-page.ts/html/css
```

## Complexity Tracking

No constitution violations or complexity exceptions are required.
