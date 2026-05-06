import { useCallback } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { useHistoryStore } from "@/store/historyStore";
import { getCardLast4 } from "@/utils/card";
import {
  CLIENT_TIMEOUT_MS,
  PROCESSING_MIN_DURATION_MS,
  MAX_RETRY_ATTEMPTS,
} from "@/utils/constants";
import type {
  CardFormValues,
  GatewayResponse,
  PaymentPayload,
  Transaction,
  TransactionStatus,
} from "@/types";

interface PayInput {
  values: CardFormValues;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGateway(
  payload: PaymentPayload,
  signal: AbortSignal
): Promise<GatewayResponse> {
  const response = await fetch("/api/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Gateway returned ${response.status}`);
  }

  return (await response.json()) as GatewayResponse;
}

export function usePayment() {
  const paymentStore = usePaymentStore();
  const upsertTransaction = useHistoryStore((s) => s.upsertTransaction);

  const buildTransaction = useCallback(
    (
      payload: PaymentPayload,
      attempts: number,
      status: TransactionStatus,
      reason?: string
    ): Transaction => {
      const now = Date.now();
      const existing = useHistoryStore
        .getState()
        .getTransaction(payload.transactionId);

      return {
        id: payload.transactionId,
        amount: payload.amount,
        currency: payload.currency,
        status,
        cardLast4: getCardLast4(payload.cardNumber),
        cardholderName: payload.cardholderName,
        attempts,
        reason,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
    },
    []
  );

  const executeAttempt = useCallback(
    async (payload: PaymentPayload, attemptNumber: number) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

      try {
        const [response] = await Promise.all([
          callGateway(payload, controller.signal),
          delay(PROCESSING_MIN_DURATION_MS),
        ]);

        clearTimeout(timeoutId);

        if (response.outcome === "success") {
          paymentStore.setSuccess();
          upsertTransaction(
            buildTransaction(payload, attemptNumber, "success")
          );
        } else {
          paymentStore.setFailed(response.reason);
          upsertTransaction(
            buildTransaction(payload, attemptNumber, "failed", response.reason)
          );
        }
      } catch (error) {
        clearTimeout(timeoutId);
        const isTimeout =
          error instanceof DOMException && error.name === "AbortError";

        if (isTimeout) {
          paymentStore.setTimeout();
          upsertTransaction(
            buildTransaction(
              payload,
              attemptNumber,
              "timeout",
              "Request timed out"
            )
          );
        } else {
          const message = "Network error. Please try again.";
          paymentStore.setFailed(message);
          upsertTransaction(
            buildTransaction(payload, attemptNumber, "failed", message)
          );
        }
      }
    },
    [paymentStore, upsertTransaction, buildTransaction]
  );

  const pay = useCallback(
    async ({ values }: PayInput) => {
      const transactionId = paymentStore.startPayment({
        cardholderName: values.cardholderName.trim(),
        cardNumber: values.cardNumber.replace(/\s/g, ""),
        expiry: values.expiry,
        cvv: values.cvv,
        amount: Number(values.amount),
        currency: values.currency,
      });

      const payload = usePaymentStore.getState().payload;
      if (!payload) return;

      await executeAttempt(payload, 1);
      void transactionId;
    },
    [paymentStore, executeAttempt]
  );

  const retry = useCallback(async () => {
    const { payload, attempts } = usePaymentStore.getState();
    if (!payload) return;
    if (attempts >= MAX_RETRY_ATTEMPTS) return;

    paymentStore.incrementAttempt();
    await executeAttempt(payload, attempts + 1);
  }, [paymentStore, executeAttempt]);

  const reset = useCallback(() => {
    paymentStore.reset();
  }, [paymentStore]);

  const canRetry =
    (paymentStore.status === "failed" || paymentStore.status === "timeout") &&
    paymentStore.attempts < MAX_RETRY_ATTEMPTS;

  const attemptsLeft = MAX_RETRY_ATTEMPTS - paymentStore.attempts;

  return {
    status: paymentStore.status,
    attempts: paymentStore.attempts,
    failureReason: paymentStore.failureReason,
    transactionId: paymentStore.transactionId,
    maxAttempts: MAX_RETRY_ATTEMPTS,
    canRetry,
    attemptsLeft,
    pay,
    retry,
    reset,
  };
}
