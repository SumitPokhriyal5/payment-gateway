import { formatCurrency } from "@/utils/formatters";
import { StatusBadge } from "./StatusBadge";
import type { Transaction } from "@/types";

interface TransactionRowProps {
  transaction: Transaction;
  onClick: () => void;
}

function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function TransactionRow({ transaction, onClick }: TransactionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-500">
            {transaction.id.slice(0, 8)}…
          </span>
          <StatusBadge status={transaction.status} />
        </div>
        <div className="mt-1 truncate text-sm text-slate-700">
          {transaction.cardholderName} ·{" "}
          <span className="font-mono">•••• {transaction.cardLast4}</span>
        </div>
        <div className="mt-0.5 text-xs text-slate-500">
          {formatTimestamp(transaction.updatedAt)}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-semibold text-slate-900">
          {formatCurrency(transaction.amount, transaction.currency)}
        </div>
        {transaction.attempts > 1 ? (
          <div className="text-xs text-slate-500">
            {transaction.attempts} attempts
          </div>
        ) : null}
      </div>
    </button>
  );
}
