# Quickstart: Validate the Project Visual Theme

## Prerequisites

- Node.js and pnpm are installed.
- Project dependencies are installed with `pnpm install`.
- The theme implementation exists in the feature branch.

## Build and static validation

Run the existing project checks:

```powershell
pnpm exec ng build
pnpm exec ng test --no-watch
pnpm check
```

Expected result: the Angular SSR build completes, the existing unit-test suite passes, and Biome reports no unexplained diagnostics.

## Responsive and interaction validation

Start the application:

```powershell
pnpm start
```

Review the representative themed surfaces at 320, 768, and 1280 CSS pixel widths and verify the basic visual integration:

1. Text and financial values remain readable without theme-induced horizontal scrolling.
2. Positive, negative, warning, neutral, and credit-liability meanings use the defined semantic roles.
3. Disabled, invalid, loading, hover, and pressed styles do not introduce arbitrary visual values.

## SSR and hydration validation

Run the production build and confirm that theme rendering does not depend on browser-only globals or runtime storage. The same semantic roles must be present after server rendering and browser hydration.

## Accessibility and browser validation follow-up

Automated contrast, accessibility, keyboard, and browser checks are intentionally deferred from this feature. Add them through the validation strategy selected for the relevant feature rather than duplicating test-runner setup here.
