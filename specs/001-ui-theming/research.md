# Research: Project Visual Theme and Design Tokens

## Decision 1: Use Tailwind CSS 4 CSS-first configuration

- **Decision**: Define the theme with CSS `@theme` rules in the existing global stylesheet pipeline.
- **Rationale**: The repository already uses Tailwind CSS 4.1 and `@tailwindcss/postcss`; a CSS-first extension avoids introducing a second configuration format or a new build dependency.
- **Alternatives considered**: A JavaScript `tailwind.config` file was rejected because it is not needed for the current Tailwind 4 setup. A separate design-token package was rejected because the application has one local consumer and no cross-package distribution requirement.

## Decision 2: Separate primitive values from semantic roles

- **Decision**: Keep a small primitive palette and expose semantic roles such as surface, content, border, brand, positive, negative, warning, information, liability, and focus. The initial high-contrast action/text values are `#065f46` brand, `#166534` positive, `#991b1b` negative, `#854d0e` warning, `#075985` information, `#9a3412` liability, and `#1d4ed8` focus.
- **Rationale**: Components should express meaning rather than couple themselves to a hue. This preserves the ability to add a future visual mode without rewriting component intent.
- **Alternatives considered**: Using raw Tailwind color names directly in every template was rejected because it encourages inconsistent meaning and makes future theme changes expensive.

## Decision 3: Use local system typography

- **Decision**: Use a system sans-serif stack and reserve explicit numeric typography roles for headings, body text, labels, and financial values.
- **Rationale**: A local stack avoids network requests, keeps SSR and hydration deterministic, and reduces initial page dependencies while the product is local-first.
- **Alternatives considered**: A hosted web font was rejected for privacy, availability, and performance reasons. A bundled custom font was deferred because no brand requirement currently justifies its size and maintenance cost.

## Decision 4: Light mode first, semantic extension point

- **Decision**: Implement one light mode for v1 and keep token names semantic so a future mode can override values.
- **Rationale**: The spec explicitly defers dark mode; implementing it now would expand scope without a current user requirement.
- **Alternatives considered**: Implementing dark mode immediately was rejected as premature. Naming tokens after hues was rejected because it would make future mode overrides less expressive.

## Decision 5: Accessibility and responsive behavior are token requirements

- **Decision**: Validate contrast for text, controls, focus indicators, and meaningful graphics; use mobile-first responsive utilities and reduced-motion-safe transitions.
- **Rationale**: The constitution requires WCAG 2.2 AA and automated accessibility checks. The theme must provide safe defaults before individual components add behavior.
- **Alternatives considered**: Deferring accessibility to individual components was rejected because shared colors and focus styles can create repeated failures if they are not governed centrally.

## Decision 6: Keep the theme SSR-safe and data-free

- **Decision**: Theme definitions remain static CSS; no theme service, browser storage, runtime browser global, or user preference persistence is introduced.
- **Rationale**: Angular SSR and hydration are active project constraints, and the feature does not require runtime theme switching.
- **Alternatives considered**: A runtime theme service was rejected for v1 because it would add state and hydration complexity without a dark-mode requirement.
