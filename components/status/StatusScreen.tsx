"use client";

import { useEffect, useRef } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MAX_RETRY_ATTEMPTS } from "@/utils/constants";
import { formatCurrency } from "@/utils/formatters";
import type { PaymentStatus, Currency } from "@/types";

interface StatusScreenProps {
  status: Exclude<PaymentStatus, "idle">;
  attempts: number;
  failureReason: string | null;
  transactionId: string | null;
  amount: number | null;
  currency: Currency | null;
  canRetry: boolean;
  onRetry: () => void;
  onReset: () => void;
}

interface VariantConfig {
  icon: typeof CheckCircle2;
  iconClass: string;
  title: string;
  tone: "success" | "error" | "info";
}

const VARIANTS: Record<StatusScreenProps["status"], VariantConfig> = {
  processing: {
    icon: Loader2,
    iconClass: "text-slate-500 animate-spin",
    title: "Processing payment…",
    tone: "info",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-green-600",
    title: "Payment successful",
    tone: "success",
  },
  failed: {
    icon: XCircle,
    iconClass: "text-red-600",
    title: "Payment failed",
    tone: "error",
  },
  timeout: {
    icon: Clock,
    iconClass: "text-amber-600",
    title: "Request timed out",
    tone: "error",
  },
};

const TONE_BG: Record<VariantConfig["tone"], string> = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  info: "bg-slate-50 border-slate-200",
};

export function StatusScreen({
  status,
  attempts,
  failureReason,
  transactionId,
  amount,
  currency,
  canRetry,
  onRetry,
  onReset,
}: StatusScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const variant = VARIANTS[status];
  const Icon = variant.icon;

  const isProcessing = status === "processing";
  const isFinalFailure =
    (status === "failed" || status === "timeout") &&
    attempts >= MAX_RETRY_ATTEMPTS;

  useEffect(() => {
    headingRef.current?.focus();
  }, [status]);

  const formattedAmount =
    amount !== null && currency !== null
      ? formatCurrency(amount, currency)
      : null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("rounded-xl border p-6 text-center", TONE_BG[variant.tone])}
    >
      <div className="flex flex-col items-center gap-3">
        <Icon className={cn("h-12 w-12", variant.iconClass)} aria-hidden />

        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-semibold focus:outline-none"
        >
          {variant.title}
        </h2>

        {formattedAmount ? (
          <p className="text-lg font-medium text-slate-700">
            {formattedAmount}
          </p>
        ) : null}

        {status === "failed" && failureReason ? (
          <p className="text-sm text-slate-700">{failureReason}</p>
        ) : null}

        {status === "timeout" ? (
          <p className="text-sm text-slate-700">
            We didn&apos;t hear back from the gateway in time.
          </p>
        ) : null}

        {transactionId && status !== "processing" ? (
          <p className="font-mono text-xs text-slate-500">
            ID: {transactionId.slice(0, 8)}…
          </p>
        ) : null}

        {!isProcessing &&
        !isFinalFailure &&
        (status === "failed" || status === "timeout") ? (
          <p className="text-sm font-medium text-slate-600">
            Attempt {attempts} of {MAX_RETRY_ATTEMPTS}
          </p>
        ) : null}

        {isFinalFailure ? (
          <div className="mt-2 flex items-center gap-2 rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            <span>
              Maximum {MAX_RETRY_ATTEMPTS} attempts reached. Please start over.
            </span>
          </div>
        ) : null}

        {!isProcessing ? (
          <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            {canRetry ? (
              <Button onClick={onRetry} className="sm:min-w-[140px]">
                Retry payment
              </Button>
            ) : null}
            {status === "success" || isFinalFailure || !canRetry ? (
              <Button
                variant={status === "success" ? "default" : "outline"}
                onClick={onReset}
                className="sm:min-w-[140px]"
              >
                {status === "success" ? "Make another payment" : "Start over"}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={onReset}
                className="sm:min-w-[140px]"
              >
                Cancel
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
