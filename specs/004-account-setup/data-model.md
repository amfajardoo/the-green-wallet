# Data Model: Account Setup UI

## Form model

```text
name: string
type: string
currency: string
openingBalance: string
```

All fields start as empty or explicit string values; no `null` or browser numeric conversion
is used. `openingBalance` may be empty, which the domain interprets as zero.

## View model

The list renders `Account` entities from `AccountStore`:

- account name, type, and selected currency;
- `Available balance` for savings, checking, and cash;
- `Outstanding liability` for credit cards;
- exact formatted opening/current amount;
- a session-only notice that refresh clears the list.

## Validation states

1. Empty form: required field guidance is available but no account exists.
2. Invalid field: the field is marked invalid after interaction/submission and shows a
   specific accepted format.
3. Store rejection: a form-level message explains duplicate or domain rejection while all
   existing list entries remain unchanged.
4. Success: the new account appears immediately, the form returns to its clean initial
   values, and the opening event is retained in state.
