import { cn } from "@/lib/utils";
import type { CardType } from "@/types";

interface CardBrandBadgeProps {
  type: CardType;
  className?: string;
}

const BRAND_LABELS: Record<CardType, string> = {
  visa: "VISA",
  mastercard: "MC",
  amex: "AMEX",
  unknown: "",
};

const BRAND_STYLES: Record<CardType, string> = {
  visa: "bg-blue-600 text-white",
  mastercard: "bg-orange-500 text-white",
  amex: "bg-sky-700 text-white",
  unknown: "bg-transparent text-transparent",
};

export function CardBrandBadge({ type, className }: CardBrandBadgeProps) {
  if (type === "unknown") return null;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-bold tracking-wide",
        BRAND_STYLES[type],
        className
      )}
      aria-label={`${BRAND_LABELS[type]} card`}
    >
      {BRAND_LABELS[type]}
    </span>
  );
}
