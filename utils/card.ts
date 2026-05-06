import { CARD_PATTERNS, CARD_NUMBER_LENGTHS } from "./constants";
import type { CardType } from "@/types";

export function detectCardType(cardNumber: string): CardType {
  const digits = cardNumber.replace(/\s/g, "");
  if (!digits) return "unknown";

  for (const [type, pattern] of Object.entries(CARD_PATTERNS)) {
    if (pattern.test(digits)) return type as CardType;
  }
  return "unknown";
}

export function getExpectedCardLength(type: CardType): number {
  return CARD_NUMBER_LENGTHS[type];
}

export function getCardLast4(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, "");
  return digits.slice(-4);
}

export function passesLuhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, "");
  if (!/^\d+$/.test(digits)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
