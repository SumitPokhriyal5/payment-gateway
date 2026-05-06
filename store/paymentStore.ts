import { create } from "zustand";
import type { PaymentPayload, PaymentStatus } from "@/types";

interface PaymentState {
  status: PaymentStatus;
  transactionId: string | null;
  attempts: number;
  payload: PaymentPayload | null;
  failureReason: string | null;
}

interface PaymentActions {
  startPayment: (payload: Omit<PaymentPayload, "transactionId">) => string;
  setProcessing: () => void;
  setSuccess: () => void;
  setFailed: (reason: string) => void;
  setTimeout: () => void;
  incrementAttempt: () => void;
  reset: () => void;
}

const initialState: PaymentState = {
  status: "idle",
  transactionId: null,
  attempts: 0,
  payload: null,
  failureReason: null,
};

export const usePaymentStore = create<PaymentState & PaymentActions>((set) => ({
  ...initialState,

  startPayment: (payloadWithoutId) => {
    const transactionId = crypto.randomUUID();
    const payload: PaymentPayload = { ...payloadWithoutId, transactionId };
    set({
      status: "processing",
      transactionId,
      attempts: 1,
      payload,
      failureReason: null,
    });
    return transactionId;
  },

  setProcessing: () => set({ status: "processing", failureReason: null }),

  setSuccess: () => set({ status: "success", failureReason: null }),

  setFailed: (reason) => set({ status: "failed", failureReason: reason }),

  setTimeout: () =>
    set({ status: "timeout", failureReason: "Request timed out" }),

  incrementAttempt: () =>
    set((state) => ({ attempts: state.attempts + 1, status: "processing" })),

  reset: () => set(initialState),
}));
