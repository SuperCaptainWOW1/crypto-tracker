<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import { toFixedDigits } from "@/utils";
import type { OrderArray } from "~/types";

defineProps<{
  orders: OrderArray;
  type: "bid" | "ask";
}>();

const ordersStore = useOrdersStore();

const { width } = useWindowSize();
</script>

<template>
  <div
    v-if="orders.length === 0 || !ordersStore.isStreamApproved"
    class="h-100 w-100 d-flex align-center justify-center"
  >
    <v-progress-circular color="indigo-accent-2 " indeterminate />
  </div>

  <v-table
    v-else
    class="h-100 rounded-lg scrollbar-wrapper"
    fixed-header
    density="compact"
  >
    <thead>
      <tr>
        <th class="text-left">Price</th>
        <th class="text-left">Quantity</th>
        <th v-if="width > 772" class="text-left">Total</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="order in orders" :key="order[0] + order[1]">
        <td
          :class="type === 'bid' ? 'text-green-accent-4' : 'text-red-accent-2'"
        >
          {{ toFixedDigits(order[0], 7) }}
        </td>
        <td>{{ toFixedDigits(order[1], 7) }}</td>
        <td v-if="width > 772">
          {{ toFixedDigits(parseFloat(order[0]) * parseFloat(order[1]), 10) }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style>
/* Make table cells smaller to fir in on mobile */
@media (max-width: 400px) {
  td,
  th {
    padding-left: 8px !important;
    padding-right: 0 !important;
  }
}

@media (max-width: 500px) {
  td,
  th {
    padding-left: 10px !important;
    padding-right: 2px !important;
  }
}
</style>
