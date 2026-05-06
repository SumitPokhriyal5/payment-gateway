"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/store/historyStore";
import { useHistoryHydration } from "@/hooks";
import { TransactionRow } from "./TransactionRow";
import { TransactionDetail } from "./TransactionDetail";
import type { Transaction } from "@/types";

export function TransactionHistory() {
  const hydrated = useHistoryHydration();
  const transactions = useHistoryStore((s) => s.transactions);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = transactions.find((t) => t.id === selectedId) ?? null;

  if (!hydrated) {
    return (
      <section
        aria-labelledby="history-heading"
        className="flex flex-col gap-3"
      >
        <h2 id="history-heading" className="text-lg font-semibold">
          Transaction History
        </h2>
        <div className="space-y-2">
          <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="history-heading" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 id="history-heading" className="text-lg font-semibold">
          Transaction History
        </h2>
        {transactions.length > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-xs text-slate-500 hover:text-slate-900"
          >
            Clear all
          </Button>
        ) : null}
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          No transactions yet. Complete a payment to see it here.
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-3">
          <div className="flex flex-col gap-2">
            {transactions.map((t: Transaction) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                onClick={() => setSelectedId(t.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <TransactionDetail
        transaction={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </section>
  );
}
