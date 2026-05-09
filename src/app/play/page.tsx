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
    <div className="min-h-screen bg-[#1a4d2e] flex flex-col items-center justify-start p-2 md:p-8">
      {/* Heavy texture background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="w-full max-w-7xl z-10 flex flex-col gap-4">
        {/* Modern Score Bar */}
        <div className="flex justify-between items-center bg-black/50 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center bg-white/5 px-4 py-1 rounded-xl">
              <span className="text-white/40 text-[10px] font-bold">فريقنا</span>
              <span className="text-secondary text-2xl font-black leading-none">{gameState.scores[0]}</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-secondary font-black text-2xl tracking-tighter">أبو هذال</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-white/80 text-[10px] font-bold uppercase">{gameState.status}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center bg-white/5 px-4 py-1 rounded-xl">
              <span className="text-white/40 text-[10px] font-bold">فريقهم</span>
              <span className="text-secondary text-2xl font-black leading-none">{gameState.scores[1]}</span>
            </div>
          </div>
        </div>

        {/* Game Layout Container */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-[3]">
            <GameBoard 
              players={gameState.players}
              tableCards={gameState.tableCards}
              currentPlayerId={socket?.id || 'me'}
            />
          </div>
          
          <div className="flex-[1] h-[400px] lg:h-auto min-h-[400px]">
            <Chat />
          </div>
        </div>

        {/* Control Panel */}
        <div className="flex gap-4 justify-center bg-black/30 p-4 rounded-full backdrop-blur-md border border-white/5">
          <button className="bg-secondary text-primary-dark font-black px-10 py-3 rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95">صن</button>
          <button className="bg-white/10 text-white font-black px-10 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all">حكم</button>
          <button className="bg-red-500/10 text-red-500 font-black px-10 py-3 rounded-full border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">بس</button>
        </div>
      </div>
    </div>
  );
}
