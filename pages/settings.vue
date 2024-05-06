<script setup lang="ts">
import { usePairStore } from "~/stores/pair";

const pairStore = usePairStore();

watch(
  () => pairStore.selectedPair,
  (selectedPairNew, selectedPairOld) => {
    if (selectedPairOld) {
      const date = new Date();

      pairStore.pairHistory.push({
        id: Date.now(),
        from: selectedPairOld,
        to: selectedPairNew,
        time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      });
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <span>Current pair</span>
  <v-select
    v-model="pairStore.selectedPair"
    class="flex-0-0"
    hide-details
    density="comfortable"
    :items="['BTCUSDT', 'BNBBTC', 'ETHBTC']"
    variant="outlined"
    style="width: 140px"
  />

  <p class="mt-3 mb-1 text-subtitle-1">History</p>
  <v-table class="rounded-lg" fixed-header density="compact">
    <thead>
      <tr>
        <th class="text-left">From</th>
        <th class="text-left">To</th>
        <th class="text-left">Time</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="pairItem in pairStore.pairHistory" :key="pairItem.id">
        <td>{{ pairItem.from }}</td>
        <td>{{ pairItem.to }}</td>
        <td>
          {{ pairItem.time }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
