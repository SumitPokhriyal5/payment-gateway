import type { Currency } from "./card";
import type { PaymentStatus } from "./payment";

export type TransactionStatus = Exclude<PaymentStatus, "idle" | "processing">;

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  cardLast4: string;
  cardholderName: string;
  attempts: number;
  reason?: string;
  createdAt: number;
  updatedAt: number;
}
