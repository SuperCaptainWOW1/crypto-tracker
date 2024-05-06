<script setup lang="ts">
defineProps<{
  to: string;
}>();

const route = useRoute();
</script>

<template>
  <v-btn
    :class="{
      'bg-indigo-accent-2': route.path === to,
    }"
    variant="flat"
    rounded="lg"
    @click="navigateTo(to)"
  >
    <slot />
  </v-btn>
</template>
