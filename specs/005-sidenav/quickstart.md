# Quickstart: Responsive Side Navigation

## Static validation

From the repository root:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
ng test --no-watch
ng build
biome check src
```

Expected result: the SSR build prerenders the root redirect and `/accounts` route, the
unit suite passes, and Biome reports no diagnostics.

## Manual responsive validation

Use responsive viewport controls to check the exact boundaries:

| Width | Expected behavior |
| ---: | --- |
| 320px / 767px | Menu button visible; persistent nav hidden; drawer closed by default |
| 768px / 1023px | Persistent nav visible beside content; menu button hidden |
| 1024px / 1280px | Persistent desktop nav visible beside usable account content |

At mobile width, activate Menu, verify focus moves to the drawer, then close with Escape,
the close button, and the backdrop. Focus must return to Menu. The Accounts link must be
available in both presentations and must expose active route semantics.

No browser runner is configured after the Playwright foundation was removed. The component
tests cover the high-risk keyboard/focus behavior and leave the six-width browser/AXE
journeys ready for a future approved runner integration.
