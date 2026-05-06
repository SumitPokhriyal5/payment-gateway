import type { Currency } from "@/types";

export const MAX_RETRY_ATTEMPTS = 3;

export const PROCESSING_MIN_DURATION_MS = 2000;
export const CLIENT_TIMEOUT_MS = 6000;
export const SERVER_TIMEOUT_DELAY_MS = 8000;

export const SUCCESS_RATE = 0.6;
export const FAILURE_RATE = 0.25;

export const CARD_PATTERNS = {
  visa: /^4/,
  mastercard: /^(5[1-5]|2[2-7])/,
  amex: /^3[47]/,
} as const;

export const CARD_NUMBER_LENGTHS = {
  visa: 16,
  mastercard: 16,
  amex: 15,
  unknown: 16,
} as const;

export const CVV_LENGTHS = {
  visa: 3,
  mastercard: 3,
  amex: 4,
  unknown: 3,
} as const;

export const CURRENCIES: ReadonlyArray<{
  code: Currency;
  symbol: string;
  label: string;
}> = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
];

export const FAILURE_REASONS = [
  "Insufficient funds",
  "Card declined by issuer",
  "Invalid card details",
  "Transaction limit exceeded",
] as const;

export const STORAGE_KEYS = {
  TRANSACTIONS: "pg:transactions",
} as const;
