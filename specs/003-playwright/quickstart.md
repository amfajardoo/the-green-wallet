# Quickstart: Playwright End-to-End Testing Foundation

This guide validates the local browser foundation. It does not create accounts,
transactions, transfers, or persistent financial data.

## Prerequisites

- Node.js and pnpm versions supported by the repository's Angular 22 toolchain.
- Dependencies installed from the repository root:

```powershell
pnpm install
```

- Chromium installed into Playwright's user cache:

```powershell
pnpm e2e:install
```

## Run the smoke suite with automatic server startup

```powershell
pnpm e2e
```

The runner starts the Angular development server on
`http://127.0.0.1:4200`, waits for readiness, opens a fresh Chromium context, and
executes the smoke journey. A passing run reports one successful browser scenario.

## Reuse an already-running application

Start the application separately, then point Playwright at its local endpoint:

```powershell
pnpm start -- --host 127.0.0.1 --port 4200
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:4200'
pnpm e2e
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

When `PLAYWRIGHT_BASE_URL` is set, the runner does not start a second Angular server.
If the endpoint is unavailable, the test command must fail with an actionable
navigation or connection error.

## Useful local commands

```powershell
pnpm e2e:headed
pnpm e2e:report
pnpm exec playwright test --project=chromium --workers=1
```

The headed command is for local debugging. The report command opens the most recent
HTML report when one exists.

## Failure evidence

On a failed run, inspect:

- `test-results/` for failure attachments;
- `playwright-report/` for the HTML report;
- the retained trace through `pnpm exec playwright show-trace <trace-file>`.

Screenshots and traces are failure-only. The directories are ignored and must not
appear as tracked source artifacts after a test run.

## Repository validation

After the foundation is implemented, run:

```powershell
pnpm e2e
pnpm exec ng build
pnpm exec ng test --no-watch
pnpm exec biome check .
git diff --check
git status --short
```

The final status must not include browser binaries, reports, traces, videos, temporary
profiles, or generated test data. The initial smoke journey remains availability-only;
account setup and financial user journeys belong to their own specifications.
