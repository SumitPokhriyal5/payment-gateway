export type CardType = "visa" | "mastercard" | "amex" | "unknown";

export type Currency = "INR" | "USD";

export interface CardFormValues {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: string;
  currency: Currency;
}

export type CardFormField = keyof CardFormValues;

export type CardFormErrors = Partial<Record<CardFormField, string>>;

export type CardFormTouched = Partial<Record<CardFormField, boolean>>;
