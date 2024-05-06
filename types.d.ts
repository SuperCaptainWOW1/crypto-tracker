export type Order = [string, string];
export type OrderArray = Order[];

export type PairSymbol = "BTCUSDT" | "BNBBTC" | "ETHBTC";

export interface DepthUpdateEvent {
  e: "depthUpdate";
  E: number; // Event time
  s: PairSymbol;
  U: number; // First update ID in event
  u: number; // Final update ID in event
  b: OrderArray;
  a: OrderArray;
}

export interface PairHistoryItem {
  id: number;
  from: PairSymbol;
  to: PairSymbol;
  time: string;
}
