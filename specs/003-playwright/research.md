# Research: Playwright End-to-End Testing Foundation

## Decision 1: Use Playwright Test as the browser runner

**Decision**: Use the already-installed development dependency
`@playwright/test@1.62.1` and run tests through the package-local Playwright CLI.

**Rationale**: Playwright Test supplies the test runner, browser projects, isolated
contexts, web-first assertions, and TypeScript support required by the feature. A
package-local version keeps test behavior reproducible through `pnpm-lock.yaml` and
avoids coupling the suite to a globally installed test runner.

**Alternatives considered**:

- `playwright-ng-schematics` as the only execution path: rejected because its Angular
  builder starts a dev-server target itself and does not provide the same explicit
  existing-endpoint path as the direct Playwright command. It remains installed as an
  optional Angular CLI integration and is preserved.
- A direct `playwright` library script: rejected because it would require rebuilding
  test discovery, assertions, retries, reporting, and fixture isolation.

**Sources**: [Playwright Test package](https://www.npmjs.com/package/@playwright/test),
[Playwright configuration](https://playwright.dev/docs/test-configuration).

## Decision 2: Let Playwright manage the Angular development server

**Decision**: Configure `webServer` to run
`pnpm start -- --host 127.0.0.1 --port 4200`, wait for
`http://127.0.0.1:4200`, and reuse an existing server locally. When
`PLAYWRIGHT_BASE_URL` is supplied, tests connect directly to that endpoint and do not
start a second server.

**Rationale**: Playwright's `webServer` option supports a repeatable local startup and
the `reuseExistingServer` option supports the alternate workflow where a maintainer
already has Angular running. A loopback host avoids exposing the test server to the
local network.

**Alternatives considered**:

- Requiring a manually started server: rejected because it violates the fresh-checkout
  acceptance scenario.
- Starting a production SSR server in the test command: rejected for the foundation
  because the existing `pnpm start` command is the project's supported local server
  and keeps the first browser feedback loop simple.

**Sources**: [Playwright web server](https://playwright.dev/docs/test-webserver),
[Playwright configuration](https://playwright.dev/docs/test-configuration).

## Decision 3: Use fresh contexts and failure-only evidence

**Decision**: Rely on the built-in `page` fixture, do not configure `storageState` or a
persistent profile, use `screenshot: 'only-on-failure'`,
`trace: 'retain-on-failure'`, and disable video for the initial foundation.

**Rationale**: Playwright creates an isolated browser context for each test. Failure-only
screenshots and traces provide actionable navigation, rendering, and interaction
evidence while avoiding unnecessary artifacts for passing runs. The generated output is
ignored by Git and can be inspected with the Playwright report or trace viewer.

**Alternatives considered**:

- Recording video and traces for every test: rejected because it increases local disk
  use and adds no value to a passing smoke journey.
- Sharing a saved browser profile: rejected because it leaks personal or prior test
  state and violates local-first test determinism.

**Sources**: [Playwright test isolation](https://playwright.dev/docs/browser-contexts),
[Playwright use options](https://playwright.dev/docs/test-use-options),
[Playwright trace viewer](https://playwright.dev/docs/trace-viewer).

## Decision 4: Support Chromium first and user-facing locators

**Decision**: Configure one `chromium` project using Desktop Chrome defaults. Smoke and
future feature tests will prefer role, label, and other semantic locators; keyboard and
AXE assertions remain available to feature specifications when required.

**Rationale**: Chromium is the explicitly approved initial target. User-facing locators
make future journeys resilient to presentation refactors and keep the runner compatible
with accessibility-oriented assertions without forcing business behavior into this
foundation.

**Alternatives considered**:

- Enabling Firefox and WebKit immediately: rejected because cross-browser coverage is
  explicitly out of scope for `003-playwright`.
- Selecting elements only by CSS classes: rejected because it weakens the semantic and
  keyboard-oriented testing direction in the feature requirements.

**Sources**: [Playwright test options](https://playwright.dev/docs/test-use-options),
[Playwright best practices](https://playwright.dev/docs/best-practices).

## Resolved Planning Questions

- **Runner**: `@playwright/test`, exact installed version `1.62.1`; the existing
  `playwright-ng-schematics` package remains available for `ng e2e` integration.
- **Browser**: Chromium only for the first release.
- **Application startup**: Angular `pnpm start` through Playwright `webServer`, with an
  explicit `PLAYWRIGHT_BASE_URL` bypass for an existing endpoint.
- **Isolation**: fresh built-in context per test; no persistent state or saved profile.
- **Evidence**: failure-only screenshots and retained traces; video deferred.
- **Reports**: generated locally in ignored directories; no CI or committed reports.
- **Contracts**: none; this is internal test tooling and does not expose an API.
