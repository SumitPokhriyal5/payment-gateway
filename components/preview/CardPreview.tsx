import { cn } from "@/lib/utils";
import { detectCardType } from "@/utils/card";
import { formatCardNumber } from "@/utils/formatters";
import type { CardType } from "@/types";

interface CardPreviewProps {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  className?: string;
}

const BRAND_GRADIENTS: Record<CardType, string> = {
  visa: "from-blue-700 via-blue-800 to-indigo-900",
  mastercard: "from-orange-600 via-red-700 to-rose-900",
  amex: "from-sky-600 via-sky-700 to-slate-800",
  unknown: "from-slate-700 via-slate-800 to-slate-900",
};

const BRAND_LABEL: Record<CardType, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMERICAN EXPRESS",
  unknown: "",
};

function getDisplayNumber(rawValue: string, type: CardType): string {
  const formatted = formatCardNumber(rawValue);
  if (formatted) return padDisplayNumber(formatted, type);

  return type === "amex" ? "•••• •••••• •••••" : "•••• •••• •••• ••••";
}

function padDisplayNumber(formatted: string, type: CardType): string {
  const template =
    type === "amex" ? "•••• •••••• •••••" : "•••• •••• •••• ••••";

  if (formatted.length >= template.length) return formatted;
  return formatted + template.slice(formatted.length);
}

export function CardPreview({
  cardNumber,
  cardholderName,
  expiry,
  className,
}: CardPreviewProps) {
  const type = detectCardType(cardNumber);
  const displayNumber = getDisplayNumber(cardNumber, type);
  const displayName = cardholderName.trim() || "YOUR NAME";
  const displayExpiry = expiry || "MM/YY";

  return (
    <div
      role="img"
      aria-label="Card preview"
      className={cn(
        "relative aspect-[1.586/1] w-full max-w-sm overflow-hidden rounded-2xl bg-linear-to-br p-6 text-white shadow-2xl",
        BRAND_GRADIENTS[type],
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="h-9 w-12 rounded-md bg-linear-to-br from-yellow-300 to-yellow-500 shadow-inner" />
          <span className="text-sm font-semibold tracking-wider opacity-90">
            {BRAND_LABEL[type]}
          </span>
        </div>

        <div className="font-mono text-xl tracking-[0.15em] sm:text-2xl">
          {displayNumber}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider opacity-70">
              Cardholder
            </div>
            <div className="truncate text-sm font-medium uppercase tracking-wide">
              {displayName}
            </div>
          </div>
          <div className="shrink-0">
            <div className="text-[10px] uppercase tracking-wider opacity-70">
              Expires
            </div>
            <div className="text-sm font-medium tracking-wide">
              {displayExpiry}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
