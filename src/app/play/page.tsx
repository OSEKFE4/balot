'use client';

import React, { useState, useEffect } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { Lobby } from '@/components/Lobby';
import { Chat } from '@/components/Chat';
import { Card, Player, GameState } from '@/types/game';
import { io, Socket } from 'socket.io-client';

export default function PlayPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentTurn: 0,
    dealer: 0,
    deck: [],
    tableCards: [],
    scores: [0, 0],
    status: 'WAITING'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const userData = savedUser ? JSON.parse(savedUser) : { name: 'لاعب' };

    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_game', '1234', { name: userData.name });
      setIsJoined(true);
    });

    newSocket.on('game_update', (updatedState: GameState) => {
      setGameState(updatedState);
    });

    newSocket.on('card_played', (data: { card: Card; playerId: string }) => {
      setGameState(prev => ({
        ...prev,
        tableCards: [...prev.tableCards, data]
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleJoin = (name: string, roomId: string) => {
    if (socket) {
      socket.emit('join_game', roomId, { name });
      setIsJoined(true);
    }
  };

  const handlePlayCard = (card: Card) => {
    if (socket) {
      socket.emit('play_card', '1234', card); // Hardcoded roomId for now
    }
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-8">
        <Lobby onJoin={handleJoin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8 text-white">
          <div className="bg-black/20 px-6 py-2 rounded-full font-bold">
            الفريق 1: <span className="text-secondary">{gameState.scores[0]}</span>
          </div>
          <h2 className="text-2xl font-black text-secondary">طاولة: {gameState.status}</h2>
          <div className="bg-black/20 px-6 py-2 rounded-full font-bold">
            الفريق 2: <span className="text-secondary">{gameState.scores[1]}</span>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          <div className="flex-1">
            <GameBoard 
              players={gameState.players}
              tableCards={gameState.tableCards}
              currentPlayerId={socket?.id || ''}
            />
          </div>
          <Chat />
        </div>

        {gameState.status === 'BIDDING' && (
          <div className="mt-8 flex gap-4 justify-center">
            <button className="btn-primary">صن</button>
            <button className="btn-primary bg-primary-dark text-white border-2 border-secondary">حكم</button>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded-full">بس</button>
          </div>
        )}
      </div>
    </div>
  );
}
