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

## Browser automation follow-up

The shared Playwright runner and automated contrast, axe, keyboard, and browser checks are defined by `003-playwright`. Those validations are intentionally deferred from this feature and should be added there or in the relevant feature spec rather than duplicating runner setup here.
