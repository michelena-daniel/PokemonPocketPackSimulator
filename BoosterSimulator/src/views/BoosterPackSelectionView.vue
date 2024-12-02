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
        <v-card class="booster-pack-card" @click="selectBoosterPack('Mewtwo')">
          <v-img
            :src="boosterPack1"
            alt="Genetic Apex Mewtwo Booster Pack"
            class="booster-pack-image"
          ></v-img>
        </v-card>
      </v-col>

      <!-- Booster Pack 2 -->
      <v-col cols="12" sm="4" class="d-flex justify-center">
        <v-card class="booster-pack-card" @click="selectBoosterPack('Charizard')">
          <v-img
            :src="boosterPack2"
            alt="Genetic Apex Charizard Booster Pack"
            class="booster-pack-image"
          ></v-img>
        </v-card>
      </v-col>

      <!-- Booster Pack 3 -->
      <v-col cols="12" sm="4" class="d-flex justify-center">
        <v-card class="booster-pack-card" @click="selectBoosterPack('Pikachu')">
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

export const rarityProbabilities4th: { rarity: string; probability: number }[] = [
  { rarity: '♢♢', probability: 90 },
  { rarity: '♢♢♢', probability: 5 },
  { rarity: '♢♢♢♢', probability: 1.666 },
  { rarity: '☆', probability: 2.572 },
  { rarity: '☆☆', probability: 0.5 },
  { rarity: '☆☆☆', probability: 0.222 },
  { rarity: '♛', probability: 0.04 },
];

export const rarityProbabilities5th: { rarity: string; probability: number }[] = [
  { rarity: '♢♢', probability: 60 },
  { rarity: '♢♢♢', probability: 20 },
  { rarity: '♢♢♢♢', probability: 6.664 },
  { rarity: '☆', probability: 10.288 },
  { rarity: '☆☆', probability: 2 },
  { rarity: '☆☆☆', probability: 0.888 },
  { rarity: '♛', probability: 0.16 },
];

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
    selectBoosterPack(pack: string) {
      this.selectedCards = [];
      console.log(`Selected booster pack: ${pack}`);
      // filter cards by pack
      const cardsByPack = this.getCardsByPack(pack);
      // Select first three cards
      const cards1to3Options = this.getCardsByRarity('♢', cardsByPack);
      const cards1to3 = this.getRandomCards(3, cards1to3Options);
      this.selectedCards.push(...cards1to3);
      // Select fourth card
      const fourthCardRarity = this.selectRarity(rarityProbabilities4th);
      const fourthCardOptions = this.getCardsByRarity(fourthCardRarity, cardsByPack);
      const fourthCard = this.getRandomCards(1, fourthCardOptions);
      this.selectedCards.push(fourthCard[0]);
      //Select fifth card
      const fifthCardRarity = this.selectRarity(rarityProbabilities5th);
      const fifthCardOptions = this.getCardsByRarity(fifthCardRarity, cardsByPack);
      const fifthCard = this.getRandomCards(1, fifthCardOptions);
      this.selectedCards.push(fifthCard[0]);


      // // Select 5 random cards
      // this.selectedCards = this.getRandomCards(5, cardsByPack);
      // Open the modal to display selected cards
      this.dialog = true;
    },
    selectRarity(probabilities: { rarity: string; probability: number }[]): string {
      const rand = Math.random() * 100;
      let cumulative = 0;

      for (const { rarity, probability } of probabilities) {
        cumulative += probability;
        if (rand < cumulative) {
          return rarity;
        }
      }

      // Fallback in case of rounding errors
      return probabilities[probabilities.length - 1].rarity;
    },
    getCardsByPack(pack: string): Card[]{
      return cardsData.filter((card) => card.Pack === pack || card.Pack === 'All');
    },
    getCardsByRarity(rarity: string, cards: Card[]){
      return cards.filter((card) => card.Rarity === rarity)
    },
    getRandomCards(count: number, cards: Card[]): Card[] {
      // Fisher-Yates Shuffle for uniform randomness
      const shuffled = [...cards] as Card[];
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
