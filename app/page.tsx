"use client";

import { useState } from "react";
import { PaymentForm } from "@/components/form/PaymentForm";
import { CardPreview } from "@/components/preview/CardPreview";
import type { CardFormValues } from "@/types";

const initialValues: CardFormValues = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  amount: "",
  currency: "INR",
};

export default function Home() {
  const [values, setValues] = useState<CardFormValues>(initialValues);

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <h1 className="mb-6 text-2xl font-semibold">Payment</h1>
          <PaymentForm onValuesChange={setValues} />
        </div>
        <div className="flex justify-center lg:flex-1 lg:pt-12">
          <CardPreview
            cardNumber={values.cardNumber}
            cardholderName={values.cardholderName}
            expiry={values.expiry}
          />
        </div>
      </div>
    </main>
  );
}
