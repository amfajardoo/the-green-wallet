# Implementation Plan: Playwright End-to-End Testing Foundation

**Branch**: `003-playwright` | **Date**: 2026-08-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-playwright/spec.md`

## Summary

Add a local Playwright Test foundation for TheGreenWallet using a single Chromium
project, an Angular development server managed by the runner, and one smoke journey
that proves the current application shell is available and usable. The foundation will
keep each test in a fresh browser context, retain failure-only screenshots and traces,
ignore generated artifacts, and support an already-running application through an
explicit `PLAYWRIGHT_BASE_URL` override.

## Technical Context

**Language/Version**: TypeScript 6.0.2, Node.js 20+, Angular 22.1, Playwright Test 1.62.1

**Primary Dependencies**: `@playwright/test` 1.62.1 and `playwright-ng-schematics`
22.0.3 as development dependencies; the existing Angular SSR application and pnpm
11.20.0 toolchain.

**Storage**: N/A. Browser tests use Playwright's ephemeral browser contexts and do not
create application persistence, authentication state, or committed test data.

**Testing**: `pnpm exec playwright test` for browser tests, `pnpm exec playwright
install chromium` for the supported browser, plus the existing Angular build, unit
test, and Biome checks.

**Target Platform**: Local Angular SSR/hydrated web application served at
`http://127.0.0.1:4200`; Chromium is the only initial browser project.

**Project Type**: Standalone Angular web application with server-side rendering.

**Performance Goals**: The runner must fail clearly when the local server does not
become ready within the configured startup timeout; the initial smoke suite must remain
small enough for a normal local feedback loop. This feature makes no product
performance claim.

**Constraints**: Local-only execution, no backend or third-party service, no persistent
browser profile, no committed browser binaries or generated reports, support for an
already-running endpoint, semantic locators for future journeys, and compatibility with
the repository's WCAG 2.2 AA and AXE validation direction.

**Scale/Scope**: One shared runner configuration and one initial Chromium smoke spec.
Account setup, transfers, card payments, CI workflows, visual regression, and
cross-browser coverage remain outside this feature.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Evaluation | Result |
|-----------|------------|--------|
| I. Financial Integrity | The runner and smoke journey do not create, calculate, persist, or mutate financial data. | PASS |
| II. Domain and Currency Semantics | No account, currency, transfer, or conversion behavior is introduced; future journeys will assert domain semantics through their own specifications. | PASS |
| III. Financial History | The foundation creates no posted movements and uses no persistent business history. | PASS |
| IV. Local-First Privacy | Tests target the local Angular server, use fresh ephemeral contexts, and require no authentication, cloud service, or third-party network. | PASS |
| V. Small, Accessible, and Testable Delivery | The feature adds a focused browser layer, preserves semantic/keyboard-friendly locator patterns, captures actionable failures, and documents build/test/Biome gates. | PASS |

## Project Structure

### Documentation (this feature)

```text
specs/003-playwright/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── tasks.md
└── checklists/
    ├── requirements.md
    └── browser-foundation.md
```

No `contracts/` directory is required because the feature exposes no public API or
external integration contract.

### Source Code (repository root)

```text
e2e/
└── smoke.spec.ts                 # Initial local application availability journey

playwright.config.ts              # Shared runner, web server, browser, isolation, and reporting

src/                              # Existing Angular application; no business feature code is added here
```

The repository root is the correct location for `playwright.config.ts` because the
runner, pnpm scripts, Angular server, and future feature-owned browser specs share one
configuration. Business scenarios will remain in their own future specs while reusing
the shared runner guarantees.

## Design Decisions

1. Use `@playwright/test` 1.62.1 with the already-installed Angular schematic package
   available as an optional `ng e2e` integration. The repository's primary `pnpm e2e`
   script invokes the package-local Playwright runner directly so it can support both
   automatic server startup and an already-running endpoint.
2. Configure one `chromium` project with Desktop Chrome defaults. Firefox and WebKit
   are intentionally deferred to a later specification.
3. Use `webServer` with `pnpm start -- --host 127.0.0.1 --port 4200`, a readiness URL,
   and `reuseExistingServer: !process.env.CI`. When `PLAYWRIGHT_BASE_URL` is supplied,
   omit `webServer` so maintainers can point tests at an already-running local endpoint.
4. Use Playwright's built-in `page` fixture without `storageState`, persistent contexts,
   or shared mutable fixtures. Each test owns its starting state and can run in a
   different worker configuration.
5. Retain `screenshot: 'only-on-failure'` and `trace: 'retain-on-failure'`, keep video
   disabled initially, and write reports to ignored `playwright-report/` and
   `test-results/` directories. This preserves navigation, rendering, and interaction
   evidence without adding generated files to source control.
6. Prefer role, label, and other user-facing locators in the smoke test and future
   feature specs. The shared foundation does not add an AXE dependency or a product
   accessibility suite; feature specifications may add those assertions when their
   acceptance criteria require them.
7. Add `e2e`, `e2e:headed`, `e2e:report`, and `e2e:install` package scripts.

## Implementation Sequence

1. Add the exact `@playwright/test` development dependency and package scripts, then
   install Chromium through the local Playwright CLI.
2. Add `playwright.config.ts` with the local web server, base URL override, Chromium
   project, fresh-context defaults, failure evidence, and ignored output directories.
3. Add `e2e/smoke.spec.ts` using the current application shell's title and main heading
   as stable availability/usability signals; do not add account or financial behavior.
4. Add ignore rules for Playwright reports, test results, and any other generated local
   artifacts. Confirm browser binaries remain in the Playwright cache, not the repo.
5. Update `README.md` with the e2e commands, Chromium prerequisite, local endpoint
   override, and failure-report workflow.
6. Run the browser quickstart plus `pnpm exec ng build`, `pnpm exec ng test --no-watch`,
   and `pnpm check`; verify generated directories stay ignored and no
   application source or financial behavior changed.

## Post-Design Constitution Re-check

| Principle | Post-design result |
|-----------|-------------------|
| I. Financial Integrity | PASS — no financial state or arithmetic is introduced. |
| II. Domain and Currency Semantics | PASS — business journeys remain future feature scope. |
| III. Financial History | PASS — tests use ephemeral contexts and no application persistence. |
| IV. Local-First Privacy | PASS — default execution is local and the override is explicit. |
| V. Small, Accessible, and Testable Delivery | PASS — browser isolation, semantic locator guidance, failure evidence, and repository validation are defined. |

## Complexity Tracking

No constitution violations or additional architectural complexity are required. The
runner is a single root-level configuration with one Chromium smoke journey and no
backend, CI, or persistent test-data layer.
