# Quickstart: Account Setup and Opening Balances

## Validate the flow

From the repository root:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
ng test --no-watch
ng build
biome check src
```

The component tests cover rendering an empty state, submitting a valid account, listing
asset and liability meanings, and retaining the existing list after a rejected duplicate or
precision error. Store tests cover exact amounts and all derived state independently.

Manual acceptance:

1. Enter a name, select an account type and COP/USD, then submit with an empty balance.
2. Confirm the account appears immediately with zero and an explicit balance meaning.
3. Create a USD account with `10.50` and confirm the displayed amount remains exact.
4. Submit the same name and currency again; confirm an actionable error and unchanged list.
5. Enter a COP decimal or USD amount with more than two decimal places; confirm rejection.
6. Refresh the page; confirm the in-memory list is empty.
