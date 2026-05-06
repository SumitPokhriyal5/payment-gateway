import type { CardFormValues } from "./card";

export type PaymentStatus =
  | "idle"
  | "processing"
  | "success"
  | "failed"
  | "timeout";

export interface PaymentPayload {
  transactionId: string;
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: number;
  currency: CardFormValues["currency"];
}

export type GatewayResponse =
  | { outcome: "success"; transactionId: string }
  | { outcome: "failed"; transactionId: string; reason: string };
