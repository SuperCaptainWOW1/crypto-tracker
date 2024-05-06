import type { PairSymbol, PairHistoryItem } from "~/types";

export const usePairStore = defineStore("pair", () => {
  const selectedPair = ref<PairSymbol>("BTCUSDT");
  const pairHistory = ref<PairHistoryItem[]>([]);

  return {
    selectedPair,
    pairHistory,
  };
});
