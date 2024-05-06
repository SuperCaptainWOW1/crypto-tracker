import { defineStore } from "pinia";

import type { DepthUpdateEvent, OrderArray, PairSymbol } from "~/types";

export const useOrdersStore = defineStore("orders", () => {
  const asks = ref<OrderArray>([]);
  const bids = ref<OrderArray>([]);
  const limit = ref<100 | 500 | 1000>(100);
  const socket = ref<WebSocket | null>(null);

  const webSocketUrl = computed(
    () =>
      `wss://stream.binance.com:9443/ws/${pairStore.selectedPair.toLowerCase()}@depth`
  );

  const pairStore = usePairStore();

  let previousEventId: number | null = null;
  let isStreamApproved = ref(false);

  function updateOrdersData(
    newOrdersDataArray: OrderArray,
    ordersArrayToUpdate: OrderArray
  ) {
    newOrdersDataArray.forEach((orderToUpdate) => {
      const orderToUpdatePrice = parseFloat(orderToUpdate[0]);
      const orderToUpdateQuantity = parseFloat(orderToUpdate[1]);

      const existingOrderIndex = ordersArrayToUpdate.findIndex(
        (order) => parseFloat(order[0]) === orderToUpdatePrice
      );

      if (existingOrderIndex !== -1) {
        // Filter out all orders with 0 quantity
        if (orderToUpdateQuantity === 0) {
          ordersArrayToUpdate = ordersArrayToUpdate.filter(
            (order) => parseFloat(order[0]) !== orderToUpdatePrice
          );
        } else {
          // Update quantity on exisitng orders
          const existingOrder = ordersArrayToUpdate[existingOrderIndex];
          existingOrder[1] = orderToUpdateQuantity.toString();
        }
      } else if (orderToUpdateQuantity !== 0) {
        // Add new orders
        ordersArrayToUpdate.push([
          orderToUpdatePrice.toString(),
          orderToUpdateQuantity.toString(),
        ]);
      }
    });

    return sortOrdersData(ordersArrayToUpdate);
  }

  function sortOrdersData(ordersArrayToSort: OrderArray) {
    return ordersArrayToSort
      .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
      .slice(0, limit.value);
  }

  return {
    asks,
    bids,
    limit,
    isStreamApproved,

    connectSocket() {
      socket.value = new WebSocket(webSocketUrl.value);
    },
    closeSocket() {
      if (socket.value) {
        socket.value.close();
      } else {
        console.warn("Socket is already closed");
      }
    },

    clearOrdersData() {
      bids.value = [];
      asks.value = [];
    },
    async getOrdersData(currentPair: PairSymbol) {
      if (socket.value === null) {
        console.error("socket is null");
        return;
      }

      const depthSnapshot = await (
        await fetch(
          `https://api.binance.com/api/v3/depth?symbol=${currentPair}&limit=${limit.value}`
        )
      ).json();

      bids.value = sortOrdersData(depthSnapshot.bids);
      asks.value = sortOrdersData(depthSnapshot.asks);

      isStreamApproved.value = false;

      socket.value.onmessage = (newEvent) => {
        const newEventData: DepthUpdateEvent = JSON.parse(newEvent.data);

        // The first processed event should have U <= lastUpdateId+1 AND u >= lastUpdateId+1.
        if (
          !isStreamApproved.value &&
          !(
            newEventData.U <= depthSnapshot.lastUpdateId + 1 &&
            newEventData.u >= depthSnapshot.lastUpdateId + 1
          )
        ) {
          isStreamApproved.value = true;
          return;
        }

        if (
          // Drop any event where u is <= lastUpdateId in the snapshot.
          newEventData.u <= depthSnapshot.lastUpdateId &&
          // each new event's U should be equal to the previous event's u+1.
          previousEventId !== null &&
          newEventData.U !== previousEventId + 1
        ) {
          previousEventId = newEventData.u;
          return;
        }

        previousEventId = newEventData.u;

        bids.value = updateOrdersData(newEventData.b, bids.value);
        asks.value = updateOrdersData(newEventData.a, asks.value);
      };
    },
  };
});
