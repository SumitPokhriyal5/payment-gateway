import { useCallback, useMemo, useState } from "react";
import {
  validateCardholderName,
  validateCardNumber,
  validateExpiry,
  validateCVV,
  validateAmount,
  formatCardNumber,
  formatExpiry,
  formatAmount,
} from "@/utils";
import type {
  CardFormValues,
  CardFormField,
  CardFormErrors,
  CardFormTouched,
} from "@/types";

const initialValues: CardFormValues = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  amount: "",
  currency: "INR",
};

function validateField(
  field: CardFormField,
  values: CardFormValues
): string | null {
  switch (field) {
    case "cardholderName":
      return validateCardholderName(values.cardholderName);
    case "cardNumber":
      return validateCardNumber(values.cardNumber);
    case "expiry":
      return validateExpiry(values.expiry);
    case "cvv":
      return validateCVV(values.cvv, values.cardNumber);
    case "amount":
      return validateAmount(values.amount);
    case "currency":
      return null;
  }
}

function validateAll(values: CardFormValues): CardFormErrors {
  const errors: CardFormErrors = {};
  (Object.keys(values) as CardFormField[]).forEach((field) => {
    const error = validateField(field, values);
    if (error) errors[field] = error;
  });
  return errors;
}

export function useCardForm() {
  const [values, setValues] = useState<CardFormValues>(initialValues);
  const [touched, setTouched] = useState<CardFormTouched>({});

  const errors = useMemo(() => validateAll(values), [values]);
  const isValid = Object.keys(errors).length === 0;

  const setField = useCallback((field: CardFormField, rawValue: string) => {
    setValues((prev) => {
      let value = rawValue;
      if (field === "cardNumber") value = formatCardNumber(rawValue);
      else if (field === "expiry") value = formatExpiry(rawValue);
      else if (field === "amount") value = formatAmount(rawValue);
      else if (field === "cvv") value = rawValue.replace(/\D/g, "").slice(0, 4);

      return { ...prev, [field]: value };
    });
  }, []);

  const setCurrency = useCallback((currency: CardFormValues["currency"]) => {
    setValues((prev) => ({ ...prev, currency }));
  }, []);

  const handleBlur = useCallback((field: CardFormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const visibleErrors = useMemo<CardFormErrors>(() => {
    const result: CardFormErrors = {};
    (Object.keys(errors) as CardFormField[]).forEach((field) => {
      if (touched[field]) result[field] = errors[field];
    });
    return result;
  }, [errors, touched]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
  }, []);

  const touchAll = useCallback(() => {
    setTouched({
      cardholderName: true,
      cardNumber: true,
      expiry: true,
      cvv: true,
      amount: true,
      currency: true,
    });
  }, []);

  return {
    values,
    errors: visibleErrors,
    isValid,
    setField,
    setCurrency,
    handleBlur,
    touchAll,
    reset,
  };
}
