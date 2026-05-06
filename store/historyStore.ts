import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORAGE_KEYS } from "@/utils/constants";
import type { Transaction } from "@/types";

const MAX_HISTORY_SIZE = 50;

interface HistoryState {
  transactions: Transaction[];
}

interface HistoryActions {
  upsertTransaction: (transaction: Transaction) => void;
  getTransaction: (id: string) => Transaction | undefined;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState & HistoryActions>()(
  persist(
    (set, get) => ({
      transactions: [],

      upsertTransaction: (transaction) =>
        set((state) => {
          const existingIndex = state.transactions.findIndex(
            (t) => t.id === transaction.id
          );

          if (existingIndex >= 0) {
            const updated = [...state.transactions];
            updated[existingIndex] = transaction;
            return { transactions: updated };
          }

          const next = [transaction, ...state.transactions].slice(
            0,
            MAX_HISTORY_SIZE
          );
          return { transactions: next };
        }),

      getTransaction: (id) => get().transactions.find((t) => t.id === id),

      clearHistory: () => set({ transactions: [] }),
    }),
    {
      name: STORAGE_KEYS.TRANSACTIONS,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
