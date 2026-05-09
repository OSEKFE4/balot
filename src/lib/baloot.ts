import { Card, CardRank, CardSuit, GameType } from '../types/game';

const SUITS: CardSuit[] = ['SPADES', 'HEARTS', 'DIAMONDS', 'CLUBS'];
const RANKS: CardRank[] = ['7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return shuffle(deck);
};

const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getCardValue = (card: Card, type: GameType, trumpSuit?: CardSuit): number => {
  const { rank, suit } = card;
  
  if (type === 'SUN') {
    const values: Record<CardRank, number> = {
      'ACE': 11, '10': 10, 'KING': 4, 'QUEEN': 3, 'JACK': 2, '9': 0, '8': 0, '7': 0
    };
    return values[rank];
  } else {
    // HUKM
    if (suit === trumpSuit) {
      const values: Record<CardRank, number> = {
        'JACK': 20, '9': 14, 'ACE': 11, '10': 10, 'KING': 4, 'QUEEN': 3, '8': 0, '7': 0
      };
      return values[rank];
    } else {
      const values: Record<CardRank, number> = {
        'ACE': 11, '10': 10, 'KING': 4, 'QUEEN': 3, 'JACK': 2, '9': 0, '8': 0, '7': 0
      };
      return values[rank];
export const isValidMove = (
  card: Card,
  playerHand: Card[],
  leadSuit: CardSuit | undefined,
  type: GameType,
  trumpSuit?: CardSuit
): boolean => {
  if (!leadSuit) return true; // First card of the trick

  const hasLeadSuit = playerHand.some(c => c.suit === leadSuit);
  
  if (hasLeadSuit) {
    return card.suit === leadSuit;
  }

  // If no lead suit, can play anything (simplified rules for now)
  // In Hukm, you might have to play a trump card if you have one
  if (type === 'HUKM' && trumpSuit) {
    const hasTrump = playerHand.some(c => c.suit === trumpSuit);
    if (hasTrump && card.suit !== trumpSuit && leadSuit !== trumpSuit) {
      // Must play trump if can't follow lead suit (simplified)
      // return card.suit === trumpSuit;
    }
  }

  return true;
};

export const calculateTrickWinner = (
  tableCards: { card: Card; playerId: string }[],
  type: GameType,
  trumpSuit?: CardSuit
): string => {
  const leadSuit = tableCards[0].card.suit;
  let winner = tableCards[0];
  let maxPower = getCardPower(winner.card, type, trumpSuit, leadSuit);

  for (let i = 1; i < tableCards.length; i++) {
    const power = getCardPower(tableCards[i].card, type, trumpSuit, leadSuit);
    if (power > maxPower) {
      maxPower = power;
      winner = tableCards[i];
    }
  }

  return winner.playerId;
};

export const getCardPower = (card: Card, type: GameType, trumpSuit?: CardSuit, leadSuit?: CardSuit): number => {
  const { rank, suit } = card;
  
  if (type === 'SUN') {
    const powers: Record<CardRank, number> = {
      'ACE': 8, '10': 7, 'KING': 6, 'QUEEN': 5, 'JACK': 4, '9': 3, '8': 2, '7': 1
    };
    return suit === leadSuit ? powers[rank] : -1;
  } else {
    // HUKM
    if (suit === trumpSuit) {
      const powers: Record<CardRank, number> = {
        'JACK': 16, '9': 15, 'ACE': 14, '10': 13, 'KING': 12, 'QUEEN': 11, '8': 10, '7': 9
      };
      return powers[rank];
    } else {
      const powers: Record<CardRank, number> = {
        'ACE': 8, '10': 7, 'KING': 6, 'QUEEN': 5, 'JACK': 4, '9': 3, '8': 2, '7': 1
      };
      return suit === leadSuit ? powers[rank] : -1;
    }
  }
};
