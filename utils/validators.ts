import { detectCardType, getExpectedCardLength, passesLuhnCheck } from "./card";
import { CVV_LENGTHS } from "./constants";

type ValidationResult = string | null;

export function validateCardholderName(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return "Cardholder name is required";
  if (trimmed.length < 2) return "Name is too short";
  if (!/^[a-zA-Z\s'.-]+$/.test(trimmed)) {
    return "Name can only contain letters, spaces, and . ' -";
  }
  return null;
}

export function validateCardNumber(value: string): ValidationResult {
  const digits = value.replace(/\s/g, "");
  if (!digits) return "Card number is required";
  if (!/^\d+$/.test(digits)) return "Card number must contain only digits";

  const type = detectCardType(digits);
  const expectedLength = getExpectedCardLength(type);

  if (digits.length !== expectedLength) {
    return `Card number must be ${expectedLength} digits`;
  }
  if (!passesLuhnCheck(digits)) return "Card number is invalid";

  return null;
}

export function validateExpiry(value: string): ValidationResult {
  if (!value) return "Expiry is required";
  if (!/^\d{2}\/\d{2}$/.test(value)) return "Use MM/YY format";

  const [monthStr, yearStr] = value.split("/");
  const month = Number(monthStr);
  const year = 2000 + Number(yearStr);

  if (month < 1 || month > 12) return "Invalid month";

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card has expired";
  }
  if (year > currentYear + 20) return "Expiry year is too far in the future";

  return null;
}

export function validateCVV(
  value: string,
  cardNumber: string
): ValidationResult {
  if (!value) return "CVV is required";
  if (!/^\d+$/.test(value)) return "CVV must be digits only";

  const type = detectCardType(cardNumber);
  const expectedLength = CVV_LENGTHS[type];

  if (value.length !== expectedLength) {
    return `CVV must be ${expectedLength} digits`;
  }
  return null;
}

export function validateAmount(value: string): ValidationResult {
  if (!value) return "Amount is required";
  const num = Number(value);
  if (Number.isNaN(num)) return "Amount must be a number";
  if (num <= 0) return "Amount must be greater than 0";
  if (num > 1_000_000) return "Amount exceeds maximum limit";
  return null;
}
