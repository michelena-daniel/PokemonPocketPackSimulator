<template>
  <v-container>
    <!-- Title Section -->
    <v-row justify="center" class="my-8">
      <v-col cols="12" class="d-flex justify-center">
        <v-card
          class="title-card"
          outlined
        >
          <v-card-title class="text-center text-white">
            <span class="title-text">
              Pokemon TCG Pocket Booster Simulator
            </span>
          </v-card-title>
        </v-card>
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

    <!-- Modal Section -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="text-center">Your Booster Pack Cards</v-card-title>
        <v-card-text>
          <div class="cards">
            <div
              v-for="(card) in selectedCards"
              :key="card.uniqueId"
              class="card-container"
              :class="{ flipped: flippedStates[card.uniqueId] }"
              @click="flipCard(card.uniqueId)"
            >
              <!-- Card Front (Face Down) -->
              <div class="card-front">
                <img
                  src="@/assets/Images/facedown.png"
                  alt="Card Back"
                  class="card-image"
                />
              </div>

              <!-- Card Back (Revealed Content) -->
              <div class="card-back">
                <img
                  :src="card.imageUrl"
                  alt="Card"
                  class="card-image"
                />
                <h3>{{ card.card }}</h3>
                <p>Rarity: {{ card.rarity }}</p>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import cardsData from '@/data/cards.json';
import { useCollectionStore } from '@/stores/collectionStore';

import boosterPack1 from '@/assets/Images/genetic-apex-mewtwo-booster.png';
import boosterPack2 from '@/assets/Images/genetic-apex-charizard-booster.png';
import boosterPack3 from '@/assets/Images/genetic-apex-pikachu-booster.png';

interface Card {
  cardId: string;
  card: string;
  pack: string;
  rarity: string;
  cards1to3: string;
  fourthcard: string;
  fifthcard: string;
  imageUrl: string;
}

interface SelectedCard extends Card {
  uniqueId: number;
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
      selectedCards: [] as SelectedCard[],
      dialog: false,
      loading: false,
      flippedStates: {} as Record<number, boolean>,
      nextUniqueId: 1
    };
  },
  methods: {
    selectBoosterPack(pack: string) {
      this.selectedCards = [];
      this.dialog = false;

      console.log(`Selected booster pack: ${pack}`);

      // filter cards by pack
      const cardsByPack = this.getCardsByPack(pack);
      // Select first three cards
      const cards1to3Options = this.getCardsByRarity('♢', cardsByPack);
      const cards1to3 = this.getRandomCards(3, cards1to3Options);
      const mappedCards1to3 = this.mapCardsToSelected(cards1to3);
      this.selectedCards.push(...mappedCards1to3);
      // Select fourth card
      const fourthCardRarity = this.selectRarity(rarityProbabilities4th);
      const fourthCardOptions = this.getCardsByRarity(fourthCardRarity, cardsByPack);
      const fourthCard = this.getRandomCards(1, fourthCardOptions);
      const mappedFourthCard = this.mapCardsToSelected(fourthCard);
      this.selectedCards.push(mappedFourthCard[0]);
      //Select fifth card
      const fifthCardRarity = this.selectRarity(rarityProbabilities5th);
      const fifthCardOptions = this.getCardsByRarity(fifthCardRarity, cardsByPack);
      const fifthCard = this.getRandomCards(1, fifthCardOptions);
      const mappedFifthCard = this.mapCardsToSelected(fifthCard);
      this.selectedCards.push(mappedFifthCard[0]);
      // Add unique cards to the collection
      const collectionStore = useCollectionStore();
      this.selectedCards.forEach((card) => {
        collectionStore.addCard(card);
      });
      // Initialize flippedStates for the selected cards
      this.flippedStates = this.selectedCards.reduce((acc, card) => {
        acc[card.cardId] = false;
        return acc;
      }, {} as Record<string, boolean>);

      // Open the modal to display selected cards
      this.preloadImages(this.selectedCards.map(card => card.imageUrl))
        .then(() => {
          this.dialog = true;
        })
        .catch((error: string) => {
          console.error('Error loading images:', error);
        });      
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
      return cardsData.filter((card) => card.pack === pack || card.pack === 'All');
    },
    getCardsByRarity(rarity: string, cards: Card[]){
      return cards.filter((card) => card.rarity === rarity)
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
    mapCardsToSelected(cards: Card[]) {
      return cards.map(card => ({
          ...card,
          uniqueId: this.nextUniqueId++,
      }));
    },
    flipCard(uniqueId: number) {
      this.flippedStates[uniqueId] = !this.flippedStates[uniqueId];
    },
    preloadImages(imageUrls: string[]) {
      const promises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      return Promise.all(promises);
    }
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
  padding-bottom: 140%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title-card {
  background: linear-gradient(135deg, #ff9800, #ff5722);
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

.card-container {
  perspective: 1000px;
  width: 200px;
  height: 300px;
  position: relative;
  transform-style: preserve-3d;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.6s;
}

.card-front {
  transform: rotateY(0deg);
  z-index: 2;
}

.card-back {
  transform: rotateY(-180deg);
  z-index: 1;
}

.card-container.flipped .card-front {
  transform: rotateY(180deg);
}

.card-container.flipped .card-back {
  transform: rotateY(0deg);
}
</style>
