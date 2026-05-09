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

    // Use current window location for socket if not localhost
    const socketUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : window.location.origin;

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket');
      newSocket.emit('join_game', '1234', { name: userData.name });
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
    setIsJoined(true); // Switch UI immediately
    if (socket && socket.connected) {
      socket.emit('join_game', roomId, { name });
    } else {
      // Mock data if socket is not connected
      setGameState(prev => ({
        ...prev,
        players: [
          { id: 'me', name: name || 'أنت', cards: [
            { suit: 'HEARTS', rank: 'ACE' },
            { suit: 'SPADES', rank: '10' },
            { suit: 'CLUBS', rank: 'JACK' },
            { suit: 'DIAMONDS', rank: '9' },
            { suit: 'HEARTS', rank: 'KING' },
          ], team: 0 },
          { id: '2', name: 'خالد (بوت)', cards: [], team: 1 },
          { id: '3', name: 'فهد (بوت)', cards: [], team: 0 },
          { id: '4', name: 'سلطان (بوت)', cards: [], team: 1 },
        ],
        status: 'PLAYING'
      }));
    }
  };

  const handlePlayCard = (card: Card) => {
    if (socket) {
      socket.emit('play_card', '1234', card); // Hardcoded roomId for now
    }
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-primary relative flex items-center justify-center p-8 overflow-hidden">
        {/* Background stripes for texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-[repeating-linear-gradient(45deg,_#000,_#000_100px,_transparent_100px,_transparent_200px)]"></div>
        </div>
        <Lobby onJoin={handleJoin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#064e3b] flex flex-col items-center justify-start p-4 md:p-8 relative overflow-x-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>

      <div className="w-full max-w-6xl z-10 flex flex-col gap-6">
        {/* Header Stats */}
        <div className="flex justify-between items-center bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex flex-col items-center">
            <span className="text-white/60 text-xs mb-1">فريقنا</span>
            <span className="text-secondary text-2xl font-black">{gameState.scores[0]}</span>
          </div>
          <div className="text-center">
            <h2 className="text-secondary font-black text-xl mb-1">أبو هذال</h2>
            <div className="px-4 py-1 bg-white/10 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest">
              {gameState.status}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white/60 text-xs mb-1">فريقهم</span>
            <span className="text-secondary text-2xl font-black">{gameState.scores[1]}</span>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-3 w-full">
            <GameBoard 
              players={gameState.players}
              tableCards={gameState.tableCards}
              currentPlayerId={socket?.id || 'me'}
            />
          </div>
          
          <div className="w-full lg:col-span-1 h-full">
            <Chat />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-4 justify-center mt-4">
          <button className="btn-primary shadow-[0_0_20px_rgba(212,175,55,0.3)]">صن</button>
          <button className="bg-primary-dark text-white border-2 border-secondary font-bold py-2 px-8 rounded-full hover:bg-secondary hover:text-primary-dark transition-all">حكم</button>
          <button className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 font-bold py-2 px-8 rounded-full transition-all">بس</button>
        </div>
      </div>
    </div>
  );
}
