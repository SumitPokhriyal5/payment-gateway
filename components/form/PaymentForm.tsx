"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  CardholderNameInput,
  CardInput,
  ExpiryInput,
  CVVInput,
  AmountInput,
} from "@/components/form";
import { useCardForm, usePayment } from "@/hooks";
import type { CardFormValues } from "@/types";

interface PaymentFormProps {
  onValuesChange?: (values: CardFormValues) => void;
}

export function PaymentForm({ onValuesChange }: PaymentFormProps) {
  const form = useCardForm();
  const payment = usePayment();
  const submitRef = useRef<HTMLButtonElement>(null);

  const isLocked = payment.status !== "idle";
  const isProcessing = payment.status === "processing";

  useEffect(() => {
    onValuesChange?.(form.values);
  }, [form.values, onValuesChange]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.isValid) {
      form.touchAll();
      return;
    }
    if (isLocked) return;

    await payment.pay({ values: form.values });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4"
      aria-busy={isProcessing}
    >
      <CardholderNameInput
        value={form.values.cardholderName}
        error={form.errors.cardholderName}
        disabled={isLocked}
        onChange={(v) => form.setField("cardholderName", v)}
        onBlur={() => form.handleBlur("cardholderName")}
      />

      <CardInput
        value={form.values.cardNumber}
        error={form.errors.cardNumber}
        disabled={isLocked}
        onChange={(v) => form.setField("cardNumber", v)}
        onBlur={() => form.handleBlur("cardNumber")}
      />

      <div className="grid grid-cols-2 gap-3">
        <ExpiryInput
          value={form.values.expiry}
          error={form.errors.expiry}
          disabled={isLocked}
          onChange={(v) => form.setField("expiry", v)}
          onBlur={() => form.handleBlur("expiry")}
        />
        <CVVInput
          value={form.values.cvv}
          cardNumber={form.values.cardNumber}
          error={form.errors.cvv}
          disabled={isLocked}
          onChange={(v) => form.setField("cvv", v)}
          onBlur={() => form.handleBlur("cvv")}
        />
      </div>

      <AmountInput
        amount={form.values.amount}
        currency={form.values.currency}
        error={form.errors.amount}
        disabled={isLocked}
        onAmountChange={(v) => form.setField("amount", v)}
        onCurrencyChange={form.setCurrency}
        onBlur={() => form.handleBlur("amount")}
      />

      <Button
        ref={submitRef}
        type="submit"
        disabled={!form.isValid || isLocked}
        className="mt-2 w-full"
      >
        {isProcessing ? "Processing…" : "Pay Now"}
      </Button>
    </form>
  );
}
