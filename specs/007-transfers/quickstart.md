# Quickstart: Same-Currency Account Transfers

## Prerequisites

- Node.js and the repository dependencies already installed.
- Work from the repository root.
- Do not reinstall dependencies when the dependency graph has not changed.

## Verification commands

```powershell
& .\node_modules\.bin\biome.CMD check src
& .\node_modules\.bin\ng.CMD test --watch=false --no-progress
& .\node_modules\.bin\ng.CMD build
git diff --check
```

## Acceptance walkthrough

1. Create a COP savings account with `$100.000` and a COP cash account with `$10.000`.
2. Open `Movimientos` or `Transferencias`, choose the savings account as source and cash as destination, and transfer `$25.000`.
3. Confirm the source is `$75.000`, the destination is `$35.000`, and one paired transfer appears with both names.
4. Try the same account as both endpoints, a COP-to-USD transfer, an amount above the source balance, zero/invalid precision, and a blank description. Each attempt shows an actionable Spanish error and leaves balances/history unchanged.
5. Navigate to another screen and back without reloading; confirm the paired transfer remains visible during the active session.
6. Use keyboard controls to complete a valid transfer and identify rejected fields without relying on color.

## Explicit non-goals

This feature does not add cross-currency conversion, exchange rates, fees, credit-card endpoints or payments, scheduling, imports, remote APIs, browser persistence, editing, deletion, reversal, or reconciliation.
