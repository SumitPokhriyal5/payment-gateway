import { useSyncExternalStore } from "react";
import { useHistoryStore } from "@/store/historyStore";

function subscribe(callback: () => void): () => void {
  if (!useHistoryStore.persist.hasHydrated()) {
    void useHistoryStore.persist.rehydrate();
  }
  return useHistoryStore.persist.onFinishHydration(callback);
}

function getSnapshot(): boolean {
  return useHistoryStore.persist.hasHydrated();
}

function getServerSnapshot(): boolean {
  return false;
}

export function useHistoryHydration(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
