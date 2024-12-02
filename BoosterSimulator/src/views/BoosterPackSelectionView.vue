<template>
  <v-container>
    <!-- Title Section -->
    <v-row justify="center" class="my-8">
      <v-col cols="12" class="text-center">
        <v-text variant="h3" class="font-weight-bold">
          Pokemon TCG Pocket Booster Simulator
        </v-text>
      </v-col>
    </v-row>
    <v-row justify="space-between" align="center">
      <!-- Booster Pack 1 -->
      <v-col cols="12" sm="4" class="d-flex justify-center">
        <v-card class="booster-pack-card" @click="selectBoosterPack('pack1')">
          <v-img
            :src="boosterPack1"
            alt="Genetic Apex Mewtwo Booster Pack"
            class="booster-pack-image"
          ></v-img>
        </v-card>
      </v-col>

      <!-- Booster Pack 2 -->
      <v-col cols="12" sm="4" class="d-flex justify-center">
        <v-card class="booster-pack-card" @click="selectBoosterPack('pack2')">
          <v-img
            :src="boosterPack2"
            alt="Genetic Apex Charizard Booster Pack"
            class="booster-pack-image"
          ></v-img>
        </v-card>
      </v-col>

      <!-- Booster Pack 3 -->
      <v-col cols="12" sm="4" class="d-flex justify-center">
        <v-card class="booster-pack-card" @click="selectBoosterPack('pack3')">
          <v-img
            :src="boosterPack3"
            alt="Genetic Apex Pikachu Booster Pack"
            class="booster-pack-image"
          ></v-img>
        </v-card>
      </v-col>
    </v-row>

    <!-- Selected Cards Modal -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="headline">Your Booster Pack Cards</v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              v-for="(card, index) in selectedCards"
              :key="index"
              cols="6"
              sm="4"
              md="2"
              class="d-flex justify-center mb-4"
            >
              <v-card class="card-image-container">
                <v-img :src="card.imageUrl" :alt="card.Card" class="card-image"></v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import cardsData from '@/data/cards.json';

import boosterPack1 from '@/assets/Images/genetic-apex-mewtwo-booster.png';
import boosterPack2 from '@/assets/Images/genetic-apex-charizard-booster.png';
import boosterPack3 from '@/assets/Images/genetic-apex-pikachu-booster.png';

interface Card {
  CardId: string;
  Card: string;
  Pack: string;
  Rarity: string;
  Cards1to3: string;
  FourthCard: string;
  FifthCard: string;
  imageUrl: string;
}

export default defineComponent({
  name: 'BoosterPackSelectionView',
  data() {
    return {
      boosterPack1,
      boosterPack2,
      boosterPack3,
      selectedCards: [] as Card[],
      dialog: false,
    };
  },
  methods: {
    /**
     * Handles the selection of a booster pack.
     * @param pack - The identifier of the selected booster pack.
     */
    selectBoosterPack(pack: string) {
      console.log(`Selected booster pack: ${pack}`);

      // Select 5 random cards
      this.selectedCards = this.getRandomCards(5);

      // Open the modal to display selected cards
      this.dialog = true;
    },

    /**
     * Selects a specified number of random cards from the JSON data.
     * @param count - Number of cards to select.
     * @returns An array of randomly selected card objects.
     */
    getRandomCards(count: number): Card[] {
      // Implementing Fisher-Yates Shuffle for uniform randomness
      const shuffled = [...cardsData] as Card[];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    },
  },
});
</script>

<style scoped>
.booster-pack-card {
  cursor: pointer;
  width: 200px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.booster-pack-card:hover {
  transform: scale(1.05);
}

.booster-pack-image {
  object-fit: cover;
  height: 100%;
}

.card-image-container {
  width: 100%;
  height: 0;
  padding-bottom: 140%; /* Adjusts aspect ratio */
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
