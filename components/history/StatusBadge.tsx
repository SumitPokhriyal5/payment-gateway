import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/types";

interface StatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

const CONFIG: Record<
  TransactionStatus,
  { label: string; className: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    label: "Success",
    className: "bg-green-100 text-green-800 border-green-200",
    Icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800 border-red-200",
    Icon: XCircle,
  },
  timeout: {
    label: "Timeout",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    Icon: Clock,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, className: toneClass, Icon } = CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        toneClass,
        className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}
