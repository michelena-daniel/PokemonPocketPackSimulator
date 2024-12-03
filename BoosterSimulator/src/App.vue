<!-- Updated App.vue with Responsive Drawer -->
<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Pokemon TCG Sim</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        class="desktop-only"
        :class="{ 'active-link': $route.name === 'BoosterPackSimulator' }"
        @click="navigateTo('/')"
      >
        Booster Pack Simulator
      </v-btn>
      <v-btn
        variant="text"
        class="desktop-only"
        :class="{ 'active-link': $route.name === 'Collection' }"
        @click="navigateTo('/collection')"
      >
        Collection
      </v-btn>
    </v-app-bar>

    <!-- Drawer for Mobile -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item link @click="navigateTo('/')">
          <v-list-item-title>Booster Pack Simulator</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="navigateTo('/collection')">
          <v-list-item-title>Collection</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCollectionStore } from '@/stores/collectionStore';

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();
    const drawer = ref(false);
    const collectionStore = useCollectionStore();
    onMounted(() => {
      collectionStore.loadCollection();
    });

    const navigateTo = (path: string) => {
      router.push(path);
      drawer.value = false; // Close drawer after navigation
    };

    return {
      navigateTo,
      drawer,
    };
  },
});
</script>

<style>
/* Optional: Style for active links */
.active-link {
  font-weight: bold;
  color: #1976D2; /* Vuetify's primary color */
}

/* Hide desktop buttons on mobile */
.desktop-only {
  display: none;
}

@media (min-width: 600px) {
  .desktop-only {
    display: inline-flex;
  }
}
</style>
