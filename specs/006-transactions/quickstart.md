# Quickstart: Income and Expense Transactions

## Prerequisites

- Node.js and the repository dependencies already installed.
- Work from the repository root.
- Do not reinstall dependencies when the dependency graph has not changed.

## Verification commands

```powershell
& .\node_modules\.bin\biome.CMD check src
& .\node_modules\.bin\ng.CMD test --watch=false
& .\node_modules\.bin\ng.CMD build
git diff --check
```

## Acceptance walkthrough

1. Create a COP savings account with an opening balance of `$100.000`.
2. Post COP income of `$25.000`; the account balance becomes `$125.000`.
3. Post a COP asset expense of `$10.000`; the balance becomes `$115.000`.
4. Create or use a USD credit card and post a USD expense; the liability increases in USD.
5. Try an invalid amount, excess precision, blank description, unsupported account type, insufficient asset balance, or currency mismatch. The form shows a Spanish error and the account/history remain unchanged.
6. Navigate with keyboard controls and confirm labels, focus, and semantic errors are available.
7. Move between the account and movement screens without reloading the browser and confirm the in-memory account and transaction history remains available during the active session.

## Explicit non-goals

This feature does not add transfers, card payments, browser persistence, search/filter controls, edit/delete actions, exchange rates, authentication, or remote APIs.
