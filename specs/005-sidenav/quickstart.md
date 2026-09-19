# Quickstart: Validate Responsive Side Navigation

**Feature**: [Responsive Side Navigation](./spec.md)

This guide validates the responsive navigation shell, its mobile menu behavior, and its
keyboard accessibility. It does not create accounts, financial movements, or persisted
data.

## Prerequisites

- Node.js and pnpm versions supported by the repository's Angular 22 toolchain.
- Project dependencies installed from the repository root:

```powershell
pnpm install
```

- The repository's selected browser-test runner and accessibility scanner are installed.

## Static validation

Run the application checks:

```powershell
pnpm exec ng build
pnpm exec ng test --no-watch
pnpm check
```

Expected result: the SSR build completes, the existing unit suite and sidenav unit tests
pass, AXE scans are clean for serious and critical violations, and Biome reports no
diagnostics for files under `src/`.

## Browser validation

Run the configured browser-validation command from the repository root.

The sidenav browser journey MUST validate these viewport widths:

| Width | Expected result |
|---:|---|
| 320px | Mobile trigger visible; navigation closed and hidden |
| 767px | Mobile behavior still active |
| 768px | Persistent tablet sidenav visible |
| 1023px | Persistent tablet sidenav visible without obstruction |
| 1024px | Persistent desktop sidenav visible |
| 1280px | Persistent desktop sidenav and usable content region |

The browser scenarios MUST also cover opening the left-side mobile drawer, backdrop and
Escape dismissal, focus return, active destination semantics when destinations exist, an
empty destination catalog without dead links, and no horizontal scrolling.

Each viewport journey MUST run an AXE scan against the rendered navigation shell. The
feature is not complete while serious or critical AXE violations remain.

## Manual keyboard check

At 320px or 767px:

1. Start with the mobile navigation closed.
2. Tab to the navigation trigger and confirm its visible focus indicator and accessible
   name.
3. Activate the trigger and confirm the expanded state and focus movement into the menu.
4. Confirm the drawer opens from the left and the backdrop is available as a dismissal
   surface.
5. Traverse every available destination with the keyboard, if the catalog is non-empty.
6. Press Escape and confirm the drawer closes and focus returns to the trigger.
7. Repeat by selecting a destination and confirm the drawer closes after navigation when
   an approved destination exists.

At 768px or wider, confirm that the persistent sidenav is reachable in normal keyboard
order and that the active destination is communicated without color alone.

## Responsive boundary check

Use the browser's responsive viewport controls or the automated browser suite to compare
the exact pairs `767/768` and `1023/1024`. The smaller width in each pair MUST use the
mobile or tablet behavior respectively, and the larger width MUST switch to the next
defined presentation.

## Failure evidence

When a browser check fails, inspect the failure artifacts produced by the selected
browser-test runner. Generated reports, traces, screenshots, videos, and browser
binaries MUST remain untracked.
