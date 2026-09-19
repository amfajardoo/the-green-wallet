# Quickstart: Modern Colombian Spanish Visual Experience

## Prerequisites

- Node.js and pnpm compatible with the repository toolchain.
- Dependencies installed with `pnpm install`.

## Automated validation

From the repository root:

```powershell
pnpm check
pnpm test -- --watch=false
pnpm build
git diff --check
```

Expected outcomes:

- Biome reports no diagnostics for `src`.
- Existing account, shell, and navigation tests pass.
- Angular production/SSR build completes successfully.
- Git reports no whitespace errors.

## Manual acceptance matrix

Review `/accounts` at 320, 767, 768, 1024, and 1280 CSS pixels.

1. Confirm the shell, sidenav, headings, fields, buttons, empty states, statuses, and footer
   are in natural Colombian Spanish with no visible English.
2. With no accounts, confirm the empty state explains the next action and the primary action is
   clear.
3. Create a COP asset account and a USD credit-card account; confirm currency codes, balance
   meaning, and asset/liability distinction remain explicit.
4. Submit invalid name, type, currency, and opening-balance values; confirm each error is
   actionable, associated with its field, and announced accessibly.
5. Use keyboard only to complete the flow; confirm visible focus, logical order, and no trap.
6. Enable reduced motion and enlarge browser text; confirm the same tasks remain understandable.
7. Refresh the page and confirm the existing session-only behavior remains unchanged.

## Review boundaries

Do not treat visual polish as permission to add transactions, persistence, runtime i18n,
exchange rates, or new account types. Those capabilities belong to their own specifications.
