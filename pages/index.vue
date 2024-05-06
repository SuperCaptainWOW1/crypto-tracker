<script setup lang="ts">
const ordersStore = useOrdersStore();
const pairStore = usePairStore();

onMounted(() => {
  ordersStore.connectSocket();
  ordersStore.getOrdersData(pairStore.selectedPair);
});
onUnmounted(() => {
  ordersStore.closeSocket();

  ordersStore.clearOrdersData();
});

watch(
  () => ordersStore.limit,
  () => {
    ordersStore.closeSocket();
    ordersStore.clearOrdersData();

    ordersStore.connectSocket();
    ordersStore.getOrdersData(pairStore.selectedPair);
  }
);
</script>

<template>
  <div class="d-flex flex-column align-center">
    <div class="d-flex align-center pb-3" style="height: 60px">
      Number of elements:
      <v-select
        class="ml-3"
        v-model="ordersStore.limit"
        hide-details
        :items="[100, 500, 1000]"
        variant="outlined"
        density="compact"
        style="width: 100px"
      />
    </div>

    <div class="w-100 d-flex">
      <p
        class="text-h6 font-weight-medium position-absolute text-disabled"
        style="translate: -50%; left: 50%"
      >
        {{ pairStore.selectedPair }}
      </p>

      <!-- Subtract every height and padding above to take the remaining space -->
      <v-row
        class="pb-4"
        style="height: calc(100vh - 120px - 120px - 1px - 16px - 12px)"
      >
        <v-col cols="6" class="h-100">
          <p class="text-h6 font-weight-medium text-left">Buy Order</p>

          <OrdersTable :orders="ordersStore.bids" type="bid" />
        </v-col>
        <v-col cols="6" class="h-100">
          <p class="text-h6 font-weight-medium text-right">Sell Order</p>

          <OrdersTable :orders="ordersStore.asks" type="ask" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
