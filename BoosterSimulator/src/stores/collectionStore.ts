// src/stores/collectionStore.ts
import { defineStore } from 'pinia';
import type { Card } from '@/types/types';

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    collectionCards: [] as Card[],
  }),
  actions: {
    addCard(newCard: Card) {
      const exists = this.collectionCards.some(
        (card) => card.cardId === newCard.cardId
      );
      if (!exists) {
        this.collectionCards.push(newCard);
        this.saveCollection();
      }
    },
    // Optional: Load collection from localStorage
    loadCollection() {
        const stored = localStorage.getItem('playerCollection');
        if (stored) {
          try {
            this.collectionCards = JSON.parse(stored);
          } catch (error) {
            console.error('Failed to parse collection from localStorage:', error);
          }
        }
      },
      saveCollection() {
        localStorage.setItem(
          'playerCollection',
          JSON.stringify(this.collectionCards)
        );
      },
    },
});
