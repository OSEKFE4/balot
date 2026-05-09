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
    <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">
      {/* Sadu Carpet In Center */}
      <div className="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] bg-[#8b0000] rounded-xl shadow-2xl flex items-center justify-center overflow-hidden border-[8px] border-[#d4af37]/20">
         <div className="w-full h-full opacity-40 bg-[repeating-linear-gradient(0deg,_#000,_#000_5px,_#8b0000_5px,_#8b0000_10px)]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
         <div className="z-10 bg-white/95 px-6 py-2 rounded-lg shadow-xl border border-black/10">
            <span className="text-[#1a4d2e] font-black text-lg md:text-xl">استوى الورق</span>
         </div>
      </div>
      {rotatedPlayers.map((player, i) => (
        <div 
          key={player.id}
          className={`absolute flex flex-col items-center gap-1 ${
            positions[i] === 'bottom' ? 'bottom-2 w-full' :
            positions[i] === 'top' ? 'top-2' :
            positions[i] === 'left' ? 'left-2 -rotate-90 origin-center' : 'right-2 rotate-90 origin-center'
          }`}
        >
          {/* Avatar and Info */}
          <div className="flex flex-col items-center scale-75 md:scale-100">
            <div className="w-12 h-12 bg-gray-400 rounded-full border-2 border-white/50 overflow-hidden shadow-lg relative">
               <div className="absolute inset-0 bg-black/20"></div>
               <span className="absolute inset-0 flex items-center justify-center text-white font-bold">{player.name[0]}</span>
            </div>
            <div className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-white mt-1 whitespace-nowrap">
                {player.name}
            </div>
          </div>
          
          {/* Player Cards (Hand) - Only for Bottom Player */}
          {positions[i] === 'bottom' && (
            <div className="flex gap-[-10px] mt-2 justify-center w-full max-w-md px-4">
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <div key={idx} className="-ml-4 first:ml-0 transition-transform hover:-translate-y-4">
                   <CardComponent card={{ suit: 'CLUBS', rank: '9' }} />
                </div>
              ))}
            </div>
          )}

          {/* Opponent Cards (Hidden) */}
          {positions[i] !== 'bottom' && (
             <div className="flex -gap-2 scale-50 opacity-50">
                <div className="w-10 h-14 bg-[#4a4a4a] border border-white/20 rounded-md shadow-sm"></div>
                <div className="w-10 h-14 bg-[#4a4a4a] border border-white/20 rounded-md shadow-sm -ml-6"></div>
             </div>
          )}
        </div>
      ))}

      {/* Table Center (Played Cards) */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute top-0 transform -translate-y-4">
           <CardComponent card={{ suit: 'SPADES', rank: 'JACK' }} isSmall />
        </div>
        <div className="absolute right-0 transform translate-x-4">
           <CardComponent card={{ suit: 'DIAMONDS', rank: 'ACE' }} isSmall />
        </div>
        <div className="absolute bottom-0 transform translate-y-4">
           <CardComponent card={{ suit: 'CLUBS', rank: '9' }} isSmall />
        </div>
        <div className="absolute left-0 transform -translate-x-4">
           <CardComponent card={{ suit: 'HEARTS', rank: '10' }} isSmall />
        </div>
      </div>
    </div>
  );
};

const CardComponent = ({ card, isSmall }: { card: Card; isSmall?: boolean }) => {
  const isRed = card.suit === 'HEARTS' || card.suit === 'DIAMONDS';
  const suitSymbols: Record<string, string> = {
    SPADES: '♠', HEARTS: '♥', DIAMONDS: '♦', CLUBS: '♣'
  };

  return (
    <motion.div 
      className={`${isSmall ? 'w-12 h-18' : 'w-16 h-24'} bg-white rounded-lg shadow-xl flex flex-col items-center justify-between p-1.5 cursor-pointer border border-gray-300 select-none relative overflow-hidden`}
    >
      <div className={`self-start text-xs font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
        {card.rank[0]}
      </div>
      <div className={`text-xl ${isRed ? 'text-red-600' : 'text-black'}`}>
        {suitSymbols[card.suit]}
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none scale-150">
         {suitSymbols[card.suit]}
      </div>
    </motion.div>
  );
};
