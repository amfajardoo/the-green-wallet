# Implementation Plan: Project Visual Theme and Design Tokens

**Branch**: `001-ui-theming` | **Date**: 2026-08-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-ui-theming/spec.md`

## Summary

Create the first project-wide visual foundation for TheGreenWallet using the existing Tailwind CSS 4.1 CSS-first setup. The implementation will add semantic design tokens for surfaces, content, borders, interaction states, and financial meaning; keep the first release light-only; use a local system font stack; and preserve Angular SSR and hydration compatibility. Components will consume semantic Tailwind utilities rather than inventing one-off colors or spacing values.

## Technical Context

**Language/Version**: TypeScript 6.0.2, CSS, Angular 22.1

**Primary Dependencies**: Tailwind CSS 4.1.12, `@tailwindcss/postcss`, PostCSS, Angular 22. No new runtime dependency is required.

**Storage**: N/A. Theme tokens are static CSS decisions and do not contain user or financial data.

**Testing**: Angular/Vitest unit tests where behavior is relevant, `pnpm exec ng build`, `pnpm exec ng test --no-watch`, and `pnpm exec biome check .`. Automated contrast, axe, keyboard, and browser validation are deferred to the later `003-playwright` feature.

**Target Platform**: Angular SSR web application with browser hydration; responsive viewport range from 320 CSS pixels through 1280 CSS pixels.

**Project Type**: Angular standalone web application with server-side rendering.

**Performance Goals**: Keep the theme static and local; do not add remote fonts or runtime theme services; stay within the existing production CSS budget.

**Constraints**: WCAG 2.2 AA, mobile-first responsive behavior, visible keyboard focus, reduced-motion support, no dark mode in v1, no browser-only globals in global styles, and no financial data or persistence changes.

**Scale/Scope**: The account setup experience is the first consumer. The semantic vocabulary must support later transactions, transfers, credit-card payments, and reporting without changing component meaning.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Evaluation | Result |
|-----------|------------|--------|
| I. Financial Integrity | Theme work does not calculate, store, or mutate money and introduces no ledger behavior. | PASS |
| II. Domain and Currency Semantics | Separate positive, negative, warning, and credit-liability visual states; no currency conversion or domain mutation. | PASS |
| III. Financial History | No financial events, account history, or audit records are changed. | PASS |
| IV. Local-First Privacy | No persistence, network font, external service, or browser-only runtime state is added. | PASS |
| V. Small, Accessible, and Testable Delivery | Semantic tokens, keyboard focus, contrast, reduced motion, SSR compatibility, build, tests, and Biome validation are included. | PASS |

## Project Structure

### Documentation (this feature)

```text
specs/001-ui-theming/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/requirements.md
```

No `contracts/` directory is required because this feature does not expose an API or external integration contract.

### Source Code (repository root)

```text
src/
├── styles.css                 # Tailwind entry point and global style imports
└── styles/
    └── theme.css              # Primitive and semantic theme tokens

src/app/
└── ...                        # Existing Angular application surfaces consume the tokens
```

**Structure Decision**: Keep `src/styles.css` as the single Angular global style entry point and add `src/styles/theme.css` for the token definition. The theme file contains no component-specific markup or financial logic. Existing components consume the semantic Tailwind utilities from their templates and focused component styles.

## Design Decisions

1. Use Tailwind CSS 4 CSS-first `@theme` configuration instead of adding a JavaScript Tailwind configuration file.
2. Define semantic tokens through a small primitive palette and map those primitives to roles such as `surface`, `content`, `positive`, `negative`, `warning`, `info`, `liability`, and `focus`.
3. Use a system font stack to avoid external requests and reduce SSR/hydration variability.
4. Use mobile-first responsive utilities and the existing Tailwind breakpoint scale; do not introduce custom breakpoints for this feature.
5. Provide a light theme only in v1, but keep semantic names independent of raw color names so a future mode can override values without changing component intent.
6. Prefer semantic utility composition in templates and avoid broad `@apply` abstractions unless a repeated pattern cannot remain readable and focused.

## Implementation Sequence

1. Add primitive and semantic tokens in `src/styles/theme.css` with contrast-safe values and documented roles.
2. Import the theme file from `src/styles.css` while preserving the existing Tailwind import and Angular global style entry.
3. Define global focus, reduced-motion, and base interaction rules that do not depend on browser-only APIs.
4. Apply the semantic vocabulary to the first representative account setup surfaces when those surfaces exist; do not introduce business logic in the theme change.
5. Validate the stylesheet integration, Angular SSR build, unit tests, and Biome checks. Defer automated contrast, axe, keyboard, and browser validation to `003-playwright`.

## Complexity Tracking

No constitution violations or additional architectural complexity are required. The design uses the existing Tailwind/PostCSS setup and adds one focused theme file.
