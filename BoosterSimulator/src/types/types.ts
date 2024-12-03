export interface Card {
    uniqueId: number;
    cardId: string;
    card: string;
    pack: string;
    rarity: string;
    cards1to3: string;
    fourthcard: string;
    fifthcard: string;
    imageUrl: string;
  }

export interface UserProgress {
    packsOpened: Dictionary<string>,
    
}

export interface Dictionary<T> {
    [Key: number]: T;
}