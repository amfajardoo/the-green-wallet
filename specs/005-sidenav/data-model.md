# Data Model: Responsive Side Navigation

**Feature**: [Responsive Side Navigation](./spec.md)

This feature has no persisted data and no financial domain model. The following internal
UI models define the contract between the navigation catalog, its two presentations, and
the responsive interaction state.

## Navigation Destination

Represents one available top-level application area.

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | stable string | yes | Unique within the catalog; used for identity and testing. |
| `label` | user-facing string | yes | Non-empty, concise, and understandable without relying on an icon. |
| `target` | application route target | yes | Must resolve to an available destination; `/accounts` is the current approved target. |
| `order` | catalog position | yes | Unique ordering is defined once and shared by both presentations. |

### Validation rules

- Every destination MUST have a unique `id` and `target` within the available catalog.
- Every destination MUST be rendered identically in label, order, and target across the
  persistent and mobile presentations.
- A destination MUST be removed from the catalog when its route is unavailable rather
  than rendered as a disabled or misleading dead link.
- The catalog MUST remain single-level for this feature.

## Navigation Presentation

Represents how the same catalog is exposed at a given viewport width.

| Range | CSS presentation | Interaction state |
|---|---|---|
| `320–767px` | Left-side overlay drawer with backdrop | `closed` by default; `open` after trigger activation |
| `768–1023px` | Persistent sidenav beside content | Always visible; mobile state does not apply |
| `1024px+` | Persistent sidenav beside content | Always visible; mobile state does not apply |

The viewport range is selected through CSS media queries and is not persisted as application
data. The approved `/accounts` route is the first destination in the catalog.

## Mobile Menu State

Ephemeral UI state for the mobile presentation.

| State | Entry | Exit |
|---|---|---|
| `closed` | Initial render, page refresh, destination selection, Escape, explicit close, dismissal surface, or crossing into tablet/desktop | Mobile trigger activation |
| `open` | Mobile trigger activation | Destination selection, Escape, explicit close, dismissal surface, or crossing into tablet/desktop |

### State invariants

- `open` MUST only be actionable in the mobile range.
- The mobile drawer MUST open from the left and use a backdrop in the mobile range.
- The persistent navigation MUST remain visible beside content in tablet and desktop
  ranges.
- The closed state MUST remove mobile navigation links from keyboard order and the
  accessibility tree.
- Opening stores enough local reference to return focus to the trigger when the menu
  closes without navigation.
- State MUST NOT be serialized to localStorage, IndexedDB, cookies, URL state, a remote
  service, or financial state.

## Available Destination Catalog

The application exposes the approved `/accounts` route. The catalog MUST:

- render the named navigation shell and mobile trigger/drawer behavior;
- render the accounts destination in both presentations;
- derive the active state from the current route; and
- remain ready for later approved destinations without adding speculative links.

## Active Destination

The active destination is derived from the current application location and the available
catalog. It is not independently stored.

### Active-state rules

- At most one available destination is active for a given current location.
- If no destination matches, no unrelated destination is marked active.
- Active meaning MUST be available through navigation semantics and visible structure in
  addition to color.

## Relationships

```text
Navigation Destination[]
        │
        ├── rendered by ──> Persistent Tablet/Desktop Presentation
        └── rendered by ──> Mobile Closed/Open Presentation

Current Application Location ──derives──> Active Destination
Mobile Trigger ──controls──> Mobile Menu State
CSS media queries ──select──> Navigation Presentation
```

No database schema, persistence boundary, API contract, or migration is required.
