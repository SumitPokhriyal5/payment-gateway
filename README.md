# Payment Gateway

A mock payment gateway built with Next.js (App Router) and TypeScript. Simulates the full payment lifecycle — form validation, processing states, retries, timeouts, and persistent transaction history — without any real payment SDK.

**Live demo:** [your-vercel-url-here]

---

## Quick start

```bash
git clone
cd payment-gateway
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build
npm start
```

## Test cards

The mock gateway accepts any Luhn-valid card number. Useful test values:

| Card       | Number              | Expiry | CVV  |
| ---------- | ------------------- | ------ | ---- |
| Visa       | 4242 4242 4242 4242 | 12/30  | 123  |
| Mastercard | 5555 5555 5555 4444 | 12/30  | 123  |
| Amex       | 3782 822463 10005   | 12/30  | 1234 |

Outcomes are randomized server-side: ~60% success, ~25% failure, ~15% timeout.

## Architecture

app/
├── api/pay/route.ts Mock gateway endpoint
├── layout.tsx
└── page.tsx Renders <PaymentExperience />
components/
├── form/ Form inputs + container
├── preview/ Live card preview
├── status/ Result screens (success/failed/timeout)
├── history/ Transaction list + detail modal
├── ui/ shadcn/ui primitives
├── PaymentExperience.tsx Page composition
└── SkipLink.tsx
hooks/
├── useCardForm.ts Form state + validation
├── usePayment.ts API call, AbortController, retry logic
└── useHistoryHydration.ts SSR-safe localStorage hydration
store/
├── paymentStore.ts Ephemeral payment state (no persistence)
└── historyStore.ts Persisted transaction history
types/ PaymentPayload, Transaction, CardType, etc.
utils/ formatters, validators, card detection, constants

## Key technical decisions

### Two stores, not one

`paymentStore` holds the in-flight transaction (current ID, status, attempts) and is intentionally **not persisted** — refreshing mid-payment should not restore a "processing" state. `historyStore` holds settled transactions and persists to `localStorage` via Zustand's `persist` middleware. Splitting them keeps the persistence boundary obvious and prevents zombie state on reload.

### Idempotency via shared transaction ID

A new transaction ID (via `crypto.randomUUID()`) is generated on the first attempt and reused on every retry. The history store deduplicates by ID — retries update the existing record's status and attempt count instead of creating a new row. This matches how real gateways handle idempotency keys.

### Validators return `string | null`, not `boolean`

Each validator owns its error message. The form components just render whatever the validator returns. No duplicated copy across the codebase.

### Errors appear on blur, then on every keystroke after touch

Showing errors while the user is mid-typing on first entry is hostile UX. After a field is blurred (touched), errors update live so the user sees them clear immediately as they fix them. Implemented via a separate `touched` map alongside `values`.

### AbortController for client-side timeout

The route handler simulates a slow response (8s) for the timeout outcome. The client aborts the fetch at 6s, distinguishing `AbortError` from network errors so the user sees the right message.

### Two-render-safe hydration via `useSyncExternalStore`

Zustand's `persist` middleware can cause hydration mismatches in Next.js if the client reads localStorage during initial render. We use `skipHydration: true` on the store and rehydrate on mount via `useSyncExternalStore`. This avoids both the empty-state flash and React 19's `set-state-in-effect` warning.

### Card numbers in history are masked at the data layer

Only `cardLast4` is stored in `Transaction`, never the full card number. The form data flows through `usePayment` which extracts the last 4 before persisting. There is no path to leak full card data into localStorage.

### Why Zustand over Redux Toolkit

Two small stores, no async middleware needed (the API call lives in a hook), no time-travel debugging requirement. RTK's structure would have added boilerplate without benefit. Zustand's `persist` middleware also handles localStorage cleanly without a separate library.

## Assumptions

- The mock gateway is single-user and stateless. Idempotency is enforced on the client (history dedupes by ID); a real gateway would also enforce it server-side.
- A Luhn-valid card number is treated as "format-valid." We don't simulate BIN checks or bank-specific validation beyond card type detection.
- Currency is display-only — INR and USD payments don't actually convert; the amount field is treated as the user's chosen currency.
- Transaction history is capped at 50 entries to stay within reasonable `localStorage` bounds.
- "Approximately 2 seconds" of processing is enforced as a 2000ms minimum via `Promise.all([fetch, delay(2000)])`. Faster server responses still wait the floor.
- The form is locked through the entire result presentation, not just processing. The user must explicitly choose "Make another payment" or "Start over" to unlock it — prevents accidental edits to a card the user thinks is settled.
- `noUncheckedIndexedAccess` is enabled in `tsconfig`; array access defensively uses `?? fallback` where applicable.

## What I'd improve given more time

- **Unit tests for utilities and hooks.** The pure functions in `utils/` (Luhn, validators, formatters) and the `useCardForm` hook are the highest-leverage tests. A Jest + React Testing Library setup would take ~1 hour and catch regressions.
- **E2E test for the full flow.** A single Playwright test covering the happy path + retry + final failure would build confidence quickly.
- **Confirmation dialog before "Clear all" history.** Currently destructive without a guard.
- **Better failure differentiation.** All non-timeout failures show the same retry UI. A real gateway would distinguish "card declined — try a different card" (no retry) from "network error — retry."
- **Internationalization.** Currency and date formatting use `Intl`, but UI strings are hardcoded English. An `i18n` layer would localize labels, errors, and ARIA text.
- **Server-side idempotency.** The route handler currently re-rolls outcomes on every request, including retries with the same transaction ID. A real gateway would cache the first response per ID.
- **Stronger payload validation in the route.** The current type predicate is shape-based. A schema validator (Zod) would give better error messages and runtime guarantees.
- **Optimistic transaction creation.** Currently the transaction only enters history once it settles. Showing it as "processing" in the list during the request would feel faster.
- **Reduced-motion-aware spinner alternative.** Currently the spinner just stops spinning under `prefers-reduced-motion`; replacing it with a static "Processing…" pulse would be more visible.

## Tech stack

- **Next.js 14+** (App Router, Route Handlers)
- **TypeScript** (strict mode, `noUncheckedIndexedAccess`)
- **Zustand** with `persist` middleware
- **Tailwind CSS**
- **shadcn/ui** (Input, Label, Select, Button, Dialog, Badge, ScrollArea, Alert)
- **Lucide React** (icons)

## Commit history

Each step from the assignment is a separate commit with a descriptive message. Run `git log --oneline` to see the progression from setup through deployment.
