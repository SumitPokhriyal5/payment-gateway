import { detectCardType } from "./card";
import { CURRENCIES } from "./constants";
import type { Currency } from "@/types";

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  const type = detectCardType(digits);

  if (type === "amex") {
    return digits
      .slice(0, 15)
      .replace(/^(\d{4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" ")
      );
  }

  return digits
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatAmount(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) return `${parts[0]}.${parts.slice(1).join("")}`;
  if (parts[1] && parts[1].length > 2) {
    return `${parts[0]}.${parts[1].slice(0, 2)}`;
  }
  return cleaned;
}

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCIES.find((c) => c.code === currency)?.symbol ?? "";
}

export function formatCurrency(amount: number, currency: Currency): string {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, "");
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
}
