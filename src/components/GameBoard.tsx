'use client';

import React from 'react';
import { Card, Player } from '@/types/game';
import { motion, AnimatePresence } from 'framer-motion';

interface GameBoardProps {
  players: Player[];
  tableCards: { card: Card; playerId: string }[];
  currentPlayerId: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({ players, tableCards, currentPlayerId }) => {
  const displayPlayers = players.length > 0 ? players : [
    { id: '1', name: 'أنت', cards: [], team: 0 },
    { id: '2', name: 'خالد', cards: [], team: 1 },
    { id: '3', name: 'فهد', cards: [], team: 0 },
    { id: '4', name: 'سلطان', cards: [], team: 1 },
  ] as Player[];

  const myIndex = displayPlayers.findIndex(p => p.id === currentPlayerId);
  const safeMyIndex = myIndex === -1 ? 0 : myIndex;
  const rotatedPlayers = [...displayPlayers.slice(safeMyIndex), ...displayPlayers.slice(0, safeMyIndex)];

  const positions = ['bottom', 'left', 'top', 'right'];

  return (
    <div className="relative w-full h-[500px] md:h-[650px] bg-[#0f3d24] rounded-[50px] md:rounded-[100px] border-[12px] border-[#081c15] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
      {/* The Felt Table Surface */}
      <div className="absolute inset-4 md:inset-8 border-2 border-white/10 rounded-[40px] md:rounded-[80px] bg-gradient-to-b from-white/5 to-transparent"></div>

      {/* Players */}
      {rotatedPlayers.map((player, i) => (
        <div 
          key={player.id}
          className={`absolute flex flex-col items-center gap-2 ${
            positions[i] === 'bottom' ? 'bottom-8' :
            positions[i] === 'top' ? 'top-8' :
            positions[i] === 'left' ? 'left-8 rotate-90' : 'right-8 -rotate-90'
          }`}
        >
          <div className="w-16 h-16 bg-secondary rounded-full border-4 border-primary shadow-lg flex items-center justify-center text-primary-dark font-black text-xl">
            {player.name[0].toUpperCase()}
          </div>
          <span className="text-white font-bold drop-shadow-md">{player.name}</span>
          
          {/* Player Cards (Hand) */}
          {positions[i] === 'bottom' && (
            <div className="flex gap-1 mt-4">
              {player.cards.map((card, idx) => (
                <CardComponent key={idx} card={card} />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Table Cards (Played) */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <AnimatePresence>
          {tableCards.map((played, idx) => (
            <motion.div
              key={`${played.playerId}-${idx}`}
              initial={{ scale: 0, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="absolute"
            >
              <CardComponent card={played.card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CardComponent = ({ card }: { card: Card }) => {
  const isRed = card.suit === 'HEARTS' || card.suit === 'DIAMONDS';
  const suitSymbols: Record<string, string> = {
    SPADES: '♠', HEARTS: '♥', DIAMONDS: '♦', CLUBS: '♣'
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="w-16 h-24 bg-white rounded-lg shadow-md flex flex-col items-center justify-between p-2 cursor-pointer border border-gray-200 select-none"
    >
      <div className={`self-start text-lg font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
        {card.rank}
      </div>
      <div className={`text-3xl ${isRed ? 'text-red-600' : 'text-black'}`}>
        {suitSymbols[card.suit]}
      </div>
      <div className={`self-end text-lg font-bold rotate-180 ${isRed ? 'text-red-600' : 'text-black'}`}>
        {card.rank}
      </div>
    </motion.div>
  );
};
