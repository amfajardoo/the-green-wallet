# Quickstart: Shared Client State Architecture

## Prerequisites

From the repository root, install the locked dependencies:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
```

## Validate the state foundation

Run the independent store tests:

```powershell
ng test --no-watch
```

The tests cover the deterministic empty state, valid COP/USD account creation, separated
asset/liability summaries, duplicate and malformed input rejection, and unchanged state
after rejected operations.

Run static and production checks:

```powershell
biome check src
ng build
```

No test depends on browser storage, network access, or a rendered component. Refreshing the
application creates a fresh in-memory store; persistence is intentionally not part of this
feature.
