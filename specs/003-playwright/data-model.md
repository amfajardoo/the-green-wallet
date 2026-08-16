# Data Model: Playwright End-to-End Testing Foundation

This feature models test infrastructure rather than financial or application data. No
entity in this document is persisted by TheGreenWallet, and no browser test may depend
on a previous test's state.

## Browser Test

A named automated user journey executed by Playwright Test.

| Field | Type | Rules |
|-------|------|-------|
| title | string | Required; describes the user-visible journey or smoke purpose. |
| sourcePath | path | Must be under `e2e/`; future feature tests remain feature-owned. |
| project | literal | `chromium` for the initial feature. |
| locatorStrategy | enum | Prefer role, label, text, or other user-facing locators before CSS structure. |
| setupOwnership | enum | `self-contained`; the test creates or observes only its own starting state. |

### Invariants

- A test MUST be runnable without a personal browser profile.
- A test MUST NOT rely on execution order, shared mutable fixtures, or persistent
  application data.
- A future business journey MUST remain traceable to its own feature specification.

## Test Context

The isolated execution boundary provided to one browser test.

| Field | Type | Rules |
|-------|------|-------|
| browser | literal | `chromium` in the initial release. |
| baseURL | URL | Defaults to `http://127.0.0.1:4200`; may be overridden by `PLAYWRIGHT_BASE_URL`. |
| browserContext | ephemeral context | Created by Playwright's built-in test fixture; no persistent profile or `storageState`. |
| applicationState | enum | `empty-in-memory` for the foundation; no localStorage, IndexedDB, cookies, or backend setup is required. |
| serverMode | enum | `managed-local` when `webServer` starts Angular, or `existing-endpoint` when an explicit base URL is supplied. |

### State transitions

```text
not-started
    -> server-ready
    -> context-created
    -> journey-running
    -> passed | failed
    -> context-closed
```

- If the server does not become ready, the run transitions to `failed` with a startup
  diagnostic and no test journey is considered passed.
- Context closure is performed by Playwright after each test, including failures.
- No state transition writes application financial data.

## Smoke Journey

The minimal initial journey proving that the application can load and become usable.

| Field | Type | Rules |
|-------|------|-------|
| entryPath | path | `/` for the initial application shell. |
| readinessSignal | assertion | Current document title and visible main application heading. |
| externalDependencies | list | Empty; the journey targets the local application only. |
| businessScope | enum | `availability-only`; account setup and financial operations are deferred. |

### Acceptance mapping

- FR-002 / FR-003: navigate to the local entry path and assert the current shell is
  visible and usable.
- FR-004 / FR-005: use the built-in isolated context and own all setup.
- FR-008: use semantic assertions where the current shell exposes them; future feature
  journeys add keyboard and AXE assertions as their acceptance criteria require.

## Failure Evidence

Generated, local-only artifacts associated with a failed test.

| Field | Type | Rules |
|-------|------|-------|
| testResultsDirectory | path | `test-results/`; ignored by Git. |
| screenshot | optional file | Captured only on failure. |
| trace | optional file | Retained on failure and inspectable with Playwright Trace Viewer. |
| htmlReport | optional directory | `playwright-report/`; ignored by Git and opened explicitly by a maintainer. |
| commandOutput | text | Must identify the test title and failed assertion or server startup error. |

### Invariants

- Generated evidence MUST NOT be committed as source artifacts.
- Passing runs MUST NOT retain failure-only screenshots or traces.
- Evidence MUST remain available for navigation, rendering, and interaction failures,
  not only assertion failures.
