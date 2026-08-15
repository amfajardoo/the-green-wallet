# Data Model: Project Visual Theme and Design Tokens

This feature defines static design metadata, not runtime application data. No user, account, currency, or financial event is stored by the theme.

## Token Layers

### Primitive Tokens

Primitive tokens are the small set of raw values from which semantic roles are composed.

| Primitive group | Purpose | Initial direction |
|-----------------|---------|-------------------|
| Neutral | Page, surface, border, and content contrast | `#ffffff`, `#f8fafc`, `#f1f5f9`, `#e2e8f0`, `#475569`, `#0f172a` |
| Brand | Primary product actions and selected navigation | `#065f46` action/text value with a light green supporting surface |
| Positive | Income, available asset, and successful completion cues | `#166534` text/action value with `#f0fdf4` supporting surface |
| Negative | Expense, validation failure, and harmful outcome cues | `#991b1b` text/action value with `#fef2f2` supporting surface |
| Warning | Attention required without failure | `#854d0e` text/action value with `#fefce8` supporting surface |
| Information | Neutral guidance and informational status | `#075985` text/action value with `#f0f9ff` supporting surface |
| Liability | Credit-card debt and liability-specific meaning | `#9a3412` text/action value with `#fff7ed` supporting surface |
| Focus | Keyboard focus visibility | `#1d4ed8` focus indicator |

These initial values must be verified against WCAG AA contrast requirements during implementation; any replacement must preserve the same semantic role and contrast target.

### Semantic Color Tokens

| Semantic token | Meaning | Example consumers |
|----------------|---------|-------------------|
| `surface` | Default page or component background | Page shell, cards |
| `surface-subtle` | Low-emphasis supporting background | Empty states, secondary panels |
| `surface-elevated` | Layer above the default surface | Dialogs, menus, elevated cards |
| `content` | Primary readable content | Body text, headings |
| `content-muted` | Secondary readable content | Descriptions, metadata |
| `content-inverse` | Content on a strong colored surface | Primary action labels |
| `border` | Default structural boundary | Inputs, cards, dividers |
| `border-strong` | Emphasized structural boundary | Invalid, selected, or important sections |
| `brand` | Primary product action or identity | Main buttons, active navigation |
| `focus` | Keyboard focus indicator | Buttons, links, inputs |
| `positive` / `positive-subtle` | Positive financial or success meaning | Income, available balance, success |
| `negative` / `negative-subtle` | Expense, failure, or negative outcome | Expenses, invalid fields, errors |
| `warning` / `warning-subtle` | Attention or caution | Validation guidance, warnings |
| `info` / `info-subtle` | Neutral guidance | Informational notices |
| `liability` / `liability-subtle` | Credit-card liability meaning | Card balances, debt notices |

### Typography Roles

| Role | Purpose | Requirement |
|------|---------|-------------|
| Display/heading | Page and section hierarchy | Clear hierarchy without relying on color |
| Body | Explanatory and descriptive text | Readable line length and size |
| Label | Form and control labels | Remains associated with its control |
| Numeric | Balances and financial values | Uses tabular or stable numeral behavior where supported |
| Caption | Metadata and secondary context | Must remain readable and meet contrast requirements |

### Interaction States

Every applicable interactive pattern defines default, hover, pressed, focus-visible, disabled, invalid, and loading states. Focus-visible must not be removed or replaced with a color-only indication.

### Responsive Rules

- Base styles target narrow screens first.
- Existing Tailwind breakpoints are used for larger layouts.
- Common financial values must wrap or scale safely without introducing horizontal scrolling.
- Motion is non-essential and respects `prefers-reduced-motion`.
