import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/formatters";
import { StatusBadge } from "./StatusBadge";
import type { Transaction } from "@/types";

interface TransactionDetailProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatFullTimestamp(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "medium",
  });
}

export function TransactionDetail({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Full record for this payment attempt.
          </DialogDescription>
        </DialogHeader>

        {transaction ? (
          <dl className="mt-2 grid grid-cols-3 gap-y-3 text-sm">
            <dt className="text-slate-500">Status</dt>
            <dd className="col-span-2">
              <StatusBadge status={transaction.status} />
            </dd>

            <dt className="text-slate-500">Amount</dt>
            <dd className="col-span-2 font-medium">
              {formatCurrency(transaction.amount, transaction.currency)}
            </dd>

            <dt className="text-slate-500">Cardholder</dt>
            <dd className="col-span-2">{transaction.cardholderName}</dd>

            <dt className="text-slate-500">Card</dt>
            <dd className="col-span-2 font-mono">
              •••• •••• •••• {transaction.cardLast4}
            </dd>

            <dt className="text-slate-500">Attempts</dt>
            <dd className="col-span-2">{transaction.attempts}</dd>

            {transaction.reason ? (
              <>
                <dt className="text-slate-500">Reason</dt>
                <dd className="col-span-2">{transaction.reason}</dd>
              </>
            ) : null}

            <dt className="text-slate-500">Created</dt>
            <dd className="col-span-2">
              {formatFullTimestamp(transaction.createdAt)}
            </dd>

            <dt className="text-slate-500">Updated</dt>
            <dd className="col-span-2">
              {formatFullTimestamp(transaction.updatedAt)}
            </dd>

            <dt className="text-slate-500">ID</dt>
            <dd className="col-span-2 break-all font-mono text-xs">
              {transaction.id}
            </dd>
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
