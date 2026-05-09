export type CardSuit = 'SPADES' | 'HEARTS' | 'DIAMONDS' | 'CLUBS';
export type CardRank = '7' | '8' | '9' | '10' | 'JACK' | 'QUEEN' | 'KING' | 'ACE';

export interface Card {
  suit: CardSuit;
  rank: CardRank;
}

export type GameType = 'SUN' | 'HUKM';

export interface Player {
  id: string;
  name: string;
  cards: Card[];
  team: 0 | 1;
}

export interface GameState {
  players: Player[];
  currentTurn: number;
  dealer: number;
  deck: Card[];
  tableCards: { card: Card; playerId: string }[];
  scores: [number, number];
  type?: GameType;
  trumpSuit?: CardSuit;
  status: 'WAITING' | 'DEALING' | 'BIDDING' | 'PLAYING' | 'FINISHED';
}
