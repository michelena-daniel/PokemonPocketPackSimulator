<!-- src/components/Collection.vue -->
<template>
    <v-container>
      <!-- Collection Header -->
      <v-row justify="center" class="my-8">
        <v-col cols="12" class="d-flex justify-center">
          <v-card class="title-card" outlined>
            <v-card-title class="text-center text-white">
              <span class="title-text">
                Your Collection
              </span>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>

     <!-- Alternative Completion Indicator -->
    <v-row justify="center" class="my-4">
    <v-col cols="12" sm="8" md="6">
        <v-card>
        <v-card-text class="d-flex justify-center align-center">
            <v-progress-circular
            :value="parseFloat(completionPercentage)"
            size="100"
            width="10"
            color="green"
            >
            {{ completionPercentage }}%
            </v-progress-circular>
        </v-card-text>
        <v-card-actions class="justify-center">
            <span>{{ collectedCards }} / 286 cards collected</span>
        </v-card-actions>
        </v-card>
    </v-col>
    </v-row>
  
      <!-- Collection Content -->
      <v-row>
        <v-col cols="12">
          <!-- Grid of Collected Cards -->
          <v-row>
            <v-col
              v-for="card in collectionStore.collectionCards"
              :key="card.uniqueId"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card class="collection-card">
                <v-img
                  :src="card.imageUrl"
                  :alt="card.card"
                  height="200px"
                ></v-img>
                <v-card-title>{{ card.card }}</v-card-title>
                <v-card-subtitle>Rarity: {{ card.rarity }}</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed  } from 'vue';
  import { useCollectionStore } from '@/stores/collectionStore';
  
  export default defineComponent({
    name: 'CollectionView',
    setup() {
      const collectionStore = useCollectionStore();
      const totalCards = 286;
      const collectedCards = computed(() => collectionStore.collectionCards.length);

      // Calculate completion percentage
    const completionPercentage = computed(() => {
      return ((collectedCards.value / totalCards) * 100).toFixed(2); // Fixed to 2 decimal places
    });
      
      return {
        collectionStore,
        totalCards,
        collectedCards,
        completionPercentage,
      };
    },
  });
  </script>
  
  <style scoped>
  .title-card {
    background: linear-gradient(135deg, #4caf50, #81c784);
    color: #fff;
    border-radius: 16px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
    padding: 16px;
  }
  
  .title-text {
    font-weight: bold;
    font-size: 1.1rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .collection-card {
    transition: transform 0.2s;
  }
  
  .collection-card:hover {
    transform: scale(1.05);
  }

  .d-flex.align-center {
  display: flex;
  align-items: center;
  }
  </style>
  