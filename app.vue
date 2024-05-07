<template>
  <v-app>
    <v-container
      class="d-flex align-center justify-center"
      style="height: 60px"
    >
      <h1 class="text-h5 font-weight-bold">
        <v-icon icon="$vuetify"></v-icon>
        Crypto Tracker
      </h1>
    </v-container>

    <v-divider />

    <v-container style="height: 60px">
      <div class="d-flex align-center justify-center ga-5">
        <BaseRouterButton to="/">Order book</BaseRouterButton>
        <BaseRouterButton to="/settings">Settings</BaseRouterButton>
      </div>
    </v-container>

    <v-container>
      <NuxtPage />
    </v-container>
  </v-app>
</template>
