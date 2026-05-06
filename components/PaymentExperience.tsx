"use client";

import { useCallback, useState } from "react";
import { Lock } from "lucide-react";
import { PaymentForm } from "@/components/form/PaymentForm";
import { CardPreview } from "@/components/preview/CardPreview";
import { StatusScreen } from "@/components/status/StatusScreen";
import { TransactionHistory } from "@/components/history/TransactionHistory";
import { SkipLink } from "@/components/SkipLink";
import { usePayment } from "@/hooks";
import type { CardFormValues, PaymentStatus } from "@/types";

const initialValues: CardFormValues = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  amount: "",
  currency: "INR",
};

type SettledStatus = Exclude<PaymentStatus, "idle">;

export function PaymentExperience() {
  const [values, setValues] = useState<CardFormValues>(initialValues);
  const payment = usePayment();

  const showStatus = payment.status !== "idle";
  const amount = values.amount ? Number(values.amount) : null;

  const handleReset = useCallback(() => {
    payment.reset();
    setValues(initialValues);
  }, [payment]);

  return (
    <div className="min-h-screen bg-slate-50">
      <SkipLink />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-4 sm:px-6">
          <Lock className="h-4 w-4 text-slate-700" aria-hidden />
          <span className="text-sm font-semibold text-slate-900">
            Secure Checkout
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-10">
          <section
            aria-labelledby="payment-heading"
            className="order-2 lg:order-1"
          >
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h1
                id="payment-heading"
                className="mb-5 text-xl font-semibold text-slate-900"
              >
                {showStatus ? "Payment Status" : "Payment Details"}
              </h1>

              {showStatus ? (
                <StatusScreen
                  status={payment.status as SettledStatus}
                  attempts={payment.attempts}
                  failureReason={payment.failureReason}
                  transactionId={payment.transactionId}
                  amount={amount}
                  currency={values.currency}
                  canRetry={payment.canRetry}
                  onRetry={payment.retry}
                  onReset={handleReset}
                />
              ) : (
                <PaymentForm onValuesChange={setValues} />
              )}
            </div>
          </section>

          <aside
            aria-label="Card preview"
            className="order-1 lg:order-2 lg:sticky lg:top-6"
          >
            <div className="flex justify-center lg:justify-end">
              <CardPreview
                cardNumber={values.cardNumber}
                cardholderName={values.cardholderName}
                expiry={values.expiry}
              />
            </div>
          </aside>
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <TransactionHistory />
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-slate-500 sm:px-6">
          Mock payment gateway · No real transactions are processed
        </div>
      </footer>
    </div>
  );
}
